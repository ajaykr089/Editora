---
title: Form
description: Managed form wrapper with validation, autosave, and sub-components for structured content slots.
sidebar_label: Form
---

# Form

A form component that provides validation, autosave, and dirty state tracking with composed sub-components for structuring form content. Built with the composed component pattern for flexible form layouts.

```tsx
import { Form, Button, Field, Input } from '@editora/ui-react';

function ContactForm() {
  const [values, setValues] = React.useState({});

  return (
    <Form
      heading="Contact Information"
      variant="surface"
      onSubmit={(vals) => setValues(vals)}
    >
      <Field label="Name" htmlFor="name" required>
        <Input id="name" name="name" required />
      </Field>

      <Field label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" required />
      </Field>

      <Form.Actions>
        <Button type="submit">Send</Button>
      </Form.Actions>

      <Form.Status>
        Submitted: {JSON.stringify(values)}
      </Form.Status>
    </Form>
  );
}
```

## Sub-components

### Form
Root container for the form with validation, autosave, and state management.

**Props:**
- `onSubmit?: (values: Record<string, any>) => void` — Fires when form is submitted with valid data
- `onInvalid?: (errors: Record<string, string | undefined>, values: Record<string, any>) => void` — Fires on validation failure
- `onValidate?: (result: { valid: boolean; errors: Record<string, string | undefined> }) => void` — Fires after validation run
- `onAutosave?: (values: Record<string, any>) => void` — Fires when autosave triggers
- `onDirtyChange?: (dirty: boolean, values: Record<string, any>) => void` — Fires when dirty state changes
- `novalidate?: boolean` — Disable native form validation
- `autosave?: boolean` — Enable autosave on form changes
- `autosaveDelay?: number` — Delay before autosave triggers (ms)
- `guardUnsaved?: boolean` — Warn on unsaved changes before navigation
- `heading?: string` — Form heading/title text
- `description?: string` — Form description text
- `state?: 'default' | 'success' | 'warning' | 'error'` — Visual state indicator
- `stateText?: string` — Text to display with state
- `loadingText?: string` — Text to show during loading
- `variant?: 'default' | 'surface' | 'outline' | 'soft' | 'contrast' | 'minimal' | 'elevated'` — Form variant
- `tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger'` — Tone override
- `density?: 'default' | 'compact' | 'comfortable'` — Internal spacing density
- `shape?: 'default' | 'square' | 'soft'` — Corner style
- `elevation?: 'default' | 'none' | 'low' | 'high'` — Shadow depth
- `gap?: string` — Gap between form children
- `headless?: boolean` — Hide default heading/description
- `loading?: boolean` — Show loading state
- `disabled?: boolean` — Disable all form inputs

**Imperative Methods:**
- `submit(): Promise<boolean>` — Programmatically submit the form
- `validate(): Promise<{ valid: boolean; errors: Record<string, string | undefined> }>` — Validate without submitting
- `getValues(): Record<string, any>` — Get current form values
- `setValue(name: string, value: any): void` — Set a single field value
- `setValues(values: Record<string, any>): void` — Set multiple field values
- `reset(values?: Record<string, any>): void` — Reset form to initial or provided values

### Form.Actions
Container for form action buttons (submit, cancel, etc).

**Props:**
- All standard HTML div attributes

**Example:**
```tsx
<Form.Actions>
  <Button type="submit">Save</Button>
  <Button variant="secondary">Cancel</Button>
</Form.Actions>
```

### Form.Status
Container for form status messages, validation errors, or submission feedback.

**Props:**
- All standard HTML div attributes

**Example:**
```tsx
<Form.Status>
  {status === 'success' ? 'Form saved!' : 'Waiting...'}
</Form.Status>
```

### Form.Title
Custom title/heading for the form (when `headless` is true).

**Props:**
- All standard HTML div attributes

**Example:**
```tsx
<Form headless>
  <Form.Title>Custom form title</Form.Title>
  {/* form fields */}
</Form>
```

## Examples

### Basic Form with Validation

```tsx
export function BasicForm() {
  const formRef = React.useRef(null);
  const [status, setStatus] = React.useState('');

  return (
    <Form
      ref={formRef}
      heading="User Registration"
      variant="outline"
      onSubmit={(values) => setStatus('Success: ' + values.email)}
      onInvalid={(errors) => setStatus('Error: ' + Object.keys(errors).join(', '))}
    >
      <Field label="Email" htmlFor="email" required>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="user@example.com"
        />
      </Field>

      <Field label="Password" htmlFor="password" required>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
        />
      </Field>

      <Form.Actions style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button onClick={() => formRef.current?.submit()}>Register</Button>
        <Button variant="secondary" onClick={() => formRef.current?.reset()}>
          Reset
        </Button>
      </Form.Actions>

      <Form.Status style={{ marginTop: 12, fontSize: 14 }}>
        {status}
      </Form.Status>
    </Form>
  );
}
```

### Autosave Form

```tsx
export function AutosaveForm() {
  const [lastSaved, setLastSaved] = React.useState('Never');

  return (
    <Form
      heading="Auto-saving Notes"
      variant="soft"
      autosave
      autosaveDelay={1000}
      onAutosave={() => setLastSaved(new Date().toLocaleTimeString())}
    >
      <Field
        label="Notes"
        htmlFor="notes"
        description="Changes save automatically"
      >
        <Textarea id="notes" name="notes" rows={6} />
      </Field>

      <Form.Status style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
        Last saved: {lastSaved}
      </Form.Status>
    </Form>
  );
}
```

### Multi-step Form Wizard

```tsx
export function FormWizard() {
  const [step, setStep] = React.useState(1);
  const [formState, setFormState] = React.useState('idle');

  return (
    <Form
      heading={`Step ${step} of 3`}
      description="Complete all steps to finish setup"
      variant="elevated"
      tone="brand"
      state={formState === 'error' ? 'error' : 'default'}
      onSubmit={() => {
        if (step < 3) setStep(step + 1);
        else setFormState('success');
      }}
      onInvalid={() => setFormState('error')}
    >
      {step === 1 && (
        <>
          <Field label="Organization" htmlFor="org" required>
            <Input id="org" name="organization" required />
          </Field>
          <Field label="Admin Email" htmlFor="admin" required>
            <Input id="admin" name="adminEmail" type="email" required />
          </Field>
        </>
      )}

      {step === 2 && (
        <Field label="Region" htmlFor="region" required>
          <Select id="region" name="region" required>
            <option>US East</option>
            <option>US West</option>
            <option>Europe</option>
          </Select>
        </Field>
      )}

      {step === 3 && (
        <Field label="Confirm" htmlFor="confirm">
          <Checkbox id="confirm" name="confirmed" />
        </Field>
      )}

      <Form.Actions style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button
          variant="secondary"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button onClick={() => setFormState('submitting')}>
          {step === 3 ? 'Finish' : 'Next'}
        </Button>
      </Form.Actions>
    </Form>
  );
}
```

### Custom Header with Form.Title

```tsx
export function HeadlessForm() {
  return (
    <Form
      headless
      variant="minimal"
      gap="8px"
      onSubmit={(values) => console.log(values)}
    >
      <Form.Title style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
        Custom Layout Form
      </Form.Title>

      <Field label="Name" htmlFor="name">
        <Input id="name" name="name" />
      </Field>

      <Field label="Message" htmlFor="msg">
        <Textarea id="msg" name="message" />
      </Field>

      <Form.Actions style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button>Send</Button>
      </Form.Actions>
    </Form>
  );
}
```
