// block: A chat: transcript that follows streamed answers, and a composer with attachments.
import * as React from 'react';
import { Attachment, AttachmentGroup, Bubble, Button, InputGroup, Marker, Message, MessageScroller } from '@editora/ui-react';

export type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string; time?: string };

export type ChatBlockProps = {
  messages: ChatMessage[];
  /** True while an answer streams: holds screen-reader announcements and shows a status. */
  streaming?: boolean;
  onSend?: (text: string, files: File[]) => void;
  height?: number | string;
};

/**
 * A chat: the transcript (follows streamed answers, anchors each question near the top) and a
 * composer with attachments. Enter sends, Shift+Enter adds a line.
 */
export function ChatBlock({ messages, streaming = false, onSend, height = 560 }: ChatBlockProps) {
  const [text, setText] = React.useState('');
  const [files, setFiles] = React.useState<File[]>([]);
  const fileInput = React.useRef<HTMLInputElement>(null);
  const send = () => {
    const value = text.trim();
    if (!value && !files.length) return;
    onSend?.(value, files);
    setText('');
    setFiles([]);
  };
  return (
    <div style={{ display: 'grid', gridTemplateRows: 'minmax(0, 1fr) auto', gap: 12, height }}>
      <MessageScroller busy={streaming} label="Conversation">
        {messages.map((message) => (
          <Message
            key={message.id}
            message-id={message.id}
            scroll-anchor={message.role === 'user' ? '' : undefined}
            name={message.role === 'user' ? 'You' : 'Assistant'}
            time={message.time}
            align={message.role === 'user' ? 'end' : 'start'}
          >
            <Bubble variant={message.role === 'user' ? 'default' : 'ghost'}>{message.text}</Bubble>
          </Message>
        ))}
        {streaming ? <Marker live shimmer>Thinking…</Marker> : null}
      </MessageScroller>
      <InputGroup>
        {files.length ? (
          <div slot="top" style={{ width: '100%' }}>
            <AttachmentGroup aria-label="Files to send">
              {files.map((file, index) => (
                <Attachment key={`${file.name}-${index}`} name={file.name} type={file.type} bytes={file.size} size="sm" removable onRemove={() => setFiles((list) => list.filter((_, i) => i !== index))} />
              ))}
            </AttachmentGroup>
          </div>
        ) : null}
        <textarea
          aria-label="Message"
          placeholder="Ask anything…"
          value={text}
          rows={2}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              send();
            }
          }}
        />
        <div slot="bottom" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <input ref={fileInput} type="file" multiple hidden onChange={(event) => setFiles((list) => [...list, ...Array.from(event.target.files || [])])} />
          <Button size="sm" variant="ghost" onClick={() => fileInput.current?.click()}>Attach</Button>
          <Button size="sm" onClick={send} disabled={streaming}>Send</Button>
        </div>
      </InputGroup>
    </div>
  );
}

export default ChatBlock;
