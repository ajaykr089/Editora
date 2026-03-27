---
title: AnimatedNumber
description: Animated numeric display wrapper with inline, digital, analog, and odometer variants.
sidebar_label: AnimatedNumber
---

# AnimatedNumber

```tsx
import { AnimatedNumber } from '@editora/ui-react';

<AnimatedNumber
  value={12845.42}
  variant="inline"
  format="currency"
  currency="USD"
  locale="en-US"
  fractionDigits={2}
  animate
  animateOnMount
/>;
```

Variant examples:

```tsx
<>
  <AnimatedNumber value={12845} variant="odometer" animate duration={1200} />
  <AnimatedNumber value={12845.42} variant="inline" fractionDigits={2} animate />
  <AnimatedNumber value={12845} variant="digital" theme="dark" animation="linear" duration={520} animate />
  <AnimatedNumber value={12845.4} variant="analog" fractionDigits={1} animation="ease-out" duration={1400} animate />
</>
```

Hook usage:

```tsx
import { AnimatedNumber, useAnimatedNumberValue } from '@editora/ui-react';

function RevenueCounter() {
  const { value } = useAnimatedNumberValue({
    start: 0,
    end: 25000,
    duration: 1200,
    autoStart: true,
  });

  return <AnimatedNumber value={value} format="currency" currency="USD" animate />;
}
```

## Key Props

`value`, `variant`, `format`, `locale`, `currency`, `notation`, `fractionDigits`, `minimumFractionDigits`, `maximumFractionDigits`, `duration`, `animation`, `direction`, `animate`, `animateOnMount`, `prefix`, `suffix`, `decimalSeparator`, `groupSeparator`, `min`, `max`, `label`, `onComplete`

## Notes

- Use `variant="odometer"` for rolling mechanical digits and `variant="inline"` for dashboard-style counters.
- Use `variant="digital"` for sharper panel-like motion and `variant="analog"` for softer, instrument-style movement.
- `animateOnMount` is the component-level count-up behavior. `countUp` is supported as the legacy alias.
- `fractionDigits` is a shorthand for setting both `minimumFractionDigits` and `maximumFractionDigits`.
- `useAnimatedNumberValue` is helpful when you want to drive the value from React state instead of only through host attributes.
