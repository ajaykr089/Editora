# @editora/ui-react

React wrappers for Editora UI web components.

The package auto-registers all `@editora/ui-core` custom elements when imported.

## Quick Start

```tsx
import React from 'react';
import { Button, Input } from '@editora/ui-react';

export function QuickStart() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <Input
        name="title"
        label="Document title"
        placeholder="Untitled"
        clearable
      />
      <Button variant="primary">Save</Button>
    </div>
  );
}
```

## Toast Primitive

```tsx
import React, { useRef } from 'react';
import { Button, Toast, type ToastElement } from '@editora/ui-react';

export function ToastExample() {
  const toastRef = useRef<ToastElement | null>(null);

  return (
    <div>
      <Toast ref={toastRef} />
      <Button onClick={() => toastRef.current?.show('Saved successfully')}>
        Show toast
      </Button>
    </div>
  );
}
```

## Context Menu

### 1. Data-driven menu (`items`)

```tsx
import React from 'react';
import { ContextMenu } from '@editora/ui-react';

export function ContextMenuItemsExample() {
  return (
    <>
      <div id="menu-anchor" style={{ padding: 20, border: '1px dashed #ccc', display: 'inline-block' }}>
        Right click me
      </div>
      <ContextMenu
        open
        anchorId="menu-anchor"
        items={[
          { label: 'Rename', icon: '✏️', onClick: () => console.log('rename') },
          { label: 'Duplicate', icon: '📄', onClick: () => console.log('duplicate') },
          { separator: true },
          { label: 'Delete', icon: '🗑️', disabled: true }
        ]}
      />
    </>
  );
}
```

### 2. Fully custom slotted menu (`children`)

```tsx
import React, { useState } from 'react';
import { ContextMenu } from '@editora/ui-react';

export function ContextMenuSlotExample() {
  const [state, setState] = useState<{ open: boolean; point?: { x: number; y: number } }>({ open: false });

  return (
    <div
      style={{ padding: 24, border: '1px dashed #ccc' }}
      onContextMenu={(e) => {
        e.preventDefault();
        setState({ open: true, point: { x: e.clientX, y: e.clientY } });
      }}
    >
      Right click here
      <ContextMenu open={state.open} anchorPoint={state.point}>
        <div slot="menu">
          <div className="menuitem" role="menuitem" tabIndex={0}>Cut</div>
          <div className="menuitem" role="menuitem" tabIndex={0}>Copy</div>
          <div className="separator" role="separator" />
          <div className="menuitem" role="menuitem" tabIndex={0}>Paste</div>
        </div>
      </ContextMenu>
    </div>
  );
}
```

## Form + useForm Hook

```tsx
import React from 'react';
import { Form, Input, Button, useForm } from '@editora/ui-react';

export function FormExample() {
  const { ref, submit, validate, getValues } = useForm();

  return (
    <Form
      ref={ref}
      onSubmit={(values) => console.log('submit', values)}
      onInvalid={(errors) => console.log('invalid', errors)}
      style={{ display: 'grid', gap: 10, maxWidth: 420 }}
    >
      <Input name="email" type="email" label="Email" required placeholder="you@example.com" />
      <Input name="displayName" label="Display Name" clearable />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" onClick={() => validate()}>
          Validate
        </Button>
        <Button variant="secondary" onClick={() => console.log(getValues())}>
          Get Values
        </Button>
        <Button onClick={() => submit()}>
          Submit
        </Button>
      </div>
    </Form>
  );
}
```

## ThemeProvider

```tsx
import React from 'react';
import { ThemeProvider, Button, Input } from '@editora/ui-react';

export function ThemedExample() {
  return (
    <ThemeProvider
      tokens={{
        colors: {
          primary: '#0f766e',
          text: '#0f172a',
          background: '#ffffff'
        }
      }}
    >
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <Input label="Name" placeholder="Type..." />
        <Button>Save</Button>
      </div>
    </ThemeProvider>
  );
}
```

## DataTable + Server States

```tsx
import React from 'react';
import { Alert, DataTable, EmptyState, Pagination, Skeleton } from '@editora/ui-react';

export function AdminDataStateExample() {
  const [page, setPage] = React.useState(1);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <DataTable
        sortable
        selectable
        page={page}
        pageSize={5}
        paginationId="users-pagination"
        onPageChange={(detail) => setPage(detail.page)}
      >
        <table>{/* your thead/tbody rows */}</table>
      </DataTable>
      <Pagination id="users-pagination" page={String(page)} />

      <Skeleton variant="text" count={4} animated />
      <Alert tone="danger" title="Could not fetch users" description="Retry in a moment." dismissible />
      <EmptyState title="No users found" description="Try changing filters." actionLabel="Create user" />
    </div>
  );
}
```

## Build

```bash
cd packages/ui-react
npm run build
```

Build output: `dist/index.js`, `dist/index.esm.js`, `dist/index.d.ts`.

## Run Local Examples

```bash
cd packages/ui-react
npm run dev:examples
```

Example app files live in `packages/ui-react/examples`.
