import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shreyasmisra.dev',
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
