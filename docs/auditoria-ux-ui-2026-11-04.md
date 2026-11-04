# Auditoría UX/UI, accesibilidad y rendimiento — Grupo Crear

**Fecha:** 2026-11-04 · **Build medido:** `npm run build` de las 00:53 (Astro 6 + adaptador Netlify) · **Páginas:** `/`, `/servicios`, `/servicios/impresion-gran-formato`

Convención: **[M]** = medido (cifra, captura o resultado de herramienta) · **[C]** = comprobado leyendo el código · **[H]** = hipótesis, pendiente de verificar.

---

## 1. Resumen ejecutivo

**Nota global: 40/100.** El sitio tiene una identidad visual fuerte y una base técnica sana (CLS ≈ 0, JS ligero de unos 62 KB, sin scroll horizontal hasta 320 px), pero hoy **casi ningún camino de cotización llega a Grupo Crear**. Los 3 problemas que más conversión cuestan:
1. **Ningún canal entrega el lead.** El WhatsApp y el teléfono son marcadores de posición (`573000000000`, `(601) 000 0000`). El formulario de la home no tiene manejador y hace un GET que deja los datos personales en la URL. `/api/contacto` responde «¡Gracias!» pero no envía nada.
2. **En móvil no hay navegación:** el burger no abre el menú (≤ 768 px). Además, en `/servicios` y en el detalle, el CTA «Iniciar cotización» del footer apunta a un ancla que no existe.
3. **La home móvil es lenta y tarda en decir qué vende:** LCP de 4,6 s, TBT de 1,2 s y 4,5 MB antes del primer scroll (4,0 MB de vídeo). El mensaje y el scroll se liberan a los 6,4–6,7 s en escritorio y a los 11–12,5 s con CPU 4×, y el hero va a unos 20 fps en escritorio.

## 2. Puntuación

| Categoría | Puntuación (0–100) | Peso | Aporte |
|---|---|---|---|
| Rendimiento y Core Web Vitals | 42 | 25 % | 10,5 |
| Accesibilidad (WCAG 2.2 AA) | 48 | 25 % | 12,0 |
| Usabilidad (Nielsen + responsive) | 41 | 20 % | 8,2 |
| Motion UX | 38 | 15 % | 5,7 |
| Conversión y contenido | 22 | 15 % | 3,3 |
| **Global** | | | **≈ 40** |

Cómo se calcula cada nota:
- **Rendimiento:** escritorio aprueba en las 3 páginas. La home móvil suspende LCP y TBT, el INP móvil con CPU 4× suspende y el hero no llega ni a la mitad del objetivo de fps.
- **Accesibilidad:** reflow, `lang`, labels y foco atrapado en el dialog están bien. Fallan la navegación móvil, `reduced-motion`, el contraste de los CTA, el foco del chat y el *skip link*.
- **Usabilidad:** 70 % heurísticas (27/40 puntos de severidad) y 30 % responsive, targets y legibilidad (60).
- **Conversión:** 3 de los 4 canales de cotización están rotos, y la prueba social se contradice.

## 3. Métricas crudas

### 3.1 Lighthouse 13.6 (mediana de 3 corridas; entre corchetes, las 3 corridas)

Flags: `--headless=new --no-sandbox`, sin `--disable-gpu`. Chrome 156 en Windows 11, GPU Intel UHD (ANGLE D3D11).

| Página | Preset | Perf | LCP | FCP | TBT | CLS | Speed Index | Peso LH |
|---|---|---|---|---|---|---|---|---|
| `/` | Móvil | **52** [48, 52, 53] | **4,65 s** ❌ | 2,72 s | **1.234 ms** [1.254, 1.234, 1.018] ❌ | 0 ✅ | 5,97 s | 4.549 KB |
| `/` | Escritorio | 97 [96, 97, 97] | 1,10 s ✅ | 0,58 s | 73 ms ✅ | 0 ✅ | 1,26 s | 4.549 KB |
| `/servicios` | Móvil | 92 [92, 93, 82] | 2,26 s ✅ | 2,26 s | 158 ms [158, 88, 419] ✅ | 0 ✅ | 4,54 s | 5.253 KB |
| `/servicios` | Escritorio | 99 | 0,63 s ✅ | 0,63 s | 0 ms ✅ | 0,013 ✅ | 1,09 s | 5.864 KB |
| `/servicios/impresion-gran-formato` | Móvil | 80 [75, 80, 82] | **3,83 s** ❌ | 2,23 s | 176 ms ✅ | 0 ✅ | 4,86 s | 2.918 KB |
| `/servicios/impresion-gran-formato` | Escritorio | 94 | 1,41 s ✅ | 0,81 s | 0 ms ✅ | 0,036 ✅ | 1,41 s | 3.131 KB |

Detalle de los reportes en móvil [M]:
- **Elemento LCP de la home:** `<img src="/rebranding_nexus.webp">`, una tarjeta del collage. Su *render delay* es de 2.320 ms porque el intro lo mantiene con `opacity:0`.
- **LCP de `/servicios`:** la marca de agua «SERVICIOS», con 2.234 ms de *render delay*.
- **LCP del detalle:** el `background-image` de `.sub-frame`.
- **Long tasks de la home en móvil:** 818 ms (`index.xgxdCp6f.js`) y 683 ms (`gsap-config.Dbq4JRl3.js`). El hilo principal suma 2,7 s de *style/layout*.
- **Recursos que bloquean el render:** el CSS de Google Fonts (≈ 840 ms estimados) y `RocketCursor-*.css` (360–560 ms).
- **Ahorro estimado por imágenes:** 367 KB en `/`, 3.697 KB en `/servicios` y 2.622 KB en el detalle.
- **Lighthouse Accesibilidad:** 92 en `/`, 96 en `/servicios` y 97 en el detalle. SEO 100 y Best Practices 100 en las tres.

### 3.2 INP

