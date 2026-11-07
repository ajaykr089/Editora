---
'@editora/ui-core': patch
---

Select and Combobox mark their light-DOM `<option>` children `aria-hidden` (they are only the data the list renders from), so WebKit's accessibility tree, Playwright and Testing Library see each option once instead of twice.
