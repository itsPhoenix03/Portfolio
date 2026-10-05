// Background soundtrack. Off by default (and browsers block autoplay anyway);
// the header toggle turns it on, and the choice is remembered. Nothing is
// downloaded until it's switched on.
//
// Volume is dynamic: each section has its own level (quieter where there's
// reading to do), and parts of the page can "duck" it for a moment — a team
// radio message, the start lights, an open project, typing in the form. The
// lowest active level wins. Audio runs through a Web Audio gain node, so the
// ramps are smooth and also work on iOS, where element volume is read-only.

import { audioCtx } from '@/scripts/audio-engine';

const MASTER = 0.2; // the track is mastered loud; this sits it under the page

// Per-section level, by section id (multiplied by MASTER).
const SECTION_LEVELS: Record<string, number> = {
  hero: 1,
  about: 0.75,
  skills: 1,
  experience: 0.7,
  projects: 0.9,
  certifications: 0.8,
  contact: 0.7,
};

const STORE_KEY = 'music';
const store = {
  get: () => {
    try {
      return localStorage.getItem(STORE_KEY);
    } catch {
      return null;
    }
  },
  set: (v: string) => {
    try {
      localStorage.setItem(STORE_KEY, v);
    } catch {
      /* private mode etc. — fine, it just won't be remembered */
    }
  },
};

const audio = document.getElementById('soundtrack') as HTMLAudioElement | null;
const toggle = document.getElementById('sound-toggle');

let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let playing = false;
let section = 'hero';
const ducks = new Map<string, number>();

function level(): number {
  if (!playing || document.hidden) return 0;
  let l = SECTION_LEVELS[section] ?? 0.8;
  for (const d of ducks.values()) l = Math.min(l, d);
  return l * MASTER;
}

/** Glide to the current target. `time` ≈ seconds to get most of the way. */
function apply(time = 0.6) {
  if (!ctx || !gain) return;
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.setTargetAtTime(level(), ctx.currentTime, time / 3);
}

function ensureGraph() {
  if (ctx || !audio) return;
  ctx = audioCtx();
  gain = ctx.createGain();
  gain.gain.value = 0;
  ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
}

function render() {
  if (!toggle) return;
  toggle.classList.toggle('is-on', playing);
  toggle.setAttribute('aria-pressed', String(playing));
  toggle.setAttribute('aria-label', playing ? 'Mute music' : 'Play music');
  toggle.dataset.cursor = playing ? 'Mute' : 'Sound on';
}

let pauseTimer = 0;

async function start() {
  if (!audio) return;
  ensureGraph();
  playing = true;
  render();
  window.clearTimeout(pauseTimer);
  try {
    await ctx!.resume();
    await audio.play();
    apply(1.8); // fade in
  } catch {
    // Blocked (no user gesture yet) — wait for the next interaction.
    playing = false;
    render();
  }
}

function stop() {
  playing = false;
  render();
  apply(0.5);
  window.clearTimeout(pauseTimer);
  pauseTimer = window.setTimeout(() => !playing && audio?.pause(), 700);
}

if (audio && toggle) {
  toggle.addEventListener('click', () => {
    if (playing) {
      stop();
      store.set('off');
    } else {
      start();
      store.set('on');
    }
  });

  // Was on last visit: resume on the first interaction (autoplay rules).
  if (store.get() === 'on') {
    const resume = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.('#sound-toggle')) return; // the toggle handles itself
      window.removeEventListener('pointerdown', resume, true);
      window.removeEventListener('keydown', resume, true);
      if (!playing) start();
    };
    window.addEventListener('pointerdown', resume, true);
    window.addEventListener('keydown', resume, true);
  }

  // Section levels: whichever section spans the middle of the screen.
  const sections = Object.keys(SECTION_LEVELS)
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => !!el);
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.target.id !== section) {
          section = e.target.id;
          apply(1.2);
        }
      }
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );
  sections.forEach((s) => io.observe(s));

  // Ducking requests from elsewhere: detail { key, level } — level null releases.
  window.addEventListener('music-duck', (e) => {
    const { key, level: l, time } = (e as CustomEvent<{ key: string; level: number | null; time?: number }>).detail;
    if (l == null) ducks.delete(key);
    else ducks.set(key, l);
    apply(time ?? 0.6);
  });

  // Fade out when the tab is hidden; back in when it returns.
  document.addEventListener('visibilitychange', () => {
    if (!playing || !audio) return;
    if (document.hidden) {
      apply(0.3);
      pauseTimer = window.setTimeout(() => document.hidden && audio.pause(), 500);
    } else {
      window.clearTimeout(pauseTimer);
      audio.play().then(() => apply(1.2)).catch(() => {});
    }
  });
}
