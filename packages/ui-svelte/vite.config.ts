import { defineConfig } from 'vite';

// Attempt to load the Svelte Vite plugin if it's installed. If not, continue
// with an empty plugins array so tooling (like monorepo builds) doesn't fail.
let sveltePlugin: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('@sveltejs/vite-plugin-svelte');
  sveltePlugin = mod && (mod.svelte || mod.default || mod);
} catch (e) {
  sveltePlugin = null;
}

export default defineConfig({
  plugins: sveltePlugin ? [sveltePlugin()] : [],
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['svelte']
    }
  }
});
