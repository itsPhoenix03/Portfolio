import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch =
  window.matchMedia('(hover: none)').matches ||
  window.matchMedia('(pointer: coarse)').matches;

const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

// -----------------------------------------------------------------------------
// Fit text: size a giant headline so `measure` spans its container exactly.
// -----------------------------------------------------------------------------
function innerWidth(el: HTMLElement): number {
  const cs = getComputedStyle(el);
  return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
}

function fitText(target: HTMLElement, measure: HTMLElement, container: HTMLElement, maxPx = Infinity) {
  target.style.setProperty('--fit', '100px');
  const w = measure.getBoundingClientRect().width;
  if (!w) return;
  const size = Math.min((100 * innerWidth(container)) / w, maxPx);
  target.style.setProperty('--fit', `${size.toFixed(2)}px`);
}

function fitAll() {
  const hero = $('#hero');
  const name = $('#hero-name');
  const word = $('.hero__line--1 .hero__word');
  if (hero && name && word) {
    // Two lines at line-height 0.8 must leave room for the top/bottom rows.
    const maxByHeight = (window.innerHeight - 230) / 1.62;
    fitText(name, word, hero, Math.max(64, maxByHeight));
  }
  const footer = $('#footer-name');
  const footerText = $('.footer__name-text');
  if (footer && footerText && footer.parentElement) {
    fitText(footer, footerText, footer.parentElement);
  }
}

// -----------------------------------------------------------------------------
// Hero: split-letter entrance after the preloader, accent wipe, scroll-out.
// -----------------------------------------------------------------------------
let heroChars: Element[] = [];

function prepareHero() {
  const name = $('#hero-name');
  if (!name) return;
  if (!reduce) {
    heroChars = $$('[data-hero-split]').flatMap(
      (el) => SplitText.create(el, { type: 'chars', mask: 'chars', charsClass: 'split-char' }).chars
    );
    gsap.set(heroChars, { yPercent: 118 });
  }
  // Split the accent overlay the same way so its letter spacing (no kerning
  // once split) lines up exactly with the outlined chars underneath.
  const fill = $('.hero__fill');
  if (fill) SplitText.create(fill, { type: 'chars', charsClass: 'split-char' });
  gsap.set(name, { visibility: 'visible' });
}

function playHero() {
  if (reduce) {
    gsap.set('.hero__fade', { opacity: 1 });
    $('#hero-name')?.classList.add('is-filled');
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to(heroChars, { yPercent: 0, duration: 1.5, stagger: 0.045 }, 0.1)
    .to('.hero__fill', {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.4,
      ease: 'expo.inOut',
      // Drop the outline underneath so no stroke peeks past the filled glyphs.
      onComplete: () => $('#hero-name')?.classList.add('is-filled'),
    }, 0.9)
    .fromTo(
      '.hero__fade',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.07 },
      0.5
    )
    .add(() => setupHeroScroll());
}

function setupHeroScroll() {
  const hero = $('#hero');
  if (!hero) return;
  gsap
    .timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    })
    .to('.hero__line--1', { xPercent: -14, ease: 'none' }, 0)
    .to('.hero__line--2', { xPercent: 10, ease: 'none' }, 0)
    .to('.hero__name', { yPercent: 35, ease: 'none' }, 0)
    .to('.hero__top, .hero__bottom', { opacity: 0, ease: 'none', duration: 0.4 }, 0);

  // Subtle cursor parallax on the two name lines.
  if (!isTouch) {
    const l1 = gsap.quickTo('.hero__line--1', 'x', { duration: 1, ease: 'power3.out' });
    const l2 = gsap.quickTo('.hero__line--2', 'x', { duration: 1.2, ease: 'power3.out' });
    window.addEventListener('mousemove', (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      l1(nx * -28);
      l2(nx * 28);
    });
  }
}

// -----------------------------------------------------------------------------
// Headings: chars rise out of line masks as they enter the viewport.
// -----------------------------------------------------------------------------
function initSplitHeadings() {
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines,chars',
      mask: 'lines',
      linesClass: 'split-line',
      charsClass: 'split-char',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.chars, {
          yPercent: 120,
          rotate: 8,
          duration: 1.2,
          stagger: 0.022,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      },
    });
  });
}

// Statement paragraph: each word brightens as you scroll through it.
function initWordScrub() {
  $$('[data-words]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      wordsClass: 'split-word',
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(
          self.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true },
          }
        );
      },
    });
  });
}

