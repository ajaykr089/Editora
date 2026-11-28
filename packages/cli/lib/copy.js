/* `editora add <name> --copy`: writes a component's source into the project, so the project owns and edits it
 * (the way shadcn/ui works), instead of installing it as a package.
 *
 * - The files are the ones the component needs and nothing more: its own file and everything it imports, followed
 *   through relative imports and @editora/ui-core entries (lib/copy-index.js has the import graph).
 * - They come from one commit of the repository (the index records it) and each is checked against its SHA-256, or
 *   from a local checkout with `--source <dir>`.
 * - Custom elements are renamed to the project's prefix (app-button, not ui-button), so the copy never collides with an
 *   installed @editora/ui-core in the same page. Theme tokens (--ui-*) keep their names: one theme styles both.
 * - editora.json in the project root remembers the folder, the prefix and the hash of every file written. A file the
 *   project has not changed since is updated on the next copy; one it has changed is left alone (--overwrite replaces).
 */
const fs = require("fs");
const https = require("https");
const path = require("path");
const { buildIndex, sha256, SCHEMA } = require("./copy-index");

const CONFIG_FILE = "editora.json";
const DEFAULT_PREFIX = "app";
const RUNTIME_PACKAGES = new Set(["react", "react-dom"]);

function toPascal(name) {
  return String(name)
    .replace(/^ui-/, "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function toKebab(name) {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
    .replace(/^ui-/, "");
}

function isUrl(value) {
  return /^https?:\/\//i.test(String(value || ""));
}

async function loadIndex(options = {}) {
  if (options.registry) {
    // Someone else's registry: an index in the same format, from a URL or a file, whose files are
    // fetched from its `baseUrl` (default: next to the index) and checked against their hashes.
    const location = String(options.registry);
    const text = isUrl(location) ? await (options.fetch || download)(location) : fs.readFileSync(path.resolve(location), "utf8");
    let index;
    try {
      index = JSON.parse(text);
    } catch (error) {
      throw new Error(`--registry ${location} is not a JSON copy index: ${error.message}`);
    }
    if (index.schema !== SCHEMA || !index.files) throw new Error(`--registry ${location} is not a copy index (schema ${index.schema}).`);
    const base = index.baseUrl || (isUrl(location) ? location.replace(/[^/]*$/, "") : path.dirname(path.resolve(location)));
    return { index: { ...index, elements: index.elements || {}, react: index.react || {}, blocks: index.blocks || {}, baseUrl: base }, packagesDir: isUrl(base) ? null : base, external: location };
  }
  if (options.source) {
    const packagesDir = path.resolve(options.source, "packages");
    if (!fs.existsSync(path.join(packagesDir, "ui-core", "src"))) {
      throw new Error(`--source ${options.source} is not a checkout of the Editora repository (no packages/ui-core/src).`);
    }
    return { index: buildIndex(packagesDir), packagesDir };
  }
  const file = options.indexFile || path.join(__dirname, "..", "dist", "copy-index.json");
  if (!fs.existsSync(file)) throw new Error("This build of the CLI has no copy index (dist/copy-index.json). Use --source <checkout>.");
  const index = JSON.parse(fs.readFileSync(file, "utf8"));
  if (index.schema !== SCHEMA) throw new Error(`Unsupported copy index (schema ${index.schema}).`);
  return { index, packagesDir: null };
}

/** The root files for a name: the React component (when React is wanted) and/or the custom element. */
function rootsFor(index, name, { react }) {
  const blockName = String(name).toLowerCase();
  if (/^block-/.test(blockName)) {
    const block = (index.blocks || {})[blockName];
    return { roots: block ? [block.file] : [], label: blockName, block: true };
  }
  const pascal = toPascal(name);
  const kebab = toKebab(name);
  const roots = [];
  const reactFile = index.react[pascal];
  const elementFile = index.elements[`ui-${kebab}`];
  if (react && reactFile) roots.push(reactFile);
  else if (elementFile) roots.push(elementFile);
  else if (reactFile) roots.push(reactFile);
  return { roots, label: react && reactFile ? pascal : elementFile ? `ui-${kebab}` : pascal };
}

function closure(index, roots) {
  const seen = new Set();
  const queue = [...roots];
  while (queue.length) {
    const file = queue.shift();
    if (seen.has(file) || !index.files[file]) continue;
    seen.add(file);
    queue.push(...index.files[file].imports);
  }
  return [...seen].sort();
}

function destinationOf(file, dir) {
  // ui-core/src/components/ui-button.ts -> <dir>/core/components/ui-button.ts
  // ui-react/blocks/block-login.tsx    -> <dir>/blocks/block-login.tsx
  const [pkg, root, ...rest] = file.split("/");
  if (pkg === "ui-react" && root === "blocks") return path.join(dir, "blocks", ...rest);
  return path.join(dir, pkg === "ui-core" ? "core" : pkg === "ui-react" ? "react" : pkg, ...rest);
}

function download(url, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers: { "User-Agent": "editora-cli" } }, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        download(response.headers.location, timeoutMs).then(resolve, reject);
        return;
      }
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
    request.setTimeout(timeoutMs, () => request.destroy(new Error(`Timed out fetching ${url}`)));
    request.on("error", reject);
  });
}

