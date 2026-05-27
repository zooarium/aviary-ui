import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'AviaryUI',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      // Everything listed here is NOT bundled — consuming project supplies them.
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        '@tabler/core',
        '@tabler/icons-react',
        '@radix-ui/react-dialog',
        '@radix-ui/react-alert-dialog',
        '@aviary-ui/core',
      ],
    },
  },
});
