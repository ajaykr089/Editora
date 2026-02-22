import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    color-scheme: light dark;
    --ui-alert-radius: 12px;
    --ui-alert-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-alert-text: var(--ui-color-text, #0f172a);
    --ui-alert-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-alert-shadow: 0 22px 58px rgba(2, 6, 23, 0.24);
    --ui-alert-padding: 24px;
    --ui-alert-min-width: 320px;
    --ui-alert-max-width: 90vw;
    --ui-alert-z: 1001;
    --ui-alert-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-alert-backdrop: rgba(2, 6, 23, 0.48);
  }
  .backdrop {
    position: fixed;
    inset: 0;
    background: var(--ui-alert-backdrop);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dialog {
    background: var(--ui-alert-bg);
    color: var(--ui-alert-text);
    border: 1px solid var(--ui-alert-border);
    border-radius: var(--ui-alert-radius);
    box-shadow: var(--ui-alert-shadow);
    padding: var(--ui-alert-padding);
    min-width: var(--ui-alert-min-width);
    max-width: var(--ui-alert-max-width);
    z-index: var(--ui-alert-z);
    outline: none;
    transition: border-color 140ms ease, box-shadow 140ms ease, transform 160ms ease, opacity 160ms ease;
  }

  .dialog:focus-visible {
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--ui-alert-focus) 24%, transparent),
      var(--ui-alert-shadow);
    border-color: color-mix(in srgb, var(--ui-alert-focus) 45%, var(--ui-alert-border));
  }
  :host([headless]) .backdrop, :host([headless]) .dialog { display: none; }

  @media (prefers-reduced-motion: reduce) {
    .dialog {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .dialog {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-alert-bg: Canvas;
      --ui-alert-text: CanvasText;
      --ui-alert-border: CanvasText;
      --ui-alert-backdrop: rgba(0, 0, 0, 0.72);
      --ui-alert-shadow: none;
      --ui-alert-focus: Highlight;
    }

    .dialog {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


export class UIAlertDialog extends ElementBase {
  private _lastActive?: HTMLElement;
  static get observedAttributes() {
    return ['open', 'headless', 'aria-label'];
  }

  constructor() {
    super();
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onBackdropClick = this._onBackdropClick.bind(this);
    this._focusTrap = this._focusTrap.bind(this);
    this._lastActive = undefined;
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('mousedown', this._onBackdropClick as EventListener);
    if (this.open) {
      this._openDialog();
    }
  }

  disconnectedCallback() {
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('mousedown', this._onBackdropClick as EventListener);
    this._releaseFocusTrap();
    super.disconnectedCallback();
  }

  get open() {
    return this.hasAttribute('open');
  }
  set open(val: boolean) {
    if (val === this.open) return;
    if (val) {
      this.setAttribute('open', '');
      this._openDialog();
      return;
    }
    this._closeDialog('close');
  }

  get headless() {
    return this.hasAttribute('headless');
  }
  set headless(val: boolean) {
    if (val === this.headless) return;
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  _onKeyDown(e: KeyboardEvent) {
    if (!this.open) return;
    if (e.key === 'Escape') {
      e.stopPropagation();
      this._closeDialog('cancel');
    } else if (e.key === 'Tab') {
      this._focusTrap(e);
    }
  }

  _onBackdropClick(e: MouseEvent) {
    if (!this.open) return;
    const target = e.target as HTMLElement;
    if (target.classList.contains('backdrop')) {
      this._closeDialog('cancel');
    }
  }

  _openDialog() {
    this._lastActive = document.activeElement as HTMLElement;
    setTimeout(() => {
      const dialog = this.root.querySelector('.dialog') as HTMLElement;
      if (dialog) dialog.focus();
    }, 0);
    this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
    this._trapFocus();
  }

  _closeDialog(reason = 'close') {
    this.removeAttribute('open');
    this._releaseFocusTrap();
    if (this._lastActive && typeof this._lastActive.focus === 'function') {
      setTimeout(() => this._lastActive?.focus(), 0);
    }
    this.dispatchEvent(new CustomEvent(reason, { bubbles: true }));
  }

  _trapFocus() {
    document.addEventListener('focus', this._focusTrap, true);
  }

  _releaseFocusTrap() {
    document.removeEventListener('focus', this._focusTrap, true);
  }

  _focusTrap(e: any) {
    if (!this.open) return;
    const dialog = this.root.querySelector('.dialog') as HTMLElement;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.type === 'focus') {
      if (!dialog.contains(e.target)) {
        e.stopPropagation();
        first.focus();
      }
    } else if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  protected render() {
    const open = this.open;
    const headless = this.headless;
    this.setContent(open ? `
      <style>${style}</style>
      <div class="backdrop" role="presentation">
        <div class="dialog" role="alertdialog" aria-modal="true" aria-label="${escapeHtml(this.getAttribute('aria-label') || 'Alert dialog')}" tabindex="0">
          <slot></slot>
        </div>
      </div>
    ` : '');
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-alert-dialog')) {
  customElements.define('ui-alert-dialog', UIAlertDialog);
}
