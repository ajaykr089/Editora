---
title: Stepper
description: Step progression indicator for multi-step forms and onboarding flows.
sidebar_label: Stepper
---

# Stepper

`Stepper` is useful for signup flows, checkouts, onboarding, and other multi-step forms. The React wrapper is driven by a `steps` array and a selected `value`.

## Basic Usage

```tsx
import { Stepper } from '@editora/ui-react';

function SignupStepper() {
  return (
    <Stepper
      value="profile"
      steps={[
        { value: 'account', label: 'Account', state: 'complete' },
        { value: 'profile', label: 'Profile' },
        { value: 'billing', label: 'Billing' }
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepperStep[]` | `[]` | Step definitions |
| `value` | `string` | - | Active step value |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `variant` | `'default' \| 'contrast' \| 'minimal'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size token |
| `clickable` | `boolean` | `false` | Allow clickable step selection |
| `linear` | `boolean` | `false` | Enforce linear progression |
| `headless` | `boolean` | `false` | Remove default styling |
| `onChange` | `(detail: StepperChangeDetail) => void` | - | Change callback |
| `onSelect` | `(detail: StepperChangeDetail) => void` | - | Select callback |

## Step Object

```tsx
type StepperStep = {
  value?: string;
  label?: string;
  description?: string;
  optional?: boolean;
  disabled?: boolean;
  state?: 'default' | 'complete' | 'error' | 'warning';
};
```

## Vertical Form Flow

```tsx
<Stepper
  orientation="vertical"
  value="payment"
  steps={[
    { value: 'account', label: 'Account', state: 'complete' },
    { value: 'profile', label: 'Profile', state: 'complete' },
    { value: 'payment', label: 'Payment', description: 'Add a billing method' },
    { value: 'review', label: 'Review', optional: true }
  ]}
/>
```

## Clickable Navigation

```tsx
function ClickableStepper() {
  const [value, setValue] = React.useState('profile');

  return (
    <Stepper
      clickable
      value={value}
      steps={[
        { value: 'account', label: 'Account', state: 'complete' },
        { value: 'profile', label: 'Profile' },
        { value: 'billing', label: 'Billing' }
      ]}
      onChange={(detail) => setValue(detail.value)}
    />
  );
}
```

## Notes

- The wrapper uses `onChange` and `onSelect`, not `onStepClick`.
- Step state values are `'default' | 'complete' | 'error' | 'warning'`, not `pending/current/completed`.
