---
'@editora/docx': patch
---

Typings now resolve in TypeScript projects that use `moduleResolution: "NodeNext"` or `"node16"` (they failed with TS2834 because relative imports had no file extension).
