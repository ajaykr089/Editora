const test = require('node:test');
const assert = require('node:assert/strict');
const { entryPoints, publishableWorkspaces } = require('./packages');

test('entryPoints separates runtime files from typings and strips "./"', () => {
  const { runtime, types } = entryPoints({
    main: 'dist/index.cjs.js',
    module: './dist/index.esm.js',
    types: 'dist/index.d.ts',
  });
  assert.deepEqual(runtime.sort(), ['dist/index.cjs.js', 'dist/index.esm.js']);
  assert.deepEqual(types, ['dist/index.d.ts']);
});

test('entryPoints reads nested exports conditions, treating .d.ts and "types" as typings', () => {
  const { runtime, types } = entryPoints({
    exports: {
      '.': { types: './dist/index.d.ts', import: './dist/index.mjs', require: './dist/index.cjs' },
      './style.css': './dist/style.css',
      './sub': { default: { types: './dist/sub.d.ts', default: './dist/sub.js' } },
    },
  });
  assert.deepEqual(runtime.sort(), ['dist/index.cjs', 'dist/index.mjs', 'dist/style.css', 'dist/sub.js']);
  assert.deepEqual(types.sort(), ['dist/index.d.ts', 'dist/sub.d.ts']);
});

test('entryPoints ignores glob exports, non-relative values and absent fields', () => {
  const { runtime, types } = entryPoints({ exports: { './*': './dist/*.js', './x': 'not-relative.js' } });
  assert.deepEqual(runtime, []);
  assert.deepEqual(types, []);
  assert.deepEqual(entryPoints({}), { runtime: [], types: [] });
});

test('entryPoints includes bin entries as runtime files', () => {
  assert.deepEqual(entryPoints({ bin: 'bin/cli.js' }).runtime, ['bin/cli.js']);
  assert.deepEqual(entryPoints({ bin: { a: './bin/a.js', b: 'bin/b.js' } }).runtime.sort(), ['bin/a.js', 'bin/b.js']);
});

test('publishableWorkspaces excludes private and changeset-ignored packages', () => {
  const names = publishableWorkspaces().map(({ pkg }) => pkg.name);
  assert.ok(names.length > 50, 'expected the monorepo to have many publishable packages');
  assert.ok(names.includes('@editora/core'));
  for (const ignored of ['@editora/ui-vue', '@editora/ui-svelte', '@editora/ui-angular']) {
    assert.ok(!names.includes(ignored), `${ignored} must not be treated as publishable`);
  }
  for (const { pkg } of publishableWorkspaces()) assert.notEqual(pkg.private, true);
});
