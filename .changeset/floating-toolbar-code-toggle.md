---
"@editora/react": patch
---

Fix the floating selection toolbar's "Code" button, which only ever wrapped the selection in `<code>` and was not a real toggle. Clicking it on text already inside a `<code>` element nested a second `<code>` inside the first instead of removing the formatting, and `Range.surroundContents()` - used for the initial wrap - throws an uncaught `InvalidStateError` whenever the selection starts or ends partway into another element (e.g. partially overlapping a `<b>` run), which is a completely ordinary selection pattern. In that case the button silently did nothing.

Found via live testing: re-selecting already-coded text and clicking "Code" again produced invalid nested `<code><code>...</code></code>` markup, and selecting text that partially overlapped a bold span threw an uncaught exception with no visible effect.

Fixed by detecting when the whole selection already sits inside one `<code>` element and unwrapping it instead of wrapping again, and by using `range.extractContents()` to build the wrapped fragment instead of `surroundContents()`, which correctly splits any partially-selected element rather than throwing. Verified live: wrap, toggle-off, and a boundary-crossing selection all now work correctly.
