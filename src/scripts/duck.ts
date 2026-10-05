// Ask the soundtrack (music.ts) to dip to `level` (0–1 of its section level)
// until released with `null`. Safe to call when music is off or absent.
export function duckMusic(key: string, level: number | null, time?: number) {
  window.dispatchEvent(new CustomEvent('music-duck', { detail: { key, level, time } }));
}
