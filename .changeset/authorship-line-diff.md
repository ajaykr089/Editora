---
'@editora/authorship': patch
---

Text from a change that touched several paragraphs at once (an accepted set of AI suggestions, a remote edit) no longer mislabels the end of an unchanged paragraph: when an inserted paragraph ended with the same characters as the one before it, the diff split the unchanged paragraph and gave its last characters the wrong origin.
