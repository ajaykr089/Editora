---
"@editora/core": patch
---

Add `language` and `custom` to the `StatusInfo` typing. `StatusBar` has always accepted and rendered both (a language label after the cursor position, and extra `name: value` items after the counts), but the hand-written `index.d.ts` did not declare them, so passing either was a type error.
