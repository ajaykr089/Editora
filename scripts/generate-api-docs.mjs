#!/usr/bin/env node
/**
 * Generates the @editora/ui-react API reference from the source, so it cannot fall behind:
 * one page per component in examples/editora-docs/docs/ui-react/api/, listing
 *   - the props of every `...Props` type the component's module exports (from the TypeScript
 *     types, with their JSDoc), and
 *   - for wrappers, the custom element's attributes and the events it dispatches (from ui-core).
 *
 *   node scripts/generate-api-docs.mjs          write the pages
 *   node scripts/generate-api-docs.mjs --check  exit 1 if a page is missing or out of date (CI)
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'examples/editora-docs/docs/ui-react/api');
const check = process.argv.includes('--check');

const registry = JSON.parse(readFileSync(join(root, 'components.json'), 'utf8'));
const components = registry.components
  .filter((entry) => entry.package === '@editora/ui-react' && entry.framework === 'react')
  .sort((a, b) => a.name.localeCompare(b.name));

const program = ts.createProgram(
  components.map((entry) => join(root, entry.source)),
  {
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    noEmit: true,
    strict: true,
    baseUrl: root,
    // Types the props refer to come from the sources, not from whatever dist is installed.
    paths: {
      '@editora/ui-core': ['packages/ui-core/src/index.ts'],
      '@editora/ui-core/*': ['packages/ui-core/src/standalone/*', 'packages/ui-core/src/*'],
      '@editora/icons': ['packages/icons/src/index.ts'],
      '@editora/icons/*': ['packages/icons/src/*'],
    },
  }
);
const checker = program.getTypeChecker();

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
const oneLine = (text) => text.replace(/\s+/g, ' ').trim();

/** Text for a Markdown table cell in MDX: escape outside code spans, keep code spans literal. */
function cell(text) {
  return oneLine(text)
    .split(/(`[^`]*`)/)
    .map((part) =>
      part.startsWith('`') && part.endsWith('`') && part.length > 1
        ? part.replace(/\|/g, '\\|')
        : part.replace(/[{}]/g, (ch) => `\\${ch}`).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|')
    )
    .join('');
}

const code = (text) => `\`${oneLine(text).replace(/`/g, "'").replace(/\|/g, '\\|')}\``;

/** Is this declaration one of ours (not React's or the DOM's)? */
const isOwn = (declaration) => {
  const file = declaration.getSourceFile().fileName;
  return file.includes('/packages/ui-react/') || file.includes('/packages/ui-core/');
};

function propsOf(declaration) {
  const type = checker.getTypeAtLocation(declaration.name);
  const own = [];
  let inherited = 0;
  for (const symbol of checker.getPropertiesOfType(type)) {
    const declarations = symbol.getDeclarations() || [];
    if (!declarations.some(isOwn)) {
      inherited += 1;
      continue;
    }
    const decl = declarations.find(isOwn);
    const typeText = decl && (ts.isPropertySignature(decl) || ts.isPropertyDeclaration(decl)) && decl.type
      ? decl.type.getText()
      : checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, declaration), undefined, ts.TypeFormatFlags.NoTruncation);
    const docs = ts.displayPartsToString(symbol.getDocumentationComment(checker));
    const deprecated = symbol.getJsDocTags(checker).find((tag) => tag.name === 'deprecated');
    own.push({
      name: symbol.getName(),
      optional: (symbol.flags & ts.SymbolFlags.Optional) !== 0,
      type: typeText,
      docs: deprecated ? `**Deprecated.** ${ts.displayPartsToString(deprecated.text)} ${docs}` : docs,
    });
  }
  return { own, inherited };
}

/** The `...Props` types a component module exports, in source order. */
function propsTypes(sourcePath) {
  const file = program.getSourceFile(join(root, sourcePath));
  if (!file) return [];
  return file.statements.filter(
    (statement) =>
      (ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement)) &&
      statement.name.text.endsWith('Props') &&
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  );
}

