---
'@editora/ui-core': patch
---

`ui-card` without a header (or media) pads the top of its content like every other side. The header section is always first in the shadow tree, even when hidden, so the `.body:first-child` rule never matched and the content touched the top edge.
