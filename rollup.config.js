import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import path from 'path';

// Get package name from current working directory
const cwd = process.cwd();
const packagePath = cwd.includes('packages/') ? cwd.split('packages/')[1] : '';

if (!packagePath) {
  throw new Error('Build must be run from within a package directory');
}

const input = 'src/index.ts';
const outputDir = 'dist';

const configs = [];

// ESM build
configs.push({
  input,
  output: {
    file: `${outputDir}/index.esm.js`,
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
      outDir: undefined,
      declarationDir: undefined,
      jsx: 'react-jsx'
    }),
    terser()
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime', '@rte-editor/core']
});

// CJS build
configs.push({
  input,
  output: {
    file: `${outputDir}/index.cjs.js`,
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
      outDir: undefined,
      declarationDir: undefined,
      jsx: 'react-jsx'
    }),
    terser()
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime', '@rte-editor/core']
});

// Types build
configs.push({
  input,
  output: {
    file: `${outputDir}/index.d.ts`,
    format: 'esm'
  },
  plugins: [dts({ tsconfig: './tsconfig.json' })],
  external: ['react', 'react-dom', 'react/jsx-runtime', '@rte-editor/core']
});

export default configs;
