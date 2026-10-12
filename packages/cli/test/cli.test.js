const test = require("node:test");
const assert = require("node:assert");
const cli = require("../bin/editora.js");

test("parseArgs parses add command with dry-run", () => {
  const parsed = cli.parseArgs(["add", "button", "--dry-run"]);
  assert.equal(parsed.command, "add");
  assert.deepEqual(parsed.targets, ["button"]);
  assert.equal(parsed.dryRun, true);
  assert.equal(parsed.packageManager, undefined);
});

test("parseArgs parses package manager with equals syntax", () => {
  const parsed = cli.parseArgs(["add", "modal", "--package-manager=pnpm"]);
  assert.equal(parsed.command, "add");
  assert.deepEqual(parsed.targets, ["modal"]);
  assert.equal(parsed.packageManager, "pnpm");
});

test("parseArgs parses package manager with separate arg", () => {
  const parsed = cli.parseArgs(["add", "toast", "--package-manager", "yarn"]);
  assert.equal(parsed.command, "add");
  assert.deepEqual(parsed.targets, ["toast"]);
  assert.equal(parsed.packageManager, "yarn");
});

test("resolveTarget returns canonical UI component name for ui- prefix", () => {
  const resolved = cli.resolveTarget("ui-button");
  assert.equal(resolved.canonicalName, "button");
  assert.deepEqual(resolved.entry.packages, ["@editora/ui-react"]);
});

test("resolveTarget handles special commands", () => {
  const resolved = cli.resolveTarget("modal");
  assert.equal(resolved.canonicalName, "modal");
  assert.deepEqual(resolved.entry.packages, ["@editora/ui-react"]);
});

test("run returns zero for help flag", () => {
  const result = cli.run(["--help"]);
  assert.equal(result, 0);
});

test("run returns zero for version flag", () => {
  const result = cli.run(["--version"]);
  assert.equal(result, 0);
});

test("run returns one for unsupported command", () => {
  const result = cli.run(["remove", "button"]);
  assert.equal(result, 1);
});

test("run returns one for unsupported package manager", () => {
  const result = cli.run(["add", "button", "--package-manager", "unknown"]);
  assert.equal(result, 1);
});

test("run returns zero for dry-run command", () => {
  const result = cli.run(["add", "button", "--dry-run"]);
  assert.equal(result, 0);
});

test("every component that @editora/ui-react exports can be added", (t) => {
  const fs = require("node:fs");
  const path = require("node:path");
  const indexFile = path.join(__dirname, "..", "..", "ui-react", "src", "index.tsx");
  if (!fs.existsSync(indexFile)) return t.skip("@editora/ui-react is not next to the CLI");

  const source = fs.readFileSync(indexFile, "utf8");
  const exported = new Set();
  for (const [, typeOnly, names] of source.matchAll(/export\s*(type\s*)?\{([^}]*)\}/g)) {
    if (typeOnly) continue;
    for (const entry of names.split(",")) {
      const name = entry.trim().split(/\s+as\s+/).pop().trim();
      if (/^[A-Z]/.test(name) && !/^type\s/.test(entry.trim())) exported.add(name);
    }
  }
  const pascal = (name) => name.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  const listed = cli.uiReactComponents.map(pascal);
  const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

  // AlertTitle, AppHeaderStart, NavigationMenuItem...: parts of a component that is listed, installed with it.
  const missing = [...exported].filter(
    (name) => !cli.resolveTarget(kebab(name)) && !listed.some((component) => name.startsWith(component))
  );
  assert.deepEqual(missing, [], "add these to uiReactComponents in bin/editora.js");
});

test("run installs with the chosen package manager and returns its exit code", (t) => {
  if (process.platform === "win32") return t.skip("the stub package manager is a shell script");
  const fs = require("node:fs");
  const os = require("node:os");
  const path = require("node:path");
  const { spawnSync } = require("node:child_process");

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "editora-cli-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const received = path.join(dir, "received.txt");
  fs.writeFileSync(path.join(dir, "pnpm"), `#!/bin/sh\necho "$@" > "${received}"\nexit 3\n`, { mode: 0o755 });

  const result = spawnSync(process.execPath, [path.join(__dirname, "..", "bin", "editora.js"), "add", "editor", "--package-manager", "pnpm"], {
    encoding: "utf8",
    env: { ...process.env, PATH: dir + path.delimiter + process.env.PATH }
  });
  assert.equal(fs.readFileSync(received, "utf8").trim(), "add @editora/react @editora/plugins @editora/themes");
  assert.equal(result.status, 3);
});

test("run says so when the package manager cannot be started", (t) => {
  const fs = require("node:fs");
  const os = require("node:os");
  const path = require("node:path");
  const { spawnSync } = require("node:child_process");

  const empty = fs.mkdtempSync(path.join(os.tmpdir(), "editora-cli-"));
  t.after(() => fs.rmSync(empty, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [path.join(__dirname, "..", "bin", "editora.js"), "add", "button", "--package-manager", "bun"], {
    encoding: "utf8",
    env: { ...process.env, PATH: empty }
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Could not run bun/);
});
