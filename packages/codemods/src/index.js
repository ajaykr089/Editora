import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import * as textFieldOnCommit from './transforms/text-field-on-commit.js';

/** Every codemod, by name. */
export const transforms = {
  [textFieldOnCommit.name]: textFieldOnCommit,
};

const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts']);
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.git', '.next', 'coverage']);

function* walk(path) {
  const stat = statSync(path);
  if (stat.isFile()) {
    if (EXTENSIONS.has(extname(path)) && !path.endsWith('.d.ts')) yield path;
    return;
  }
  if (!stat.isDirectory()) return;
  for (const entry of readdirSync(path)) {
    if (SKIP_DIRS.has(entry) || entry.startsWith('.')) continue;
    yield* walk(join(path, entry));
  }
}

/**
 * Runs a codemod over files and folders.
 * @param {string} transformName
 * @param {string[]} paths
 * @param {{ dry?: boolean, cwd?: string }} [options] `dry`: report without writing.
 * @returns {{ files: { path: string, changes: number }[], changes: number, warnings: string[] }}
 */
export function run(transformName, paths, options = {}) {
  const codemod = transforms[transformName];
  if (!codemod) throw new Error(`Unknown codemod "${transformName}". Available: ${Object.keys(transforms).join(', ')}`);
  const cwd = options.cwd || process.cwd();
  const result = { files: [], changes: 0, warnings: [] };
  for (const root of paths) {
    for (const file of walk(root)) {
      const source = readFileSync(file, 'utf8');
      const shown = relative(cwd, file) || file;
      const { output, changes, warnings } = codemod.transform(source, shown);
      result.warnings.push(...warnings);
      if (!changes) continue;
      result.files.push({ path: shown, changes });
      result.changes += changes;
      if (!options.dry) writeFileSync(file, output);
    }
  }
  return result;
}
