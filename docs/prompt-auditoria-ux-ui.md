# Prompt — Auditoría integral UX/UI de grupocrear (home + servicios)

Copia todo lo que está debajo de la línea en una sesión nueva de Claude Code abierta en
`Grupo Crear/grupocrear/`.

---

Actúa como auditor senior de UX/UI, accesibilidad y rendimiento web. Vas a medir el sitio de
**Grupo Crear**, una agencia de publicidad de Bogotá. Su público son gerentes y dueños de pymes
B2B que llegan buscando impresión de gran formato, branding, POP o web, y la meta de negocio es
que pidan una cotización. Mide con datos reales y no opines sin evidencia: cada hallazgo debe
citar una medición, una captura o un archivo y línea.

## Contexto técnico (léelo antes de medir)

- Stack: Astro 6 (SSG + adaptador `@astrojs/node` standalone, Docker en VPS), Tailwind 4, GSAP 3 + ScrollTrigger, Lenis.
- Node portable fuera del PATH. Antes de cualquier `npm`/`npx`:
  `$env:PATH = "c:\Users\CrediSmart\Personal\Paginas Web\nodejs\node-v24.16.0-win-x64;$env:PATH"`
- Chrome: `C:\Program Files\Google\Chrome\Application\chrome.exe` (pásalo como `$env:CHROME_PATH`).
- **Lighthouse: usa SIEMPRE `--chrome-flags="--headless=new --no-sandbox"` y NUNCA `--disable-gpu`.**
  Con GPU deshabilitada el TBT se infla de 0 ms a más de 20 s y la medición queda falseada.
- La home tiene una narrativa de scroll, la "Misión de despegue", documentada en
  `design-system/grupo-crear/MASTER.md`:
  - Hero pinneado al 160 % (`src/pages/index.astro`).
  - Cielo estrellado en canvas 2D (`src/components/StarField.astro`).
  - Capítulos 2–5 (`src/scripts/story.ts`).
  - Rail "Altitude" (`src/layouts/Layout.astro`).
  - Preloader + intro de unos 4 s antes de habilitar el scroll.
- Mide sobre el **build de producción** (`npm run build` y luego `npm run preview`), no sobre `astro dev`.

## Páginas a auditar

1. `/` (home)
2. `/servicios`
3. Una página de detalle: `/servicios/impresion-gran-formato`

## Qué medir

### 1. Rendimiento y Core Web Vitals (peso 25 %)

- Lighthouse móvil (emulación por defecto) y escritorio (`--preset=desktop`), **3 corridas cada uno**.
  Reporta la mediana de: Performance, LCP, FCP, TBT, CLS y Speed Index.
- INP: no sale en Lighthouse de laboratorio. Mídelo con una traza de Performance (CDP o
  `web-vitals` inyectado) haciendo clic en el burger, en "Cotizar", en los campos del formulario y en el chat.
- **Fluidez del scroll:** graba una traza de Performance mientras haces scroll completo de la home
  con Lenis (rueda simulada, no `scrollTo` inmediato). Reporta:
  - fps promedio y percentil 5 durante el hero pinneado y durante el resto;
  - long tasks (> 50 ms): cuántas hay y en qué fase;
  - tiempo de *paint* y *composite* por frame en el hero.
- Peso de la página: total transferido, JS (por chunk), vídeos, imágenes y fuentes. Revisa si hay
  medios sin carga diferida o servidos a un tamaño mayor que el que se muestra.
- Objetivos: LCP < 2.5 s, INP < 200 ms, CLS < 0.1, TBT < 200 ms, ≥ 55 fps en el hero en escritorio.

### 2. Accesibilidad — WCAG 2.2 AA (peso 25 %)

- axe-core (via `@axe-core/cli` o inyectado con CDP) en las 3 páginas. Lista cada violación con
  selector y regla.
- Contraste: verifica texto `--w60` y `--w40` sobre `#001433`, el naranja `#E84E1B` en texto
  pequeño y el texto sobre vídeo e imágenes del portafolio.
- Teclado: recorre la home solo con Tab/Shift+Tab/Enter/Esc. Verifica:
  - que el foco sea visible en todo momento (el sitio usa `cursor:none` con cursor cohete);
  - el orden lógico;
  - que no haya trampas de foco en el dialog de contacto ni en el chat;
  - que exista un *skip link*.
- `prefers-reduced-motion: reduce` (emulado): no debe haber warp, scrub decorativo ni parallax, y el
  contenido debe quedar visible. Comprueba que el preloader no bloquea.
