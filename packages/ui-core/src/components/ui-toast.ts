import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    color-scheme: light dark;
    position: fixed;
    z-index: 9999;
    top: 24px;
    right: 24px;
    pointer-events: none;
    width: auto;
    max-width: 360px;
    --ui-toast-bg: color-mix(in srgb, var(--ui-color-text, #0f172a) 88%, #ffffff 12%);
    --ui-toast-text: #ffffff;
    --ui-toast-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 34%, transparent);
    --ui-toast-shadow: 0 16px 34px rgba(2, 6, 23, 0.32);
    --ui-toast-focus: var(--ui-color-focus-ring, #93c5fd);
  }
  .toast-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  .toast {
    position: relative;
    background: var(--ui-toast-bg);
    color: var(--ui-toast-text);
    border: 1px solid var(--ui-toast-border);
    border-radius: 8px;
    box-shadow: var(--ui-toast-shadow);
    padding: 16px 20px;
    font-size: 15px;
    opacity: 0;
    transform: translateY(-16px);
    pointer-events: auto;
    transition: opacity 0.18s, transform 0.18s;
    min-width: 120px;
    max-width: 360px;
    outline: none;
  }
  .toast.show {
    opacity: 1;
    transform: translateY(0);
  }
  .toast[aria-live] { pointer-events: auto; }
  .toast button.close {
    background: none;
    border: none;
    color: var(--ui-toast-text);
    font-size: 18px;
    position: absolute;
    top: 8px;
    right: 12px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.18s;
  }
  .toast button.close:hover { opacity: 1; }

  .toast button.close:focus-visible {
    outline: 2px solid var(--ui-toast-focus);
    outline-offset: 1px;
  }
  :host([headless]) { display: none; }

  @media (prefers-reduced-motion: reduce) {
    .toast,
    .toast button.close {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .toast {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-toast-bg: Canvas;
      --ui-toast-text: CanvasText;
      --ui-toast-border: CanvasText;
      --ui-toast-shadow: none;
      --ui-toast-focus: Highlight;
    }

    .toast,
    .toast button.close {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

let toastId = 0;
type ToastItem = {
  id: number;
  message: string;
  duration: number;
  type: string;
  ariaLive: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class UIToast extends ElementBase {
  private _toasts: ToastItem[] = [];
  private _timeoutMap: Map<number, ReturnType<typeof setTimeout>> = new Map();
  private _onRootClick: (e: Event) => void;
  static get observedAttributes() {
    return ['headless'];
  }

  constructor() {
    super();
    this._toasts = [];
    this._timeoutMap = new Map();
    this._onRootClick = this._handleRootClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-live', 'polite');
    this.setAttribute('role', 'region');
    this.root.addEventListener('click', this._onRootClick as EventListener);
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    this._clearAllTimeouts();
    super.disconnectedCallback();
  }

  get headless() {
    return this.hasAttribute('headless');
  }
  set headless(val: boolean) {
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  show(message: string, opts: any = {}) {
    const id = ++toastId;
    const toast = {
      id,
      message: String(message ?? ''),
      duration: opts.duration || 3000,
      type: opts.type || 'info',
      ariaLive: opts.ariaLive || 'polite',
    };
    this._toasts.push(toast);
    this.requestRender();
    this.dispatchEvent(new CustomEvent('show', { detail: { id, message }, bubbles: true }));
    if (toast.duration > 0) {
      const timeout = setTimeout(() => this.hide(id), toast.duration);
      this._timeoutMap.set(id, timeout);
    }
    return id;
  }

  hide(id: number) {
    this._toasts = this._toasts.filter(t => t.id !== id);
    this.requestRender();
    this.dispatchEvent(new CustomEvent('hide', { detail: { id }, bubbles: true }));
    if (this._timeoutMap.has(id)) {
      clearTimeout(this._timeoutMap.get(id));
      this._timeoutMap.delete(id);
    }
  }

  _clearAllTimeouts() {
    for (const timeout of this._timeoutMap.values()) {
      clearTimeout(timeout);
    }
    this._timeoutMap.clear();
  }

  private _handleRootClick(e: Event) {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const closeBtn = target.closest('button.close[data-toast-id]') as HTMLButtonElement | null;
    if (!closeBtn) return;
    const id = Number(closeBtn.getAttribute('data-toast-id'));
    if (!Number.isNaN(id)) this.hide(id);
  }

  protected render() {
    this.setContent(`
      <style>${style}</style>
      <div class="toast-list" aria-live="polite">
        ${this._toasts.map(toast => `
          <div class="toast show" role="status" aria-live="${toast.ariaLive}" tabindex="0">
            <span>${escapeHtml(toast.message)}</span>
            <button class="close" data-toast-id="${toast.id}" aria-label="Close">&times;</button>
          </div>
        `).join('')}
      </div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-toast')) {
  customElements.define('ui-toast', UIToast);
}
