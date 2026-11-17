import { ElementBase } from '../ElementBase';
import './ui-badge';

/*
 * The top of a page: an eyebrow, the title (a real heading, h1 by default), a status chip, a
 * subtitle and the page's actions. The web component behind React's PageHeader, for apps without
 * React.
 *
 *   heading, subtitle, eyebrow and status attributes; buttons go in slot="actions".
 *
 * `heading` (not `title`, which would show the browser's tooltip over the whole header), or a
 * `heading` slot for rich content. Anything without a slot goes below the header.
 */

const style = `
  :host {
    display: block;
    min-inline-size: 0;
    color: var(--ui-color-text, #0f172a);
    font-family: var(--ui-font-family, inherit);
  }
  :host([hidden]) { display: none; }
  .header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-inline-size: 0;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    min-inline-size: 0;
  }
  .text {
    display: grid;
    gap: 6px;
    min-inline-size: 0;
  }
  .eyebrow {
    color: var(--ui-color-muted, #526175);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-inline-size: 0;
  }
  .heading {
    margin: 0;
    min-inline-size: 0;
    font-size: var(--ui-page-header-title-size, 24px);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }
  .subtitle {
    min-inline-size: 0;
    color: var(--ui-color-muted, #526175);
    font-size: 14px;
    line-height: 1.45;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }
  [hidden] { display: none !important; }
`;

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export class UIPageHeader extends ElementBase {
  static get observedAttributes() {
    return ['heading', 'heading-level', 'subtitle', 'eyebrow', 'status', 'status-tone', 'actions-label'];
  }

  private _observer: MutationObserver | null = null;

  connectedCallback() {
    super.connectedCallback();
    if (!this._observer && typeof MutationObserver !== 'undefined') {
      this._observer = new MutationObserver(() => this.requestRender());
      this._observer.observe(this, { childList: true, attributes: true, attributeFilter: ['slot'] });
    }
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    this._observer = null;
    super.disconnectedCallback();
  }

  private _has(name: string): boolean {
    return !!(this.getAttribute(name) || '').trim() || !!this.querySelector(`:scope > [slot="${name}"]`);
  }

  protected render(): void {
    const parsed = Number.parseInt(this.getAttribute('heading-level') || '1', 10);
    const level = parsed >= 1 && parsed <= 6 ? parsed : 1;
    const text = (name: string) => escapeHtml(this.getAttribute(name) || '');
    const statusTone = escapeHtml(this.getAttribute('status-tone') || 'info');
    const actionsLabel = escapeHtml(this.getAttribute('actions-label') || 'Page actions');
    const hasActions = !!this.querySelector(':scope > [slot="actions"]');
    const hasBody = Array.from(this.childNodes).some(
      (node) => (node.nodeType === 1 && !(node as Element).getAttribute('slot')) || (node.nodeType === 3 && (node.textContent || '').trim())
    );
    this.setContent(`
      <style>${style}</style>
      <div class="header" part="base">
        <div class="row" part="row">
          <div class="text" part="text">
            <div class="eyebrow" part="eyebrow" ${this._has('eyebrow') ? '' : 'hidden'}><slot name="eyebrow">${text('eyebrow')}</slot></div>
            <div class="title-row" part="title-row">
              <h${level} class="heading" part="heading"><slot name="heading">${text('heading')}</slot></h${level}>
              <span part="status" ${this._has('status') ? '' : 'hidden'}><slot name="status"><ui-badge size="sm" variant="soft" tone="${statusTone}">${text('status')}</ui-badge></slot></span>
            </div>
            <div class="subtitle" part="subtitle" ${this._has('subtitle') ? '' : 'hidden'}><slot name="subtitle">${text('subtitle')}</slot></div>
          </div>
          <div class="actions" part="actions" role="group" aria-label="${actionsLabel}" ${hasActions ? '' : 'hidden'}><slot name="actions"></slot></div>
        </div>
        <div part="body" ${hasBody ? '' : 'hidden'}><slot></slot></div>
      </div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-page-header')) {
  customElements.define('ui-page-header', UIPageHeader);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-page-header': UIPageHeader;
  }
}
