import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point directly to package source — Vite processes JSX, true HMR, no build step needed.
      '@aviary-ui/core': resolve(__dirname, '../../packages/core/index.js'),
      '@aviary-ui/ui': resolve(__dirname, '../../packages/ui/index.js'),
      '@': resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
});
