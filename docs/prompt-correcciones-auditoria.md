# Prompt — Aplicar las correcciones de la auditoría UX/UI de grupocrear

Copia todo lo que está debajo de la línea en una sesión nueva de Claude Code abierta en
`Grupo Crear/grupocrear/`.

---

Actúa como desarrollador frontend senior (Astro, GSAP, accesibilidad y rendimiento). Tu trabajo es
corregir el sitio de **Grupo Crear** según la auditoría `docs/auditoria-ux-ui-2026-11-04.md`
(nota global de 40/100) y según el PageSpeed Insights de producción del 4 nov 2026. La meta es que
los caminos de cotización funcionen y que la home sea rápida y accesible, **sin perder la narrativa
de scroll «Misión de despegue»**.

## Lee primero

1. `docs/auditoria-ux-ui-2026-11-04.md` completo. Los IDs C1–C4, A1–A9, M1–M11 y B1–B8 son tu
   backlog. Las evidencias citan archivo y línea, pero verifícalas antes de editar porque el código
   pudo moverse.
2. `design-system/grupo-crear/MASTER.md`: tokens de marca, reglas de motion y la tabla de capítulos.
3. Estos archivos, que concentran la mayoría de hallazgos:
   - `src/pages/index.astro`: timeline del hero y formulario inline.
   - `src/scripts/story.ts`: capítulos fuera del hero.
   - `src/layouts/Layout.astro`: CSS global, preloader, HUD y rail.
   - `src/components/StarField.astro`, `LogoHeroMask.astro`, `Header.astro`, `ChatWidget.astro`,
     `ContactDialog.astro`, `Footer.astro`.
   - `src/utils/gsap-config.ts`, `src/data/contacto.ts` y `src/pages/api/contacto.ts`.
4. La sección «PageSpeed Insights de producción» de abajo. Añade los IDs P1–P9 al backlog.

## PageSpeed Insights de producción (4 nov 2026, 07:41, Lighthouse 13.6)

| | Perf | FCP | LCP | TBT | CLS | SI | Accesib. | Best Pr. | SEO | Agentic |
|---|---|---|---|---|---|---|---|---|---|---|
| Móvil | **37** | 2,8 s | **5,7 s** | **16.820 ms** | 0 | 7,7 s | 92 | 96 | 100 | 1/2 |
| Escritorio | **57** | 0,4 s | 1,4 s | **23.630 ms** | 0 | 4,7 s | 92 | 96 | 100 | 1/2 |

CrUX no tiene datos de campo para el dominio; todo lo anterior es de laboratorio.

**Importante: este PSI se tomó antes de desplegar el código que auditamos.** Lo verifiqué el 4 nov:
- El HTML que se medía correspondía al commit `8c61167`: no tenía `#mission-hud`, `data-chapter` ni
  StarField, y servía `Publicidad_pantallaedificio_cocacola.webm` de 13,7 MB.
- PSI registraba `ReferenceError: prefersRM is not defined` en `index.astro`, dentro de
  `__checkAllLoaded`. El arreglo (comentario junto a la declaración de `prefersRM`) se publicó con el
  commit de la «Misión de despegue».
- Ese commit ya está en `main` y desplegado. **Vuelve a medir PSI antes de empezar** para tener la
  línea base real.
- Cabeceras: `Cache-Control: public, max-age=0` en todo, incluidos `/_astro/*` con hash y los vídeos.
  Compresión gzip, sin brotli. No hay HSTS, CSP, X-Frame-Options ni COOP. `robots.txt` y
  `sitemap-index.xml` responden 404 y no hay `rel=canonical`.

Por eso los números de PSI mezclan problemas viejos ya resueltos en local (WebGL lightfall, webm de
13,7 MB, el `ReferenceError`) con problemas que siguen vigentes. Trata la tabla como la línea base
pública, no como la del código actual.

Hallazgos de PSI que siguen vigentes en el código local o que la auditoría no cubría:

