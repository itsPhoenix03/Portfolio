import gsap from 'gsap';
import { lenisInstance } from '@/scripts/smooth-scroll';

// Counts up to 100 over a black screen, then lifts away to reveal the hero.
// Dispatches `app:reveal` (which kicks off the hero entrance) as it lifts.
const pre = document.getElementById('preloader');
const fill = document.getElementById('preloader-fill');
const count = document.getElementById('preloader-count');

function reveal(): void {
  window.dispatchEvent(new Event('app:reveal'));
}

if (!pre || !fill || !count) {
  reveal();
} else {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  lenisInstance.stop();
  window.scrollTo(0, 0);

  const finish = () => {
    reveal();
    gsap.to(pre, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => {
        pre.style.display = 'none';
        lenisInstance.start();
      },
    });
  };

  if (reduce) {
    count.textContent = '100';
    fill.style.width = '100%';
    finish();
  } else {
    const state = { p: 0 };
    gsap.to(state, {
      p: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(state.p);
        count.textContent = String(v);
        fill.style.width = `${v}%`;
      },
      onComplete: finish,
    });
  }
}
