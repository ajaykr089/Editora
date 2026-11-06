---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

New pre-definition stylesheet for server-rendered pages: `@editora/ui-core/preload.css` (also `PRELOAD_CSS` from `@editora/ui-core/preload`, and `<EditoraPreloadStyle />` from `@editora/ui-react` / `@editora/ui-react/server` for the document head). Until the custom elements are defined it gives each element the display it will have, hides what it will hide (closed dialogs and drawers, menu and popover content, raw `<option>`s, every tab panel but the first) and reserves the height of form controls, labels, tab strips and cards. On a test page the content below moved 155–223px when the scripts loaded; with the stylesheet it moves about 5px, with no flash of hidden content. Every rule is scoped to `:not(:defined)` inside `@layer editora-preload`, so it stops applying once an element upgrades and app styles override it. Also: `ui-tabs` no longer overwrites an `id` the author set on a panel.
