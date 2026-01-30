import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    // Enable source maps for production to allow error tracking services
    // (like New Relic) to symbolicate stack traces.
    // Note: Upload .map files to New Relic via CI, do NOT serve them publicly.
    sourcemap: 'hidden',
  },
});
