#!/usr/bin/env node

/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const generatedAt = process.env.COMPONENT_REGISTRY_GENERATED_AT || "1970-01-01T00:00:00.000Z";

const website = "https://editora-ecosystem.netlify.app/";
const storybook = "https://editora-ecosystem-storybook.netlify.app/";

function list(dir, predicate) {
  return fs
    .readdirSync(dir)
    .filter(predicate)
    .sort((a, b) => a.localeCompare(b));
}

function kebabFromPascal(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function buildPayload() {
  const uiCoreDir = path.join(root, "packages/ui-core/src/components");
  const uiReactDir = path.join(root, "packages/ui-react/src/components");

  const coreFiles = list(uiCoreDir, (file) => /^ui-[a-z0-9-]+\.ts$/.test(file));
  const reactFiles = list(uiReactDir, (file) => /^[A-Z][A-Za-z0-9]*\.tsx$/.test(file));

  const components = [];

  for (const file of coreFiles) {
    const tagName = file.replace(/\.ts$/, "");
    const name = tagName.replace(/^ui-/, "");
    components.push({
      id: `ui-core:${tagName}`,
      package: "@editora/ui-core",
      framework: "web-component",
      name,
      tagName,
      source: `packages/ui-core/src/components/${file}`,
      docsPath: "/docs/ui-core",
      storybookPath: `/story/${tagName}--playground`,
      styleApi: {
        cssVars: true,
        parts: true,
        states: ["disabled", "invalid", "open", "active"],
      },
    });
  }

  const specialReact = new Set(["ThemeProvider", "DialogProvider", "AlertDialogProvider", "ToastAPI"]);
  for (const file of reactFiles) {
    const componentName = file.replace(/\.tsx$/, "");
    const kebab = kebabFromPascal(componentName);
    const guessTag = `ui-${kebab}`;
    const isSpecial = specialReact.has(componentName);
    components.push({
      id: `ui-react:${componentName}`,
      package: "@editora/ui-react",
      framework: "react",
      name: componentName,
      reactExport: componentName,
      source: `packages/ui-react/src/components/${file}`,
      docsPath: "/docs/ui-react",
      storybookPath: `/story/ui-${kebab}--playground`,
      ...(isSpecial ? { wrapperFor: null, notes: "Provider/API utility component" } : { wrapperFor: guessTag }),
    });
  }

  return {
    $schema: "./components.schema.json",
    meta: {
      schemaVersion: "1.0.0",
      generatedAt,
      project: "Editora",
      website,
      storybook,
      docs: `${website}docs/intro`,
      status: "initial",
      notes: [
        "This registry is intended for AI assistants and developer tooling.",
        "Storybook paths are normalized guesses for quick lookup; verify exact story IDs when needed.",
        "Use package exports as the source of truth for runtime integration.",
      ],
    },
    packageDocs: {
      "@editora/core": `${website}docs/editor/core`,
      "@editora/react": `${website}docs/editor/react`,
      "@editora/plugins": `${website}docs/editor/plugins`,
      "@editora/themes": `${website}docs/editor/themes`,
      "@editora/ui-core": `${website}docs/ui-core`,
      "@editora/ui-react": `${website}docs/ui-react`,
      "@editora/icons": `${website}docs/icons`,
      "@editora/react-icons": `${website}docs/react-icons`,
      "@editora/toast": `${website}docs/toast`,
    },
    aiDefaults: {
      requiredImports: ["@editora/ui-react", "@editora/react-icons", "@editora/toast"],
      componentPriority: ["ui-core for framework-agnostic primitives", "ui-react only as wrappers"],
      codeStyle: ["use real package imports", "avoid placeholder components", "prefer runnable snippets"],
    },
    components,
  };
}

function buildSchema() {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Editora Component Registry",
    type: "object",
    required: ["$schema", "meta", "packageDocs", "aiDefaults", "components"],
    properties: {
      $schema: { type: "string" },
      meta: {
        type: "object",
        required: ["schemaVersion", "generatedAt", "project", "website", "storybook", "docs"],
        properties: {
          schemaVersion: { type: "string" },
          generatedAt: { type: "string" },
          project: { type: "string" },
          website: { type: "string" },
          storybook: { type: "string" },
          docs: { type: "string" },
          status: { type: "string" },
          notes: { type: "array", items: { type: "string" } },
        },
        additionalProperties: true,
      },
      packageDocs: {
        type: "object",
        additionalProperties: { type: "string" },
      },
      aiDefaults: {
        type: "object",
        properties: {
          requiredImports: { type: "array", items: { type: "string" } },
          componentPriority: { type: "array", items: { type: "string" } },
          codeStyle: { type: "array", items: { type: "string" } },
        },
        additionalProperties: true,
      },
      components: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "package", "framework", "name", "source", "docsPath"],
          properties: {
            id: { type: "string" },
            package: { type: "string" },
            framework: { enum: ["web-component", "react"] },
            name: { type: "string" },
            tagName: { type: "string" },
            reactExport: { type: "string" },
            wrapperFor: { type: ["string", "null"] },
            source: { type: "string" },
            docsPath: { type: "string" },
            storybookPath: { type: "string" },
            notes: { type: "string" },
            styleApi: { type: "object" },
          },
          additionalProperties: true,
        },
      },
    },
    additionalProperties: false,
  };
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const payload = buildPayload();
  const schema = buildSchema();

  const docsStaticDir = path.join(root, "examples/editora-docs/static");
  ensureDir(docsStaticDir);

  const targets = [
    { file: path.join(root, "components.json"), data: payload },
    { file: path.join(root, "components.schema.json"), data: schema },
    { file: path.join(docsStaticDir, "components.json"), data: payload },
    { file: path.join(docsStaticDir, "components.schema.json"), data: schema },
  ];

  for (const target of targets) {
    writeJson(target.file, target.data);
  }

  console.log(`Generated component registry with ${payload.components.length} entries.`);
}

main();
