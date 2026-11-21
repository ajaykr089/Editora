const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const cli = require("../bin/editora.js");

const bin = path.join(__dirname, "..", "bin", "editora.js");
const repo = path.join(__dirname, "..", "..", "..");

// A throwaway project: { "package.json": {...}, "pnpm-lock.yaml": "" ... }. Objects are written as JSON.
function project(t, files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "editora-cli-project-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), typeof content === "string" ? content : JSON.stringify(content));
  }
  return dir;
}

// Runs the CLI in-process and keeps what it printed.
function capture(argv, options = {}) {
  const lines = [];
  const result = cli.run(argv, {
    env: {},
    log: (text = "") => lines.push(String(text)),
    error: (text = "") => lines.push(String(text)),
    ...options
  });
  const finish = (status) => ({ status, output: lines.join("\n") });
  return result && typeof result.then === "function" ? result.then(finish) : finish(result);
}

const REACT_APP = { name: "app", dependencies: { react: "^18.3.1", "react-dom": "^18.3.1" } };

// ---------------------------------------------------------------------------------------------------------------------
// The package manager

test("the lock file decides the package manager, even when npx started the CLI", (t) => {
  const npx = { npm_config_user_agent: "npm/10.8.2 node/v22.0.0 darwin arm64 workspaces/false" };
  for (const [lockfile, expected] of [
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["bun.lock", "bun"],
    ["bun.lockb", "bun"],
    ["package-lock.json", "npm"]
  ]) {
    const dir = project(t, { "package.json": REACT_APP, [lockfile]: "" });
    const found = cli.findPackageManager({ cwd: dir, env: npx });
    assert.equal(found.name, expected, lockfile);
    assert.equal(found.reason, lockfile);
  }
});

test("the packageManager field wins over a lock file next to it", (t) => {
  const dir = project(t, { "package.json": { ...REACT_APP, packageManager: "yarn@4.5.0" }, "package-lock.json": "" });
  assert.deepEqual(cli.findPackageManager({ cwd: dir, env: {} }), { name: "yarn", reason: "packageManager in package.json" });
});

test("in a workspace package, the lock file of the repository root is found", (t) => {
  const dir = project(t, { "package.json": { private: true }, "pnpm-lock.yaml": "", "apps/web/package.json": REACT_APP });
  const found = cli.findPackageManager({ cwd: path.join(dir, "apps", "web"), env: {} });
  assert.equal(found.name, "pnpm");
  assert.equal(found.reason, path.join("..", "..", "pnpm-lock.yaml"));
});

test("two lock files in one folder: pnpm, yarn and bun come before a stray package-lock.json", (t) => {
  const dir = project(t, { "package.json": REACT_APP, "package-lock.json": "", "pnpm-lock.yaml": "" });
  assert.equal(cli.detectPackageManager({ cwd: dir, env: {} }), "pnpm");
});

test("with no lock file, the tool that started the CLI is used, and then npm", (t) => {
  const dir = project(t, { "package.json": REACT_APP });
  assert.equal(cli.detectPackageManager({ cwd: dir, env: { npm_config_user_agent: "pnpm/9.12.0 npm/? node/v22" } }), "pnpm");
  assert.equal(cli.detectPackageManager({ cwd: dir, env: { npm_config_user_agent: "bun/1.1.30 npm/? node/v22" } }), "bun");
  assert.deepEqual(cli.findPackageManager({ cwd: dir, env: {} }), { name: "npm", reason: "no lock file found" });
});

test("add installs with the detected package manager, in the project's folder", (t) => {
  const dir = project(t, { "package.json": REACT_APP, "yarn.lock": "", "src/index.js": "" });
  const calls = [];
  const result = capture(["add", "button"], {
    cwd: path.join(dir, "src"),
    spawn: (cmd, args) => {
      calls.push([cmd, ...args].join(" "));
      return { status: 0 };
    }
  });
  assert.equal(result.status, 0);
  assert.deepEqual(calls, ["yarn add @editora/ui-react"]);
  assert.match(result.output, /Installing with yarn \(\.\.\/yarn\.lock\)/);
  assert.match(result.output, /Installed\./);
});

test("--package-manager still wins over the lock file", (t) => {
  const dir = project(t, { "package.json": REACT_APP, "yarn.lock": "" });
  const result = capture(["add", "toast", "--package-manager", "bun", "--dry-run"], { cwd: dir });
  assert.match(result.output, /Installing with bun \(--package-manager\):\n  bun add @editora\/toast/);
});

test("a failed install returns the package manager's status and says so", (t) => {
  const dir = project(t, { "package.json": REACT_APP });
  const result = capture(["add", "toast"], { cwd: dir, spawn: () => ({ status: 7 }) });
  assert.equal(result.status, 7);
  assert.match(result.output, /The install failed \(npm exited with status 7\)/);
  assert.doesNotMatch(result.output, /Next steps/);
});

