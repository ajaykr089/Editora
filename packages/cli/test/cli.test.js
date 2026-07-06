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