Medido con `web-vitals` 6.2.3 (attribution) y Event Timing. Interacciones: burger, «Cotizar», campos del formulario, `select`, apertura y cierre del chat, y teclear en el chat. Hay 2 corridas por perfil [M].

| Perfil | INP (corrida 1 / corrida 2) | Interacción peor | Desglose (corrida 2) |
|---|---|---|---|
| Móvil 375 px, CPU 4× | **816 / 416 ms** ❌ | tap en `#ci-nombre` | input delay 244 ms · proceso 37 ms · presentación 135 ms |
| Móvil 375 px, sin throttling | 240 / 200 ms ⚠️ (límite) | tap en el burger | input 88 · proceso 2 · presentación 109 ms |
| Escritorio 1440 px | 288 / **144 ms** | clic en «Cotizar» | presentación 117 ms |

El clic en «Cotizar» no se pudo medir en móvil: el enlace nunca llega a ser visible porque el menú no abre (ver C4). El *input delay* alto en móvil coincide con frames del ticker de GSAP y Lenis que siguen corriendo con la página en reposo.

### 3.3 Fluidez del scroll en la home

Rueda simulada de 100 px cada 50 ms (Lenis activo), bajando hasta el final y subiendo de nuevo. Los fps se calculan con `requestAnimationFrame` y solo en frames con desplazamiento [M].

| Perfil | Fase | fps medio | fps p5 | Peor frame | Long tasks > 50 ms |
|---|---|---|---|---|---|
| Escritorio 1440, headless (4 corridas) | Hero pinneado | **16,2 · 27,3 · 18,9 · 20,7** (mediana ≈ 20) ❌ | 8,6 · 15 · 10 · 12 | 84–217 ms | 0 |
| Escritorio 1440, headless | Resto | 53,4 · 56,8 · 53,5 · 54,3 | 30 · 59 · 30 · 30 | 117–217 ms | 0 |
| Escritorio 1440, **Chrome con ventana** | Hero pinneado | **14,4** ❌ | 7,5 | 216 ms | — |
| Escritorio 1440, Chrome con ventana | Resto | 45,3 | 29,6 | 283 ms | — |
| Móvil 375, CPU 4× (3 corridas) | Hero pinneado | 10,3 · 11,6 · 11,8 ❌ | 6,7–7,5 | 133–183 ms | 186 (máx. 149 ms) |
| Móvil 375, CPU 4× | Resto | 11,9 · 13,4 · 14,1 ❌ | 6,7–8,6 | 266–333 ms | 883 (máx. 229 ms) |

Coste por frame dibujado según la traza de Performance (categorías `devtools.timeline` y `timeline.frame`) [M]:

| Fase | DrawFrame/s | Frames perdidos | Paint | PrePaint | Layerize (composición en el hilo principal) | Recalc. estilos | JS (FunctionCall) |
|---|---|---|---|---|---|---|---|
| Hero, escritorio | 28,4 | 93 en 2,8 s | 0,75 ms | 1,03 ms | 0,99 ms | 2,09 ms | 4,91 ms |
| Resto, escritorio | 54,2 | 143 en 23 s | 1,55 ms | 0,95 ms | 2,54 ms | 2,05 ms | 3,50 ms |
| Hero, móvil 4× | — | 314 | 2,29 ms | 1,38 ms | 1,81 ms | 1,84 ms | 5,36 ms |
| Resto, móvil 4× | — | 4.610 | **5,44 ms** | 2,04 ms | **7,25 ms** | 2,95 ms | 5,87 ms |

Lectura:
- **Hero en escritorio:** el hilo principal trabaja unos 12 ms por frame y no hay long tasks, pero solo se dibujan 28 frames/s. El cuello de botella está en GPU y raster [M]; la causa probable está en A3 [H].
- **Móvil:** domina la composición (Layerize más Paint), que se acerca a 13 ms por frame antes de ejecutar JS [M].
- **Limitaciones:**
  - El paint y el composite del lado GPU no se capturaron: la traza completa (con `cc`, `gpu` y `viz`) superó los 512 MB y no se pudo procesar.
  - La primera corrida de escritorio (16,2 fps) se hizo con esa traza pesada activa.
  - El fps headless no tiene vsync real; la corrida con ventana (14,4 fps) confirma la tendencia.

### 3.4 Peso de página

Caché deshabilitada; fase inicial y tras recorrer toda la página con la rueda [M].

| Página | Inicial | Total tras scroll | Vídeo | Imágenes | JS | Fuentes | CSS |
|---|---|---|---|---|---|---|---|
| `/` (móvil y escritorio, idénticos) | **4.547 KB** | **7.095 KB** | 3.998 KB inicial + 2.546 KB en scroll | 376 KB | 62 KB | 80 KB | 13 KB |
| `/servicios` móvil | 1.673 KB | 5.406 KB | 880 KB (inicial) | 620 KB + 3.734 KB | 60 KB | 80 KB | 16 KB |
| Detalle móvil | 605 KB | 3.045 KB | — | 431 KB + 2.440 KB | 61 KB | 80 KB | 17 KB |

- **JS por chunk (transferido):**
  - `index.xgxdCp6f.js`: 24,5 KB.
  - `gsap-config.Dbq4JRl3.js`: 24 KB.
  - `Layout…js`: 5,5 KB.
  - `index.astro…js`: 2,8 KB.
  - `ChatWidget…js`: 2 KB.
  - `StarField…js`: 1,4 KB.
  - `ContactDialog…js`: 1,3 KB.
  - `RocketCursor…js`: 1 KB.
- **Vídeos en la carga inicial de la home, también en móvil:**
  - `meteorogrupocrear_transp.webm`: 1.381 KB (`preload="auto"`, 1280×720 mostrado a 331 px).
  - `VistaMacCinematica_3.mp4`: 929 KB.
  - `Impresion-a-gran-formato_naranja_3.mp4`: 880 KB.
  - `Publicidad…cocacola_480.mp4`: 807 KB.
