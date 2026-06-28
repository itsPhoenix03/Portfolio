// Theme toggle. The initial theme is set pre-paint by an inline script in the
// Layout head; this just handles the toggle button + persistence, and notifies
// the 3D scene via a `themechange` event.
const root = document.documentElement;
const btn = document.getElementById('theme-toggle');

btn?.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* ignore storage errors (private mode) */
  }
  window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
});
