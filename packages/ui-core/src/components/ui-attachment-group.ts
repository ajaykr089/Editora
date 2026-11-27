import { ElementBase } from '../ElementBase';
import './ui-attachment';

/**
 * A row of attachments that scrolls sideways with snapping, fading at the edge that has more.
 * Give it an `aria-label` ("Attached files"): it is then a named group, and when its items are not
 * interactive the row itself takes focus so keyboard users can scroll it. `wrap` lays the items
 * out in wrapping rows instead.
 */
const style = `
  :host {
    color-scheme: light dark;
    display: block;
    min-inline-size: 0;
  }
  :host([hidden]) { display: none; }
  .row {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: thin;
    padding-block: 2px;
    outline: none;
    -webkit-mask-image: linear-gradient(to right, transparent 0, #000 var(--fade-start, 0px), #000 calc(100% - var(--fade-end, 0px)), transparent 100%);
    mask-image: linear-gradient(to right, transparent 0, #000 var(--fade-start, 0px), #000 calc(100% - var(--fade-end, 0px)), transparent 100%);
  }
  .row:focus-visible { box-shadow: 0 0 0 2px var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb)); border-radius: 6px; }
  :host([wrap]) .row { flex-wrap: wrap; overflow: visible; -webkit-mask-image: none; mask-image: none; }
  ::slotted(*) { flex: none; scroll-snap-align: start; }
`;

export class UIAttachmentGroup extends ElementBase {
  private row: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
    this.root.addEventListener('slotchange', () => this.syncFocusable());
  }

  override connectedCallback(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'group');
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    super.disconnectedCallback();
  }

  private syncFades(): void {
    const row = this.row;
    if (!row) return;
    const rtl = getComputedStyle(this).direction === 'rtl';
    const max = row.scrollWidth - row.clientWidth;
    const pos = Math.abs(row.scrollLeft);
    const before = pos > 1 ? '24px' : '0px';
    const after = pos < max - 1 ? '24px' : '0px';
    row.style.setProperty('--fade-start', rtl ? after : before);
    row.style.setProperty('--fade-end', rtl ? before : after);
  }

  /** A row whose items take no focus is made focusable itself, so it can be scrolled by keyboard. */
  private syncFocusable(): void {
    const row = this.row;
    if (!row) return;
    const interactive = this.querySelector('a[href], button, [tabindex], ui-attachment[href], ui-attachment[removable]');
    const scrolls = row.scrollWidth > row.clientWidth + 1;
    if (!interactive && scrolls) {
      row.tabIndex = 0;
      row.setAttribute('role', 'region');
      row.setAttribute('aria-label', this.getAttribute('aria-label') || 'Attachments');
    } else {
      row.removeAttribute('tabindex');
      row.removeAttribute('role');
      row.removeAttribute('aria-label');
    }
    this.syncFades();
  }

  protected override render(): void {
    this.setContent(`<style>${style}</style><div class="row" part="row"><slot></slot></div>`);
    const row = this.root.querySelector('.row') as HTMLElement;
    if (row === this.row) return;
    this.row = row;
    row.addEventListener('scroll', () => this.syncFades(), { passive: true });
    this.resizeObserver?.disconnect();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.syncFocusable());
      this.resizeObserver.observe(row);
    }
    this.syncFocusable();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-attachment-group')) {
  customElements.define('ui-attachment-group', UIAttachmentGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-attachment-group': UIAttachmentGroup;
  }
}
