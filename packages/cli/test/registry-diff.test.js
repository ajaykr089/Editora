const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const cli = require("../bin/editora.js");
const { unifiedDiff } = require("../lib/diff");

function runIn(dir, argv) {
  const logs = [];
  const errors = [];
  const status = cli.run(argv, { cwd: dir, color: false, log: (t = "") => logs.push(t), error: (t = "") => errors.push(t), spawn: () => ({ status: 0 }) });
  return Promise.resolve(status).then((code) => ({ code, logs: logs.join("\n"), errors: errors.join("\n") }));
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function makeRegistry() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "editora-own-registry-"));
  write(path.join(dir, "components", "Badge.tsx"), "import { cn } from '../utils/cn';\nimport clsx from 'clsx';\nexport function Badge() {\n  return <span className={cn('badge')} />;\n}\n");
  write(path.join(dir, "utils", "cn.ts"), "export const cn = (...names: string[]) => names.join(' ');\n");
  write(path.join(dir, "elements", "x-rating.ts"), "class XRating extends HTMLElement {}\ncustomElements.define('x-rating', XRating);\n");
  write(path.join(dir, "blocks", "block-hero.tsx"), "// block: A hero section\nimport { Badge } from '../components/Badge';\nexport function HeroBlock() { return <Badge />; }\n");
  write(path.join(dir, "components", "Badge.test.tsx"), "test('x', () => {});\n");
  return dir;
}

function makeProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "editora-diff-"));
  fs.mkdirSync(path.join(dir, "src"));
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name: "p", dependencies: { react: "^18.3.1" } }));
  fs.writeFileSync(path.join(dir, "tsconfig.json"), "{}");
  return dir;
}

test("registry build indexes components, elements and blocks with their imports", async () => {
  const reg = makeRegistry();
  const result = await runIn(reg, ["registry", "build", reg, "--name", "acme"]);
  assert.equal(result.code, 0, result.errors);
  const index = JSON.parse(fs.readFileSync(path.join(reg, "registry.json"), "utf8"));
  assert.equal(index.name, "acme");
  assert.deepEqual(index.react, { Badge: "components/Badge.tsx" });
  assert.deepEqual(index.elements, { "x-rating": "elements/x-rating.ts" });
  assert.equal(index.blocks["block-hero"].description, "A hero section");
  assert.deepEqual(index.files["components/Badge.tsx"].imports, ["utils/cn.ts"]);
  assert.deepEqual(index.files["components/Badge.tsx"].packages, ["clsx"]);
  assert.ok(!index.files["components/Badge.test.tsx"], "tests are left out");
  assert.ok(!index.files["registry.json"]);
  assert.match(result.logs, /3 files|4 files/);
});

test("a component from your own registry is copied with its imports, at their own paths", async () => {
  const reg = makeRegistry();
  await runIn(reg, ["registry", "build", reg]);
  const proj = makeProject();
  const result = await runIn(proj, ["add", "block-hero", "--registry", path.join(reg, "registry.json"), "--no-install"]);
  assert.equal(result.code, 0, result.errors);
  const base = path.join(proj, "src/components/editora");
  assert.ok(fs.existsSync(path.join(base, "blocks/block-hero.tsx")));
  assert.ok(fs.existsSync(path.join(base, "components/Badge.tsx")), "a file keeps its folder and name");
  assert.ok(fs.existsSync(path.join(base, "utils/cn.ts")));
  assert.match(result.logs, /clsx/);
});

test("diff reports up to date, local edits, upstream updates, conflicts and missing files", async () => {
  const reg = makeRegistry();
  const index = path.join(reg, "registry.json");
  await runIn(reg, ["registry", "build", reg]);
  const proj = makeProject();
  await runIn(proj, ["add", "Badge", "--copy", "--registry", index, "--no-install"]);
  const base = path.join(proj, "src/components/editora");

  let result = await runIn(proj, ["diff", "--check"]);
  assert.equal(result.code, 0, result.logs + result.errors);
  assert.match(result.logs, /2 up-to-date/);

  // You edit Badge; upstream edits cn.
  fs.appendFileSync(path.join(base, "components/Badge.tsx"), "// mine\n");
  write(path.join(reg, "utils", "cn.ts"), "export const cn = (...names: string[]) => names.filter(Boolean).join(' ');\n");
  await runIn(reg, ["registry", "build", reg]);
  result = await runIn(proj, ["diff", "--check"]);
  assert.equal(result.code, 1);
  assert.match(result.logs, /components\/Badge\.tsx\s+\(you changed it\)/);
  assert.match(result.logs, /utils\/cn\.ts\s+\(upstream changed/);
  assert.match(result.logs, /\+export const cn = \(\.\.\.names: string\[\]\) => names\.filter\(Boolean\)/);

  // Copying again takes the upstream change but keeps your edit.
  await runIn(proj, ["add", "Badge", "--copy", "--registry", index, "--no-install"]);
  assert.match(fs.readFileSync(path.join(base, "utils/cn.ts"), "utf8"), /filter\(Boolean\)/);
  assert.match(fs.readFileSync(path.join(base, "components/Badge.tsx"), "utf8"), /\/\/ mine/);

  // Upstream now edits Badge too: a conflict. Then a deleted file is missing.
  write(path.join(reg, "components", "Badge.tsx"), fs.readFileSync(path.join(reg, "components", "Badge.tsx"), "utf8").replace("badge", "badge pill"));
  await runIn(reg, ["registry", "build", reg]);
  fs.rmSync(path.join(base, "utils/cn.ts"));
  const json = await runIn(proj, ["diff", "--json"]);
  const report = JSON.parse(json.logs);
  const status = Object.fromEntries(report.files.map((f) => [f.file.replace(/^src\/components\/editora\//, ""), f.status]));
  assert.deepEqual(status, { "components/Badge.tsx": "conflict", "utils/cn.ts": "missing" });
});

test("diff explains when nothing was copied, and rejects names that were not", async () => {
  const proj = makeProject();
  let result = await runIn(proj, ["diff"]);
  assert.equal(result.code, 1);
  assert.match(result.errors, /nothing has been copied/);
  const reg = makeRegistry();
  await runIn(reg, ["registry", "build", reg]);
  await runIn(proj, ["add", "Badge", "--copy", "--registry", path.join(reg, "registry.json"), "--no-install"]);
  result = await runIn(proj, ["diff", "Dialog"]);
  assert.equal(result.code, 1);
  assert.match(result.errors, /Not copied here: Dialog/);
});

test("registry build needs a folder", async () => {
  const result = await runIn(os.tmpdir(), ["registry", "build", path.join(os.tmpdir(), "no-such-folder-xyz")]);
  assert.equal(result.code, 1);
  assert.match(result.errors, /is not a folder/);
  assert.equal((await runIn(os.tmpdir(), ["registry"])).code, 1);
});

test("unifiedDiff writes standard hunks", () => {
  assert.equal(unifiedDiff("a\nb\n", "a\nb\n"), "");
  assert.equal(unifiedDiff("a\nb\nc\n", "a\nB\nc\n", { from: "x", to: "y" }), "--- x\n+++ y\n@@ -1,4 +1,4 @@\n a\n-b\n+B\n c\n \n");
});
