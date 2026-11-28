---
"@editora/ui-core": patch
---

Headless toaster: closing a toast from under a still pointer no longer leaves the next toast paused forever. The region shrank without a `pointerleave`, so the hover pause never ended; the controller now re-reads hover and focus when a toast is added, and ends the hover pause when the last toast goes.