- **En scroll se suman:**
  - `Publicidad…cocacola_720.mp4`: 1.666 KB.
  - `Impresion-a-gran-formato_naranja_3.mp4` otra vez: 880 KB. Con caché deshabilitada se descargó dos veces; con caché normal sería una revalidación.
- **Imágenes sobredimensionadas:**
  - `rebranding_nexus.webp`: 2752×1536 mostrada a unos 335 px (4,1×; 11,5× en `/servicios` móvil).
  - `alternativa_naranja3d.webp`: 3840×2160 mostrada a unos 340 px (5,7×; 19× en `/servicios`).
  - Galerías de Cloudinary: 1090–1638 × 2048 px mostradas a 212–476 px (4,5–5×).

### 3.5 Otros tiempos medidos [M]

| Métrica | Escritorio (3 cargas) | Móvil, CPU 4× (3 cargas) |
|---|---|---|
| `load:complete` (se oculta el preloader) | 0,78–1,07 s | 5,35–6,67 s |
| `intro:complete` (se habilita el scroll y termina el intro) | **6,42–6,72 s** | **11,31–12,53 s** |
| Desplazamiento de la rueda durante el intro (a 1,5 s) | 541–561 px | 566–575 px |
| Scroll hacia atrás hasta arriba: overlay, logo, letras del tagline y tarjetas restaurados | ✅ (overlay = 1, logo `matrix(1,0,0,1,0,0)`, 0 letras ocultas) | ✅ |

### 3.6 Contraste (WCAG 2.x, calculado sobre `#001433` salvo indicación) [M]

| Par | Ratio | Uso | AA |
|---|---|---|---|
| `--w60` / `--bg` | 7,02 | Párrafos | ✅ |
| `--w40` / `--bg` | **3,76** | Labels del formulario (12 px), `.snum`, `.cto-info span`, breadcrumb, `.ent-num` | ❌ |
| `--w40` / `--bg2` | 3,65 | Hora del chat, botón deshabilitado | ❌ |
| `#E84E1B` / `--bg` | 4,82 | `.idx` (10 px), `.ptag` (12 px), titulares | ✅ (justo) |
| `#E84E1B` / `--bg2` | 4,47 | Naranja dentro del dialog o del chat | ❌ por 0,03 |
| **`#fff` / `#E84E1B`** | **3,79** | **Todos los CTA primarios (14–16 px, 600)** | ❌ |
| `#fff` / `#c23e12` (`--n-d`) | 5,26 | Alternativa propuesta | ✅ |
| `rgba(255,255,255,.22)` / `--bg` | 1,97 | Marquee (decorativo, `aria-hidden`) | ❌ (axe lo marca) |
| `#fff` / `#25D366` | **1,98** | Botón «Iniciar cotización por WhatsApp» del chat (13,5 px) | ❌ |
| Placeholder `rgba(255,255,255,.3)` / dialog | 2,64 | Placeholders | ❌ (informativo) |
| `.ptag` naranja / degradado de `.proj` | 4,63 | Texto sobre la media del portafolio | ✅ (axe no lo resolvió: 48–82 nodos en `incomplete`) |

---

## 4. Hallazgos priorizados