// ---------------------------------------------------------------------------------------------------------------------
// Names

test("package names, the ui-* packages and aliases resolve", () => {
  assert.equal(cli.resolveTarget("@editora/toast").canonicalName, "toast");
  assert.equal(cli.resolveTarget("@editora/ui-sortable").canonicalName, "ui-sortable");
  assert.equal(cli.resolveTarget("@editora/react").canonicalName, "editor");
  assert.equal(cli.resolveTarget("@editora/core").canonicalName, "web-editor");
  assert.equal(cli.resolveTarget("@editora/no-such-package"), null);

  assert.deepEqual(cli.resolveTarget("ui-sortable").entry.packages, ["@editora/ui-sortable"]);
  assert.deepEqual(cli.resolveTarget("ui-core").entry.packages, ["@editora/ui-core"]);
  assert.deepEqual(cli.resolveTarget("ui-editor").entry.packages, ["@editora/ui-editor"]);
  // Loosely written, a ui- name is still a component of @editora/ui-react.
  assert.equal(cli.resolveTarget("ui-toast").entry.component, "Toast");
  assert.equal(cli.resolveTarget("sortable").entry.component, "Sortable");
  assert.equal(cli.resolveTarget("DataTable").canonicalName, "data-table");
  assert.equal(cli.resolveTarget("editor").canonicalName, "editor");

  assert.deepEqual(cli.resolveTarget("code-editor").entry.packages, ["@editora/light-code-editor"]);
  assert.deepEqual(cli.specialRegistry["web-components"].packages, ["@editora/ui-core"]);
});

test("editor installs @editora/core too, which package managers that skip peers would leave out", () => {
  assert.ok(cli.resolveTarget("editor").entry.packages.includes("@editora/core"));
  assert.ok(cli.resolveTarget("markdown-editor").entry.packages.includes("@editora/themes"));
});

test("a misspelt name gets suggestions", () => {
  assert.deepEqual(cli.suggestTargets("datatabel"), ["data-table"]);
  assert.ok(cli.suggestTargets("tost").includes("toast"));
  assert.deepEqual(cli.suggestTargets("zzzzzzzz"), []);

  const result = capture(["add", "datepiker", "--dry-run"]);
  assert.equal(result.status, 1);
  assert.match(result.output, /Unknown name: datepiker\. Did you mean date-picker/);
  assert.match(result.output, /editora list/);
});

test("list shows every group, searches, and prints JSON", () => {
  const all = capture(["list"]);
  assert.equal(all.status, 0);
  for (const heading of ["Editors", "UI", "Content tools", "Testing", "Bundles", "UI components"]) {
    assert.match(all.output, new RegExp(`^${heading}`, "m"));
  }

  const search = capture(["list", "docx"]);
  assert.match(search.output, /docx/);
  assert.doesNotMatch(search.output, /toast/);

  // Every package is @editora/..., which must not make "editor" match everything.
  const editors = capture(["list", "editor"]);
  assert.match(editors.output, /markdown-editor/);
  assert.doesNotMatch(editors.output, /paste-cleaner|react-icons|ui-sortable|modal/);

  const none = capture(["list", "no-such-thing"]);
  assert.equal(none.status, 1);

  const json = capture(["list", "picker", "--json"]);
  const items = JSON.parse(json.output);
  assert.ok(items.some((item) => item.name === "date-picker" && item.packages[0] === "@editora/ui-react"));
  assert.ok(items.some((item) => item.name === "color-picker"));
});

test("dev packages get their own install command", (t) => {
  const dir = project(t, { "package.json": REACT_APP, "pnpm-lock.yaml": "" });
  const calls = [];
  capture(["add", "ui-testing", "button"], { cwd: dir, spawn: (cmd, args) => (calls.push([cmd, ...args].join(" ")), { status: 0 }) });
  assert.deepEqual(calls, ["pnpm add @editora/ui-react", "pnpm add -D @editora/ui-testing"]);
  assert.deepEqual(cli.installCommand("npm", ["x"], { dev: true }), ["npm", ["install", "--save-dev", "x"]]);
  assert.deepEqual(cli.installCommand("yarn", ["x"], { dev: true }), ["yarn", ["add", "--dev", "x"]]);
  assert.deepEqual(cli.installCommand("bun", ["x"], { dev: true }), ["bun", ["add", "--dev", "x"]]);
});

// ---------------------------------------------------------------------------------------------------------------------
// The project

test("with no package.json, add refuses to install, and a dry run still shows the command", (t) => {
  const dir = project(t);
  const refused = capture(["add", "toast"], { cwd: dir, spawn: () => assert.fail("must not install") });
  assert.equal(refused.status, 1);
  assert.match(refused.output, /No package\.json in .* or any folder above it/);

  const dry = capture(["add", "toast", "--dry-run"], { cwd: dir });
  assert.equal(dry.status, 0);
  assert.match(dry.output, /npm install @editora\/toast/);
});

