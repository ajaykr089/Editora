# @editora/react

React wrapper over Editora core runtime.

## Provides

- `EditoraEditor` component
- Controlled/uncontrolled content patterns
- Plugin-array integration
- Toolbar/statusbar/floating toolbar controls
- Lifecycle callbacks (`onInit`, `onDestroy`)

## Install

```bash
npm install @editora/react @editora/core @editora/plugins @editora/themes react react-dom
```

## Example

```tsx
import { useState } from "react";
import { EditoraEditor } from "@editora/react";
import { BoldPlugin, ItalicPlugin } from "@editora/plugins";
import "@editora/plugins/styles.css";
import "@editora/themes/themes/default.css";

export default function App() {
  const [value, setValue] = useState("<p>Start writing...</p>");

  return (
    <EditoraEditor
      value={value}
      onChange={setValue}
      plugins={[BoldPlugin(), ItalicPlugin()]}
      floatingToolbar
    />
  );
}
```

## React integration notes

- Keep `value` updates debounced for very large documents
- Use stable plugin arrays to avoid unnecessary re-initialization
- Validate multi-instance pages for sidebar/dialog scoping
- Import theme CSS once at app-shell level
- For CRA/bundlers, import `@editora/plugins/styles.css` when plugin UI features are enabled
- Load `default.css` first, then optional theme overrides (`dark.css`, `acme.css`)

## Compatibility

Current package peers are aligned for modern React lines (`>=16.8 <21`).

## API Surface

- `EditoraEditor` component
- Lifecycle props: `onInit`, `onDestroy`
- Content props: `value`, `defaultValue`, `onChange`
- Behavior props: `toolbar`, `statusbar`, `floatingToolbar`, `readonly`
- Runtime props: `autosave`, `security`, `performance`, `accessibility`

## Config Matrix

| Prop Group | Purpose |
| --- | --- |
| Content props | Controlled/uncontrolled value management |
| Plugin props | Feature composition |
| Toolbar/status props | UI behavior and density |
| Runtime config props | Performance/security/accessibility/autosave |

## Validation Checklist

- Cursor/selection behavior remains stable during updates
- Floating toolbar positions correctly for long selections
- Sidebars/dialogs mount to correct instance in multi-editor pages
- Readonly mode blocks mutating commands
