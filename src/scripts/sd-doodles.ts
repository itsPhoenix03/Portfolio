// Build-time sketches for the System Design section: little hand-drawn
// diagrams, arrows, crosses and ticks scattered along the route. Each stroke
// is a path with pathLength="1", so the runtime can draw it on by animating
// stroke-dashoffset from 1 to 0. Jitter is seeded, so builds are stable.

import { rng } from './scribble';
import { STAR_PATH } from './icons';

type Ink = 'ink' | 'hi' | 'x';

export interface DoodleArt {
  w: number;
  h: number;
  body: string;
}

const f = (n: number) => +n.toFixed(1);

function pen(seed: string) {
  const rand = rng(seed);
  const jit = (a = 1.5) => (rand() - 0.5) * 2 * a;
  const out: string[] = [];

  const path = (d: string, ink: Ink = 'ink', extra = '') =>
    out.push(`<path class="dd-${ink}" pathLength="1" d="${d}"${extra}/>`);

  const text = (x: number, y: number, s: string, kind: 'script' | 'block', ink: Ink = 'ink', size = 18, anchor = 'middle') =>
    out.push(
      `<text class="dd-${kind} dd-t-${ink}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`
    );

  // A slightly bowed stroke from a to b.
  const line = (x1: number, y1: number, x2: number, y2: number, bow = 0, ink: Ink = 'ink') => {
    const L = Math.hypot(x2 - x1, y2 - y1) || 1;
    const b = bow + jit(1.2);
    const cx = (x1 + x2) / 2 + (-(y2 - y1) / L) * b;
    const cy = (y1 + y2) / 2 + ((x2 - x1) / L) * b;
    path(`M${f(x1 + jit(0.8))} ${f(y1 + jit(0.8))}Q${f(cx)} ${f(cy)} ${f(x2 + jit(0.8))} ${f(y2 + jit(0.8))}`, ink);
  };

  // One continuous stroke round a box, overshooting where it started.
  const box = (x: number, y: number, w: number, h: number, ink: Ink = 'ink') => {
    const c: [number, number][] = [[x + w, y], [x + w, y + h], [x, y + h], [x, y], [x + w * 0.18, y - 1]];
    let px = x - 2;
    let py = y + 3;
    let d = `M${f(px + jit())} ${f(py + jit())}`;
    for (const [qx, qy] of c) {
      d += `Q${f((px + qx) / 2 + jit(1.6))} ${f((py + qy) / 2 + jit(1.6))} ${f(qx + jit(1.2))} ${f(qy + jit(1.2))}`;
      px = qx;
      py = qy;
    }
    path(d, ink);
  };

  const arrow = (x1: number, y1: number, x2: number, y2: number, bow = 0, ink: Ink = 'ink', head = 9) => {
    const L = Math.hypot(x2 - x1, y2 - y1) || 1;
    const cx = (x1 + x2) / 2 + (-(y2 - y1) / L) * bow;
    const cy = (y1 + y2) / 2 + ((x2 - x1) / L) * bow;
    path(`M${f(x1)} ${f(y1)}Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}`, ink);
    const a = Math.atan2(y2 - cy, x2 - cx);
    const h = (s: number) => `${f(x2 - head * Math.cos(a + s))} ${f(y2 - head * Math.sin(a + s))}`;
    path(`M${h(-0.5)}L${f(x2)} ${f(y2)}L${h(0.5)}`, ink);
  };

  // Hand-drawn loop (ellipse-ish); returns where the pen ended.
  const loop = (cx: number, cy: number, rx: number, ry: number, turns = 1.08, ink: Ink = 'ink', start = -2.2) => {
    const n = Math.round(26 * turns);
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const a = start + (i / n) * turns * Math.PI * 2;
      const k = 1 + jit(0.04);
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [x, y] = pts[i];
      const [nx, ny] = pts[i + 1];
      d += `Q${f(x)} ${f(y)} ${f((x + nx) / 2)} ${f((y + ny) / 2)}`;
    }
    const end = pts[pts.length - 1];
    path(`${d}L${f(end[0])} ${f(end[1])}`, ink);
    return { end, prev: pts[pts.length - 3] };
  };

  const cross = (cx: number, cy: number, w: number, h: number, ink: Ink = 'x') => {
    line(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, 4, ink);
    line(cx + w / 2 - 4, cy - h / 2 - 2, cx - w / 2 + 3, cy + h / 2 + 3, -5, ink);
  };

  const tick = (cx: number, cy: number, s: number, ink: Ink = 'hi') =>
    path(
      `M${f(cx - s)} ${f(cy - s * 0.05)}Q${f(cx - s * 0.6)} ${f(cy + s * 0.25)} ${f(cx - s * 0.25)} ${f(cy + s * 0.7)}` +
        `Q${f(cx + s * 0.15)} ${f(cy - s * 0.1)} ${f(cx + s)} ${f(cy - s * 0.95)}`,
      ink
    );

  const cylinder = (x: number, y: number, w: number, h: number, ink: Ink = 'ink') => {
    const rx = w / 2;
    const ry = h * 0.13;
    loop(x + rx, y + ry, rx, ry, 1.04, ink, Math.PI);
    line(x, y + ry, x, y + h - ry, 0, ink);
    line(x + w, y + ry, x + w, y + h - ry, 0, ink);
    const b = y + h - ry;
    path(`M${f(x)} ${f(b)}C${f(x + 2)} ${f(b + ry * 1.35)} ${f(x + w - 2)} ${f(b + ry * 1.35)} ${f(x + w)} ${f(b)}`, ink);
    path(`M${f(x)} ${f(y + h * 0.42)}C${f(x + 2)} ${f(y + h * 0.42 + ry * 1.3)} ${f(x + w - 2)} ${f(y + h * 0.42 + ry * 1.3)} ${f(x + w)} ${f(y + h * 0.42)}`, ink);
  };

  // Outline star, scaled; stroke width compensated so it matches the rest.
  const star = (cx: number, cy: number, s: number, ink: Ink = 'hi') =>
    path(STAR_PATH, ink, ` transform="translate(${f(cx - s / 2)} ${f(cy - s / 2)}) scale(${f(s / 24)})" style="stroke-width:${f((2 * 24) / s)}"`);

  return { path, text, line, box, arrow, loop, cross, tick, cylinder, star, body: () => out.join('') };
}

