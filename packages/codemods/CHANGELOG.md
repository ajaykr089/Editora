# @editora/codemods

## 0.1.0

### Minor Changes

- ba83ee6: New package: codemods that update app code for breaking changes in Editora packages, editing only what changed and keeping formatting and comments. `npx @editora/codemods text-field-on-commit src` renames `onChange` to `onCommit` on `Input` and `Textarea` from `@editora/ui-react`, keeping the pre-0.2.0 behaviour (fire when an edit is committed); it follows aliases, namespace imports and the per-component entries, and lists elements it cannot decide (both props present, spread props) instead of guessing. `--dry` reports without writing.
