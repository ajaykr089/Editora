---
title: Form
description: Styled managed form wrapper for interactive demos and apps.
sidebar_label: Form
---

# Form

```tsx
import { Form, Input } from '@editora/ui-react';

<Form
  heading="Workspace settings"
  description="Update runtime controls."
  state="default"
  variant="surface"
  gap="1rem"
  onSubmit={(values) => console.log(values)}
>
  <Input name="workspaceName" label="Workspace name" required />
</Form>;
```

## Key Props

`onSubmit`, `onInvalid`, `onValidate`, `onAutosave`, `onDirtyChange`, `novalidate`, `autosave`, `autosaveDelay`, `guardUnsaved`, `heading`, `description`, `state`, `stateText`, `loadingText`, `variant`, `tone`, `density`, `shape`, `elevation`, `gap`, `headless`, `loading`, `disabled`
