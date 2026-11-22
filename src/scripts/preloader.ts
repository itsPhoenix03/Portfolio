import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { lenisInstance } from '@/scripts/smooth-scroll';

gsap.registerPlugin(SplitText);

// Counts 0 → 100 in giant type while the tagline rises in, then the whole
// panel wipes upward to reveal the hero. Dispatches `app:reveal` (which kicks
// off the hero entrance + 3D warp-in) as the wipe starts.
const pre = document.getElementById('preloader');
const fill = document.getElementById('preloader-fill');
const count = document.getElementById('preloader-count');
const name = document.getElementById('preloader-name');

function reveal(): void {
  // Flag for listeners that register after this fires (reduced-motion path).
  document.documentElement.dataset.revealed = '1';
  window.dispatchEvent(new Event('app:reveal'));
}

if (!pre || !fill || !count) {
  reveal();
} else {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  lenisInstance.stop();
  window.scrollTo(0, 0);

  const finish = () => {
    const out = gsap.timeline({
      onComplete: () => {
        pre.style.display = 'none';
        lenisInstance.start();
      },
    });
    out
      .to(count, { yPercent: -110, duration: 0.6, ease: 'power3.in' })
      .to(
        name ? name.querySelectorAll('.pre-line') : [],
        { yPercent: -110, duration: 0.6, stagger: 0.05, ease: 'power3.in' },
        0
      )
      .add(reveal, 0.45)
      .to(pre, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 0.35);
  };

  if (reduce) {
    count.textContent = '100';
    fill.style.transform = 'scaleX(1)';
    reveal();
    pre.style.display = 'none';
    lenisInstance.start();
  } else {
    // Hold the tagline and the count until the page's heavy start-up work is
    // done: the first layout, splitting the headings (scroll-animations.ts
    // fires app:ready) and the re-measure on `load`. That's about a second
    // of blocked main thread; started earlier, the count froze and jumped
    // through it. Meanwhile the CSS-only signals run — they keep moving even
    // while scripts are busy.
    const root = document.documentElement;
    const booted = new Promise<void>((r) => {
      if (root.dataset.ready) r();
      else window.addEventListener('app:ready', () => r(), { once: true });
    });
    const loaded = new Promise<void>((r) => {
      if (document.readyState === 'complete') r();
      else window.addEventListener('load', () => r(), { once: true });
    });
    // Never hold forever (and stay inside scroll-animations' 6 s fallback).
    const cap = new Promise<void>((r) => window.setTimeout(r, 3500));
    // The frame after: lets the `load` handlers (the re-measure) finish first.
    Promise.race([Promise.all([booted, loaded]), cap]).then(() => requestAnimationFrame(start));
  }

  function start() {
    if (name) {
      SplitText.create(name, { type: 'lines', mask: 'lines', linesClass: 'pre-line' });
      gsap.set(name, { visibility: 'visible' });
      gsap.from(name.querySelectorAll('.pre-line'), {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
      });
    }
    // Scripts have arrived: the CSS "still loading" signals hand over to the count.
    pre!.classList.add('is-counting');
    const state = { p: 0 };
    gsap.to(state, {
      p: 100,
      duration: 1.6,
      ease: 'power3.inOut',
      onUpdate: () => {
        const v = Math.round(state.p);
        count!.textContent = String(v);
        fill!.style.transform = `scaleX(${state.p / 100})`;
      },
      onComplete: finish,
    });
  }
}
