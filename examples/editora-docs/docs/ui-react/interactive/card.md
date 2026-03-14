---
title: Card
description: Surface container for grouped content with variants, sizing, and inset sections.
sidebar_label: Card
---

# Card

```tsx
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@editora/ui-react';

<Card variant="surface" size="md" radius={8}>
  <CardHeader>
    <CardTitle>Quick start</CardTitle>
    <CardDescription>Start building your next project in minutes.</CardDescription>
  </CardHeader>

  <p>Use cards to group related content and actions inside a single surface.</p>

  <CardFooter>Updated 2m ago</CardFooter>
</Card>;
```

## Key Props

`variant`, `size`, `radius`, `tone`, `elevation`, `interactive`, `disabled`

## Convenience Exports

`CardHeader`, `CardFooter`, `CardInset`, `CardMedia`, `CardTitle`, `CardDescription`

## Slots

- default slot: main body content
- `header`: top section content
- `inset`: full-bleed content inside the card frame
- `media`: media block rendered above the body
- `footer`: bottom section content

## Notes

- Use `variant` to switch between `surface`, `outline`, `soft`, `solid`, `ghost`, and `glass`.
- Use `size` to control the padding scale with `sm`, `md`, or `lg`. `md` is the baseline default and matches the unset card size.
- Use `radius` for corner control with values like `0`, `4`, `8`, `12`, or `'full'`.
- Use the `inset` slot when media or artwork should sit flush with the card edges while the rest of the content stays padded.
- The convenience exports map directly to the same slot contract, so you can choose either semantic React helpers or explicit slot markup.
- Use `interactive` when the whole card should behave like a clickable surface. The core element adds button semantics, keyboard activation, and focus styling.
- Combine `interactive` with `disabled` to expose an unavailable card surface with `aria-disabled`.
