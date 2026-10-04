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
    if (name) {
      SplitText.create(name, { type: 'lines', mask: 'lines', linesClass: 'pre-line' });
      gsap.from(name.querySelectorAll('.pre-line'), {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
        delay: 0.1,
      });
    }
    const state = { p: 0 };
    gsap.to(state, {
      p: 100,
      duration: 2.1,
      ease: 'power3.inOut',
      onUpdate: () => {
        const v = Math.round(state.p);
        count.textContent = String(v);
        fill.style.transform = `scaleX(${state.p / 100})`;
      },
      onComplete: finish,
    });
  }
}
