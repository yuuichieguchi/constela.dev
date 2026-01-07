import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    deps: {
      // Inline monaco-editor to resolve its ESM entry point
      optimizer: {
        web: {
          include: ['monaco-editor'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Alias monaco-editor to its ESM entry point
      'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api',
    },
  },
});
