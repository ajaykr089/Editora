# @editora/doc-schema

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


`@editora/doc-schema` provides structured authoring workflows for contracts, SOPs, and policy documents. It validates heading structure, highlights schema violations, and can insert missing required sections.

## Features

- Native plugin (no framework dependency)
- Works in React (Vite/CRA) and Web Components without modification
- Built-in schemas: Contract, SOP, Policy
- Runtime schema switching per editor instance
- Realtime or on-demand schema validation
- Insert missing required sections in one action
- Strict-order insertion places missing sections near schema-correct boundaries (not always at end)
- Inserted headings inherit the dominant heading level used by schema sections in current document
- Multi-instance-safe command targeting and toolbar active states
- Light/dark theme support
- Accessible panel (`role="dialog"`, keyboard-operable controls, live region updates)

## Install

```bash
npm install @editora/doc-schema
```

## Basic Usage (React)

```tsx
import { EditoraEditor } from '@editora/react';
import { DocSchemaPlugin, HistoryPlugin } from '@editora/plugins';

export default function App() {
  return (
    <EditoraEditor
      plugins={[
        HistoryPlugin(),
        DocSchemaPlugin({
          defaultSchemaId: 'policy',
          enableRealtime: true,
        }),
      ]}
    />
  );
}
```

## Basic Usage (Web Component)

```html
<editora-editor id="editor"></editora-editor>
<script>
  const editor = document.getElementById('editor');
  editor.setConfig({
    plugins: 'history doc-schema',
    toolbar: {
      items: 'undo redo | toggleDocSchemaPanel runDocSchemaValidation toggleDocSchemaRealtime',
    },
  });
</script>
```

Accepted aliases: `docSchema`, `doc-schema`, `docschema`.

## Step-by-Step Scenario (Policy Team)

Scenario: Security governance team writes a quarterly access-control policy. The document must always include `Policy Statement`, `Applicability`, `Controls`, `Exceptions`, and `Enforcement` in order.

1. Open schema panel: `Ctrl/Cmd + Alt + Shift + G`.
2. Select schema: `Policy`.
3. Click `Run Validation`.
4. Review issues list.
5. Click `Insert Missing Sections` to place required missing headings in schema-correct order.
6. Fill content under each inserted heading.
7. Re-run validation or keep realtime enabled.

Why it helps:

- Prevents missing critical sections before legal/compliance review.
- Keeps document structure consistent across teams and releases.
- Reduces manual checklist/rework cycles.

## Toolbar Commands

- `toggleDocSchemaPanel`
- `openDocSchemaPanel`
- `runDocSchemaValidation`
- `insertMissingDocSchemaSections`
- `toggleDocSchemaRealtime`
- `setDocSchemaMode`
- `setDocSchemaOptions`
- `getDocSchemaState`

## Keyboard Shortcuts

- `Ctrl/Cmd + Alt + Shift + G` -> toggle schema panel
- `Ctrl/Cmd + Alt + Shift + J` -> run schema validation

## Advanced Usage

### 1. Custom schema library

```ts
DocSchemaPlugin({
  defaultSchemaId: 'incident-postmortem',
  schemas: [
    {
      id: 'incident-postmortem',
      label: 'Incident Postmortem',
      strictOrder: true,
      allowUnknownHeadings: true,
      sections: [
        { id: 'summary', title: 'Summary' },
        { id: 'impact', title: 'Impact' },
        { id: 'timeline', title: 'Timeline', maxOccurrences: 10 },
        { id: 'root-cause', title: 'Root Cause' },
        { id: 'actions', title: 'Action Items' },
      ],
    },
  ],
});
```

### 2. Runtime schema/profile update per editor instance

```ts
(window as any).executeEditorCommand?.('setDocSchemaOptions', {
  defaultSchemaId: 'contract',
  enableRealtime: false,
  labels: {
    panelTitle: 'Governance Schema',
    validateText: 'Audit Structure',
  },
});
```

### 3. Programmatic schema switch + validation

```ts
(window as any).executeEditorCommand?.('setDocSchemaMode', 'sop');
(window as any).executeEditorCommand?.('runDocSchemaValidation');
```

### 4. Read runtime state

```ts
(window as any).executeEditorCommand?.('getDocSchemaState', (state) => {
  console.log(state.activeSchemaId, state.issues.length);
});
```

## Edge Cases Covered

- Multi-editor pages: explicit command context is consumed for safe targeting.
- Detached editors: internal state/panel cleanup on unmount/removal.
- Read-only mode: insertion blocked with live-region feedback.
- Long sessions: realtime validation is debounced and bounded by `maxIssues`.
- Numbered headings (for example `1. Scope`): normalized matching handles common numbering prefixes.
- Unknown headings policy: configurable per schema via `allowUnknownHeadings`.
- Strict order insertion: missing sections are placed before the next higher-order section (or after lower-order sections) to avoid creating new ordering violations.
- Heading hierarchy preservation: inserted headings use the dominant existing schema heading level (for example `h3` in nested policy docs).
