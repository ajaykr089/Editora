#!/usr/bin/env node
// Creates a GitHub Release for each `@editora/<name>@<version>` tag, using that version's section of
// the package's CHANGELOG.md (written by changesets) as the release notes. Tags that already have a
// release are skipped, so it is safe to re-run.
//
//   node scripts/create-github-releases.mjs --points-at HEAD     tags on the release commit (publish.yml)
//   node scripts/create-github-releases.mjs --missing --since 2026-10-29
//                                                                every tag since that date with no release
//   node scripts/create-github-releases.mjs @editora/ui-core@0.4.0 ...
//
// Add --dry-run to print the notes instead of creating releases. Needs the `gh` CLI, authenticated
// (GH_TOKEN in CI), and the tags pushed to GitHub.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const valueOf = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};
const flagValues = new Set(['--points-at', '--since'].map(valueOf).filter(Boolean));
const explicitTags = args.filter((arg) => !arg.startsWith('--') && !flagValues.has(arg));

const git = (...gitArgs) => execFileSync('git', gitArgs, { encoding: 'utf8' }).trim();
const gh = (...ghArgs) => execFileSync('gh', ghArgs, { encoding: 'utf8' }).trim();
const lines = (text) => text.split('\n').map((line) => line.trim()).filter(Boolean);

const TAG = /^(@editora\/[^@]+)@(\d+\.\d+\.\d+(?:-[\w.]+)?)$/;

function packageDirs() {
  const dirs = new Map();
  for (const parent of ['packages', 'packages/plugins']) {
    for (const entry of readdirSync(parent, { withFileTypes: true })) {
      const manifest = join(parent, entry.name, 'package.json');
      if (!entry.isDirectory() || !existsSync(manifest)) continue;
      const { name } = JSON.parse(readFileSync(manifest, 'utf8'));
      if (name) dirs.set(name, join(parent, entry.name));
    }
  }
  return dirs;
}

function tagsToRelease() {
  if (explicitTags.length) return explicitTags;
  const pointsAt = valueOf('--points-at');
  if (pointsAt) return lines(git('tag', '--points-at', pointsAt)).sort();
  if (args.includes('--missing')) {
    const since = valueOf('--since');
    // Oldest first, so the newest release ends up as the repository's "Latest".
    const rows = lines(git('for-each-ref', '--sort=creatordate', '--format=%(creatordate:short) %(refname:short)', 'refs/tags'));
    return rows
      .map((row) => row.split(' '))
      .filter(([date]) => !since || date >= since)
      .map(([, tag]) => tag);
  }
  console.error('Pass tags, --points-at <rev> or --missing [--since YYYY-MM-DD].');
  process.exit(2);
}

// The section under `## <version>` up to the next `## ` heading.
function changelogSection(changelog, version) {
  const out = [];
  let inside = false;
  for (const line of changelog.split('\n')) {
    if (/^## /.test(line)) {
      if (inside) break;
      inside = line.slice(3).trim() === version;
      continue;
    }
    if (inside) out.push(line);
  }
  return out.join('\n').trim();
}

const dirs = packageDirs();
const existing = new Set(lines(gh('api', '--paginate', 'repos/{owner}/{repo}/releases', '--jq', '.[].tag_name')));
const workDir = mkdtempSync(join(tmpdir(), 'editora-release-notes-'));
let created = 0;
let failed = 0;

try {
  for (const tag of tagsToRelease()) {
    const match = TAG.exec(tag);
    if (!match) continue;
    if (existing.has(tag)) {
      console.log(`skip ${tag}: release exists`);
      continue;
    }
    const [, name, version] = match;
    const dir = dirs.get(name);
    if (!dir) {
      console.warn(`skip ${tag}: no package named ${name} in this checkout`);
      continue;
    }

    let changelog = '';
    try {
      changelog = git('show', `${tag}:${dir}/CHANGELOG.md`);
    } catch {
      // No changelog at that tag.
    }
    const section = changelogSection(changelog, version) || '_No changelog entry for this version._';
    const notes = `**Package:** [\`${name}\`](https://www.npmjs.com/package/${name}/v/${version}) ${version}\n\n${section}\n`;
    const title = `${name} ${version}`;

    if (dryRun) {
      console.log(`=== ${title} (${tag})\n${notes}`);
      continue;
    }

    const notesFile = join(workDir, 'notes.md');
    writeFileSync(notesFile, notes);
    try {
      gh('release', 'create', tag, '--verify-tag', '--title', title, '--notes-file', notesFile);
      console.log(`created ${tag}`);
      created += 1;
    } catch (error) {
      console.error(`failed ${tag}: ${error.stderr || error.message}`);
      failed += 1;
    }
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

if (!dryRun) console.log(`${created} release(s) created${failed ? `, ${failed} failed` : ''}.`);
process.exit(failed ? 1 : 0);
