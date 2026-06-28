import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shreyas-misra.vercel.app',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    ssr: {
      noExternal: ['three', 'gsap'],
    },
  },
});
