/* `editora mcp`: a Model Context Protocol server over stdio, so an AI coding tool (Claude Code, Cursor, VS Code,
 * Windsurf…) can find Editora components, read their API, see their source and copy them into the project.
 *
 * Add it to the tool's MCP settings as the command `npx -y @editora/cli mcp`. It speaks JSON-RPC 2.0, one message
 * per line on stdin/stdout (the MCP stdio transport), with no dependencies. Logs go to stderr.
 *
 * Tools: list_components, get_component_docs, get_component_source, copy_components, install_command.
 */
const path = require("path");
const { copyComponents, rootsFor, closure, loadIndex, toKebab, toPascal } = require("./copy");

const PROTOCOL_VERSION = "2025-06-18";

const TOOLS = [
  {
    name: "list_components",
    description: "List Editora UI components (React components, custom elements and copyable page blocks), optionally filtered by a search word.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Words to match in the name, e.g. \"date\", \"chat\", \"select\"." },
        kind: { type: "string", enum: ["react", "element", "block"], description: "Only this kind." },
      },
    },
  },
  {
    name: "get_component_docs",
    description: "The API reference of an Editora React component: its props with types and descriptions, and the attributes and events of the custom element it renders.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string", description: "Component name, e.g. \"Button\", \"message-scroller\", \"DataList\"." } },
      required: ["name"],
    },
  },
  {
    name: "get_component_source",
    description: "The source files a copy of the component would write (the component and everything it imports), to read before using or changing it.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Component, element (ui-*) or block (block-*) name." },
        react: { type: "boolean", description: "The React component (default) or only the custom element (false)." },
      },
      required: ["name"],
    },
  },
  {
    name: "copy_components",
    description: "Copy components or blocks into the project as editable source (like `npx @editora/cli add <names> --copy`). Writes files; does not install packages (returns the command).",
    inputSchema: {
      type: "object",
      properties: {
        names: { type: "array", items: { type: "string" }, description: "Component, element or block names." },
        dir: { type: "string", description: "Folder inside the project (default src/components/editora)." },
        prefix: { type: "string", description: "Custom element prefix (default app)." },
        js: { type: "boolean", description: "Write JavaScript instead of TypeScript." },
        react: { type: "boolean", description: "Copy React components (default when the project uses React)." },
        dryRun: { type: "boolean", description: "Only report what would be written." },
      },
      required: ["names"],
    },
  },
  {
    name: "install_command",
    description: "The command that installs the packages for the given names instead of copying them (e.g. `npm install @editora/ui-react`), for the project's package manager.",
    inputSchema: {
      type: "object",
      properties: { names: { type: "array", items: { type: "string" } } },
      required: ["names"],
    },
  },
];

function text(value) {
  return { content: [{ type: "text", text: value }] };
}

function failure(message) {
  return { content: [{ type: "text", text: message }], isError: true };
}

/**
 * @param {{ cwd?: string, source?: string, indexFile?: string, fetch?: (url: string) => Promise<string>,
 *           cli: { resolveTarget: Function, installCommand: Function, findProject: Function, findPackageManager: Function },
 *           version: string }} options
 */