- Semántica: un solo `h1`, jerarquía H2/H3, `aria-label` en botones de solo icono, `alt` en
  imágenes con contenido, `lang="es"`, labels de formulario y anuncios `aria-live` de errores y éxito.
- Zoom al 200 % y reflow a 320 px de ancho sin scroll horizontal.

### 3. Usabilidad — heurísticas de Nielsen (peso 20 %)

Puntúa cada una de las 10 heurísticas de 0 a 4 (0 = sin problema, 4 = catástrofe de usabilidad),
con evidencia concreta del sitio:

1. Visibilidad del estado del sistema (preloader, rail Altitude, feedback del formulario)
2. Relación con el mundo real (lenguaje para pymes, términos de impresión)
3. Control y libertad (¿el usuario puede saltar la intro? ¿el scroll pinneado se siente atrapado?)
4. Consistencia y estándares (CTAs, estilos de enlaces, nav entre páginas)
5. Prevención de errores (validación del formulario)
6. Reconocer antes que recordar
7. Flexibilidad y eficiencia (atajos a cotizar: header, WhatsApp, chat, formulario)
8. Estética y diseño minimalista (¿el motion compite con el mensaje?)
9. Ayuda para reconocer y recuperarse de errores
10. Ayuda y documentación (FAQ, chat)

Además:
- Targets táctiles ≥ 44×44 px y separación ≥ 8 px. Revisa en especial el burger, los botones
  flotantes de chat y WhatsApp y su solapamiento con el contenido y el rail.
- Responsive en 375, 768, 1024 y 1440 px: captura cada breakpoint de cada página y señala
  desbordes, cortes de texto (p. ej. el tagline del hero en móvil) y elementos tapados.
- Legibilidad: longitud de línea (45–75 caracteres), tamaño base ≥ 16 px y line-height ≥ 1.5.

### 4. Motion UX (peso 15 %)

- ¿Cada animación transmite significado (jerarquía, continuidad, progreso) o es decorativa?
- Duraciones y easing coherentes con el MASTER (`expo.out`, 150–350 ms en micro-interacciones).
- Tiempo hasta que el usuario puede leer el primer mensaje de valor y hacer scroll (intro + preloader).
- El pin del hero (160 % de scroll): ¿se entiende que hay que seguir bajando? ¿hay *scroll-jacking* molesto?
- Scroll hacia atrás: ¿todo se restaura sin saltos ni estados rotos?
- Riesgo vestibular: warp de estrellas, zoom 55× del logo, aberración cromática.

### 5. Conversión y contenido (peso 15 %)

- Visibilidad del CTA principal en el primer viewport y a lo largo del scroll.
- Fricción del formulario: número de campos, obligatorios, mensajes de error, estado de envío y
  confirmación (envía uno de prueba si el endpoint lo permite; si no, solo valida la UI).
- Claridad de la propuesta de valor en los primeros 5 s (sin leer el H1 del segundo fold, ¿queda claro qué venden?).
- Prueba social: casos, marcas, cifras. ¿Son creíbles y verificables?
- SEO on-page básico: title, meta description, OG, H1 único, URLs semánticas, datos estructurados
  (LocalBusiness) e indexabilidad del texto que se anima letra por letra.

## Formato de entrega

Escribe el informe en `docs/auditoria-ux-ui-<AAAA-MM-DD>.md` con esta estructura:

1. **Resumen ejecutivo** (5 líneas): nota global 0–100 y los 3 problemas que más cuestan conversión.
2. **Tabla de puntuación** por categoría (puntuación 0–100, peso y aporte ponderado) y la nota global.
3. **Métricas crudas**: tabla con los valores medidos frente al objetivo, en móvil y escritorio.
4. **Hallazgos priorizados**: tabla con columnas
   `ID | Severidad (Crítico/Alto/Medio/Bajo) | Categoría | Página | Evidencia (medición, captura o archivo:línea) | Impacto en el usuario | Corrección propuesta | Esfuerzo (S/M/L)`.
5. **Quick wins**: correcciones de menos de 1 hora con impacto alto.
6. **Capturas** de cada breakpoint y de los problemas visuales, guardadas en `docs/auditoria-capturas/`.

Reglas:
- No modifiques código del sitio durante la auditoría; solo mide y documenta.
- Si una medición falla o no se puede hacer, dilo explícitamente y no inventes el valor.
- Distingue los problemas medidos de las hipótesis.
