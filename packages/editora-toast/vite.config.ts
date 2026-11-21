import { defineConfig } from 'vite';
import path from 'path';

// Three entries share one copy of the toast code (a chunk), so importing two of them still gives one toast manager:
//   index  the API with its stylesheet built in
//   lite   the API without it, for apps that load toast.css themselves
//   react  React content, toast.custom() and <Toaster />
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        lite: 'src/lite.ts',
        react: 'src/react.tsx',
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // The ES and CommonJS builds write into the same folder: keep their chunks apart.
        chunkFileNames: 'chunks/[name]-[hash].[format].js',
        // The shared code is one chunk named after the package (it would otherwise take the name of the lite entry).
        manualChunks: (id) => (/\/src\/(api\.ts|core\/(?!AnimationUtils))/.test(id) ? 'toast' : undefined),
        // React Server Components: the React entry runs on the client (Next.js reads this at the top of the file).
        banner: (chunk) => (chunk.isEntry && chunk.name === 'react' ? '"use client";' : ''),
        exports: 'named',
        interop: 'auto',
        esModule: true,
      },
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2018',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
