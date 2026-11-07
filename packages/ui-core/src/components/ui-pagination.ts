import { ElementBase } from '../ElementBase';
import { requestNavigate } from '../primitives/navigate';

const style = `
  :host {
    display: inline-flex;
    max-width: 100%;
    --ui-pagination-gap: 2px;
    --ui-pagination-radius: var(--ui-control-radius-2, var(--ui-radius, 6px));
    --ui-pagination-bg: transparent;
    --ui-pagination-item-bg: transparent;
    --ui-pagination-item-bg-hover: var(--ui-color-fill, color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent));
    --ui-pagination-active-bg: var(--ui-color-primary, #2563eb);
    --ui-pagination-active-color: var(--ui-color-foreground-on-primary, #ffffff);
    --ui-pagination-border: transparent;
    --ui-pagination-color: var(--ui-color-text-strong, var(--ui-color-text, #0f172a));
    --ui-pagination-muted: var(--ui-color-text-secondary, var(--ui-color-muted, #526175));
    --ui-pagination-h: var(--ui-control-height-2, 32px);
    --ui-pagination-padding: 0 8px;
    --ui-pagination-font-size: var(--ui-control-font-size-2, 14px);
    --ui-pagination-shadow: none;
    color-scheme: light dark;
  }

  .pagination {
    max-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ui-pagination-gap);
    padding: 0;
    border: 0;
    border-radius: var(--ui-pagination-radius);
    background: var(--ui-pagination-bg);
    box-shadow: var(--ui-pagination-shadow);
  }

  .ellipsis {
    color: var(--ui-pagination-muted);
    font-size: var(--ui-pagination-font-size);
    line-height: 1;
    padding: 0 3px;
  }

  :is(button, a.page-link) {
    text-decoration: none;
    padding: var(--ui-pagination-padding);
    border-radius: var(--ui-pagination-radius);
    border: 1px solid var(--ui-pagination-border);
    background: var(--ui-pagination-item-bg);
    color: var(--ui-pagination-color);
    font-size: var(--ui-pagination-font-size);
    font-weight: 500;
    line-height: 1.2;
    box-sizing: border-box;
    min-width: var(--ui-pagination-h);
    min-height: var(--ui-pagination-h);
    cursor: pointer;
    transition: border-color 130ms ease, background-color 130ms ease, color 130ms ease, transform 130ms ease;
  }

  :is(button, a.page-link):hover:not(:disabled) {
    background: var(--ui-pagination-item-bg-hover);
  }

  :is(button, a.page-link):focus-visible {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: var(--ui-ring-offset, 2px);
  }

  :is(button, a.page-link)[aria-current="page"] {
    background: var(--ui-pagination-active-bg);
    color: var(--ui-pagination-active-color);
    border-color: var(--ui-pagination-active-bg);
  }

  :is(button, a.page-link):disabled {
    opacity: 0.46;
    cursor: not-allowed;
  }

  :host([size="sm"]) {
    --ui-pagination-gap: 4px;
    --ui-pagination-radius: 8px;
    --ui-pagination-h: var(--ui-control-height-1, 24px);
    --ui-pagination-padding: 0 6px;
    --ui-pagination-font-size: var(--ui-control-font-size-1, 12px);
  }

  :host([size="lg"]) {
    --ui-pagination-gap: 8px;
    --ui-pagination-radius: 12px;
    --ui-pagination-h: var(--ui-control-height-3, 40px);
    --ui-pagination-padding: 0 12px;
    --ui-pagination-font-size: var(--ui-control-font-size-3, 16px);
  }

  :host([variant="classic"]) .pagination {
    background: var(--ui-pagination-bg);
  }

  :host([variant="flat"]) .pagination,
  :host([variant="minimal"]) .pagination {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }

  :host([variant="flat"]) :is(button, a.page-link),
  :host([variant="minimal"]) :is(button, a.page-link) {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    min-width: 30px;
  }

  :host([variant="flat"]) :is(button, a.page-link):hover:not(:disabled),
  :host([variant="minimal"]) :is(button, a.page-link):hover:not(:disabled) {
    background: color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, transparent);
    border-color: transparent;
  }

  :host([variant="flat"]) :is(button, a.page-link)[aria-current="page"],
  :host([variant="minimal"]) :is(button, a.page-link)[aria-current="page"] {
    background: color-mix(in srgb, var(--ui-color-primary, #2563eb) 16%, transparent);
    color: var(--ui-color-primary, #2563eb);
    border-color: transparent;
  }

  :host([variant="outline"]) .pagination {
    background: transparent;
    border-color: var(--ui-pagination-border);
    box-shadow: none;
  }

  :host([variant="outline"]) :is(button, a.page-link) {
    background: var(--ui-color-surface, #ffffff);
    border-color: var(--ui-pagination-border);
  }

  :host([variant="outline"]) :is(button, a.page-link)[aria-current="page"] {
    background: color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, var(--ui-color-surface, #ffffff));
    color: var(--ui-color-primary, #2563eb);
    border-color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 45%, var(--ui-pagination-border));
  }

  :host([variant="solid"]),
  :host([variant="contrast"]) {
    --ui-pagination-bg: #0f172a;
    --ui-pagination-item-bg: #111827;
    --ui-pagination-item-bg-hover: #1f2937;
    --ui-pagination-border: #334155;
    --ui-pagination-color: #e2e8f0;
    --ui-pagination-muted: #93a4bd;
    --ui-pagination-active-bg: var(--ui-color-accent-on-dark, #93c5fd);
    --ui-pagination-active-color: #0f172a;
    --ui-pagination-shadow: none;
  }

  :host([variant="solid"]) .pagination,
  :host([variant="contrast"]) .pagination {
    padding: 8px;
  }

  :host([variant="solid"]) :is(button, a.page-link),
  :host([variant="contrast"]) :is(button, a.page-link) {
    border-color: transparent;
  }

  :host([headless]) .pagination { display: none; }

  @media (prefers-reduced-motion: reduce) {
    :is(button, a.page-link) {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .pagination {
      border-width: 2px;
      box-shadow: none;
    }

    :is(button, a.page-link) {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-pagination-bg: Canvas;
      --ui-pagination-item-bg: Canvas;
      --ui-pagination-item-bg-hover: Highlight;
      --ui-pagination-border: CanvasText;
      --ui-pagination-color: CanvasText;
      --ui-pagination-muted: CanvasText;
      --ui-pagination-active-bg: Highlight;
      --ui-pagination-active-color: HighlightText;
      --ui-pagination-shadow: none;
    }
  }
`;