async function readSources(index, packagesDir, files, options = {}) {
  const fetchText = options.fetch || download;
  const contents = {};
  const queue = [...files];
  const workers = Array.from({ length: Math.min(8, queue.length) }, async () => {
    while (queue.length) {
      const file = queue.shift();
      let text;
      if (packagesDir) {
        text = fs.readFileSync(path.join(packagesDir, file), "utf8");
      } else if (index.baseUrl) {
        text = await fetchText(`${String(index.baseUrl).replace(/\/?$/, "/")}${file}`);
      } else {
        if (!index.commit) throw new Error("The copy index records no commit to download from. Use --source <checkout>.");
        text = await fetchText(`https://raw.githubusercontent.com/${index.repo}/${index.commit}/packages/${file}`);
      }
      // A file that differs from the one the import graph was built from is refused, never written.
      if ((!packagesDir || options.registry) && index.files[file].sha256 && sha256(text) !== index.files[file].sha256) {
        throw new Error(`${file} does not match the hash in the copy index; nothing was written.`);
      }
      contents[file] = text;
    }
  });
  await Promise.all(workers);
  return contents;
}

/** Rewrites one file for its new home: @editora/ui-core imports become relative, element names get the prefix. */
function transform(file, text, { dir, destination, tags, prefix, index }) {
  let out = text;
  // 1. `@editora/ui-core/<entry>` (from React wrappers) -> a relative import of the copied file.
  out = out.replace(/(['"])@editora\/ui-core\/([a-z0-9-]+)\1/g, (match, quote, entry) => {
    const target = [`ui-core/src/standalone/${entry}.ts`, `ui-core/src/${entry}.ts`].find((candidate) => index.files[candidate]);
    if (!target) return match;
    let rel = path.relative(path.dirname(destination), destinationOf(target, dir)).split(path.sep).join("/");
    rel = rel.replace(/\.tsx?$/, "");
    if (!rel.startsWith(".")) rel = `./${rel}`;
    return `${quote}${rel}${quote}`;
  });
  // 2. Element names. Module specifiers are set aside first: files stay named ui-*.ts, so their paths must not change.
  if (prefix !== "ui" && tags.length) {
    const held = [];
    out = out.replace(/(\bfrom\s*|\bimport\s*\(?\s*)(['"])([^'"\n]+)\2/g, (match) => {
      held.push(match);
      return `\u0000${held.length - 1}\u0000`;
    });
    const names = tags.map((tag) => tag.slice(3)).sort((a, b) => b.length - a.length).map((name) => name.replace(/[-]/g, "\\-"));
    const pattern = new RegExp(`(?<![\\w-])ui-(${names.join("|")})(?![\\w-])`, "g");
    out = out.replace(pattern, `${prefix}-$1`);
    out = out.replace(/\u0000(\d+)\u0000/g, (_, n) => held[Number(n)]);
  }
  return out;
}

function readConfig(projectDir) {
  const file = path.join(projectDir, CONFIG_FILE);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`${CONFIG_FILE} is not valid JSON: ${error.message}`);
  }
}

function defaultDir(projectDir) {
  return fs.existsSync(path.join(projectDir, "src")) ? "src/components/editora" : "components/editora";
}

/**
 * Plans and (unless dryRun) writes a copy. Returns a report; throws on unusable input.
 * @param {string[]} names
 * @param {{ projectDir: string, react: boolean, dir?: string, prefix?: string, overwrite?: boolean, dryRun?: boolean,
 *           source?: string, indexFile?: string, fetch?: (url: string) => Promise<string> }} options
 */
async function copyComponents(names, options) {
  const projectDir = options.projectDir;
  const config = readConfig(projectDir) || {};
  const saved = config.copy || {};
  const dir = options.dir || saved.dir || defaultDir(projectDir);
  const prefix = (options.prefix || saved.prefix || DEFAULT_PREFIX).toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(prefix)) throw new Error(`--prefix must be lowercase letters and digits (got "${prefix}").`);
  if (saved.prefix && options.prefix && saved.prefix !== prefix) {
    throw new Error(`${CONFIG_FILE} says the copied components use the prefix "${saved.prefix}"; mixing "${prefix}" in would break them. Move or delete ${saved.dir} first.`);
  }
  const absDir = path.resolve(projectDir, dir);
  if (path.relative(projectDir, absDir).startsWith("..")) throw new Error(`--dir must be inside the project (${dir}).`);

  const { index, packagesDir, external } = await loadIndex(options);
  const unknown = [];
  const labels = [];
  const roots = [];
  for (const name of names) {
    const found = rootsFor(index, name, { react: options.react });
    if (!found.roots.length) unknown.push(name);
    else {
      labels.push(found.label);
      roots.push(...found.roots);
    }
  }
  if (unknown.length) return { unknown };

  const files = closure(index, roots);
  const sources = await readSources(index, packagesDir, files, options);
  const tags = Object.entries(index.elements).filter(([, file]) => files.includes(file)).map(([tag]) => tag);

  const packages = new Set();
  for (const file of files) for (const pkg of index.files[file].packages) if (!RUNTIME_PACKAGES.has(pkg)) packages.add(pkg);
  if (packages.has("@editora/ui-core")) {
    throw new Error("These components import the whole @editora/ui-core catalogue; copy them one by one instead.");
  }

  let ts = null;
  // A project that copied JavaScript before keeps getting JavaScript.
  if (options.js === undefined && saved.js) options = { ...options, js: true };
  if (options.js) {
    try {
      ts = require(require.resolve("typescript", { paths: [projectDir] }));
    } catch {
      throw new Error("--js compiles the TypeScript sources with the project's own TypeScript: install it first (npm i -D typescript), or copy without --js.");
    }
  }
  const recorded = saved.files || {};
  // Blocks import @editora/ui-react itself: install its latest release (the index was built before the
  // release that numbers these sources, so a range from it could exclude them).
  const ranges = index.dependencyRanges || {};
  const report = { dir, prefix, labels, files: [], packages: [...packages].sort().map((pkg) => (ranges[pkg] && !/^@editora\/ui-(core|react)$/.test(pkg) ? `${pkg}@${ranges[pkg]}` : pkg)), tags, external: external || null, js: !!ts };
  for (const file of files) {
    let destination = destinationOf(file, absDir);
    if (ts) destination = destination.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js");
    const relDest = path.relative(projectDir, destination).split(path.sep).join("/");
    let content = transform(file, sources[file], { dir: absDir, destination: destinationOf(file, absDir), tags, prefix, index });
    if (ts) {
      // JSX stays JSX (.jsx), types go; the relative imports have no extension, so they still resolve.
      content = ts.transpileModule(content, {
        fileName: file,
        compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.Preserve, verbatimModuleSyntax: false, removeComments: false },
      }).outputText;
    }
    const hash = sha256(content);
    let status = "create";
    if (fs.existsSync(destination)) {
      const current = fs.readFileSync(destination, "utf8");
      const currentHash = sha256(current);
      if (currentHash === hash) status = "unchanged";
      else if (options.overwrite) status = "overwrite";
      else if (recorded[relDest] && recorded[relDest] === currentHash) status = "update";
      else status = "skip";
    }
    report.files.push({ file: relDest, status });
    if (options.dryRun || status === "unchanged" || status === "skip") {
      if (status === "unchanged") recorded[relDest] = hash;
      continue;
    }
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
    recorded[relDest] = hash;
  }

  if (!options.dryRun) {
    const components = new Set([...(saved.components || []), ...labels]);
    config.copy = {
      dir,
      prefix,
      commit: index.commit || null,
      ...(external ? { registry: external } : {}),
      ...(ts ? { js: true } : {}),
      components: [...components].sort(),
      files: Object.fromEntries(Object.entries(recorded).sort(([a], [b]) => a.localeCompare(b))),
    };
    fs.writeFileSync(path.join(projectDir, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`);
  }
  report.typescript = fs.existsSync(path.join(projectDir, "tsconfig.json"));
  return report;
}

module.exports = { copyComponents, rootsFor, closure, transform, toPascal, toKebab, loadIndex, readSources, download, destinationOf, CONFIG_FILE, DEFAULT_PREFIX };
