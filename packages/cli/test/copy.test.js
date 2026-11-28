const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const cli = require("../bin/editora.js");
const { buildIndex, sha256 } = require("../lib/copy-index");
const { transform, toPascal, toKebab, closure } = require("../lib/copy");

const repo = path.resolve(__dirname, "..", "..", "..");
const packagesDir = path.join(repo, "packages");

function project(deps = { react: "^18.3.1", "react-dom": "^18.3.1" }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "editora-copy-"));
  fs.mkdirSync(path.join(dir, "src"));
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name: "p", dependencies: deps }));
  fs.writeFileSync(path.join(dir, "tsconfig.json"), "{}");
  return dir;
}

function runIn(dir, argv, extra = {}) {
  const logs = [];
  const errors = [];
  const spawned = [];
  const status = cli.run(argv, {
    cwd: dir,
    color: false,
    log: (text = "") => logs.push(text),
    error: (text = "") => errors.push(text),
    spawn: (cmd, args) => {
      spawned.push([cmd, ...args].join(" "));
      return { status: 0 };
    },
    ...extra,
  });
  return Promise.resolve(status).then((code) => ({ code, logs: logs.join("\n"), errors: errors.join("\n"), spawned }));
}

const index = buildIndex(packagesDir, { commit: "abc123" });

test("the index covers every element and React component, with nothing unresolved", () => {
  assert.ok(index.elements["ui-button"]);
  assert.ok(index.elements["ui-message-scroller"]);
  assert.ok(index.react.Button);
  assert.ok(index.react.Questionnaire);
  const unresolved = Object.entries(index.files).filter(([, file]) => file.unresolved);
  assert.deepEqual(unresolved, []);
  for (const file of Object.keys(index.files)) assert.ok(!/__tests__|\.test\./.test(file), file);
});

test("a closure follows relative imports and ui-core entries, and stays small", () => {
  const files = closure(index, [index.react.Button]);
  assert.ok(files.includes("ui-core/src/components/ui-button.ts"));
  assert.ok(files.includes("ui-core/src/ElementBase.ts"));
  assert.ok(!files.some((file) => file.includes("ui-gantt")), "unrelated components are not copied");
  assert.ok(files.length < 30, `${files.length} files`);
});

test("names map to components and elements", () => {
  assert.equal(toPascal("message-scroller"), "MessageScroller");
  assert.equal(toPascal("ui-button"), "Button");
  assert.equal(toKebab("MessageScroller"), "message-scroller");
});

