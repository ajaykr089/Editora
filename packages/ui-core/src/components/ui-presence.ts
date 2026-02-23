import { ElementBase } from '../ElementBase';

type PresenceMode = 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'blur' | 'flip';
type PresenceSize = 'sm' | 'md' | 'lg';
type PresenceVariant = 'default' | 'soft' | 'glass' | 'contrast';

const style = `
  :host {
    --ui-presence-duration-enter: 180ms;
    --ui-presence-duration-exit: 150ms;
    --ui-presence-ease-enter: cubic-bezier(0.2, 0.9, 0.24, 1);
    --ui-presence-ease-exit: cubic-bezier(0.4, 0, 0.2, 1);
    --ui-presence-scale-enter: 1;
    --ui-presence-scale-exit: 0.96;
    --ui-presence-slide-distance: 14px;
    --ui-presence-filter-enter: none;
    --ui-presence-filter-exit: none;
    --ui-presence-perspective: 860px;
    --ui-presence-color: var(--ui-color-text, inherit);
    display: contents;
    color: var(--ui-presence-color);
    color-scheme: light dark;
  }

  .presence {
    display: block;
    transform-origin: center;
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(var(--ui-presence-scale-exit));
    filter: var(--ui-presence-filter-exit);
    pointer-events: none;
    transition:
      opacity var(--ui-presence-duration-enter) var(--ui-presence-ease-enter),
      transform var(--ui-presence-duration-enter) var(--ui-presence-ease-enter),
      filter var(--ui-presence-duration-enter) var(--ui-presence-ease-enter);
    will-change: opacity, transform, filter;
    perspective: var(--ui-presence-perspective);
  }

  .presence[data-state="entering"],
  .presence[data-state="present"] {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(var(--ui-presence-scale-enter));
    filter: var(--ui-presence-filter-enter);
    pointer-events: auto;
  }

  .presence[data-state="exiting"] {
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(var(--ui-presence-scale-exit));
    filter: var(--ui-presence-filter-exit);
    pointer-events: none;
    transition-duration: var(--ui-presence-duration-exit);
    transition-timing-function: var(--ui-presence-ease-exit);
  }

  :host([mode="fade"]) {
    --ui-presence-scale-enter: 1;
    --ui-presence-scale-exit: 1;
  }

  :host([mode="scale"]) {
    --ui-presence-scale-enter: 1;
    --ui-presence-scale-exit: 0.96;
  }

  :host([mode="slide-up"]) .presence[data-state="hidden"],
  :host([mode="slide-up"]) .presence[data-state="exiting"] {
    transform: translate3d(0, var(--ui-presence-slide-distance), 0) scale(var(--ui-presence-scale-exit));
  }

  :host([mode="slide-down"]) .presence[data-state="hidden"],
  :host([mode="slide-down"]) .presence[data-state="exiting"] {
    transform: translate3d(0, calc(var(--ui-presence-slide-distance) * -1), 0) scale(var(--ui-presence-scale-exit));
  }

  :host([mode="slide-left"]) .presence[data-state="hidden"],
  :host([mode="slide-left"]) .presence[data-state="exiting"] {
    transform: translate3d(var(--ui-presence-slide-distance), 0, 0) scale(var(--ui-presence-scale-exit));
  }

  :host([mode="slide-right"]) .presence[data-state="hidden"],
  :host([mode="slide-right"]) .presence[data-state="exiting"] {
    transform: translate3d(calc(var(--ui-presence-slide-distance) * -1), 0, 0) scale(var(--ui-presence-scale-exit));
  }

  :host([mode="blur"]) {
    --ui-presence-filter-enter: none;
    --ui-presence-filter-exit: blur(10px);
    --ui-presence-scale-exit: 0.985;
  }

  :host([mode="flip"]) .presence {
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  :host([mode="flip"]) .presence[data-state="hidden"],
  :host([mode="flip"]) .presence[data-state="exiting"] {
    transform: rotateX(-12deg) scale(0.985);
  }

  :host([size="sm"]) {
    --ui-presence-slide-distance: 8px;
    --ui-presence-duration-enter: 140ms;
    --ui-presence-duration-exit: 120ms;
  }

  :host([size="lg"]) {
    --ui-presence-slide-distance: 22px;
    --ui-presence-duration-enter: 240ms;
    --ui-presence-duration-exit: 200ms;
  }

  :host([variant="soft"]) {
    --ui-presence-scale-exit: 0.98;
  }

  :host([variant="glass"]) {
    --ui-presence-filter-enter: none;
    --ui-presence-filter-exit: blur(8px);
    --ui-presence-scale-exit: 0.99;
  }

  :host([variant="contrast"]) {
    --ui-presence-duration-enter: 150ms;
    --ui-presence-duration-exit: 120ms;
    --ui-presence-ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
    --ui-presence-ease-exit: cubic-bezier(0.4, 0, 1, 1);
  }

  :host([headless]) .presence {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .presence {
      transition: none !important;
      transform: none !important;
      filter: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .presence {
      filter: none !important;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-presence-color: CanvasText;
    }

    .presence {
      forced-color-adjust: none;
      color: CanvasText;
    }
  }
`;

