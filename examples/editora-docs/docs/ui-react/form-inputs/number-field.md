---
title: Number Field
description: Numeric input with stepping, formatting, and validation hooks.
sidebar_label: Number Field
---

# Number Field

```tsx live
function NumberFieldDemo() {
  return (
    <ThemeProvider>
      <NumberField
        label="Seats"
        value={25}
        min={1}
        max={500}
        step={1}
        precision={0}
        locale="en-US"
        format="grouped"
        showSteppers
        onValueChange={(detail) => console.log(detail.value)}
      />
    </ThemeProvider>
  );
}
```

## Key Props

`value`, `defaultValue`, `min`, `max`, `step`, `precision`, `locale`, `format`, `placeholder`, `label`, `description`, `error`, `name`, `required`, `disabled`, `readOnly`, `allowWheel`, `showSteppers`, `clampOnBlur`, `autoComplete`, `inputMode`, `invalid`, `prefix`, `suffix`, `incrementTrigger`, `decrementTrigger`, `onValueChange`, `onInput`, `onInvalidValue`

## Notes

- `onValueChange` receives a detail object with both the new and previous values. It fires when a value is committed (blur, Enter, the steppers); `onInput` fires on every keystroke with `{ rawValue, value }` (`value` is `null` while the text is not a number yet, such as `1.`).
- `value` with `onValueChange` is controlled: a committed value you do not store is undone. Use `defaultValue` for an uncontrolled field.
- Use `prefix`, `suffix`, or the trigger slots when you need custom adornments.
