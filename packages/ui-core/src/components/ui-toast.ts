import { ElementBase } from '../ElementBase';

type ToastTone = 'info' | 'success' | 'warning' | 'error' | 'loading' | 'neutral';

type ToastItem = {
  id: number;
  message: string;
  duration: number;
  tone: ToastTone;
  ariaLive: 'off' | 'polite' | 'assertive';
  createdAt: number;
  closing: boolean;
};

type ToastTimer = {
  timeout: ReturnType<typeof setTimeout>;
  startedAt: number;
  remaining: number;
  paused: boolean;
};

const DEFAULT_DURATION = 3200;
const EXIT_DURATION = 170;

const style = `
  :host {
    display: block;
    color-scheme: light dark;
    position: fixed;
    z-index: 9999;
    top: 20px;
    right: 20px;
    pointer-events: none;
    width: min(360px, calc(100vw - 24px));

    --ui-toast-gap: 10px;
    --ui-toast-radius: 12px;
    --ui-toast-padding-y: 10px;
    --ui-toast-padding-x: 12px;
    --ui-toast-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-toast-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, var(--ui-color-text, #0f172a) 8%);
    --ui-toast-color: var(--ui-color-text, #0f172a);
    --ui-toast-muted: var(--ui-color-muted, #64748b);
    --ui-toast-shadow:
      none;
    --ui-toast-focus-ring: var(--ui-color-focus-ring, #2563eb);
  }

  :host([position="top-left"]) {
    left: 20px;
    right: auto;
  }

  :host([position="top-center"]) {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }

  :host([position="bottom-left"]) {
    top: auto;
    bottom: 20px;
    left: 20px;
    right: auto;
  }

  :host([position="bottom-center"]) {
    top: auto;
    bottom: 20px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }

  :host([position="bottom-right"]) {
    top: auto;
    bottom: 20px;
    right: 20px;
  }

  .toast-list {
    display: grid;
    gap: var(--ui-toast-gap);
    width: 100%;
  }

  .toast {
    pointer-events: auto;
    position: relative;
    display: grid;
    gap: 3px;
    border: 1px solid var(--ui-toast-border-color);
    border-radius: var(--ui-toast-radius);
    background: var(--ui-toast-bg);
    color: var(--ui-toast-color);
    box-shadow: var(--ui-toast-shadow);
    min-height: 56px;
    padding: var(--ui-toast-padding-y) var(--ui-toast-padding-x);
    padding-inline-end: calc(var(--ui-toast-padding-x) + 26px);
    font: 550 13px/1.4 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    opacity: 0;
    transform: translate3d(0, -8px, 0) scale(0.98);
    transition: opacity 170ms ease, transform 170ms ease;
    will-change: transform, opacity;
    outline: none;
  }

  .toast.show {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }

  .toast.closing {
    opacity: 0;
    transform: translate3d(0, -6px, 0) scale(0.98);
  }

  .toast[data-tone="success"] {
    --ui-toast-border-color: color-mix(in srgb, var(--ui-color-success, #16a34a) 38%, var(--ui-color-border, #cbd5e1));
    --ui-toast-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 10%, var(--ui-color-surface, #ffffff));
  }

  .toast[data-tone="warning"] {
    --ui-toast-border-color: color-mix(in srgb, var(--ui-color-warning, #d97706) 38%, var(--ui-color-border, #cbd5e1));
    --ui-toast-bg: color-mix(in srgb, var(--ui-color-warning, #d97706) 10%, var(--ui-color-surface, #ffffff));
  }

  .toast[data-tone="error"] {
    --ui-toast-border-color: color-mix(in srgb, var(--ui-color-danger, #dc2626) 40%, var(--ui-color-border, #cbd5e1));
    --ui-toast-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 12%, var(--ui-color-surface, #ffffff));
  }

  .toast[data-tone="loading"] {
    --ui-toast-border-color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 36%, var(--ui-color-border, #cbd5e1));
  }

  .message {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .meta {
    color: var(--ui-toast-muted);
    font-size: 11px;
    line-height: 1.35;
  }

  .close {
    position: absolute;
    top: 8px;
    right: 8px;
    inline-size: 24px;
    block-size: 24px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--ui-toast-muted);
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    transition: background-color 140ms ease, color 140ms ease;
  }

  .close:hover {
    background: color-mix(in srgb, var(--ui-toast-color) 8%, transparent);
    color: var(--ui-toast-color);
  }

  .close:focus-visible {
    outline: 2px solid var(--ui-toast-focus-ring);
    outline-offset: 1px;
  }

  :host([headless]) {
    display: none;
  }

  @media (max-width: 560px) {
    :host {
      inset-inline: 12px;
      top: 12px;
      right: auto;
      width: auto;
      transform: none;
    }

    :host([position="bottom-left"]),
    :host([position="bottom-center"]),
    :host([position="bottom-right"]) {
      top: auto;
      bottom: 12px;
      left: 12px;
      right: 12px;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .toast,
    .close {
      transition: none !important;
      animation: none !important;
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
      --ui-toast-color: CanvasText;
      --ui-toast-muted: CanvasText;
      --ui-toast-border-color: CanvasText;
      --ui-toast-shadow: none;
      --ui-toast-focus-ring: Highlight;
    }

    .toast,
    .close {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }

    .close {
      border: 1px solid CanvasText;
    }
  }
`;

