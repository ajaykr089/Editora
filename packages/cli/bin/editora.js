#!/usr/bin/env node

/* eslint-disable no-console */
const { spawnSync } = require("child_process");
const packageJson = require("../package.json");

const helpText = `
Editora CLI

Usage:
  editora add <feature> [feature...] [--dry-run] [--package-manager <npm|pnpm|yarn|bun>]

Examples:
  npx @editora/cli add button
  npx @editora/cli add modal
  npx @editora/cli add datatable
  npx @editora/cli add editor
  npx @editora/cli add toast
  npx @editora/cli add accordion avatar select
  npx @editora/cli add ui-accordion ui-select
  npx @editora/cli add button modal toast

Options:
  --dry-run              Print the generated install command without executing it
  --package-manager <pm> Force a specific package manager (npm, pnpm, yarn, bun)
  -h, --help             Show this help text
  --version              Print CLI version
`;

const uiReactComponents = [
  "accordion",
  "alert",
  "alert-dialog",
  "alert-dialog-provider",
  "anchor",
  "animated-beam",
  "animated-list",
  "animated-number",
  "animated-text",
  "app-header",
  "aspect-ratio",
  "avatar",
  "badge",
  "block-controls",
  "box",
  "breadcrumb",
  "button",
  "calendar",
  "carousel",
  "chart",
  "checkbox",
  "code-block",
  "code-snippet",
  "collapsible",
  "collection",
  "color-picker",
  "combobox",
  "command",
  "command-palette",
  "composite",
  "container",
  "context-menu",
  "control-group",
  "copy-button",
  "data-table",
  "data-view-toolbar",
  "date-field",
  "date-picker",
  "date-range-picker",
  "date-range-time-picker",
  "date-time-picker",
  "description",
  "dialog",
  "dialog-provider",
  "direction-provider",
  "dismissable-layer",
  "dock",
  "drawer",
  "dropdown",
  "dropzone",
  "empty-state",
  "field",
  "file-upload",
  "filters-bar",
  "flex",
  "floating-arrow",
  "floating-delay-group",
  "floating-focus-manager",
  "floating-list",
  "floating-overlay",
  "floating-portal",
  "floating-toolbar",
  "floating-tree",
  "focus-scope",
  "form",
  "gantt",
  "grid",
  "hover-card",
  "icon",
  "inline-edit",
  "input",
  "kbd",
  "label",
  "layout",
  "listbox",
  "marquee",
  "masonry-grid",
  "menu",
  "menubar",
  "meter",
  "metric-card",
  "multi-select",
  "navigation-menu",
  "number-field",
  "number-ticker",
  "orbiter",
  "otp-input",
  "page-header",
  "page-toolbar",
  "pagination",
  "panel",
  "panel-group",
  "password-field",
  "pin-input",
  "placement-grid",
  "plugin-panel",
  "popover",
  "portal",
  "positioner",
  "presence",
  "progress",
  "quick-actions",
  "radio",
  "radio-group",
  "rating",
  "record-header",
  "roving-focus-group",
  "scroll-area",
  "section",
  "select",
  "selection-popup",
  "separator",
  "shortcut",
  "sidebar",
  "skeleton",
  "slider",
  "slot",
  "sortable",
  "spinning-text",
  "split-button",
  "splitter",
  "stat",
  "stepper",
  "switch",
  "table",
  "tabs",
  "tags-input",
  "textarea",
  "theme-provider",
  "time-field",
  "time-picker",
  "timeline",
  "toast",
  "toast-api",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip",
  "transfer-list",
  "tree",
  "visually-hidden",
  "wizard"
];

const specialRegistry = {
  modal: {
    packages: ["@editora/ui-react"],
    note: "Use Dialog from @editora/ui-react as modal primitive"
  },
  card: {
    packages: ["@editora/ui-react"],
    note: "Use Box/Card composition from @editora/ui-react"
  },
  "ui-react": {
    packages: ["@editora/ui-react"],
    note: "Install all React wrappers from @editora/ui-react"
  },
  "ui-components": {
    packages: ["@editora/ui-react"],
    note: "Alias for ui-react package install"
  },
  toast: {
    packages: ["@editora/toast"],
    note: "Notification runtime"
  },
  editor: {
    packages: ["@editora/react", "@editora/plugins", "@editora/themes"],
    note: "Rich text editor stack for React"
  },
  "react-icons": {
    packages: ["@editora/react-icons"],
    note: "React icon components"
  },
  "light-code-editor": {
    packages: ["@editora/light-code-editor"],
    note: "Embeddable code editor"
  },
  all: {
    packages: [
      "@editora/ui-react",
      "@editora/toast",
      "@editora/react",
      "@editora/plugins",
      "@editora/themes",
      "@editora/react-icons",
      "@editora/light-code-editor"
    ],
    note: "Complete React + UI + editor stack"
  }
};

function normalizeTarget(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^ui[-_]/, "")
    .replace(/[^a-z0-9]/g, "");
}

const uiReactLookup = new Map(uiReactComponents.map((name) => [normalizeTarget(name), name]));
const specialLookup = new Map(Object.keys(specialRegistry).map((name) => [normalizeTarget(name), name]));

