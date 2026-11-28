---
title: "Announcer"
description: "Screen-reader announcements: the announce() function and the declarative Announcer component."
sidebar_label: "Announcer"
---

# Announcer

Some changes are only visible: "3 results", "Saved", "Connection lost". `announce()` tells screen-reader users too.

## Try it

```tsx live
function Example() {
  const [count, setCount] = React.useState(0);
  return (
    <ThemeProvider>
      <Flex style={{ gap: 8, alignItems: 'center' }}>
        <Button onClick={() => setCount((value) => value + 1)}>Add a result</Button>
        <Button variant="secondary" onClick={() => announce('Saved')}>announce("Saved")</Button>
        <span>{count} results</span>
        <Announcer quiet>{`${count} results`}</Announcer>
      </Flex>
    </ThemeProvider>
  );
}
```

```tsx
import { announce } from '@editora/ui-react'; // or '@editora/ui-core'

announce('3 results');
announce('Connection lost', { politeness: 'assertive' });
```

Or declaratively: `Announcer` announces its text whenever it changes and shows nothing.

```tsx
import { Announcer } from '@editora/ui-react';

<Announcer>{count} results</Announcer>
<Announcer politeness="assertive" quiet>{error}</Announcer>
```

## How it works

- Messages go to two visually hidden live regions (polite and assertive) in the light DOM of `document.body`, created on first use and shared. Live regions inside shadow roots are not announced by every screen reader.
- A region must exist before its text changes to be announced, so the first message waits about 150 ms; the same message twice is announced twice.
- Text is cleared after 7 seconds (`clearAfter`) so it is not found later when browsing.
- While a modal dialog is open, the rest of the page is inert and some screen readers ignore live regions outside it. `Announcer` inside an open `<dialog>` announces inside it; with the function, pass `{ within: dialogElement }`.

| Option / prop | Values | Default |
| --- | --- | --- |
| `politeness` | `polite` `assertive` (`off` on `Announcer`) | `polite` |
| `clearAfter` | ms, 0 to keep | `7000` |
| `within` | element to announce in | `document.body` |
| `quiet` (`Announcer`) | do not announce the text present on mount | `false` |

See the [API reference](../api/announcer).
