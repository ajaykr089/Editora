---
'@editora/core': patch
---

The web component's toolbar no longer cuts its last visible button in half. Working out which buttons fit, it added up their widths but left out the space between `|` groups, so on a toolbar with several groups the last button it kept ran under the "more" button. It now measures where each button really ends, and shows every button with no "more" button when they all fit.
