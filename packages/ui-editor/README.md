<h1 align="center">@editora/ui-editor</h1>

<p align="center">
  The editor-focused interface elements of Editora: a command palette, a floating toolbar, a context menu, a selection
  popup, block controls and a plugin panel. <strong>They are provided by <code>@editora/ui-core</code></strong>; this package
  re-exports older copies of their classes and registers no element.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/ui-editor"><img src="https://img.shields.io/npm/v/@editora/ui-editor.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/ui-editor"><img src="https://img.shields.io/npm/dm/@editora/ui-editor.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/ui-editor.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/ui-editor"><img src="https://img.shields.io/npm/types/@editora/ui-editor.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/">Website</a> ·
  <a href="https://editora-ecosystem-storybook.netlify.app/">Storybook</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-editor/docs/images/command-palette.png" alt="The ui-command-palette element open over a page: a search box reading Type a command and three commands under it, Insert table, Toggle bold and Clear formatting, the first one highlighted" width="700">
</p>

> **Use [`@editora/ui-core`](https://www.npmjs.com/package/@editora/ui-core).** The six elements below are defined and
> maintained there, and wrapped for React by [`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react).
> Installing `@editora/ui-editor` does not add them and does not change them: the page is the same with it and without it.

## The elements

| Element | What it is | React component |
| --- | --- | --- |
| `<ui-command-palette>` | A modal search box over a list of commands, driven by the keyboard. | `CommandPalette` |
| `<ui-floating-toolbar>` | A toolbar that opens next to an anchor element, and closes on Escape or an outside click. | `FloatingToolbar` |
| `<ui-context-menu>` | A menu that opens on right-click, with typeahead. | `ContextMenu` |
| `<ui-selection-popup>` | A popup that opens next to an anchor element, with an optional arrow. | `SelectionPopup` |
| `<ui-block-controls>` | A group of controls for one block of content, moved between with the arrow keys. | `BlockControls` |
| `<ui-plugin-panel>` | A titled panel docked to the right, left or bottom of the page, which can be dismissed. | `PluginPanel` |

The React components are in [`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react), and the options of every
element are in [`@editora/ui-core`](https://www.npmjs.com/package/@editora/ui-core).

## Quick start

Install `@editora/ui-core`, and use the elements as HTML. A command palette is a list of your own buttons with
`slot="command"`: open it with `openPalette()`, and listen for `select`.

```bash
npm install @editora/ui-core
```

```html
<script type="importmap">
  {
    "imports": {
      "@editora/ui-core": "https://cdn.jsdelivr.net/npm/@editora/ui-core/dist/index.esm.js",
      "@editora/icons": "https://cdn.jsdelivr.net/npm/@editora/icons/dist/index.esm.js"
    }
  }
</script>
<script type="module">
  import '@editora/ui-core';
</script>

<style>
  /* The commands are your own buttons, so you style them. The palette marks the one the arrow keys are on. */
  ui-command-palette button { display: block; width: 100%; margin: 0; padding: 10px 14px; border: 0; border-radius: 6px; background: transparent; color: #24292f; font: 15px system-ui, sans-serif; text-align: left; cursor: pointer; }
  ui-command-palette button[data-active='true'] { background: #dbeafe; }
</style>

<button id="open" type="button">Open the command palette</button>
<p id="status">Nothing run yet</p>

<ui-command-palette id="palette" placeholder="Type a command...">
  <button slot="command">Insert table</button>
  <button slot="command">Toggle bold</button>
  <button slot="command">Clear formatting</button>
</ui-command-palette>

<script type="module">
  const palette = document.getElementById('palette');

  document.getElementById('open').addEventListener('click', () => palette.openPalette());

  // The palette filters as you type, moves with the arrow keys, runs a command on Enter and closes on Escape.
  palette.addEventListener('select', (event) => {
    document.getElementById('status').textContent = `Ran: ${event.detail.label}`;
  });
</script>
```

## What this package contains

It exports six classes: `UIFloatingToolbar`, `UICommandPalette`, `UIContextMenu`, `UIPluginPanel`, `UIBlockControls` and
`UISelectionPopup`. They are earlier, simpler versions of the elements in `@editora/ui-core`, and each module defines its
tag only if the tag is still free (`if (!customElements.get(tag))`).

It never is: `@editora/ui-editor` imports `@editora/ui-core` first, and that defines all six tags. Loading this package
therefore registers nothing, and `customElements.get('ui-command-palette')` is the element of `@editora/ui-core`, not the
class of this package. If you want to extend one of the elements, import its class from `@editora/ui-core`, which exports
the same names.

## Install

```bash
npm install @editora/ui-editor
```

It depends on `@editora/ui-core` (and lists it as a peer dependency), so that is installed with it.

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