| ID | Severidad | Categoría | Página | Evidencia | Impacto en el usuario | Corrección propuesta | Esfuerzo |
|---|---|---|---|---|---|---|---|
| C1 | **Crítico** | Conversión | Todas | [C] `src/data/contacto.ts:31-35`: `whatsapp:'573000000000'`, `telefonoDisplay:'(601) 000 0000'` (el propio archivo lo marca como «PENDIENTE»). Alimenta el botón flotante, el chat, «Pedir cotización» del detalle, «Escribir por WhatsApp» y el footer. | Todos los clics en WhatsApp o en el teléfono acaban en un número inexistente. Es el canal preferido de una pyme en Colombia. | Poner los datos reales y añadir un test de build que falle si encuentra `000 0000`. | S |
| C2 | **Crítico** | Conversión / Privacidad | `/` | [M] Enviar el formulario inline lleva a `GET /?nombre=Prueba&empresa=&email=auditoria%40example.com&telefono=&mensaje=…` y recarga la página; `#inline-response` sigue en `display:none`. Enviarlo vacío también recarga. [C] `src/pages/index.astro:491-534`: `#contact-form-inline` no tiene ningún `addEventListener('submit')`. | El formulario principal de cotización no envía nada ni confirma, y deja nombre, email y mensaje en la URL, el historial y las analíticas. | Reutilizar la lógica de `ContactDialog` (POST a `/api/contacto` con validación y `aria-live`) y añadir `method="post"`. Incluir los campos `servicio` y `telefono` en el esquema. | S–M |
| C3 | **Crítico** | Conversión | Todas | [M] `POST /api/contacto` responde 200 «¡Gracias por contactarnos!». [C] `src/pages/api/contacto.ts:85-87` solo hace `console.info`; «Aquí iría la integración con un servicio de correo». | Quien use el dialog cree que pidió una cotización y nadie la recibe. | Integrar Resend, SendGrid o Netlify Forms con una alerta de fallo, y no responder 200 si el envío falla. | M |
| C4 | **Crítico** | Usabilidad / Accesibilidad | ≤ 768 px | [M] Tras el tap en `#burger`: `aria-expanded="true"`, `#menu` con `display:none`, alto 0 y «Cotizar» no visible (`burger-375-tras-tap.png`). [C] `Header.astro:84-90` añade `flex`, `absolute`… (utilidades de Tailwind dentro de `@layer`), y `Layout.astro:430` `.menu{display:none}` está fuera de capa y gana siempre. | En móvil no hay forma de llegar a Servicios, Estudio, Trabajo ni a «Cotizar» desde el header. | Alternar la clase `.open`, que ya está definida en `Layout.astro:432`, o usar `hidden` y `aria-hidden`. Añadir cierre con Esc. | S |
| A1 | Alto | Rendimiento | `/` móvil | [M] LCP de 4,65 s (render delay de 2,32 s sobre una imagen del collage), TBT de 1.234 ms, Perf 52; long tasks de 818 y 683 ms. | Más de 4 s de pantalla sin contenido útil con 4G; abandono antes de ver la oferta. | Pintar el H1 o el tagline en HTML visible desde el primer frame, sin esperar a `load:complete`. Crear el timeline y los triggers en `requestIdleCallback` y por partes. | M |
| A2 | Alto | Rendimiento | `/` | [M] 4,0 MB de vídeo antes del primer scroll, también en 375 px. [C] `MeteorScroll.astro:25` usa `preload="auto"`; `index.astro` activa los `source[data-src]` del collage en `load:complete` sin mirar el viewport. Imágenes 2752–3840 px mostradas a unos 335 px. | Datos móviles consumidos sin pedirlo, decodificación que compite con la interacción (input delay de 244 ms) y LCP lento. | En móvil, usar `poster` y `.webp` estáticos en lugar de vídeo. `preload="metadata"`, `srcset` y `sizes`, y AVIF/WebP a 2× del tamaño mostrado (unos 700 px). | M |
| A3 | Alto | Motion / Rendimiento | `/` | [M] Hero a 14–27 fps (mediana ≈ 20; p5 7,5–15) frente a ≥ 55; 28 DrawFrame/s y 93 frames perdidos en 2,8 s con el hilo principal a unos 12 ms por frame. Causas probables [H, código en [C]]: <br>• `filter:url(#chromatic-aberration)` vivo sobre `#collage-container` (`index.astro:55`), con `feOffset` reescrito según la velocidad. <br>• `feGaussianBlur` (`#stroke-glow`) sobre un trazo escalado 55× (`LogoHeroMask.astro`). <br>• Máscara SVG a pantalla completa escalada 55×. <br>• *Seek* por frame del `.webm` con alfa. <br>Va contra el MASTER: «Nada de filtros SVG vivos a pantalla completa». | La pieza de mayor impacto visual se ve a saltos y transmite lo contrario de «premium». | Probar quitando un elemento cada vez y medir de nuevo. Sustituir la aberración por dos capas con `transform` y `opacity`, quitar el blur del trazo o pasarlo a una imagen rasterizada, y cambiar el *scrub* del vídeo por una secuencia de imágenes o por reproducción normal. | M–L |
| A4 | Alto | Rendimiento | `/` móvil | [M] Con CPU 4×, 11–14 fps en todo el recorrido y 883 long tasks después del hero; Layerize de 7,25 ms y Paint de 5,44 ms por frame. [C] Hay animaciones infinitas que repintan: `idx-pulse` con `box-shadow` (`Layout.astro:234`, en cada `.idx` y en `#mission-hud`), `.btn-pulse`/`status-pulse` del chat, el marquee y el carrusel de marcas con `mask-image`, además del `.grain` fijo a pantalla completa (`Layout.astro:117`). Lighthouse detecta 2 animaciones no compuestas. | Scroll áspero y respuesta lenta en teléfonos de gama media, que es donde está buena parte del público B2B. | Pasar los pulsos a `transform`/`opacity` en un pseudo-elemento, pausar por `IntersectionObserver`, limitar `will-change` a lo que se anima y sustituir el `.grain` por fondo del `body`. | M |
| A5 | Alto | Accesibilidad | `/` | [M] Con `prefers-reduced-motion: reduce` sigue el pin (pin-spacer de 2.340 px), el logo llega a `matrix(55,…)` a 0,8 vh y las tarjetas se dispersan en 3D con `scaleX` 2,5 (`reduced-motion-home-pin50.png`). [C] `index.astro:748` solo desactiva la aberración, y `index.astro:869/877` (zoom 55×) y la dispersión no están condicionados. | Riesgo vestibular para quien pidió menos movimiento: zoom extremo y escena 3D atada al scroll. Incumple WCAG 2.3.3 (AAA) y el propio MASTER. | Con RM no crear el pin ni el timeline: mostrar el collage estático y el H1 visible. `gsap.matchMedia()`, como en `story.ts`. | M |
| A6 | Alto | Accesibilidad | `/servicios` | [M] Con RM, `#sh-sub` y las 6 `.sh-pill` se quedan con opacidad 0 tras recorrer la página. [C] `servicios/index.astro:404` y `:432` (`opacity:0` en CSS); el revelado solo existe en la rama `!prefersRM` (`:1012-1030`). | El subtítulo y el acceso rápido a los 6 servicios son invisibles para quien usa reduced-motion. | En la rama `else`, `gsap.set(['#sh-sub','#sh-pills'],{opacity:1,y:0})`, o mover el `opacity:0` a una clase que añada JS. | S |
| A7 | Alto | Accesibilidad / Conversión | Todas | [M] axe `color-contrast`: blanco sobre `#E84E1B` = 3,79:1 en `.cta` (14 px), `.foot-btn-primary` (15 px) y `.btn-fill`/`.submit-btn` (cálculo propio). | El CTA principal no cumple AA: peor legibilidad con sol en móvil o con baja visión. | Fondo `--n-d #c23e12` (5,26:1) para los botones con texto, o texto ≥ 18,66 px en bold. | S |
| A8 | Alto | Accesibilidad | Todas | [M] `--w40` = 3,76:1 en `.fg label` (12 px, `Layout.astro:387`), `.snum` (`:301`), `.cto-info span` (`:384`), breadcrumb y `.ent-num` del detalle; `.cto-card-kicker` = 3,79:1 a 11 px. | Las etiquetas de los campos del formulario de cotización son difíciles de leer. | Usar `--w60` (7,02:1) en labels y textos funcionales y reservar `--w40` para decoración. | S |
| A9 | Alto | Accesibilidad | Todas | [M] Recorrido con Tab: `#chat-toggle-btn` sin indicador de foco (`outline:none`, `ChatWidget.astro:139`). Con el chat **cerrado**, los pasos 49–51 caen en «Cerrar chat», el input y «Enviar» con opacidad efectiva 0. Esc no cierra el chat (`openAfterEsc: true`) y no existe `aria-expanded`. | El usuario de teclado pierde el foco en controles invisibles y no sabe si abrió el chat. | `:focus-visible` con anillo de 2 px y `inert` o `hidden` en `#chat-card` cuando está cerrado. Esc que cierre y devuelva el foco, `aria-expanded` y `aria-controls`. | S |
| M1 | Medio | Accesibilidad | Todas | [M] El primer Tab va al logo; no hay *skip link*. En la home hay que pulsar Tab 22 veces para llegar al primer campo del formulario. | Navegación por teclado lenta (WCAG 2.4.1). | `<a class="skip" href="#main-content">Saltar al contenido</a>`, visible al recibir el foco. | S |
| M2 | Medio | Conversión | `/servicios`, detalle | [M] Anclas rotas: `#cto` ×2 (incluido el CTA «INICIAR COTIZACIÓN» del footer), `#serv` ×6, `#nos`, `#port` y redes sociales `href="#"` ×3 (también en `/`). [C] `Footer.astro:64, 109-161, 172-188`. | El CTA del footer no hace nada fuera de la home y las redes llevan a ningún sitio, lo que resta confianza. | Usar `/#cto` o abrir el dialog, enlazar `/servicios/<slug>` y poner las URL reales de las redes o quitarlas. | S |
| M3 | Medio | Motion / Usabilidad | `/` | [M] El scroll se habilita a los 6,4–6,7 s en escritorio y a los 11,3–12,5 s con CPU 4×. La rueda durante el intro mueve la página 541–575 px: Lenis ignora `html.loading{overflow:hidden}` (`Layout.astro:102`), así que el usuario entra al pin con el estado ya avanzado. [C] El tagline se revela letra a letra en orden aleatorio (unos 78 caracteres × 0,04 s + 1 s, `index.astro:676-687`). No hay forma de saltar el intro. | Hasta 6–12 s para poder leer el mensaje completo y recorrer la página; un intro que no se puede saltar ni controlar. | Intro ≤ 1,5 s, `lenis.stop()` hasta `intro:complete`, saltar el intro con la primera interacción, y tagline por líneas (3 × 0,12 s) en vez de por letras. | M |
| M4 | Medio | Conversión / Usabilidad | `/` | [M] El primer viewport no tiene H1 ni CTA de contenido, solo el «Cotizar» del header (`home-1440-viewport.png`). En 375 px el logo de la máscara se ve diminuto y el tagline se solapa con «SCROLL» (solapamiento = `true`, `home-375-viewport.png`). Al terminar el pin, en móvil queda un viewport entero vacío de estrellas (`home-375-pin100.png`). | En los primeros 5 s el usuario ve «agencia de publicidad…», pero no qué hacen en concreto (gran formato, POP) ni cómo cotizar. | Subir H1, subtítulo y «Pedir cotización» al primer viewport, acortar el pin en móvil (≤ 100 %) y mover el indicador de scroll para que no choque con el tagline. | M |
| M5 | Medio | Contenido / Confianza | Todas | [C] Cifras que se contradicen: <br>• «+500 proyectos» (`index.astro:308`, y `[slug].astro:139` para cada servicio) frente a «Más de 100 proyectos» (`servicios/index.astro:217`). <br>• «Respondemos en menos de 24 horas» (`index.astro:472`) frente a «72h Tiempo de respuesta» (`:320`). <br>• «Una década» frente a «12+ años». <br>• «Menos de 3 segundos en móvil, garantizado» (`:454`), cuando la propia home mide un LCP de 4,65 s. <br>• Las tarjetas «Casos reales» enlazan a `#cto` y no a un caso; «×3 tráfico orgánico» y «98 % clientes que repiten» no tienen fuente. <br>• [H] Se usa una pantalla de Coca-Cola como caso: verificar autorización. | Un gerente B2B detecta la incoherencia y desconfía del resto de las cifras. | Unificar las cifras en `data/` y crear una o dos páginas de caso con cliente, reto, pieza, foto y resultado. Quitar las promesas que no se puedan sostener. | M |
| M6 | Medio | Accesibilidad | `/` | [M] axe `aria-prohibited-attr` (serio): `aria-label` en `<p id="hero-visual-tagline">`. [C] Las letras quedan con `aria-hidden` (`index.astro:110-111` y `splitTaglineChars`). [H] Algunos lectores ignoran `aria-label` en `<p>` y no leerían nada. | La primera frase de valor puede no anunciarse. | Mantener el texto en un `<span class="sr-only">` y poner `aria-hidden` solo en el contenedor de letras. | S |
| M7 | Medio | Accesibilidad | `/servicios`, detalle | [M] Tras cerrar el dialog con Esc, el foco queda en `BODY`. [C] `ContactDialog.astro:347-353` guarda `activeElement` después de `showModal()`, cuando el foco ya está dentro del dialog. | El usuario de teclado vuelve al principio de la página. | Guardar el disparador en el `click` antes de `showModal()`. | S |
| M8 | Medio | Usabilidad | Móvil | [M] Burger de 42×42 (`Layout.astro:148` anula `w-12`). Chat y WhatsApp con 6 px de separación a 375 px y desalineados (x 301 frente a 293). Cerrar chat 28×28, enviar 38×38, pastillas `.sn-pill`/`.sh-pill`/`.gal-pill` de 33–35 px de alto, enlaces del footer de 21 px. El chat tapa la última pastilla del hero de `/servicios` (`burger-375-tras-tap.png`). | Toques fallidos y solapamientos con el contenido. | Mínimo de 44×44 y separación ≥ 8 px. Alinear `right` del chat y del WhatsApp. Ocultar el chat mientras se ve el formulario. | S |
| M9 | Medio | Accesibilidad | `/servicios`, detalle | [M] Con RM siguen corriendo `strip-up`/`strip-down` (galerías infinitas de 95–290 s), `sh-breathe`, `idx-pulse`, `pulse-glow` y `status-pulse`. [C] Sin regla `@media (prefers-reduced-motion)` en `servicios/index.astro:777-785`; la pausa solo funciona con hover. | Contenido en movimiento que no se puede pausar (WCAG 2.2.2), y fotos difíciles de mirar. | Regla RM que detenga las tiras y botón de pausa visible, o pausa al enfocar. | S |
| M10 | Medio | Rendimiento | `/servicios`, detalle | [M] Galería de Cloudinary a 1090–1638 × 2048 px para huecos de 212–476 px; ahorro estimado de 3,7 MB en `/servicios` y 2,6 MB en el detalle (Lighthouse). [C] Las URL solo llevan `f_auto,q_auto`. | 5,4 MB por visita en móvil. | Añadir `w_600,c_limit` (y `w_1200` para 2×) con `srcset`; `dpr_auto`. | S |
| M11 | Medio | SEO | Todas | [M] No hay `canonical`, `og:image` ni `og:url`; 0 bloques JSON-LD (no hay `LocalBusiness`). `robots.txt` y `sitemap.xml` devuelven 404. | Al compartir por WhatsApp o LinkedIn no sale imagen; peor SEO local en Bogotá. | `@astrojs/sitemap`, `robots.txt`, canonical y `og:image`, y JSON-LD `LocalBusiness`/`ProfessionalService` alimentado desde `data/contacto.ts`. | S |
| B1 | Bajo | Accesibilidad | `/` | [M] axe `heading-order`: se pasa de h2 a `h4` en el portafolio (`index.astro:356-407`) y a `h5` en SEO (`:431-453`). | Estructura confusa con lector de pantalla. | Cambiarlos a `h3`. | S |
| B2 | Bajo | Accesibilidad | `/servicios`, detalle | [M] axe `label-content-name-mismatch` (8 y 5 nodos): `aria-label="Ver Material P.O.P"` frente al texto visible «Material POP». | El control por voz («pulsa Material POP») falla. | Quitar los `aria-label` redundantes o hacer que empiecen por el texto visible. | S |
| B3 | Bajo | Usabilidad | Todas | [M] La API devuelve «Invalid input: expected string, received undefined» (en inglés): Zod 4 ignora `required_error` (`api/contacto.ts:8,13,23`). El dialog muestra el genérico «Completa este campo». | Mensajes de error poco útiles. | `{ error: '…' }` de Zod 4 y mensajes propios por campo, por ejemplo «Escribe un correo como nombre@empresa.com». | S |
| B4 | Bajo | Legibilidad | Todas | [M] Texto por debajo de 16 px: `.bc-desc` 13 px, `.ent-detail` 13 px, `.paso-desc` 14 px, `.seo-c p` 13,5 px, `.sh-sub` 15 px; `.foot-cta-sub` llega a unos 94 caracteres por línea a 1440 px. El cuerpo principal cumple (16–18 px, line-height 1,6–1,7). | Lectura cansada en descripciones clave de servicio. | Mínimo 15–16 px en descripciones y `max-width: 65ch`. | S |
| B5 | Bajo | Usabilidad | Escritorio | [C] `cursor:none` en todo el sitio, también en campos de texto (`Layout.astro:107`), y el cohete sigue al puntero con lerp de 0,16 (`RocketCursor.astro`). [H] Hay retardo perceptible y no aparece el cursor de texto. | Precisión menor al rellenar el formulario. | Restaurar `cursor:auto` en `input`, `textarea` y `select`, y en `prefers-reduced-motion`. | S |
| B6 | Bajo | Rendimiento | Todas | [M] Google Fonts bloquea el render ≈ 830–845 ms estimados en móvil. | FCP más tardío. | Servir las fuentes desde el propio sitio (`woff2`, subconjunto latino) con `preload`. | S |
| B7 | Bajo | Conversión | Todas | [M] En local, `/api/chat` responde «El servicio de chat de IA no está configurado en el servidor» porque no hay `GEMINI_API_KEY`. [H] Si producción tampoco la tiene, el chat «En línea» no responde. No se pudieron probar respuestas reales. | Un chat roto resta credibilidad. | Verificar la variable en Netlify y, si falla, ofrecer como respaldo un botón de WhatsApp. | S |
| B8 | Bajo | Despliegue | `/servicios` | [M] En `dist/` la carpeta se llama `Servicios/` porque Windows fusiona `public/Servicios` con `pages/servicios`. [H] Si se despliega un `dist` generado en Windows a un host sensible a mayúsculas, `/servicios` podría dar 404. | Página caída tras un despliegue manual. | Renombrar `public/Servicios` (por ejemplo a `public/img/servicios`). | S |

