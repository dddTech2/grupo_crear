# Grupo Crear — Design System (MASTER)

> Fuente de verdad del sitio. Si existe `pages/<página>.md`, sus reglas tienen prioridad.
> Generado con ui-ux-pro-max (`--design-system --motion 8 --variance 7`) y corregido a mano:
> la paleta rosa y las fuentes Archivo/Space Grotesk que propuso la base **no aplican**;
> la marca ya tiene identidad propia, definida abajo y en `src/layouts/Layout.astro` (`:root`).

## Color

| Rol | Token | Valor |
|---|---|---|
| Fondo base (sólido) | `--bg` | `#001433` |
| Panel claro (páginas de servicio) | `--paper` | `#F6F1E7` |
| Acento sobre papel | `--n-text` | `#c23e12` |
| Superficie elevada (dialog, hover de tarjeta) | `--bg2` | `#00194a` |
| Tinta oscura (texto sobre blanco) | `--ink` | `#04102a` |
| Marca / CTA | `--n` | `#E84E1B` |
| Marca hover | `--n-d` | `#c23e12` |
| Texto principal | `--w` | `#FFFFFF` |
| Texto secundario | `--w60` | `rgba(255,255,255,.74)` (10,22:1) |
| Texto terciario | `--w40` | `rgba(255,255,255,.56)` (6,27:1) |
| Bordes y hairlines | `--w12` / `--w06` | `rgba(255,255,255,.12)` / `.06` |
| Estrellas (StarField) | — | `#FFFFFF`, `#BFD4FF`, `#FF9F70` (≈8 %) |

Reglas:
- Home: un solo fondo sólido `--bg`; las secciones se separan con hairline `--w06` y espacio.
- Páginas de servicio: la intensidad sube con la historia. Azul (confianza) → papel (lectura y claridad) → azul → papel → naranja sólido (acción). El naranja pleno se reserva para el cierre.
- Todo fondo es sólido: sin vidrio ni glow con blur en secciones nuevas.
- `--w40` no alcanza 4.5:1 sobre `--bg`: úsalo solo para labels ≥ 12 px en mayúsculas espaciadas, nunca para párrafos.
- El naranja `--n` sobre `--bg` vale para titulares y acentos; para texto pequeño usa blanco.
- **Texto sobre naranja: siempre tinta `--ink` (4,98:1).** El blanco sobre `--n` da 3,79:1 y no pasa AA. Hover de CTA: relleno blanco, no `--n-d`.
- Sobre `--paper`: texto `--ink` (16,76:1), secundario `rgba(4,16,42,.78)`, acento `--n-text` (4,67:1). `--n` sobre papel da 3,37:1: solo elementos gráficos.

## Tipografía

| Uso | Familia | Peso | Tamaño |
|---|---|---|---|
| Titulares (`h1.big`, `.lead`) | Sofia Sans Condensed | 900 | `clamp(38px, 6.5vw, 86px)`; H1 `clamp(60px, 10vw, 150px)` |
| Títulos de fila/tarjeta | Sofia Sans Condensed | 800 | `clamp(20px, 3.4vw, 46px)` |
| Cuerpo | Sofia Sans | 400–600 | 16–18 px, line-height 1.6–1.7 |

**Sin tags ni eyebrows sobre los títulos** (decisión de marca: se ven genéricos). Titulares en MAYÚSCULAS con tracking negativo (−.035em). Las palabras acento van en `<em>` naranja.

## Motion

- **Motor único:** GSAP + ScrollTrigger + Lenis (Lenis corre en `gsap.ticker`). No añadir otra librería de animación.
- **Curva de marca:** `expo.out` ≡ `cubic-bezier(.16,1,.3,1)` (`--ease`).
- **Duraciones:** micro-interacción 150–350 ms; reveal 0.9–1.1 s; scrub 0.6–1.
- **Solo** `transform`, `opacity` y `clip-path`. Nunca animar `filter: blur()`, `width`, `height`, `top`.
- **Pins:** como máximo 2 por página (home: hero y casos; servicio: 1, la Ruta).
- `prefers-reduced-motion`: sin warp, sin scrub decorativo; todo el contenido visible y estático.

### Narrativa "Misión de despegue"

| Cap. | Sección | Efecto |
|---|---|---|
| 0 Ignición | `#hero-visual` t 0→1 | Overlay sólido, el logo se abre (zoom 1→55), las estrellas se encienden |
| 1 Despegue | `#hero-visual` t 1→2 | El collage se dispersa y las estrellas entran en warp |
| 2 Órbita | `#serv` | Titular por líneas + filas en cascada |
| 3 Tripulación | `#nos` | El marco se abre (clip-path) + contadores |
| 4 Planetas | `#port` | Reveal clip-path + parallax interno de la media |
| — Navegación | `#seo` | Reveal CSS `.r` |
| 5 Aterrizaje | `#cto` | "CREAR" gigante se desliza con el scroll |

El rail "Altitude" (`#flight`) muestra el progreso y el nombre del capítulo (`data-chapter`).
Código: hero en `src/pages/index.astro`, capítulos 2–5 en `src/scripts/story.ts`, cielo en `src/components/StarField.astro`.

### Narrativa de las páginas de servicio

| Cap. | Sección | Tono | Efecto |
|---|---|---|---|
| Misión | `#sub-hero` | Azul | Promesa + imagen con reveal y parallax interno |
| Reto | `#reto` | Papel | La frase de `servicio.reto` se enciende palabra por palabra |
| Carga | `#entregables` | Azul | Qué recibe el cliente |
| Ruta | `#proceso` | Papel | Pin: el cohete recorre la línea y enciende cada paso |
| Pruebas | `#galeria-serv` | Azul | Fotos reales; la sección no existe si `fotos` está vacío |
| Flota | `#otros-serv` | Azul | Otros servicios |
| Aterrizaje | `CierreCTA` | Naranja | Clímax: WhatsApp + cotización formal |

## Componentes

- **CTA primario** `.btn-fill` / `.cta`: píldora naranja, radio 100 px; hover con relleno blanco que crece desde el centro.
- **CTA secundario** `.btn-line`: texto + subrayado `--w12`, que pasa a `--n` en hover.
- **Fila de servicio** `.srow`: grid 80 px / 1fr / auto con hairline superior; en hover se desplaza a la izquierda y el icono rota 45°.
- **Tarjeta de caso** `.proj`: radio 6 px, media cover y gradiente inferior; la flecha aparece en hover.
- **Inputs** `.fg`: label visible arriba y solo borde inferior, que en foco pasa a `--n`.

## Rendimiento (presupuesto)

- Nada de WebGL ni filtros SVG vivos a pantalla completa. El grano es un tile estático (`/grain.webp`, 7 KB).
- Canvas: DPR ≤ 1.5, 30 fps en táctil, pausa fuera de pantalla.
- Los vídeos en loop se pausan fuera de pantalla y se cargan en diferido (`data-src`).
- Objetivos: LCP < 2.5 s, INP < 200 ms, CLS < 0.1, TBT < 200 ms.

## Anti-patrones

- Alternar colores de fondo entre secciones.
- Emojis como iconos (usar SVG de trazo 1.3–1.6).
- Blur animado, parallax en texto de lectura, más de 2 pins.
- Texto `--w40` en párrafos.
