import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3011,
    strictPort: true,
  },
  preview: {
    port: 4011,
    strictPort: true,
  },
});
