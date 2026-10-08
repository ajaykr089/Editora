#!/usr/bin/env node
/**
 * Post-publish check: downloads what was actually published and confirms it is usable.
 *
 * verify-package-contents.js runs before `changeset publish` and cannot see what `npm publish` does
 * next: lifecycle hooks (`prepare`, `prepublishOnly`) re-run builds that empty `dist/`, which is how
 * @editora/ui-editor@0.1.6 went out without its typings after the pre-publish check had passed. This
 * looks at the real artifact instead: for each version just released it waits for the registry to
 * serve it, packs the published tarball, and checks that every runtime entry point and typings file
 * named by the *published* package.json is inside.
 *
 *   node scripts/verify-published-packages.js                 packages tagged at HEAD (this release)
 *   node scripts/verify-published-packages.js --ref <rev>     packages tagged at another commit
 *   node scripts/verify-published-packages.js --all           the latest version of every package
 *   node scripts/verify-published-packages.js --spec a@1.0.0  specific versions (repeatable)
 *
 * New versions take a few minutes to become visible, so it polls (default up to 20 minutes). It exits
 * non-zero on any failure; by then the versions are already on npm, so the point is to fail loudly
 * and name them, not to undo anything.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { root, publishableWorkspaces, entryPoints } = require('./lib/packages');

const REGISTRY = 'https://registry.npmjs.org';

function parseArgs(argv, env = process.env) {
  const args = {
    all: false,
    ref: 'HEAD',
    specs: [],
    timeoutMs: Number(env.VERIFY_PUBLISHED_TIMEOUT_MS) || 20 * 60 * 1000,
    intervalMs: Number(env.VERIFY_PUBLISHED_INTERVAL_MS) || 20 * 1000,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--all') args.all = true;
    else if (arg === '--ref') args.ref = argv[++i];
    else if (arg === '--spec') args.specs.push(argv[++i]);
    else if (arg === '--timeout-minutes') args.timeoutMs = Number(argv[++i]) * 60 * 1000;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

/** "@scope/name@1.2.3" -> { name: "@scope/name", version: "1.2.3" } */
function splitSpec(spec) {
  const at = spec.lastIndexOf('@');
  if (at <= 0 || !/^\d/.test(spec.slice(at + 1))) throw new Error(`not a name@version spec: ${spec}`);
  return { name: spec.slice(0, at), version: spec.slice(at + 1) };
}

/** Versions `changeset publish` just released: it tags each as `name@version` on HEAD. */
function releasedAt(ref) {
  const publishable = new Set(publishableWorkspaces().map(({ pkg }) => pkg.name));
  const tags = execFileSync('git', ['tag', '--points-at', ref], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
  const out = [];
  for (const tag of tags) {
    try {
      const { name, version } = splitSpec(tag);
      if (publishable.has(name)) out.push(`${name}@${version}`);
    } catch {
      // not a package tag
    }
  }
  return out.sort();
}

function registryUrl(name, version = '') {
  return `${REGISTRY}/${name.replace('/', '%2f')}${version ? `/${version}` : ''}`;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
  return res.ok ? res.json() : null;
}

async function latestOfEverything() {
  const out = [];
  for (const { pkg } of publishableWorkspaces()) {
    const packument = await fetchJson(registryUrl(pkg.name));
    const latest = packument && packument['dist-tags'] && packument['dist-tags'].latest;
    if (latest) out.push(`${pkg.name}@${latest}`);
  }
  return out.sort();
}

/** What is in a packed tarball, judged against the package.json shipped inside it. */
function inspectTarball(tarball) {
  const entries = new Set(
    execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
      .split('\n')
      .filter(Boolean)
      .map((e) => e.replace(/^package\//, ''))
  );
  const manifest = JSON.parse(
    execFileSync('tar', ['-xzOf', tarball, 'package/package.json'], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  );
  const { runtime, types } = entryPoints(manifest);
  return {
    fileCount: entries.size,
    missingRuntime: [...new Set(runtime.filter((p) => !entries.has(p)))],
    missingTypes: [...new Set(types.filter((p) => !entries.has(p)))],
  };
}

/** Pack the published version from the registry; null if the tarball is not available yet. */
function packPublished(spec, dir) {
  try {
    const out = execFileSync('npm', ['pack', spec, '--silent', '--ignore-scripts', '--pack-destination', dir], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      cwd: dir,
    });
    return path.join(dir, out.trim().split('\n').pop());
  } catch {
    return null;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function describeDuration(ms) {
  return ms >= 60 * 1000 ? `${Math.round(ms / 60000)} minute(s)` : `${Math.max(1, Math.round(ms / 1000))} second(s)`;
}

async function verify(specs, { timeoutMs, intervalMs }, log = console.log) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'editora-published-'));
  const results = new Map(); // spec -> { ok, detail }
  let pending = [...specs];
  const deadline = Date.now() + timeoutMs;
  const started = Date.now();

  try {
    while (pending.length) {
      const stillPending = [];
      for (const spec of pending) {
        const { name, version } = splitSpec(spec);
        const manifest = await fetchJson(registryUrl(name, version)).catch(() => null);
        const tarball = manifest ? packPublished(spec, work) : null;
        if (!tarball) {
          stillPending.push(spec);
          continue;
        }
        const info = inspectTarball(tarball);
        const problems = [];
        if (info.missingRuntime.length) problems.push(`missing runtime files: ${info.missingRuntime.join(', ')}`);
        if (info.missingTypes.length) problems.push(`missing typings: ${info.missingTypes.join(', ')}`);
        results.set(spec, problems.length ? { ok: false, detail: problems.join('; ') } : { ok: true, detail: `${info.fileCount} files` });
        log(`${problems.length ? 'FAIL' : 'ok  '} ${spec}${problems.length ? `: ${problems.join('; ')}` : ''}`);
      }
      pending = stillPending;
      if (pending.length && Date.now() + intervalMs > deadline) break;
      if (pending.length) {
        log(`waiting for ${pending.length} version(s) to appear on the registry (${Math.round((Date.now() - started) / 1000)}s elapsed)...`);
        await sleep(intervalMs);
      }
    }
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }

  for (const spec of pending) {
    const detail = `not available from the registry after ${describeDuration(timeoutMs)}`;
    results.set(spec, { ok: false, detail });
    log(`FAIL ${spec}: ${detail}`);
  }
  return results;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let specs;
  if (args.specs.length) specs = args.specs;
  else if (args.all) specs = await latestOfEverything();
  else specs = releasedAt(args.ref);

  if (!specs.length) {
    console.log(`No package versions are tagged at ${args.ref}; nothing to verify.`);
    return;
  }
  console.log(`Verifying ${specs.length} published package version(s) against the registry...`);

  const results = await verify(specs, args);
  const failed = [...results].filter(([, r]) => !r.ok);
  if (failed.length) {
    console.error(`\n${failed.length} of ${specs.length} published version(s) are NOT usable as published:\n`);
    for (const [spec, r] of failed) console.error(`  ${spec}\n      ${r.detail}`);
    console.error('\nThey are already on npm. Fix the cause, release a new patch, and `npm deprecate` the bad versions.\n');
    process.exit(1);
  }
  console.log(`\n✓ All ${specs.length} published version(s) contain every runtime entry point and typings file their package.json names.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { parseArgs, splitSpec, releasedAt, inspectTarball, verify };
