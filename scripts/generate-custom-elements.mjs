#!/usr/bin/env node
/**
 * Generates, from the ui-core sources (and the ui-react wrappers' prop types for attribute values):
 *   packages/ui-core/custom-elements.json   Custom Elements Manifest (schema 2.1.0): Storybook,
 *                                           lit-analyzer, IDE plugins and doc tools read it
 *   packages/ui-core/html-custom-data.json  VS Code HTML custom data (tag and attribute completion)
 *   packages/ui-core/types/vue.d.ts         Vue GlobalComponents: typed props and events in templates
 *   packages/ui-core/types/svelte.d.ts      Svelte SvelteHTMLElements: typed attributes and events
 *
 *   node scripts/generate-custom-elements.mjs          write the files
 *   node scripts/generate-custom-elements.mjs --check  exit 1 if any is out of date (CI)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const coreDir = join(root, 'packages/ui-core');
const check = process.argv.includes('--check');
const docsSite = 'https://editora-ecosystem.netlify.app';

const registry = JSON.parse(readFileSync(join(root, 'components.json'), 'utf8'));
const tags = registry.components.filter((entry) => entry.package === '@editora/ui-core').map((entry) => entry.tagName).sort();
const wrappers = new Map(
  registry.components.filter((entry) => entry.framework === 'react' && entry.wrapperFor).map((entry) => [entry.wrapperFor, entry]),
);

// ---------------------------------------------------------------------------------------------------------------------
// Attribute value types, from the React wrappers' props (the one typed description of each attribute).

const program = ts.createProgram(
  [...new Set([...wrappers.values()].map((entry) => join(root, entry.source)))],
  {
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    noEmit: true,
    strict: true,
    baseUrl: root,
    paths: {
      '@editora/ui-core': ['packages/ui-core/src/index.ts'],
      '@editora/ui-core/*': ['packages/ui-core/src/standalone/*', 'packages/ui-core/src/*'],
      '@editora/icons': ['packages/icons/src/index.ts'],
      '@editora/icons/*': ['packages/icons/src/*'],
    },
  },
);
const checker = program.getTypeChecker();

const camel = (name) => name.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase());
const pascal = (name) => camel(name).replace(/^[a-z]/, (ch) => ch.toUpperCase());
const oneLine = (text) => text.replace(/\s+/g, ' ').trim();

/** `'a' | 'b' | boolean | number | string`, simplified to what an attribute can hold; null when unknown. */
function attributeType(type) {
  const parts = type.isUnion() ? type.types : [type];
  const out = new Set();
  for (const part of parts) {
    if (part.flags & ts.TypeFlags.Undefined || part.flags & ts.TypeFlags.Null) continue;
    if (part.isStringLiteral()) out.add(JSON.stringify(part.value).replace(/"/g, "'"));
    else if (part.isNumberLiteral()) out.add(String(part.value));
    else if (part.flags & ts.TypeFlags.BooleanLiteral || part.flags & ts.TypeFlags.Boolean) out.add('boolean');
    else if (part.flags & ts.TypeFlags.Number) out.add('number');
    else if (part.flags & ts.TypeFlags.String) out.add('string');
    else if (part.flags & ts.TypeFlags.TemplateLiteral) out.add('string');
    else return null; // objects, functions, React nodes: not an attribute value
  }
  if (!out.size) return null;
  // `string & {}` style escape hatches leave both literals and string: keep the literals for completion.
  return [...out].sort((a, b) => (a === 'string') - (b === 'string') || a.localeCompare(b)).join(' | ');
}

/** prop name -> { type, description } for the wrapper of `tag`. */
function wrapperProps(tag) {
  const entry = wrappers.get(tag);
  if (!entry) return new Map();
  const file = program.getSourceFile(join(root, entry.source));
  const moduleSymbol = file && checker.getSymbolAtLocation(file);
  if (!moduleSymbol) return new Map();
  let exported = checker.getExportsOfModule(moduleSymbol).find((symbol) => symbol.getName() === (entry.reactExport || entry.name));
  if (!exported) return new Map();
  if (exported.flags & ts.SymbolFlags.Alias) exported = checker.getAliasedSymbol(exported);
  const signature = checker.getTypeOfSymbolAtLocation(exported, file).getCallSignatures()[0];
  const param = signature?.getParameters()[0];
  if (!param) return new Map();
  const propsType = checker.getTypeOfSymbolAtLocation(param, file);
  const props = new Map();
  for (const symbol of checker.getPropertiesOfType(propsType)) {
    const declarations = symbol.getDeclarations() || [];
    if (!declarations.some((d) => /packages\/ui-(react|core)\//.test(d.getSourceFile().fileName))) continue;
    props.set(symbol.getName(), {
      type: attributeType(checker.getTypeOfSymbolAtLocation(symbol, file)),
      description: oneLine(ts.displayPartsToString(symbol.getDocumentationComment(checker))),
    });
  }
  return props;
}

// ---------------------------------------------------------------------------------------------------------------------
// Element facts from the ui-core source.

const GLOBAL_TOKENS = /^--(base-|ui-(color|radius|space|spacing|font|text|shadow|motion|ring|control|elevation|z|focus|duration|easing|surface|border|density|size|line|letter|theme|primary|accent|tone)\b)/;

function elementFacts(tag) {
  const modulePath = `src/components/${tag}.ts`;
  const source = readFileSync(join(coreDir, modulePath), 'utf8');
  const define = new RegExp(`customElements\\.define\\(\\s*['"]${tag}['"]\\s*,\\s*([A-Za-z0-9_$]+)`).exec(source);
  const className = define?.[1] ?? pascal(tag);
  const classDoc = new RegExp(`/\\*\\*([\\s\\S]*?)\\*/\\s*(?:export\\s+)?class\\s+${className}\\b`).exec(source);
  const description = classDoc
    ? oneLine(classDoc[1].split('\n').map((line) => line.replace(/^\s*\*\s?/, '')).join('\n').split(/\n\s*\n|@/)[0])
    : '';
  const observed = /static get observedAttributes\(\)[^{]*\{\s*return\s*\[([\s\S]*?)\]/.exec(source);
  const attributes = observed ? [...new Set([...observed[1].matchAll(/['"]([a-z0-9-]+)['"]/g)].map((m) => m[1]))].sort() : [];
  const events = new Set();
  for (const pattern of [/new CustomEvent(?:<[^>]*>)?\(\s*['"]([a-z][a-z0-9-]*)['"]/g, /\b_?emit(?:Event)?\(\s*['"]([a-z][a-z0-9-]*)['"]/g, /new Event\(\s*['"]([a-z][a-z0-9-]*)['"]/g]) {
    for (const match of source.matchAll(pattern)) events.add(match[1]);
  }
  // Helpers that build the event from a parameter (`_dispatchWithLegacy(name, legacyName, …)`):
  // the names are the string literals their callers pass.
  for (const match of source.matchAll(/new (?:Custom)?Event(?:<[^>]*>)?\(\s*([A-Za-z_$][\w$]*)\s*[,)]/g)) {
    const before = source.slice(0, match.index);
    const headers = [...before.matchAll(/(?:^|\n)\s*(?:(?:private|protected|public|static|async)\s+)*([A-Za-z_$][\w$]*)\s*(?:<[^>()]*>)?\(([^()]*)\)\s*(?::[^{=]*)?\{/g)];
    const header = headers[headers.length - 1];
    if (!header || !header[2].split(',').some((param) => param.trim().split(/[\s:?=]/)[0] === match[1])) continue;
    for (const call of source.matchAll(new RegExp(`\\b${header[1].replace(/\$/g, '\\$')}(?:<[^>()]*>)?\\(\\s*(['"][a-z][a-z0-9-]*['"])(?:\\s*,\\s*(['"][a-z][a-z0-9-]*['"]))?`, 'g'))) {
      events.add(call[1].slice(1, -1));
      if (call[2]) events.add(call[2].slice(1, -1));
    }
  }
  const slots = new Set();
  for (const match of source.matchAll(/<slot(?:\s+name=["']([a-z0-9-]+)["'])?[^>]*>/g)) slots.add(match[1] ?? '');
  const parts = new Set();
  for (const match of source.matchAll(/\bpart=["']([a-z0-9 -]+)["']/g)) for (const name of match[1].split(/\s+/)) if (name) parts.add(name);
  // The element's own knobs: custom properties it declares (`--ui-btn-accent: …`), not the shared theme tokens.
  const cssProperties = new Set();
  for (const match of source.matchAll(/(?:^|[\s;{])(--[a-z][a-z0-9-]*)\s*:/g)) {
    if (!GLOBAL_TOKENS.test(match[1])) cssProperties.add(match[1]);
  }
  return {
    modulePath,
    className,
    description,
    attributes,
    events: [...events].sort(),
    slots: [...slots].sort(),
    parts: [...parts].sort(),
    cssProperties: [...cssProperties].sort(),
  };
}

const elements = tags.filter((tag) => existsSync(join(coreDir, `src/components/${tag}.ts`))).map((tag) => {
  const facts = elementFacts(tag);
  const props = wrapperProps(tag);
  const attributes = facts.attributes.map((name) => {
    const prop = props.get(camel(name)) ?? props.get(name);
    return { name, type: prop?.type ?? 'string', description: prop?.description ?? '' };
  });
  return { tag, ...facts, attributes };
});

// ---------------------------------------------------------------------------------------------------------------------
// Outputs.

const manifest = {
  schemaVersion: '2.1.0',
  readme: 'README.md',
  modules: elements.map((el) => {
    const declaration = {
      kind: 'class',
      name: el.className,
      tagName: el.tag,
      customElement: true,
      ...(el.description ? { description: el.description } : {}),
      superclass: { name: 'HTMLElement' },
      attributes: el.attributes.map((a) => ({ name: a.name, type: { text: a.type }, ...(a.description ? { description: a.description } : {}) })),
      events: el.events.map((name) => ({ name, type: { text: 'CustomEvent' } })),
      slots: el.slots.map((name) => ({ name, description: name ? '' : 'Default slot' })),
      cssParts: el.parts.map((name) => ({ name })),
      cssProperties: el.cssProperties.map((name) => ({ name })),
    };
    return {
      kind: 'javascript-module',
      path: el.modulePath,
      declarations: [declaration],
      exports: [
        { kind: 'js', name: el.className, declaration: { name: el.className, module: el.modulePath } },
        { kind: 'custom-element-definition', name: el.tag, declaration: { name: el.className, module: el.modulePath } },
      ],
    };
  }),
};

const literals = (type) => (type.match(/'[^']*'/g) || []).map((text) => ({ name: text.slice(1, -1) }));
const customData = {
  $schema: 'https://raw.githubusercontent.com/microsoft/vscode-html-languageservice/main/docs/customData.schema.json',
  version: 1.1,
  tags: elements.map((el) => ({
    name: el.tag,
    description: el.description || `Editora <${el.tag}> element.`,
    attributes: el.attributes.map((a) => {
      const values = literals(a.type);
      return {
        name: a.name,
        ...(a.description ? { description: a.description } : {}),
        ...(values.length ? { values } : a.type === 'boolean' ? { valueSet: 'v' } : {}),
      };
    }),
    references: [{ name: 'Editora docs', url: `${docsSite}/docs/ui-core` }],
  })),
};

// Standard DOM event names: Svelte's attribute types already have handlers for these.
const DOM_EVENTS = new Set('abort animationend animationiteration animationstart auxclick beforeinput blur cancel canplay change click close contextmenu copy cuechange cut dblclick drag dragend dragenter dragleave dragover dragstart drop durationchange emptied ended error focus focusin focusout formdata input invalid keydown keypress keyup load loadeddata loadedmetadata loadstart lostpointercapture mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup paste pause play playing pointercancel pointerdown pointerenter pointerleave pointermove pointerout pointerover pointerup progress ratechange reset resize scroll scrollend securitypolicyviolation seeked seeking select selectionchange selectstart slotchange stalled submit suspend timeupdate toggle touchcancel touchend touchmove touchstart transitioncancel transitionend transitionrun transitionstart volumechange waiting wheel beforetoggle'.split(' '));

/**
 * In templates a static attribute is a string and a bare attribute is `true` (Vue) or `''`:
 * numbers also take `"10"`, numeric literals their text, booleans `"true"` / `"false"` and a bare
 * attribute, plain strings a bare attribute.
 */
const templateType = (type) =>
  [
    ...new Set(
      type.split(' | ').flatMap((part) => {
        if (part === 'number') return ['number', '`${number}`'];
        if (part === 'boolean') return ['boolean', "''", "'true'", "'false'"];
        if (part === 'string') return ['string', 'true'];
        if (/^-?\d+(\.\d+)?$/.test(part)) return [part, `'${part}'`];
        return [part];
      }),
    ),
  ].join(' | ');

const HEADER = '// Generated by scripts/generate-custom-elements.mjs from the ui-core sources. Do not edit.\n';
const doc = (text) => (text ? `      /** ${text.replace(/\*\//g, '*\\/')} */\n` : '');
const quote = (name) => (/^[a-zA-Z_$][\w$]*$/.test(name) ? name : `'${name}'`);

const vue = `${HEADER}// Typed props and events for Editora elements in Vue templates (Volar / vue-tsc).
// Use: "types": ["@editora/ui-core/vue"] in tsconfig, and tell Vue the tags are custom elements:
//   compilerOptions.isCustomElement = (tag) => tag.startsWith('ui-')
import type { DefineComponent } from 'vue';

declare module 'vue' {
  interface GlobalComponents {
${elements
  .map((el) => {
    const props = [
      ...el.attributes.map((a) => `${doc(a.description)}      ${quote(camel(a.name))}?: ${templateType(a.type)};`),
      ...el.events.map((name) => `      ${quote(`on${pascal(name)}`)}?: (event: CustomEvent) => void;`),
    ];
    return `    ${quote(el.tag)}: DefineComponent<{\n${props.join('\n')}${props.length ? '\n' : ''}    }>;`;
  })
  .join('\n')}
  }
}

export {};
`;

const svelte = `${HEADER}// Typed attributes and events for Editora elements in Svelte (svelte-check), Svelte 4 and 5.
// Use: "types": ["@editora/ui-core/svelte"] in tsconfig (or a /// <reference types> in app.d.ts).
import type { HTMLAttributes } from 'svelte/elements';

declare module 'svelte/elements' {
  interface SvelteHTMLElements {
${elements
  .map((el) => {
    const attrs = [
      ...el.attributes.map((a) => `${doc(a.description)}      ${quote(a.name)}?: ${templateType(a.type)} | null;`),
      ...el.events.flatMap((name) => [`      ${quote(`on:${name}`)}?: (event: CustomEvent) => void;`, `      ${quote(`on${name}`)}?: (event: CustomEvent) => void;`]),
    ];
    // Events named like DOM events (close, change, input...) replace Svelte's own handler types for them.
    // and the element's attributes replace HTML attributes of the same name (autosave, title, hidden...).
    const clashing = [
      ...el.attributes.map((a) => `'${a.name}'`),
      ...el.events.filter((name) => DOM_EVENTS.has(name)).flatMap((name) => [`'on${name}'`, `'on:${name}'`]),
    ];
    const base = clashing.length ? `Omit<HTMLAttributes<HTMLElement>, ${clashing.join(' | ')}>` : 'HTMLAttributes<HTMLElement>';
    return `    ${quote(el.tag)}: ${base} & {\n${attrs.join('\n')}${attrs.length ? '\n' : ''}    };`;
  })
  .join('\n')}
  }
}

export {};
`;

const outputs = new Map([
  [join(coreDir, 'custom-elements.json'), `${JSON.stringify(manifest, null, 2)}\n`],
  [join(coreDir, 'html-custom-data.json'), `${JSON.stringify(customData, null, 2)}\n`],
  [join(coreDir, 'types/vue.d.ts'), vue],
  [join(coreDir, 'types/svelte.d.ts'), svelte],
]);

let stale = 0;
for (const [path, content] of outputs) {
  const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (current === content) continue;
  if (check) {
    stale += 1;
    console.error(`out of date: ${path.slice(root.length + 1)}`);
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
}
if (check && stale) {
  console.error('Run: node scripts/generate-custom-elements.mjs');
  process.exit(1);
}
const counts = elements.reduce((acc, el) => ({ a: acc.a + el.attributes.length, e: acc.e + el.events.length, typed: acc.typed + el.attributes.filter((a) => a.type !== 'string').length }), { a: 0, e: 0, typed: 0 });
console.log(`${check ? 'Checked' : 'Wrote'} custom elements data for ${elements.length} elements (${counts.a} attributes, ${counts.typed} with typed values; ${counts.e} events).`);
