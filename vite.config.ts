import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
  },
  css: {
    postcss: './postcss.config.mjs',
  },
  server: {
    port: 3000,
  },
});
