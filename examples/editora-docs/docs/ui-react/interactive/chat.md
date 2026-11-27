---
title: Chat components
description: Message, Bubble, Marker, MessageScroller, Attachment, Trace and Questionnaire: the parts of a chat or agent UI.
sidebar_label: Chat components
---

# Chat components

:::info New in @editora/ui-react 0.7.0 and @editora/ui-core 0.7.0
:::

These components build a conversation UI: a human chat, or an AI agent that thinks, calls tools and asks questions. They handle the hard parts (scrolling while text streams, announcing new messages to screen readers, upload states) and leave messages, transport and model state to you.

```tsx
import {
  Attachment, Bubble, BubbleGroup, Marker, Message, MessageScroller, Trace, TraceItem,
} from '@editora/ui-react';

<div style={{ height: 480 }}>
  <MessageScroller busy={streaming}>
    <Marker variant="separator">Today</Marker>
    <Message name="You" time="10:40" align="end" scroll-anchor="" message-id="u1">
      <Bubble>Why does the build fail?</Bubble>
    </Message>
    <Message name="Agent" time="10:41" message-id="a1">
      <Trace label="Agent activity">
        <TraceItem label="Read package.json" description="42 lines" />
        <TraceItem label="Running the test suite" status="running" />
      </Trace>
      <Bubble variant="ghost">{answer}</Bubble>
    </Message>
    <Marker live shimmer>Thinking…</Marker>
  </MessageScroller>
</div>
```

## Message

One message: avatar (`slot="avatar"`), sender and time, the content, and a footer (`slot="footer"`) for actions or delivery state. The host is an `article` named "Ada, 10:42", so screen-reader users can move message by message. `align="end"` mirrors it for the current user. `grouped` marks a follow-up from the same sender (no repeated avatar or header). `footerVisibility="hover"` shows footer actions on hover and focus only. [API](../api/message)

## Bubble and BubbleGroup

The framed surface of a message. Variants: `default` (strong primary, usually the current user), `secondary`, `muted`, `tinted`, `outline`, `ghost` (no frame, full width, for assistant answers) and `destructive` (an error; keep the reason in the text). It takes its side from the enclosing `Message`. `href` makes it a link (a suggestion chip). `slot="reactions"` sits on the bottom edge: give the group `role="img"` and an `aria-label` ("2 people reacted with thumbs up"), or make each reaction a button. `BubbleGroup` stacks consecutive bubbles from one sender. [API](../api/bubble)

## Marker

An inline line that is not a message: a status update, a system note, a date divider. Presentational by default; `live` makes it a status so its text changes are announced. Do not give a labelled separator `role="separator"` (that role is named from `aria-label` only, so its text would not be read). Variants: `default`, `border`, `separator`; `shimmer` animates the text (off under reduced motion). [API](../api/marker)

## MessageScroller

The transcript's scroll container. Give its parent a height.

- Opens at the end (`initialScroll`: `end`, `start`, `last-anchor`), hidden for one frame until the position is applied, so it never flashes at the top.
- **Follows output**: at the end, a growing reply keeps the view at the bottom. Wheel, touch, scroll keys, dragging the scrollbar or jumping to a message releases it; new content then arrives without moving the reader. Scrolling back to the end, the "Jump to latest" button or `scrollToEnd()` resumes it.
- **Anchors turns**: mark the first message of each turn `scroll-anchor`. When one is added it is scrolled near the top (`anchorPeek` px of the previous message, default 24) and the answer streams in under it; once the answer outgrows the view, following takes over.
- **Keeps the reader's place** when older messages are added above. `onReachStart` fires near the top: load history there.
- The viewport is a focusable region (`label`, default "Messages") and the content a `log` that announces new messages, not every streamed token. Set `busy` while a reply streams to hold announcements until it is complete.

The ref is the element: `scrollToEnd()`, `scrollToStart()`, `scrollToMessage(id)` (by `message-id`, `data-message-id` or `id`), and `following`, `atEnd`, `atStart`. [API](../api/message-scroller)

## Attachment and AttachmentGroup

```tsx
<AttachmentGroup aria-label="Attached files">
  <Attachment name="report.pdf" bytes={482133} removable onRemove={({ name }) => remove(name)} />
  <Attachment name="data.csv" state="uploading" progress={45} />
  <Attachment name="big.zip" state="error" description="File is over 25 MB" />
  <Attachment name="photo.jpg" orientation="vertical" href="/files/photo.jpg">
    <img slot="media" src="/thumbs/photo.jpg" alt="" />
  </Attachment>
</AttachmentGroup>
```

Without media it shows an icon for the file kind (from `type` or the extension). The description is `description`, else kind and size ("PDF · 471 KB"), else the state ("Uploading 45%"). States: `idle`, `uploading` (progress bar, indeterminate without `progress`), `processing`, `error`, `done`. With `href` the whole card is a link ("Open photo.jpg") and actions stay separate buttons on top of it. `AttachmentGroup` is a scrolling, snapping row with edge fades; when its items take no focus, the row itself does, so keyboard users can scroll it. [API](../api/attachment)

## Trace and TraceItem

An agent's steps: thoughts, tool calls, searches, plan steps. A `TraceItem` with children is a button that expands them (`open`/`defaultOpen`/`onOpenChange`); with `href` it is a link; otherwise plain text and no tab stop. `status`: `running` (shimmer), `pending`, `error`, unset for done. Write titles as sentences that say what happened ("Failed to run pnpm build"); the status is also spoken (", in progress"), not only shown by colour. [API](../api/trace-item)

## Questionnaire

See [Questionnaire](./questionnaire).
