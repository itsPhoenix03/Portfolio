// The wavy path the System Design section travels along. A smooth curve
// (Catmull-Rom, as cubic Béziers) through the stop points. Used at build time
// for the little track map, and at runtime as the camera path, so both agree.

export type Pt = [number, number];

/** Points along the route, in viewport units (1 = one screen width /
 *  height): big "this or that" stops, each followed by a smaller note on how
 *  it played out in practice. Order = travel order. */
export type WaveKind = 'stop' | 'note';
export const WAVE_POINTS: { at: Pt; kind: WaveKind }[] = [
  { at: [0.5, 0.5], kind: 'stop' }, // enter
  { at: [1.3, 0.95], kind: 'note' },
  { at: [2.1, 1.45], kind: 'stop' }, // dips down
  { at: [2.9, 0.95], kind: 'note' },
  { at: [3.7, 0.45], kind: 'stop' }, // up over the crest
  { at: [4.45, 1.2], kind: 'note' },
  { at: [5.3, 2.1], kind: 'stop' }, // down into the deep trough
  { at: [6.1, 1.7], kind: 'note' },
  { at: [6.9, 1.25], kind: 'stop' }, // climbing back
  { at: [7.65, 0.85], kind: 'note' },
  { at: [8.4, 0.5], kind: 'stop' },
  { at: [9.1, 0.42], kind: 'note' }, // end: back out
];

export const WAVE_STOPS: Pt[] = WAVE_POINTS.map((p) => p.at);

/** Size of the whole surface, in viewport units. */
export const WAVE_SIZE: Pt = [9.6, 2.6];

type Seg = [Pt, Pt, Pt, Pt];

export function waveSegments(pts: Pt[] = WAVE_STOPS): Seg[] {
  const segs: Seg[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    segs.push([
      p1,
      [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
      [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
      p2,
    ]);
  }
  return segs;
}

/** Point at `t` (0–1) along one Bézier segment. */
export function segPoint([a, b, c, d]: Seg, t: number): Pt {
  const u = 1 - t;
  const w0 = u * u * u;
  const w1 = 3 * u * u * t;
  const w2 = 3 * u * t * t;
  const w3 = t * t * t;
  return [
    w0 * a[0] + w1 * b[0] + w2 * c[0] + w3 * d[0],
    w0 * a[1] + w1 * b[1] + w2 * c[1] + w3 * d[1],
  ];
}

/** SVG path data for the whole wave, scaled by `sx` / `sy`. */
export function wavePath(sx: number, sy: number, segs = waveSegments()): string {
  const f = (n: number) => +n.toFixed(1);
  const p = (q: Pt) => `${f(q[0] * sx)} ${f(q[1] * sy)}`;
  return segs.reduce((d, [, b, c, e]) => `${d}C${p(b)} ${p(c)} ${p(e)}`, `M${p(segs[0][0])}`);
}
