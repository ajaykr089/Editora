---
title: Label
description: Accessible text label for form controls and grouped inputs.
sidebar_label: Label
---

# Label

The `Label` component connects text descriptions with form controls. It uses a composed pattern with `Label.Text` and `Label.Description` sub-components, and a `required` prop for the asterisk indicator.

## Import

```tsx
import { Label } from '@editora/ui-react';
// or subpath
import { Label } from '@editora/ui-react/Label';
```

## Basic Usage

```tsx
<Label htmlFor="name">
  <Label.Text>Name</Label.Text>
</Label>
<Input id="name" />
```

## Required Field

Use the `required` prop on the root — do not add `*` manually.

```tsx
<Label htmlFor="email" required>
  <Label.Text>Email address</Label.Text>
</Label>
<Input id="email" type="email" />
```

## With Description

```tsx
<Label htmlFor="bio">
  <Label.Text>Bio</Label.Text>
  <Label.Description>Max 160 characters. Shown on your public profile.</Label.Description>
</Label>
<Input id="bio" />
```

## Required + Description

```tsx
<Label htmlFor="token" required>
  <Label.Text>API token</Label.Text>
  <Label.Description>Rotate every 90 days. Never share this value.</Label.Description>
</Label>
<Input id="token" type="password" />
```

## Props

### Label (root)

| Prop          | Type                                                                 | Default     | Description                                      |
|---------------|----------------------------------------------------------------------|-------------|--------------------------------------------------|
| `htmlFor`     | `string`                                                             | —           | ID of the associated form control                |
| `required`    | `boolean`                                                            | `false`     | Shows a red `*` indicator after the label text   |
| `description` | `string`                                                             | —           | Shorthand description (alternative to `Label.Description`) |
| `variant`     | `'default' \| 'surface' \| 'soft' \| 'contrast' \| 'minimal' \| 'elevated'` | `'default'` | Visual style                          |
| `tone`        | `'default' \| 'brand' \| 'success' \| 'warning' \| 'danger'`        | `'default'` | Color tone                                       |
| `size`        | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'`                         | `'md'`      | Font size                                        |
| `density`     | `'default' \| 'compact' \| 'comfortable'`                            | `'default'` | Spacing between label and description            |
| `shape`       | `'default' \| 'square' \| 'soft'`                                    | `'default'` | Border radius                                    |
| `disabled`    | `boolean`                                                            | `false`     | Dims the label and disables pointer              |
| `headless`    | `boolean`                                                            | `false`     | Hides the root container (renders only the slot) |

### Label.Text

Renders the visible label text inside the label row.

| Prop       | Type                                  | Description              |
|------------|---------------------------------------|--------------------------|
| `children` | `React.ReactNode`                     | Label text content       |
| `...rest`  | `React.HTMLAttributes<HTMLElement>`   | Passed to inner `<span>` |

### Label.Description

Renders helper text below the label row.

| Prop       | Type                                  | Description                  |
|------------|---------------------------------------|------------------------------|
| `children` | `React.ReactNode`                     | Description text content     |
| `...rest`  | `React.HTMLAttributes<HTMLElement>`   | Passed to inner `<span>`     |

## Notes

- `required` and `Label.Required` are mutually exclusive — `Label.Required` no longer exists. Always use the `required` prop.
- Clicking anywhere on the label (text or description) focuses the associated control via `htmlFor` or auto-detection of the nearest focusable sibling.
- The `description` string prop and `Label.Description` sub-component are equivalent; use whichever fits your pattern.