function resolveTarget(rawTarget) {
  const isExplicitUiTarget = /^ui[-_]/i.test(rawTarget.trim());
  const normalized = normalizeTarget(rawTarget);

  if (isExplicitUiTarget) {
    const uiName = uiReactLookup.get(normalized);
    if (uiName) {
      return {
        canonicalName: uiName,
        entry: {
          packages: ["@editora/ui-react"],
          note: `UI component (${uiName}) from @editora/ui-react`
        }
      };
    }
  }

  const specialName = specialLookup.get(normalized);
  if (specialName) {
    return { canonicalName: specialName, entry: specialRegistry[specialName] };
  }

  const uiName = uiReactLookup.get(normalized);
  if (uiName) {
    return {
      canonicalName: uiName,
      entry: {
        packages: ["@editora/ui-react"],
        note: `UI component (${uiName}) from @editora/ui-react`
      }
    };
  }

  return null;
}

const SUPPORTED_PACKAGE_MANAGERS = new Set(["npm", "pnpm", "yarn", "bun"]);

function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
  if (userAgent.startsWith("bun")) return "bun";
  return "npm";
}

function installCommand(pm, packages) {
  if (pm === "pnpm") return ["pnpm", ["add", ...packages]];
  if (pm === "yarn") return ["yarn", ["add", ...packages]];
  if (pm === "bun") return ["bun", ["add", ...packages]];
  return ["npm", ["install", ...packages]];
}

function parseArgs(argv) {
  const parsed = {
    command: null,
    targets: [],
    dryRun: false,
    packageManager: undefined,
    help: false,
    version: false,
    unknownOptions: []
  };

  if (!argv || argv.length === 0) {
    return parsed;
  }

  if (argv[0] === "-h" || argv[0] === "--help") {
    parsed.help = true;
    return parsed;
  }

  if (argv[0] === "--version") {
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

    if (arg.startsWith("--package-manager")) {
      const [flag, value] = arg.split("=");
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

    if (arg.startsWith("--")) {
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

function run(argv) {
  const args = parseArgs(argv);

  if (args.help || !argv || argv.length === 0) {
    console.log(formatHelpText());
    return 0;
  }

  if (args.version) {
    console.log(getVersion());
    return 0;
  }

  if (args.unknownOptions.length > 0) {
    console.error(`Unknown option(s): ${args.unknownOptions.join(", ")}`);
    console.log(formatHelpText());
    return 1;
  }

  if (args.command !== "add") {
    console.error(`Unknown command: ${args.command || "<missing>"}`);
    console.log(formatHelpText());
    return 1;
  }

  if (args.targets.length === 0) {
    console.error("Missing feature name(s).");
    console.log(formatHelpText());
    return 1;
  }

  const resolvedTargets = args.targets.map((target) => ({
    input: target,
    resolved: resolveTarget(target)
  }));

  const unknown = resolvedTargets.filter((item) => !item.resolved).map((item) => item.input);
  if (unknown.length > 0) {
    console.error(`Unknown feature(s): ${unknown.join(", ")}`);
    console.error("Supported:");
    console.error("- all exported @editora/ui-react component names");
    console.error(`- special: ${Object.keys(specialRegistry).sort().join(", ")}`);
    return 1;
  }

  const packageSet = new Set();
  for (const item of resolvedTargets) {
    for (const pkg of item.resolved.entry.packages) packageSet.add(pkg);
  }
  const packages = Array.from(packageSet);

  const pm = args.packageManager || detectPackageManager();
  if (!SUPPORTED_PACKAGE_MANAGERS.has(pm)) {
    console.error(`Unsupported package manager: ${pm}`);
    return 1;
  }

  const [cmd, cmdArgs] = installCommand(pm, packages);

  console.log(`\nEditora add targets: ${args.targets.join(", ")}`);
  for (const item of resolvedTargets) {
    console.log(`- ${item.resolved.canonicalName}: ${item.resolved.entry.note}`);
  }
  console.log(`\nInstalling with ${pm}: ${[cmd, ...cmdArgs].join(" ")}`);

  if (args.dryRun) {
    console.log("\nDry run enabled. No packages were installed.");
    return 0;
  }

  // npm, pnpm and yarn are .cmd files on Windows, which only a shell can start. The arguments are package names from the
  // registry above, never user input, so joining them into one command line is safe.
  const result =
    process.platform === "win32"
      ? spawnSync([cmd, ...cmdArgs].join(" "), { stdio: "inherit", shell: true })
      : spawnSync(cmd, cmdArgs, { stdio: "inherit" });
  if (result.error) {
    console.error(`Could not run ${cmd}: ${result.error.message}`);
    console.error(`Install ${cmd}, or pick another with --package-manager <npm|pnpm|yarn|bun>.`);
    return 1;
  }
  return result.status == null ? 1 : result.status;
}

if (require.main === module) {
  process.exit(run(process.argv.slice(2)));
}

module.exports = {
  normalizeTarget,
  resolveTarget,
  detectPackageManager,
  installCommand,
  parseArgs,
  run,
  getVersion,
  formatHelpText,
  uiReactComponents,
  specialRegistry
};
