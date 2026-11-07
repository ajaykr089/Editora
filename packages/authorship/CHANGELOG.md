# @editora/authorship

## 0.1.1

### Patch Changes

- a4e2f2c: Text from a change that touched several paragraphs at once (an accepted set of AI suggestions, a remote edit) no longer mislabels the end of an unchanged paragraph: when an inserted paragraph ended with the same characters as the one before it, the diff split the unchanged paragraph and gave its last characters the wrong origin.

## 0.1.0

### Minor Changes

- c8aff5f: New package `@editora/authorship`: record where every piece of text came from (typed, pasted with its source app, AI with its model, collaborator, editor tool, external), highlight it, replay the writing, export annotated HTML, and verify records with a witness server that only sees hashes.

  `@editora/ai-review` suggestion marks now carry `data-provenance="ai"` with the model and provider, and `@editora/collaboration` announces remote edits with a `provenance:expect` event, so authorship recorders label that text without extra code.