| ID | Hallazgo PSI | Qué hacer |
|---|---|---|
| P1 | TBT de 16,8 s y 23,6 s. 30 s de hilo principal en «Other», atribuidos a `index-*.js` (núcleo de GSAP): tareas de 140–450 ms seguidas hasta el segundo 21. | El ticker de GSAP, el `raf` de Lenis y el bucle del StarField no pueden correr cuando nada se anima. Duérmelos con la pestaña oculta (`visibilitychange`), con el hero fuera de pantalla (`IntersectionObserver`) y con Lenis en reposo. En móvil, el StarField a 30 fps como máximo. Comprueba que en el build local ya no queda WebGL. |
| P2 | El CSS global (`RocketCursor-*.css`, 57,5 KB, 19 KB sin usar) bloquea el render 1,28 s en móvil, y el CSS de Google Fonts otros 750 ms. | Saca de `Layout.astro` el CSS `is:global` que solo usa la home o un componente y muévelo a su componente. Inlinea el CSS crítico del primer viewport. B6 (fuentes locales) resuelve la parte de Google Fonts. |
| P3 | 65 KB de JS sin usar (41,6 KB en `gsap-config`). | `Flip` se registra en `gsap-config.ts` y nadie lo usa: quítalo. `MotionPathPlugin` solo lo usa `story.ts`: impórtalo dinámicamente ahí. |
| P4 | Reflow forzado: 137 ms en `index-*.js` y 58 ms en `gsap-config` (escritorio). | Agrupa las lecturas de layout antes de las escrituras. Crea los ScrollTrigger tras `document.fonts.ready` y llama a `ScrollTrigger.refresh()` una sola vez. |
| P5 | El elemento LCP es `rebranding_nexus.webp`, con `loading="lazy"`, sin `width`/`height` y con 2,3 s (móvil) y 5,2 s (escritorio) de *render delay*. Se sirve a 2752×1536 para huecos de 288–941 px. | Lo resuelve A1, que pone el H1 como LCP, junto con el `srcset` de A2. Además, pon `width` y `height` en todas las `<img>` del collage. |
| P6 | Animaciones no compuestas: `.online-status` (`status-pulse`, ChatWidget) y `.pulse-dot` (`pulse-glow`, `Footer.astro`), ambas con `box-shadow`. | Inclúyelas en A4: pasa el pulso a un pseudo-elemento con `transform: scale` y `opacity`. El `.pulse-dot` del footer no estaba en la auditoría. |
| P7 | Best Practices 96 por el error de consola. | Cero errores de consola en `/`, `/servicios` y el detalle. Esa condición forma parte de la verificación. |
| P8 | Cabeceras de servidor: caché `max-age=0`, gzip, sin cabeceras de seguridad. | Pon `Cache-Control: public, max-age=31536000, immutable` en `/_astro/*` y `/assets/*`, unos 30 días en medios y `no-cache` en HTML. Activa brotli. Añade HSTS, `Content-Security-Policy` con `frame-ancestors 'self'`, `X-Frame-Options`, COOP, `Referrer-Policy` y `Permissions-Policy`. Van en `deploy/nginx-grupocrear.conf`, junto con brotli. |
| P9 | SEO y Agentic: robots y sitemap en 404, sin canonical, y no hay `llms.txt`. | Va en M11. Añade `public/llms.txt` con un H1, qué vende la agencia y los enlaces a servicios y contacto. |

## Entorno (esta máquina)

- Node portable fuera del PATH. Antes de cualquier `npm`/`npx`:
  - PowerShell: `$env:PATH = "c:\Users\CrediSmart\Personal\Paginas Web\nodejs\node-v24.16.0-win-x64;$env:PATH"`
  - Git Bash: `export PATH="/c/Users/CrediSmart/Personal/Paginas Web/nodejs/node-v24.16.0-win-x64:$PATH"`
- `git` solo existe dentro de Git Bash, no en PowerShell.
- Chrome está en `C:\Program Files\Google\Chrome\Application\chrome.exe`. En Lighthouse usa
  `--chrome-flags="--headless=new --no-sandbox"` y **nunca `--disable-gpu`** en la medición
  principal, porque falsea el TBT.
- **Ya no se usa Netlify.** El adapter es `@astrojs/node` (`mode: 'standalone'`). Para servir el
  build igual que en producción usa
  `HOST=127.0.0.1 PORT=4400 node ./dist/server/entry.mjs`, o `npm run preview`. El 4321 suele
  ocuparlo el `astro dev` del usuario: no lo mates.
- **Despliegue:** cada push a `main` dispara `.github/workflows/deploy.yml`:
  1. Construye la imagen Docker (`Dockerfile`, Node 22 alpine) y la sube a GHCR.
  2. Entra al VPS por SSH y reemplaza el contenedor `grupocrear`, que escucha en `127.0.0.1:4321`.
  3. nginx hace de proxy con `deploy/nginx-grupocrear.conf`.

  Los secretos (`GEMINI_API_KEY`, `VPS_*`) viven en GitHub → Settings → Secrets. Detalle en
  `deploy/README.md`.
- La API pública de PSI (`pagespeedonline/v5`) sin clave agotó su cuota diaria el 4 nov. Para
  re-medir producción usa la web `pagespeed.web.dev` o pídeme una API key.

## Antes de tocar código: pregúntame lo que solo yo sé

Usa una sola ronda de preguntas para estos datos. No inventes valores ni dejes marcadores de posición
nuevos:
- **C1:** WhatsApp, teléfono y email reales de contacto, y las URL reales de las redes sociales (M2).
  Si no existe alguna red, se quita.