### 4.1 Heurísticas de Nielsen (0 = sin problema, 4 = catástrofe)

| # | Heurística | Nota | Evidencia |
|---|---|---|---|
| 1 | Visibilidad del estado del sistema | **3** | El preloader no indica progreso y es un `div aria-label="Cargando"` sin rol. El rail «Altitude» solo existe a ≥ 980 px. El formulario inline no da ningún feedback (C2). |
| 2 | Relación con el mundo real | 2 | El copy para pymes es claro («gente que no tiene tiempo…»). Pero la metáfora de los capítulos («Ignición», «Órbita», «Tripulación», rail en inglés «Altitude») no tiene relación con comprar impresión, y la sección SEO usa jerga («WPO», «Keyword Mapping»). |
| 3 | Control y libertad | 3 | El intro no se puede saltar (M3). Pin del 160 %, con la página moviéndose durante el intro. El menú móvil no abre (C4). El chat no se cierra con Esc. |
| 4 | Consistencia y estándares | 3 | Seis etiquetas de CTA para la misma acción («Cotizar», «Empezar proyecto», «Enviar cotización», «Pedir cotización», «Iniciar cotización», «Más información»). «Pedir cotización» abre WhatsApp en el detalle y el formulario en `/servicios`. Hay dos formularios distintos (6 campos frente a 4). El footer usa anclas que solo existen en la home. |
| 5 | Prevención de errores | **4** | `novalidate` sin JS en el formulario principal: se envía vacío, recarga y se pierde lo escrito (C2). |
| 6 | Reconocer antes que recordar | 2 | La navegación de escritorio es clara y la de servicios tiene una barra fija. Pero las tarjetas «Casos reales» parecen enlaces a un caso y llevan al formulario. |
| 7 | Flexibilidad y eficiencia | 3 | Hay cuatro atajos a cotizar (header, WhatsApp, chat, formulario), pero WhatsApp va a un número falso (C1), el header no es accesible en móvil (C4) y el formulario no envía (C2/C3). |
| 8 | Estética y diseño minimalista | 2 | Visualmente cuidado. El motion domina los primeros 6–12 s y deja un viewport vacío en móvil (M4); hay marquee, pulsos y tiras que se mueven a la vez. |
| 9 | Reconocer y recuperarse de errores | 3 | El dialog marca los errores con `aria-invalid` y `role="alert"`, pero con mensajes genéricos del navegador; la API filtra errores en inglés (B3); el formulario inline no muestra nada. |
| 10 | Ayuda y documentación | 2 | No hay FAQ (plazos, mínimos, materiales, formatos de archivo). El chat lista servicios, pero su backend no se pudo verificar (B7). |

