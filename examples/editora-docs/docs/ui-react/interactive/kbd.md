---
title: Kbd
description: Keycap-style keyboard hint surface for commands, menus, docs, and onboarding UI.
sidebar_label: Kbd
---

# Kbd

`Kbd` renders one or more keycaps with consistent spacing, separators, and tone styling. It is useful for command hints, onboarding tips, keyboard cheat sheets, and compact menu annotations.

## Basic usage

```tsx live
function SaveHint() {
  return (
    <ThemeProvider>
      <Kbd keys={['Cmd', 'S']} />
    </ThemeProvider>
  );
}
```

## Custom separator

```tsx
<Kbd keys={['ArrowDown', 'Enter']} separator="then" />
```

## Child-derived keys

```tsx
<Kbd>
  <span>Shift</span>
  <span>K</span>
</Kbd>
```

## Key props

`keys`, `separator`, `size`, `tone`

## Notes

- `keys` is the clearest API when the list is data-driven.
- Child-derived keys are helpful when you want to compose richer labels inline.
- `Kbd` is server-safe, so it can be rendered in docs and RSC shells without client wrappers.

## Without React

`@editora/ui-core` 0.7.0 has a `ui-kbd` custom element for plain HTML and other frameworks. This React component stays a separate implementation (server-safe markup).

```html
<script type="module">import '@editora/ui-core/kbd';</script>
<ui-kbd>Esc</ui-kbd>
<ui-kbd keys="Ctrl+Shift+P"></ui-kbd>
<ui-kbd keys='["⌘", "K"]' separator=""></ui-kbd>
```

A shortcut renders as nested `<kbd>` elements. `keys` is "+"-separated (write the plus key as `Ctrl++`) or a JSON array; also `size` (`sm` `md` `lg`), `variant` (`outline` `soft` `ghost`) and `separator`.
