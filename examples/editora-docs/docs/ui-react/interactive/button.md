---
title: Button
description: Action button wrapper with loading and icon slots.
sidebar_label: Button
---

# Button

```tsx live
function ButtonDemo() {
  const [saving, setSaving] = React.useState(false);
  return (
    <ThemeProvider>
      <Button
        variant="primary"
        recipe="solid"
        scale="2"
        radius={4}
        startIcon={<span aria-hidden="true">+</span>}
        loading={saving}
        loadingLabel="Saving"
        onClick={() => {
          setSaving(true);
          setTimeout(() => setSaving(false), 1200);
        }}
      >
        Save changes
      </Button>
    </ThemeProvider>
  );
}
```

## Key Props

`variant`, `size`, `recipe`, `radius`, `scale`, `icon`, `startIcon`, `endIcon`, `loading`, `loadingLabel`, `state`, `tone`, `block`, `headless`, `disabled`, `animation`, `theme`, `type`, `ariaLabel`

## Notes

- Use `startIcon` and `endIcon` for React content; use `icon` when the custom element consumes an icon token.
- Use `radius` for corner control with values like `0`, `4`, `8`, `12`, or `'full'`.
- Use `size` for the standard compact/medium/large control family and `scale` for the broader recipe matrix sizing presets.
