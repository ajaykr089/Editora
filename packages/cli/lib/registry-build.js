/* `editora registry build <dir>`: makes a copy index for your own components, so others can copy them with
 * `editora add <name> --copy --registry <url-or-file>` the way they copy Editora's.
 *
 * Every .ts/.tsx/.js/.jsx/.css file under <dir> is listed with its SHA-256, the files it imports (relative imports)
 * and the packages it needs. Names come from the files:
 *   - a PascalCase .tsx/.jsx file (Button.tsx) is a React component named after it,
 *   - a file that calls customElements.define('x-y', …) defines that element,
 *   - block-*.tsx/jsx is a block; its first `// block: …` line describes it.
 * Host <dir> as it is, with the index next to it (or pass --base-url for where the files live).
 */
const fs = require("fs");
const path = require("path");
const { specifiers, sha256, SCHEMA } = require("./copy-index");

const SOURCE = /\.(tsx?|jsx?|mjs|css)$/;
const SKIP_DIRS = new Set(["node_modules", "__tests__", "dist", ".git"]);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith(".")) out.push(...walk(abs));
    } else if (SOURCE.test(entry.name) && !/\.d\.ts$|\.(test|spec|stories)\.[jt]sx?$/.test(entry.name)) {
      out.push(abs);
    }
  }
  return out;
}

function packageName(specifier) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/**
 * @param {string} dir  the folder of components
 * @param {{ baseUrl?: string, name?: string, exclude?: string[] }} [options]
 * @returns {{ index: object, warnings: string[] }}
 */
function buildRegistry(dir, options = {}) {
  const root = path.resolve(dir);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`${dir} is not a folder.`);
  const exclude = new Set((options.exclude || []).map((file) => path.resolve(file)));
  const all = walk(root).filter((abs) => !exclude.has(abs));
  const rels = new Set(all.map((abs) => path.relative(root, abs).split(path.sep).join("/")));
  const files = {};
  const elements = {};
  const react = {};
  const blocks = {};
  const warnings = [];
  const resolveRelative = (fromRel, spec) => {
    const base = path.posix.normalize(path.posix.join(path.posix.dirname(fromRel), spec));
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.jsx`, `${base}.mjs`, `${base}/index.ts`, `${base}/index.tsx`, `${base}/index.js`, `${base}/index.jsx`]) {
      if (rels.has(candidate)) return candidate;
    }
    return null;
  };

  for (const abs of all.sort()) {
    const rel = path.relative(root, abs).split(path.sep).join("/");
    const source = fs.readFileSync(abs, "utf8");
    const imports = new Set();
    const packages = new Set();
    const unresolved = [];
    if (!rel.endsWith(".css")) {
      for (const spec of specifiers(source)) {
        if (spec.startsWith(".")) {
          const target = resolveRelative(rel, spec);
          if (target) imports.add(target);
          else unresolved.push(spec);
        } else if (!spec.startsWith("node:")) {
          packages.add(packageName(spec));
        }
      }
    }
    for (const spec of unresolved) warnings.push(`${rel}: cannot find ${spec} inside ${dir}; it will not be copied with it.`);
    files[rel] = {
      sha256: sha256(source),
      size: Buffer.byteLength(source, "utf8"),
      imports: [...imports].sort(),
      packages: [...packages].sort(),
      ...(unresolved.length ? { unresolved } : {}),
    };
    for (const match of source.matchAll(/customElements\.define\(\s*['"]([a-z][a-z0-9]*-[a-z0-9-]*)['"]/g)) {
      if (elements[match[1]] && elements[match[1]] !== rel) warnings.push(`<${match[1]}> is defined in ${elements[match[1]]} and ${rel}; using the first.`);
      else elements[match[1]] = rel;
    }
    const base = path.posix.basename(rel).replace(/\.[^.]+$/, "");
    if (/^block-[a-z0-9-]+$/.test(base) && /\.(tsx|jsx)$/.test(rel)) {
      const doc = /^\/\/ block: (.+)$/m.exec(source);
      blocks[base] = { file: rel, description: doc ? doc[1].trim() : "" };
    } else if (/^[A-Z][A-Za-z0-9]*$/.test(base) && /\.(tsx|jsx)$/.test(rel)) {
      if (react[base] && react[base] !== rel) warnings.push(`${base} is in ${react[base]} and ${rel}; using the first.`);
      else react[base] = rel;
    }
  }

  const index = {
    schema: SCHEMA,
    ...(options.name ? { name: options.name } : {}),
    ...(options.baseUrl ? { baseUrl: options.baseUrl } : {}),
    commit: null,
    elements,
    react,
    blocks,
    files,
  };
  return { index, warnings };
}

module.exports = { buildRegistry };
