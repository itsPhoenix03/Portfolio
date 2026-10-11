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

  // ---- Background sketches: fill the gaps between stops, drawn fainter. ----

  // Users → load balancer → servers.
  lb() {
    const p = pen('lb');
    p.box(8, 58, 64, 34);
    p.text(40, 80, 'USERS', 'block', 'ink', 13);
    p.arrow(78, 75, 116, 75, -2);
    p.path('M152 44L186 75L152 106L118 75L152 44', 'ink');
    p.text(152, 80, 'LB', 'block', 'ink', 15);
    p.arrow(190, 70, 252, 24, -6);
    p.arrow(192, 75, 252, 77, 0);
    p.arrow(190, 80, 252, 128, 6);
    p.box(258, 8, 58, 30);
    p.box(258, 62, 58, 30);
    p.box(258, 114, 58, 30);
    p.text(287, 28, 'S1', 'block', 'ink', 13);
    p.text(287, 82, 'S2', 'block', 'ink', 13);
    p.text(287, 134, 'S3', 'block', 'ink', 13);
    p.text(152, 140, 'round robin', 'script', 'hi', 18);
    return { w: 330, h: 152, body: p.body() };
  },

  // App → cache (hit) / → DB (miss).
  cache() {
    const p = pen('cache');
    p.box(10, 64, 66, 36);
    p.text(43, 87, 'APP', 'block', 'ink', 14);
    p.arrow(82, 70, 132, 46, -4);
    p.box(138, 22, 84, 40);
    p.text(180, 47, 'CACHE', 'block', 'ink', 14);
    p.text(104, 40, 'hit', 'script', 'hi', 18);
    p.tick(240, 40, 11);
    p.arrow(82, 94, 196, 128, 8);
    p.text(130, 132, 'miss', 'script', 'ink', 18);
    p.cylinder(204, 96, 64, 62);
    p.text(236, 136, 'DB', 'block', 'ink', 14);
    p.text(232, 14, 'TTL 60 s', 'script', 'hi', 16);
    return { w: 285, h: 166, body: p.body() };
  },

  // A globe with edge nodes around it.
  cdn() {
    const p = pen('cdn');
    p.loop(110, 86, 60, 60, 1.05);
    p.loop(110, 86, 24, 60, 1.03, 'ink', -1.6);
    p.line(52, 86, 168, 86);
    p.path('M62 58Q110 70 158 58');
    p.path('M62 114Q110 102 158 114');
    for (const [x, y] of [[26, 26], [200, 34], [210, 140], [22, 150]] as [number, number][]) {
      p.loop(x, y, 7, 7, 1.05, 'hi');
      p.line(x + (x < 110 ? 8 : -8), y + (y < 86 ? 6 : -6), 110 + (x < 110 ? -40 : 40), 86 + (y < 86 ? -36 : 36), 2, 'hi');
    }
    p.text(110, 176, 'cache at the edge', 'script', 'hi', 18);
    return { w: 232, h: 184, body: p.body() };
  },

  // One table split three ways by key.
  shard() {
    const p = pen('shard');
    p.box(8, 66, 70, 36);
    p.text(43, 89, 'USERS', 'block', 'ink', 13);
    p.arrow(84, 76, 150, 30, -6);
    p.arrow(86, 84, 150, 86, 0);
    p.arrow(84, 92, 150, 142, 6);
    p.cylinder(158, 6, 58, 50);
    p.cylinder(158, 62, 58, 50);
    p.cylinder(158, 118, 58, 50);
    p.text(187, 42, 'A-H', 'block', 'ink', 12);
    p.text(187, 98, 'I-P', 'block', 'ink', 12);
    p.text(187, 154, 'Q-Z', 'block', 'ink', 12);
    p.text(262, 90, 'shard key', 'script', 'hi', 19);
    return { w: 300, h: 176, body: p.body() };
  },

  // Primary takes writes, replicas take reads.
  replica() {
    const p = pen('replica');
    p.cylinder(18, 40, 76, 96);
    p.text(56, 104, 'PRIMARY', 'block', 'ink', 11);
    p.text(56, 162, 'writes', 'script', 'hi', 19);
    p.arrow(102, 70, 184, 34, -6);
    p.arrow(102, 104, 184, 130, 6);
    p.text(140, 92, 'async', 'script', 'ink', 15);
    p.cylinder(192, 8, 62, 58);
    p.cylinder(192, 100, 62, 58);
    p.text(223, 48, 'R1', 'block', 'ink', 13);
    p.text(223, 140, 'R2', 'block', 'ink', 13);
    p.text(223, 178, 'reads', 'script', 'hi', 19);
    return { w: 270, h: 186, body: p.body() };
  },

  // Consistent hashing ring.
  ring() {
    const p = pen('ring');
    p.loop(110, 104, 72, 72, 1.04);
    const nodes: [number, string][] = [[-1.9, 'N1'], [-0.3, 'N2'], [1.5, 'N3'], [2.6, 'N4']];
    for (const [a, label] of nodes) {
      const x = 110 + Math.cos(a) * 72;
      const y = 104 + Math.sin(a) * 72;
      p.loop(x, y, 8, 8, 1.05, 'hi');
      p.text(110 + Math.cos(a) * 98, 104 + Math.sin(a) * 98 + 5, label, 'block', 'ink', 13);
    }
    p.arrow(110 + Math.cos(-1.2) * 50, 104 + Math.sin(-1.2) * 50, 110 + Math.cos(-0.45) * 62, 104 + Math.sin(-0.45) * 62, 6, 'ink', 7);
    p.text(110, 110, 'hash(key)', 'script', 'hi', 17);
    return { w: 230, h: 214, body: p.body() };
  },

  // Token bucket rate limiter.
  bucket() {
    const p = pen('bucket');
    p.path('M40 66L58 168Q100 178 142 168L160 66');
    p.loop(100, 66, 60, 10, 1.04);
    for (const [x, y] of [[78, 148], [100, 152], [122, 148], [88, 128], [112, 130], [100, 108]] as [number, number][]) p.loop(x, y, 8, 8, 1.05, 'hi');
    p.arrow(100, 6, 100, 50, 0);
    p.text(132, 24, 'refill', 'script', 'hi', 17, 'start');
    p.text(100, 200, '10 REQ / S', 'block', 'ink', 15);
    return { w: 200, h: 208, body: p.body() };
  },

  // Circuit breaker states.
  breaker() {
    const p = pen('breaker');
    p.box(8, 40, 86, 34);
    p.box(150, 40, 70, 34);
    p.box(276, 40, 70, 34);
    p.text(51, 63, 'CLOSED', 'block', 'ink', 13);
    p.text(185, 63, 'OPEN', 'block', 'x', 13);
    p.text(311, 63, 'HALF', 'block', 'ink', 13);
    p.arrow(100, 52, 144, 52, -4);
    p.text(122, 30, 'fails', 'script', 'x', 15);
    p.arrow(226, 52, 270, 52, -4);
    p.text(248, 30, 'timeout', 'script', 'ink', 15);
    p.arrow(300, 82, 60, 82, -34, 'hi');
    p.text(180, 122, 'ok, so close', 'script', 'hi', 17);
    return { w: 354, h: 134, body: p.body() };
  },

  // CAP theorem.
  cap() {
    const p = pen('cap');
    p.line(110, 22, 194, 168);
    p.line(194, 168, 26, 168);
    p.line(26, 168, 110, 22);
    p.text(110, 16, 'C', 'block', 'ink', 24);
    p.text(14, 186, 'A', 'block', 'ink', 24);
    p.text(206, 186, 'P', 'block', 'ink', 24);
    p.text(110, 124, 'pick two', 'script', 'hi', 20);
    p.cross(68, 95, 18, 18);
    return { w: 220, h: 196, body: p.body() };
  },

  // Request / response sequence for an async job.
  seq() {
    const p = pen('seq');
    p.text(46, 18, 'CLIENT', 'block', 'ink', 13);
    p.text(214, 18, 'API', 'block', 'ink', 13);
    p.line(46, 28, 46, 196);
    p.line(214, 28, 214, 196);
    p.arrow(50, 56, 208, 56, -2);
    p.text(130, 48, 'POST /jobs', 'script', 'ink', 15);
    p.arrow(210, 94, 52, 94, -2, 'hi');
    p.text(130, 86, '202 + job id', 'script', 'hi', 15);
    p.arrow(50, 132, 208, 132, -2);
    p.text(130, 124, 'GET /status', 'script', 'ink', 15);
    p.arrow(210, 170, 52, 170, -2, 'hi');
    p.text(130, 162, 'done', 'script', 'hi', 15);
    p.tick(160, 158, 7);
    return { w: 260, h: 202, body: p.body() };
  },

  // Latency numbers every engineer should know (roughly).
  latency() {
    const p = pen('latency');
    p.text(10, 22, 'LATENCY', 'block', 'ink', 16, 'start');
    p.text(10, 56, 'memory  ~100 ns', 'script', 'ink', 18, 'start');
    p.text(10, 88, 'SSD read  ~0.1 ms', 'script', 'ink', 18, 'start');
    p.text(10, 120, 'cross-region  ~150 ms', 'script', 'hi', 18, 'start');
    p.line(10, 128, 196, 126, 1, 'x');
    p.arrow(222, 40, 222, 122, 3);
    return { w: 240, h: 136, body: p.body() };
  },

  // Cache expiry clock.
  ttl() {
    const p = pen('ttl');
    p.loop(56, 58, 42, 42, 1.06);
    p.line(56, 58, 56, 30, 0);
    p.line(56, 58, 76, 68, 0);
    p.text(122, 52, 'TTL', 'block', 'ink', 17, 'start');
    p.text(122, 80, 'expire it', 'script', 'hi', 18, 'start');
    return { w: 200, h: 112, body: p.body() };
  },

  // Queue depth rising, workers scaling to meet it.
  depth() {
    const p = pen('depth');
    p.line(14, 8, 14, 128);
    p.line(14, 128, 236, 128);
    const bars = [22, 38, 64, 92, 70, 44, 26];
    bars.forEach((h, i) => p.box(26 + i * 29, 126 - h, 18, h));
    p.path('M30 96L59 90L88 70L117 40L146 36L175 40L204 44', 'hi');
    p.text(120, 150, 'queue depth', 'script', 'ink', 17);
    p.text(204, 28, 'workers', 'script', 'hi', 16);
    return { w: 245, h: 158, body: p.body() };
  },

  // Same key, same result.
  idem() {
    const p = pen('idem');
    p.text(8, 26, 'IDEMPOTENCY-KEY', 'block', 'ink', 15, 'start');
    p.text(8, 56, '7f3a-91c2', 'script', 'hi', 22, 'start');
    p.arrow(120, 50, 170, 50, -3);
    p.box(176, 30, 64, 32);
    p.text(208, 52, '1 JOB', 'block', 'ink', 12);
    p.text(124, 92, 'retry twice, run once', 'script', 'ink', 17);
    return { w: 250, h: 102, body: p.body() };
  },

  // API gateway in front of services.
  gateway() {
    const p = pen('gateway');
    p.box(10, 56, 90, 40);
    p.text(55, 81, 'GATEWAY', 'block', 'ink', 13);
    p.text(55, 118, 'auth · limits', 'script', 'hi', 15);
    p.arrow(106, 66, 168, 24, -6);
    p.arrow(108, 76, 168, 76, 0);
    p.arrow(106, 86, 168, 128, 6);
    p.text(176, 29, '/users', 'script', 'ink', 17, 'start');
    p.text(176, 81, '/jobs', 'script', 'ink', 17, 'start');
    p.text(176, 133, '/docs', 'script', 'ink', 17, 'start');
    return { w: 240, h: 144, body: p.body() };
  },
};

