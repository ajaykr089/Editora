import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-flex;
    min-inline-size: 0;
    --ui-block-controls-gap: 6px;
    --ui-block-controls-padding: 8px;
    --ui-block-controls-radius: 14px;
    --ui-block-controls-border: 1px solid color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 88%, transparent);
    --ui-block-controls-bg:
      linear-gradient(
        150deg,
        color-mix(in srgb, var(--ui-color-primary, #2563eb) 8%, var(--ui-color-surface, #ffffff)),
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, transparent)
      );
    --ui-block-controls-shadow:
      none;
    --ui-block-controls-accent: var(--ui-color-primary, #2563eb);
    --ui-block-controls-focus-ring: var(--ui-color-focus-ring, #2563eb);
    --ui-block-controls-duration: 170ms;
    --ui-block-controls-font: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color-scheme: light dark;
    box-sizing: border-box;
    font-family: var(--ui-block-controls-font);
  }

  :host([tone="neutral"]) {
    --ui-block-controls-accent: color-mix(in srgb, var(--ui-color-muted, #64748b) 72%, var(--ui-color-text, #0f172a) 28%);
  }

  :host([tone="info"]) {
    --ui-block-controls-accent: var(--ui-color-primary, #2563eb);
  }

  :host([tone="success"]) {
    --ui-block-controls-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-block-controls-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-block-controls-accent: var(--ui-color-danger, #dc2626);
  }

  .toolbar {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    min-inline-size: 0;
    gap: var(--ui-block-controls-gap);
    padding: var(--ui-block-controls-padding);
    border-radius: var(--ui-block-controls-radius);
    border: var(--ui-block-controls-border);
    background: var(--ui-block-controls-bg);
    box-shadow: var(--ui-block-controls-shadow);
    backdrop-filter: saturate(1.08) blur(10px);
    transition:
      transform var(--ui-block-controls-duration) cubic-bezier(0.2, 0.8, 0.2, 1),
      border-color var(--ui-block-controls-duration) cubic-bezier(0.2, 0.8, 0.2, 1),
      box-shadow var(--ui-block-controls-duration) cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity var(--ui-block-controls-duration) cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .toolbar::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background:
      radial-gradient(120% 70% at 100% 0%, color-mix(in srgb, var(--ui-block-controls-accent) 20%, transparent), transparent 64%),
      linear-gradient(180deg, color-mix(in srgb, #ffffff 40%, transparent), transparent 48%);
    opacity: 0.66;
  }

  .toolbar:focus-within {
    border-color: color-mix(in srgb, var(--ui-block-controls-focus-ring) 52%, transparent);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-block-controls-focus-ring) 22%, transparent),
      0 14px 30px rgba(15, 23, 42, 0.14);
  }

  :host(:not([disabled])):hover .toolbar {
    transform: translateY(-1px);
  }

  :host([orientation="vertical"]) .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  :host([wrap]) .toolbar {
    flex-wrap: wrap;
  }

  :host([density="compact"]) {
    --ui-block-controls-gap: 4px;
    --ui-block-controls-padding: 6px;
    --ui-block-controls-radius: 12px;
  }

  :host([density="comfortable"]) {
    --ui-block-controls-gap: 8px;
    --ui-block-controls-padding: 10px;
    --ui-block-controls-radius: 16px;
  }

  :host([variant="solid"]) {
    --ui-block-controls-bg: color-mix(in srgb, var(--ui-block-controls-accent) 12%, var(--ui-color-surface, #ffffff));
    --ui-block-controls-border: 1px solid color-mix(in srgb, var(--ui-block-controls-accent) 24%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
  }

  :host([variant="outline"]) {
    --ui-block-controls-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 88%, transparent);
    --ui-block-controls-border: 1px solid color-mix(in srgb, var(--ui-block-controls-accent) 42%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-block-controls-shadow: none;
  }

  :host([variant="minimal"]) .toolbar {
    box-shadow: none;
    background: transparent;
    border-color: transparent;
    padding-inline: 2px;
  }

  :host([elevation="none"]) .toolbar {
    box-shadow: none;
  }

  :host([elevation="high"]) {
    --ui-block-controls-shadow:
      0 2px 6px rgba(15, 23, 42, 0.08),
      0 20px 38px rgba(15, 23, 42, 0.16);
  }

  :host([state="loading"]) .toolbar::after {
    content: '';
    position: absolute;
    inset-inline: 8px;
    inset-block-end: -1px;
    block-size: 2px;
    border-radius: 999px;
    background:
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--ui-block-controls-accent) 0%, transparent) 0%,
        color-mix(in srgb, var(--ui-block-controls-accent) 94%, #0f172a) 45%,
        color-mix(in srgb, var(--ui-block-controls-accent) 0%, transparent) 100%
      );
    background-size: 46% 100%;
    animation: ui-block-controls-progress 1.2s linear infinite;
    pointer-events: none;
  }

  :host([state="error"]) {
    --ui-block-controls-accent: var(--ui-color-danger, #dc2626);
    --ui-block-controls-border: 1px solid color-mix(in srgb, var(--ui-block-controls-accent) 44%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
  }

  :host([state="success"]) {
    --ui-block-controls-accent: var(--ui-color-success, #16a34a);
    --ui-block-controls-border: 1px solid color-mix(in srgb, var(--ui-block-controls-accent) 44%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
  }

  :host([state="error"]) .toolbar,
  :host([state="success"]) .toolbar {
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--ui-block-controls-accent) 16%, transparent),
      var(--ui-block-controls-shadow);
  }

  .toolbar ::slotted([data-separator]),
  .toolbar ::slotted(hr) {
    border: 0;
    inline-size: 1px;
    block-size: 18px;
    align-self: center;
    margin: 0 2px;
    background: color-mix(in srgb, var(--ui-block-controls-accent) 28%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    border-radius: 999px;
    opacity: 0.72;
  }

  :host([orientation="vertical"]) .toolbar ::slotted([data-separator]),
  :host([orientation="vertical"]) .toolbar ::slotted(hr) {
    inline-size: 100%;
    block-size: 1px;
    margin: 2px 0;
  }

  .toolbar ::slotted([disabled]),
  .toolbar ::slotted([aria-disabled="true"]) {
    opacity: 0.56;
    cursor: not-allowed;
  }

  .toolbar ::slotted([data-active="true"]) {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-block-controls-accent) 38%, transparent);
    border-radius: 10px;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) .toolbar {
    opacity: 0.58;
    filter: saturate(0.78);
    box-shadow: none;
    transform: none !important;
  }

  :host([headless]) .toolbar {
    display: none;
  }

  @keyframes ui-block-controls-progress {
    from {
      background-position: -120% 0;
    }
    to {
      background-position: 220% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .toolbar,
    .toolbar::after {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .toolbar {
      border-width: 2px;
      box-shadow: none;
    }
    .toolbar:focus-within {
      box-shadow: none;
      outline: 2px solid var(--ui-block-controls-focus-ring);
      outline-offset: 2px;
    }
  }

  @media (forced-colors: active) {
    .toolbar {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
      box-shadow: none;
    }
    .toolbar ::slotted([data-separator]),
    .toolbar ::slotted(hr) {
      background: CanvasText;
      opacity: 1;
    }
    .toolbar:focus-within {
      outline: 2px solid Highlight;
      outline-offset: 2px;
      box-shadow: none;
    }
  }
`;

type FocusEntry = {
  root: HTMLElement;
  focusTarget: HTMLElement;
};

type NavigateDetail = {
  fromIndex: number;
  toIndex: number;
  total: number;
  key: string;
  orientation: 'horizontal' | 'vertical';
};

const FOCUS_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]',
  '[role="menuitem"]',
].join(', ');

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isDisabled(element: HTMLElement): boolean {
  if (element.hasAttribute('disabled')) return true;
  const ariaDisabled = element.getAttribute('aria-disabled');
  return ariaDisabled === 'true' || ariaDisabled === '1';
}

function isHidden(element: HTMLElement): boolean {
  if (element.hidden) return true;
  if (element.getAttribute('aria-hidden') === 'true') return true;
  const hiddenAncestor = element.closest('[hidden], [aria-hidden="true"]');
  if (hiddenAncestor) return true;
  return element.getClientRects().length === 0;
}

function isTypingContext(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target.closest('[contenteditable="true"], textarea, select, [role="textbox"]')) return true;

  const input = target.closest('input') as HTMLInputElement | null;
  if (!input) return false;

  const type = (input.type || '').toLowerCase();
  return !['button', 'submit', 'reset', 'checkbox', 'radio'].includes(type);
}

export class UIBlockControls extends ElementBase {
  static get observedAttributes() {
    return [
      'orientation',
      'headless',
      'density',
      'variant',
      'tone',
      'state',
      'elevation',
      'wrap',
      'loop',
      'no-loop',
      'disabled',
      'active-index',
      'aria-label',
    ];
  }

  private _slots: HTMLSlotElement[] = [];

  constructor() {
    super();
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('focusin', this._onFocusIn as EventListener);
    this._syncBusyState();
    this._syncDisabledState();
  }

  disconnectedCallback() {
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('focusin', this._onFocusIn as EventListener);
    this._detachSlotListeners();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'disabled') this._syncDisabledState();
    if (name === 'state') this._syncBusyState();
    if (name === 'active-index') this._applyRovingTabIndex();
    if (this.isConnected) this.requestRender();
  }

  private _orientation(): 'horizontal' | 'vertical' {
    return this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
  }

  private _direction(): 'ltr' | 'rtl' {
    const hostDir = this.getAttribute('dir');
    if (hostDir === 'rtl' || hostDir === 'ltr') return hostDir;

    const parentWithDir = this.closest('[dir]') as HTMLElement | null;
    const parentDir = parentWithDir?.getAttribute('dir');
    if (parentDir === 'rtl' || parentDir === 'ltr') return parentDir;

    return getComputedStyle(this).direction === 'rtl' ? 'rtl' : 'ltr';
  }

  private _loops(): boolean {
    if (this.hasAttribute('no-loop')) return false;
    return true;
  }

  private _syncBusyState() {
    const busy = this.getAttribute('state') === 'loading';
    if (busy) this.setAttribute('aria-busy', 'true');
    else this.removeAttribute('aria-busy');
  }

  private _syncDisabledState() {
    if (this.hasAttribute('disabled')) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
  }

  private _resolveFocusable(node: HTMLElement): HTMLElement | null {
    if (!node || isDisabled(node) || isHidden(node)) return null;
    if (node.hasAttribute('data-separator') || node.tagName.toLowerCase() === 'hr') return null;

    if (node.matches(FOCUS_SELECTOR) || node.tabIndex >= 0) return node;

    const shadowRoot = (node as HTMLElement & { shadowRoot?: ShadowRoot | null }).shadowRoot;
    const shadowFocusable = shadowRoot?.querySelector(FOCUS_SELECTOR) as HTMLElement | null;
    if (shadowFocusable && !isDisabled(shadowFocusable) && !isHidden(shadowFocusable)) return shadowFocusable;

    const lightFocusable = node.querySelector(FOCUS_SELECTOR) as HTMLElement | null;
    if (lightFocusable && !isDisabled(lightFocusable) && !isHidden(lightFocusable)) return lightFocusable;

    return null;
  }

  private _focusEntries(): FocusEntry[] {
    const slots = this._slots;
    if (slots.length === 0) return [];

    const assigned = slots.flatMap((slot) => slot.assignedElements({ flatten: true })) as HTMLElement[];
    const seen = new Set<HTMLElement>();
    const entries: FocusEntry[] = [];

    assigned.forEach((node) => {
      const focusTarget = this._resolveFocusable(node);
      if (!focusTarget || seen.has(focusTarget)) return;
      seen.add(focusTarget);
      entries.push({ root: node, focusTarget });
    });

    return entries;
  }

  private _parseActiveIndex(total: number): number {
    const raw = Number(this.getAttribute('active-index') || '');
    if (!Number.isFinite(raw)) return 0;
    if (total <= 0) return 0;
    if (raw < 0) return 0;
    if (raw > total - 1) return total - 1;
    return Math.floor(raw);
  }

  private _applyRovingTabIndex(activeTarget?: HTMLElement | null) {
    const entries = this._focusEntries();
    if (entries.length === 0) return;

    if (this.hasAttribute('disabled')) {
      entries.forEach((entry) => entry.focusTarget.setAttribute('tabindex', '-1'));
      return;
    }

    let activeIndex = entries.findIndex((entry) => entry.focusTarget === activeTarget);
    if (activeIndex < 0) {
      activeIndex = entries.findIndex((entry) => entry.focusTarget.getAttribute('tabindex') === '0');
    }
    if (activeIndex < 0) activeIndex = this._parseActiveIndex(entries.length);

    entries.forEach((entry, index) => {
      entry.focusTarget.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
    });
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
    this._applyRovingTabIndex();
  }

  private _onFocusIn(event: FocusEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const entries = this._focusEntries();
    const match = entries.find((entry) => target === entry.focusTarget || entry.root.contains(target));
    if (!match) return;
    this._applyRovingTabIndex(match.focusTarget);
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (this.hasAttribute('disabled')) return;
    if (event.defaultPrevented) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (isTypingContext(event.target)) return;

    const entries = this._focusEntries();
    if (entries.length < 2) return;

    const path = event.composedPath();
    const currentIndex = entries.findIndex((entry) => path.includes(entry.root) || path.includes(entry.focusTarget));
    if (currentIndex < 0) return;

    const horizontal = this._orientation() === 'horizontal';
    const rtl = this._direction() === 'rtl';
    const loops = this._loops();
    let nextIndex = currentIndex;
    let handled = false;

    if (horizontal) {
      if (event.key === 'ArrowRight') {
        nextIndex = rtl ? currentIndex - 1 : currentIndex + 1;
        handled = true;
      } else if (event.key === 'ArrowLeft') {
        nextIndex = rtl ? currentIndex + 1 : currentIndex - 1;
        handled = true;
      }
    } else if (event.key === 'ArrowDown') {
      nextIndex = currentIndex + 1;
      handled = true;
    } else if (event.key === 'ArrowUp') {
      nextIndex = currentIndex - 1;
      handled = true;
    }

    if (event.key === 'Home') {
      nextIndex = 0;
      handled = true;
    } else if (event.key === 'End') {
      nextIndex = entries.length - 1;
      handled = true;
    }

    if (!handled) return;

    if (loops) {
      nextIndex = (nextIndex + entries.length) % entries.length;
    } else {
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex > entries.length - 1) nextIndex = entries.length - 1;
    }

    if (nextIndex === currentIndex) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const target = entries[nextIndex].focusTarget;
    this._applyRovingTabIndex(target);
    try {
      target.focus({ preventScroll: true });
    } catch {
      target.focus();
    }

    const detail: NavigateDetail = {
      fromIndex: currentIndex,
      toIndex: nextIndex,
      total: entries.length,
      key: event.key,
      orientation: this._orientation(),
    };
    this.dispatchEvent(new CustomEvent<NavigateDetail>('ui-navigate', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent<NavigateDetail>('navigate', { detail, bubbles: true, composed: true }));
  }

  protected render() {
    const orientation = this._orientation();
    const label = escapeHtml(this.getAttribute('aria-label') || 'Block controls');
    const busy = this.getAttribute('state') === 'loading' ? 'true' : 'false';
    const disabled = this.hasAttribute('disabled') ? 'true' : 'false';

    this.setContent(`
      <style>${style}</style>
      <div
        class="toolbar"
        part="base toolbar"
        role="toolbar"
        aria-orientation="${orientation}"
        aria-label="${label}"
        aria-busy="${busy}"
        aria-disabled="${disabled}"
      >
        <slot></slot>
      </div>
    `);

    this._attachSlotListeners();
    this._syncBusyState();
    this._syncDisabledState();
    this._applyRovingTabIndex();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-block-controls')) {
  customElements.define('ui-block-controls', UIBlockControls);
}