// -----------------------------------------------------------------------------
// Generic reveals
// -----------------------------------------------------------------------------
function initReveals() {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.fromTo(
        els,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out', overwrite: true }
      ),
  });

  $$('[data-line]').forEach((el) =>
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.6,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      }
    )
  );

  // Mono labels decode from random glyphs.
  $$('[data-scramble]').forEach((el) => {
    const text = el.textContent?.trim() ?? '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(el, {
          duration: 1.3,
          scrambleText: { text, chars: '!<>-_/[]{}=+*^?#01', speed: 0.5, revealDelay: 0.15 },
        }),
    });
  });

  // Number counters.
  $$('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const state = { v: 0 };
    el.textContent = (0).toFixed(decimals);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: target,
          duration: 2,
          ease: 'expo.out',
          onUpdate: () => (el.textContent = state.v.toFixed(decimals)),
        }),
    });
  });

  // Image frames wipe open from the bottom, image settles from a zoom.
  $$('[data-clip]').forEach((el) => {
    const img = $('img', el);
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
    tl.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }
    );
    if (img) tl.from(img, { scale: 1.35, duration: 1.8, ease: 'expo.out' }, 0.2);
  });

  // Scrubbed parallax for anything tagged with data-speed (<1 = slower).
  $$('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '1');
    const host = el.parentElement ?? el;
    gsap.fromTo(
      el,
      { yPercent: (1 - speed) * -40 },
      {
        yPercent: (1 - speed) * 40,
        ease: 'none',
        scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
}

// -----------------------------------------------------------------------------
// Marquees: loop forever; scrolling boosts speed and flips direction.
// -----------------------------------------------------------------------------
function initMarquees() {
  const tweens = $$('[data-marquee]').map((el) => {
    const track = $('.marquee__track', el)!;
    const dir = Number(el.dataset.dir || 1);
    const speed = Number(el.dataset.marqueeSpeed || 28);
    const tween = gsap.fromTo(
      track,
      { xPercent: dir > 0 ? -50 : 0 },
      { xPercent: dir > 0 ? 0 : -50, duration: speed, ease: 'none', repeat: -1 }
    );
    // Start deep into the loop so a negative timeScale never hits time 0.
    tween.totalTime(speed * 500);
    return tween;
  });
  if (!tweens.length) return;

  let boost = 1;
  let sign = 1;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      sign = self.direction;
      boost = Math.max(boost, 1 + Math.min(Math.abs(self.getVelocity()) / 260, 7));
    },
  });
  gsap.ticker.add(() => {
    boost += (1 - boost) * 0.05;
    const ts = sign * boost;
    for (const t of tweens) t.timeScale(ts);
  });
}

// -----------------------------------------------------------------------------
// Projects: pinned horizontal scroll (desktop), with per-card parallax.
// -----------------------------------------------------------------------------
function initProjects() {
  const pin = $('.projects__pin');
  const track = $('#proj-track');
  if (!pin || !track) return;

  const count = $('#proj-count');
  const bar = $('#proj-bar');
  const total = $$('.pcard[data-title]', track).length;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (bar) bar.style.transform = `scaleX(${self.progress})`;
          if (count) {
            const i = Math.min(total, Math.floor(self.progress * total) + 1);
            count.textContent = String(i).padStart(2, '0');
          }
        },
      },
    });

    $$('.pcard', track).forEach((card) => {
      gsap.fromTo(
        card,
        { rotate: 5, yPercent: 8 },
        {
          rotate: 0,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: 'left right',
            end: 'left 45%',
            scrub: true,
          },
        }
      );
      const inner = $('[data-hparallax]', card);
      if (inner) {
        gsap.fromTo(
          inner,
          { xPercent: -10 },
          {
            xPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          }
        );
      }
    });
  });
}

// -----------------------------------------------------------------------------
// Footer: giant name rises letter by letter as you reach the bottom.
// -----------------------------------------------------------------------------
function initFooterName() {
  const el = $('.footer__name-text');
  if (!el) return;
  const { chars } = SplitText.create(el, { type: 'chars', charsClass: 'split-char' });
  gsap.fromTo(
    chars,
    { yPercent: 105 },
    {
      yPercent: 0,
      stagger: 0.04,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#footer-name',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1,
      },
    }
  );
}

// -----------------------------------------------------------------------------
// Boot
// -----------------------------------------------------------------------------
const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
const revealed = new Promise<void>((resolve) => {
  if (document.documentElement.dataset.revealed) resolve();
  window.addEventListener('app:reveal', () => resolve(), { once: true });
  window.setTimeout(resolve, 6000); // fallback if the preloader never fires
});

fontsReady.then(() => {
  fitAll();
  prepareHero();

  if (!reduce) {
    initSplitHeadings();
    initWordScrub();
    initReveals();
    initMarquees();
    initProjects();
    initFooterName();
  }

  // Re-fit now that the headlines are split into chars (splitting drops
  // kerning, so the widths change slightly).
  fitAll();
  revealed.then(playHero);
  ScrollTrigger.refresh();
});

let resizeTimer = 0;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    fitAll();
    ScrollTrigger.refresh();
  }, 150);
});

window.addEventListener('load', () => ScrollTrigger.refresh());
