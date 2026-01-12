import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';

const packages = [
  'core',
  'react', 
  'themes',
  'performance',
  'plugins/bold',
  'plugins/italic',
  'plugins/heading',
  'plugins/paragraph',
  'plugins/history',
  'plugins/list',
  'plugins/blockquote',
  'plugins/table',
  'plugins/image',
  'plugins/link',
  'plugins/codeblock'
];

const configs = [];

packages.forEach(pkg => {
  const input = `packages/${pkg}/src/index.ts`;
  const outputDir = `packages/${pkg}/dist`;
  
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
        tsconfig: `packages/${pkg}/tsconfig.json`,
        declaration: false
      }),
      terser()
    ],
    external: ['react', 'react-dom', '@rte-editor/core']
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
        tsconfig: `packages/${pkg}/tsconfig.json`,
        declaration: false
      }),
      terser()
    ],
    external: ['react', 'react-dom', '@rte-editor/core']
  });

  // Types build
  configs.push({
    input,
    output: {
      file: `${outputDir}/index.d.ts`,
      format: 'esm'
    },
    plugins: [dts()],
    external: ['react', 'react-dom', '@rte-editor/core']
  });
});

export default configs;