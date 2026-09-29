---
title: Form
description: Managed form wrapper with validation and autosave hooks.
sidebar_label: Form
---

# Form

```tsx live
function FormDemo() {
  return (
    <ThemeProvider>
      <Form
        heading="Profile"
        description="Save account preferences."
        autosave
        autosaveDelay={1200}
        onSubmit={(values) => console.log(values)}
        onInvalid={(errors) => console.log(errors)}
      >
        <Input name="email" label="Email" required />
        <Select name="role" label="Role">
          <option value="editor">Editor</option>
          <option value="reviewer">Reviewer</option>
        </Select>
      </Form>
    </ThemeProvider>
  );
}
```

## Key Props

`onSubmit`, `onInvalid`, `onValidate`, `onAutosave`, `onDirtyChange`, `novalidate`, `autosave`, `autosaveDelay`, `guardUnsaved`, `heading`, `description`, `state`, `stateText`, `loadingText`, `variant`, `tone`, `density`, `shape`, `elevation`, `gap`, `headless`, `loading`, `disabled`

## Notes

- `ui-react` form state comes from `ui-form`; standard HTML form transport props are not the primary API here.
- Child controls should provide `name` when they need to participate in collected form values.
