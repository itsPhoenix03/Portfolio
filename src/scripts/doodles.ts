// Hand-drawn notes (Doodle.astro) write themselves in when scrolled into view:
// the block line lands, the scribble strikes it out, the correction is "written"
// left to right, then the note and the arrow follow.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Optional parts (circle, note, arrow) may be absent; their tweens just no-op.
gsap.config({ nullTargetWarn: false });

// The strike-out strokes go down one after another at pen speed: the hatch
// and zigzag take a moment, the slash is a quick flick.
function scribbleOut(paths: Element[]) {
  const tl = gsap.timeline();
  const durations = [0.4, 0.5, 0.14];
  paths.forEach((p, i) => {
    tl.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: durations[i] ?? 0.2, ease: 'none' }, i ? '-=0.04' : 0);
  });
  return tl;
}

if (!reduce) {
  document.querySelectorAll<HTMLElement>('[data-doodle]').forEach((el) => {
    const q = (sel: string) => Array.from(el.querySelectorAll<Element>(sel));
    // Generous negative insets so descenders, the tilt and the circle never clip.
    const write = { clipPath: 'inset(-60% 100% -60% -60%)' };
    const written = { clipPath: 'inset(-60% -60% -60% -60%)', ease: 'power2.inOut' };

    const tl = gsap.timeline({ paused: true });
    tl.fromTo(q('.doodle__line'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' })
      .add(scribbleOut(q('.doodle__scribble path')), '+=0.1')
      .fromTo(q('.doodle__fix'), write, { ...written, duration: 0.6 }, '-=0.1')
      .fromTo(q('.doodle__circle path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, '-=0.1')
      .fromTo(q('.doodle__note'), write, { ...written, duration: 0.9 }, '-=0.2')
      .fromTo(q('.doodle__arrow path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, stagger: 0.4, ease: 'power2.out' }, '-=0.5');

    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => tl.play() });
  });
}
