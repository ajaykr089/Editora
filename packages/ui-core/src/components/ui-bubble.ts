import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';

/**
 * The framed surface of a chat message: text, a short structured answer, a quoted reply, a
 * suggestion, with an optional row of reactions on its edge.
 *
 *   <ui-bubble>Can you check the build?</ui-bubble>
 *   <ui-bubble variant="ghost">…assistant answer, full width, unframed…</ui-bubble>
 *   <ui-bubble variant="destructive">Failed to send. <a href="#">Retry</a></ui-bubble>
 *
 * A presentational surface: conversation semantics (article, log) belong on the message and the
 * scroller around it. Variants: default (strong primary, usually the current user), secondary
 * (neutral), muted, tinted (subtle primary), outline, ghost (no frame, full width, for assistant
 * text), destructive (an error; keep the reason in the text). `align` (start | end) comes from an
 * enclosing message with align="end" when not set. `href` makes the whole bubble a link (a
 * suggestion chip). The `reactions` slot sits on the bottom edge (`reactions-side="top"` for the
 * top edge, `reactions-align` start | end); give a reactions group role="img" and an aria-label
 * ("2 people reacted with thumbs up"), or make each reaction a button.
 */
const style = `
  :host {
    --ui-bubble-bg: var(--ui-color-primary, #2563eb);
    --ui-bubble-color: var(--ui-color-foreground-on-primary, #ffffff);
    --ui-bubble-border: transparent;
    --ui-bubble-radius: 16px;
    --ui-bubble-tail-radius: 6px;
    --ui-bubble-pad: 8px 12px;
    --ui-bubble-max-width: min(80%, 42rem);
    color-scheme: light dark;
    display: flex;
    min-inline-size: 0;
    max-inline-size: 100%;
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
  }

  :host([hidden]) { display: none; }
  :host([data-align="end"]) { justify-content: flex-end; }

  :host([variant="secondary"]) {
    --ui-bubble-bg: var(--ui-color-fill, color-mix(in srgb, var(--ui-color-text, #0f172a) 8%, var(--ui-color-surface, #ffffff)));
    --ui-bubble-color: var(--ui-color-text, #0f172a);
  }
  :host([variant="muted"]) {
    --ui-bubble-bg: var(--ui-color-surface-alt, color-mix(in srgb, var(--ui-color-text, #0f172a) 4%, var(--ui-color-surface, #ffffff)));
    --ui-bubble-color: var(--ui-color-text-secondary, var(--ui-color-muted, #475569));
  }
  :host([variant="tinted"]) {
    --ui-bubble-bg: var(--ui-color-accent-subtle, color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, var(--ui-color-surface, #ffffff)));
    --ui-bubble-color: var(--ui-color-text, #0f172a);
  }
  :host([variant="outline"]) {
    --ui-bubble-bg: transparent;
    --ui-bubble-color: var(--ui-color-text, #0f172a);
    --ui-bubble-border: var(--ui-color-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 16%, transparent));
  }
  :host([variant="ghost"]) {
    --ui-bubble-bg: transparent;
    --ui-bubble-color: var(--ui-color-text, #0f172a);
    --ui-bubble-pad: 0;
    --ui-bubble-max-width: 100%;
  }
  :host([variant="destructive"]) {
    --ui-bubble-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 10%, var(--ui-color-surface, #ffffff));
    --ui-bubble-color: var(--ui-color-danger-text, var(--ui-color-danger, #b91c1c));
    --ui-bubble-border: color-mix(in srgb, var(--ui-color-danger, #dc2626) 35%, transparent);
  }
  :host([variant="ghost"]) { flex: 1 1 auto; }

  .bubble {
    position: relative;
    box-sizing: border-box;
    max-inline-size: var(--ui-bubble-max-width);
    min-inline-size: 0;
    padding: var(--ui-bubble-pad);
    border: 1px solid var(--ui-bubble-border);
    border-radius: var(--ui-bubble-radius);
    background: var(--ui-bubble-bg);
    color: var(--ui-bubble-color);
    font-size: var(--ui-font-size-md, 0.875rem);
    line-height: 1.55;
    overflow-wrap: anywhere;
    text-decoration: none;
  }
  :host([variant="ghost"]) .bubble { inline-size: 100%; }
  :host([data-align="start"]:not([variant="ghost"])) .bubble { border-end-start-radius: var(--ui-bubble-tail-radius); }
  :host([data-align="end"]:not([variant="ghost"])) .bubble { border-end-end-radius: var(--ui-bubble-tail-radius); }
  :host([data-has-reactions]) .bubble { margin-block-end: 14px; }
  :host([data-has-reactions][reactions-side="top"]) .bubble { margin-block: 14px 0; }

  ::slotted(a) { color: inherit; text-decoration: underline; }
  ::slotted(p) { margin: 0; }
  ::slotted(p:not(:last-child)) { margin-block-end: 0.5em; }

  a.bubble { cursor: pointer; }
  a.bubble:hover { filter: brightness(0.97); }
  a.bubble:focus-visible {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: 2px;
  }

  .reactions {
    position: absolute;
    inset-block-end: -14px;
    inset-inline-end: 8px;
    display: flex;
    gap: 2px;
    padding: 1px 4px;
    border: 1px solid var(--ui-color-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 12%, transparent));
    border-radius: 999px;
    background: var(--ui-color-surface, #ffffff);
    color: var(--ui-color-text, #0f172a);
    font-size: 0.75rem;
    line-height: 1.5;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  }
  .reactions[data-empty] { display: none; }
  :host([reactions-side="top"]) .reactions { inset-block-end: auto; inset-block-start: -14px; }
  :host([reactions-align="start"]) .reactions { inset-inline-end: auto; inset-inline-start: 8px; }

  @media (forced-colors: active) {
    .bubble { border-color: CanvasText; }
  }
`;

