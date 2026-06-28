import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initHeroAnimations() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  const initialsEl = document.getElementById('site-initials');
  if (!initialsEl) return;

  const entrance = gsap.timeline({
    defaults: {
      ease: 'expo.out',
      duration: 1.2,
    },
  });

  entrance.fromTo(
    '.hero__tag',
    { opacity: 0, y: 20, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.8 }
  );

  entrance.fromTo(
    '.hero__name-word',
    { opacity: 0, y: 80, rotateX: -40 },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.15,
      duration: 1.4,
    },
    '-=0.4'
  );

  entrance.fromTo(
    '.hero__hint',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.7 },
    '-=0.5'
  );

  entrance.fromTo(
    '.scrollTo',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.6 },
    '-=0.3'
  );

  entrance.add(() => {
    ScrollTrigger.refresh();
    setupScrollOut();
  });
}

function setupScrollOut() {
  const heroSection = document.getElementById('hero');
  const initialsEl = document.getElementById('site-initials');
  const roleEl = document.getElementById('site-role');
  if (!heroSection || !initialsEl || !roleEl) return;

  // Non-pinned scrub: as you scroll the hero away its text dissolves, while the
  // docked initials (top-left) and role chip (top-right) slide cleanly down
  // from the top edge into their places.
  const scrollOutTl = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  scrollOutTl
    .fromTo(
      '.hero__name-rest',
      { opacity: 1 },
      { opacity: 0, duration: 0.18, ease: 'power1.out' },
      0
    )
    .fromTo(
      '.hero__name-letter',
      { opacity: 1 },
      { opacity: 0, duration: 0.18, ease: 'power1.out' },
      0.04
    )
    .fromTo(
      '.hero__tag',
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 0.85, duration: 0.18, ease: 'power1.out' },
      0
    )
    .fromTo(
      '.hero__name-word',
      { opacity: 1, y: 0 },
      { opacity: 0, y: -20, duration: 0.3, ease: 'power1.out' },
      0.18
    )
    .fromTo(
      '.hero__hint',
      { opacity: 1, y: 0 },
      { opacity: 0, y: -20, duration: 0.2, ease: 'power1.out' },
      0.08
    )
    .fromTo(
      '.scrollTo',
      { opacity: 1, y: 0 },
      { opacity: 0, duration: 0.12, ease: 'none' },
      0
    )
    // Header slides down from the top edge into the corners.
    .fromTo(
      initialsEl,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      0.1
    )
    .fromTo(
      roleEl,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      0.16
    );
}

// Content sections that reveal on scroll (in document order).
const CONTENT_SECTIONS = [
  'about',
  'skills',
  'experience',
  'projects',
  'certifications',
  'contact',
];

function dirOffset(dir: string | undefined): { x?: number; y?: number } {
  if (dir === 'down') return { y: -60 };
  if (dir === 'left') return { x: -70 };
  if (dir === 'right') return { x: 70 };
  return { y: 60 };
}

// Decode/scramble effect: text resolves from random glyphs left-to-right.
// Saves innerHTML so styled markup (e.g. accent spans) is restored at the end.
const SCRAMBLE_GLYPHS = '!<>-_\\/[]{}=+*^?#01:~';
function scrambleText(el: HTMLElement) {
  const finalHTML = el.innerHTML;
  const finalText = el.textContent ?? '';
  if (!finalText.trim()) return;
  const len = finalText.length;
  const duration = 500 + len * 28;
  const startTime = performance.now();

  function frame(now: number) {
    const p = Math.min((now - startTime) / duration, 1);
    const revealed = Math.floor(p * len);
    let out = '';
    for (let i = 0; i < len; i++) {
      const ch = finalText[i];
      if (ch === ' ' || i < revealed) out += ch;
      else
        out +=
          SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(frame);
    else el.innerHTML = finalHTML;
  }
  requestAnimationFrame(frame);
}

// Each section reveals its content once as it scrolls into view, with smooth
// scrubbed parallax for depth. No pinning — the page scrolls continuously so
// there are no hard stops or section-swap seams.
function revealSection(section: HTMLElement) {
  section.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const delay = parseFloat(el.dataset.revealDelay || '0');
    gsap.fromTo(
      el,
      { opacity: 0, ...dirOffset(el.dataset.reveal) },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1,
        delay,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  section.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('.stagger-item');
    if (!items.length) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 45 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: group, start: 'top 82%' },
      }
    );
  });

  const progress = section.querySelector<HTMLElement>('.timeline__progress');
  const timeline = section.querySelector<HTMLElement>('.timeline');
  if (progress && timeline) {
    gsap.fromTo(
      progress,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 70%',
          end: 'bottom 75%',
          scrub: 0.8,
        },
      }
    );
  }

  // Only the decorative layers parallax — content stays put while stacking.
  section.querySelectorAll<HTMLElement>('.ghost-title, .orb').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.3');
    gsap.fromTo(
      el,
      { y: -speed * 240 },
      {
        y: speed * 240,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });

  // Scramble the eyebrow label + heading once as the section comes into view.
  const scrambleTargets = section.querySelectorAll<HTMLElement>(
    '[class$="__eyebrow"], [class$="__title"]'
  );
  if (scrambleTargets.length) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        scrambleTargets.forEach((el, i) =>
          window.setTimeout(() => scrambleText(el), i * 140)
        );
      },
    });
  }
}

function initTilt() {
  const isTouch =
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  const cards = gsap.utils.toArray<HTMLElement>('.tilt');
  cards.forEach((card) => {
    const MAX = 8;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: px * MAX * 2,
        rotateX: -py * MAX * 2,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
        transformOrigin: 'center',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    });
  });
}

// Cursor-tracking spotlight: feed pointer position into each card's CSS vars.
function initSpotlight() {
  const isTouch =
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--my', '-200px');
    });
  });
}

function initSectionAnimations() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce) {
    CONTENT_SECTIONS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) revealSection(section);
    });
  }

  initTilt();
  initSpotlight();
  ScrollTrigger.refresh();
}

// Split each background ghost heading into letters and flicker one at random,
// like a neon sign with a faulty letter. Different letter + timing per heading.
function initGhostFlicker() {
  document.querySelectorAll<HTMLElement>('.ghost-title').forEach((el) => {
    const text = el.textContent ?? '';
    el.textContent = '';
    const letters: HTMLSpanElement[] = [];
    for (const ch of text) {
      const span = document.createElement('span');
      span.className = 'ghost-title__letter';
      span.textContent = ch;
      el.appendChild(span);
      letters.push(span);
    }
    if (!letters.length) return;
    const pick = letters[Math.floor(Math.random() * letters.length)];
    pick.classList.add('flicker');
    pick.style.animationDelay = `${(-Math.random() * 5).toFixed(2)}s`;
  });
}

// The hero entrance waits for the preloader to lift (`app:reveal`) so the user
// actually sees it. Fallback timer in case the preloader never fires.
let heroStarted = false;
function startHero() {
  if (heroStarted) return;
  heroStarted = true;
  initHeroAnimations();
}
window.addEventListener('app:reveal', startHero);

window.addEventListener('load', () => {
  initGhostFlicker();
  initSectionAnimations();
  setTimeout(startHero, 5000);
});

export { initHeroAnimations, initSectionAnimations };
