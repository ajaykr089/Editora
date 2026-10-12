/**
 * Guards against a recurring bug class found repeatedly during a September
 * 2026 audit: a ui-core component renders a child custom element
 * (`<ui-xxx>` in a template string, or `document.createElement('ui-xxx')`)
 * without importing the module that registers it. This is invisible in the
 * monorepo's own dev/test environment (everything gets registered via the
 * root barrel), but breaks silently in production for anyone who deep-imports
 * just the parent component - the child tag never upgrades, with no error.
 *
 * Real instances this caught in the wild before this script existed:
 *   - ui-button.ts renders <ui-icon> but never imported ui-icon.ts
 *   - ui-date-time-picker.ts and ui-date-range-time-picker.ts both render
 *     <ui-calendar> but never imported ui-calendar.ts
 *
 * This script builds a tag -> defining-file map from every
 * `customElements.define(...)` call, then for every file that references a
 * *different* tag, verifies that tag's defining file is reachable via that
 * file's own transitive local (relative-path) import graph. It does not
 * understand TypeScript syntax beyond that - it is a regex-based static
 * check, deliberately simple, matching the other scripts in this directory.
 *
 * A second, related pass checks the other half of this same bug class,
 * one level up: every packages/ui-react/src/components/*.tsx wrapper that
 * calls `warnIfElementNotRegistered('ui-xxx', ...)` must itself import
 * `@editora/ui-core/<xxx>` (its standalone registration entry), the fix
 * applied across ui-react earlier this week. Without it, deep-importing
 * that one React wrapper never registers the underlying custom element.
 *
 * A third pass generalises that to every element a wrapper renders (not only the one it warns about,
 * and not only when the standalone entry has the same name): see "Phase 3" below.
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const srcDir = path.join(repoRoot, 'packages/ui-core/src');

function walk(dir, exts) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out = out.concat(walk(abs, exts));
      continue;
    }
    if (exts.some((ext) => entry.name.endsWith(ext))) {
      out.push(abs);
    }
  }
  return out;
}

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null; // only trace local files
  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || null;
}

const files = walk(srcDir, ['.ts', '.tsx']).filter((f) => !f.includes('__tests__'));

// tag name -> defining file
const registry = new Map();
// file -> set of tags it registers (usually one, but be safe)
const fileOwnTags = new Map();
// file -> Set of directly-imported local files
const importGraph = new Map();
// file -> Set of tags referenced (via <ui-xxx or createElement('ui-xxx'))
const fileReferencedTags = new Map();

const defineRe = /customElements\.define\(\s*['"]([a-z][a-z0-9-]*)['"]/g;
const tagUseRe = /<(ui-[a-z0-9-]+)[\s/>]/g;
const createElRe = /createElement\(\s*['"](ui-[a-z0-9-]+)['"]/g;
const importRe = /(?:^|\n)\s*import\s+(?:[^'"]*?from\s+)?['"]([^'"]+)['"]/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');

  const ownTags = new Set();
  for (const m of content.matchAll(defineRe)) {
    ownTags.add(m[1]);
    if (!registry.has(m[1])) registry.set(m[1], file);
  }
  fileOwnTags.set(file, ownTags);

  const referenced = new Set();
  for (const m of content.matchAll(tagUseRe)) referenced.add(m[1]);
  for (const m of content.matchAll(createElRe)) referenced.add(m[1]);
  fileReferencedTags.set(file, referenced);

  const imports = new Set();
  for (const m of content.matchAll(importRe)) {
    const resolved = resolveImport(file, m[1]);
    if (resolved) imports.add(resolved);
  }
  importGraph.set(file, imports);
}

function transitiveClosure(startFile) {
  const seen = new Set([startFile]);
  const stack = [startFile];
  while (stack.length) {
    const current = stack.pop();
    for (const dep of importGraph.get(current) || []) {
      if (!seen.has(dep)) {
        seen.add(dep);
        stack.push(dep);
      }
    }
  }
  return seen;
}

const problems = [];

for (const file of files) {
  const referenced = fileReferencedTags.get(file);
  if (!referenced || referenced.size === 0) continue;

  const ownTags = fileOwnTags.get(file);
  let closure = null; // computed lazily, only if needed

  for (const tag of referenced) {
    if (ownTags.has(tag)) continue; // self-render, fine
    const definingFile = registry.get(tag);
    if (!definingFile) continue; // tag not defined anywhere in ui-core (e.g. consumer-provided) - not our concern
    if (definingFile === file) continue;

    if (!closure) closure = transitiveClosure(file);
    if (!closure.has(definingFile)) {
      problems.push({
        file: path.relative(repoRoot, file),
        tag,
        definingFile: path.relative(repoRoot, definingFile),
      });
    }
  }
}

// --- Phase 2: ui-react wrappers vs their matching ui-core standalone entry ---

const uiReactDir = path.join(repoRoot, 'packages/ui-react/src/components');
const standaloneDir = path.join(repoRoot, 'packages/ui-core/src/standalone');
const standaloneNames = new Set(
  fs.readdirSync(standaloneDir).filter((f) => f.endsWith('.ts')).map((f) => f.slice(0, -3))
);
const warnRe = /warnIfElementNotRegistered\(\s*['"](ui-[a-z0-9-]+)['"]/g;
const reactFiles = fs.existsSync(uiReactDir)
  ? fs.readdirSync(uiReactDir).filter((f) => f.endsWith('.tsx')).map((f) => path.join(uiReactDir, f))
  : [];

const reactProblems = [];

for (const file of reactFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const tags = new Set();
  for (const m of content.matchAll(warnRe)) tags.add(m[1]);
  if (tags.size === 0) continue;

  for (const tag of tags) {
    const standaloneName = tag.replace(/^ui-/, '');
    if (!standaloneNames.has(standaloneName)) continue; // no 1:1 standalone entry for this tag - not this check's concern
    const expectedImport = `@editora/ui-core/${standaloneName}`;
    if (!content.includes(expectedImport)) {
      reactProblems.push({
        file: path.relative(repoRoot, file),
        tag,
        expectedImport,
      });
    }
  }
}

// --- Phase 3: every element a ui-react wrapper renders is registered by that wrapper's own imports ---
//
// Phase 2 only looks at wrappers that call warnIfElementNotRegistered. A wrapper that renders several
// elements (TimeField next to DateField, Dropzone next to FileUpload, the four FieldSemantics parts) or
// whose entry is not a 1:1 standalone name (Sortable -> @editora/ui-core/sortable) slipped through, and
// used to be rescued only by a lazy import of the whole @editora/ui-core catalog when it was missing.
// That fallback is gone: a wrapper registers what it renders through its own imports, or it does not.
//
// For each top-level components/*.tsx file: the tags it renders (its own, plus those of the
// components/server/ implementation it re-exports) must be defined by a ui-core module reachable from
// the wrapper through local imports and `@editora/ui-core[/<entry>]` imports.

const uiCoreComponentsDir = path.join(srcDir, 'components');
const reExportRe = /(?:^|\n)\s*export\s+(?:\*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/g;
const specifierRe = /(?:^|\n)\s*(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g;
const typeOnlyRe = /(?:^|\n)\s*(?:import|export)\s+type\s[^;]*?from\s*['"][^'"]+['"];?/g;
const renderedTagRe = /(?:create(?:UI)?Element|warnIfElementNotRegistered)\(\s*['"](ui-[a-z0-9-]+)['"]|<(ui-[a-z0-9-]+)[\s/>]/g;

// ui-core file -> files it evaluates (imports and re-exports)
const coreEdges = new Map();
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const edges = new Set(importGraph.get(file) || []);
  for (const m of content.matchAll(reExportRe)) {
    const resolved = resolveImport(file, m[1]);
    if (resolved) edges.add(resolved);
  }
  coreEdges.set(file, edges);
}

function coreEntryFile(specifier) {
  if (specifier === '@editora/ui-core') return path.join(srcDir, 'index.ts');
  const name = specifier.slice('@editora/ui-core/'.length);
  return [path.join(srcDir, 'standalone', `${name}.ts`), path.join(srcDir, `${name}.ts`)].find((f) => fs.existsSync(f)) || null;
}

function addCoreClosure(entry, into) {
  const stack = [entry];
  while (stack.length) {
    const current = stack.pop();
    if (into.has(current)) continue;
    into.add(current);
    for (const dep of coreEdges.get(current) || []) stack.push(dep);
  }
}

function reactWrapperGraph(wrapper) {
  const visited = new Set();
  const coreFiles = new Set();
  const stack = [wrapper];
  while (stack.length) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    const content = fs.readFileSync(current, 'utf8').replace(typeOnlyRe, '');
    for (const m of content.matchAll(specifierRe)) {
      const specifier = m[1];
      if (specifier.startsWith('.')) {
        const resolved = resolveImport(current, specifier);
        if (resolved) stack.push(resolved);
      } else if (specifier === '@editora/ui-core' || specifier.startsWith('@editora/ui-core/')) {
        const entry = coreEntryFile(specifier);
        if (entry) addCoreClosure(entry, coreFiles);
      }
    }
  }
  return { visited, coreFiles };
}

// tag -> the standalone entry that defines it, to suggest the import to add
const entryForTag = new Map();
for (const name of standaloneNames) {
  const entry = path.join(srcDir, 'standalone', `${name}.ts`);
  for (const dep of coreEdges.get(entry) || []) {
    for (const tag of fileOwnTags.get(dep) || []) if (!entryForTag.has(tag)) entryForTag.set(tag, `@editora/ui-core/${name}`);
  }
}
entryForTag.set('ui-sortable', '@editora/ui-core/sortable');

const wrapperProblems = [];
const serverDir = path.join(uiReactDir, 'server');

for (const wrapper of reactFiles) {
  const { visited, coreFiles } = reactWrapperGraph(wrapper);
  const provided = new Set();
  for (const coreFile of coreFiles) for (const tag of fileOwnTags.get(coreFile) || []) provided.add(tag);

  const rendered = new Set();
  for (const file of visited) {
    if (file !== wrapper && path.dirname(file) !== serverDir) continue; // other wrappers answer for themselves
    const content = fs.readFileSync(file, 'utf8');
    for (const m of content.matchAll(renderedTagRe)) rendered.add(m[1] || m[2]);
  }

  for (const tag of rendered) {
    if (!registry.has(tag) || provided.has(tag)) continue;
    wrapperProblems.push({
      file: path.relative(repoRoot, wrapper),
      tag,
      expectedImport: entryForTag.get(tag) || '@editora/ui-core/<name>',
    });
  }
}

if (problems.length > 0 || reactProblems.length > 0 || wrapperProblems.length > 0) {
  if (wrapperProblems.length > 0) {
    console.error(`\nFound ${wrapperProblems.length} ui-react wrapper(s) that render an element their own imports never register:\n`);
    for (const p of wrapperProblems) {
      console.error(`  ${p.file}\n    renders <${p.tag}> but never imports '${p.expectedImport}' (directly or through another wrapper)\n`);
    }
    console.error(
      'Fix: add `import \'<the entry above>\';` to the file above.\n' +
      'Otherwise deep-importing just this wrapper renders an element that never upgrades.\n'
    );
  }
  if (problems.length > 0) {
    console.error(`\nFound ${problems.length} custom-element registration gap(s) in ui-core:\n`);
    for (const p of problems) {
      console.error(`  ${p.file}\n    renders <${p.tag}> but never imports ${p.definingFile} (directly or transitively)\n`);
    }
    console.error(
      'Fix: add `import \'<relative path to the defining file>\';` to the file above.\n' +
      'This means the tag will silently fail to upgrade for anyone who deep-imports just this component.\n'
    );
  }
  if (reactProblems.length > 0) {
    console.error(`\nFound ${reactProblems.length} ui-react wrapper registration gap(s):\n`);
    for (const p of reactProblems) {
      console.error(`  ${p.file}\n    uses <${p.tag}> but never imports '${p.expectedImport}'\n`);
    }
    console.error(
      'Fix: add `import \'@editora/ui-core/<name>\';` to the file above.\n' +
      'This means deep-importing just this React wrapper never registers its custom element.\n'
    );
  }
  process.exit(1);
} else {
  console.log(
    `✓ Checked ${files.length} ui-core files (${registry.size} registered custom elements) ` +
    `and ${reactFiles.length} ui-react wrapper files (each one registers every element it renders) - no registration gaps found.`
  );
}
