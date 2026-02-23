import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-flex;
    --ui-block-controls-gap: 6px;
    --ui-block-controls-padding: 8px;
    --ui-block-controls-radius: 16px;
    --ui-block-controls-bg: linear-gradient(145deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, #ffffff), color-mix(in srgb, var(--ui-color-surface, #ffffff) 90%, transparent));
    --ui-block-controls-border: 1px solid var(--ui-color-border, rgba(15, 23, 42, 0.14));
    --ui-block-controls-shadow: var(--ui-shadow-md, 0 18px 40px rgba(15, 23, 42, 0.16));
    --ui-block-controls-focus-ring: var(--ui-color-focus-ring, #2563eb);
    --ui-block-controls-transition: 170ms cubic-bezier(0.2, 0.8, 0.2, 1);
    color-scheme: light dark;
  }

  .toolbar {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--ui-block-controls-gap);
    padding: var(--ui-block-controls-padding);
    min-height: 40px;
    border-radius: var(--ui-block-controls-radius);
    border: var(--ui-block-controls-border);
    background: var(--ui-block-controls-bg);
    box-shadow: var(--ui-block-controls-shadow);
    backdrop-filter: saturate(1.08) blur(10px);
    transition: border-color var(--ui-block-controls-transition), box-shadow var(--ui-block-controls-transition), transform var(--ui-block-controls-transition);
  }

  .toolbar::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background: linear-gradient(180deg, color-mix(in srgb, #ffffff 76%, transparent), transparent 60%);
    opacity: 0.7;
  }

  .toolbar:focus-within {
    border-color: color-mix(in srgb, var(--ui-block-controls-focus-ring) 42%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-block-controls-focus-ring) 20%, transparent);
  }

  .toolbar:hover {
    transform: translateY(-1px);
  }

  :host([orientation="vertical"]) .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  :host([density="compact"]) .toolbar {
    --ui-block-controls-gap: 4px;
    --ui-block-controls-padding: 6px;
    min-height: 34px;
  }

  :host([density="comfortable"]) .toolbar {
    --ui-block-controls-gap: 8px;
    --ui-block-controls-padding: 10px;
    min-height: 44px;
  }

  :host([headless]) .toolbar {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .toolbar {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-block-controls-border: 2px solid var(--ui-color-border, currentColor);
      --ui-block-controls-shadow: none;
    }
    .toolbar:focus-within {
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-block-controls-bg: Canvas;
      --ui-block-controls-border: 1px solid CanvasText;
      --ui-block-controls-focus-ring: Highlight;
      --ui-block-controls-shadow: none;
    }
  }
`;

type FocusEntry = {
  root: HTMLElement;
  focusTarget: HTMLElement;
};

const FOCUS_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isDisabled(element: HTMLElement): boolean {
  if (element.hasAttribute('disabled')) return true;
  const ariaDisabled = element.getAttribute('aria-disabled');
  return ariaDisabled === 'true' || ariaDisabled === '1';
}

export class UIBlockControls extends ElementBase {
  static get observedAttributes() {
    return ['orientation', 'headless', 'density', 'aria-label'];
  }

  constructor() {
    super();
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
  }

  disconnectedCallback() {
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
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

  private _resolveFocusable(node: HTMLElement): HTMLElement | null {
    if (!node || isDisabled(node)) return null;

    if (node.matches(FOCUS_SELECTOR) || node.tabIndex >= 0) return node;

    const shadow = (node as unknown as { shadowRoot?: ShadowRoot | null }).shadowRoot || null;
    const shadowFocusable = shadow?.querySelector(FOCUS_SELECTOR) as HTMLElement | null;
    if (shadowFocusable && !isDisabled(shadowFocusable)) return shadowFocusable;

    const lightFocusable = node.querySelector(FOCUS_SELECTOR) as HTMLElement | null;
    if (lightFocusable && !isDisabled(lightFocusable)) return lightFocusable;

    return typeof node.focus === 'function' ? node : null;
  }

  private _focusEntries(): FocusEntry[] {
    const slot = this.root.querySelector('slot') as HTMLSlotElement | null;
    if (!slot) return [];

    const assigned = slot.assignedElements({ flatten: true }) as HTMLElement[];
    return assigned
      .map((node) => {
        const focusTarget = this._resolveFocusable(node);
        return focusTarget ? { root: node, focusTarget } : null;
      })
      .filter((entry): entry is FocusEntry => Boolean(entry));
  }

  private _onKeyDown(event: KeyboardEvent) {
    const entries = this._focusEntries();
    if (entries.length < 2) return;

    const path = event.composedPath();
    const currentIndex = entries.findIndex((entry) => path.includes(entry.root) || path.includes(entry.focusTarget));
    if (currentIndex < 0) return;

    const horizontal = this._orientation() === 'horizontal';
    const rtl = this._direction() === 'rtl';
    let nextIndex = currentIndex;

    if (horizontal) {
      if (event.key === 'ArrowRight') nextIndex = rtl ? (currentIndex - 1 + entries.length) % entries.length : (currentIndex + 1) % entries.length;
      if (event.key === 'ArrowLeft') nextIndex = rtl ? (currentIndex + 1) % entries.length : (currentIndex - 1 + entries.length) % entries.length;
    } else {
      if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % entries.length;
      if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + entries.length) % entries.length;
    }

    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = entries.length - 1;

    if (nextIndex === currentIndex) return;
    event.preventDefault();
    try {
      entries[nextIndex].focusTarget.focus();
    } catch {}
  }

  protected render() {
    const orientation = this._orientation();
    const label = escapeHtml(this.getAttribute('aria-label') || 'Block controls');
    this.setContent(`
      <style>${style}</style>
      <div class="toolbar" role="toolbar" aria-orientation="${orientation}" aria-label="${label}">
        <slot></slot>
      </div>
    `);
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
