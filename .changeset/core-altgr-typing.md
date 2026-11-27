---
'@editora/core': patch
---

AltGr types its characters again on Windows and Linux. Since 1.1.2 a shortcut could match the key cap instead of the character, so on a German keyboard AltGr+7 (`{`) ran the paragraph shortcut (Ctrl+Alt+7) and AltGr+E (`€`) the code block one, and the character was never typed.