function booleanAttr(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function numberAttr(raw: string | null, fallback: number): number {
  if (raw == null || raw === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeMode(raw: string | null): PresenceMode {
  if (
    raw === 'scale' ||
    raw === 'slide-up' ||
    raw === 'slide-down' ||
    raw === 'slide-left' ||
    raw === 'slide-right' ||
    raw === 'blur' ||
    raw === 'flip'
  ) return raw;
  return 'fade';
}

function normalizeSize(raw: string | null): PresenceSize {
  if (raw === 'sm' || raw === 'lg') return raw;
  return 'md';
}

function normalizeVariant(raw: string | null): PresenceVariant {
  if (raw === 'soft' || raw === 'glass' || raw === 'contrast') return raw;
  return 'default';
}

type PresenceState = 'hidden' | 'entering' | 'present' | 'exiting';

export class UIPresence extends ElementBase {
  static get observedAttributes() {
    return [
      'present',
      'headless',
      'mode',
      'size',
      'variant',
      'keep-mounted',
      'lazy',
      'enter-duration',
      'exit-duration',
      'delay'
    ];
  }

  private _state: PresenceState = 'hidden';
  private _present = false;
  private _headless = false;
  private _hasEntered = false;
  private _delayTimer: number | null = null;
  private _presenceEl: HTMLElement | null = null;

  constructor() {
    super();
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._syncFromAttributes();
    this._syncStateWithPresence();
  }

  override disconnectedCallback(): void {
    if (this._delayTimer != null) {
      window.clearTimeout(this._delayTimer);
      this._delayTimer = null;
    }
    if (this._presenceEl) {
      this._presenceEl.removeEventListener('transitionend', this._onTransitionEnd as EventListener);
      this._presenceEl = null;
    }
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this._syncFromAttributes();
    this._syncStateWithPresence();
    this._syncNodePresentation();
  }

  show(): void {
    this.setAttribute('present', '');
  }

  hide(): void {
    this.removeAttribute('present');
  }

  toggle(): void {
    if (this._present) this.hide();
    else this.show();
  }

  private _syncFromAttributes(): void {
    this._present = this.hasAttribute('present');
    this._headless = this.hasAttribute('headless');
    normalizeMode(this.getAttribute('mode'));
    normalizeSize(this.getAttribute('size'));
    normalizeVariant(this.getAttribute('variant'));
  }

  private _syncStateWithPresence(): void {
    if (this._headless) {
      this._setState('hidden');
      return;
    }
    if (this._present) this._enter();
    else this._exit();
  }

  private _clearDelay(): void {
    if (this._delayTimer != null) {
      window.clearTimeout(this._delayTimer);
      this._delayTimer = null;
    }
  }

  private _enter(): void {
    this._clearDelay();
    const lazy = booleanAttr(this.getAttribute('lazy'), false);
    if (lazy && this._hasEntered) {
      this._setState('present');
      this._dispatch('after-enter');
      return;
    }

    const delay = Math.max(0, numberAttr(this.getAttribute('delay'), 0));
    this._dispatch('before-enter');
    const start = () => {
      this._setState('entering');
      requestAnimationFrame(() => {
        this._setState('present');
        this._hasEntered = true;
        this._dispatch('enter');
      });
    };
    if (delay > 0) {
      this._setState('hidden');
      this._delayTimer = window.setTimeout(() => {
        this._delayTimer = null;
        start();
      }, delay);
      return;
    }
    start();
  }

  private _exit(): void {
    this._clearDelay();
    if (this._state === 'hidden') return;
    this._dispatch('before-exit');
    this._setState('exiting');
    this._dispatch('exit');
  }

  private _setState(next: PresenceState): void {
    if (this._state === next) return;
    this._state = next;
    const node = this._presenceEl || (this.root.querySelector('.presence') as HTMLElement | null);
    this._presenceEl = node;
    if (node) {
      node.setAttribute('data-state', next);
    }
    this._syncNodePresentation();
    this.setAttribute('data-state', next);
  }

  private _syncNodePresentation(): void {
    const node = this._presenceEl || (this.root.querySelector('.presence') as HTMLElement | null);
    if (!node) return;
    this._presenceEl = node;

    const keepMounted = booleanAttr(this.getAttribute('keep-mounted'), false);
    const enterDuration = Math.max(0, numberAttr(this.getAttribute('enter-duration'), 180));
    const exitDuration = Math.max(0, numberAttr(this.getAttribute('exit-duration'), 150));
    const shouldDisplay = this._state !== 'hidden' || keepMounted;

    node.style.setProperty('--ui-presence-duration-enter', `${enterDuration}ms`);
    node.style.setProperty('--ui-presence-duration-exit', `${exitDuration}ms`);
    node.style.display = shouldDisplay ? 'block' : 'none';
  }

  private _onTransitionEnd(event: TransitionEvent): void {
    if (event.target !== event.currentTarget) return;
    if (this._state === 'entering' || this._state === 'present') {
      this._setState('present');
      this._dispatch('after-enter');
      return;
    }
    if (this._state !== 'exiting') return;
    const keepMounted = booleanAttr(this.getAttribute('keep-mounted'), false);
    if (!keepMounted) {
      this._setState('hidden');
    }
    this._dispatch('after-exit');
  }

  private _dispatch(type: string): void {
    this.dispatchEvent(new CustomEvent(type, { detail: { state: this._state }, bubbles: true }));
  }

  protected render(): void {
    const keepMounted = booleanAttr(this.getAttribute('keep-mounted'), false);
    const enterDuration = Math.max(0, numberAttr(this.getAttribute('enter-duration'), 180));
    const exitDuration = Math.max(0, numberAttr(this.getAttribute('exit-duration'), 150));
    const shouldDisplay = this._state !== 'hidden' || keepMounted;

    this.setContent(`
      <style>${style}</style>
      <div
        class="presence"
        part="presence"
        data-state="${this._state}"
        style="display:${shouldDisplay ? 'block' : 'none'};--ui-presence-duration-enter:${enterDuration}ms;--ui-presence-duration-exit:${exitDuration}ms;"
      >
        <slot></slot>
      </div>
    `);

    const node = this.root.querySelector('.presence') as HTMLElement | null;
    if (!node) return;
    this._presenceEl = node;
    node.removeEventListener('transitionend', this._onTransitionEnd as EventListener);
    node.addEventListener('transitionend', this._onTransitionEnd as EventListener);
    this._syncNodePresentation();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-presence')) {
  customElements.define('ui-presence', UIPresence);
}
