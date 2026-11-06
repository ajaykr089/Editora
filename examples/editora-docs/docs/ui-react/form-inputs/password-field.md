---
title: Password Field
description: Password input with reveal toggle, clear action, and strength feedback.
sidebar_label: Password Field
---

# Password Field

```tsx live
function PasswordFieldDemo() {
  return (
    <ThemeProvider>
      <PasswordField
        label="Password"
        placeholder="Create a password"
        clearable
        revealable
        showStrength
        minlength={12}
        onChange={(value) => console.log(value)}
      />
    </ThemeProvider>
  );
}
```


## Sign-in fields and password managers

Password managers and browser autofill look for real inputs in the page, and an input inside a shadow root is found unreliably. For credential fields, put your own native input in the `input` slot: the component keeps its label, styling, clear and show/hide buttons around it, but the field itself is an ordinary input with your `name` and `autocomplete`, part of the form like any other.

```tsx
<form method="post" action="/login">
  <Input label="Email">
    <input slot="input" name="email" type="email" autoComplete="username" />
  </Input>
  <PasswordField label="Password">
    <input slot="input" name="password" autoComplete="current-password" />
  </PasswordField>
  <Button type="submit">Sign in</Button>
</form>
```

The component does not change the input's `name`, `type` (except the show/hide toggle), `autocomplete` or `placeholder`. It names the input after the label unless you labelled it yourself. Enter submits the form natively, and the value is submitted once.

## Key Props

`value`, `onChange`, `onInput`, `onDebouncedInput`, `onClear`, `onVisibilityChange`, `onStrengthChange`, `clearable`, `debounce`, `validation`, `size`, `minlength`, `maxlength`, `readOnly`, `autofocus`, `disabled`, `counter`, `floatingLabel`, `name`, `required`, `pattern`, `autoComplete`, `spellCheck`, `placeholder`, `variant`, `tone`, `density`, `shape`, `color`, `radius`, `label`, `description`, `error`, `showStrength`, `revealable`, `strengthEvaluator`

## Notes

- `strengthEvaluator` lets product code replace the default scoring logic.
- The wrapper uses `minlength` and `maxlength`, matching the underlying custom element attributes.
