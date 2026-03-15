const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const componentsDir = path.join(repoRoot, 'packages/ui-react/src/components');
const docsDir = path.join(repoRoot, 'examples/editora-docs/docs/ui-react');

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

function pascalToKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

const componentNames = [...new Set(
  walk(componentsDir, ['.tsx', '.ts'])
    .filter((file) => !file.endsWith('.d.ts'))
    .map((file) => path.basename(file).replace(/\.(tsx|ts)$/i, ''))
)]
  .filter((name) => !/^(index|types|utils|helpers|hooks)$/i.test(name));

const docSlugs = new Set(
  walk(docsDir, ['.md', '.mdx']).map((file) =>
    path.relative(docsDir, file).replace(/\\/g, '/').replace(/\.(md|mdx)$/i, '')
  )
);

const missing = [];
for (const component of componentNames) {
  const kebab = pascalToKebab(component);
  const candidates = [
    `interactive/${kebab}`,
    `form-inputs/${kebab}`,
    `providers-hooks/${kebab}`,
    kebab,
  ];
  const isDocumented = candidates.some((candidate) => docSlugs.has(candidate));
  if (!isDocumented) {
    missing.push(component);
  }
}

const result = {
  totalComponents: componentNames.length,
  documented: componentNames.length - missing.length,
  missingCount: missing.length,
  missing: missing.sort(),
};

console.log(JSON.stringify(result, null, 2));
