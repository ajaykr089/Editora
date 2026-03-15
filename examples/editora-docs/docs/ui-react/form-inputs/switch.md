---
title: Switch
description: Toggle switch for on/off settings with label, description, and event details.
sidebar_label: Switch
---

# Switch

A toggle switch for boolean settings. Uses a composed pattern — `Switch.Description` renders helper text below the label via the `description` slot.

## Import

```tsx
import { Switch } from '@editora/ui-react';
// or subpath
import { Switch } from '@editora/ui-react/Switch';
```

## Basic Usage

```tsx
<Switch onChange={(detail) => console.log(detail.checked)}>
  Enable alerts
</Switch>
```

## With Description

Use `Switch.Description` instead of a raw `<span slot="description">`.

```tsx
<Switch checked onChange={(detail) => console.log(detail.checked)}>
  Enable workspace automations
  <Switch.Description>Run triggers when publishing or archiving content.</Switch.Description>
</Switch>
```

## Controlled

```tsx
const [checked, setChecked] = useState(false);

<Switch checked={checked} onChange={(detail) => setChecked(detail.checked)}>
  Auto deploy
  <Switch.Description>Deploys on every push to main.</Switch.Description>
</Switch>
```

## Variants

```tsx
<Switch checked variant="default">Default</Switch>
<Switch checked variant="soft">Soft</Switch>
<Switch checked variant="outline">Outline</Switch>
<Switch checked variant="contrast">Contrast</Switch>
<Switch checked variant="minimal">Minimal</Switch>
```

## Tones

```tsx
<Switch checked tone="success">Healthy sync</Switch>
<Switch checked tone="warning">Pending approvals</Switch>
<Switch checked tone="danger">Destructive action</Switch>
```

## States

```tsx
<Switch loading checked>Syncing…</Switch>
<Switch disabled checked>Disabled</Switch>
```

## Props

### Switch (root)

| Prop          | Type                                                                      | Default     | Description                                      |
|---------------|---------------------------------------------------------------------------|-------------|--------------------------------------------------|
| `checked`     | `boolean`                                                                 | `false`     | Controlled checked state                         |
| `disabled`    | `boolean`                                                                 | `false`     | Disables interaction                             |
| `loading`     | `boolean`                                                                 | `false`     | Shows spinner, disables interaction              |
| `required`    | `boolean`                                                                 | `false`     | Marks field as required                          |
| `headless`    | `boolean`                                                                 | `false`     | Hides the track/thumb, renders label only        |
| `size`        | `'sm' \| 'md' \| 'lg'`                                                    | `'md'`      | Switch size                                      |
| `variant`     | `'default' \| 'soft' \| 'outline' \| 'contrast' \| 'minimal'`            | `'default'` | Visual style                                     |
| `tone`        | `'brand' \| 'success' \| 'warning' \| 'danger'`                           | `'brand'`   | Accent color                                     |
| `shape`       | `'pill' \| 'rounded' \| 'square'`                                         | `'pill'`    | Track border radius                              |
| `elevation`   | `'none' \| 'low' \| 'high'`                                               | `'low'`     | Box shadow depth                                 |
| `label`       | `string`                                                                  | —           | Shorthand label (alternative to children)        |
| `description` | `string`                                                                  | —           | Shorthand description (alternative to `Switch.Description`) |
| `name`        | `string`                                                                  | —           | Form field name                                  |
| `value`       | `string`                                                                  | `'on'`      | Form field value                                 |
| `onInput`     | `(detail: SwitchDetail) => void`                                          | —           | Fires on every toggle                            |
| `onChange`    | `(detail: SwitchDetail) => void`                                          | —           | Fires on committed toggle                        |

### Switch.Description

Renders helper text below the label row via `slot="description"`.

| Prop       | Type                                | Description              |
|------------|-------------------------------------|--------------------------|
| `children` | `React.ReactNode`                   | Description content      |
| `...rest`  | `React.HTMLAttributes<HTMLElement>` | Passed to inner `<span>` |

## Event Detail

```ts
type SwitchDetail = {
  checked: boolean;
  value: string;
  name: string;
  required: boolean;
};
```

## Notes

- The `description` string prop and `Switch.Description` sub-component are equivalent — use whichever fits your pattern.
- Elements inside `Switch.Description` with `data-ui-switch-no-toggle` (e.g. links) will not trigger the toggle on click.
- Keyboard: `Space`/`Enter` toggles, `ArrowLeft`/`ArrowRight` sets off/on, `Home`/`End` forces off/on.
