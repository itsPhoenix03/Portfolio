// Easter-egg sound effects, synthesised with Web Audio — no audio files.
// Independent of the music toggle: every one is triggered by something the
// visitor deliberately does (clicking the logo, typing a word, sending the
// form, scrolling hard), so they're the reward for finding the egg rather
// than a surprise. Kept at a modest level.
//
//   knock      — wooden knock on each logo click (backs up the "knock" riddle)
//   radioIn    — mic click + static burst as a team-radio message opens
//   radioBed   — faint band-limited hiss under the "voice"
//   radioOut   — crackle + click as the message ends
//   light      — a beep as each start light comes on
//   jumpStart  — penalty buzzer
//   drs        — flap clack + an air whoosh panning across

import { audioCtx, canPlayAudio } from '@/scripts/audio-engine';

const SFX_LEVEL = 0.35;
// Schedule a hair ahead of "now" so attacks are never clipped.
const LOOKAHEAD = 0.01;

let out: GainNode | null = null;
let noise: AudioBuffer | null = null;

/** The context and output bus, or null if the browser won't allow audio yet. */
function bus(): { ctx: AudioContext; out: GainNode } | null {
  if (!canPlayAudio()) return null;
  const ctx = audioCtx();
  if (!out) {
    out = ctx.createGain();
    out.gain.value = SFX_LEVEL;
    out.connect(ctx.destination);
  }
  return { ctx, out };
}

function noiseSource(ctx: AudioContext): AudioBufferSourceNode {
  if (!noise) {
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  src.loopStart = Math.random(); // different grain each time
  return src;
}

/** Gain node with an attack/decay envelope starting at `t`. */
function envelope(ctx: AudioContext, t: number, peak: number, attack: number, decay: number): GainNode {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  return g;
}

/** Short click — a radio mic key or a mechanical flap. */
function click(ctx: AudioContext, dest: AudioNode, t: number, freq = 2400, level = 0.5) {
  const src = noiseSource(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = 'bandpass';
  hp.frequency.value = freq;
  hp.Q.value = 1.5;
  const g = envelope(ctx, t, level, 0.002, 0.03);
  src.connect(hp).connect(g).connect(dest);
  src.start(t);
  src.stop(t + 0.05);
}

/** Radio static: band-limited noise with random crackle on the amplitude. */
function crackle(ctx: AudioContext, dest: AudioNode, t: number, dur: number, level: number) {
  const src = noiseSource(ctx);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1900;
  bp.Q.value = 0.9;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  for (let x = 0; x < dur; x += 0.012) {
    const v = level * (0.25 + Math.random() * 0.75) * (Math.random() < 0.15 ? 1.6 : 1);
    g.gain.setValueAtTime(v, t + x);
  }
  g.gain.setValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(dest);
  src.start(t);
  src.stop(t + dur + 0.02);
}

export const sfx = {
  /** Knuckle on wood. `n` nudges the pitch so a run of knocks isn't robotic. */
  knock(n = 1) {
    const b = bus();
    if (!b) return;
    const { ctx, out } = b;
    const t = ctx.currentTime + LOOKAHEAD;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const f = 200 + ((n * 37) % 40);
    osc.frequency.setValueAtTime(f, t);
    osc.frequency.exponentialRampToValueAtTime(f * 0.45, t + 0.09);
    const g = envelope(ctx, t, 0.9, 0.003, 0.13);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.16);
    click(ctx, out, t, 1400, 0.35); // the hard edge of the knock
  },

  radioIn() {
    const b = bus();
    if (!b) return;
    const { ctx, out } = b;
    const t = ctx.currentTime + LOOKAHEAD;
    click(ctx, out, t, 2600, 0.9);
    crackle(ctx, out, t + 0.02, 0.18, 0.9);
  },

  /** Faint hiss under the message for `ms`. */
  radioBed(ms: number) {
    const b = bus();
    if (!b) return;
    const { ctx, out } = b;
    crackle(ctx, out, ctx.currentTime + LOOKAHEAD + 0.2, ms / 1000, 0.1);
  },

  radioOut() {
    const b = bus();
    if (!b) return;
    const { ctx, out } = b;
    const t = ctx.currentTime + LOOKAHEAD;
    crackle(ctx, out, t, 0.22, 0.8);
    click(ctx, out, t + 0.22, 2200, 0.8);
  },

  /** One start light coming on. */
  light() {
    const b = bus();
    if (!b) return;
    const { ctx, out } = b;
    const t = ctx.currentTime + LOOKAHEAD;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 784;
    const g = envelope(ctx, t, 0.5, 0.005, 0.16);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.2);
  },

  jumpStart() {
    const b = bus();
    if (!b) return;
    const { ctx, out } = b;
    const t = ctx.currentTime + LOOKAHEAD;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
    g.gain.setValueAtTime(0.4, t + 0.45);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    for (const f of [130, 136]) {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = f; // two detuned saws → a rough buzzer
      osc.connect(lp);
      osc.start(t);
      osc.stop(t + 0.6);
    }
    lp.connect(g).connect(out);
  },

  drs() {
    const b = bus();
    if (!b) return;
    const { ctx, out } = b;
    const t = ctx.currentTime + LOOKAHEAD;
    click(ctx, out, t, 3200, 0.8); // the flap opening
    const src = noiseSource(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.3;
    bp.frequency.setValueAtTime(350, t);
    bp.frequency.exponentialRampToValueAtTime(2800, t + 0.45);
    bp.frequency.exponentialRampToValueAtTime(900, t + 0.9);
    const g = envelope(ctx, t, 1.6, 0.28, 0.6);
    const pan = ctx.createStereoPanner();
    pan.pan.setValueAtTime(-0.8, t);
    pan.pan.linearRampToValueAtTime(0.8, t + 0.9);
    src.connect(bp).connect(g).connect(pan).connect(out);
    src.start(t);
    src.stop(t + 1);
  },
};
