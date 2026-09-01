import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import netlify from '@netlify/vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss(), netlify()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
