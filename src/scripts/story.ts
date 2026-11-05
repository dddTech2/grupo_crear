/*
  story.ts — capítulos de la "Misión de despegue" que viven fuera del hero.

    Todas    palabra gigante del capítulo que atraviesa la sección (scrub)
    2 Desp.  #hero-content  (solo la palabra; el H1 lo revela index.astro)
    3 Órbita #serv  el cohete del logo orbita un planeta + filas en cascada
    4 Trip.  #nos   el marco se abre como escotilla + contadores
    5 Plan.  #port  escritorio: viaje horizontal pinneado por los casos
                    móvil/tablet: reveal vertical por tarjeta
    6 Naveg. #seo   reveal CSS (.r) + palabra gigante
    7 Aterr. #cto   el cohete desciende y se posa junto al titular

  Los capítulos 0-1 (Ignición y Despegue) son el timeline pinneado del hero
  en index.astro. initStory() se llama DESPUÉS de crear ese pin y luego se
  hace ScrollTrigger.sort() + refresh(), para que todo se mida en orden de página.

  Presupuesto: como máximo 2 pins (hero + casos en escritorio); solo transform,
  opacity, clip-path y stroke-dashoffset. Con prefers-reduced-motion no se
  anima nada y el contenido queda visible y estático.
*/
import { gsap, ScrollTrigger } from '../utils/gsap-config';

const EASE = 'expo.out'; // ≡ cubic-bezier(.16,1,.3,1), la curva de la marca
const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/**
 * Parte un titular por sus <br> en líneas con máscara:
 *   <span class="ln"><span>…</span></span>
 * El texto sigue siendo texto (lectores de pantalla y SEO no cambian).
 */
function splitLines(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split) return [...el.querySelectorAll<HTMLElement>('.ln > span')];
  const lines = el.innerHTML.split(/<br\b[^>]*>/i);
  el.innerHTML = lines.map((l) => `<span class="ln"><span>${l.trim()}</span></span>`).join('');
  el.dataset.split = '1';
  return [...el.querySelectorAll<HTMLElement>('.ln > span')];
}

/** Cuenta de 0 al número del texto conservando prefijo/sufijo ("12+", "98%", "72h"). */
function countUp(el: HTMLElement, trigger: Element) {
  const m = el.textContent?.trim().match(/^(\D*)(\d+)(\D*)$/);
  if (!m) return;
  const [, pre, num, suf] = m;
  const obj = { v: 0 };
  gsap.to(obj, {
    v: Number(num),
    duration: 1.6,
    ease: 'power2.out',
    scrollTrigger: { trigger, start: 'top 75%', once: true },
    onUpdate: () => { el.textContent = `${pre}${Math.round(obj.v)}${suf}`; },
  });
}

/**
 * Cohete del isotipo listo para reutilizar: clona el SVG del cursor
 * (RocketCursor.astro), que ya trae el path del logo enderezado y la llama.
 */
export function cloneRocket(): SVGSVGElement | null {
  const src = document.getElementById('rocket-svg');
  if (!src) return null;
  const svg = src.cloneNode(true) as SVGSVGElement;
  svg.removeAttribute('id');
  svg.removeAttribute('style');
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.querySelector('#rocket-flame')?.setAttribute('class', 'rk-flame');
  svg.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  return svg;
}

/** Inserta la palabra gigante de cada capítulo (decorativa, aria-hidden). */
function injectChapterWords(): HTMLElement[] {
  const words: HTMLElement[] = [];
  document.querySelectorAll<HTMLElement>('section[data-chapter]').forEach((sec) => {
    if (sec.id === 'cto') return; // el contacto ya tiene su "CREAR" gigante
    let w = sec.querySelector<HTMLElement>(':scope > .ch-word');
    if (!w) {
      w = document.createElement('div');
      w.className = 'ch-word';
      w.setAttribute('aria-hidden', 'true');
      w.textContent = sec.dataset.chapter!;
      sec.prepend(w);
    }
    words.push(w);
  });
  return words;
}