// ---- The sketches -----------------------------------------------------------

const art: Record<string, () => DoodleArt> = {
  // API → queue → workers.
  flow() {
    const p = pen('flow');
    p.box(10, 42, 70, 44);
    p.text(45, 71, 'API', 'block', 'ink', 19);
    p.arrow(88, 64, 138, 62, -4);
    p.box(146, 42, 78, 44);
    p.line(166, 45, 166, 84);
    p.line(186, 45, 186, 84);
    p.line(206, 45, 206, 84);
    p.text(185, 112, 'queue', 'script', 'hi', 24);
    p.arrow(232, 56, 278, 30, -6);
    p.arrow(232, 72, 278, 100, 6);
    p.box(284, 12, 66, 34);
    p.box(284, 86, 66, 34);
    p.text(317, 35, 'W1', 'block', 'ink', 15);
    p.text(317, 109, 'W2', 'block', 'ink', 15);
    p.text(317, 72, 'workers', 'script', 'hi', 18);
    return { w: 360, h: 130, body: p.body() };
  },

  // "40 s wait" crossed out.
  nope() {
    const p = pen('nope');
    p.text(115, 60, '40 S WAIT', 'block', 'ink', 36);
    p.cross(115, 48, 190, 62);
    p.text(118, 100, 'not on a request', 'script', 'hi', 21);
    return { w: 230, h: 110, body: p.body() };
  },

  // A log fanning out to several readers.
  fanout() {
    const p = pen('fanout');
    p.box(10, 58, 84, 40);
    p.line(34, 61, 34, 96);
    p.line(52, 61, 52, 96);
    p.line(70, 61, 70, 96);
    p.text(52, 44, 'replayable', 'script', 'hi', 19);
    p.arrow(100, 72, 190, 26, -8);
    p.arrow(100, 78, 190, 78, 0);
    p.arrow(100, 84, 190, 130, 8);
    p.box(196, 10, 58, 30);
    p.box(196, 63, 58, 30);
    p.box(196, 116, 58, 30);
    p.text(225, 31, 'A', 'block', 'ink', 15);
    p.text(225, 84, 'B', 'block', 'ink', 15);
    p.text(225, 137, 'C', 'block', 'ink', 15);
    return { w: 270, h: 156, body: p.body() };
  },

  // One-way vs both-ways.
  ways() {
    const p = pen('ways');
    p.box(10, 16, 68, 34);
    p.box(222, 16, 68, 34);
    p.text(44, 39, 'SRV', 'block', 'ink', 15);
    p.text(256, 39, 'USER', 'block', 'ink', 15);
    p.arrow(86, 34, 212, 34, -3);
    p.text(149, 22, 'one way', 'script', 'hi', 19);
    p.box(10, 96, 68, 34);
    p.box(222, 96, 68, 34);
    p.text(44, 119, 'SRV', 'block', 'ink', 15);
    p.text(256, 119, 'USER', 'block', 'ink', 15);
    p.arrow(86, 106, 212, 106, -2);
    p.arrow(212, 122, 86, 122, -2);
    p.text(149, 152, 'both ways', 'script', 'hi', 19);
    return { w: 300, h: 160, body: p.body() };
  },

  // Retry loop.
  retry() {
    const p = pen('retry');
    const { end, prev } = p.loop(86, 74, 62, 50, 0.84, 'ink', -1.9);
    p.arrow(prev[0], prev[1], end[0] + 2, end[1] + 2, 0, 'ink', 11);
    p.text(86, 86, 'X3', 'block', 'ink', 34);
    p.text(150, 150, '+ jitter', 'script', 'hi', 24);
    return { w: 210, h: 160, body: p.body() };
  },

  // Spiky latency vs a flat p99.
  graph() {
    const p = pen('graph');
    p.line(20, 10, 20, 140);
    p.line(20, 140, 272, 140);
    p.path('M24 112L48 104L68 113L90 38L106 118L128 98L148 109L170 30L186 113L210 100L238 108', 'x');
    p.path('M24 90Q140 84 264 88', 'hi');
    p.text(266, 76, 'p99', 'script', 'hi', 24, 'end');
    p.text(170, 20, 'spike', 'script', 'x', 19);
    return { w: 285, h: 150, body: p.body() };
  },

  // Rows vs documents.
  db() {
    const p = pen('db');
    p.cylinder(14, 18, 92, 112);
    p.text(60, 100, 'SQL', 'block', 'ink', 22);
    p.text(60, 158, 'rows', 'script', 'hi', 22);
    p.box(158, 22, 84, 30);
    p.box(168, 62, 84, 30);
    p.box(154, 102, 84, 30);
    p.text(200, 42, '{ }', 'block', 'ink', 15);
    p.text(210, 82, '{ }', 'block', 'ink', 15);
    p.text(196, 122, '{ }', 'block', 'ink', 15);
    p.text(204, 160, 'docs', 'script', 'hi', 22);
    return { w: 265, h: 168, body: p.body() };
  },

  // One big box vs many small ones.
  upout() {
    const p = pen('upout');
    p.box(18, 12, 62, 124);
    p.line(26, 40, 72, 40);
    p.line(26, 64, 72, 64);
    p.line(26, 88, 72, 88);
    p.line(26, 112, 72, 112);
    p.text(49, 162, 'up', 'script', 'hi', 24);
    for (const [x, y] of [[124, 34], [166, 30], [208, 36], [128, 82], [170, 78], [212, 84]]) p.box(x, y, 32, 32);
    p.text(186, 146, 'out', 'script', 'hi', 24);
    return { w: 260, h: 170, body: p.body() };
  },

  // "it depends…" with a curly arrow.
  depends() {
    const p = pen('depends');
    p.text(84, 38, 'it depends…', 'script', 'hi', 32);
    p.path('M128 50C176 48 196 70 176 90C158 108 132 86 162 78C194 70 208 96 210 116');
    p.path('M200 106L210 118L218 104');
    return { w: 230, h: 126, body: p.body() };
  },

  // Tick + "ship it".
  ship() {
    const p = pen('ship');
    p.tick(42, 52, 30);
    p.loop(42, 52, 40, 36, 1.1, 'ink', -2.6);
    p.text(132, 62, 'ship it', 'script', 'ink', 30);
    return { w: 190, h: 104, body: p.body() };
  },

  // A few sparkles.
  stars() {
    const p = pen('stars');
    p.star(30, 30, 28);
    p.star(86, 58, 18);
    p.star(38, 84, 12);
    return { w: 110, h: 100, body: p.body() };
  },
};