### 4.2 Motion UX — respuestas puntuales

- **¿Cada animación transmite significado?**
  - Aportan: el reveal por líneas de los titulares, el contador de cifras y el rail «Altitude», que indica progreso aunque solo en escritorio.
  - Son decorativos y además caros: la aberración cromática, el *warp* de estrellas, el zoom 55× del logo, la dispersión 3D, los pulsos infinitos de `.idx` y del chat, y el marquee.
- **Duraciones y easing:**
  - La mayoría usa `expo.out` (`story.ts`).
  - Fuera de la norma: el dialog usa *overshoot* `cubic-bezier(.34,1.56,.64,1)` a 280 ms (`ContactDialog.astro:223`), el segundo fold usa `power4.out` (`index.astro`), el tagline `power3.out` y el hover de `.btn-fill` dura 500 ms, por encima del rango de 150–350 ms del MASTER.
- **Tiempo hasta leer el primer mensaje y hacer scroll:** 6,4–6,7 s en escritorio y 11,3–12,5 s con CPU 4× [M]. No son los «unos 4 s» documentados.
- **¿Se entiende el pin?** El indicador «SCROLL» se desvanece con el primer *notch* (`tl.to('#scroll-indicator',{opacity:0,duration:.15},0)`). Después no queda ninguna pista de que faltan unos 1,6 viewports de pin salvo el rail, que no existe en móvil o tablet. Hay *scroll-jacking*: Lenis más `scrub:1` desacopla la rueda del contenido y, a 20 fps, la escena va a saltos [M].
- **Scroll hacia atrás:** se restaura bien. Overlay, logo, letras y tarjetas vuelven a su estado sin saltos visibles (`scroll-atras-restaurado-1440.png`) [M].
- **Riesgo vestibular: alto.** Zoom 1→55×, dispersión 3D (`scaleX` 3,5, `rotateX`/`rotateY` de 25–30°) y aberración RGB por velocidad. Con reduced-motion se desactivan el *warp* y la aberración, pero **no** el zoom ni la dispersión (A5) [M].

