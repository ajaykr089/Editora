---
'@editora/ui-core': patch
---

`ui-file-upload`: a file's Retry button uploads only that file; it used to restart every failed or pending file. New `retryUpload(file)` does the same from code, and the Retry button is labelled with the file name for screen readers.
