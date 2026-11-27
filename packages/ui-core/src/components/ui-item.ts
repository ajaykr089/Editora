import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';

/**
 * A list row: media, a title and description, and actions. The building block for settings
 * rows, notification lists, file lists, search results, members lists.
 *
 *   <ui-item href="/team/ada" variant="outline">
 *     <img slot="media" src="ada.png" alt="" />
 *     <span slot="title">Ada Lovelace</span>
 *     <span slot="description">ada@example.com</span>
 *     <button slot="actions">Remove</button>
 *   </ui-item>
 *
 * Slots: `media`, `title`, `description`, `actions`, `header` and `footer` (full-width rows
 * above and below), and the default slot (more content under the description). `label` and
 * `description` attributes are shortcuts for the two text slots. With `href` the media and text
 * become one link (its name is the title and description) while the actions stay separate
 * controls beside it, so there is never a button inside a link. Attributes: `variant` (default |
 * outline | muted), `size` (sm | md), `media-variant` (icon: a tinted square around an icon |
 * image: a cover-cropped thumbnail), `href`, `target`, `rel`, `disabled`.
 *
 * In a `ui-item-group` (role="list") each item is a listitem.
 */
const itemStyle = `
  :host {
    --ui-item-gap: 12px;
    --ui-item-pad: 12px 14px;
    --ui-item-radius: var(--ui-radius, 8px);
    --ui-item-bg: transparent;
    --ui-item-bg-hover: var(--ui-color-fill-hover, color-mix(in srgb, var(--ui-color-text, #0f172a) 5%, transparent));
    --ui-item-border: transparent;
    --ui-item-title: var(--ui-color-text-strong, var(--ui-color-text, #0f172a));
    --ui-item-description: var(--ui-color-muted, #526175);
    --ui-item-media-size: 36px;
    color-scheme: light dark;
    display: block;
    min-inline-size: 0;
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
  }

  :host([hidden]) { display: none; }
  :host([size="sm"]) { --ui-item-gap: 10px; --ui-item-pad: 8px 10px; --ui-item-media-size: 28px; }
  :host([variant="outline"]) { --ui-item-border: var(--ui-color-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 14%, transparent)); }
  :host([variant="muted"]) { --ui-item-bg: var(--ui-color-surface-alt, color-mix(in srgb, var(--ui-color-text, #0f172a) 4%, transparent)); }

  .item {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--ui-item-border);
    border-radius: var(--ui-item-radius);
    background: var(--ui-item-bg);
    transition: background-color 140ms ease, border-color 140ms ease;
  }

  .row {
    display: flex;
    align-items: center;
    gap: var(--ui-item-gap);
    padding: var(--ui-item-pad);
    min-inline-size: 0;
  }

  .main {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    gap: var(--ui-item-gap);
    min-inline-size: 0;
    color: inherit;
    text-decoration: none;
    border-radius: calc(var(--ui-item-radius) - 2px);
  }

  a.main { cursor: pointer; }
  a.main:focus-visible {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: 4px;
  }
  /* The whole row reacts to the link, not just the text. */
  :host([href]:not([disabled])) .item:hover { background: var(--ui-item-bg-hover); }
  :host([disabled]) .item { opacity: 0.55; }
  :host([disabled]) a.main { pointer-events: none; cursor: default; }

  .media {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ui-item-description);
  }
  .media[data-empty] { display: none; }
  :host([media-variant="icon"]) .media {
    inline-size: var(--ui-item-media-size);
    block-size: var(--ui-item-media-size);
    border-radius: calc(var(--ui-item-radius) - 2px);
    background: var(--ui-color-fill, color-mix(in srgb, var(--ui-color-text, #0f172a) 6%, transparent));
    color: var(--ui-color-text-secondary, var(--ui-color-text, #334155));
  }
  :host([media-variant="image"]) .media {
    inline-size: calc(var(--ui-item-media-size) + 12px);
    block-size: calc(var(--ui-item-media-size) + 12px);
    overflow: hidden;
    border-radius: calc(var(--ui-item-radius) - 2px);
  }
  :host([media-variant="image"]) ::slotted([slot="media"]) {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }

  .content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-inline-size: 0;
  }

  .title {
    color: var(--ui-item-title);
    font-size: var(--ui-font-size-md, 0.875rem);
    font-weight: 550;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .description {
    color: var(--ui-item-description);
    font-size: var(--ui-font-size-sm, 0.8125rem);
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  :host([size="sm"]) .title { font-size: var(--ui-font-size-sm, 0.8125rem); }
  :host([size="sm"]) .description { font-size: 0.75rem; }

  .title[data-empty],
  .description[data-empty],
  .extra[data-empty],
  .actions[data-empty],
  .header[data-empty],
  .footer[data-empty] { display: none; }

  .actions {
    flex: none;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .header,
  .footer {
    padding: var(--ui-item-pad);
    color: var(--ui-item-description);
    font-size: var(--ui-font-size-sm, 0.8125rem);
  }
  .header { padding-block-end: 0; }
  .footer { padding-block-start: 0; }

  @media (forced-colors: active) {
    :host([variant="outline"]) .item { border-color: CanvasText; }
    a.main:focus-visible { outline-color: Highlight; }
  }
`;

