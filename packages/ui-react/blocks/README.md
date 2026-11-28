# Blocks

Page sections built from `@editora/ui-react` components, to copy into an app and edit:

```bash
npx @editora/cli add block-login --copy
```

Each block is one file with no dependencies besides `react` and `@editora/ui-react`. They are not part of the published package; the CLI copies them from this folder. `npm run check:blocks` type-checks them.
