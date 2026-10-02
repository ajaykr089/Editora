---
"@editora/core": patch
---

Port the toolbar's "more options" overflow menu to the web component - `@editora/react`'s `Toolbar.tsx` has had a `ResizeObserver`-driven overflow menu for a while (items that don't fit collapse into a "☰" button revealing an expanded row); `ToolbarRenderer.ts` had no counterpart at all, so items that didn't fit in the web component's toolbar just silently clipped with no way to reach them. Ported the same measure-and-collapse algorithm onto plain DOM: hidden items are moved (not cloned) into a collapsible row, which keeps their existing click handlers intact.

Found via side-by-side QA comparing the same plugin configuration rendered through both integrations.
