import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  server: {
    port: 3010,
    strictPort: true,
  },
  preview: {
    port: 4010,
    strictPort: true,
  },
});
