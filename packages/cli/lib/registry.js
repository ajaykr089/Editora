/* What each name installs, and what to do with it afterwards.
 *
 * Each entry:
 *   packages  the packages to install
 *   note      one line for `editora list` and the install summary
 *   group     the heading it is listed under
 *   requires  packages the project must have already (React), checked against its package.json
 *   dev       install as a development dependency
 *   styles    CSS files to import once, in the app's entry file
 *   usage     a few lines of code that use it (checked against the package's README by the tests)
 *   docs      where to read more
 */

const npm = (name) => `https://www.npmjs.com/package/${name}`;
const REACT = ["react", "react-dom"];

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
  "editora-preload-style",
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
  "icon-cloud",
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
  "navigation-provider",
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

// The React export of a component name, where it is not the name in PascalCase.
const uiReactExportNames = {
  "otp-input": "OTPInput",
  "toast-api": "toastApi"
};

function uiReactExportName(name) {
  if (uiReactExportNames[name]) return uiReactExportNames[name];
  return name
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

const editorStyles = ["@editora/themes/themes/default.css", "@editora/plugins/styles.css"];

const specialRegistry = {
  // Editors
  editor: {
    group: "Editors",
    packages: ["@editora/react", "@editora/core", "@editora/plugins", "@editora/themes"],
    note: "Rich text editor for React",
    requires: REACT,
    styles: editorStyles,
    usage: [
      "import { EditoraEditor } from '@editora/react';",
      "import { BoldPlugin, HistoryPlugin, ItalicPlugin, ListPlugin } from '@editora/plugins/lite';",
      "",
      "const plugins = [BoldPlugin(), ItalicPlugin(), ListPlugin(), HistoryPlugin()];",
      "",
      "<EditoraEditor plugins={plugins} />"
    ],
    docs: npm("@editora/react")
  },
  "web-editor": {
    group: "Editors",
    packages: ["@editora/core"],
    note: "Rich text editor as a web component, for any framework or none",
    styles: ["@editora/core/webcomponent.css"],
    usage: [
      "import '@editora/core/webcomponent';",
      "",
      '<editora-editor plugins="bold italic list link history" toolbar="undo redo | bold italic | bullist | link"></editora-editor>'
    ],
    docs: npm("@editora/core")
  },
  "markdown-editor": {
    group: "Editors",
    packages: ["@editora/markdown-editor", "@editora/themes"],
    note: "Markdown editor with live preview, for React",
    requires: REACT,
    styles: ["@editora/themes/themes/default.css", "@editora/light-code-editor/light-code-editor.css"],
    usage: [
      "import { MarkdownEditor } from '@editora/markdown-editor';",
      "",
      "<MarkdownEditor defaultValue={'# Hello'} onChange={(markdown) => save(markdown)} />"
    ],
    docs: npm("@editora/markdown-editor")
  },
  "light-code-editor": {
    group: "Editors",
    packages: ["@editora/light-code-editor"],
    note: "Embeddable code editor with syntax highlighting",
    styles: ["@editora/light-code-editor/light-code-editor.css"],
    usage: [
      "import { createEditor, LineNumbersExtension, SyntaxHighlightingExtension } from '@editora/light-code-editor';",
      "",
      "createEditor(document.getElementById('editor'), {",
      "  value: 'const answer = 42;',",
      "  extensions: [new LineNumbersExtension(), new SyntaxHighlightingExtension()],",
      "});"
    ],
    docs: npm("@editora/light-code-editor")
  },
  "code-editor": { alias: "light-code-editor" },
  plugins: {
    group: "Editors",
    packages: ["@editora/plugins", "@editora/core"],
    note: "The editor plugins: tables, media, comments, track changes and more",
    styles: ["@editora/plugins/styles.css"],
    usage: ["import { TablePlugin } from '@editora/plugins/lite';"],
    docs: npm("@editora/plugins")
  },
  themes: {
    group: "Editors",
    packages: ["@editora/themes"],
    note: "Light, dark and custom themes for the editor",
    styles: ["@editora/themes/themes/default.css", "@editora/themes/themes/dark.css"],
    docs: npm("@editora/themes")
  },
  collaboration: {
    group: "Editors",
    packages: ["@editora/collaboration"],
    note: "Real-time collaborative editing (Yjs)",
    usage: ["import { CollaborationPlugin } from '@editora/collaboration';"],
    docs: npm("@editora/collaboration")
  },

  // UI
  "ui-react": {
    group: "UI",
    packages: ["@editora/ui-react"],
    note: "Every React component (buttons, forms, data table, dialogs...)",
    requires: REACT,
    usage: ["import { Button, Input, ThemeProvider } from '@editora/ui-react';"],
    docs: npm("@editora/ui-react")
  },
  "ui-components": { alias: "ui-react" },
  "ui-core": {
    group: "UI",
    packages: ["@editora/ui-core"],
    note: "The same components as web components (<ui-button>, <ui-input>...), for any framework",
    usage: ["import '@editora/ui-core';", "", '<ui-button variant="primary">Save</ui-button>'],
    docs: npm("@editora/ui-core")
  },
  "web-components": { alias: "ui-core" },
  "ui-sortable": {
    group: "UI",
    packages: ["@editora/ui-sortable"],
    note: "Drag-and-drop lists and boards on their own, without the rest of the UI library",
    usage: [
      "import { Sortable } from '@editora/ui-sortable/react';",
      "",
      "<Sortable lists={lists} items={items} onChange={(detail) => setItems(detail.items)} />"
    ],
    docs: npm("@editora/ui-sortable")
  },
  "ui-editor": {
    group: "UI",
    packages: ["@editora/ui-editor"],
    note: "Editor UI pieces: floating toolbar, command palette, context menus",
    docs: npm("@editora/ui-editor")
  },
  toast: {
    group: "UI",
    packages: ["@editora/toast"],
    note: "Toast notifications for any framework, nothing to mount",
    // No stylesheet: since 2.2 the main entry puts its own on the page with the first toast.
    usage: ["import { toast } from '@editora/toast';", "", "toast.success('Document saved');"],
    docs: npm("@editora/toast")
  },
  modal: {
    group: "UI",
    packages: ["@editora/ui-react"],
    note: "Dialog from @editora/ui-react",
    requires: REACT,
    usage: ["import { Dialog } from '@editora/ui-react';"],
    docs: npm("@editora/ui-react")
  },
  card: {
    group: "UI",
    packages: ["@editora/ui-react"],
    note: "Card from @editora/ui-react",
    requires: REACT,
    usage: ["import { Card } from '@editora/ui-react';"],
    docs: npm("@editora/ui-react")
  },
  icons: {
    group: "UI",
    packages: ["@editora/icons"],
    note: "SVG icons for any framework",
    usage: ["import { renderIconSvg } from '@editora/icons';", "", "button.innerHTML = renderIconSvg('settings');"],
    docs: npm("@editora/icons")
  },
  "react-icons": {
    group: "UI",
    packages: ["@editora/react-icons"],
    note: "The icons as React components",
    requires: ["react"],
    usage: ["import { SettingsIcon } from '@editora/react-icons';", "", "<SettingsIcon />"],
    docs: npm("@editora/react-icons")
  },

  // Content tools
  "ai-review": {
    group: "Content tools",
    packages: ["@editora/ai-review"],
    note: "AI rewrites shown as suggestions to accept or reject",
    usage: ["import { AIReviewPlugin } from '@editora/ai-review/editora';"],
    docs: npm("@editora/ai-review")
  },
  agent: {
    group: "Content tools",
    packages: ["@editora/agent", "@editora/ai-review"],
    note: "An AI agent that edits the document, with an MCP bridge",
    usage: ["import { AgentPlugin } from '@editora/agent/editora';"],
    docs: npm("@editora/agent")
  },
  authorship: {
    group: "Content tools",
    packages: ["@editora/authorship"],
    note: "Track which text was typed, pasted or written by AI",
    usage: ["import { AuthorshipPlugin } from '@editora/authorship/editora';"],
    docs: npm("@editora/authorship")
  },
  "paste-cleaner": {
    group: "Content tools",
    packages: ["@editora/paste-cleaner"],
    note: "Clean what people paste from Word, Google Docs and the web",
    usage: [
      "import { cleanPaste } from '@editora/paste-cleaner';",
      "",
      "const { html, source, warnings } = cleanPaste({ html: clipboardHtml, text: clipboardText });"
    ],
    docs: npm("@editora/paste-cleaner")
  },
  "content-a11y": {
    group: "Content tools",
    packages: ["@editora/content-a11y"],
    note: "Accessibility checks and fixes for the content people write",
    usage: [
      "import { checkContent, fixContent } from '@editora/content-a11y';",
      "",
      "const { issues, errors } = checkContent(html, { minHeadingLevel: 2 });"
    ],
    docs: npm("@editora/content-a11y")
  },
  "rich-text-convert": {
    group: "Content tools",
    packages: ["@editora/rich-text-convert"],
    note: "Convert between Tiptap, Lexical, Slate, Portable Text, Editor.js and HTML",
    usage: [
      "import { convert } from '@editora/rich-text-convert';",
      "",
      "const { output, warnings } = convert(tiptapJson, { to: 'lexical' });"
    ],
    docs: npm("@editora/rich-text-convert")
  },
  "email-html": {
    group: "Content tools",
    packages: ["@editora/email-html"],
    note: "Turn editor HTML into email-safe HTML",
    usage: [
      "import { toEmailHtml } from '@editora/email-html';",
      "",
      "const { html, text, warnings } = toEmailHtml(editorHtml, { title: 'Weekly update' });"
    ],
    docs: npm("@editora/email-html")
  },
  docx: {
    group: "Content tools",
    packages: ["@editora/docx", "@editora/rich-text-convert"],
    note: "Read and write Word .docx files",
    usage: [
      "import { readDocx, writeDocx } from '@editora/docx';",
      "",
      "const { doc, warnings } = await readDocx(await file.arrayBuffer());"
    ],
    docs: npm("@editora/docx")
  },

  // Testing
  "ui-testing": {
    group: "Testing",
    packages: ["@editora/ui-testing"],
    note: "Test helpers for apps built on Editora UI (jsdom setup, user actions)",
    dev: true,
    usage: ["import { setupEditoraTests } from '@editora/ui-testing';", "", "await setupEditoraTests();"],
    docs: npm("@editora/ui-testing")
  },

  all: {
    group: "Bundles",
    packages: [
      "@editora/ui-react",
      "@editora/toast",
      "@editora/react",
      "@editora/core",
      "@editora/plugins",
      "@editora/themes",
      "@editora/react-icons",
      "@editora/light-code-editor"
    ],
    note: "UI components, toasts, the rich text editor, icons and the code editor, for React",
    requires: REACT,
    // toast.css stays: the toast API in @editora/ui-react uses @editora/toast/lite, which has no built-in styles.
    styles: [...editorStyles, "@editora/toast/toast.css", "@editora/light-code-editor/light-code-editor.css"],
    docs: "https://editora-ecosystem.netlify.app/"
  }
};

const groupOrder = ["Editors", "UI", "Content tools", "Testing", "Bundles"];

module.exports = {
  uiReactComponents,
  uiReactExportName,
  specialRegistry,
  groupOrder,
  REACT
};
