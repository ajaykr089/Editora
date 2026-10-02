---
title: Pin Input
description: OTP or verification code entry field.
sidebar_label: Pin Input
---

# Pin Input

```tsx live
function PinInputDemo() {
  return (
    <ThemeProvider>
      <PinInput
        length={6}
        label="Verification code"
        mode="numeric"
        placeholderChar="•"
        onChange={(value) => console.log(value)}
        onComplete={(value) => console.log('complete', value)}
      />
    </ThemeProvider>
  );
}
```

## Key Props

`value`, `onChange`, `onComplete`, `length`, `name`, `label`, `description`, `error`, `mode`, `mask`, `required`, `disabled`, `readOnly`, `placeholderChar`, `size`, `density`, `shape`, `invalid`
