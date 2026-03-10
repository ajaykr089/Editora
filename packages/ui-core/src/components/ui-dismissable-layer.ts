import { ElementBase } from '../ElementBase';
import {
  createDismissableLayer,
  type DismissableLayerHandle,
  type DismissableLayerReason
} from '../primitives/dismissable-layer';

const style = `
  :host {
    display: contents;
    color-scheme: light dark;
  }
`;

function isTruthy(value: string | null): boolean {
  if (value == null) return false;
  const normalized = value.toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

export class UIDismissableLayer extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'modal',
      'close-on-escape',
      'close-on-pointer-outside',
      'close-on-focus-outside',
      'disable-outside-pointer-events',
      'headless'
    ];
  }

  private _layer: DismissableLayerHandle | null = null;
  private _lastCloseDetail: { reason: DismissableLayerReason; originalEvent?: Event } | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._syncLayer();
  }

  disconnectedCallback(): void {
    this._destroyLayer();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'open' && oldValue !== null && newValue === null) {
      const detail = this._lastCloseDetail || { reason: 'programmatic' as DismissableLayerReason };
      this._destroyLayer();
      this.dispatchEvent(new CustomEvent('close', { detail, bubbles: true, composed: true }));
      this._lastCloseDetail = null;
      return;
    }
    if (name === 'open' && newValue !== null) {
      this._syncLayer();
      return;
    }
    this._syncLayer();
  }

  open(): void {
    this.setAttribute('open', '');
  }

  close(reason: DismissableLayerReason = 'programmatic'): void {
    if (!this.hasAttribute('open')) return;
    if (!this._emitBeforeClose(reason)) return;
    this._lastCloseDetail = { reason };
    this.removeAttribute('open');
  }

  toggle(): void {
    if (this.hasAttribute('open')) this.close();
    else this.open();
  }

  private _emitBeforeClose(reason: DismissableLayerReason, originalEvent?: Event): boolean {
    const event = new CustomEvent('before-close', {
      detail: { reason, originalEvent },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    return this.dispatchEvent(event);
  }

  private _destroyLayer(): void {
    this._layer?.destroy();
    this._layer = null;
  }

  private _syncLayer(): void {
    if (!this.isConnected) return;
    if (this.hasAttribute('headless') || !this.hasAttribute('open')) {
      this._destroyLayer();
      return;
    }

    this._destroyLayer();
    this._layer = createDismissableLayer({
      node: this,
      trigger: this.querySelector('[slot="trigger"]') as HTMLElement | null,
      modal: isTruthy(this.getAttribute('modal')),
      closeOnEscape: !this.hasAttribute('close-on-escape') || isTruthy(this.getAttribute('close-on-escape')),
      closeOnPointerOutside:
        !this.hasAttribute('close-on-pointer-outside') || isTruthy(this.getAttribute('close-on-pointer-outside')),
      closeOnFocusOutside: isTruthy(this.getAttribute('close-on-focus-outside')),
      disableOutsidePointerEvents: isTruthy(this.getAttribute('disable-outside-pointer-events')),
      onBeforeDismiss: (reason, originalEvent) => {
        if (reason === 'outside-pointer') {
          this.dispatchEvent(
            new CustomEvent('interact-outside', {
              detail: { originalEvent },
              bubbles: true,
              composed: true
            })
          );
        }
        if (reason === 'escape-key') {
          this.dispatchEvent(
            new CustomEvent('escape-key-down', {
              detail: { originalEvent },
              bubbles: true,
              composed: true
            })
          );
        }
        return this._emitBeforeClose(reason, originalEvent);
      },
      onDismiss: (reason, originalEvent) => {
        this._lastCloseDetail = { reason, originalEvent };
        this.removeAttribute('open');
      }
    });
  }

  protected render(): void {
    this.setContent(`<style>${style}</style><slot name="trigger"></slot><slot></slot>`);
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-dismissable-layer')) {
  customElements.define('ui-dismissable-layer', UIDismissableLayer);
}
