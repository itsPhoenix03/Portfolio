// Custom cursor: dot + trailing ring, magnetic pull on interactive elements,
// and an intent label ("VIEW ↗") on elements with data-cursor.
// No-ops on touch / coarse-pointer devices.

const isTouch =
  window.matchMedia('(hover: none)').matches ||
  window.matchMedia('(pointer: coarse)').matches;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

if (!isTouch) {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const label = document.getElementById('cursor-label');

  if (dot && ring) {
    document.body.classList.add('cursor-ready');

    // Elements the ring grows over.
    const hoverSelector = 'a, button, .magnetic, [data-magnetic], [data-cursor]';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let magnetTarget: HTMLElement | null = null;
    let labelOn = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Ring growth + intent label (delegated, so elements created later work).
    document.addEventListener(
      'mouseover',
      (e) => {
        const el = e.target as HTMLElement;
        const t = el?.closest<HTMLElement>(hoverSelector);
        magnetTarget = t && t.matches('.magnetic, [data-magnetic]') ? t : null;
        document.body.classList.toggle('cursor-hover', !!t);

        const intent = el?.closest<HTMLElement>('[data-cursor]');
        if (intent && label) {
          label.textContent = intent.dataset.cursor || '';
          labelOn = true;
        } else {
          labelOn = false;
        }
        document.body.classList.toggle('cursor-label-on', labelOn);
      },
      true
    );

    // Magnetic element movement — per element (avoids delegation flicker).
    document
      .querySelectorAll<HTMLElement>('.magnetic, [data-magnetic]')
      .forEach((el) => {
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

    const tick = () => {
      let targetX = mouseX;
      let targetY = mouseY;
      if (magnetTarget && !labelOn) {
        const rect = magnetTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        targetX = cx + (mouseX - cx) * 0.35;
        targetY = cy + (mouseY - cy) * 0.35;
      }
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }
}
