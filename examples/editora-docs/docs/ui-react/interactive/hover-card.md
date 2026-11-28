---
title: Hover Card
description: Delayed hover surface for lightweight contextual details.
sidebar_label: Hover Card
---

# Hover Card

```tsx live
function HoverCardDemo() {
  return (
    <ThemeProvider>
      <HoverCard delay={150} closeDelay={120} placement="bottom" onChange={(open) => console.log(open)}>
        <button slot="trigger">Hover user</button>
        <div>Contextual profile preview</div>
      </HoverCard>
    </ThemeProvider>
  );
}
```

## Key Props

`open`, `delay`, `closeDelay`, `placement`, `offset`, `variant`, `tone`, `density`, `shape`, `elevation`, `headless`, `onOpen`, `onClose`, `onChange`

## Your own element (`asChild`)

`HoverCard.Trigger` renders its single child instead of its own element when you pass `asChild`. The part's props are merged into the child's: class names are joined, styles merged, both event handlers run (the child's first) and both refs receive the element.

```tsx
<HoverCard>
  <HoverCard.Trigger asChild>
    <Link href="/u/ada">@ada</Link>
  </HoverCard.Trigger>
  <HoverCard.Content>…</HoverCard.Content>
</HoverCard>
```

Your link is the trigger, with no wrapper `<div>` around it.