/** Where each sketch sits on the route (viewport units, like the stops), its
 *  width in px at a 1440px-wide screen, and a little tilt. */
export const doodles: { art: string; at: [number, number]; w: number; rot: number }[] = [
  { art: 'nope', at: [1.04, 0.66], w: 230, rot: -6 },
  { art: 'flow', at: [1.32, 1.25], w: 360, rot: -2 },
  { art: 'fanout', at: [3.14, 0.64], w: 270, rot: 3 },
  { art: 'stars', at: [2.66, 1.2], w: 110, rot: 0 },
  { art: 'depends', at: [4.2, 0.9], w: 230, rot: -4 },
  { art: 'ways', at: [4.5, 1.49], w: 300, rot: 2 },
  { art: 'stars', at: [5.86, 1.42], w: 90, rot: 20 },
  { art: 'retry', at: [6.4, 1.68], w: 210, rot: -3 },
  { art: 'upout', at: [7.38, 0.56], w: 260, rot: -3 },
  { art: 'graph', at: [7.7, 1.13], w: 285, rot: 2 },
  { art: 'db', at: [9.1, 0.71], w: 265, rot: -2 },
  { art: 'ship', at: [9.4, 0.18], w: 190, rot: -5 },
];

export function doodleArt(name: string): DoodleArt {
  return art[name]();
}