function createMcpHandler(options) {
  const cwd = options.cwd || process.cwd();
  let indexPromise = null;
  const getIndex = () => {
    if (!indexPromise) indexPromise = loadIndex({ source: options.source, indexFile: options.indexFile, fetch: options.fetch });
    return indexPromise;
  };

  const readDoc = async (slug) => {
    const { index, packagesDir } = await getIndex();
    const rel = `examples/editora-docs/docs/ui-react/api/${slug}.md`;
    if (packagesDir) {
      const fs = require("fs");
      const file = path.join(packagesDir, "..", rel);
      return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
    }
    if (!index.commit) return null;
    try {
      return await (options.fetch || require("./copy").download)(`https://raw.githubusercontent.com/${index.repo}/${index.commit}/${rel}`);
    } catch {
      return null;
    }
  };

  const tools = {
    async list_components({ query = "", kind } = {}) {
      const { index } = await getIndex();
      const wanted = String(query).toLowerCase().replace(/[^a-z0-9]/g, "");
      const matches = (name) => !wanted || name.toLowerCase().replace(/[^a-z0-9]/g, "").includes(wanted);
      const lines = [];
      if (!kind || kind === "react") {
        const names = Object.keys(index.react).filter((name) => !/^(Headless)$/.test(name) && matches(name)).sort();
        if (names.length) lines.push(`React components (@editora/ui-react): ${names.join(", ")}`);
      }
      if (!kind || kind === "element") {
        const tags = Object.keys(index.elements).filter(matches).sort();
        if (tags.length) lines.push(`Custom elements (@editora/ui-core, any framework): ${tags.join(", ")}`);
      }
      if (!kind || kind === "block") {
        const blocks = Object.entries(index.blocks || {}).filter(([name, block]) => matches(name) || matches(block.description || ""));
        if (blocks.length) lines.push(`Blocks (page sections, copied):\n${blocks.map(([name, block]) => `- ${name}: ${block.description}`).join("\n")}`);
      }
      if (!lines.length) return text(`No component matches "${query}".`);
      lines.push("Read one with get_component_docs; install with install_command, or copy the source with copy_components.");
      return text(lines.join("\n\n"));
    },

    async get_component_docs({ name }) {
      if (!name) return failure("name is required.");
      if (/^block-/i.test(name)) {
        const { index } = await getIndex();
        const block = (index.blocks || {})[String(name).toLowerCase()];
        return block ? text(`${name}: ${block.description}\nCopy it with copy_components (names: ["${name}"]); read it with get_component_source.`) : failure(`No block named ${name}.`);
      }
      const doc = await readDoc(toKebab(toPascal(name)));
      if (!doc) return failure(`No API page for ${name}. Use list_components to find the right name.`);
      return text(doc.replace(/^---[\s\S]*?---\n/, "").replace(/\{\/\*[\s\S]*?\*\/\}\n?/g, "").trim());
    },

    async get_component_source({ name, react = true }) {
      if (!name) return failure("name is required.");
      const { index, packagesDir } = await getIndex();
      const found = rootsFor(index, name, { react });
      if (!found.roots.length) return failure(`No component named ${name}.`);
      const files = closure(index, found.roots);
      const { readSources } = require("./copy");
      const sources = await readSources(index, packagesDir, files, { fetch: options.fetch });
      const LIMIT = 180000;
      let total = 0;
      const parts = [`${found.label}: ${files.length} files (paths in the Editora repository, packages/…)`];
      for (const file of files) {
        const body = sources[file];
        if (total + body.length > LIMIT) {
          parts.push(`\n… ${files.length - parts.length + 1} more files not shown (output limit); copy_components writes them all.`);
          break;
        }
        total += body.length;
        parts.push(`\n===== ${file} =====\n${body}`);
      }
      return text(parts.join("\n"));
    },

    async copy_components({ names, dir, prefix, js, react, dryRun } = {}) {
      if (!Array.isArray(names) || !names.length) return failure("names must be a non-empty array.");
      const project = options.cli.findProject(cwd);
      if (!project) return failure(`No package.json in ${cwd} or above it.`);
      try {
        const report = await copyComponents(names, {
          projectDir: project.dir,
          react: react ?? Boolean(project.dependencies.react),
          dir,
          prefix,
          js,
          dryRun,
          source: options.source,
          indexFile: options.indexFile,
          fetch: options.fetch,
        });
        if (report.unknown) return failure(`Unknown names: ${report.unknown.join(", ")}. Use list_components.`);
        const { name: pm } = options.cli.findPackageManager({ cwd: project.dir });
        const [cmd, args] = options.cli.installCommand(pm, report.packages);
        return text([
          `${dryRun ? "Would copy" : "Copied"} ${report.labels.join(", ")} into ${report.dir} (custom elements prefixed ${report.prefix}-):`,
          ...report.files.map((file) => `${file.status.padEnd(9)} ${file.file}`),
          report.packages.length ? `\nThey need: ${[cmd, ...args].join(" ")}` : "",
        ].join("\n"));
      } catch (error) {
        return failure(`Could not copy: ${error.message}`);
      }
    },

    async install_command({ names } = {}) {
      if (!Array.isArray(names) || !names.length) return failure("names must be a non-empty array.");
      const packages = [];
      const unknown = [];
      for (const name of names) {
        const resolved = options.cli.resolveTarget(name);
        if (!resolved) unknown.push(name);
        else for (const pkg of resolved.entry.packages) if (!packages.includes(pkg)) packages.push(pkg);
      }
      if (unknown.length) return failure(`Unknown names: ${unknown.join(", ")}. Use list_components.`);
      const { name: pm } = options.cli.findPackageManager({ cwd });
      const [cmd, args] = options.cli.installCommand(pm, packages);
      return text([cmd, ...args].join(" "));
    },
  };

  /** Handles one JSON-RPC message; resolves to the response, or null for a notification. */
  return async function handle(message) {
    const { id, method, params } = message || {};
    const reply = (result) => (id === undefined ? null : { jsonrpc: "2.0", id, result });
    const error = (code, msg) => (id === undefined ? null : { jsonrpc: "2.0", id, error: { code, message: msg } });
    if (!method) return error(-32600, "Invalid request");
    if (method === "initialize") {
      return reply({
        protocolVersion: params && params.protocolVersion ? params.protocolVersion : PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: "editora", version: options.version },
        instructions: "Editora UI components for React and web components. Find components with list_components, read their props with get_component_docs, install with install_command or copy editable source with copy_components.",
      });
    }
    if (method === "ping") return reply({});
    if (method.startsWith("notifications/")) return null;
    if (method === "tools/list") return reply({ tools: TOOLS });
    if (method === "tools/call") {
      const tool = tools[params && params.name];
      if (!tool) return error(-32602, `Unknown tool: ${params && params.name}`);
      try {
        return reply(await tool(params.arguments || {}));
      } catch (err) {
        return reply(failure(err && err.message ? err.message : String(err)));
      }
    }
    return error(-32601, `Method not found: ${method}`);
  };
}

/** Runs the server on stdin/stdout until stdin closes. */
function runMcpServer(options) {
  const handle = createMcpHandler(options);
  const input = options.stdin || process.stdin;
  const output = options.stdout || process.stdout;
  let buffer = "";
  let chain = Promise.resolve();
  input.setEncoding?.("utf8");
  return new Promise((resolve) => {
    input.on("data", (chunk) => {
      buffer += chunk;
      let newline;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line) continue;
        chain = chain.then(async () => {
          let message;
          try {
            message = JSON.parse(line);
          } catch {
            output.write(`${JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } })}\n`);
            return;
          }
          const response = await handle(message);
          if (response) output.write(`${JSON.stringify(response)}\n`);
        });
      }
    });
    input.on("end", () => chain.then(() => resolve(0)));
  });
}

module.exports = { createMcpHandler, runMcpServer, TOOLS };
