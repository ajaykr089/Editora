---
"@editora/a11y-checker": patch
---

Fix the "Image missing alt text" rule's own one-click fix ("Add empty alt") never actually resolving the issue it fixes. The rule flagged an image as an error whenever `alt` was absent OR an empty string, but its `fix` action sets `alt=""` - so clicking "Add empty alt" always left the image in a state the rule itself still considered broken, and the checker (which auto-rescans after a fix) would re-flag the same image forever. `alt=""` is the correct, standard WCAG pattern for marking an image decorative (the rule already exempts `role="presentation"` for the same reason), so it should never have been treated as an error in the first place. Found via live testing: clicking "Add empty alt" then reopening the checker still showed the same error. Fixed by only flagging a genuinely missing `alt` attribute; verified live that applying the fix now brings the score to 100/100.
