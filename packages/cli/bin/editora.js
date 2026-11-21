#!/usr/bin/env node

/* eslint-disable no-console */
const { spawnSync } = require("child_process");
const path = require("path");
const packageJson = require("../package.json");
const { uiReactComponents, uiReactExportName, specialRegistry, groupOrder } = require("../lib/registry");
const {
  SUPPORTED_PACKAGE_MANAGERS,
  findProject,
  findPackageManager,
  detectPackageManager,
  detectFramework
} = require("../lib/project");

const helpText = `
Editora CLI

Usage:
  editora add <name> [name...]   Install what a name needs, then show how to use it
  editora init [name...]         Detect the project, pick what to set up, and install it
  editora list [search]          Show every name you can add

Examples:
  npx @editora/cli add editor
  npx @editora/cli add button data-table toast
  npx @editora/cli add @editora/ui-sortable
  npx @editora/cli init
  npx @editora/cli list date

Options:
  --dry-run              Show what would be installed, and install nothing
  --package-manager <pm> Use npm, pnpm, yarn or bun (by default, the one your lock file belongs to)
  --json                 With list: print the names as JSON
  -h, --help             Show this help text
  --version              Print the CLI version
`;

// ---------------------------------------------------------------------------------------------------------------------
// Names

// Aliases (code-editor, web-components...) become full entries, so specialRegistry can be read like a plain table.
for (const [name, entry] of Object.entries(specialRegistry)) {
  if (entry.alias) specialRegistry[name] = { ...specialRegistry[entry.alias], aliasOf: entry.alias };
}

function normalizeTarget(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^ui[-_]/, "")
    .replace(/[^a-z0-9]/g, "");
}

const uiReactLookup = new Map(uiReactComponents.map((name) => [normalizeTarget(name), name]));

// Names written loosely (DataTable, light_code_editor) find their entry. The ui-* names that are packages of their
// own (ui-core, ui-sortable...) only match as written: loosely, `ui-sortable` is the Sortable of @editora/ui-react.
const LOOSE_UI_NAMES = new Set(["ui-react", "ui-components"]);
const specialLookup = new Map();
for (const name of Object.keys(specialRegistry)) {
  if (/^ui-/.test(name) && !LOOSE_UI_NAMES.has(name)) continue;
  const key = normalizeTarget(name);
  if (!specialLookup.has(key)) specialLookup.set(key, name);
}

// "@editora/toast" -> toast: a package name finds the entry that installs it first.
const packageLookup = new Map();
for (const [name, entry] of Object.entries(specialRegistry)) {
  if (entry.aliasOf || name === "all") continue;
  if (!packageLookup.has(entry.packages[0])) packageLookup.set(entry.packages[0], name);
}

// A word on the components that also come as a package of their own.
const componentHints = {
  sortable: " (on its own, without the rest of the library: editora add ui-sortable)"
};

function uiComponentEntry(uiName) {
  return {
    canonicalName: uiName,
    entry: {
      packages: ["@editora/ui-react"],
      note: `${uiReactExportName(uiName)} from @editora/ui-react${componentHints[uiName] || ""}`,
      requires: ["react", "react-dom"],
      component: uiReactExportName(uiName),
      docs: "https://www.npmjs.com/package/@editora/ui-react"
    }
  };
}

function resolveTarget(rawTarget) {
  const raw = String(rawTarget).trim();
  const lower = raw.toLowerCase();

  if (lower.startsWith("@editora/")) {
    const name = packageLookup.get(lower);
    return name ? { canonicalName: name, entry: specialRegistry[name] } : null;
  }
  if (Object.prototype.hasOwnProperty.call(specialRegistry, lower)) {
    return { canonicalName: lower, entry: specialRegistry[lower] };
  }

  const normalized = normalizeTarget(raw);
  if (/^ui[-_]/i.test(raw) && uiReactLookup.has(normalized)) return uiComponentEntry(uiReactLookup.get(normalized));

  const specialName = specialLookup.get(normalized);
  if (specialName) return { canonicalName: specialName, entry: specialRegistry[specialName] };

  const uiName = uiReactLookup.get(normalized);
  if (uiName) return uiComponentEntry(uiName);

  return null;
}

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}

