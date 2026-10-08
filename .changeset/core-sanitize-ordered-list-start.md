---
"@editora/core": patch
---

Keep the `start` and `reversed` attributes of an ordered list when sanitising. They were not on the default attribute allowlist, so a list that continues from 5 (`<ol start="5">`) came back as `1.`, `2.` after any sanitised edit, paste or load, silently renumbering the document.

Found while checking that the markdown editor's lists survive a round trip: `5. five` / `6. six` loaded into the editor as `1.` / `2.`.