- **C3:** el proveedor para entregar los leads del formulario, y a qué correo deben llegar. Las opciones son Resend, SendGrid o SMTP; Netlify
  Forms ya no aplica. La API key va en `.env` en local y en un secreto de GitHub Actions. Añádela a la
  línea `envs:` y al `docker run -e` de `.github/workflows/deploy.yml`, como ya está hecho con
  `GEMINI_API_KEY`. Nunca va en el código.
- **M5:** cuáles cifras son ciertas: proyectos («+500» o «más de 100»), tiempo de respuesta («24 h» o «72 h»)
  y años de trayectoria («una década» o «12+»).
- **B7:** si el secreto `GEMINI_API_KEY` está creado en GitHub, porque el workflow lo inyecta al
  contenedor.

Mientras respondo, avanza con lo que no depende de esos datos.

## Orden de trabajo

### Fase 0 — Línea base
- Mide el build local actual con el mismo método de la auditoría y guarda los números. Son el «antes»
  real del código, distinto del PSI de producción.
- Mide también un perfil **sin GPU** (`--disable-gpu`), solo como aproximación a lo que ve PSI. Sus
  números van en una columna aparte y nunca sustituyen la medición principal.
- Confirma que el arreglo de `prefersRM` funciona en el build: la consola debe quedar sin errores y
  `__checkAllLoaded` debe completar la cadena.

### Fase 1 — Quick wins
Corresponden a la sección 5 de la auditoría: C4, A6, A7, A8, A9, M1, M2, M7, M9, B1, B2 y B5, más P3
y P6. Luego aplica C1 y M5 cuando tengas mis datos, y añade un chequeo de build que falle si
encuentra `000 0000` o `573000000000`.

### Fase 2 — Conversión crítica
- **C2:** el formulario inline de la home debe hacer `preventDefault` y POST a `/api/contacto`,
  reutilizando la lógica de `ContactDialog`. Debe mostrar errores por campo, estado de envío y
  confirmación, y nunca dejar datos personales en la URL.
- **C3:** el envío debe ser real con el proveedor que elija. Si falla, la API no responde 200 y el
  usuario ve un respaldo por WhatsApp.
- **B3:** mensajes de Zod 4 en español, uno por campo.

### Fase 3 — Rendimiento y motion de la home (A1–A5, M3, M4, M6, P1, P2, P4, P5)
- **A5 (reduced-motion):** con `prefers-reduced-motion: reduce` **no** se crean el pin del hero, el
  zoom 55× ni la dispersión 3D. El collage queda estático, el H1 visible y los capítulos de
  `story.ts` sin scrub, igual que ya hace su rama `MOTION_OK`.
- **P1 (TBT):** empieza por aquí, porque es lo que más pesa en la nota de PSI (TBT = 30 %). Graba una
  traza con la página quieta durante 10 s después del intro. Con nada animándose, el hilo principal
  debe quedar casi inactivo.
- **A3 (hero a unos 20 fps, objetivo ≥ 55 en escritorio):** mide antes y después de cada cambio con
  una traza de Performance. Cambios a probar, uno a la vez:
  1. Quitar o limitar `filter:url(#chromatic-aberration)` sobre `#collage-container`.
  2. Quitar el `feGaussianBlur` del trazo escalado 55×, o desactivarlo durante el zoom.
  3. Sustituir el *seek* por frame del `.webm` con alfa.
  4. Bajar el coste del StarField en móvil.

  Quédate solo con los cambios que mejoren la medición.
- **A4 + P6:** las animaciones infinitas que repintan deben pasar a transform y opacity, o pausarse
  fuera de pantalla. Son `idx-pulse` con `box-shadow`, `status-pulse` y `.btn-pulse` del chat,
  `pulse-glow` del footer y el marquee y el carrusel con `mask-image`.
- **A1, A2, P5:** el H1 o el tagline deben pintarse desde el primer frame sin esperar `load:complete`,
  y deben ser el elemento LCP en lugar de una imagen del collage. Además:
  - `preload="metadata"` en los vídeos y, en móvil, `poster` o WebP en lugar de vídeo;
  - `srcset` y `sizes` en el collage a unos 700 px, con `width` y `height` explícitos;
  - crear timelines y triggers no críticos en `requestIdleCallback`.
- **P2, P4:** CSS crítico y reflow forzado, como se describe en la tabla de PSI.
- **M3:** el intro se debe poder saltar (clic, tecla o rueda) y debe durar menos. Lenis debe quedar
  detenido durante el intro: `lenis.stop()` y luego `lenis.start()`.
- **M4:** en el primer viewport tienen que estar qué venden (gran formato, POP, branding, web) y un
  CTA «Pedir cotización». También hay que arreglar el solapamiento del tagline con «SCROLL» a 375 px
  y el viewport vacío al terminar el pin en móvil.
