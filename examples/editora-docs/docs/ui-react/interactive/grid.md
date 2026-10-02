---
title: Grid
description: CSS grid primitive with responsive template props.
sidebar_label: Grid
---

# Grid

```tsx live
function GridDemo() {
  return (
    <ThemeProvider>
      <Grid columns={{ initial: '1fr', md: 'repeat(3, 1fr)' }} gap="1rem">
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </Grid>
    </ThemeProvider>
  );
}
```

## Key Props

`columns`, `rows`, `gap`, `rowGap`, `columnGap`, `autoFlow`, `autoRows`, `autoColumns`, `align`, `justify`, `place`, `alignContent`, `justifyContent`, `placeContent`, `display`, `headless`