// Up to three names close to one that was not found ("datatabel" -> data-table).
function suggestTargets(rawTarget) {
  const wanted = normalizeTarget(rawTarget);
  if (!wanted) return [];
  const names = [...Object.keys(specialRegistry), ...uiReactComponents];
  const scored = names
    .map((name) => {
      const key = normalizeTarget(name);
      const score = key.includes(wanted) || wanted.includes(key) ? 0 : distance(wanted, key);
      return { name, score };
    })
    .filter((item) => item.score <= Math.max(1, Math.floor(wanted.length / 4)))
    .sort((a, b) => a.score - b.score || a.name.length - b.name.length);
  return [...new Set(scored.map((item) => item.name))].slice(0, 3);
}

// Every name, for `editora list`.
function listTargets(query) {
  const wanted = query ? String(query).toLowerCase() : "";
  // "Editora" is in every package name and many notes; it would make "editor" match them all.
  const searchable = (text) => String(text).toLowerCase().replace(/@editora\//g, "").replace(/\beditora\b/g, "");
  const matches = (...texts) => !wanted || texts.some((text) => searchable(text).includes(wanted));
  const items = [];
  for (const [name, entry] of Object.entries(specialRegistry)) {
    if (!matches(name, entry.note, entry.packages.join(" "))) continue;
    items.push({
      name,
      group: entry.group,
      description: entry.note,
      packages: entry.packages,
      dev: Boolean(entry.dev),
      requires: entry.requires || [],
      aliasOf: entry.aliasOf || null
    });
  }
  for (const name of uiReactComponents) {
    if (!matches(name, uiReactExportName(name)) && !(wanted && normalizeTarget(name).includes(normalizeTarget(wanted)))) continue;
    items.push({
      name,
      group: "UI components",
      description: `${uiReactExportName(name)} from @editora/ui-react`,
      packages: ["@editora/ui-react"],
      dev: false,
      requires: ["react", "react-dom"],
      aliasOf: null
    });
  }
  return items;
}

// ---------------------------------------------------------------------------------------------------------------------
// Arguments

function parseArgs(argv) {
  const parsed = {
    command: null,
    targets: [],
    dryRun: false,
    packageManager: undefined,
    json: false,
    help: false,
    version: false,
    unknownOptions: []
  };

  if (!argv || argv.length === 0) return parsed;

  if (argv[0] === "-h" || argv[0] === "--help") {
    parsed.help = true;
    return parsed;
  }
  if (argv[0] === "--version" || argv[0] === "-v") {
    parsed.version = true;
    return parsed;
  }

  parsed.command = argv[0];

  let index = 1;
  while (index < argv.length) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      parsed.dryRun = true;
      index += 1;
      continue;
    }
    if (arg === "--json") {
      parsed.json = true;
      index += 1;
      continue;
    }
    if (arg === "-h" || arg === "--help") {
      parsed.help = true;
      index += 1;
      continue;
    }
    if (arg === "--version") {
      parsed.version = true;
      index += 1;
      continue;
    }
    if (arg === "--package-manager" || arg.startsWith("--package-manager=")) {
      const value = arg.includes("=") ? arg.slice(arg.indexOf("=") + 1) : undefined;
      if (value) {
        parsed.packageManager = value;
        index += 1;
        continue;
      }
      const next = argv[index + 1];
      if (next && !next.startsWith("-")) {
        parsed.packageManager = next;
        index += 2;
        continue;
      }
      parsed.unknownOptions.push(arg);
      index += 1;
      continue;
    }
    if (arg.startsWith("-") && !arg.startsWith("@")) {
      parsed.unknownOptions.push(arg);
      index += 1;
      continue;
    }

    parsed.targets.push(arg);
    index += 1;
  }

  return parsed;
}

function formatHelpText() {
  return helpText.trim();
}

function getVersion() {
  return packageJson.version;
}