- **M6:** el tagline debe ir en un `sr-only` y las letras en un contenedor `aria-hidden`. Esto también
  quita el `aria-label` prohibido en el `<p>`, que hoy reprueba la auditoría de Agentic Browsing, y
  los 84 hijos que PSI cuenta en ese nodo.

### Fase 4 — Resto
M8 (targets de 44×44 y separación de 8 px), M10 (Cloudinary con `w_600,c_limit` + `srcset`), M11
(sitemap, robots, canonical, `og:image`, JSON-LD `LocalBusiness` desde `data/contacto.ts` y el
`llms.txt` de P9), B4, B6 (fuentes locales en woff2 con `preload`), B8 (renombrar `public/Servicios`
y actualizar todas sus referencias) y P8 (cabeceras). B8 es de baja prioridad, porque el build ahora
corre en Linux dentro de Docker. Las cabeceras de P8 y brotli van en `deploy/nginx-grupocrear.conf`.
Ese archivo no se aplica solo: al terminar, dime los comandos para copiarlo al VPS y recargar nginx.

Hay assets en `public/` que ningún archivo de `src/` referencia: `Meteoro_Frontal.png` (4,5 MB),
`Meteoro_Trasero.png` (1,5 MB) y `AAmeteorogrupocrear_transp.webm` (1,6 MB). No pesan en la página,
pero inflan el despliegue. Pregúntame antes de borrarlos.

## Reglas

- Por decisión del usuario se eliminaron elementos que la auditoría todavía cita. No los vuelvas a
  crear:
  - el banner CTA del footer (`.foot-cta-banner`, `.foot-btn-primary`, `.pulse-dot`);
  - todos los tags o *eyebrows* sobre los títulos: `.kick`/`#hero-kick`, `.idx` («01 — Servicios», etc.),
    `.ent-kicker` y `.cto-card-kicker`.

  Los hallazgos que dependían de ellos (parte de A4, A7 y P6) aplican solo a lo que queda.
- En `/servicios` y el detalle no existe StarField, así que nunca llega `scene:ready` y el preloader
  espera los 4,5 s del timeout. Por eso sale en consola «Preloader timeout reached». Corrígelo:
  que esas páginas marquen la escena lista de inmediato.
- Conserva la «Misión de despegue»: los 7 capítulos, el HUD, el cielo estrellado, la órbita, el
  viaje horizontal de casos y el aterrizaje. Si un hallazgo exige quitar una pieza de la narrativa,
  pregúntame antes.
- Presupuesto de motion: como máximo 2 pins (el hero y los casos en escritorio). Anima solo
  transform, opacity, clip-path y stroke-dashoffset, y nunca blur ni filter animados.
- No toques `.mcp.json` ni metas claves en el código.
- Trabaja en una rama nueva que salga de `main`, por ejemplo `fix/auditoria-ux`. Haz un commit por
  fase con mensaje en español.
- **No hagas push a `main` sin preguntarme: cada push a `main` despliega a producción.**
- Antes de pedir el merge, `npm run build` debe pasar con el mismo Node 22 del `Dockerfile`, para que
  no falle el workflow.
- Si algo no se puede corregir o medir, dilo explícitamente. No marques nada como resuelto sin
  verificarlo.

## Verificación final

1. `npm run build` limpio y `node ./dist/server/entry.mjs` en el puerto 4400.
2. Lighthouse móvil y escritorio, 3 corridas cada uno, en `/`, `/servicios` y
   `/servicios/impresion-gran-formato`. Usa la medición principal con GPU y añade la columna sin GPU.
   Objetivos en `/` móvil: Perf ≥ 75, LCP ≤ 2,5 s, TBT ≤ 600 ms. En escritorio: Perf ≥ 90. Si no se
   alcanzan, explica qué los impide.
3. axe-core en las 3 páginas, y cero errores de consola (P7).
4. Traza de fps del hero en escritorio y en móvil con CPU 4×, más la traza de reposo de P1.
5. Emulación de reduced-motion.
6. Capturas a 375, 768, 1024 y 1440 px.
7. Recorrido con teclado.
8. Envío real del formulario, el dialog y el inline.
9. Si apruebo el merge a `main`, espera a que el workflow «Deploy a VPS» termine en verde y luego corre PSI móvil y escritorio sobre `https://www.grupocrear.co/`, comprobando
   antes con `curl` que el HTML publicado ya es el nuevo (por ejemplo, que aparece `mission-hud`) y que
   las cabeceras de P8 están activas.

Al terminar, añade al final de `docs/auditoria-ux-ui-2026-11-04.md` una sección **«Re-medición
<fecha>»** que contenga:
- una tabla antes/después de cada métrica, con tres columnas de origen: local con GPU, local sin GPU
  y PSI de producción (si se desplegó);
- el estado de cada ID, incluidos P1–P9 (corregido, parcial o pendiente, con el motivo);
- la nueva nota global calculada con los mismos pesos.
