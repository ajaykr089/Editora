import { ElementBase } from '../ElementBase';
import { FocusManager } from '../focusManager';
import OverlayManager from '../overlayManager';

const style = `
  :host {
    position: fixed;
    inset: 0;
    display: none;
    z-index: 1200;
    --ui-dialog-backdrop: rgba(2, 6, 23, 0.56);
    --ui-dialog-bg: rgba(255, 255, 255, 0.96);
    --ui-dialog-color: #0f172a;
    --ui-dialog-border: 1px solid rgba(15, 23, 42, 0.12);
    --ui-dialog-shadow: 0 30px 80px rgba(2, 6, 23, 0.24);
    --ui-dialog-radius: 16px;
    --ui-dialog-padding: 18px;
    --ui-dialog-width: min(560px, calc(100vw - 24px));
  }

  :host([open]) {
    display: grid;
    place-items: center;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: var(--ui-dialog-backdrop);
    backdrop-filter: saturate(1.06) blur(3px);
  }

  .panel {
    position: relative;
    width: var(--ui-dialog-width);
    max-height: min(86vh, 760px);
    overflow: auto;
    box-sizing: border-box;
    border-radius: var(--ui-dialog-radius);
    border: var(--ui-dialog-border);
    background: var(--ui-dialog-bg);
    color: var(--ui-dialog-color);
    box-shadow: var(--ui-dialog-shadow);
    padding: var(--ui-dialog-padding);
    transform: translateY(8px) scale(0.985);
    opacity: 0;
    transition: transform 170ms ease, opacity 170ms ease;
  }

  :host([open]) .panel {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  .header {
    display: grid;
    gap: 4px;
    margin-bottom: 10px;
    padding-inline-end: 34px;
  }

  .title {
    margin: 0;
    font-size: 18px;
    line-height: 1.3;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .description {
    margin: 0;
    color: #475569;
    font-size: 13px;
    line-height: 1.45;
  }

  .close {
    position: absolute;
    top: 10px;
    inset-inline-end: 10px;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 8px;
    background: rgba(15, 23, 42, 0.08);
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 1;
  }

  .close:hover {
    background: rgba(15, 23, 42, 0.14);
  }

  .body {
    display: grid;
    gap: 10px;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-dialog-width: min(420px, calc(100vw - 24px));
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-dialog-width: min(760px, calc(100vw - 24px));
  }

  :host([headless]) .overlay,
  :host([headless]) .panel {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .panel {
      transition: none !important;
    }
  }
`;

function toBooleanAttribute(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

export class UIDialog extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'headless',
      'title',
      'description',
      'closable',
      'close-on-overlay',
      'close-on-esc',
      'size'
    ];
  }

  private _trap: { release?: () => void } | null = null;
  private _isActive = false;
  private _uid = Math.random().toString(36).slice(2, 8);
  private _lastFocused: HTMLElement | null = null;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    document.addEventListener('keydown', this._onKeyDown as EventListener);
    this._syncOpenState();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    document.removeEventListener('keydown', this._onKeyDown as EventListener);
    this._deactivate();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'open') this._syncOpenState();
  }

  openDialog() {
    this.setAttribute('open', '');
  }

  closeDialog(reason: 'button' | 'overlay' | 'escape' | 'programmatic' = 'programmatic') {
    if (!this.hasAttribute('open')) return;
    const closeEvent = new CustomEvent('request-close', {
      detail: { reason },
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(closeEvent);
    if (closeEvent.defaultPrevented) return;
    this.removeAttribute('open');
  }

  private _syncOpenState() {
    const shouldBeOpen = this.hasAttribute('open');
    if (shouldBeOpen && !this._isActive) {
      this._activate();
    } else if (!shouldBeOpen && this._isActive) {
      this._deactivate();
    }
  }

  private _activate() {
    this._isActive = true;
    this._lastFocused = (document.activeElement as HTMLElement) || null;
    this._trap = FocusManager.trap(this as unknown as HTMLElement);
    try {
      OverlayManager.register(this as unknown as HTMLElement);
      OverlayManager.acquireLock();
    } catch {}
    this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('show', { bubbles: true }));
  }

  private _deactivate() {
    if (!this._isActive) return;
    this._isActive = false;
    if (this._trap?.release) this._trap.release();
    this._trap = null;
    try {
      OverlayManager.unregister(this as unknown as HTMLElement);
      OverlayManager.releaseLock();
    } catch {}
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('hide', { bubbles: true }));
    const returnFocus = this._lastFocused;
    this._lastFocused = null;
    if (returnFocus) {
      setTimeout(() => {
        try {
          returnFocus.focus();
        } catch {}
      }, 0);
    }
  }

  private _onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target) return;

    if (target.classList.contains('overlay')) {
      const canCloseOnOverlay = toBooleanAttribute(this.getAttribute('close-on-overlay'), true);
      if (canCloseOnOverlay) this.closeDialog('overlay');
      return;
    }

    if (target.classList.contains('close')) {
      this.closeDialog('button');
    }
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (!this.hasAttribute('open')) return;
    if (event.key !== 'Escape') return;
    const canCloseOnEsc = toBooleanAttribute(this.getAttribute('close-on-esc'), true);
    if (!canCloseOnEsc) return;
    event.preventDefault();
    this.closeDialog('escape');
  }

  protected render() {
    const headless = this.hasAttribute('headless');
    const title = this.getAttribute('title') || '';
    const description = this.getAttribute('description') || '';
    const closable = toBooleanAttribute(this.getAttribute('closable'), true);
    const hasTitle = Boolean(title || this.querySelector('[slot="title"]'));
    const hasDescription = Boolean(description || this.querySelector('[slot="description"]'));

    const titleId = `ui-dialog-title-${this._uid}`;
    const descId = `ui-dialog-description-${this._uid}`;

    this.setContent(`
      ${headless ? '' : `<style>${style}</style>`}
      <div class="overlay" part="overlay" aria-hidden="true"></div>
      <section
        class="panel"
        part="panel"
        role="dialog"
        aria-modal="true"
        ${hasTitle ? `aria-labelledby="${titleId}"` : ''}
        ${hasDescription ? `aria-describedby="${descId}"` : ''}
      >
        ${closable ? '<button class="close" part="close" aria-label="Close dialog">✕</button>' : ''}
        ${hasTitle || hasDescription ? `
          <header class="header" part="header">
            <h2 id="${titleId}" class="title" part="title"><slot name="title">${title}</slot></h2>
            <p id="${descId}" class="description" part="description"><slot name="description">${description}</slot></p>
          </header>
        ` : ''}
        <div class="body" part="body">
          <slot></slot>
        </div>
      </section>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-dialog')) {
  customElements.define('ui-dialog', UIDialog);
}
