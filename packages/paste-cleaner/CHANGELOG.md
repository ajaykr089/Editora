# @editora/paste-cleaner

## 0.1.2

### Patch Changes

- 553d978: Typings now resolve in TypeScript projects that use `moduleResolution: "NodeNext"` or `"node16"` (they failed with TS2834 because relative imports had no file extension).

## 0.1.1

### Patch Changes

- 80fff01: `cleanPaste({ text })` works on a server without a DOM: plain text and Markdown no longer need the `parse` option, which is only required for HTML input. For text input, the result's `text` is the pasted text itself.

## 0.1.0

### Minor Changes

- 2fed439: New package: cleans pastes from Word, Word for the web, Google Docs, Google Sheets, Excel, Pages/TextEdit, web pages and VS Code into semantic HTML with real nested lists, headings and header rows, converts Markdown and plain text, and sanitizes against an allow-list. Includes `attachPasteCleaner()` for any contenteditable and an Editora plugin.
