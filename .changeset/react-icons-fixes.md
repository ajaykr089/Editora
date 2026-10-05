---
"@editora/react-icons": patch
---

Fix `IconProvider`'s `strokeWidth`, which was silently ignored: `iconWeight` always resolved to `'regular'` and always beat the provider's stroke width, so `<IconProvider value={{ strokeWidth: 3 }}>` rendered 1.5. Stroke width now resolves as prop width, prop weight, provider width, provider weight, then the default. A decorative icon that is also given an `aria-label` is no longer marked both `aria-hidden` and labelled. Invalid sizes (`0`, negatives, `NaN`, non-lengths) fall back to the default instead of reaching `width`/`height` (React logged "Received NaN for the `width` attribute"). Adds the package's first test suite.
