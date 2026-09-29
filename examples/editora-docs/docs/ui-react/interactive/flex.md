---
title: Flex
description: Flexbox layout primitive with responsive values.
sidebar_label: Flex
---

# Flex

```tsx live
function FlexDemo() {
  return (
    <ThemeProvider>
      <Flex direction={{ initial: 'column', md: 'row' }} gap="1rem" align="center">
        <div>One</div>
        <div>Two</div>
      </Flex>
    </ThemeProvider>
  );
}
```

## Key Props

`direction`, `align`, `justify`, `wrap`, `gap`, `rowGap`, `columnGap`, `display`, `headless`
