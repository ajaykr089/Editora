---
'@editora/ui-core': patch
---

`ui-empty-state` no longer makes up a description. Without one it showed "Try adjusting your filters or creating a new record." on every empty state, including ones with no filters (an empty inbox, a free day in a calendar). The line is now left out unless a `description` or a `slot="description"` is given.
