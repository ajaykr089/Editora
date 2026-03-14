#!/usr/bin/env node

/* eslint-disable no-console */
const { spawnSync } = require("child_process");

const helpText = `
Editora CLI

Usage:
  editora add <feature> [feature...] [--dry-run]

Examples:
  npx @editora/cli add button
  npx @editora/cli add modal
  npx @editora/cli add datatable
  npx @editora/cli add editor
  npx @editora/cli add toast
  npx @editora/cli add accordion avatar select
  npx @editora/cli add ui-accordion ui-select
  npx @editora/cli add button modal toast
`;

const uiReactComponents = [
  "accordion",
  "alert",
  "alert-dialog",
  "alert-dialog-provider",
  "app-header",
  "aspect-ratio",
  "avatar",
  "badge",
  "block-controls",
  "box",
  "breadcrumb",
  "button",
  "calendar",
  "chart",
  "checkbox",
  "collapsible",
  "color-picker",
  "combobox",
  "command-palette",
  "container",
  "context-menu",
  "data-table",
  "date-picker",
  "date-range-picker",
  "date-range-time-picker",
  "date-time-picker",
  "dialog",
  "dialog-provider",
  "direction-provider",
  "drawer",
  "dropdown",
  "empty-state",
  "field",
  "flex",
  "floating-toolbar",
  "form",
  "gantt",
  "grid",
  "hover-card",
  "icon",
  "input",
  "label",
  "layout",
  "menu",
  "menubar",
  "navigation-menu",
  "pagination",
  "plugin-panel",
  "popover",
  "portal",
  "presence",
  "progress",
  "quick-actions",
  "radio-group",
  "scroll-area",
  "section",
  "select",
  "selection-popup",
  "separator",
  "sidebar",
  "skeleton",
  "slider",
  "slot",
  "stepper",
  "switch",
  "table",
  "tabs",
  "textarea",
  "theme-provider",
  "time-picker",
  "timeline",
  "toast",
  "toast-api",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip",
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

const uiReactLookup = new Map();
for (const name of uiReactComponents) {
  uiReactLookup.set(normalizeTarget(name), name);
}

const specialLookup = new Map();
for (const name of Object.keys(specialRegistry)) {
  specialLookup.set(normalizeTarget(name), name);
}

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

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    console.log(helpText.trim());
    process.exit(0);
  }

  const command = args[0];
  const dryRun = args.includes("--dry-run");
  const filteredArgs = args.filter((arg) => arg !== "--dry-run");

  if (command !== "add") {
    console.error(`Unknown command: ${command}`);
    console.log(helpText.trim());
    process.exit(1);
  }

  const targets = filteredArgs.slice(1);
  if (targets.length === 0) {
    console.error("Missing feature name(s).");
    console.log(helpText.trim());
    process.exit(1);
  }

  const resolvedTargets = targets.map((target) => ({
    input: target,
    resolved: resolveTarget(target)
  }));

  const unknown = resolvedTargets
    .filter((item) => !item.resolved)
    .map((item) => item.input);

  if (unknown.length > 0) {
    console.error(`Unknown feature(s): ${unknown.join(", ")}`);
    console.error("Supported:");
    console.error("- all exported @editora/ui-react component names");
    console.error(`- special: ${Object.keys(specialRegistry).sort().join(", ")}`);
    process.exit(1);
  }

  const packageSet = new Set();
  for (const item of resolvedTargets) {
    for (const pkg of item.resolved.entry.packages) packageSet.add(pkg);
  }
  const packages = Array.from(packageSet);

  const pm = detectPackageManager();
  const [cmd, cmdArgs] = installCommand(pm, packages);

  console.log(`\nEditora add targets: ${targets.join(", ")}`);
  for (const item of resolvedTargets) {
    console.log(`- ${item.resolved.canonicalName}: ${item.resolved.entry.note}`);
  }
  console.log(`\nInstalling with ${pm}: ${[cmd, ...cmdArgs].join(" ")}`);

  if (dryRun) {
    console.log("\nDry run enabled. No packages were installed.");
    process.exit(0);
  }

  const result = spawnSync(cmd, cmdArgs, { stdio: "inherit" });
  process.exit(result.status == null ? 1 : result.status);
}

main();
