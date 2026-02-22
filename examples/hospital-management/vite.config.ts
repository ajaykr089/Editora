import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@editora/icons': resolve(__dirname, '../../packages/icons/src/index.ts'),
      '@editora/react-icons': resolve(__dirname, '../../packages/react-icons/src/index.ts'),
      '@editora/ui-core': resolve(__dirname, '../../packages/ui-core/src/index.ts'),
      '@editora/ui-react': resolve(__dirname, '../../packages/ui-react/src/index.tsx'),
      '@editora/toast/toast.css': resolve(__dirname, '../../packages/editora-toast/src/toast.css'),
      '@editora/toast': resolve(__dirname, '../../packages/editora-toast/src/index.ts'),
      '@editora/editor': resolve(__dirname, '../../packages/react/src/index.ts'),
      '@editora/core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@editora/plugins': resolve(__dirname, '../../packages/plugins/src/index.ts')
    }
  },
  server: {
    port: 4180
  }
});
