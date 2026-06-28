// Custom cursor: dot + magnetic ring, magnetic pull on interactive elements,
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

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      if (label) {
        label.style.transform = `translate(${mouseX + 18}px, ${mouseY + 18}px)`;
      }
    });

    // Ring growth (delegated; eased so any flicker is invisible).
    document.addEventListener(
      'mouseover',
      (e) => {
        const t = (e.target as HTMLElement)?.closest<HTMLElement>(hoverSelector);
        if (t) {
          magnetTarget = t;
          document.body.classList.add('cursor-hover');
        }
      },
      true
    );
    document.addEventListener(
      'mouseout',
      (e) => {
        const t = (e.target as HTMLElement)?.closest<HTMLElement>(hoverSelector);
        if (t && t === magnetTarget) {
          magnetTarget = null;
          document.body.classList.remove('cursor-hover');
        }
      },
      true
    );

    // Magnetic element movement — per element (avoids delegation flicker).
    document
      .querySelectorAll<HTMLElement>('.magnetic, [data-magnetic]')
      .forEach((el) => {
        el.style.transition =
          'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        el.addEventListener('mousemove', (e) => {
          const r = el.getBoundingClientRect();
          const mx = clamp((e.clientX - (r.left + r.width / 2)) * 0.3, -14, 14);
          const my = clamp((e.clientY - (r.top + r.height / 2)) * 0.3, -14, 14);
          el.style.transform = `translate(${mx}px, ${my}px)`;
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = '';
        });
      });

    // Intent label.
    if (label) {
      document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          label.textContent = el.dataset.cursor || '';
          document.body.classList.add('cursor-label-on');
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-label-on');
        });
      });
    }

    const tick = () => {
      let targetX = mouseX;
      let targetY = mouseY;
      if (magnetTarget) {
        const rect = magnetTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        targetX = cx + (mouseX - cx) * 0.35;
        targetY = cy + (mouseY - cy) * 0.35;
      }
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
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
