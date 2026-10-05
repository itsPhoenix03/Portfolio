// Build-time generator for the hand-drawn "scribble out" over a struck word
// (Doodle.astro). A real strike-out isn't one tidy zigzag: the pen hacks
// side to side, hacks back over it in uneven zigzags, then slashes through
// once for good measure. The randomness is
// seeded from the word, so the same word always gets the same scribble.

// Mulberry32 — tiny deterministic PRNG.
export function rng(seedText: string) {
  let a = 0;
  for (const ch of seedText) a = (Math.imul(a ^ ch.charCodeAt(0), 2654435761) + 0x9e3779b9) | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = [number, number];
const f = (n: number) => +n.toFixed(1);

// Straight strokes with tight, rounded turns — the way a pen whips back
// without stopping. `k` is how much of each stroke the turn eats into.
function smooth(pts: Pt[], k = 0.2): string {
  const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [ax, ay] = lerp(pts[i], pts[i - 1], k);
    const [bx, by] = lerp(pts[i], pts[i + 1], k);
    d += `L${f(ax)} ${f(ay)}Q${f(pts[i][0])} ${f(pts[i][1])} ${f(bx)} ${f(by)}`;
  }
  const last = pts[pts.length - 1];
  return `${d}L${f(last[0])} ${f(last[1])}`;
}

export interface Scribble {
  /** viewBox width (height is always 40) — scales with the word length. */
  width: number;
  /** Paths in drawing order. */
  paths: { d: string; weight: number }[];
}

export function scribble(word: string): Scribble {
  const rand = rng(word);
  const r = (min: number, max: number) => min + rand() * (max - min);
  const W = Math.max(2, word.length) * 20;
  const H = 40;

  // 1. Hatch: the pen first saws side to side across the word, working its
  //    way down, each line a little crooked and never ending in the same place.
  const hatch: Pt[] = [];
  let y = r(-1, 4);
  let left = rand() > 0.5;
  while (y < H + 1) {
    hatch.push([left ? r(-7, 3) : r(W - 4, W + 7), y]);
    y += r(5.5, 9);
    left = !left;
  }

  // 2. Zigzag: tall strokes leaning "/", hacking over the letters. Some fall
  //    short, spacing wanders and the whole pass drifts up or down a touch.
  const zig: Pt[] = [];
  const drift = r(-5, 5);
  let x = r(-6, -2);
  let up = rand() > 0.5;
  while (x < W + 5) {
    const t = (x / W) * drift;
    const short = rand() < 0.25 ? r(7, 14) : 0;
    zig.push([x + (up ? r(1, 4.5) : 0), (up ? r(-3, 5) + short : r(35, 42) - short) + t]);
    x += r(6, 12);
    up = !up;
  }

  // 3. A long, slightly bowed slash up through the lot.
  const s1y0 = r(30, 38);
  const s1y1 = r(1, 9);
  const slash = `M${f(r(-8, -3))} ${f(s1y0)}C${f(W * 0.35)} ${f(s1y0 - r(8, 14))} ${f(W * 0.65)} ${f(s1y1 + r(4, 9))} ${f(W + r(3, 8))} ${f(s1y1)}`;

  return {
    width: W,
    paths: [
      { d: smooth(hatch, 0.25), weight: 2.3 },
      { d: smooth(zig), weight: 2.7 },
      { d: slash, weight: 3 },
    ],
  };
}