test("transform renames copied elements but never module paths or theme tokens", () => {
  const source = [
    "import './ui-button';",
    "import { x } from '../components/ui-button';",
    "customElements.define('ui-button', X);",
    "const css = ':host { --ui-button-gap: 1px; --ui-btn-radius: 2px } ::slotted(ui-button) {}';",
    "el.localName === 'ui-button-group';",
    "document.createElement('ui-icon');",
  ].join("\n");
  const out = transform("ui-core/src/components/ui-x.ts", source, { dir: "/d", destination: "/d/core/components/ui-x.ts", tags: ["ui-button", "ui-button-group"], prefix: "app", index });
  assert.match(out, /import '\.\/ui-button';/);
  assert.match(out, /from '\.\.\/components\/ui-button'/);
  assert.match(out, /define\('app-button'/);
  assert.match(out, /--ui-button-gap/);
  assert.match(out, /::slotted\(app-button\)/);
  assert.match(out, /'app-button-group'/);
  assert.match(out, /'ui-icon'/, "an element that is not copied keeps its name");
});

test("transform points @editora/ui-core entries at the copied files", () => {
  const out = transform("ui-react/src/components/Button.tsx", "import '@editora/ui-core/button';", {
    dir: "/p/src/c", destination: "/p/src/c/react/components/Button.tsx", tags: [], prefix: "app", index,
  });
  assert.equal(out, "import '../../core/standalone/button';");
});

test("--copy writes the files, renames elements, records editora.json and prints the install", async () => {
  const dir = project();
  const result = await runIn(dir, ["add", "button", "--copy", "--source", repo]);
  assert.equal(result.code, 0, result.errors);
  const button = fs.readFileSync(path.join(dir, "src/components/editora/react/components/Button.tsx"), "utf8");
  assert.match(button, /'app-button'/);
  assert.match(button, /import '\.\.\/\.\.\/core\/standalone\/button';/);
  assert.ok(fs.existsSync(path.join(dir, "src/components/editora/core/components/ui-button.ts")));
  const config = JSON.parse(fs.readFileSync(path.join(dir, "editora.json"), "utf8"));
  assert.equal(config.copy.prefix, "app");
  assert.deepEqual(config.copy.components, ["Button"]);
  assert.ok(Object.keys(config.copy.files).length > 3);
  assert.deepEqual(result.spawned, ["npm install @editora/icons@" + index.dependencyRanges["@editora/icons"]]);
});

test("--elements copies the custom element only, and projects without React get elements", async () => {
  const dir = project({});
  const result = await runIn(dir, ["add", "spinner", "--copy", "--no-install", "--source", repo]);
  assert.equal(result.code, 0, result.errors);
  assert.ok(fs.existsSync(path.join(dir, "src/components/editora/core/components/ui-spinner.ts")));
  assert.ok(!fs.existsSync(path.join(dir, "src/components/editora/react")));
  assert.match(result.logs, /<app-spinner><\/app-spinner>/);
});

test("a second copy updates untouched files and keeps the ones you changed", async () => {
  const dir = project();
  await runIn(dir, ["add", "spinner", "--copy", "--no-install", "--source", repo]);
  const file = path.join(dir, "src/components/editora/core/components/ui-spinner.ts");
  fs.writeFileSync(file, `${fs.readFileSync(file, "utf8")}\n// my change\n`);
  const again = await runIn(dir, ["add", "spinner", "--copy", "--no-install", "--source", repo]);
  assert.equal(again.code, 0);
  assert.match(again.logs, /you changed it: kept/);
  assert.match(fs.readFileSync(file, "utf8"), /my change/);
  const forced = await runIn(dir, ["add", "spinner", "--copy", "--no-install", "--overwrite", "--source", repo]);
  assert.equal(forced.code, 0);
  assert.doesNotMatch(fs.readFileSync(file, "utf8"), /my change/);
});

test("the prefix is remembered and cannot be mixed", async () => {
  const dir = project();
  await runIn(dir, ["add", "spinner", "--copy", "--no-install", "--prefix", "acme", "--source", repo]);
  const second = await runIn(dir, ["add", "heading", "--copy", "--no-install", "--source", repo]);
  assert.equal(second.code, 0);
  assert.match(fs.readFileSync(path.join(dir, "src/components/editora/react/components/Heading.tsx"), "utf8") + fs.readFileSync(path.join(dir, "src/components/editora/react/components/server/Heading.tsx"), "utf8"), /acme-heading/);
  const mixed = await runIn(dir, ["add", "text", "--copy", "--no-install", "--prefix", "other", "--source", repo]);
  assert.equal(mixed.code, 1);
  assert.match(mixed.errors, /mixing "other"/);
});

test("--dry-run writes nothing", async () => {
  const dir = project();
  const result = await runIn(dir, ["add", "questionnaire", "--copy", "--dry-run", "--source", repo]);
  assert.equal(result.code, 0);
  assert.match(result.logs, /Would copy Questionnaire/);
  assert.ok(!fs.existsSync(path.join(dir, "src/components/editora")));
  assert.ok(!fs.existsSync(path.join(dir, "editora.json")));
});

test("downloads are checked against the index, and a mismatch writes nothing", async () => {
  const dir = project();
  const indexFile = path.join(dir, "copy-index.json");
  fs.writeFileSync(indexFile, JSON.stringify(index));
  const urls = [];
  const good = await runIn(dir, ["add", "spinner", "--copy", "--no-install", "--elements"], {
    copyIndexFile: indexFile,
    fetch: async (url) => {
      urls.push(url);
      const rel = url.split("/abc123/packages/")[1];
      return fs.readFileSync(path.join(packagesDir, rel), "utf8");
    },
  });
  assert.equal(good.code, 0, good.errors);
  assert.ok(urls.every((url) => url.startsWith("https://raw.githubusercontent.com/ajaykr089/Editora/abc123/packages/")));

  const other = project();
  const bad = await runIn(other, ["add", "spinner", "--copy", "--no-install", "--elements"], {
    copyIndexFile: indexFile,
    fetch: async () => "tampered",
  });
  assert.equal(bad.code, 1);
  assert.match(bad.errors, /does not match the hash/);
  assert.ok(!fs.existsSync(path.join(other, "src/components/editora")));
});

test("unknown names and stray copy options are reported", async () => {
  const dir = project();
  const unknown = await runIn(dir, ["add", "buton", "--copy", "--source", repo]);
  assert.equal(unknown.code, 1);
  assert.match(unknown.errors, /Unknown name: buton/);
  const stray = await runIn(dir, ["add", "button", "--prefix", "x"]);
  assert.equal(stray.code, 1);
  assert.match(stray.errors, /only work with --copy/);
  assert.equal(sha256("a").length, 64);
});

test("blocks are listed, copied without --copy, and install @editora/ui-react at its latest", async () => {
  assert.ok(index.blocks["block-login"], "the index lists blocks");
  assert.match(index.blocks["block-chat"].description, /chat/i);
  const dir = project();
  const result = await runIn(dir, ["add", "block-login", "--source", repo]);
  assert.equal(result.code, 0, result.errors);
  assert.ok(fs.existsSync(path.join(dir, "src/components/editora/blocks/block-login.tsx")));
  assert.match(result.logs, /import \{ LoginBlock \} from '\.\/src\/components\/editora\/blocks\/block-login';/);
  assert.deepEqual(result.spawned, ["npm install @editora/ui-react"]);
  const mixed = await runIn(dir, ["add", "block-login", "button", "--source", repo]);
  assert.equal(mixed.code, 1);
  assert.match(mixed.errors, /separate command/);
});

test("--js writes JavaScript with the project's TypeScript, and is remembered", async () => {
  const dir = project();
  fs.symlinkSync(path.join(repo, "node_modules"), path.join(dir, "node_modules"));
  const result = await runIn(dir, ["add", "spinner", "--copy", "--js", "--no-install", "--source", repo]);
  assert.equal(result.code, 0, result.errors);
  const js = fs.readFileSync(path.join(dir, "src/components/editora/core/components/ui-spinner.js"), "utf8");
  assert.doesNotMatch(js, /: string|private |protected /);
  assert.match(js, /customElements\.define\('app-spinner'/);
  assert.ok(fs.existsSync(path.join(dir, "src/components/editora/react/components/Spinner.jsx")));
  const config = JSON.parse(fs.readFileSync(path.join(dir, "editora.json"), "utf8"));
  assert.equal(config.copy.js, true);
  assert.equal(config.copy.versions, undefined, "no misleading version numbers");
  const again = await runIn(dir, ["add", "heading", "--copy", "--no-install", "--source", repo]);
  assert.equal(again.code, 0);
  assert.ok(fs.existsSync(path.join(dir, "src/components/editora/core/components/ui-heading.js")));
});

test("--js without TypeScript in the project says how to fix it", async () => {
  const dir = project();
  const result = await runIn(dir, ["add", "spinner", "--copy", "--js", "--source", repo]);
  assert.equal(result.code, 1);
  assert.match(result.errors, /install it first/);
});

test("--registry copies from another index and checks its hashes", async () => {
  const registryDir = fs.mkdtempSync(path.join(os.tmpdir(), "editora-registry-"));
  const source = "export const hello = (name: string) => `hi ${name}`;\n";
  fs.mkdirSync(path.join(registryDir, "ui-react", "blocks"), { recursive: true });
  fs.writeFileSync(path.join(registryDir, "ui-react", "blocks", "block-hello.tsx"), source);
  const registryIndex = {
    schema: 1,
    files: { "ui-react/blocks/block-hello.tsx": { sha256: sha256(source), size: source.length, imports: [], packages: [] } },
    blocks: { "block-hello": { file: "ui-react/blocks/block-hello.tsx", description: "Says hi" } },
  };
  fs.writeFileSync(path.join(registryDir, "index.json"), JSON.stringify(registryIndex));
  const dir = project();
  const result = await runIn(dir, ["add", "block-hello", "--registry", path.join(registryDir, "index.json"), "--no-install"]);
  assert.equal(result.code, 0, result.errors);
  assert.match(result.logs, /copying code from .*index\.json, not from Editora/);
  assert.ok(fs.existsSync(path.join(dir, "src/components/editora/blocks/block-hello.tsx")));

  const urls = [];
  const remote = project();
  const viaUrl = await runIn(remote, ["add", "block-hello", "--registry", "https://example.com/r/index.json", "--no-install"], {
    fetch: async (url) => {
      urls.push(url);
      if (url.endsWith("index.json")) return JSON.stringify(registryIndex);
      return "tampered";
    },
  });
  assert.equal(viaUrl.code, 1);
  assert.match(viaUrl.errors, /does not match the hash/);
  assert.deepEqual(urls, ["https://example.com/r/index.json", "https://example.com/r/ui-react/blocks/block-hello.tsx"]);
});
