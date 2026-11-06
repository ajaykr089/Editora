---
'@editora/ui-core': patch
---

Card: `Card.Inset` written after `Card.Header` now renders below the header (between the header and the body). It used to be fixed above the header, so a header followed by a full-bleed table showed the table first. An inset written first still sits at the top.
