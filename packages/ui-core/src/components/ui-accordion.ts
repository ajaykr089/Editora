import { ElementBase } from '../ElementBase';

type SourceItem = {
  headerHtml: string;
  panelHtml: string;
  disabled: boolean;
};

const style = `
  :host {
    display: block;
    --ui-accordion-radius: 14px;
    --ui-accordion-border: 1px solid var(--ui-color-border, rgba(15, 23, 42, 0.14));
    --ui-accordion-divider: color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.18)) 78%, transparent);
    --ui-accordion-surface: var(--ui-color-surface, #ffffff);
    --ui-accordion-surface-alt: var(--ui-color-surface-alt, #f8fafc);
    --ui-accordion-open-surface: color-mix(in srgb, var(--ui-color-primary, #2563eb) 5%, var(--ui-color-surface, #ffffff));
    --ui-accordion-text: var(--ui-color-text, #0f172a);
    --ui-accordion-muted: var(--ui-color-muted, #475569);
    --ui-accordion-primary: var(--ui-color-primary, #2563eb);
    --ui-accordion-focus-ring: var(--ui-color-focus-ring, #2563eb);
    --ui-accordion-shadow: var(--ui-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 20px rgba(15, 23, 42, 0.04));
    --ui-accordion-duration: 220ms;
    --ui-accordion-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
    --ui-accordion-padding-x: 16px;
    --ui-accordion-padding-y: 14px;
    --ui-accordion-indicator-size: 3px;
    color-scheme: light dark;
  }

  .base {
    display: block;
    border: var(--ui-accordion-border);
    border-radius: var(--ui-accordion-radius);
    background: var(--ui-accordion-surface);
    overflow: hidden;
    box-shadow: var(--ui-accordion-shadow);
  }

  .item {
    margin: 0;
    position: relative;
    background: var(--ui-accordion-surface);
    color: var(--ui-accordion-text);
    transition: background var(--ui-accordion-duration) var(--ui-accordion-easing);
  }

  .item + .item {
    border-top: 1px solid var(--ui-accordion-divider);
  }

  .item::before {
    content: '';
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: 0;
    background: var(--ui-accordion-primary);
    transition: width var(--ui-accordion-duration) var(--ui-accordion-easing);
  }

  .item[open] {
    background: var(--ui-accordion-open-surface);
  }

  .item[open]::before {
    width: var(--ui-accordion-indicator-size);
  }

  .trigger {
    width: 100%;
    border: none;
    background: transparent;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.35;
    padding: var(--ui-accordion-padding-y) var(--ui-accordion-padding-x);
    cursor: pointer;
    text-align: left;
    transition:
      background var(--ui-accordion-duration) var(--ui-accordion-easing),
      color var(--ui-accordion-duration) var(--ui-accordion-easing);
  }

  .trigger:not([disabled]):hover {
    background: color-mix(in srgb, var(--ui-accordion-primary) 8%, var(--ui-accordion-surface-alt));
  }

  .item[open] .trigger {
    color: color-mix(in srgb, var(--ui-accordion-text) 82%, var(--ui-accordion-primary) 18%);
  }

  .trigger:focus-visible {
    outline: 2px solid var(--ui-accordion-focus-ring);
    outline-offset: -2px;
    position: relative;
    z-index: 1;
  }

  .trigger[disabled] {
    opacity: 0.56;
    cursor: not-allowed;
  }

  .label {
    min-width: 0;
  }

  .chevron {
    width: 18px;
    min-width: 18px;
    height: 18px;
    color: var(--ui-accordion-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    transition:
      transform var(--ui-accordion-duration) var(--ui-accordion-easing),
      color var(--ui-accordion-duration) var(--ui-accordion-easing);
  }

  .item[open] .chevron {
    transform: rotate(180deg);
    color: var(--ui-accordion-primary);
  }

  .panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--ui-accordion-duration) var(--ui-accordion-easing);
  }

  .panel-inner {
    min-height: 0;
    overflow: hidden;
    color: color-mix(in srgb, var(--ui-accordion-text) 88%, var(--ui-accordion-muted) 12%);
    font-size: 14px;
    line-height: 1.55;
    padding: 0 var(--ui-accordion-padding-x);
    opacity: 0;
    border-top: 1px solid transparent;
    transform: translateY(-4px);
    transition:
      opacity var(--ui-accordion-duration) var(--ui-accordion-easing),
      transform var(--ui-accordion-duration) var(--ui-accordion-easing),
      padding var(--ui-accordion-duration) var(--ui-accordion-easing),
      border-color var(--ui-accordion-duration) var(--ui-accordion-easing);
  }

  .item[open] .panel {
    grid-template-rows: 1fr;
  }

  .item[open] .panel-inner {
    opacity: 1;
    transform: translateY(0);
    padding: 0 var(--ui-accordion-padding-x) 14px;
    border-top-color: color-mix(in srgb, var(--ui-accordion-primary) 24%, transparent);
  }

  .empty {
    padding: 13px var(--ui-accordion-padding-x);
    color: var(--ui-accordion-muted);
    font-size: 13px;
  }

  :host([headless]) .base {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .item,
    .trigger,
    .chevron,
    .panel,
    .panel-inner {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-accordion-border: 2px solid var(--ui-color-border, currentColor);
      --ui-accordion-divider: currentColor;
      --ui-accordion-focus-ring: currentColor;
      --ui-accordion-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-accordion-surface: Canvas;
      --ui-accordion-surface-alt: Canvas;
      --ui-accordion-text: CanvasText;
      --ui-accordion-muted: CanvasText;
      --ui-accordion-primary: Highlight;
      --ui-accordion-border: 1px solid CanvasText;
      --ui-accordion-divider: CanvasText;
      --ui-accordion-focus-ring: Highlight;
      --ui-accordion-shadow: none;
    }
    .item[open] .trigger {
      background: Highlight;
      color: HighlightText;
    }
    .item[open] .chevron {
      color: HighlightText;
    }
  }
`;