export function initStory() {
  const words = injectChapterWords();
  const mm = gsap.matchMedia();

  mm.add(MOTION_OK, () => {
    // ── Palabra del capítulo: cruza la sección en sentido contrario al scroll ─
    words.forEach((w) => {
      gsap.fromTo(w,
        { xPercent: 6 },
        {
          xPercent: -28, ease: 'none',
          scrollTrigger: { trigger: w.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
    });

    // ── Titulares de sección: líneas que suben desde su máscara ─────────────
    gsap.utils.toArray<HTMLElement>('section h2.lead').forEach((h) => {
      const lines = splitLines(h);
      gsap.fromTo(lines,
        { yPercent: 105 },
        {
          yPercent: 0, duration: 1.1, ease: EASE, stagger: 0.12,
          scrollTrigger: { trigger: h, start: 'top 85%', once: true },
        });
    });

    // ── 3 · Órbita: filas en cascada ────────────────────────────────────────
    gsap.set('#serv .srow', { opacity: 0, y: 48 });
    ScrollTrigger.batch('#serv .srow', {
      start: 'top 88%',
      once: true,
      onEnter: (rows) => gsap.to(rows, { opacity: 1, y: 0, duration: 1, ease: EASE, stagger: 0.09 }),
    });

    // ── 4 · Tripulación: el marco del estudio se abre como una escotilla ───
    const frame = document.querySelector<HTMLElement>('#nos .nos-frame');
    if (frame) {
      gsap.fromTo(frame,
        { clipPath: 'inset(18% 12% 18% 12% round 6px)', scale: 1.08 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 6px)', scale: 1, ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top 90%', end: 'top 30%', scrub: 0.8 },
        });
      gsap.from('#nos .nos-badge', {
        opacity: 0, y: 40, duration: 1, ease: EASE,
        scrollTrigger: { trigger: frame, start: 'top 45%', once: true },
      });
    }
    const yr = document.querySelector<HTMLElement>('#nos .yr');
    if (yr) countUp(yr, yr);
    document.querySelectorAll<HTMLElement>('#nos .nos-stat b').forEach((b) => countUp(b, b));

    // ── 7 · Aterrizaje: "CREAR" atraviesa el fondo + el cohete se posa ──────
    gsap.fromTo('#cto .cto-huge',
      { xPercent: 18 },
      {
        xPercent: -12, ease: 'none',
        scrollTrigger: { trigger: '#cto', start: 'top bottom', end: 'bottom bottom', scrub: 1 },
      });

    const lander = document.querySelector<HTMLElement>('#cto .lander');
    const landerRocket = lander ? cloneRocket() : null;
    if (lander && landerRocket) {
      lander.prepend(landerRocket);
      const flame = landerRocket.querySelector('.rk-flame');
      const dust  = lander.querySelector('.lander-dust');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '#cto', start: 'top 95%', end: 'top 20%', scrub: 1 },
      });
      // Desciende frenando: la llama (retrocohete) se apaga al tocar suelo
      tl.fromTo(landerRocket, { y: () => -window.innerHeight * 0.55, rotation: -8 }, { y: 0, rotation: 0, ease: 'power3.out', duration: 1 }, 0);
      if (flame) tl.fromTo(flame, { scaleY: 1.9 }, { scaleY: 0.35, ease: 'power2.in', duration: 1 }, 0);
      if (dust)  tl.fromTo(dust, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, ease: 'power2.out', duration: 0.25 }, 0.85);
    }
  });

  // ── Órbita (escritorio): el cohete recorre la elipse y deja su estela ─────
  mm.add(`(min-width: 980px) and ${MOTION_OK}`, () => {
    const holder = document.getElementById('orbit-rocket');
    const trail  = document.getElementById('orbit-trail') as SVGPathElement | null;
    const rocket = holder ? cloneRocket() : null;
    if (!holder || !trail || !rocket) return;

    // Cohete de 24 u. con la nariz hacia +x (autoRotate alinea el eje x con la órbita)
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', 'rotate(90) scale(.85) translate(-18 -16)');
    g.append(...Array.from(rocket.childNodes));
    holder.replaceChildren(g);

    const len = trail.getTotalLength();
    gsap.set(trail, { strokeDasharray: len, strokeDashoffset: len });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#serv', start: 'top 75%', end: 'bottom 40%', scrub: 1 },
    });
    tl.to(holder, {
      ease: 'none', duration: 1,
      motionPath: { path: trail, align: trail, alignOrigin: [0.5, 0.5], autoRotate: true },
    }, 0);
    tl.to(trail, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0);

    return () => holder.replaceChildren();
  });

  // ── 5 · Planetas (escritorio): viaje horizontal pinneado ──────────────────
  mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
    const port  = document.getElementById('port');
    const track = port?.querySelector<HTMLElement>('.port-grid');
    if (!port || !track) return;
    port.classList.add('port-h');

    // Distancia = lo que sobra de la pista a la derecha + un respiro final
    const dist = () => Math.max(0, track.scrollWidth - track.clientWidth + window.innerWidth * 0.06);

    const journey = gsap.to(track, {
      x: () => -dist(),
      ease: 'none', // obligatorio con containerAnimation: 1:1 entre scroll y posición
      scrollTrigger: {
        trigger: port,
        pin: true,
        start: 'top top',
        end: () => '+=' + dist(),
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    gsap.utils.toArray<HTMLElement>('.proj', track).forEach((card) => {
      gsap.fromTo(card,
        { clipPath: 'inset(10% 14% 10% 0% round 6px)', scale: 0.92, opacity: 0.3 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 6px)', scale: 1, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: journey, start: 'left 100%', end: 'left 60%', scrub: true },
        });
      const media = card.querySelector<HTMLElement>('.proj-media');
      if (media) {
        gsap.fromTo(media,
          { xPercent: 6 },
          {
            xPercent: -6, ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: journey, start: 'left right', end: 'right left', scrub: true },
          });
      }
    });

    return () => port.classList.remove('port-h');
  });

  // ── 5 · Planetas (móvil/tablet): reveal vertical por tarjeta ──────────────
  mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
    gsap.utils.toArray<HTMLElement>('#port .proj').forEach((card) => {
      gsap.fromTo(card,
        { clipPath: 'inset(14% 10% 14% 10% round 6px)', scale: 0.94, opacity: 0.35 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 6px)', scale: 1, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 98%', end: 'top 55%', scrub: 0.6 },
        });
      const media = card.querySelector<HTMLElement>('.proj-media');
      if (media) {
        gsap.fromTo(media,
          { yPercent: -6 },
          {
            yPercent: 6, ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
          });
      }
    });
  });

  // Las fuentes cambian la altura de los titulares → recalcular posiciones
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
