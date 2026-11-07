---
"@editora/ui-core": patch
---

Preload styles: a `ui-tabs` with a server-rendered `selected` (1 to 9) shows that panel before the element is defined, not the first one.
