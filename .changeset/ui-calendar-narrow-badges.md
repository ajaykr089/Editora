---
'@editora/ui-core': patch
---

`ui-calendar`: with `events-display="badges"`, a day cell too narrow for a readable label (84px or less) shows each event as a coloured dot instead of a cut-off stub ("Sup…", "S… P…"). Wider calendars keep the labels.
