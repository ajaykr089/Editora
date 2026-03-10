import { ElementBase } from '../ElementBase';
import {
  createPositioner,
  type PositionerHandle,
  type PositionerPlacement,
  type PositionerStrategy,
  type PositionerState
} from '../primitives/positioner';

const style = `
  :host {
    display: contents;
    color-scheme: light dark;
  }
`;

function parseNumber(value: string | null, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isTruthy(value: string | null): boolean {
  if (value == null) return false;
  const normalized = value.toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function parsePlacement(value: string | null): PositionerPlacement {
  const allowed = new Set<PositionerPlacement>([
    'top',
    'top-start',
    'top-end',
    'right',
    'right-start',
    'right-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end'
  ]);
  return allowed.has(value as PositionerPlacement) ? (value as PositionerPlacement) : 'bottom';
}

function parseStrategy(value: string | null): PositionerStrategy {
  return value === 'absolute' ? 'absolute' : 'fixed';
}

export class UIPositioner extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'placement',
      'strategy',
      'offset',
      'cross-offset',
      'flip',
      'shift',
      'match-width',
      'fit-viewport',
      'anchor',
      'headless'
    ];
  }

  private _positioner: PositionerHandle | null = null;
  private _observer: MutationObserver | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._observer = new MutationObserver(() => this._syncPositioner());
    this._observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ['slot', 'id'] });
    this._syncPositioner();
  }

  disconnectedCallback(): void {
    this._observer?.disconnect();
    this._observer = null;
    this._destroyPositioner();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this._syncPositioner();
  }

  open(): void {
    this.setAttribute('open', '');
  }

  close(): void {
    this.removeAttribute('open');
  }

  updatePosition(): void {
    this._positioner?.update();
  }

  private _destroyPositioner(): void {
    this._positioner?.destroy();
    this._positioner = null;
  }

  private _resolveAnchor(): HTMLElement | null {
    const selector = this.getAttribute('anchor');
    if (selector) {
      const root = this.getRootNode();
      const inRoot = root instanceof ShadowRoot || root instanceof Document ? root.querySelector(selector) : null;
      if (inRoot instanceof HTMLElement) return inRoot;
      const inDocument = document.querySelector(selector);
      if (inDocument instanceof HTMLElement) return inDocument;
    }
    const slotted = this.querySelector('[slot="anchor"]');
    return slotted instanceof HTMLElement ? slotted : null;
  }

  private _resolveFloating(): HTMLElement | null {
    const slotted = this.querySelector('[slot="content"]');
    if (slotted instanceof HTMLElement) return slotted;
    return Array.from(this.children).find((child) => child.getAttribute('slot') !== 'anchor') as HTMLElement | null;
  }

  private _syncPositioner(): void {
    if (!this.isConnected) return;
    if (this.hasAttribute('headless') || !this.hasAttribute('open')) {
      this._destroyPositioner();
      return;
    }

    const anchor = this._resolveAnchor();
    const floating = this._resolveFloating();
    if (!(anchor instanceof HTMLElement) || !(floating instanceof HTMLElement)) {
      this._destroyPositioner();
      return;
    }

    this._destroyPositioner();
    this._positioner = createPositioner({
      anchor,
      floating,
      placement: parsePlacement(this.getAttribute('placement')),
      strategy: parseStrategy(this.getAttribute('strategy')),
      offset: parseNumber(this.getAttribute('offset'), 8),
      crossOffset: parseNumber(this.getAttribute('cross-offset'), 0),
      flip: !this.hasAttribute('flip') || isTruthy(this.getAttribute('flip')),
      shift: !this.hasAttribute('shift') || isTruthy(this.getAttribute('shift')),
      matchWidth: isTruthy(this.getAttribute('match-width')),
      fitViewport: isTruthy(this.getAttribute('fit-viewport')),
      arrow: this.querySelector('[slot="arrow"], .arrow') as HTMLElement | null,
      onUpdate: (detail: PositionerState) => {
        this.dispatchEvent(new CustomEvent('position-change', { detail, bubbles: true, composed: true }));
      }
    });
  }

  protected render(): void {
    this.setContent(`<style>${style}</style><slot name="anchor"></slot><slot name="content"></slot><slot></slot>`);
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-positioner')) {
  customElements.define('ui-positioner', UIPositioner);
}
