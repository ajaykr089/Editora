---
'@editora/ui-core': patch
---

`ui-transfer-list` stacks its two lists and the move buttons when the list itself is narrower than 560px, not when the window is narrower than 760px. In a narrow card on a wide screen, the three columns were squeezed to a few characters each and the labels overlapped.