function installCommand(pm, packages, options = {}) {
  const dev = Boolean(options.dev);
  if (pm === "pnpm") return ["pnpm", ["add", ...(dev ? ["-D"] : []), ...packages]];
  if (pm === "yarn") return ["yarn", ["add", ...(dev ? ["--dev"] : []), ...packages]];
  if (pm === "bun") return ["bun", ["add", ...(dev ? ["--dev"] : []), ...packages]];
  return ["npm", ["install", ...(dev ? ["--save-dev"] : []), ...packages]];
}

// ---------------------------------------------------------------------------------------------------------------------
// Output

function createOutput(options) {
  const env = options.env || process.env;
  const stdoutIsTTY = options.isTTY !== undefined ? options.isTTY : Boolean(process.stdout.isTTY);
  const color =
    options.color !== undefined
      ? options.color
      : env.FORCE_COLOR !== undefined && env.FORCE_COLOR !== "0"
        ? true
        : stdoutIsTTY && env.NO_COLOR === undefined && env.TERM !== "dumb";
  const paint = (code) => (text) => (color ? `\u001b[${code}m${text}\u001b[0m` : String(text));
  return {
    log: options.log || ((text = "") => console.log(text)),
    error: options.error || ((text = "") => console.error(text)),
    bold: paint("1"),
    dim: paint("2"),
    green: paint("32"),
    yellow: paint("33"),
    red: paint("31"),
    cyan: paint("36")
  };
}

function pad(text, width) {
  return text + " ".repeat(Math.max(1, width - text.length));
}

function wrapWords(words, width, indent) {
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && line.length + word.length + 2 > width) {
      lines.push(indent + line);
      line = word;
    } else {
      line = line ? `${line}  ${word}` : word;
    }
  }
  if (line) lines.push(indent + line);
  return lines;
}

function unknownTargets(out, unknown) {
  for (const name of unknown) {
    const suggestions = suggestTargets(name);
    out.error(`${out.red("Unknown name:")} ${name}${suggestions.length ? `. Did you mean ${suggestions.join(", ")}?` : ""}`);
  }
  out.error("Run `editora list` to see every name you can add.");
}

function printList(out, args) {
  const query = args.targets.join(" ");
  const items = listTargets(query);
  if (args.json) {
    out.log(JSON.stringify(items, null, 2));
    return items.length > 0 ? 0 : 1;
  }
  if (items.length === 0) {
    out.error(`Nothing matches "${query}".`);
    return 1;
  }

  // Aliases are shown on the entry they stand for; JSON keeps them as entries of their own.
  const aliases = {};
  for (const item of items) if (item.aliasOf) (aliases[item.aliasOf] = aliases[item.aliasOf] || []).push(item.name);
  const shown = items.filter((item) => !item.aliasOf);
  const width = Math.max(...shown.filter((item) => item.group !== "UI components").map((item) => item.name.length), 0) + 3;
  const groups = [...groupOrder, "UI components"];
  let first = true;
  for (const group of groups) {
    const inGroup = shown.filter((item) => item.group === group);
    if (inGroup.length === 0) continue;
    if (!first) out.log("");
    first = false;
    if (group === "UI components") {
      out.log(out.bold("UI components") + out.dim("  from @editora/ui-react, add any of them by name"));
      // A component that shares its name with an entry above (toast) is added with its ui- name.
      const names = inGroup.map((item) => (Object.prototype.hasOwnProperty.call(specialRegistry, item.name) ? `ui-${item.name}` : item.name));
      for (const line of wrapWords(names, 100, "  ")) out.log(line);
      continue;
    }
    out.log(out.bold(group));
    for (const item of inGroup) {
      const extra = [item.dev ? "dev dependency" : "", aliases[item.name] ? `also ${aliases[item.name].join(", ")}` : ""].filter(Boolean);
      out.log(`  ${out.cyan(pad(item.name, width))}${item.description}${extra.length ? out.dim(` (${extra.join("; ")})`) : ""}`);
    }
  }
  if (!query) {
    out.log("");
    out.log(out.dim("A package name works too: editora add @editora/ui-sortable"));
  }
  return 0;
}

