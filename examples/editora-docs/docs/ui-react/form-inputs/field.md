---
title: Field
description: Field shell for label, description, error, and control grouping.
sidebar_label: Field
---

# Field

```tsx live
function FieldDemo() {
  return (
    <ThemeProvider>
      <Field label="Workspace name" description="Visible to your team." htmlFor="workspace-name" required>
        <Input id="workspace-name" />
      </Field>
    </ThemeProvider>
  );
}
```

## Props

`label`, `description`, `error`, `htmlFor`, `required`, `invalid`, `orientation`, `variant`, `tone`, `density`, `shape`, `shell`, `labelWidth`, `headless`
