import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-breadcrumb-gap: 8px;
    --ui-breadcrumb-radius: 10px;
    --ui-breadcrumb-font-size: 14px;
    --ui-breadcrumb-accent: var(--ui-color-primary, #2563eb);
    --ui-breadcrumb-color: color-mix(in srgb, var(--ui-color-muted, #64748b) 76%, var(--ui-color-text, #0f172a) 24%);
    --ui-breadcrumb-muted: color-mix(in srgb, var(--ui-color-muted, #94a3b8) 70%, transparent);
    --ui-breadcrumb-current: var(--ui-color-text, #0f172a);
    --ui-breadcrumb-hover-bg: color-mix(in srgb, var(--ui-breadcrumb-accent) 10%, var(--ui-color-surface, #ffffff));
    --ui-breadcrumb-focus-ring: var(--ui-color-focus-ring, #2563eb);
    --ui-breadcrumb-current-bg: color-mix(in srgb, var(--ui-breadcrumb-accent) 12%, var(--ui-color-surface, #ffffff));
    --ui-breadcrumb-separator-bg: color-mix(in srgb, var(--ui-breadcrumb-accent) 22%, transparent);
    color-scheme: light dark;
  }

  :host([tone="neutral"]) {
    --ui-breadcrumb-accent: color-mix(in srgb, var(--ui-color-muted, #64748b) 74%, var(--ui-color-text, #0f172a) 26%);
  }

  :host([tone="info"]) {
    --ui-breadcrumb-accent: var(--ui-color-primary, #2563eb);
  }

  :host([tone="success"]) {
    --ui-breadcrumb-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-breadcrumb-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-breadcrumb-accent: var(--ui-color-danger, #dc2626);
  }

  nav {
    display: block;
    width: 100%;
  }

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ui-breadcrumb-gap);
    font-size: var(--ui-breadcrumb-font-size);
    color: var(--ui-breadcrumb-color);
  }

  li {
    display: inline-flex;
    align-items: center;
    gap: var(--ui-breadcrumb-gap);
    min-height: 30px;
    min-inline-size: 0;
  }

  .crumb-action,
  .crumb-current,
  .crumb-disabled,
  .crumb-ellipsis {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: var(--ui-breadcrumb-radius);
    padding: 4px 9px;
    line-height: 1.2;
    min-inline-size: 0;
    white-space: nowrap;
  }

  .crumb-action {
    border: none;
    background: transparent;
    color: var(--ui-breadcrumb-color);
    cursor: pointer;
    text-decoration: none;
    font: inherit;
    transition: background-color 150ms ease, color 150ms ease, transform 150ms ease;
  }

  .crumb-action:hover {
    background: var(--ui-breadcrumb-hover-bg);
    color: var(--ui-breadcrumb-current);
    transform: translateY(-1px);
  }

  .crumb-action:active {
    transform: translateY(0);
  }

  .crumb-action:focus-visible {
    outline: 2px solid var(--ui-breadcrumb-focus-ring);
    outline-offset: 1px;
  }

  .crumb-current {
    color: var(--ui-breadcrumb-current);
    font-weight: 620;
    background: var(--ui-breadcrumb-current-bg);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-breadcrumb-accent) 26%, transparent);
  }

  .crumb-disabled {
    color: var(--ui-breadcrumb-muted);
    opacity: 0.68;
    cursor: not-allowed;
  }

  .crumb-ellipsis,
  .separator {
    color: var(--ui-breadcrumb-muted);
  }

  .separator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 10px;
    padding-inline: 1px;
    font-size: 0.92em;
    line-height: 1;
    opacity: 0.74;
  }

  :host([size="sm"]) {
    --ui-breadcrumb-gap: 6px;
    --ui-breadcrumb-radius: 8px;
    --ui-breadcrumb-font-size: 13px;
  }

  :host([size="lg"]) {
    --ui-breadcrumb-gap: 10px;
    --ui-breadcrumb-radius: 12px;
    --ui-breadcrumb-font-size: 15px;
  }

  :host([variant="solid"]) {
    --ui-breadcrumb-hover-bg: color-mix(in srgb, var(--ui-breadcrumb-accent) 16%, var(--ui-color-surface, #ffffff));
    --ui-breadcrumb-current-bg: color-mix(in srgb, var(--ui-breadcrumb-accent) 24%, var(--ui-color-surface, #ffffff));
  }

  :host([variant="minimal"]) .crumb-action,
  :host([variant="minimal"]) .crumb-current,
  :host([variant="minimal"]) .crumb-disabled {
    padding-inline: 3px;
  }

  :host([variant="minimal"]) .separator {
    opacity: 0.5;
  }

  :host([state="loading"]) .crumb-action,
  :host([state="loading"]) .crumb-current {
    position: relative;
    overflow: hidden;
  }

  :host([state="loading"]) .crumb-action::after,
  :host([state="loading"]) .crumb-current::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        100deg,
        color-mix(in srgb, transparent 100%, #ffffff) 0%,
        color-mix(in srgb, var(--ui-breadcrumb-accent) 16%, transparent) 42%,
        color-mix(in srgb, transparent 100%, #ffffff) 80%
      );
    background-size: 220% 100%;
    animation: ui-breadcrumb-shimmer 1.2s linear infinite;
    pointer-events: none;
  }

  :host([state="error"]) {
    --ui-breadcrumb-accent: var(--ui-color-danger, #dc2626);
  }

  :host([state="success"]) {
    --ui-breadcrumb-accent: var(--ui-color-success, #16a34a);
  }

  :host([disabled]) .crumb-action {
    pointer-events: none;
    opacity: 0.58;
    transform: none !important;
  }

  :host([headless]) nav {
    display: none;
  }

  @keyframes ui-breadcrumb-shimmer {
    from { background-position: 120% 0; }
    to { background-position: -120% 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .crumb-action,
    .crumb-current {
      transition: none !important;
    }
    :host([state="loading"]) .crumb-action::after,
    :host([state="loading"]) .crumb-current::after {
      animation: none;
    }
  }

  @media (prefers-contrast: more) {
    .crumb-current {
      box-shadow: inset 0 0 0 2px currentColor;
    }
    .separator {
      color: currentColor;
      opacity: 1;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-breadcrumb-color: CanvasText;
      --ui-breadcrumb-muted: CanvasText;
      --ui-breadcrumb-current: CanvasText;
      --ui-breadcrumb-hover-bg: Highlight;
      --ui-breadcrumb-current-bg: Canvas;
      --ui-breadcrumb-focus-ring: Highlight;
      --ui-breadcrumb-separator-bg: CanvasText;
    }
  }
`;

type DisplayToken =
  | { kind: 'item'; item: HTMLElement; sourceIndex: number; current: boolean; disabled: boolean }
  | { kind: 'ellipsis'; key: string };

type SelectDetail = {
  index: number;
  label: string;
  href?: string;
  source: 'click' | 'keyboard';
};

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function readBoolAttr(value: string | null): boolean {
  if (value == null) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '' || normalized === 'true' || normalized === '1' || normalized === 'yes';
}

function isDisabledItem(item: HTMLElement): boolean {
  return readBoolAttr(item.getAttribute('disabled')) || readBoolAttr(item.getAttribute('data-disabled')) || item.getAttribute('aria-disabled') === 'true';
}

function isCurrentItem(item: HTMLElement): boolean {
  const aria = item.getAttribute('aria-current');
  if (aria && aria !== 'false') return true;
  return readBoolAttr(item.getAttribute('current')) || readBoolAttr(item.getAttribute('data-current'));
}

export class UIBreadcrumb extends ElementBase {
  static get observedAttributes() {
    return [
      'separator',
      'max-items',
      'current-index',
      'size',
      'variant',
      'tone',
      'state',
      'disabled',
      'aria-label',
      'headless',
    ];
  }

  private _slots: HTMLSlotElement[] = [];

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onRootKeyDown = this._onRootKeyDown.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
    this.root.addEventListener('keydown', this._onRootKeyDown as EventListener);
    this._syncBusyState();
    this._syncDisabledState();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    this.root.removeEventListener('keydown', this._onRootKeyDown as EventListener);
    this._detachSlotListeners();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'state') this._syncBusyState();
    if (name === 'disabled') this._syncDisabledState();
    if (this.isConnected) this.requestRender();
  }

  get headless() {
    return this.hasAttribute('headless');
  }

  set headless(value: boolean) {
    if (value === this.headless) return;
    if (value) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  private _syncBusyState() {
    if (this.getAttribute('state') === 'loading') this.setAttribute('aria-busy', 'true');
    else this.removeAttribute('aria-busy');
  }

  private _syncDisabledState() {
    if (this.hasAttribute('disabled')) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
  }

  private _attachSlotListeners() {
    this._detachSlotListeners();
    this._slots = Array.from(this.root.querySelectorAll('slot'));
    this._slots.forEach((slot) => slot.addEventListener('slotchange', this._onSlotChange as EventListener));
  }

  private _detachSlotListeners() {
    this._slots.forEach((slot) => slot.removeEventListener('slotchange', this._onSlotChange as EventListener));
    this._slots = [];
  }

  private _onSlotChange() {
    this.requestRender();
  }

  private _direction(): 'ltr' | 'rtl' {
    const hostDir = this.getAttribute('dir');
    if (hostDir === 'rtl' || hostDir === 'ltr') return hostDir;

    const parentWithDir = this.closest('[dir]') as HTMLElement | null;
    const parentDir = parentWithDir?.getAttribute('dir');
    if (parentDir === 'rtl' || parentDir === 'ltr') return parentDir;

    return getComputedStyle(this).direction === 'rtl' ? 'rtl' : 'ltr';
  }

  private _getSourceItems() {
    const slotted = Array.from(this.querySelectorAll('[slot="item"]')) as HTMLElement[];
    if (slotted.length > 0) return slotted;
    return Array.from(this.children).filter((node) => node instanceof HTMLElement) as HTMLElement[];
  }

  private _maxItems() {
    const parsed = Number(this.getAttribute('max-items'));
    if (!Number.isFinite(parsed)) return Number.POSITIVE_INFINITY;
    return Math.max(3, Math.floor(parsed));
  }

  private _currentIndex(items: HTMLElement[]): number {
    const attrIndex = Number(this.getAttribute('current-index'));
    if (Number.isFinite(attrIndex)) {
      const idx = Math.floor(attrIndex);
      if (idx >= 0 && idx < items.length) return idx;
    }
    const marked = items.findIndex((item) => isCurrentItem(item));
    if (marked >= 0) return marked;
    return items.length > 0 ? items.length - 1 : -1;
  }

  private _visibleIndices(items: HTMLElement[], current: number): number[] {
    const maxItems = this._maxItems();
    if (!Number.isFinite(maxItems) || items.length <= maxItems) {
      return items.map((_, index) => index);
    }

    const last = items.length - 1;
    const safeCurrent = current >= 0 ? current : last;
    const visible = new Set<number>([0, last, safeCurrent]);
    let left = safeCurrent - 1;
    let right = safeCurrent + 1;

    while (visible.size < maxItems && (left > 0 || right < last)) {
      if (left > 0) {
        visible.add(left);
        if (visible.size >= maxItems) break;
      }
      if (right < last) visible.add(right);
      left -= 1;
      right += 1;
    }

    for (let index = 1; visible.size < maxItems && index < last; index += 1) {
      visible.add(index);
    }

    return Array.from(visible).sort((a, b) => a - b);
  }

  private _getDisplayTokens(items: HTMLElement[]): DisplayToken[] {
    const currentIndex = this._currentIndex(items);
    const visible = this._visibleIndices(items, currentIndex);
    const tokens: DisplayToken[] = [];
    let prev: number | null = null;

    visible.forEach((index) => {
      if (prev != null && index - prev > 1) {
        tokens.push({ kind: 'ellipsis', key: `ellipsis-${prev}-${index}` });
      }
      const item = items[index];
      tokens.push({
        kind: 'item',
        item,
        sourceIndex: index,
        current: index === currentIndex,
        disabled: isDisabledItem(item),
      });
      prev = index;
    });

    return tokens;
  }

  private _renderLabel(item: HTMLElement): string {
    const explicit = item.getAttribute('data-label');
    if (explicit) return escapeHtml(explicit);
    const html = (item.innerHTML || '').trim();
    if (html) return html;
    return escapeHtml((item.textContent || '').trim());
  }

  private _emitSelect(sourceIndex: number, source: 'click' | 'keyboard') {
    const items = this._getSourceItems();
    const item = items[sourceIndex];
    if (!item) return null;

    const label = (item.getAttribute('data-label') || item.textContent || '').trim();
    const href = item.getAttribute('href') || undefined;
    const detail: SelectDetail = { index: sourceIndex, label, href, source };

    const event = new CustomEvent<SelectDetail>('select', {
      detail,
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    this.dispatchEvent(event);
    this.dispatchEvent(new CustomEvent<SelectDetail>('ui-select', { detail, bubbles: true, composed: true }));
    return event;
  }

  private _onRootClick(event: Event) {
    const target = event.target as HTMLElement;
    const action = target.closest('.crumb-action') as HTMLElement | null;
    if (!action) return;

    if (this.hasAttribute('disabled') || action.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      return;
    }

    const sourceIndex = Number(action.getAttribute('data-source-index'));
    if (Number.isNaN(sourceIndex)) return;

    const selectEvent = this._emitSelect(sourceIndex, 'click');
    if (selectEvent?.defaultPrevented) event.preventDefault();
  }

  private _onRootKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const action = target.closest('.crumb-action') as HTMLElement | null;
    if (!action || this.hasAttribute('disabled')) return;

    if (event.key === ' ' && action.tagName.toLowerCase() === 'a') {
      event.preventDefault();
      const sourceIndex = Number(action.getAttribute('data-source-index'));
      if (!Number.isNaN(sourceIndex)) {
        const selectEvent = this._emitSelect(sourceIndex, 'keyboard');
        if (selectEvent?.defaultPrevented) return;
      }
    }

    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;

    const actions = Array.from(this.root.querySelectorAll('.crumb-action:not([aria-disabled="true"])')) as HTMLElement[];
    if (actions.length === 0) return;

    const currentIndex = actions.indexOf(action);
    if (currentIndex < 0) return;

    const rtl = this._direction() === 'rtl';
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') nextIndex = rtl ? currentIndex - 1 : currentIndex + 1;
    if (event.key === 'ArrowLeft') nextIndex = rtl ? currentIndex + 1 : currentIndex - 1;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = actions.length - 1;

    nextIndex = (nextIndex + actions.length) % actions.length;
    actions[nextIndex].focus();
    event.preventDefault();
  }

  protected render() {
    const items = this._getSourceItems();
    const separatorLabel = escapeHtml(this.getAttribute('separator') || '/');
    const ariaLabel = escapeHtml(this.getAttribute('aria-label') || 'Breadcrumb');
    const tokens = this._getDisplayTokens(items);
    const hostDisabled = this.hasAttribute('disabled');
    const loading = this.getAttribute('state') === 'loading';

    const listItems = tokens
      .map((token, tokenIndex) => {
        const isLastToken = tokenIndex === tokens.length - 1;
        let content = '';

        if (token.kind === 'ellipsis') {
          content = '<span class="crumb-ellipsis" aria-hidden="true">…</span>';
        } else {
          const label = this._renderLabel(token.item);
          const href = token.item.getAttribute('href');
          const rel = token.item.getAttribute('rel');
          const target = token.item.getAttribute('target');

          if (token.current || isLastToken) {
            content = `<span class="crumb-current" aria-current="page">${label}</span>`;
          } else if (hostDisabled || token.disabled || loading) {
            content = `<span class="crumb-disabled" aria-disabled="true">${label}</span>`;
          } else if (href) {
            content = `<a class="crumb-action crumb-link" data-source-index="${token.sourceIndex}" href="${escapeHtml(href)}"${target ? ` target="${escapeHtml(target)}"` : ''}${rel ? ` rel="${escapeHtml(rel)}"` : ''}>${label}</a>`;
          } else {
            content = `<button type="button" class="crumb-action crumb-btn" data-source-index="${token.sourceIndex}">${label}</button>`;
          }
        }

        const sep = !isLastToken ? `<span class="separator" aria-hidden="true" title="${separatorLabel}">${separatorLabel}</span>` : '';
        return `<li part="item">${content}${sep}</li>`;
      })
      .join('');

    this.setContent(`
      <style>${style}</style>
      <nav role="navigation" aria-label="${ariaLabel}">
        <ol part="list">
          ${listItems}
        </ol>
      </nav>
      <slot id="slot-item" name="item" hidden></slot>
      <slot id="slot-default" hidden></slot>
    `);

    this._attachSlotListeners();
    this._syncBusyState();
    this._syncDisabledState();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-breadcrumb')) {
  customElements.define('ui-breadcrumb', UIBreadcrumb);
}
