const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { PassThrough } = require("stream");
const cli = require("../bin/editora.js");
const { createMcpHandler } = require("../lib/mcp");

const repo = path.resolve(__dirname, "..", "..", "..");

function handler(cwd = repo) {
  return createMcpHandler({
    cwd,
    source: repo,
    version: "test",
    cli: { resolveTarget: cli.resolveTarget, installCommand: cli.installCommand, findProject: cli.findProject, findPackageManager: cli.findPackageManager },
  });
}

const call = (handle, name, args) => handle({ jsonrpc: "2.0", id: 9, method: "tools/call", params: { name, arguments: args } });

test("initializes, lists its tools and ignores notifications", async () => {
  const handle = handler();
  const init = await handle({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {} } });
  assert.equal(init.result.serverInfo.name, "editora");
  assert.deepEqual(init.result.capabilities, { tools: {} });
  assert.equal(await handle({ jsonrpc: "2.0", method: "notifications/initialized" }), null);
  const list = await handle({ jsonrpc: "2.0", id: 2, method: "tools/list" });
  assert.deepEqual(list.result.tools.map((tool) => tool.name), ["list_components", "get_component_docs", "get_component_source", "copy_components", "install_command"]);
  for (const tool of list.result.tools) assert.equal(tool.inputSchema.type, "object");
  assert.equal((await handle({ jsonrpc: "2.0", id: 3, method: "nope" })).error.code, -32601);
});

test("lists and searches components, elements and blocks", async () => {
  const handle = handler();
  const all = (await call(handle, "list_components", {})).result.content[0].text;
  assert.match(all, /React components .*Button/);
  assert.match(all, /Custom elements .*ui-button/);
  assert.match(all, /block-login/);
  const dates = (await call(handle, "list_components", { query: "date", kind: "react" })).result.content[0].text;
  assert.match(dates, /DatePicker/);
  assert.doesNotMatch(dates, /Custom elements/);
});

test("returns the API page without front matter", async () => {
  const docs = (await call(handler(), "get_component_docs", { name: "message-scroller" })).result.content[0].text;
  assert.match(docs, /^# MessageScroller API/);
  assert.match(docs, /\| `label` \|/);
  const missing = (await call(handler(), "get_component_docs", { name: "NoSuchThing" })).result;
  assert.equal(missing.isError, true);
});

test("returns the source files a copy would write", async () => {
  const source = (await call(handler(), "get_component_source", { name: "spinner" })).result.content[0].text;
  assert.match(source, /===== ui-core\/src\/components\/ui-spinner\.ts =====/);
  assert.match(source, /===== ui-react\/src\/components\/Spinner\.tsx =====/);
});

test("copies into the project and returns the install command", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "editora-mcp-"));
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name: "p", dependencies: { react: "^18.3.1" } }));
  fs.mkdirSync(path.join(dir, "src"));
  const result = (await call(handler(dir), "copy_components", { names: ["button"] })).result;
  assert.ok(!result.isError, result.content[0].text);
  assert.match(result.content[0].text, /Copied Button/);
  assert.match(result.content[0].text, /They need: npm install @editora\/icons/);
  assert.ok(fs.existsSync(path.join(dir, "src/components/editora/react/components/Button.tsx")));
  const install = (await call(handler(dir), "install_command", { names: ["data-table", "toast"] })).result.content[0].text;
  assert.equal(install, "npm install @editora/ui-react @editora/toast");
  const bad = (await call(handler(dir), "copy_components", { names: ["nope-nope"] })).result;
  assert.equal(bad.isError, true);
});

test("speaks newline-delimited JSON-RPC on stdio through `editora mcp`", async () => {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  const lines = [];
  stdout.on("data", (chunk) => lines.push(...String(chunk).split("\n").filter(Boolean)));
  const done = cli.run(["mcp", "--source", repo], { stdin, stdout, cwd: repo });
  stdin.write('{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}\n');
  stdin.write("not json\n");
  stdin.write('{"jsonrpc":"2.0","id":2,"method":"ping"}\n');
  stdin.end();
  assert.equal(await done, 0);
  const messages = lines.map((line) => JSON.parse(line));
  assert.equal(messages[0].id, 1);
  assert.equal(messages[1].error.code, -32700);
  assert.deepEqual(messages[2], { jsonrpc: "2.0", id: 2, result: {} });
});
