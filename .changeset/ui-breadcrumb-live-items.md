---
'@editora/ui-core': patch
---

`ui-breadcrumb`: a crumb whose text or link changes after the breadcrumb is on the page is redrawn. A React page that rendered `<Breadcrumb.Item>{customer?.name ?? id}</Breadcrumb.Item>` kept showing the id after the name loaded, because only added or removed items were noticed.
