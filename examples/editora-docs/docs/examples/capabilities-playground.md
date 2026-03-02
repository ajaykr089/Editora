---
title: Capabilities Playground
description: Side-by-side capability playbook for evaluating React and Web Component editor integrations.
keywords: [playground, react, web component, capabilities, evaluation]
---

# Capabilities Playground

Side-by-side capability playbook for evaluating React and Web Component editor integrations.

## Goal

Use this page as a practical test harness checklist when validating:

- feature parity,
- multi-instance behavior,
- dark/light theme parity,
- runtime config updates.

## Side-by-side setup blueprint

### React instance

```tsx
import { useMemo, useState } from "react";
import { EditoraEditor } from "@editora/react";
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  TextColorPlugin,
  BackgroundColorPlugin,
  FontSizePlugin,
  ChecklistPlugin,
  HistoryPlugin,
  SpellCheckPlugin,
  CommentsPlugin,
} from "@editora/plugins";
import "@editora/plugins/styles.css";
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css";

export function ReactPlayground() {
  const [value, setValue] = useState("<p>React Editor</p>");
  const plugins = useMemo(
    () => [
      BoldPlugin(),
      ItalicPlugin(),
      UnderlinePlugin(),
      StrikethroughPlugin(),
      TextColorPlugin(),
      BackgroundColorPlugin(),
      FontSizePlugin(),
      ChecklistPlugin(),
      HistoryPlugin(),
      SpellCheckPlugin(),
      CommentsPlugin(),
    ],
    [],
  );

  return (
    <div className="editora-theme-dark">
      <EditoraEditor
        value={value}
        onChange={setValue}
        plugins={plugins}
        toolbar={{ floating: true, sticky: true, showMoreOptions: false }}
        statusbar={{ enabled: true, position: "bottom" }}
        autosave={{ enabled: true, intervalMs: 5000, storageKey: "react-doc-a" }}
        security={{ sanitizeOnPaste: true, sanitizeOnInput: true }}
        accessibility={{ enableARIA: true, keyboardNavigation: true, checker: false }}
        performance={{ debounceInputMs: 120, viewportOnlyScan: true }}
      />
    </div>
  );
}
```

### Web component instance

```html
<editora-editor
  id="wc-editor-a"
  theme="light"
  plugins="bold italic underline strikethrough textColor backgroundColor fontSize checklist history spellCheck comments"
  toolbar-items="undo redo | bold italic underline strikethrough | textColor backgroundColor fontSize | checklist | spellCheck comments"
  toolbar-floating="true"
  toolbar-sticky="true"
  statusbar="true"
  autosave='{"enabled":true,"intervalMs":5000,"storageKey":"wc-doc-a"}'
  security='{"sanitizeOnPaste":true,"sanitizeOnInput":true}'
  accessibility='{"enableARIA":true,"keyboardNavigation":true,"checker":false}'
  performance='{"debounceInputMs":120,"viewportOnlyScan":true}'
  placeholder="Web Component Editor..."
></editora-editor>
```

## Capability checklist

| Capability | React | Web component | Pass criteria |
| --- | --- | --- | --- |
| Bold/italic/underline/strikethrough | `plugins` + toolbar | `plugins` + `toolbar-items` | Commands apply on selected text and toggle state correctly |
| Text color and background color | plugin dialogs | plugin dialogs | Picker opens near clicked control and applies to active selection |
| Font size changes | plugin + input | plugin + input | Size applies across multi-line selections correctly |
| Checklist behavior | `ChecklistPlugin` | `checklist` plugin id | Multi-line conversion works and is undoable |
| History undo/redo | `HistoryPlugin` | `history` plugin id | Structural edits (checklist/footnote/table) undo safely |
| Spellcheck sidebar | `SpellCheckPlugin` | `spellCheck` plugin id | Panel mounts to active editor instance only |
| Comments sidebar | `CommentsPlugin` | `comments` plugin id | Add/show-hide stays isolated per instance |
| Floating toolbar | `toolbar.floating` | `toolbar-floating` | Position tracks selection anchor correctly |
| Theme parity | wrapper theme scope | `theme` attr | Toolbar/dialog/sidebar/statusbar follow selected theme |
| Performance tuning | `performance` prop | `performance` attr | Typing remains responsive in long documents |

## Multi-instance stress scenario

Run at least two visible editors of each type and verify:

1. Open spellcheck/comments in editor A, close from A, ensure editor B does not auto-open.
2. Select text in editor A, confirm editor B statusbar does not update.
3. Switch one editor to dark theme and keep another in light; verify dialogs and sidebars stay locally themed.
4. Apply checklist + undo/redo in one editor and ensure no cross-instance DOM mutation.

## Runtime update checks

### React

- Change `toolbar.showMoreOptions` at runtime and verify toolbar remains stable.
- Toggle `readonly` and confirm mutating commands are blocked.

### Web component

- Call `setConfig({ theme: "dark" })` and verify full surface theme switch.
- Call `setConfig({ performance: { debounceInputMs: 50 } })` and verify change behavior remains stable.

## Related pages

- React capabilities: `/docs/editor/react`
- Web component capabilities: `/docs/editor/web-component`
- General playground workflow: `/docs/examples/playground`
- Embedded Storybook demos: `/docs/examples/live-examples`
