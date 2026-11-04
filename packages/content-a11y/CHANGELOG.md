# @editora/content-a11y

## 0.1.1

### Patch Changes

- 553d978: Typings now resolve in TypeScript projects that use `moduleResolution: "NodeNext"` or `"node16"` (they failed with TS2834 because relative imports had no file extension).

## 0.1.0

### Minor Changes

- 5562721: New package: accessibility checks for authored content (alt text, headings, link text, lists, tables, colour contrast and more, 25 rules mapped to WCAG 2.2) with fixes marked safe-to-apply or needs-a-person. Runs headless (`checkContent`, `fixContent`), as editor markers (`attachContentChecker`, Editora plugin with undoable fixes) and in CI (`content-a11y` CLI).
