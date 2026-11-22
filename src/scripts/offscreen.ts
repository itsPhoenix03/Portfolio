// Pause looping CSS animations in sections that are off screen (the rotating
// "say hello" ring, the live dots, the "Current" blink, the hero scroll
// line…). Chrome keeps ticking non-composited animations every frame even
// when they can't be seen, and each tick restyles the page. The section gets
// .is-offscreen; global.css pauses everything inside it.

// Not `main > section`: pinned sections get wrapped in a .pin-spacer.
const sections = document.querySelectorAll<HTMLElement>('main section, main .tapes');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) e.target.classList.toggle('is-offscreen', !e.isIntersecting);
    },
    // Resume a little before a section scrolls in, so loops are already moving.
    { rootMargin: '200px 0px' }
  );
  sections.forEach((el) => io.observe(el));
}
