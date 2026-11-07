# @editora/docx

## 0.1.1

### Patch Changes

- b7d7881: Typings now resolve in TypeScript projects that use `moduleResolution: "NodeNext"` or `"node16"` (they failed with TS2834 because relative imports had no file extension).

## 0.1.0

### Minor Changes

- 4c1f09d: New package: read and write Word .docx files with no dependencies, through the same document tree as @editora/rich-text-convert. Real headings, nested numbered lists, links, images, tables with merged cells, footnotes and tracked changes, structure inferred for files that have none, and warnings for anything that cannot be carried over. Includes an import/export UI (`@editora/docx/ui`: drag and drop, file picker, accessible report cards, download) and an `editora-docx` CLI.