const SLOTS = ['media', 'title', 'description', 'actions', 'header', 'footer'];

export class UIItem extends ElementBase {
  static get observedAttributes() {
    return ['href', 'target', 'rel', 'label', 'description', 'disabled'];
  }

  constructor() {
    super();
    // slotchange bubbles: one listener on the shadow root covers every render.
    this.root.addEventListener('slotchange', () => this.syncSlots(this.getAttribute('label') || '', this.getAttribute('description') || ''));
  }

  override connectedCallback(): void {
    this.syncRole();
    super.connectedCallback();
  }

  private syncRole(): void {
    const parent = this.parentElement;
    const inList = !!parent && parent.localName === 'ui-item-group';
    if (inList && !this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
      this.setAttribute('data-auto-role', '');
    } else if (!inList && this.hasAttribute('data-auto-role')) {
      this.removeAttribute('role');
      this.removeAttribute('data-auto-role');
    }
  }

  protected override render(): void {
    const href = this.getAttribute('href');
    const disabled = this.hasAttribute('disabled');
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const target = this.getAttribute('target');
    const rel = this.getAttribute('rel') || (target === '_blank' ? 'noopener noreferrer' : '');

    const inner = `
      <span class="media" part="media"><slot name="media"></slot></span>
      <span class="content" part="content">
        <span class="title" part="title"><slot name="title">${escapeHtml(label)}</slot></span>
        <span class="description" part="description"><slot name="description">${escapeHtml(description)}</slot></span>
        <span class="extra" part="extra"><slot></slot></span>
      </span>
    `;
    const main = href
      ? `<a class="main" part="main link" href="${escapeHtml(href)}"${target ? ` target="${escapeHtml(target)}"` : ''}${rel ? ` rel="${escapeHtml(rel)}"` : ''}${disabled ? ' aria-disabled="true" tabindex="-1"' : ''}>${inner}</a>`
      : `<div class="main" part="main">${inner}</div>`;

    this.setContent(`
      <style>${itemStyle}</style>
      <div class="item" part="item">
        <div class="header" part="header"><slot name="header"></slot></div>
        <div class="row" part="row">
          ${main}
          <span class="actions" part="actions"><slot name="actions"></slot></span>
        </div>
        <div class="footer" part="footer"><slot name="footer"></slot></div>
      </div>
    `);
    this.syncSlots(label, description);
  }

  private syncSlots(label: string, description: string): void {
    const wrapperOf = (name: string) => this.root.querySelector(`[part~="${name}"]`) as HTMLElement | null;
    for (const name of SLOTS) {
      const slot = this.root.querySelector(`slot[name="${name}"]`) as HTMLSlotElement | null;
      const wrapper = wrapperOf(name);
      if (!slot || !wrapper) continue;
      const fallback = name === 'title' ? label : name === 'description' ? description : '';
      const filled = !!fallback || slot.assignedNodes({ flatten: true }).some((node) => node.nodeType === 1 || (node.textContent || '').trim());
      wrapper.toggleAttribute('data-empty', !filled);
    }
    const extraSlot = this.root.querySelector('slot:not([name])') as HTMLSlotElement | null;
    const extra = wrapperOf('extra');
    if (extraSlot && extra) {
      extra.toggleAttribute('data-empty', !extraSlot.assignedNodes().some((node) => node.nodeType === 1 || (node.textContent || '').trim()));
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-item')) {
  customElements.define('ui-item', UIItem);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-item': UIItem;
  }
}
