---
"@editora/ui-core": minor
"@editora/ui-react": minor
---

New components, so nothing that shadcn/ui or Radix offers is missing:

- Typography and helpers: `Spinner`, `Heading`, `Text`, `Prose` (styles rich HTML such as editor output), `AccessibleIcon`, and `Announcer` with an `announce()` function for screen-reader announcements.
- Controls and layout: `ButtonGroup`, `InputGroup` (addons, and toolbars above or below a textarea), `NativeSelect` (a styled native select that stays in your form), `Item` and `ItemGroup` (list rows).
- Chat and agent UI: `Message`, `Bubble`, `BubbleGroup`, `Marker`, `MessageScroller` (follows streamed output, anchors new turns, keeps your place when history loads), `Attachment`, `AttachmentGroup`, `Trace`, `TraceItem`, `Question` and `Questionnaire`.
- `ui-kbd`, `ui-code-block` and `ui-carousel` custom elements in `@editora/ui-core` for apps without React (the React `Kbd`, `CodeBlock` and `Carousel` are unchanged).

`Button` accepts `variant="outline"`, `"soft"`, `"surface"` (the looks `recipe` already had) and a new `"link"`. Before, `variant="outline"` silently rendered a solid button.

The simple wrappers are hook-free and also exported from `@editora/ui-react/server`.
