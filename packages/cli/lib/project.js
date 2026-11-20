/* What the CLI learns about the project it runs in: its package.json, its package manager and its framework. */
const fs = require("fs");
const path = require("path");

const SUPPORTED_PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"];

// In the order they are tried when one folder has several (a stray package-lock.json next to pnpm-lock.yaml is common).
const LOCKFILES = [
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["package-lock.json", "npm"],
  ["npm-shrinkwrap.json", "npm"]
];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return null;
  }
}

function parentsOf(start) {
  const dirs = [];
  let dir = path.resolve(start);
  for (;;) {
    dirs.push(dir);
    const parent = path.dirname(dir);
    if (parent === dir) return dirs;
    dir = parent;
  }
}

// The nearest package.json: the project a package manager installs into.
function findProject(cwd) {
  for (const dir of parentsOf(cwd)) {
    const file = path.join(dir, "package.json");
    if (fs.existsSync(file)) {
      const json = readJson(file) || {};
      const dependencies = {
        ...(json.peerDependencies || {}),
        ...(json.devDependencies || {}),
        ...(json.dependencies || {})
      };
      return { dir, file, json, dependencies };
    }
  }
  return null;
}

// "pnpm@9.1.0" -> "pnpm" (the packageManager field that Corepack reads).
function fromPackageManagerField(value) {
  if (typeof value !== "string") return null;
  const name = value.split("@")[0].trim();
  return SUPPORTED_PACKAGE_MANAGERS.includes(name) ? name : null;
}

function fromUserAgent(userAgent) {
  const name = String(userAgent || "").split("/")[0];
  return SUPPORTED_PACKAGE_MANAGERS.includes(name) ? name : null;
}

/* The package manager the project uses, and how that was decided:
 *   1. the packageManager field or a lock file, in the nearest folder (from cwd up) that has either
 *   2. the tool that started the CLI (pnpm dlx, yarn dlx, bunx set npm_config_user_agent; npx says npm)
 *   3. npm
 */
function findPackageManager(options = {}) {
  const cwd = options.cwd || process.cwd();
  const env = options.env || process.env;

  const shown = (dir, file) => path.relative(path.resolve(cwd), path.join(dir, file)) || file;
  for (const dir of parentsOf(cwd)) {
    const json = readJson(path.join(dir, "package.json"));
    const declared = json && fromPackageManagerField(json.packageManager);
    if (declared) return { name: declared, reason: `packageManager in ${shown(dir, "package.json")}` };

    const found = LOCKFILES.filter(([file]) => fs.existsSync(path.join(dir, file)));
    if (found.length > 0) return { name: found[0][1], reason: shown(dir, found[0][0]) };
  }

  const started = fromUserAgent(env.npm_config_user_agent);
  if (started && started !== "npm") return { name: started, reason: `started with ${started}` };
  return { name: "npm", reason: "no lock file found" };
}

function detectPackageManager(options) {
  return findPackageManager(options).name;
}

/* The framework, from the project's dependencies, and the file where its global CSS is imported. */
function detectFramework(project) {
  if (!project) return { name: null, entry: null };
  const has = (name) => Boolean(project.dependencies[name]);
  const exists = (file) => fs.existsSync(path.join(project.dir, file));
  const firstExisting = (files) => files.find(exists) || null;

  if (has("next")) {
    const appRouter = firstExisting(["app/layout.tsx", "app/layout.jsx", "app/layout.js", "src/app/layout.tsx", "src/app/layout.jsx", "src/app/layout.js"]);
    const pagesRouter = firstExisting(["pages/_app.tsx", "pages/_app.jsx", "pages/_app.js", "src/pages/_app.tsx", "src/pages/_app.jsx", "src/pages/_app.js"]);
    return { name: "Next.js", entry: appRouter || pagesRouter || "app/layout.tsx" };
  }
  if (has("@remix-run/react") || has("react-router")) {
    const root = firstExisting(["app/root.tsx", "app/root.jsx"]);
    if (root) return { name: has("@remix-run/react") ? "Remix" : "React Router", entry: root };
  }
  if (has("astro")) return { name: "Astro", entry: firstExisting(["src/layouts/Layout.astro"]) };
  if (has("vite")) {
    const entry = firstExisting(["src/main.tsx", "src/main.jsx", "src/main.ts", "src/main.js", "src/index.tsx", "src/index.jsx"]);
    return { name: has("react") ? "Vite + React" : "Vite", entry };
  }
  if (has("react-scripts")) return { name: "Create React App", entry: firstExisting(["src/index.tsx", "src/index.jsx", "src/index.js"]) };
  if (has("react")) return { name: "React", entry: firstExisting(["src/main.tsx", "src/main.jsx", "src/index.tsx", "src/index.jsx", "src/index.js"]) };
  return { name: null, entry: null };
}

module.exports = {
  SUPPORTED_PACKAGE_MANAGERS,
  findProject,
  findPackageManager,
  detectPackageManager,
  detectFramework
};