export class UIBubble extends ElementBase {
  static get observedAttributes() {
    return ['href', 'target', 'align'];
  }

  constructor() {
    super();
    this.root.addEventListener('slotchange', () => this.syncReactions());
  }

  override connectedCallback(): void {
    this.syncAlign();
    super.connectedCallback();
  }

  protected override shouldRenderOnAttributeChange(name: string): boolean {
    if (name === 'align') {
      this.syncAlign();
      return false;
    }
    return true;
  }

  /** Re-reads the alignment (its own, or the enclosing message's). */
  syncAlign(): void {
    const own = this.getAttribute('align');
    const message = this.closest('ui-message');
    const align = own === 'end' || own === 'start' ? own : message?.getAttribute('align') === 'end' ? 'end' : 'start';
    this.setAttribute('data-align', align);
  }

  private syncReactions(): void {
    const slot = this.root.querySelector('slot[name="reactions"]') as HTMLSlotElement | null;
    const filled = !!slot && slot.assignedNodes({ flatten: true }).some((node) => node.nodeType === 1 || (node.textContent || '').trim());
    this.root.querySelector('.reactions')?.toggleAttribute('data-empty', !filled);
    this.toggleAttribute('data-has-reactions', filled);
  }

  protected override render(): void {
    const href = this.getAttribute('href');
    const target = this.getAttribute('target');
    const inner = '<slot></slot><span class="reactions" part="reactions" data-empty><slot name="reactions"></slot></span>';
    const bubble = href
      ? `<a class="bubble" part="bubble" href="${escapeHtml(href)}"${target ? ` target="${escapeHtml(target)}" rel="noopener noreferrer"` : ''}>${inner}</a>`
      : `<div class="bubble" part="bubble">${inner}</div>`;
    this.setContent(`<style>${style}</style>${bubble}`);
    this.syncReactions();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-bubble')) {
  customElements.define('ui-bubble', UIBubble);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-bubble': UIBubble;
  }
}