### 4.3 Conversión y contenido — respuestas puntuales

- **CTA en el primer viewport:** solo «Cotizar» en el header de escritorio (112×42), y en móvil no es accesible (C4). El «Empezar proyecto» del segundo fold llega a recibir foco de teclado cuando todavía tiene opacidad 0 (paso 6 del recorrido con Tab) [M].
- **Fricción del formulario:**
  - Inline: 6 campos, 3 obligatorios (nombre, email, mensaje); `servicio` y `telefono` no viajan al API.
  - Dialog: 4 campos, 3 obligatorios. Muestra «Enviando…», un spinner y «¡Gracias…!», y se cierra a los 3 s.
  - Envío de prueba: el dialog devolvió 200 [M], pero el servidor no hace nada con el lead (C3).
- **Propuesta de valor en 5 s:** sin el H1 solo se lee «Agencia de publicidad y producción gráfica para marcas de Colombia que quieren sobresalir», y tarda unos 6 s en revelarse entera. No nombra gran formato, POP ni la audiencia pyme. El detalle sí lo resuelve bien: H1, descripción y «Pedir cotización» en el primer viewport (`detalle-375-viewport.png`).
- **Prueba social:**
  - Logos creíbles (Marca Colombia, ProColombia, USAID, ANATO), pero en un carrusel `aria-hidden` y sin casos enlazados.
  - Las cifras se contradicen (M5).
  - Las fotos de proyectos reales del detalle (museos, pueblos indígenas) son la mejor prueba del sitio y están escondidas en tiras que se mueven solas.
- **SEO on-page:**
  - Correcto: un solo H1 por página, `title` y `description` únicos, URLs semánticas (`/servicios/impresion-gran-formato`), `lang="es"`.
  - Falta: canonical, OG image, JSON-LD, robots y sitemap (M11).
  - El texto animado letra a letra está en el HTML del servidor, así que es indexable. El partido en `<span>` ocurre en el cliente [C].

---

