# @editora/plugins/format-painter

[![Version](https://img.shields.io/npm/v/@editora/plugins)](https://www.npmjs.com/package/@editora/plugins)
[![License](https://img.shields.io/npm/l/@editora/plugins)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/plugins)](https://bundlephobia.com/package/@editora/plugins)

Format Painter plugin for Editora.

It copies the active inline marks, inline styles, block styles, list styles, direction, and table cell/table styling from the source selection, then applies that formatting to the target selection without copying workflow metadata such as links, comments, citations, or track-change markers by default.

## Commands

- `retrieveFormats`: Copies formatting from the current cursor or selection.
- `paintFormats`: Applies the copied formatting to the current selection.
- `toggleFormatPainter`: Copies formatting and arms paint mode from the toolbar.
- `cancelFormatPainter`: Cancels active paint mode.

## Toolbar

Add `formatPainter` or `toggleFormatPainter` to a toolbar configuration.

```ts
toolbar: {
  items: 'bold italic underline | formatPainter'
}
```

## Shortcuts

- `Ctrl+Alt+C` / `Cmd+Alt+C`: copy formatting.
- `Ctrl+Alt+V` / `Cmd+Alt+V`: apply copied formatting.
- `Escape`: cancel paint mode.

## Options

```ts
FormatPainterPlugin({
  ignoredFormats: ['link', 'comments', 'citations', 'track-changes'],
  keepActiveAfterMouseApply: false,
});
```
