import * as React from 'react';
import '@editora/ui-core/message-scroller';
import {
  createUIElement,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
} from './_internals';

type ScrollOptions = { behavior?: ScrollBehavior };

/** The element behind a MessageScroller ref. */
export type MessageScrollerElement = HTMLElement & {
  readonly following: boolean;
  readonly atEnd: boolean;
  readonly atStart: boolean;
  scrollToEnd(options?: ScrollOptions): void;
  scrollToStart(options?: ScrollOptions): void;
  /** Returns false when no child has that message-id / data-message-id / id. */
  scrollToMessage(id: string, options?: ScrollOptions & { block?: 'start' | 'center' | 'end' }): boolean;
};

export type MessageScrollerProps = React.HTMLAttributes<HTMLElement> & {
  /** Names the scrollable region (default "Messages"). */
  label?: string;
  /** Hold screen-reader announcements while a reply streams. */
  busy?: boolean;
  /** Do not follow new content at the end. */
  autoScroll?: boolean;
  initialScroll?: 'end' | 'start' | 'last-anchor';
  /** Pixels of the previous message kept visible above a new turn. */
  anchorPeek?: number;
  jumpLabel?: string;
  hideJumpButton?: boolean;
  /** Messages sit at the top instead of the bottom while the transcript is short. */
  alignTop?: boolean;
  onFollowChange?: (following: boolean) => void;
  /** The reader is near the top: load older messages. */
  onReachStart?: () => void;
};

/**
 * Scroll container for a chat transcript: follows streamed output, anchors new turns, keeps the
 * reader's place when history loads above. Mark the first message of each turn with
 * `scroll-anchor` (e.g. `<Message scroll-anchor="" />`) and give messages a `message-id`.
 */
export const MessageScroller = React.forwardRef<MessageScrollerElement, MessageScrollerProps>(function MessageScroller(props, forwardedRef) {
  const { label, busy, autoScroll, initialScroll, anchorPeek, jumpLabel, hideJumpButton, alignTop, onFollowChange, onReachStart, children, ...rest } = props;
  const ref = React.useRef<MessageScrollerElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as MessageScrollerElement);

  const handleFollow = React.useCallback((event: Event) => {
    onFollowChange?.(!!(event as CustomEvent<{ following: boolean }>).detail?.following);
  }, [onFollowChange]);
  const handleReachStart = React.useCallback(() => onReachStart?.(), [onReachStart]);
  useElementEventListeners(ref, [
    { type: 'follow-change', listener: handleFollow },
    { type: 'reach-start', listener: handleReachStart },
  ], [handleFollow, handleReachStart], { hostOnly: true });

  // Opening position is read when the element first renders, so it is a plain attribute.
  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'label', label ?? null);
    syncBooleanAttribute(el, 'busy', busy);
    syncBooleanAttribute(el, 'no-auto-scroll', autoScroll === false);
    syncStringAttribute(el, 'anchor-peek', anchorPeek != null ? String(anchorPeek) : null);
    syncStringAttribute(el, 'jump-label', jumpLabel ?? null);
    syncBooleanAttribute(el, 'no-jump-button', hideJumpButton);
    syncBooleanAttribute(el, 'align-top', alignTop);
  }, [label, busy, autoScroll, anchorPeek, jumpLabel, hideJumpButton, alignTop]);

  return createUIElement('ui-message-scroller', { ref, 'initial-scroll': initialScroll, ...rest }, children);
});
MessageScroller.displayName = 'MessageScroller';

export default MessageScroller;
