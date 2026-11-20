---
"@editora/ui-sortable": minor
---

Make your own markup sortable: `@editora/ui-sortable/headless` and `@editora/ui-sortable/headless/react`.

- **`createSortable(element, options)`** adds drag-and-drop to the children of an element you render: the mouse (a copy follows the pointer while the others slide aside; Escape cancels), touch (a short press lifts an item, so a swipe still scrolls), the keyboard (Space, arrows, Home/End, Space; Escape cancels) with screen-reader announcements, lists, rows and grids, lists with the same `group` exchanging items (also by keyboard, with the cross arrows), auto-scroll near the edges of a scrolling list or the window, a `handle`, `canMove` to refuse a move, and `revert` for frameworks that own the DOM. A click is still a click, and a press in a field or a link inside an item is left alone. It returns `toArray()`, `sort(ids)`, `update(options)` and `destroy()`. No stylesheet and no ui-core: about 5 KB gzipped.
- **`useSortable({ items, onChange })`** for React: a `ref` for the list, and `onChange` with the reordered array. Lists of a group each keep their own state; a move between them calls both `onChange`s. React 16.8 to 19, StrictMode, server rendering.
- **`moveItem`, `moveBetween`, `applySortEvent`** reorder plain arrays.
- **The typings are generated from the source** (they were written by hand). Every name and type of the hand-written ones is unchanged, checked both ways.