function normalizeIndex(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return -1;
  const rounded = Math.trunc(parsed);
  return rounded >= 0 ? rounded : -1;
}

function toBoolean(value: string | null, fallback: boolean): boolean {
  if (value == null) return fallback;
  const normalized = value.toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'no';
}

function parseOpen(value: string | null, multiple: boolean): number[] {
  if (!value) return [];
  if (!multiple) {
    const index = normalizeIndex(value);
    return index >= 0 ? [index] : [];
  }
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(normalizeIndex).filter((index) => index >= 0);
  } catch {}
  const index = normalizeIndex(value);
  return index >= 0 ? [index] : [];
}

function serializeOpen(value: number[], multiple: boolean): string {
  return multiple ? JSON.stringify(value) : String(value[0] ?? -1);
}

function isAccordionItemNode(node: Element): node is HTMLElement {
  return node instanceof HTMLElement && node.hasAttribute('data-ui-accordion-item');
}

export class UIAccordion extends ElementBase {
  static get observedAttributes() {
    return ['open', 'multiple', 'collapsible', 'headless'];
  }

  private _uid = `ui-accordion-${Math.random().toString(36).slice(2, 8)}`;
  private _observer: MutationObserver | null = null;
  private _syncingOpenAttr = false;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);

    this._observer = new MutationObserver(() => this.requestRender());
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'open' && !this._syncingOpenAttr) {
      const applied = this._applyOpenState();
      if (applied) return;
    }
    this.requestRender();
  }

  get multiple() {
    return this.hasAttribute('multiple');
  }

  set multiple(value: boolean) {
    if (value === this.multiple) return;
    if (value) this.setAttribute('multiple', '');
    else this.removeAttribute('multiple');
  }

  get collapsible() {
    return toBoolean(this.getAttribute('collapsible'), true);
  }

  set collapsible(value: boolean) {
    this.setAttribute('collapsible', String(Boolean(value)));
  }

  get open(): number | number[] {
    const normalized = this._normalizeOpen(this._sourceItems().length);
    return this.multiple ? normalized : (normalized[0] ?? -1);
  }

  set open(value: number | number[]) {
    const next = Array.isArray(value) ? value : [value];
    this._commitOpen(next.map(normalizeIndex).filter((index) => index >= 0), false);
  }

  private _sourceItems(): SourceItem[] {
    const nodes = Array.from(this.children).filter(isAccordionItemNode);
    return nodes.map((itemNode, index) => {
      const directChildren = Array.from(itemNode.children) as HTMLElement[];
      const trigger =
        (directChildren.find((child) => child.hasAttribute('data-ui-accordion-trigger')) as HTMLElement | undefined) ||
        null;
      const panel =
        (directChildren.find((child) => child.hasAttribute('data-ui-accordion-panel')) as HTMLElement | undefined) ||
        null;
      return {
        headerHtml: trigger?.innerHTML || `Section ${index + 1}`,
        panelHtml: panel?.innerHTML || '',
        disabled: itemNode.hasAttribute('disabled') || trigger?.hasAttribute('disabled') || false,
      };
    });
  }

  private _normalizeOpen(totalItems: number): number[] {
    const parsed = parseOpen(this.getAttribute('open'), this.multiple);
    const valid = Array.from(
      new Set(parsed.map(normalizeIndex).filter((index) => index >= 0 && index < totalItems))
    ).sort((a, b) => a - b);

    if (this.multiple) {
      if (this.collapsible || totalItems === 0 || valid.length > 0) return valid;
      return [0];
    }

    if (valid.length > 0) return [valid[0]];
    if (this.collapsible || totalItems === 0) return [];
    return [0];
  }

  private _normalizeNext(next: number[], totalItems: number): number[] {
    const valid = Array.from(
      new Set(next.map(normalizeIndex).filter((index) => index >= 0 && index < totalItems))
    ).sort((a, b) => a - b);

    if (this.multiple) {
      if (this.collapsible || totalItems === 0 || valid.length > 0) return valid;
      return [0];
    }

    if (valid.length > 0) return [valid[0]];
    if (this.collapsible || totalItems === 0) return [];
    return [0];
  }

  private _commitOpen(next: number[], emit: boolean) {
    const total = this._sourceItems().length;
    const normalized = this._normalizeNext(next, total);
    const serialized = serializeOpen(normalized, this.multiple);
    const previous = this.getAttribute('open') ?? (this.multiple ? '[]' : '-1');

    if (serialized !== previous) this.setAttribute('open', serialized);

    if (!emit) return;
    const detailOpen: number | number[] = this.multiple ? normalized : (normalized[0] ?? -1);
    this.dispatchEvent(new CustomEvent('toggle', { detail: { open: detailOpen }, bubbles: true }));
    this.dispatchEvent(new CustomEvent('change', { detail: { open: detailOpen }, bubbles: true }));
  }

  private _applyOpenState(): boolean {
    const itemNodes = Array.from(this.root.querySelectorAll('.item')) as HTMLElement[];
    if (itemNodes.length === 0) return false;

    const sourceCount = this._sourceItems().length;
    if (sourceCount !== itemNodes.length) return false;

    const normalized = this._normalizeOpen(sourceCount);
    const serialized = serializeOpen(normalized, this.multiple);
    const current = this.getAttribute('open') ?? (this.multiple ? '[]' : '-1');
    if (serialized !== current) {
      this._syncingOpenAttr = true;
      this.setAttribute('open', serialized);
      this._syncingOpenAttr = false;
    }

    const openSet = new Set(normalized);
    itemNodes.forEach((itemNode, index) => {
      const isOpen = openSet.has(index);
      if (isOpen) itemNode.setAttribute('open', '');
      else itemNode.removeAttribute('open');

      const trigger = itemNode.querySelector('.trigger') as HTMLButtonElement | null;
      const panel = itemNode.querySelector('.panel') as HTMLElement | null;
      if (trigger) trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (panel) panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });

    return true;
  }

  private _toggleIndex(index: number) {
    const items = this._sourceItems();
    if (index < 0 || index >= items.length || items[index].disabled) return;

    const current = this._normalizeOpen(items.length);
    const isOpen = current.includes(index);
    let next = [...current];

    if (this.multiple) {
      if (isOpen) next = current.filter((value) => value !== index);
      else next.push(index);
    } else {
      next = isOpen ? [] : [index];
    }

    this._commitOpen(next, true);
  }

  private _onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const trigger = target.closest('.trigger') as HTMLButtonElement | null;
    if (!trigger || trigger.disabled) return;
    const index = normalizeIndex(trigger.getAttribute('data-index'));
    this._toggleIndex(index);
  }

  private _onKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const trigger = target.closest('.trigger') as HTMLButtonElement | null;
    if (!trigger) return;

    const enabled = Array.from(this.root.querySelectorAll('.trigger:not([disabled])')) as HTMLButtonElement[];
    const currentIndex = enabled.indexOf(trigger);
    if (currentIndex < 0) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const index = normalizeIndex(trigger.getAttribute('data-index'));
      this._toggleIndex(index);
      return;
    }

    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

    let nextIndex = currentIndex;
    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % enabled.length;
    if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = enabled.length - 1;

    event.preventDefault();
    enabled[nextIndex]?.focus();
  }

  protected render() {
    const items = this._sourceItems();
    const normalized = this._normalizeOpen(items.length);
    const serialized = serializeOpen(normalized, this.multiple);
    const current = this.getAttribute('open') ?? (this.multiple ? '[]' : '-1');

    if (serialized !== current) {
      this.setAttribute('open', serialized);
      return;
    }

    if (items.length === 0) {
      this.setContent(`
        <style>${style}</style>
        <div class="base" part="base">
          <div class="empty" part="empty">Add \`AccordionItem\` children.</div>
        </div>
      `);
      return;
    }

    const openSet = new Set(normalized);
    const renderedItems = items
      .map((item, index) => {
        const headerId = `${this._uid}-header-${index}`;
        const panelId = `${this._uid}-panel-${index}`;
        const isOpen = openSet.has(index);

        return `
          <section class="item" part="item" ${isOpen ? 'open' : ''}>
            <button
              class="trigger"
              part="trigger"
              type="button"
              id="${headerId}"
              data-index="${index}"
              aria-controls="${panelId}"
              aria-expanded="${isOpen ? 'true' : 'false'}"
              ${item.disabled ? 'disabled aria-disabled="true"' : ''}
            >
              <span class="label" part="label">${item.headerHtml}</span>
              <span class="chevron" part="icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 7.5 10 12.5 15 7.5"></path>
                </svg>
              </span>
            </button>
            <div class="panel" part="panel" id="${panelId}" role="region" aria-labelledby="${headerId}" aria-hidden="${isOpen ? 'false' : 'true'}">
              <div class="panel-inner" part="panel-inner">${item.panelHtml}</div>
            </div>
          </section>
        `;
      })
      .join('');

    this.setContent(`
      <style>${style}</style>
      <div class="base" part="base" role="presentation">${renderedItems}</div>
    `);

    this._applyOpenState();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-accordion')) {
  customElements.define('ui-accordion', UIAccordion);
}