## 5. Quick wins (menos de 1 hora cada uno, impacto alto)

1. **C1:** reemplazar los datos de `src/data/contacto.ts` por los reales. Se propaga a todos los CTA.
2. **C4:** en `Header.astro`, cambiar `menu.classList.add('flex', …)` por `menu.classList.toggle('open')`. La regla `.menu.open` ya existe.
3. **C2 (parche mínimo):** en `#contact-form-inline`, `preventDefault` y POST a `/api/contacto` reutilizando la función de `ContactDialog`. Mientras C3 no esté listo, al menos un `mailto:` o un WhatsApp de respaldo con el texto del formulario.
4. **A7 y A8:** fondo `--n-d` en los botones con texto blanco y `--w60` en `.fg label`, `.snum` y el breadcrumb. Son 4–5 líneas de CSS.
5. **A6:** `gsap.set(['#sh-sub','#sh-pills'],{opacity:1,y:0})` en la rama de reduced-motion de `servicios/index.astro`.
6. **A9:** `:focus-visible` en `.chat-btn`, `inert` en `#chat-card` cerrado y cierre con Esc.
7. **M1:** *skip link* en `Layout.astro`.
8. **M2:** anclas del footer a `/#cto`, `/#nos`, `/#port` y `/servicios/<slug>`, y quitar las redes con `href="#"`.
9. **M7:** guardar el disparador antes de `showModal()`.
10. **M9:** `@media (prefers-reduced-motion: reduce){ .gal-track, .gal-sub-track { animation: none } }`.
11. **B1 y B2:** `h4`/`h5` a `h3` y quitar los `aria-label` que no coinciden con el texto visible.
12. **M5 (texto):** unificar «+500», «24 h» y «12 años», y quitar «Menos de 3 segundos en móvil, garantizado» hasta que sea cierto.

---

## 6. Capturas (`docs/auditoria-capturas/`)

**Por breakpoint (375, 768, 1024 y 1440 px):**
- Primer viewport tras el intro: `{home|servicios|detalle}-{375|768|1024|1440}-viewport.png`.
- Página completa tras revelar todo: `{home|servicios|detalle}-{375|768|1024|1440}-full.png`.
- Home a mitad del pin (0,8 vh) y al soltarlo (1,6 vh): `home-{375|768|1024|1440}-pin50.png` y `home-{375|768|1024|1440}-pin100.png`.

**Problemas concretos:**

| Archivo | Qué muestra |
|---|---|
| `burger-375-tras-tap.png` | C4: tras el tap en el burger, el menú no aparece; además, el chat tapa una pastilla de servicio. |
| `home-375-viewport.png` | M4: logo diminuto y tagline solapado con «SCROLL». |
| `home-375-pin100.png` | M4: viewport vacío al terminar el pin en móvil. |
| `home-375-primer-mensaje.png` | Estado de la home móvil al terminar el intro (CPU 4×). |
| `reduced-motion-home-pin50.png` | A5: con reduced-motion el logo ya hizo zoom y el collage sigue en escena 3D. |
| `teclado-foco-01.png` … `teclado-foco-04.png` | Recorrido con Tab: el anillo nativo de Chrome es visible en enlaces y botones del sitio. |
| `teclado-chat-abierto.png` | A9: estado del chat tras Enter y Esc (sigue abierto). |
| `dialog-validacion-vacia.png`, `dialog-envio.png` | Validación y confirmación del dialog. |
| `reflow-320-{home,servicios,detalle}.png` | Reflow a 320 px sin scroll horizontal (`scrollWidth` = 320 en las 3 páginas; también a 640 px CSS, equivalente a zoom 200 %). |
| `scroll-atras-restaurado-1440.png` | La home tras volver arriba: estado restaurado. |

---

## Anexo — método y limitaciones

- **Servidor:** `astro preview` no está soportado por `@astrojs/netlify` («The @astrojs/netlify adapter does not support the preview command»). El puerto 4321 ya lo ocupaba un `astro dev` del usuario, que no se tocó. Se sirvió `dist/` con un servidor Node propio en el puerto 4400 que imita a Netlify: brotli, `Range` para vídeo, `/_astro/*` inmutable y `/api/*` enrutado a la función SSR generada (`.netlify/v1/functions/ssr/ssr.mjs`). El TTFB real de Netlify y su CDN no se midió.
- **Herramientas:** Lighthouse 13.6.0, axe-core 4.14.0 (etiquetas `wcag2a/aa`, `wcag21a/aa`, `wcag22aa` y `best-practice`, al cargar y tras recorrer la página), Puppeteer 25.16 y web-vitals 6.2.3, con Chrome 156 y GPU Intel UHD.
- **Código cambiado durante la auditoría:** `src/layouts/Layout.astro` e `src/pages/index.astro` (01:07), `src/scripts/story.ts` (01:04) y `RocketCursor.astro` (00:53) se modificaron después del build medido. Se comprobó que todos los hallazgos siguen presentes en el código actual, y los números de línea citados son los del código actual. Las novedades posteriores al build (HUD `#mission-hud`, palabra `.ch-word`, órbita con MotionPath, segundo pin horizontal en `#port`, aterrizaje del cohete) **no se midieron**: hay que repetir las secciones 3.1 y 3.3 con un build nuevo, porque un segundo pin puede empeorar la fluidez del scroll (A3, A4).
- **No medido:** el INP de «Cotizar» en móvil (el menú no abre), las respuestas del chat (falta `GEMINI_API_KEY` en local), el tiempo de paint y composite del lado GPU (traza demasiado grande), la prueba con lectores de pantalla reales (NVDA, VoiceOver) y dispositivos móviles físicos. El móvil se emuló con CPU 4×.
- **Variabilidad:** el INP móvil con CPU 4× dio 816 ms y 416 ms en dos corridas, y el fps del hero en escritorio osciló entre 14 y 27 entre corridas. Se reportan todas las corridas.
