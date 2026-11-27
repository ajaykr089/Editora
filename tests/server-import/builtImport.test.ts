import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { builtEntries, repoRoot, type BuiltEntry } from './entries';

type Outcome = { ok: boolean; detail: string };

// A bare Node process is the closest thing to what `next dev`/`next build` do on the server: the entry is
// loaded by Node's own resolver and loader, from the files that get published, with no DOM and no bundler.
function load(entry: BuiltEntry): Promise<Outcome> {
  const abs = path.join(repoRoot, entry.file);
  const args =
    entry.kind === 'esm'
      ? ['--input-type=module', '-e', `await import(${JSON.stringify(pathToFileURL(abs).href)})`]
      : ['-e', `require(${JSON.stringify(abs)})`];
  return new Promise((resolve) => {
    execFile(process.execPath, args, { timeout: 60_000, cwd: repoRoot }, (error, _stdout, stderr) => {
      if (!error) return resolve({ ok: true, detail: '' });
      const line = stderr.split('\n').find((l) => /\w*Error:/.test(l)) ?? String(error.message).split('\n')[0];
      resolve({ ok: false, detail: line.trim() });
    });
  });
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]);
      }
    }),
  );
  return results;
}

const entries = builtEntries();
const present = entries.filter((e) => fs.existsSync(path.join(repoRoot, e.file)));
const outcomes = new Map<string, Outcome>();

describe('importing the built packages in plain Node (no DOM)', () => {
  // One Node process per entry (about 1,100 of them): the whole set takes close to a minute on a fast
  // machine, more on a CI runner, so the hook gets time for the workload, not the 60 s default.
  beforeAll(async () => {
    const done = await mapLimit(present, 6, load);
    present.forEach((e, i) => outcomes.set(`${e.name} [${e.kind}]`, done[i]));
  }, 10 * 60_000);

  // Locally the packages may not be built; CI builds before it tests, so a missing file there is a real failure.
  it('finds the built files', () => {
    if (process.env.CI) {
      expect(entries.filter((e) => !present.includes(e)).map((e) => e.file)).toEqual([]);
    }
    expect(entries.length).toBeGreaterThan(50);
  });

  it.each(entries.map((e) => [`${e.name} [${e.kind}]`, fs.existsSync(path.join(repoRoot, e.file))] as const))(
    '%s',
    (label, exists) => {
      if (!exists) return; // see 'finds the built files'
      expect(outcomes.get(label)).toEqual({ ok: true, detail: '' });
    },
  );
});
