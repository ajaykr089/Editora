import fs from 'node:fs';
import path from 'node:path';

export const repoRoot = path.resolve(__dirname, '../..');

const readJson = (file: string) => JSON.parse(fs.readFileSync(path.join(repoRoot, file), 'utf8'));

export type SourceEntry = { name: string; file: string };

const pluginDirs = fs
  .readdirSync(path.join(repoRoot, 'packages/plugins'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(repoRoot, 'packages/plugins', d.name, 'src/index.ts')))
  .map((d) => d.name)
  .sort();

/**
 * Every source entry point of the packages that make up the editor, as a name plus a repo-relative file.
 * Plugin entries are discovered from the directory layout so a new plugin is covered without editing this.
 */
export const sourceEntries: SourceEntry[] = [
  { name: '@editora/core', file: 'packages/core/src/index.ts' },
  { name: '@editora/core/webcomponent', file: 'packages/core/src/webcomponent/index.ts' },
  { name: '@editora/core (standalone, native plugins)', file: 'packages/core/src/webcomponent/standalone.native.ts' },
  { name: '@editora/core (standalone, core plugins)', file: 'packages/core/src/webcomponent/standalone.core.ts' },
  { name: '@editora/core/plugin-loader', file: 'packages/core/src/webcomponent/plugin-loader.ts' },
  { name: '@editora/react', file: 'packages/react/src/index.ts' },
  { name: '@editora/themes', file: 'packages/themes/src/index.ts' },
  { name: '@editora/light-code-editor', file: 'packages/light-code-editor/src/index.ts' },
  { name: '@editora/ui-core', file: 'packages/ui-core/src/index.ts' },
  { name: '@editora/ui-sortable', file: 'packages/ui-sortable/src/index.ts' },
  { name: '@editora/plugins', file: 'packages/plugins/src/index.ts' },
  { name: '@editora/plugins/lite', file: 'packages/plugins/src/lite.ts' },
  { name: '@editora/plugins/enterprise', file: 'packages/plugins/src/enterprise.ts' },
  { name: '@editora/plugins/shared-config', file: 'packages/plugins/src/shared-config.ts' },
  ...pluginDirs.map((dir) => ({ name: `@editora/plugins/${dir}`, file: `packages/plugins/${dir}/src/index.ts` })),
];

/** Packages whose built entry points must load in a plain Node process. */
export const builtPackages = [
  'core',
  'react',
  'plugins',
  'themes',
  'light-code-editor',
  'markdown-editor',
  'editora-toast',
  'icons',
  'react-icons',
  'performance',
  'ui-core',
  'ui-sortable',
  'ui-react',
  'ui-editor',
];

export type BuiltEntry = { name: string; kind: 'esm' | 'cjs'; file: string };

/** The files each package's `exports` map (or module/main) points an `import` and a `require` at. */
export function builtEntries(): BuiltEntry[] {
  const out: BuiltEntry[] = [];
  for (const dir of builtPackages) {
    const pkgFile = `packages/${dir}/package.json`;
    const pkg = readJson(pkgFile);
    const exp: Record<string, unknown> = pkg.exports ?? { '.': { import: pkg.module ?? pkg.main, require: pkg.main } };
    for (const [subpath, target] of Object.entries(exp)) {
      const cond: Record<string, unknown> = typeof target === 'string' ? { default: target } : (target as Record<string, unknown>);
      const pick = (v: unknown): string | undefined => (typeof v === 'string' ? v : (v as { default?: string } | undefined)?.default);
      const esm = pick(cond.import) ?? pick(cond.default);
      const cjs = pick(cond.require);
      const name = pkg.name + subpath.slice(1);
      for (const [kind, rel] of [['esm', esm], ['cjs', cjs]] as const) {
        if (!rel || /\.(css|json|d\.ts)$/.test(rel)) continue;
        for (const file of expandWildcard(`packages/${dir}`, rel)) {
          out.push({ name: name.includes('*') ? name.replace('*', wildcardPart(rel, file)) : name, kind, file });
        }
      }
    }
  }
  return out;
}

// `"./components/*": { "import": "./dist/components/*.esm.js" }`: one entry per file the pattern matches
function expandWildcard(pkgDir: string, rel: string): string[] {
  if (!rel.includes('*')) return [path.join(pkgDir, rel)];
  const [dir, pattern] = [path.dirname(rel), path.basename(rel)];
  const re = new RegExp('^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace('*', '(.+)') + '$');
  const abs = path.join(repoRoot, pkgDir, dir);
  if (!fs.existsSync(abs)) return [path.join(pkgDir, rel)];
  return fs.readdirSync(abs).filter((n) => re.test(n)).sort().map((n) => path.join(pkgDir, dir, n));
}

function wildcardPart(rel: string, file: string): string {
  const [before, after] = path.basename(rel).split('*');
  const base = path.basename(file);
  return base.slice(before.length, base.length - after.length);
}
