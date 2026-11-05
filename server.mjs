/*
 * Arranque de producción: el servidor de Astro + compresión de JS y CSS.
 *
 * El adaptador Node sirve los estáticos sin comprimir y el gzip por defecto de
 * nginx en Ubuntu solo cubre text/html, así que el JS y el CSS viajaban completos
 * (gsap: 84 KB en lugar de 31 KB). Se comprimen una vez al arrancar, en memoria;
 * nginx deja pasar las respuestas que ya traen Content-Encoding.
 */
import http from 'node:http';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { brotliCompressSync, gzipSync } from 'node:zlib';

process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('./dist/server/entry.mjs');

const TYPES = { js: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8' };
const IMMUTABLE = 'public, max-age=31536000, immutable'; // nombres con hash: nunca cambian
const MEDIA_CACHE = 'public, max-age=31536000';          // nombres fijos: un año. Si cambias un archivo, cámbiale el nombre
const MEDIA = /\.(webp|png|jpe?g|svg|ico|mp4|webm|woff2)$/i;

const assets = new Map();
for (const dir of ['_astro', 'assets']) {
  const base = new URL(`./dist/client/${dir}/`, import.meta.url);
  if (!existsSync(base)) continue; // con el CSS en línea, assets/ puede no existir
  for (const name of readdirSync(base)) {
    const type = TYPES[name.split('.').pop()];
    if (!type) continue;
    const raw = readFileSync(new URL(encodeURIComponent(name), base));
    assets.set(`/${dir}/${encodeURI(name)}`, { type, raw, br: brotliCompressSync(raw), gzip: gzipSync(raw, { level: 9 }) });
  }
}

// Crédito N&O del footer: nombre fijo, así que no puede ser immutable.
const credit = readFileSync(new URL('./dist/client/nyo-credit.js', import.meta.url));
assets.set('/nyo-credit.js', { type: TYPES.js, raw: credit, br: brotliCompressSync(credit), gzip: gzipSync(credit, { level: 9 }), cache: MEDIA_CACHE });

// CSP con el hash de cada script en línea de las páginas prerenderizadas: sin 'unsafe-inline' en scripts.
// Los estilos sí lo necesitan por los atributos style="" del marcado.
const inlineHashes = new Set();
for (const entry of readdirSync(new URL('./dist/client/', import.meta.url), { recursive: true })) {
  if (!entry.endsWith('.html')) continue;
  const html = readFileSync(new URL(`./dist/client/${entry.replaceAll('\\', '/')}`, import.meta.url), 'utf8');
  for (const [, code] of html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    inlineHashes.add(`'sha256-${createHash('sha256').update(code).digest('base64')}'`);
  }
}
const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    `script-src 'self' ${[...inlineHashes].join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://res.cloudinary.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; '),
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=604800', // primera etapa: subir a 1 año cuando lleve un tiempo estable
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
};

const server = http.createServer((req, res) => {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) res.setHeader(name, value);
  const path = (req.url ?? '/').split('?')[0];
  const asset = (req.method === 'GET' || req.method === 'HEAD') && assets.get(path);

  if (asset) {
    const accepts = req.headers['accept-encoding'] ?? '';
    const encoding = /\bbr\b/.test(accepts) ? 'br' : /\bgzip\b/.test(accepts) ? 'gzip' : null;
    const body = encoding ? asset[encoding] : asset.raw;
    res.writeHead(200, {
      'Content-Type': asset.type,
      'Content-Length': body.length,
      'Cache-Control': asset.cache ?? IMMUTABLE,
      Vary: 'Accept-Encoding',
      ...(encoding && { 'Content-Encoding': encoding }),
    });
    res.end(req.method === 'HEAD' ? undefined : body);
    return;
  }

  if (MEDIA.test(path)) res.setHeader('Cache-Control', MEDIA_CACHE);
  handler(req, res);
});

server.listen(Number(process.env.PORT ?? 4321), process.env.HOST ?? '0.0.0.0', () => {
  console.log(`Grupo Crear en :${server.address().port} (${assets.size} assets comprimidos)`);
});
