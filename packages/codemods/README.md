# @editora/codemods

Updates your code for breaking changes in Editora packages. A codemod edits only what changed, keeping your formatting and comments, and reports anything it cannot decide for you.

```bash
npx @editora/codemods <codemod> <files or folders...> --dry   # list what would change
npx @editora/codemods <codemod> <files or folders...>         # apply it
```

It reads `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`, `.mts` and `.cts` files and skips `node_modules`, `dist`, `build` and hidden folders. Commit your work first so you can review the diff.

## Codemods

### `text-field-on-commit` (ui-react 0.2.0)

`onChange` on `Input` and `Textarea` fires on every keystroke since `@editora/ui-react` 0.2.0, as React's `<input>` does. Before, it fired when an edit was committed (blur or Enter); that is now `onCommit`. This codemod renames `onChange` to `onCommit` on those two components, so the code keeps doing what it did:

```diff
- <Input label="Name" onChange={(value) => save('name', value)} />
+ <Input label="Name" onCommit={(value) => save('name', value)} />
```

- Only `Input` and `Textarea` imported from `@editora/ui-react` (the root, `/client`, or the `/Input` and `/Textarea` entries) are changed, including under another local name (`import { Input as Field }`) or a namespace (`<UI.Input>`). Other components called `Input` are left alone.
- An element that already has `onCommit`, or that spreads props (`{...field}`) which might include `onChange`, is listed for you to check instead of being changed.
- Skip it, or undo it, for fields you want updated as the user types, such as search boxes and fields whose `value` you control. The new per-keystroke `onChange` is what those want.

## From code

```js
import { run, transforms } from '@editora/codemods';

const result = run('text-field-on-commit', ['src'], { dry: true });
// { files: [{ path, changes }], changes, warnings }
```

## License

MIT
