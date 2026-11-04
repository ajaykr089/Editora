# @editora/authorship

## 0.1.0

### Minor Changes

- c8aff5f: New package `@editora/authorship`: record where every piece of text came from (typed, pasted with its source app, AI with its model, collaborator, editor tool, external), highlight it, replay the writing, export annotated HTML, and verify records with a witness server that only sees hashes.

  `@editora/ai-review` suggestion marks now carry `data-provenance="ai"` with the model and provider, and `@editora/collaboration` announces remote edits with a `provenance:expect` event, so authorship recorders label that text without extra code.
