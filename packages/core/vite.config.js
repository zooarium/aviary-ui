import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'AviaryCore',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      // @aviary-ui/core is pure JS — no external peer deps to declare.
      // Keep the bundle self-contained.
    },
  },
});
