const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { parseArgs, splitSpec, inspectTarball } = require('./verify-published-packages');

function makeTarball(manifest, files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tarball-test-'));
  const pkgDir = path.join(dir, 'package');
  fs.mkdirSync(pkgDir, { recursive: true });
  fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify(manifest));
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(pkgDir, file)), { recursive: true });
    fs.writeFileSync(path.join(pkgDir, file), '');
  }
  const tgz = path.join(dir, 'out.tgz');
  execFileSync('tar', ['-czf', tgz, '-C', dir, 'package']);
  return { tgz, dir };
}

const manifest = { name: 'x', version: '1.0.0', main: 'dist/index.cjs.js', module: 'dist/index.esm.js', types: 'dist/index.d.ts' };

test('splitSpec handles scoped and unscoped names and rejects non-specs', () => {
  assert.deepEqual(splitSpec('@editora/core@1.0.18'), { name: '@editora/core', version: '1.0.18' });
  assert.deepEqual(splitSpec('left-pad@2.0.0-beta.1'), { name: 'left-pad', version: '2.0.0-beta.1' });
  assert.throws(() => splitSpec('@editora/core'));
  assert.throws(() => splitSpec('core@latest'));
});

test('parseArgs reads flags and environment overrides, and rejects unknown arguments', () => {
  const args = parseArgs(['--ref', 'abc', '--spec', 'a@1.0.0', '--spec', 'b@2.0.0', '--all'], {});
  assert.equal(args.ref, 'abc');
  assert.deepEqual(args.specs, ['a@1.0.0', 'b@2.0.0']);
  assert.equal(args.all, true);
  assert.equal(parseArgs([], {}).ref, 'HEAD');
  assert.equal(parseArgs(['--timeout-minutes', '2'], {}).timeoutMs, 120000);
  assert.equal(parseArgs([], { VERIFY_PUBLISHED_TIMEOUT_MS: '5000', VERIFY_PUBLISHED_INTERVAL_MS: '100' }).timeoutMs, 5000);
  assert.throws(() => parseArgs(['--nope'], {}));
});

test('inspectTarball accepts a complete package', () => {
  const { tgz, dir } = makeTarball(manifest, ['dist/index.cjs.js', 'dist/index.esm.js', 'dist/index.d.ts']);
  try {
    const result = inspectTarball(tgz);
    assert.deepEqual(result.missingRuntime, []);
    assert.deepEqual(result.missingTypes, []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('inspectTarball reports a package published with no dist (the 2026-10-02 incident)', () => {
  const { tgz, dir } = makeTarball(manifest, ['README.md']);
  try {
    const result = inspectTarball(tgz);
    assert.deepEqual(result.missingRuntime.sort(), ['dist/index.cjs.js', 'dist/index.esm.js']);
    assert.deepEqual(result.missingTypes, ['dist/index.d.ts']);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('inspectTarball reports missing typings separately from runtime files (the ui-editor@0.1.6 case)', () => {
  const { tgz, dir } = makeTarball(manifest, ['dist/index.cjs.js', 'dist/index.esm.js']);
  try {
    const result = inspectTarball(tgz);
    assert.deepEqual(result.missingRuntime, []);
    assert.deepEqual(result.missingTypes, ['dist/index.d.ts']);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
