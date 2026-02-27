import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Alias missing CSS import from react-kofi to an empty module
      'react-kofi/dist/button.css': path.resolve(__dirname, './src/test/empty-module.ts'),
    },
  },
});
