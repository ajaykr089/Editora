---
'@editora/ai-review': patch
'@editora/paste-cleaner': patch
'@editora/content-a11y': patch
---

Typings now resolve in TypeScript projects that use `moduleResolution: "NodeNext"` or `"node16"` (they failed with TS2834 because relative imports had no file extension).
