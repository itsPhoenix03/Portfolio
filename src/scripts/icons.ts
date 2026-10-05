// The site's own arrow icon. Used instead of text glyphs like ↗ / → / ↑, which
// many phones swap for emoji or a system-font glyph that breaks the design.
// One up-right arrow, rotated for the other directions; strokes in
// currentColor and sizes to 1em, so it behaves like the text it replaces.

export type ArrowDir = 'up-right' | 'right' | 'up' | 'down';

const ROTATE: Record<ArrowDir, number> = {
  'up-right': 0,
  right: 45,
  up: -45,
  down: 135,
};

export function arrowSvg(dir: ArrowDir = 'up-right', className = ''): string {
  const r = ROTATE[dir];
  const style = r ? ` style="transform:rotate(${r}deg)"` : '';
  return (
    `<svg class="icon-arrow${className ? ` ${className}` : ''}" viewBox="0 0 24 24" ` +
    `width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2.25" ` +
    `stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false"${style}>` +
    `<path d="M6 18 18 6M8.5 6H18v9.5"/></svg>`
  );
}

// Four-point sparkle star — replaces the ✦ glyph, which phones draw from
// whatever system font they have. 24×24, centred on (12, 12).
export const STAR_PATH = 'M12 0C12.9 7.2 16.8 11.1 24 12 16.8 12.9 12.9 16.8 12 24 11.1 16.8 7.2 12.9 0 12 7.2 11.1 11.1 7.2 12 0Z';

export function starSvg(className = ''): string {
  return (
    `<svg class="icon-star${className ? ` ${className}` : ''}" viewBox="0 0 24 24" ` +
    `width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">` +
    `<path d="${STAR_PATH}"/></svg>`
  );
}

// Tick and close — replace ✓ / ✕ / ×, same reasoning as the arrow.
function strokeIcon(path: string, className: string): string {
  return (
    `<svg class="icon-stroke${className ? ` ${className}` : ''}" viewBox="0 0 24 24" ` +
    `width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2.25" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">` +
    `<path d="${path}"/></svg>`
  );
}

export const checkSvg = (className = '') => strokeIcon('M4.5 12.5 9.5 17.5 19.5 6.5', className);
export const closeSvg = (className = '') => strokeIcon('M6 6 18 18M18 6 6 18', className);

// Trailing arrow glyphs in labels (e.g. data-cursor="Visit ↗") → direction.
const GLYPHS: Record<string, ArrowDir> = { '↗': 'up-right', '→': 'right', '↑': 'up', '↓': 'down' };

/** Split "Visit ↗" into its text and arrow direction (if any). */
export function splitArrowLabel(label: string): { text: string; dir: ArrowDir | null } {
  const trimmed = label.trim();
  const last = trimmed.slice(-1);
  const dir = GLYPHS[last] ?? null;
  return { text: dir ? trimmed.slice(0, -1).trimEnd() : trimmed, dir };
}

/** Fill `el` with a label, rendering any trailing arrow glyph as the SVG icon. */
export function setArrowLabel(el: HTMLElement, label: string): void {
  const { text, dir } = splitArrowLabel(label);
  el.textContent = text;
  if (dir) el.insertAdjacentHTML('beforeend', ` ${arrowSvg(dir)}`);
}
