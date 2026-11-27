import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Attachment,
  AttachmentGroup,
  Box,
  Bubble,
  BubbleGroup,
  Button,
  InputGroup,
  Marker,
  Message,
  MessageScroller,
  Trace,
  TraceItem,
} from '@editora/ui-react';

const meta: Meta<typeof Message> = {
  title: 'UI/Chat',
  component: Message,
};
export default meta;
type Story = StoryObj<typeof Message>;

export const Conversation: Story = {
  render: () => (
    <Box style={{ height: 520, maxWidth: 680, border: '1px solid var(--ui-color-border, #e2e8f0)', borderRadius: 12 }}>
      <MessageScroller label="Conversation">
        <Marker variant="separator">Today</Marker>
        <Message name="You" time="10:40" align="end" scroll-anchor="" message-id="u1">
          <Bubble>Can you check why the build fails?</Bubble>
        </Message>
        <Message name="Agent" time="10:41" message-id="a1">
          <Trace label="Agent activity">
            <TraceItem label="Read package.json" description="42 lines" />
            <TraceItem label="Searched the CI logs" description="3 matches">
              <TraceItem label="ci.log, line 120: engine node >= 20.19 required" />
            </TraceItem>
            <TraceItem label="Failed to run pnpm build" status="error" />
          </Trace>
          <Bubble variant="ghost">
            The build fails because Vite 7 needs Node 20.19 or later, and CI runs Node 18. Upgrade the Node version in the workflow.
          </Bubble>
          <div slot="footer">
            <Button size="sm" variant="ghost">Copy</Button>
            <Button size="sm" variant="ghost">Retry</Button>
          </div>
        </Message>
        <Message name="You" time="10:43" align="end" scroll-anchor="" message-id="u2">
          <BubbleGroup>
            <Bubble>Thanks!</Bubble>
            <Bubble variant="tinted">
              Can you open the PR?
              <span slot="reactions" role="img" aria-label="1 person reacted with thumbs up">👍 1</span>
            </Bubble>
          </BubbleGroup>
        </Message>
        <Marker live shimmer>Opening the pull request…</Marker>
      </MessageScroller>
    </Box>
  ),
};

export const BubbleVariants: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 10, maxWidth: 560 }}>
      <Bubble>Default</Bubble>
      <Bubble variant="secondary">Secondary</Bubble>
      <Bubble variant="muted">Muted</Bubble>
      <Bubble variant="tinted">Tinted</Bubble>
      <Bubble variant="outline">Outline</Bubble>
      <Bubble variant="ghost">Ghost: unframed, full width, for assistant answers.</Bubble>
      <Bubble variant="destructive">Failed to send the message. Check your connection.</Bubble>
      <Bubble href="#suggest" variant="outline">Suggestion: show me the logs</Bubble>
    </Box>
  ),
};

export const Streaming: Story = {
  render: function Render() {
    const [text, setText] = React.useState('');
    const [running, setRunning] = React.useState(false);
    React.useEffect(() => {
      if (!running) return undefined;
      const words = 'The answer streams in word by word while the view follows it to the end. Scroll up and it stops following; the button brings you back. '.repeat(6).split(' ');
      let i = 0;
      const timer = setInterval(() => {
        i += 1;
        setText(words.slice(0, i).join(' '));
        if (i >= words.length) {
          clearInterval(timer);
          setRunning(false);
        }
      }, 40);
      return () => clearInterval(timer);
    }, [running]);
    return (
      <Box style={{ display: 'grid', gap: 10, maxWidth: 620 }}>
        <Button onClick={() => { setText(''); setRunning(true); }} disabled={running}>Stream a reply</Button>
        <Box style={{ height: 300, border: '1px solid var(--ui-color-border, #e2e8f0)', borderRadius: 12 }}>
          <MessageScroller busy={running}>
            <Message name="You" align="end" scroll-anchor="">
              <Bubble>Explain how the scroller follows output.</Bubble>
            </Message>
            <Message name="Agent">
              <Bubble variant="ghost">{text || '…'}</Bubble>
            </Message>
          </MessageScroller>
        </Box>
      </Box>
    );
  },
};

export const Attachments: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 16, maxWidth: 680 }}>
      <AttachmentGroup aria-label="Attached files">
        <Attachment name="report.pdf" bytes={482133} removable />
        <Attachment name="data.csv" state="uploading" progress={45} />
        <Attachment name="model.bin" state="processing" />
        <Attachment name="big.zip" state="error" description="File is over 25 MB" />
      </AttachmentGroup>
      <Box style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Attachment name="photo.jpg" orientation="vertical" href="#photo">
          <img
            slot="media"
            alt=""
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='120'%3E%3Crect width='160' height='120' fill='%2393c5fd'/%3E%3C/svg%3E"
          />
        </Attachment>
        <Attachment name="notes.md" size="sm" />
        <Attachment name="main.ts" size="xs" />
      </Box>
    </Box>
  ),
};

export const ComposerWithAttachments: Story = {
  render: () => (
    <Box style={{ maxWidth: 620 }}>
      <InputGroup>
        <div slot="top" style={{ width: '100%' }}>
          <AttachmentGroup aria-label="Files to send">
            <Attachment name="screenshot.png" size="sm" removable />
          </AttachmentGroup>
        </div>
        <textarea aria-label="Message" placeholder="Ask anything…" />
        <div slot="bottom" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Button size="sm">Send</Button>
        </div>
      </InputGroup>
    </Box>
  ),
};

export const TraceStates: Story = {
  render: () => (
    <Box style={{ maxWidth: 520 }}>
      <Trace label="Agent activity">
        <TraceItem label="Read 3 files" description="0.4 s" />
        <TraceItem label="Running the test suite" status="running" />
        <TraceItem label="Failed to run pnpm build" status="error" description="exit code 1" />
        <TraceItem label="Open a pull request" status="pending" />
        <TraceItem label="Searched the web" description="6 sources" defaultOpen>
          <TraceItem label="vitejs.dev, Node support" href="#vite" />
          <TraceItem label="nodejs.org, release schedule" href="#node" />
        </TraceItem>
      </Trace>
    </Box>
  ),
};
