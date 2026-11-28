/* The index `editora add --copy` works from: every source file of @editora/ui-core and @editora/ui-react
 * with its SHA-256, the files it imports and the packages it needs, plus which file defines each custom element and
 * React component.
 *
 * It is built from a checkout of the repository (scripts/build.js writes dist/copy-index.json when the CLI is built;
 * `--source <checkout>` builds it on the fly). The CLI ships only this index; the files themselves are downloaded from
 * the commit the index was built at and checked against their hash, so a copy is always one consistent snapshot.
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const SCHEMA = 1;
const ROOTS = ["ui-core/src", "ui-react/src", "ui-react/blocks"];

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "node_modules") continue;
      out.push(...walk(abs));
    } else if (/\.tsx?$/.test(entry.name) && !/\.d\.ts$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
      out.push(abs);
    }
  }
  return out;
}

// Every module specifier: static imports and re-exports (also `import type`), side-effect imports, dynamic import().
function specifiers(source) {
  const found = new Set();
  const stat = /(?:^|[\n;])\s*(?:import|export)\b(?:[^'"`;]*?\bfrom\s*)?\s*['"]([^'"\n]+)['"]/g;
  const dyn = /\bimport\(\s*['"]([^'"\n]+)['"]\s*\)/g;
  for (const match of source.matchAll(stat)) found.add(match[1]);
  for (const match of source.matchAll(dyn)) found.add(match[1]);
  return [...found];
}

function packageName(specifier) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/**
 * @param {string} packagesDir  the repository's `packages` folder
 * @param {{ commit?: string | null, repo?: string }} [meta]
 */
function buildIndex(packagesDir, meta = {}) {
  const files = {};
  const elements = {};
  const react = {};
  const blocks = {};
  const exists = (rel) => fs.existsSync(path.join(packagesDir, rel));
  const resolveRelative = (fromRel, spec) => {
    const base = path.posix.normalize(path.posix.join(path.posix.dirname(fromRel), spec));
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]) {
      if (/\.tsx?$/.test(candidate) && exists(candidate)) return candidate;
    }
    return null;
  };
  // @editora/ui-core/<entry> as ui-react imports it -> the ui-core source file behind that entry.
  const resolveCoreEntry = (spec) => {
    const entry = spec.slice("@editora/ui-core/".length);
    for (const candidate of [`ui-core/src/standalone/${entry}.ts`, `ui-core/src/${entry}.ts`]) {
      if (exists(candidate)) return candidate;
    }
    return null;
  };

  for (const root of ROOTS) {
    for (const abs of walk(path.join(packagesDir, root))) {
      const rel = path.relative(packagesDir, abs).split(path.sep).join("/");
      const source = fs.readFileSync(abs, "utf8");
      const imports = new Set();
      const packages = new Set();
      const unresolved = [];
      for (const spec of specifiers(source)) {
        if (spec.startsWith(".")) {
          const target = resolveRelative(rel, spec);
          if (target) imports.add(target);
          else if (!/\.(css|json)$/.test(spec)) unresolved.push(spec);
        } else if (spec === "@editora/ui-core") {
          // Only the components barrel imports the whole catalogue; copying it would copy everything.
          packages.add(spec);
        } else if (spec.startsWith("@editora/ui-core/")) {
          const target = resolveCoreEntry(spec);
          if (target) imports.add(target);
          else unresolved.push(spec);
        } else if (!spec.startsWith("node:")) {
          packages.add(packageName(spec));
        }
      }
      files[rel] = {
        sha256: sha256(source),
        size: Buffer.byteLength(source, "utf8"),
        imports: [...imports].sort(),
        packages: [...packages].sort(),
        ...(unresolved.length ? { unresolved } : {}),
      };
      for (const match of source.matchAll(/customElements\.define\(\s*['"]([a-z][a-z0-9-]*)['"]/g)) {
        if (rel.startsWith("ui-core/src/components/")) elements[match[1]] = rel;
      }
      const component = /^ui-react\/src\/components\/([A-Z][A-Za-z0-9]*)\.tsx$/.exec(rel);
      if (component) react[component[1]] = rel;
      const block = /^ui-react\/blocks\/(block-[a-z0-9-]+)\.tsx$/.exec(rel);
      if (block) {
        // The first line names what the block is: `// block: A sign-in card…`.
        const doc = /^\/\/ block: (.+)$/m.exec(source);
        blocks[block[1]] = { file: rel, description: doc ? doc[1].trim() : "" };
      }
    }
  }

  const pkg = (name) => JSON.parse(fs.readFileSync(path.join(packagesDir, name, "package.json"), "utf8"));
  const core = pkg("ui-core");
  const reactPkg = pkg("ui-react");
  const ranges = { ...(core.dependencies || {}), ...(reactPkg.dependencies || {}) };
  delete ranges["@editora/ui-core"];

  return {
    schema: SCHEMA,
    repo: meta.repo || "ajaykr089/Editora",
    commit: meta.commit || null,
    versions: { "@editora/ui-core": core.version, "@editora/ui-react": reactPkg.version },
    dependencyRanges: ranges,
    elements,
    react,
    blocks,
    files,
  };
}

module.exports = { buildIndex, specifiers, sha256, SCHEMA };
