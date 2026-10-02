---
"@editora/citations": patch
---

Fix the Citations panel giving sighted users no feedback at all when "Insert Citation" fails validation (e.g. a missing Title) or succeeds. The panel already computed the right message ("Author and title are required.", "Citation inserted.", etc.) and wrote it into a `.rte-citations-live` region - but that element is the standard visually-hidden "sr-only" pattern, meant only for screen readers via `aria-live`. A sighted user who forgot to fill a required field and clicked Insert saw literally nothing happen, with no indication why. Found via live-browser testing. Fixed by also writing the same message into a new, visible status line (red for errors, green for success), while leaving the existing screen-reader announcement untouched.
