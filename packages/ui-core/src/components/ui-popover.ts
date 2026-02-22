import { ElementBase } from '../ElementBase';
import { showPortalFor } from '../portal';

const style = `
  .panel {
    color-scheme: light dark;
    --ui-popover-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-popover-text: var(--ui-color-text, #0f172a);
    --ui-popover-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-popover-shadow: 0 18px 42px rgba(2, 6, 23, 0.2);
    --ui-popover-focus: var(--ui-color-focus-ring, #2563eb);
    background: var(--ui-popover-bg);
    color: var(--ui-popover-text);
    border: 1px solid var(--ui-popover-border);
    border-radius: 10px;
    padding: 8px;
    box-shadow: var(--ui-popover-shadow);
    opacity: 0;
    transform: translateY(6px) scale(0.99);
    transition: opacity var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease), transform var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease);
    position: relative;
  }
  .panel.show { opacity: 1; transform: translateY(0) scale(1); }

  /* arrow (positioned from portal.ts when present) */
  .arrow {
    position: absolute;
    width: 12px;
    height: 12px;
    background: var(--ui-popover-bg);
    transform: rotate(45deg);
    box-shadow: -2px -2px 6px color-mix(in srgb, var(--ui-popover-text) 12%, transparent);
    left: 50%;
    top: -6px;
    margin-left: -6px;
    transition: left var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease), top var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease), opacity 120ms ease;
    will-change: left, top;
  }

  @media (prefers-reduced-motion: reduce) {
    .panel { transition: none !important; transform: none !important; }
  }

  @media (prefers-contrast: more) {
    .panel {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .panel {
      --ui-popover-bg: Canvas;
      --ui-popover-text: CanvasText;
      --ui-popover-border: CanvasText;
      --ui-popover-focus: Highlight;
      --ui-popover-shadow: none;
    }

    .panel,
    .arrow {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

export class UIPopover extends ElementBase {
  static get observedAttributes() { return ['open']; }
  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | undefined = undefined;
  private _onHostClick: (e: Event) => void;

  constructor() {
    super();
    this._onHostClick = this._handleHostClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._onHostClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onHostClick);
    super.disconnectedCallback();
  }

  private _handleHostClick(e: Event) {
    // support clicking any element inside a slotted trigger (use composedPath)
    const path = e.composedPath() as any[];
    const triggerEl = path.find(p => p && p.getAttribute && p.getAttribute('slot') === 'trigger') as HTMLElement | undefined;
    if (triggerEl) this.toggle();
  }

  open() { this.setAttribute('open',''); this.dispatchEvent(new CustomEvent('open')); }
  close() { this.removeAttribute('open'); this.dispatchEvent(new CustomEvent('close')); }
  toggle() { this.hasAttribute('open') ? this.close() : this.open(); }

  protected render() {
    this.setContent(`<slot name="trigger"></slot>`);
    if (this.hasAttribute('open')) {
      const panel = document.createElement('div');
      // add `show` so CSS animation/visibility is applied when portal is mounted
      panel.className = 'panel show';

      // arrow element: positioned by portal.showPortalFor if present
      const arrow = document.createElement('div');
      arrow.className = 'arrow';
      panel.appendChild(arrow);

      const sl = this.querySelector('[slot="content"]');
      if (sl) panel.appendChild(sl.cloneNode(true));
      if (!this._portalEl) this._portalEl = document.createElement('div');
      this._portalEl.innerHTML = '';
      const s = document.createElement('style'); s.textContent = style; this._portalEl.appendChild(s);
      this._portalEl.appendChild(panel);
      const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
      if (trigger) this._cleanup = showPortalFor(trigger, this._portalEl, { placement: 'bottom', shift: true });
    } else {
      if (this._cleanup) { this._cleanup(); this._cleanup = undefined; }
      this._portalEl = null;
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-popover')) {
  customElements.define('ui-popover', UIPopover);
}