let toastId = 0;

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeTone(value: string | null | undefined): ToastTone {
  const tone = String(value || '').toLowerCase();
  if (tone === 'success' || tone === 'warning' || tone === 'error' || tone === 'loading' || tone === 'neutral') {
    return tone;
  }
  return 'info';
}

function normalizeDuration(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_DURATION;
  return Math.max(0, Math.trunc(parsed));
}

function normalizeLive(value: unknown): 'off' | 'polite' | 'assertive' {
  const live = String(value || 'polite').toLowerCase();
  if (live === 'off' || live === 'assertive') return live;
  return 'polite';
}

export class UIToast extends ElementBase {
  private _toasts: ToastItem[] = [];
  private _timerMap: Map<number, ToastTimer> = new Map();
  private _exitMap: Map<number, ReturnType<typeof setTimeout>> = new Map();
  private _onRootClick: (e: Event) => void;
  private _onRootMouseEnter: (e: Event) => void;
  private _onRootMouseLeave: (e: Event) => void;
  private _onRootFocusIn: (e: Event) => void;
  private _onRootFocusOut: (e: Event) => void;

  static get observedAttributes() {
    return ['headless', 'position', 'max-visible'];
  }

  constructor() {
    super();
    this._onRootClick = this._handleRootClick.bind(this);
    this._onRootMouseEnter = this._handleRootMouseEnter.bind(this);
    this._onRootMouseLeave = this._handleRootMouseLeave.bind(this);
    this._onRootFocusIn = this._handleRootFocusIn.bind(this);
    this._onRootFocusOut = this._handleRootFocusOut.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('aria-live', 'polite');
    this.setAttribute('role', 'region');
    this.root.addEventListener('click', this._onRootClick as EventListener);
    this.root.addEventListener('mouseenter', this._onRootMouseEnter as EventListener, true);
    this.root.addEventListener('mouseleave', this._onRootMouseLeave as EventListener, true);
    this.root.addEventListener('focusin', this._onRootFocusIn as EventListener);
    this.root.addEventListener('focusout', this._onRootFocusOut as EventListener);
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    this.root.removeEventListener('mouseenter', this._onRootMouseEnter as EventListener, true);
    this.root.removeEventListener('mouseleave', this._onRootMouseLeave as EventListener, true);
    this.root.removeEventListener('focusin', this._onRootFocusIn as EventListener);
    this.root.removeEventListener('focusout', this._onRootFocusOut as EventListener);
    this._clearAllTimers();
    super.disconnectedCallback();
  }

  get headless(): boolean {
    return this.hasAttribute('headless');
  }