/** Attributes and events of a ui-core element, read from its source. */
function elementApi(tagName) {
  const path = join(root, 'packages/ui-core/src/components', `${tagName}.ts`);
  if (!existsSync(path)) return null;
  const source = readFileSync(path, 'utf8');
  const observed = /static get observedAttributes\(\)[^{]*\{\s*return\s*\[([\s\S]*?)\]/.exec(source);
  const attributes = observed ? [...observed[1].matchAll(/['"]([a-z0-9-]+)['"]/g)].map((match) => match[1]) : [];
  const events = new Set();
  for (const pattern of [/new CustomEvent(?:<[^>]*>)?\(\s*['"]([a-z][a-z0-9-]*)['"]/g, /\b_?emit(?:Event)?\(\s*['"]([a-z][a-z0-9-]*)['"]/g, /new Event\(\s*['"]([a-z][a-z0-9-]*)['"]/g]) {
    for (const match of source.matchAll(pattern)) events.add(match[1]);
  }
  return { attributes: [...new Set(attributes)].sort(), events: [...events].sort() };
}

function page(entry) {
  const lines = [
    '---',
    `title: ${entry.name} API`,
    `sidebar_label: ${entry.name}`,
    `description: Props${entry.wrapperFor ? ', attributes and events' : ''} of the ${entry.name} component in @editora/ui-react, generated from the source.`,
    '---',
    '',
    '{/* Generated by scripts/generate-api-docs.mjs from the source. Do not edit: run `npm run generate:api-docs`. */}',
    '',
    `# ${entry.name} API`,
    '',
    '```tsx',
    `import { ${entry.name} } from '@editora/ui-react';`,
    '```',
    '',
  ];

  // The component's own props first, then its parts' (Select before Select.Option).
  const types = propsTypes(entry.source).sort((a, b) => Number(b.name.text === `${entry.name}Props`) - Number(a.name.text === `${entry.name}Props`));
  if (!types.length) lines.push('This component has no props of its own.', '');
  for (const declaration of types) {
    const { own, inherited } = propsOf(declaration);
    lines.push(`## ${declaration.name.text}`, '');
    if (own.length) {
      lines.push('| Prop | Type | Description |', '| --- | --- | --- |');
      for (const prop of own.sort((a, b) => a.name.localeCompare(b.name))) {
        lines.push(`| ${code(prop.name)}${prop.optional ? '' : ' (required)'} | ${code(prop.type)} | ${cell(prop.docs) || ' '} |`);
      }
      lines.push('');
    }
    // No count: it depends on the installed React types and would make the check flap.
    if (inherited) lines.push('Also accepts the standard HTML and React props of the element it renders (`className`, `style`, `id`, `aria-*`, `data-*`, event handlers).', '');
  }

  const element = entry.wrapperFor ? elementApi(entry.wrapperFor) : null;
  if (element) {
    lines.push(`## Element: \`<${entry.wrapperFor}>\``, '');
    lines.push(`${entry.name} renders the \`${entry.wrapperFor}\` custom element from \`@editora/ui-core\`, which can also be used without React.`, '');
    if (element.attributes.length) lines.push(`**Attributes:** ${element.attributes.map((name) => `\`${name}\``).join(', ')}`, '');
    if (element.events.length) lines.push(`**Events:** ${element.events.map((name) => `\`${name}\``).join(', ')}`, '');
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

const pages = new Map();
pages.set(
  '_category_.json',
  `${JSON.stringify({ label: 'API reference', position: 99, link: { type: 'generated-index', title: '@editora/ui-react API reference', description: 'Props, attributes and events of every @editora/ui-react component, generated from the source.' } }, null, 2)}\n`
);
for (const entry of components) pages.set(`${kebab(entry.name)}.md`, page(entry));

if (check) {
  const stale = [];
  for (const [name, content] of pages) {
    const path = join(outDir, name);
    if (!existsSync(path) || readFileSync(path, 'utf8') !== content) stale.push(name);
  }
  const extra = existsSync(outDir) ? readdirSync(outDir).filter((name) => !pages.has(name)) : [];
  if (stale.length || extra.length) {
    console.error(`API reference is out of date (${stale.length} changed, ${extra.length} removed): ${[...stale, ...extra].slice(0, 10).join(', ')}${stale.length + extra.length > 10 ? ', ...' : ''}`);
    console.error('Run `npm run generate:api-docs` and commit the result.');
    process.exit(1);
  }
  console.log(`API reference is up to date (${pages.size - 1} pages).`);
} else {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  for (const [name, content] of pages) writeFileSync(join(outDir, name), content);
  console.log(`Wrote ${pages.size - 1} API pages to ${relative(root, outDir)}.`);
}