test("a React package in a project without React says what to add", (t) => {
  const dir = project(t, { "package.json": { name: "plain" }, "pnpm-lock.yaml": "" });
  const result = capture(["add", "editor", "--dry-run"], { cwd: dir });
  assert.match(result.output, /this needs react and react-dom, which package\.json does not list\. Add them with:\n  pnpm add react react-dom/);

  const plain = capture(["add", "toast", "--dry-run"], { cwd: dir });
  assert.doesNotMatch(plain.output, /needs react/);
});

test("next steps: the styles once, in the framework's entry file, then the code", (t) => {
  const vite = project(t, { "package.json": { ...REACT_APP, devDependencies: { vite: "^5.4.0" } }, "src/main.tsx": "" });
  const result = capture(["add", "editor", "button", "toast", "data-table", "--dry-run"], { cwd: vite });
  const output = result.output;
  assert.match(output, /Import the styles once, in src\/main\.tsx:/);
  assert.equal(output.split("import '@editora/plugins/styles.css';").length, 2, "each stylesheet once");
  // The toast main entry brings its own styles (2.2), so it adds no import.
  assert.doesNotMatch(output, /toast\.css/);
  assert.match(output, /import { Button, DataTable } from '@editora\/ui-react';/);
  // In the order the names were given: editor, then the components, then toast.
  assert.ok(output.indexOf("editor:") < output.indexOf("button, data-table:"));
  assert.ok(output.indexOf("button, data-table:") < output.indexOf("toast:"));

  const next = project(t, { "package.json": { ...REACT_APP, dependencies: { ...REACT_APP.dependencies, next: "^15.0.0" } }, "src/app/layout.tsx": "" });
  assert.match(capture(["add", "web-editor", "--dry-run"], { cwd: next }).output, /in src\/app\/layout\.tsx:/);
  assert.equal(cli.detectFramework(cli.findProject(next)).name, "Next.js");

  const nothing = project(t, { "package.json": { name: "plain" } });
  assert.match(capture(["add", "web-editor", "--dry-run"], { cwd: nothing }).output, /in your app's entry file:/);
});

// ---------------------------------------------------------------------------------------------------------------------
// init

test("init names the project, framework and package manager, then installs what was named", (t) => {
  const dir = project(t, { "package.json": { ...REACT_APP, devDependencies: { vite: "^5.4.0" } }, "bun.lock": "", "src/main.jsx": "" });
  const result = capture(["init", "editor", "toast", "--dry-run"], { cwd: dir });
  assert.equal(result.status, 0);
  assert.match(result.output, /Project {10}app/);
  assert.match(result.output, /Framework {8}Vite \+ React \(styles go in src\/main\.jsx\)/);
  assert.match(result.output, /Package manager {2}bun \(bun\.lock\)/);
  assert.match(result.output, /Setting up editor, toast/);
  assert.match(result.output, /bun add @editora\/react @editora\/core @editora\/plugins @editora\/themes @editora\/toast/);
});

test("init asks what to set up in a terminal, and offers web components outside React", async (t) => {
  const react = project(t, { "package.json": REACT_APP });
  const asked = [];
  const picked = await capture(["init", "--dry-run"], { cwd: react, interactive: true, ask: (question) => (asked.push(question), "2 4") });
  assert.equal(asked.length, 1);
  assert.equal(picked.status, 0);
  assert.match(picked.output, /1 {2}UI components/);
  assert.match(picked.output, /Setting up editor, toast/);

  const byName = await capture(["init", "--dry-run"], { cwd: react, interactive: true, ask: () => "markdown-editor, 4" });
  assert.match(byName.output, /Setting up markdown-editor, toast/);

  const wrong = await capture(["init", "--dry-run"], { cwd: react, interactive: true, ask: () => "9" });
  assert.equal(wrong.status, 1);
  const cancelled = await capture(["init", "--dry-run"], { cwd: react, interactive: true, ask: () => "" });
  assert.equal(cancelled.status, 1);
  assert.match(cancelled.output, /Nothing was installed/);

  const plain = project(t, { "package.json": { name: "plain" } });
  const web = await capture(["init", "--dry-run"], { cwd: plain, interactive: true, ask: () => "1 2" });
  assert.match(web.output, /Setting up ui-core, web-editor/);
});

test("init outside a terminal lists the choices and asks for names instead of waiting", (t) => {
  const dir = project(t, { "package.json": REACT_APP });
  const result = capture(["init"], { cwd: dir, interactive: false, ask: () => assert.fail("must not ask") });
  assert.equal(result.status, 1);
  assert.match(result.output, /editora init ui-react toast/);

  const none = capture(["init"], { cwd: project(t), interactive: false });
  assert.equal(none.status, 1);
  assert.match(none.output, /No package\.json/);
});

test("the command itself waits for init's answer and exits with its status", (t) => {
  const dir = project(t, { "package.json": REACT_APP });
  const result = spawnSync(process.execPath, [bin, "init", "toast", "--dry-run"], { cwd: dir, encoding: "utf8", env: { PATH: process.env.PATH } });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Setting up toast/);
  // No colour when the output is not a terminal.
  assert.doesNotMatch(result.stdout, /\u001b\[/);
});

// ---------------------------------------------------------------------------------------------------------------------
// The registry against the packages it names

function workspacePackages() {
  const found = new Map();
  for (const parent of ["packages", path.join("packages", "plugins")]) {
    for (const name of fs.readdirSync(path.join(repo, parent))) {
      const file = path.join(repo, parent, name, "package.json");
      if (!fs.existsSync(file)) continue;
      const json = JSON.parse(fs.readFileSync(file, "utf8"));
      found.set(json.name, { dir: path.dirname(file), json });
    }
  }
  return found;
}

// "@editora/themes/themes/default.css" -> is "./themes/default.css" (or a "./themes/*" pattern) exported?
function exportsPath(pkg, specifier) {
  const sub = specifier === pkg.json.name ? "." : `.${specifier.slice(pkg.json.name.length)}`;
  const exportsField = pkg.json.exports;
  if (!exportsField) return sub === "." || fs.existsSync(path.join(pkg.dir, sub));
  if (typeof exportsField === "string") return sub === ".";
  return Object.keys(exportsField).some((key) => {
    if (key === sub) return true;
    if (!key.includes("*")) return false;
    const [before, after] = key.split("*");
    return sub.startsWith(before) && sub.endsWith(after);
  });
}

test("every package, stylesheet and import the registry names exists in this repository", (t) => {
  const packages = workspacePackages();
  if (!packages.has("@editora/ui-react")) return t.skip("not inside the Editora repository");
  const problems = [];
  const ownerOf = (specifier) => [...packages.keys()].filter((name) => specifier === name || specifier.startsWith(`${name}/`)).sort((a, b) => b.length - a.length)[0];

  for (const [name, entry] of Object.entries(cli.specialRegistry)) {
    for (const pkg of entry.packages) {
      if (!packages.has(pkg)) problems.push(`${name}: no package ${pkg}`);
      else if (packages.get(pkg).json.private) problems.push(`${name}: ${pkg} is private`);
      else if (/deprecated/i.test(packages.get(pkg).json.description || "")) problems.push(`${name}: ${pkg} is deprecated`);
    }
    for (const style of entry.styles || []) {
      const owner = ownerOf(style);
      if (!owner || !exportsPath(packages.get(owner), style)) problems.push(`${name}: ${style} is not exported`);
      else if (!entry.packages.includes(owner) && !(packages.get(entry.packages[0]).json.dependencies || {})[owner]) {
        problems.push(`${name}: ${style} comes from ${owner}, which it does not install`);
      }
    }
    for (const [, names, specifier] of (entry.usage || []).join("\n").matchAll(/import\s+(?:\{([^}]*)\}\s+from\s+)?'([^']+)'/g)) {
      const owner = ownerOf(specifier);
      if (!owner || !exportsPath(packages.get(owner), specifier)) {
        problems.push(`${name}: ${specifier} is not exported`);
        continue;
      }
      // Each imported name is in the package's README, so a renamed export breaks this test, not the user's app.
      const readme = fs.readFileSync(path.join(packages.get(owner).dir, "README.md"), "utf8");
      for (const imported of (names || "").split(",").map((part) => part.trim()).filter(Boolean)) {
        if (!new RegExp(`\\b${imported}\\b`).test(readme)) problems.push(`${name}: ${imported} is not in the README of ${owner}`);
      }
    }
  }
  assert.deepEqual(problems, []);
});

test("every component name is a real export of @editora/ui-react", (t) => {
  const indexFile = path.join(repo, "packages", "ui-react", "src", "index.tsx");
  if (!fs.existsSync(indexFile)) return t.skip("@editora/ui-react is not next to the CLI");
  const source = fs.readFileSync(indexFile, "utf8");
  const exported = new Set();
  for (const [, typeOnly, names] of source.matchAll(/export\s*(type\s*)?\{([^}]*)\}/g)) {
    if (typeOnly) continue;
    for (const entry of names.split(",")) {
      if (entry.trim() && !/^type\s/.test(entry.trim())) exported.add(entry.trim().split(/\s+as\s+/).pop().trim());
    }
  }
  const { uiReactExportName } = require("../lib/registry");
  const missing = cli.uiReactComponents.filter((name) => !exported.has(uiReactExportName(name)));
  assert.deepEqual(missing, []);
});
