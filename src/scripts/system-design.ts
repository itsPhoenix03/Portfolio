// System Design section (SystemDesign.astro).
//
// When the "Backend & Databases" strip reaches the middle of the screen, the
// Skills section pins and a red band grows out of that strip to fill the
// screen. Scrolling then moves a camera along a hidden wave across a large
// surface: the content travels so each stop slides to the centre, dwells, and
// hands over to the next. At the end the panel shrinks back into the strip and
// the page carries on. Everything is scrubbed, so scrolling back rewinds it.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WAVE_SIZE, waveSegments, segPoint, type Pt } from '@/scripts/wave';
import { duckMusic } from '@/scripts/duck';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sd = document.querySelector<HTMLElement>('[data-sd]');
const origin = document.querySelector<HTMLElement>('[data-sd-origin]');
const skills = origin?.closest<HTMLElement>('section');

if (sd && origin && skills && !reduce) init(sd, origin, skills);

function init(sd: HTMLElement, origin: HTMLElement, skills: HTMLElement) {
  sd.classList.add('is-overlay');

  const q = <T extends Element>(sel: string) => Array.from(sd.querySelectorAll<T>(sel));
  const canvas = sd.querySelector<HTMLElement>('.sd__canvas')!;
  const deco = sd.querySelector<HTMLElement>('.sd__deco')!;
  const grid = sd.querySelector<HTMLElement>('.sd__grid')!;
  const hud = sd.querySelector<HTMLElement>('.sd__hud')!;
  const bandIn = sd.querySelector<HTMLElement>('.sd__band--in')!;
  const bandOut = sd.querySelector<HTMLElement>('.sd__band--out')!;
  const car = sd.querySelector<SVGCircleElement>('#sd-car');
  const count = sd.querySelector<HTMLElement>('#sd-count');
  // Everything on the route, in travel order: big "this or that" stops and
  // the smaller practice notes. Their data-x / data-y are the wave points.
  const items = q<HTMLElement>('.sd__canvas [data-kind]');
  const nums = q<HTMLElement>('.sd__num');
  // Hand-drawn sketches: strokes draw on as the camera approaches, then the
  // labels fade in. The route only ever moves right, so x is enough.
  const sketches = q<SVGSVGElement>('.sd__dd').map((el) => ({
    el,
    x: Number(el.dataset.x),
    y: Number(el.dataset.y),
    paths: Array.from(el.querySelectorAll<SVGPathElement>('path')),
    texts: Array.from(el.querySelectorAll<SVGTextElement>('text')),
    drawn: -1,
  }));
  const at = (el: HTMLElement): Pt => [Number(el.dataset.x), Number(el.dataset.y)];
  const pts = items.map(at);
  const isStop = items.map((el) => el.dataset.kind === 'stop');

  const segs = waveSegments(pts);
  const routeEnd = pts[pts.length - 1][0];
  const DECO_DEPTH = 0.75; // the big numbers drift slower than the content
  let vw = window.innerWidth;
  let vh = window.innerHeight;

  function layout() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.style.width = `${WAVE_SIZE[0] * vw}px`;
    canvas.style.height = `${WAVE_SIZE[1] * vh}px`;
    items.forEach((el, i) => {
      el.style.left = `${pts[i][0] * vw}px`;
      el.style.top = `${pts[i][1] * vh}px`;
    });
    sketches.forEach((d) => {
      d.el.style.left = `${d.x * vw}px`;
      d.el.style.top = `${d.y * vh}px`;
    });
    nums.forEach((el) => {
      const [x, y] = at(el);
      el.style.left = `${x * vw * DECO_DEPTH}px`;
      el.style.top = `${y * vh * DECO_DEPTH}px`;
    });
  }

  // Each leg eases out of one point and into the next, holding still for a
  // moment at each: longer at the big stops, a short read at the notes.
  const HOLD_STOP = 0.2;
  const HOLD_NOTE = 0.14;
  const legEase = (t: number, from: number, to: number) => {
    const a = isStop[from] ? HOLD_STOP : HOLD_NOTE;
    const b = isStop[to] ? HOLD_STOP : HOLD_NOTE;
    const u = Math.min(1, Math.max(0, (t - a) / (1 - a - b)));
    return 0.5 - Math.cos(Math.PI * u) / 2;
  };

  const cameraAt = (p: number): Pt => {
    const n = segs.length;
    const x = Math.min(Math.max(p, 0) * n, n - 1e-6);
    const i = Math.floor(x);
    return segPoint(segs[i], legEase(x - i, i, i + 1));
  };

  let lastCount = -1;
  function render(p: number) {
    const [cx, cy] = cameraAt(p);
    const px = cx * vw;
    const py = cy * vh;
    canvas.style.transform = `translate3d(${vw / 2 - px}px, ${vh / 2 - py}px, 0)`;
    deco.style.transform = `translate3d(${vw / 2 - px * DECO_DEPTH}px, ${vh / 2 - py * DECO_DEPTH}px, 0)`;
    grid.style.backgroundPosition = `${-px * 0.5}px ${-py * 0.5}px`;

    // Each item fades up as the camera nears it and drifts off as it leaves.
    // Notes have a tighter window so they don't crowd the big stops.
    let stopNo = -1;
    let nearestStop = 0;
    let best = Infinity;
    let stopShown = 0;
    pts.forEach(([sx, sy], i) => {
      const d = Math.hypot(sx - cx, (sy - cy) * 0.9);
      if (isStop[i]) {
        stopNo++;
        if (d < best) {
          best = d;
          nearestStop = stopNo;
        }
      }
      const reach = isStop[i] ? 0.6 : 0.45;
      const v = Math.min(1, Math.max(0, 1 - (d - 0.08) / reach));
      if (isStop[i]) stopShown = Math.max(stopShown, v);
      const el = items[i];
      el.style.opacity = String(v);
      el.style.transform = `translate(-50%, -50%) translateY(${(1 - v) * 60}px)`;
      // Empty, not "visible", so the closed panel's hidden state still wins.
      el.style.visibility = v > 0 ? '' : 'hidden';
    });

    // On narrow screens the big stops fill the width, so sketches step aside.
    const sketchAlpha = vw < 700 ? String(1 - stopShown) : '1';
    sketches.forEach((d) => {
      d.el.style.opacity = sketchAlpha;
      // Finished just before the camera reaches it — or by the end of the
      // route, for sketches that sit past the last stop.
      const end = Math.min(d.x - 0.35, routeEnd);
      const t = Math.min(1, Math.max(0, (cx - (end - 0.45)) / 0.45));
      const v = Math.round(t * 100) / 100;
      if (v === d.drawn) return;
      d.drawn = v;
      d.el.style.visibility = v > 0 ? '' : 'hidden';
      // Strokes one after another, like a pen.
      const n = d.paths.length;
      d.paths.forEach((p, i) => {
        const local = Math.min(1, Math.max(0, v * n * 0.75 - i * 0.75 + 0.25));
        p.style.strokeDashoffset = String(1 - Math.min(1, local * 1.33));
      });
      const tv = String(Math.min(1, Math.max(0, (v - 0.55) / 0.35)));
      d.texts.forEach((tx) => (tx.style.opacity = tv));
    });

    if (car) {
      car.setAttribute('cx', (cx * 100).toFixed(1));
      car.setAttribute('cy', (cy * 100).toFixed(1));
    }
    if (count && nearestStop !== lastCount) {
      lastCount = nearestStop;
      count.textContent = String(nearestStop + 1).padStart(2, '0');
    }
  }

  // The band matches the strip: pinned at the screen's centre.
  const bandClip = () => {
    const m = Math.max(0, (window.innerHeight - origin.offsetHeight) / 2);
    return `inset(${m}px 0px ${m}px 0px)`;
  };
  const fullClip = 'inset(0px 0px 0px 0px)';

  // Timeline lengths, in screen heights of scrolling.
  const EXPAND = 1;
  const JOURNEY = segs.length * 0.6;
  const COLLAPSE = 1;
  const state = { p: 0 };
  const inner = [canvas, deco, hud];

  layout();
  render(0);

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: origin,
      start: 'center center',
      end: () => `+=${(EXPAND + JOURNEY + COLLAPSE) * window.innerHeight}`,
      pin: skills,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // Sits above the projects pin, so it must measure first.
      refreshPriority: 1,
      onToggle: (self) => {
        sd.classList.toggle('is-live', self.isActive);
        duckMusic('system-design', self.isActive ? 0.65 : null);
      },
      onRefresh: () => {
        layout();
        render(state.p);
      },
    },
  });

  tl
    // Open: the band lights up over the strip, then grows to full screen.
    .fromTo(sd, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0)
    .fromTo(sd, { clipPath: bandClip }, { clipPath: fullClip, duration: EXPAND, ease: 'power2.inOut', immediateRender: true }, 0)
    .fromTo(bandIn, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.35 }, 0.3)
    .fromTo(inner, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 }, 0.55)
    // Travel the wave.
    .to(state, { p: 1, duration: JOURNEY, onUpdate: () => render(state.p) }, EXPAND)
    // Close: back down to a band over the strip, then let the page through.
    .to(inner, { autoAlpha: 0, duration: 0.4 }, EXPAND + JOURNEY)
    .fromTo(bandOut, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, EXPAND + JOURNEY + 0.3)
    .to(sd, { clipPath: bandClip, duration: COLLAPSE, ease: 'power2.inOut' }, EXPAND + JOURNEY)
    .to(sd, { opacity: 0, duration: 0.12 }, EXPAND + JOURNEY + COLLAPSE - 0.12);

  ScrollTrigger.refresh();
}