/** Where each sketch sits on the route (viewport units, like the stops), its
 *  width in px at a 1440px-wide screen, and a little tilt. `bg` sketches fill
 *  the gaps between stops: drawn fainter, and often half off-screen when the
 *  view comes to rest — they're there for the journey, not the stop. */
export const doodles: { art: string; at: [number, number]; w: number; rot: number; bg?: boolean }[] = [
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

  { art: 'lb', at: [0.42, 1.06], w: 330, rot: 2, bg: true },
  { art: 'cdn', at: [1.05, 0.16], w: 210, rot: -4, bg: true },
  { art: 'shard', at: [1.2, 1.8], w: 290, rot: -3, bg: true },
  { art: 'cache', at: [2.12, 0.55], w: 285, rot: 3, bg: true },
  { art: 'replica', at: [2.95, 1.78], w: 260, rot: 2, bg: true },
  { art: 'seq', at: [3.45, 1.02], w: 250, rot: -2, bg: true },
  { art: 'depth', at: [1.78, 0.98], w: 230, rot: -3, bg: true },
  { art: 'idem', at: [5.55, 1.32], w: 240, rot: 3, bg: true },
  { art: 'bucket', at: [4.15, 2.05], w: 180, rot: 4, bg: true },
  { art: 'ring', at: [5.0, 0.52], w: 220, rot: 0, bg: true },
  { art: 'breaker', at: [6.0, 1.0], w: 330, rot: -2, bg: true },
  { art: 'cap', at: [6.35, 2.25], w: 200, rot: 3, bg: true },
  { art: 'gateway', at: [7.08, 0.28], w: 240, rot: -3, bg: true },
  { art: 'latency', at: [7.45, 1.88], w: 240, rot: 2, bg: true },
  { art: 'ttl', at: [8.35, 1.25], w: 190, rot: -4, bg: true },

  // Placed by sampling the camera path for empty stretches mid-scroll.
  { art: 'ttl', at: [2.26, 0.99], w: 170, rot: 5, bg: true },
  { art: 'cdn', at: [4.34, 0.46], w: 190, rot: 3, bg: true },
  { art: 'cap', at: [3.98, 1.2], w: 180, rot: -5, bg: true },
  { art: 'cache', at: [4.96, 1.22], w: 250, rot: -2, bg: true },
  { art: 'lb', at: [4.96, 1.72], w: 260, rot: 3, bg: true },
  { art: 'shard', at: [4.64, 1.95], w: 240, rot: -3, bg: true },
  { art: 'replica', at: [5.97, 2.26], w: 230, rot: -2, bg: true },
  { art: 'bucket', at: [7.04, 0.77], w: 160, rot: -4, bg: true },
  { art: 'depth', at: [7.79, 0.43], w: 220, rot: 3, bg: true },
];

export function doodleArt(name: string): DoodleArt {
  return art[name]();
}
