---
"@editora/ui-core": patch
---

Three `ui-slider` thumb styles now apply in Chrome, Edge and Safari: the slight grow while a handle is pressed, the reduced-motion rule (which also stopped the slider's own transitions), and the forced-colors (Windows High Contrast) thumb colour. Each rule listed the Chromium/Safari and the Firefox thumb pseudo-elements together, and Chromium and WebKit drop a whole rule when one selector in it is unknown to them, so only Firefox ever used these rules.
