import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';

/**
 * One message in a conversation: avatar, sender and time, the content (bubbles, text, cards) and
 * a footer for actions or delivery state.
 *
 *   <ui-message name="Ada" time="10:42">
 *     <img slot="avatar" src="ada.png" alt="" />
 *     …bubbles or text…
 *     <div slot="footer">…copy, retry, thumbs…</div>
 *   </ui-message>
 *
 * The host is an `article` named by sender and time ("Ada, 10:42"), so screen-reader users can
 * jump message to message. `align="end"` mirrors the layout for the current user's messages;
 * bubbles inside follow it. `grouped` marks a follow-up from the same sender: the avatar keeps its
 * space but is hidden, and the header is not repeated. Slots: `avatar`, `header` (replaces the
 * name/time line), default (content), `footer`. Attributes: `name`, `time` (shown as given),
 * `datetime` (machine-readable, for the time element), `align` (start | end), `grouped`,
 * `footer-visibility` (always | hover: footer actions appear on hover and focus).
 */
const style = `
  :host {
    --ui-message-gap: 10px;
    --ui-message-avatar-size: 32px;
    --ui-message-max-width: 100%;
    --ui-message-name: var(--ui-color-text-strong, var(--ui-color-text, #0f172a));
    --ui-message-meta: var(--ui-color-muted, #526175);
    color-scheme: light dark;
    display: block;
    min-inline-size: 0;
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
  }

  :host([hidden]) { display: none; }

  .message {
    display: flex;
    align-items: flex-start;
    gap: var(--ui-message-gap);
    min-inline-size: 0;
  }
  :host([align="end"]) .message { flex-direction: row-reverse; }

  .avatar {
    flex: none;
    display: flex;
    inline-size: var(--ui-message-avatar-size);
    block-size: var(--ui-message-avatar-size);
    overflow: hidden;
    border-radius: 999px;
  }
  .avatar[data-empty] { display: none; }
  :host([grouped]) .avatar { visibility: hidden; block-size: 0; }
  ::slotted([slot="avatar"]) {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }

  .body {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-inline-size: 0;
    max-inline-size: var(--ui-message-max-width);
  }
  :host([align="end"]) .body { align-items: flex-end; }

  .header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-inline-size: 0;
    font-size: var(--ui-font-size-sm, 0.8125rem);
    line-height: 1.4;
  }
  .header[data-empty] { display: none; }
  :host([grouped]) .header { display: none; }
  :host([align="end"]) .header { flex-direction: row-reverse; }

  .name {
    color: var(--ui-message-name);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  time, .time {
    color: var(--ui-message-meta);
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
  }

  .content {
    display: flex;
    flex-direction: column;
    /* Full width even when the body aligns to the end, so bubbles measure their cap against it. */
    align-self: stretch;
    gap: 4px;
    min-inline-size: 0;
    max-inline-size: 100%;
    color: var(--ui-color-text, #0f172a);
    font-size: var(--ui-font-size-md, 0.875rem);
    line-height: 1.55;
    overflow-wrap: anywhere;
  }
  :host([align="end"]) .content { align-items: flex-end; }

  .footer {
    display: flex;
    align-items: center;
    gap: 4px;
    min-block-size: 24px;
    color: var(--ui-message-meta);
    font-size: 0.75rem;
  }
  .footer[data-empty] { display: none; }
  :host([footer-visibility="hover"]) .footer { opacity: 0; transition: opacity 120ms ease; }
  :host([footer-visibility="hover"]:hover) .footer,
  :host([footer-visibility="hover"]:focus-within) .footer { opacity: 1; }
  @media (hover: none) { :host([footer-visibility="hover"]) .footer { opacity: 1; } }
`;

export class UIMessage extends ElementBase {
  static get observedAttributes() {
    return ['name', 'time', 'datetime', 'align', 'grouped'];
  }

  constructor() {
    super();
    this.root.addEventListener('slotchange', () => this.syncSlots());
  }

  override connectedCallback(): void {
    this.syncSemantics();
    super.connectedCallback();
  }

  protected override shouldRenderOnAttributeChange(name: string): boolean {
    this.syncSemantics();
    if (name === 'align') {
      // Bubbles that follow the message's side re-read it.
      for (const bubble of Array.from(this.querySelectorAll('ui-bubble'))) (bubble as HTMLElement & { syncAlign?: () => void }).syncAlign?.();
    }
    return name !== 'align' && name !== 'grouped';
  }

  private syncSemantics(): void {
    if (!this.hasAttribute('role') || this.hasAttribute('data-auto-role')) {
      this.setAttribute('role', 'article');
      this.setAttribute('data-auto-role', '');
    }
    const name = (this.getAttribute('name') || '').trim();
    const time = (this.getAttribute('time') || '').trim();
    const label = [name, time].filter(Boolean).join(', ');
    // Only name the article when the app has not; an aria-labelledby of its own wins.
    if (label && !this.hasAttribute('aria-labelledby')) {
      this.setAttribute('aria-label', label);
      this.setAttribute('data-auto-label', '');
    } else if (this.hasAttribute('data-auto-label')) {
      this.removeAttribute('aria-label');
      this.removeAttribute('data-auto-label');
    }
  }

  private syncSlots(): void {
    for (const name of ['avatar', 'header', 'footer']) {
      const slot = this.root.querySelector(`slot[name="${name}"]`) as HTMLSlotElement | null;
      const wrapper = this.root.querySelector(`.${name}`) as HTMLElement | null;
      if (!slot || !wrapper) continue;
      const fallback = name === 'header' && !!(this.getAttribute('name') || this.getAttribute('time'));
      const filled = fallback || slot.assignedNodes({ flatten: true }).some((node) => node.nodeType === 1 || (node.textContent || '').trim());
      wrapper.toggleAttribute('data-empty', !filled);
    }
  }

  protected override render(): void {
    const name = this.getAttribute('name') || '';
    const time = this.getAttribute('time') || '';
    const datetime = this.getAttribute('datetime');
    const timeHtml = time
      ? datetime
        ? `<time part="time" datetime="${escapeHtml(datetime)}">${escapeHtml(time)}</time>`
        : `<span class="time" part="time">${escapeHtml(time)}</span>`
      : '';
    this.setContent(`
      <style>${style}</style>
      <div class="message" part="message">
        <span class="avatar" part="avatar" aria-hidden="true"><slot name="avatar"></slot></span>
        <div class="body" part="body">
          <div class="header" part="header">
            <slot name="header">${name ? `<span class="name" part="name">${escapeHtml(name)}</span>` : ''}${timeHtml}</slot>
          </div>
          <div class="content" part="content"><slot></slot></div>
          <div class="footer" part="footer"><slot name="footer"></slot></div>
        </div>
      </div>
    `);
    this.syncSlots();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-message')) {
  customElements.define('ui-message', UIMessage);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-message': UIMessage;
  }
}