export class UIPagination extends ElementBase {
  static get observedAttributes() {
    return ['page', 'count', 'headless', 'variant', 'size', 'aria-label', 'href-template'];
  }

  private _page = 1;
  private _count = 1;
  private _headless = false;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  get page(): number {
    return this._page;
  }

  set page(next: number) {
    this.goToPage(next);
  }

  get count(): number {
    return this._count;
  }

  set count(next: number) {
    const normalized = Math.max(1, Number(next) || 1);
    this.setAttribute('count', String(normalized));
    if (this._page > normalized) {
      this.setAttribute('page', String(normalized));
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'page' || name === 'count' || name === 'headless') {
      this._page = Math.max(1, Number(this.getAttribute('page')) || 1);
      this._count = Math.max(1, Number(this.getAttribute('count')) || 1);
      this._headless = this.hasAttribute('headless');
      if (this._page > this._count) this._page = this._count;
    }
    if (oldValue === newValue) return;
    // Render now rather than on the next microtask. A framework sets `page` and `count` one after
    // the other right after mount, and the deferred render meant the first paint (and any test
    // reading it synchronously) showed a single page with Next disabled.
    if (this.isConnected) this.render();
    else this.requestRender();
  }

  protected render() {
    if (this._headless) {
      this.setContent('');
      return;
    }
    // Re-rendering replaces the buttons; remember which one had focus so a keyboard user who
    // pressed Next keeps focus on Next (or on the page they picked).
    const focused = this.root.activeElement as HTMLElement | null;
    const focusKey = focused?.matches?.('[data-page][aria-label]')
      ? `[data-page][aria-label="${focused.getAttribute('aria-label')}"]`
      : focused?.matches?.('[data-page]')
        ? '[data-page][aria-current="page"]'
        : '';
    // With href-template ("?page={page}") the controls are real links (open in a new tab, shareable,
    // crawlable) that go through the shared navigate contract; otherwise buttons.
    const template = this.getAttribute('href-template') || '';
    const control = (page: number, content: string, extra: { label?: string; disabled?: boolean; current?: boolean } = {}) => {
      const label = extra.label ? ` aria-label="${extra.label}"` : '';
      const current = extra.current ? ' aria-current="page"' : '';
      if (template && !extra.disabled) {
        const href = template.split('{page}').join(String(page)).replace(/"/g, '&quot;');
        return `<a class="page-link" href="${href}" data-page="${page}"${label}${current}>${content}</a>`;
      }
      return `<button type="button" data-page="${page}"${label}${current} ${extra.disabled ? 'disabled' : ''}>${content}</button>`;
    };
    let buttons = '';
    // First/Prev
    buttons += control(1, '&laquo;', { label: 'First', disabled: this._page === 1 });
    buttons += control(this._page - 1, '&lsaquo;', { label: 'Previous', disabled: this._page === 1 });
    // Page numbers (show up to 5, with ellipsis)
    const range = this._getPageRange(this._page, this._count);
    if (range[0] > 1) {
      buttons += control(1, '1');
      if (range[0] > 2) buttons += `<span class="ellipsis" aria-hidden="true">…</span>`;
    }
    for (let i = range[0]; i <= range[1]; i++) {
      buttons += control(i, String(i), { current: i === this._page });
    }
    if (range[1] < this._count) {
      if (range[1] < this._count - 1) buttons += `<span class="ellipsis" aria-hidden="true">…</span>`;
      buttons += control(this._count, String(this._count));
    }
    // Next/Last
    buttons += control(this._page + 1, '&rsaquo;', { label: 'Next', disabled: this._page === this._count });
    buttons += control(this._count, '&raquo;', { label: 'Last', disabled: this._page === this._count });
    this.setContent(`
      <style>${style}</style>
      <nav class="pagination" role="navigation" aria-label="${this.getAttribute('aria-label') || 'Pagination'}" tabindex="0">
        ${buttons}
      </nav>
    `);
    const nav = this.root.querySelector('.pagination');
    if (nav) {
      nav.removeEventListener('click', this._onClick as EventListener);
      nav.addEventListener('click', this._onClick as EventListener);
      nav.removeEventListener('keydown', this._onKeyDown as EventListener);
      nav.addEventListener('keydown', this._onKeyDown as EventListener);
    }
    if (focusKey && !this.root.activeElement) {
      const target = this.root.querySelector(focusKey) as HTMLButtonElement | null;
      const fallback = this.root.querySelector('[data-page][aria-current="page"]') as HTMLButtonElement | null;
      (target && !target.disabled ? target : fallback)?.focus({ preventScroll: true });
    }
  }

  goToPage(next: number): void {
    const page = Math.max(1, Math.min(this._count, Number(next) || 1));
    if (page === this._page) return;
    this._applyPageChange(page);
  }

  nextPage(): void {
    this.goToPage(this._page + 1);
  }

  prevPage(): void {
    this.goToPage(this._page - 1);
  }

  firstPage(): void {
    this.goToPage(1);
  }

  lastPage(): void {
    this.goToPage(this._count);
  }

  focusCurrent(): void {
    const current = this.root.querySelector('[data-page][aria-current="page"]') as HTMLElement | null;
    current?.focus();
  }

  private _getPageRange(page: number, count: number): [number, number] {
    if (count <= 5) return [1, count];
    if (page <= 3) return [1, 5];
    if (page >= count - 2) return [count - 4, count];
    return [page - 2, page + 2];
  }

  private _onClick(e: Event) {
    const btn = (e.target as HTMLElement).closest('[data-page]') as HTMLElement | null;
    if (!btn || btn.hasAttribute('disabled')) return;
    const page = Number(btn.getAttribute('data-page'));
    if (isNaN(page) || page < 1 || page > this._count) return;
    if (btn instanceof HTMLAnchorElement) {
      // A page link: the app's router may take it over; otherwise the browser follows it.
      const keepPage = requestNavigate(this, { href: btn.getAttribute('href') || '', page, previousPage: this._page }, e);
      if (!keepPage) return;
      e.preventDefault();
    }
    if (page === this._page) return;
    this._applyPageChange(page);
  }

  private _onKeyDown(e: KeyboardEvent) {
    const nav = this.root.querySelector('.pagination');
    if (!nav) return;
    const buttons = Array.from(nav.querySelectorAll('button:not(:disabled), a[data-page]'));
    const active = this.root.activeElement as Element | null;
    let idx = buttons.indexOf(active as HTMLButtonElement);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      idx = (idx + 1) % buttons.length;
      (buttons[idx] as HTMLElement).focus();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      idx = (idx - 1 + buttons.length) % buttons.length;
      (buttons[idx] as HTMLElement).focus();
      e.preventDefault();
    } else if (e.key === 'Home') {
      (buttons[0] as HTMLElement).focus();
      e.preventDefault();
    } else if (e.key === 'End') {
      (buttons[buttons.length - 1] as HTMLElement).focus();
      e.preventDefault();
    }
  }

  private _applyPageChange(nextPage: number): void {
    const previousPage = this._page;
    const page = Math.max(1, Math.min(this._count, Number(nextPage) || 1));
    if (page === previousPage) return;

    const reason =
      page === 1 && previousPage !== 1 ? 'first'
      : page === this._count && previousPage !== this._count ? 'last'
      : page === previousPage - 1 ? 'prev'
      : page === previousPage + 1 ? 'next'
      : 'change';

    this.setAttribute('page', String(page));

    const detail = {
      page,
      previousPage,
      count: this._count,
      reason
    };

    this.dispatchEvent(new CustomEvent(reason, { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-pagination')) {
  customElements.define('ui-pagination', UIPagination);
}
