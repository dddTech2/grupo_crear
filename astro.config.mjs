// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

/*
 * Astro 6: output 'hybrid' fue eliminado. El modo 'static' (default)
 * ahora tiene el mismo comportamiento: todas las páginas son SSG salvo
 * las rutas que declaran `export const prerender = false` (como la API
 * de contacto), que se ejecutan en el servidor.
 *
 * PRODUCCIÓN: adapter Node standalone → Docker en VPS (ver deploy/README.md).
 *   Vercel  → npm i @astrojs/vercel   → import vercel  from '@astrojs/vercel'
 *   Netlify → npm i @astrojs/netlify  → import netlify from '@astrojs/netlify'
 *   Node.js → npm i @astrojs/node     → import node    from '@astrojs/node'
 */
export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  devToolbar: { enabled: false },

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Elimina el polyfill inline que Vite inyecta para <link rel="modulepreload">.
      // Todos los navegadores modernos (Chrome 66+, Firefox 115+, Safari 17+)
      // soportan modulepreload de forma nativa. Sin este polyfill inline, el
      // script-src del CSP sólo necesita 'self' — sin hashes ni 'unsafe-inline'.
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          // Mejora la granularidad del cache busting
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  },
});
