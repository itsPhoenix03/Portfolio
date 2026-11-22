// The pointer itself is a native CSS cursor (see CustomCursor.astro). This
// script only handles the intent label ("VISIT ↗") on elements with
// data-cursor — pinned beside the pointer, no easing — and the magnetic pull
// on .magnetic buttons. No-ops on touch / coarse-pointer devices.

import { setArrowLabel } from '@/scripts/icons';

const isTouch =
  window.matchMedia('(hover: none)').matches ||
  window.matchMedia('(pointer: coarse)').matches;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

if (!isTouch) {
  const label = document.getElementById('cursor-label');

  if (label) {
    // Offset from the pointer tip so the label sits just below-right of it.
    const OFFSET_X = 20;
    const OFFSET_Y = 22;
    let shown = false;
    let x = 0;
    let y = 0;
    const place = () => {
      label.style.transform = `translate(${x + OFFSET_X}px, ${y + OFFSET_Y}px)`;
    };

    // Only moves the label while it's showing — writing its style on every
    // mouse move restyled the page for an invisible element.
    window.addEventListener(
      'mousemove',
      (e) => {
        x = e.clientX;
        y = e.clientY;
        if (shown) place();
      },
      { passive: true }
    );

    // Delegated, so elements created later (e.g. modal content) work too.
    document.addEventListener(
      'mouseover',
      (e) => {
        const intent = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor]');
        if (intent) setArrowLabel(label, intent.dataset.cursor || '');
        if (intent && !shown) {
          x = (e as MouseEvent).clientX;
          y = (e as MouseEvent).clientY;
          place();
        }
        shown = !!intent;
        document.body.classList.toggle('cursor-label-on', shown);
      },
      true
    );

    document.addEventListener('mouseleave', () => {
      shown = false;
      document.body.classList.remove('cursor-label-on');
    });
  }

  // Magnetic element movement — per element (avoids delegation flicker).
  document.querySelectorAll<HTMLElement>('.magnetic, [data-magnetic]').forEach((el) => {
    el.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = clamp((e.clientX - (r.left + r.width / 2)) * 0.35, -18, 18);
      const my = clamp((e.clientY - (r.top + r.height / 2)) * 0.35, -18, 18);
      el.style.transform = `translate(${mx}px, ${my}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}