  set headless(val: boolean) {
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  show(message: string, opts: Record<string, unknown> = {}): number {
    const id = ++toastId;
    const tone = normalizeTone(opts.type as string | undefined);
    const duration = normalizeDuration(opts.duration);
    const ariaLive = normalizeLive(opts.ariaLive);

    const toast: ToastItem = {
      id,
      message: String(message ?? ''),
      duration,
      tone,
      ariaLive,
      createdAt: Date.now(),
      closing: false,
    };

    this._toasts.push(toast);
    this._trimVisibleToasts();
    this.requestRender();

    this.dispatchEvent(new CustomEvent('show', { detail: { id, message: toast.message, type: tone }, bubbles: true }));

    this._scheduleAutoHide(id, duration);
    return id;
  }

  hide(id: number): void {
    const toast = this._toasts.find((entry) => entry.id === id);
    if (!toast || toast.closing) return;

    toast.closing = true;
    this._clearToastTimer(id);
    this.requestRender();

    const existingExit = this._exitMap.get(id);
    if (existingExit) clearTimeout(existingExit);

    const exitTimer = setTimeout(() => {
      this._exitMap.delete(id);
      const previousLength = this._toasts.length;
      this._toasts = this._toasts.filter((entry) => entry.id !== id);
      if (this._toasts.length === previousLength) return;
      this.requestRender();
      this.dispatchEvent(new CustomEvent('hide', { detail: { id }, bubbles: true }));
    }, EXIT_DURATION);

    this._exitMap.set(id, exitTimer);
  }

  private _maxVisible(): number {
    const parsed = Number(this.getAttribute('max-visible'));
    if (!Number.isFinite(parsed)) return 5;
    return Math.max(1, Math.trunc(parsed));
  }

  private _trimVisibleToasts(): void {
    const visible = this._toasts.filter((entry) => !entry.closing);
    const maxVisible = this._maxVisible();
    if (visible.length <= maxVisible) return;

    const removable = [...visible]
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(0, visible.length - maxVisible);

    removable.forEach((entry) => this.hide(entry.id));
  }

  private _scheduleAutoHide(id: number, duration: number): void {
    this._clearToastTimer(id);
    if (duration <= 0) return;

    const startedAt = Date.now();
    const timeout = setTimeout(() => {
      this._timerMap.delete(id);
      this.hide(id);
    }, duration);

    this._timerMap.set(id, { timeout, startedAt, remaining: duration, paused: false });
  }

  private _pauseToast(id: number): void {
    const timer = this._timerMap.get(id);
    if (!timer) return;
    if (timer.paused) return;

    clearTimeout(timer.timeout);
    const elapsed = Date.now() - timer.startedAt;
    timer.remaining = Math.max(0, timer.remaining - elapsed);
    timer.paused = true;
    this._timerMap.set(id, timer);
  }

  private _resumeToast(id: number): void {
    const timer = this._timerMap.get(id);
    if (!timer) return;
    if (!timer.paused) return;

    const nextDuration = Math.max(0, timer.remaining);
    this._scheduleAutoHide(id, nextDuration);
  }

  private _clearToastTimer(id: number): void {
    const timer = this._timerMap.get(id);
    if (timer) {
      clearTimeout(timer.timeout);
      this._timerMap.delete(id);
    }

    const exit = this._exitMap.get(id);
    if (exit) {
      clearTimeout(exit);
      this._exitMap.delete(id);
    }
  }

  private _clearAllTimers(): void {
    for (const timer of this._timerMap.values()) clearTimeout(timer.timeout);
    this._timerMap.clear();

    for (const timeout of this._exitMap.values()) clearTimeout(timeout);
    this._exitMap.clear();
  }

  private _closestToastId(target: EventTarget | null): number | null {
    const element = target instanceof HTMLElement ? target : null;
    const toast = element?.closest('.toast[data-toast-id]') as HTMLElement | null;
    if (!toast) return null;
    const id = Number(toast.getAttribute('data-toast-id'));
    return Number.isFinite(id) ? id : null;
  }

  private _handleRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const closeBtn = target.closest('button.close[data-toast-id]') as HTMLButtonElement | null;
    if (!closeBtn) return;

    event.preventDefault();
    const id = Number(closeBtn.getAttribute('data-toast-id'));
    if (!Number.isNaN(id)) this.hide(id);
  }

  private _handleRootMouseEnter(event: Event): void {
    const id = this._closestToastId(event.target);
    if (id == null) return;
    this._pauseToast(id);
  }

  private _handleRootMouseLeave(event: Event): void {
    const id = this._closestToastId(event.target);
    if (id == null) return;
    const currentToast = (event.target as HTMLElement | null)?.closest('.toast[data-toast-id]') as HTMLElement | null;
    const next = (event as MouseEvent).relatedTarget as Node | null;
    if (next && currentToast?.contains(next)) return;
    this._resumeToast(id);
  }

  private _handleRootFocusIn(event: Event): void {
    const id = this._closestToastId(event.target);
    if (id == null) return;
    this._pauseToast(id);
  }

  private _handleRootFocusOut(event: Event): void {
    const id = this._closestToastId(event.target);
    if (id == null) return;

    const next = (event as FocusEvent).relatedTarget as Node | null;
    const currentToast = (event.target as HTMLElement | null)?.closest('.toast[data-toast-id]') as HTMLElement | null;
    if (next && currentToast?.contains(next)) return;

    this._resumeToast(id);
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="toast-list" aria-live="polite" part="list">
        ${this._toasts.map((toast) => {
          const role = toast.ariaLive === 'assertive' || toast.tone === 'error' ? 'alert' : 'status';
          const meta = toast.duration > 0 ? '<span class="meta" part="meta">Auto-dismiss</span>' : '<span class="meta" part="meta">Persistent</span>';

          return `
            <article
              class="toast show${toast.closing ? ' closing' : ''}"
              part="toast"
              data-toast-id="${toast.id}"
              data-tone="${toast.tone}"
              role="${role}"
              aria-live="${toast.ariaLive}"
              tabindex="0"
            >
              <span class="message" part="message">${escapeHtml(toast.message)}</span>
              ${meta}
              <button class="close" part="close" data-toast-id="${toast.id}" aria-label="Close notification" type="button">
                <span aria-hidden="true">&times;</span>
              </button>
            </article>
          `;
        }).join('')}
      </div>
    `);
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): boolean {
    if (oldValue === newValue) return false;
    return name === 'headless' || name === 'position' || name === 'max-visible';
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-toast')) {
  customElements.define('ui-toast', UIToast);
}
