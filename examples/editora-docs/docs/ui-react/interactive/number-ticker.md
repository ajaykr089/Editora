---
title: NumberTicker
description: Animated number counter for dashboards, KPI cards, growth metrics, and financial summaries.
sidebar_label: NumberTicker
---

# NumberTicker

`NumberTicker` animates a numeric value from a starting point to a target value with formatting, reduced-motion handling, and imperative playback controls. It wraps the `ui-number-ticker` custom element from `@editora/ui-core`.

## Import

```tsx
import { NumberTicker } from '@editora/ui-react';
// or subpath
import { NumberTicker } from '@editora/ui-react/NumberTicker';
```

## Basic Usage

```tsx
<NumberTicker
  value={128420}
  from={120000}
  duration={1400}
  formatStyle="currency"
  currency="USD"
  size="xl"
/>
```

## KPI Card

```tsx
<div style={{ display: 'grid', gap: 10 }}>
  <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
    Monthly revenue
  </div>

  <NumberTicker
    value={128420}
    from={120000}
    duration={1400}
    formatStyle="currency"
    currency="USD"
    tone="brand"
    size="xl"
  />

  <div>Recognized this month</div>
</div>
```

## Signed Delta

```tsx
<NumberTicker
  value={12.4}
  from={9.1}
  duration={1100}
  fractionDigits={1}
  prefix="+"
  suffix="%"
  tone="success"
  size="lg"
/>
```

## Compact Usage Metric

```tsx
<NumberTicker
  value={8421}
  from={7900}
  duration={1200}
  notation="compact"
  tone="info"
  size="lg"
/>
```

## Odometer Style

```tsx
<NumberTicker
  value={128420}
  from={120000}
  duration={1600}
  easing="spring"
  animation="odometer"
  stagger={20}
  formatStyle="currency"
  currency="USD"
  tone="brand"
  size="xl"
/>
```

## Start When Visible

```tsx
<NumberTicker
  value={98.6}
  from={92}
  duration={1400}
  easing="overshoot"
  trigger="visible"
  visibilityThreshold={0.55}
  fractionDigits={1}
  suffix="%"
  tone="success"
  size="xl"
/>
```

## Custom Formatter

```tsx
<NumberTicker
  value={8421}
  from={7900}
  notation="compact"
  animation="odometer"
  formatter={(value, context) => `${context.intl} weekly seats`}
/>
```

## Imperative API

```tsx
const ref = React.useRef<HTMLElement & {
  play(): void;
  pause(): void;
  refresh(): void;
  finish(): void;
}>(null);

<>
  <button onClick={() => ref.current?.pause()}>Pause</button>
  <button onClick={() => ref.current?.play()}>Play</button>
  <button onClick={() => ref.current?.refresh()}>Refresh</button>
  <button onClick={() => ref.current?.finish()}>Finish</button>

  <NumberTicker ref={ref} value={184} from={240} tone="danger" />
</>
```

## Props

### NumberTicker

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| string` | `0` | Target number to animate toward |
| `from` | `number \| string` | `0` | Starting number used on first render and `refresh()` |
| `duration` | `number \| string` | `1200ms` | Animation duration. Numeric values are treated as milliseconds |
| `delay` | `number \| string` | `0ms` | Delay before the ticker starts |
| `easing` | `'linear' \| 'ease-in' \| 'ease-out' \| 'ease-in-out' \| 'spring' \| 'bounce' \| 'overshoot'` | `'ease-out'` | Motion easing curve |
| `animation` | `'interpolate' \| 'odometer'` | `'interpolate'` | Standard value interpolation or per-digit rolling presentation |
| `trigger` | `'immediate' \| 'visible'` | `'immediate'` | Starts immediately or waits until the ticker is visible |
| `visibilityThreshold` | `number \| string` | `0.4` | Intersection ratio required when `trigger="visible"` |
| `stagger` | `number \| string` | `0ms` | Delay applied between odometer digits |
| `staggerFrom` | `'start' \| 'end' \| 'center'` | `'start'` | Direction used to calculate digit stagger timing |
| `locale` | `string` | runtime locale | Locale passed to `Intl.NumberFormat` |
| `formatStyle` | `'decimal' \| 'currency'` | `'decimal'` | Number formatting style |
| `currency` | `string` | `'USD'` when currency style is used | ISO currency code |
| `currencyDisplay` | `'symbol' \| 'narrowSymbol' \| 'code' \| 'name'` | `'symbol'` | Currency display mode |
| `notation` | `'standard' \| 'compact'` | `'standard'` | Standard or compact number notation |
| `compactDisplay` | `'short' \| 'long'` | `'short'` | Compact display style |
| `fractionDigits` | `number \| string` | inferred from the input value | Fixed number of decimal places |
| `useGrouping` | `boolean` | `true` | Enables thousands grouping |
| `signDisplay` | `'auto' \| 'always' \| 'exceptZero' \| 'never'` | `'auto'` | Sign rendering behavior |
| `prefix` | `string` | — | Literal text rendered before the formatted number |
| `suffix` | `string` | — | Literal text rendered after the formatted number |
| `tone` | `'brand' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'brand'` | Accent color tone |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '1' \| '2' \| '3' \| '4'` | `'md'` | Typography scale preset |
| `align` | `'start' \| 'center' \| 'end' \| 'left' \| 'right'` | `'start'` | Horizontal alignment |
| `fontSize` | `number \| string` | — | Direct font-size override |
| `fontWeight` | `number \| string` | `780` | Direct font-weight override |
| `letterSpacing` | `number \| string` | preset value | Direct tracking override |
| `color` | `string` | — | Direct text color override |
| `tabular` | `boolean` | `true` | Keeps digits width-stable with tabular numerals |
| `monospace` | `boolean` | `false` | Uses a monospace font stack |
| `paused` | `boolean` | `false` | Pauses the current ticker |
| `pauseOnHover` | `boolean` | `false` | Pauses while hovered |
| `pauseOnFocus` | `boolean` | `false` | Pauses while focus is inside the component |
| `formatter` | `(value, context) => string` | — | React-only formatter callback for product-specific final text |

## Notes

- `refresh()` restarts the ticker from `from` to `value`.
- `finish()` snaps to the final value immediately.
- Reduced-motion users get the final formatted value without the counting animation.
- `notation="compact"` is useful for large KPI surfaces like `8.4K`, `2.5M`, and similar summaries.
- `animation="odometer"` is best for short numbers and high-visibility hero metrics where per-digit motion adds character.
- `trigger="visible"` is useful on long dashboards so counters do not finish animating before the user reaches them.
