/*
 * Arranque de producción: el servidor de Astro + compresión de JS y CSS.
 *
 * El adaptador Node sirve los estáticos sin comprimir y el gzip por defecto de
 * nginx en Ubuntu solo cubre text/html, así que el JS y el CSS viajaban completos
 * (gsap: 84 KB en lugar de 31 KB). Se comprimen una vez al arrancar, en memoria;
 * nginx deja pasar las respuestas que ya traen Content-Encoding.
 */
import http from 'node:http';
import { readdirSync, readFileSync } from 'node:fs';
import { brotliCompressSync, gzipSync } from 'node:zlib';

process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('./dist/server/entry.mjs');

const TYPES = { js: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8' };
const IMMUTABLE = 'public, max-age=31536000, immutable'; // nombres con hash: nunca cambian
const MEDIA_CACHE = 'public, max-age=604800';            // nombres fijos: una semana
const MEDIA = /\.(webp|png|jpe?g|svg|ico|mp4|webm|woff2)$/i;

const assets = new Map();
for (const dir of ['_astro', 'assets']) {
  const base = new URL(`./dist/client/${dir}/`, import.meta.url);
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

const server = http.createServer((req, res) => {
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