/* What to do after installing: the CSS to import once, then a few lines that use each name. */
function printNextSteps(out, resolved, framework) {
  const styles = [];
  const sections = [];
  const components = [];

  for (const item of resolved) {
    const { entry } = item.resolved;
    for (const style of entry.styles || []) if (!styles.includes(style)) styles.push(style);
    if (entry.component) {
      // The components share one block, where the first of them was named.
      if (components.length === 0) sections.push({ components });
      components.push({ name: item.resolved.canonicalName, component: entry.component });
      continue;
    }
    if (sections.some((section) => section.entry === entry)) continue;
    sections.push({ name: item.resolved.canonicalName, entry });
  }

  if (styles.length === 0 && sections.length === 0 && components.length === 0) return;

  out.log("");
  out.log(out.bold("Next steps"));

  if (styles.length > 0) {
    const where = framework && framework.entry ? framework.entry : "your app's entry file";
    out.log("");
    out.log(`Import the styles once, in ${out.cyan(where)}:`);
    out.log("");
    for (const style of styles) out.log(`  import '${style}';`);
  }

  for (const section of sections) {
    if (section.components) {
      const names = [...new Set(section.components.map((item) => item.component))];
      out.log("");
      out.log(`${out.cyan(section.components.map((item) => item.name).join(", "))}:`);
      out.log("");
      out.log(`  import { ${names.join(", ")} } from '@editora/ui-react';`);
      out.log("");
      out.log(out.dim("  Docs: https://www.npmjs.com/package/@editora/ui-react"));
      continue;
    }
    const { name, entry } = section;
    out.log("");
    out.log(`${out.cyan(name)}:`);
    if (entry.usage && entry.usage.length > 0) {
      out.log("");
      for (const line of entry.usage) out.log(line ? `  ${line}` : "");
    }
    if (entry.docs) {
      out.log("");
      out.log(out.dim(`  Docs: ${entry.docs}`));
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// Commands

function spawnInstall(cmd, cmdArgs, options) {
  if (options.spawn) return options.spawn(cmd, cmdArgs);
  // npm, pnpm and yarn are .cmd files on Windows, which only a shell can start. The arguments are package names from the
  // registry, never user input, so joining them into one command line is safe.
  return process.platform === "win32"
    ? spawnSync([cmd, ...cmdArgs].join(" "), { stdio: "inherit", shell: true, cwd: options.cwd })
    : spawnSync(cmd, cmdArgs, { stdio: "inherit", cwd: options.cwd });
}

function install(out, args, targets, options, context = {}) {
  const cwd = options.cwd || process.cwd();
  const resolved = targets.map((input) => ({ input, resolved: resolveTarget(input) }));
  const unknown = resolved.filter((item) => !item.resolved).map((item) => item.input);
  if (unknown.length > 0) {
    unknownTargets(out, unknown);
    return 1;
  }

  const project = context.project !== undefined ? context.project : findProject(cwd);
  const framework = context.framework || detectFramework(project);

  let pm;
  let reason;
  if (args.packageManager) {
    pm = args.packageManager;
    reason = "--package-manager";
  } else {
    ({ name: pm, reason } = findPackageManager({ cwd, env: options.env }));
  }
  if (!SUPPORTED_PACKAGE_MANAGERS.includes(pm)) {
    out.error(`Unsupported package manager: ${pm}`);
    return 1;
  }

  if (!project && !args.dryRun) {
    out.error(`No package.json in ${cwd} or any folder above it, so there is no project to add packages to.`);
    out.error("Run this in your project's folder, or create a project first (npm init -y, or npm create vite@latest).");
    return 1;
  }

  const normal = [];
  const dev = [];
  for (const item of resolved) {
    const list = item.resolved.entry.dev ? dev : normal;
    for (const pkg of item.resolved.entry.packages) if (!list.includes(pkg)) list.push(pkg);
  }
  const devOnly = dev.filter((pkg) => !normal.includes(pkg));

  const width = Math.max(...resolved.map((item) => item.resolved.canonicalName.length)) + 3;
  out.log("");
  out.log(`${out.bold(context.title || "Adding")} ${resolved.map((item) => item.resolved.canonicalName).join(", ")}`);
  out.log("");
  for (const item of resolved) {
    out.log(`  ${out.cyan(pad(item.resolved.canonicalName, width))}${item.resolved.entry.note}`);
  }

  // React and the like: what the packages need that the project does not have.
  if (project) {
    const missing = [];
    for (const item of resolved) {
      for (const name of item.resolved.entry.requires || []) {
        if (!project.dependencies[name] && !missing.includes(name)) missing.push(name);
      }
    }
    if (missing.length > 0) {
      const [cmd, cmdArgs] = installCommand(pm, missing);
      out.log("");
      out.log(`${out.yellow("Note:")} this needs ${missing.join(" and ")}, which ${path.relative(cwd, project.file) || "package.json"} does not list. Add ${missing.length > 1 ? "them" : "it"} with:`);
      out.log(`  ${[cmd, ...cmdArgs].join(" ")}`);
    }
  } else {
    out.log("");
    out.log(`${out.yellow("Note:")} no package.json in ${cwd} or above it.`);
  }

  const commands = [];
  if (normal.length > 0) commands.push(installCommand(pm, normal));
  if (devOnly.length > 0) commands.push(installCommand(pm, devOnly, { dev: true }));

  out.log("");
  out.log(`Installing with ${out.bold(pm)} ${out.dim(`(${reason})`)}:`);
  for (const [cmd, cmdArgs] of commands) out.log(`  ${[cmd, ...cmdArgs].join(" ")}`);

  if (args.dryRun) {
    out.log("");
    out.log(out.yellow("Dry run: nothing was installed."));
  } else {
    for (const [cmd, cmdArgs] of commands) {
      out.log("");
      const result = spawnInstall(cmd, cmdArgs, { ...options, cwd: project ? project.dir : cwd });
      if (result.error) {
        out.error(`Could not run ${cmd}: ${result.error.message}`);
        out.error(`Install ${cmd}, or pick another with --package-manager <npm|pnpm|yarn|bun>.`);
        return 1;
      }
      const status = result.status == null ? 1 : result.status;
      if (status !== 0) {
        out.error(`${out.red("The install failed")} (${cmd} exited with status ${status}).`);
        return status;
      }
    }
    out.log(out.green("Installed."));
  }

  printNextSteps(out, resolved, framework);
  return 0;
}

// The choices `editora init` offers, for a React project or any other.
const INIT_CHOICES = {
  react: [
    ["ui-react", "UI components"],
    ["editor", "Rich text editor"],
    ["markdown-editor", "Markdown editor"],
    ["toast", "Toast notifications"],
    ["react-icons", "Icons"],
    ["all", "Everything: UI, editor, toasts, icons, code editor"]
  ],
  other: [
    ["ui-core", "UI components, as web components"],
    ["web-editor", "Rich text editor, as a web component"],
    ["toast", "Toast notifications"],
    ["icons", "Icons"]
  ]
};

function initChoices(project) {
  return project && project.dependencies.react ? INIT_CHOICES.react : INIT_CHOICES.other;
}

// "1 3", "1,3", "editor toast" -> names; null when an answer is not a choice.
function parseInitAnswer(answer, choices) {
  const parts = String(answer || "")
    .split(/[\s,]+/)
    .filter(Boolean);
  if (parts.length === 0) return null;
  const names = [];
  for (const part of parts) {
    const number = Number(part);
    const name = Number.isInteger(number) ? (choices[number - 1] || [])[0] : resolveTarget(part) ? part : undefined;
    if (!name) return null;
    if (!names.includes(name)) names.push(name);
  }
  return names;
}

function defaultAsk(question) {
  const readline = require("readline");
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
    rl.on("SIGINT", () => {
      rl.close();
      resolve("");
    });
  });
}

function init(out, args, options) {
  const cwd = options.cwd || process.cwd();
  const project = findProject(cwd);
  if (!project) {
    out.error(`No package.json in ${cwd} or any folder above it.`);
    out.error("Create a project first (for example npm create vite@latest), then run editora init in its folder.");
    return 1;
  }
  const framework = detectFramework(project);
  const pm = args.packageManager
    ? { name: args.packageManager, reason: "--package-manager" }
    : findPackageManager({ cwd, env: options.env });

  out.log("");
  out.log(`${out.bold("Project")}          ${project.json.name || path.basename(project.dir)} ${out.dim(`(${path.relative(cwd, project.file) || "package.json"})`)}`);
  out.log(`${out.bold("Framework")}        ${framework.name || "none found"}${framework.entry ? out.dim(` (styles go in ${framework.entry})`) : ""}`);
  out.log(`${out.bold("Package manager")}  ${pm.name} ${out.dim(`(${pm.reason})`)}`);

  const context = { project, framework, title: "Setting up" };
  if (args.targets.length > 0) return install(out, args, args.targets, options, context);

  const choices = initChoices(project);
  const labelWidth = Math.max(...choices.map(([, label]) => label.length)) + 3;
  const menu = choices.map(([name, label], index) => `  ${index + 1}  ${pad(label, labelWidth)}${out.dim(name)}`);
  const interactive = options.interactive !== undefined ? options.interactive : Boolean(process.stdin.isTTY && process.stdout.isTTY);

  if (!interactive) {
    out.log("");
    out.log("What do you want to set up? Name it, for example:");
    out.log(`  editora init ${choices[0][0]} ${choices.find(([name]) => name === "toast")[0]}`);
    out.log("");
    out.log(menu.join("\n"));
    return 1;
  }

  out.log("");
  out.log(out.bold("What do you want to set up?"));
  out.log(menu.join("\n"));
  const ask = options.ask || defaultAsk;
  return Promise.resolve(ask(`Numbers or names, separated by spaces ${out.dim("(Enter to cancel)")}: `)).then((answer) => {
    if (!String(answer || "").trim()) {
      out.log("Nothing was installed.");
      return 1;
    }
    const names = parseInitAnswer(answer, choices);
    if (!names) {
      out.error(`Not a choice: ${answer}. Use the numbers 1 to ${choices.length}, or names from editora list.`);
      return 1;
    }
    return install(out, args, names, options, context);
  });
}

/* Runs a command line and returns its exit status. `editora init` with no names in a terminal asks what to set up, and
 * then returns a Promise of the status; everything else returns the status itself. */
function run(argv, options = {}) {
  const out = createOutput(options);
  const args = parseArgs(argv);

  if (args.help || !argv || argv.length === 0) {
    out.log(formatHelpText());
    return 0;
  }

  if (args.version) {
    out.log(getVersion());
    return 0;
  }

  if (args.unknownOptions.length > 0) {
    out.error(`Unknown option(s): ${args.unknownOptions.join(", ")}`);
    out.log(formatHelpText());
    return 1;
  }

  if (args.command === "list" || args.command === "ls") return printList(out, args);

  if (args.command === "init") return init(out, args, options);

  if (args.command !== "add") {
    out.error(`Unknown command: ${args.command || "<missing>"}`);
    out.log(formatHelpText());
    return 1;
  }

  if (args.targets.length === 0) {
    out.error("Missing name(s). For example: editora add editor, or editora list to see them all.");
    out.log(formatHelpText());
    return 1;
  }

  return install(out, args, args.targets, options);
}

if (require.main === module) {
  Promise.resolve(run(process.argv.slice(2))).then(
    (status) => process.exit(status),
    (error) => {
      console.error(error && error.stack ? error.stack : error);
      process.exit(1);
    }
  );
}

module.exports = {
  normalizeTarget,
  resolveTarget,
  suggestTargets,
  listTargets,
  detectPackageManager,
  findPackageManager,
  findProject,
  detectFramework,
  installCommand,
  parseArgs,
  parseInitAnswer,
  run,
  getVersion,
  formatHelpText,
  uiReactComponents,
  specialRegistry
};
