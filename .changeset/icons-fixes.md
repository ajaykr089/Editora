---
"@editora/icons": patch
---

Fix the `heading-1`, `heading-2` and `heading-3` icons, which were drawn as "1H1", "12" and "1Z" (all three began with a stray "1" glyph and the H2/H3 had no "H"); they now read H1, H2, H3 at every size. Harden `renderIconSvg`: attribute names passed through `options.attrs` were written into the markup unescaped (a name such as `x" onload="…` injected attributes and produced malformed XML), and event-handler attributes and invalid names are now dropped; `size` values such as `0`, `-5`, `NaN` or `abc` went straight into `width`/`height` (browsers then size the `<svg>` at 300×150), so only positive numbers and CSS lengths are accepted and anything else falls back to the default; negative or non-finite `strokeWidth` is ignored; `absoluteStrokeWidth` now works with `px` sizes. Adds a `normalizeIconSize` export (used by `@editora/react-icons`) and the package's first test suite.
