import { ElementBase } from '../ElementBase';

type ScrollOrientation = 'vertical' | 'horizontal' | 'both';
type ScrollSize = 'sm' | 'md' | 'lg';
type ScrollVariant = 'default' | 'soft' | 'inset' | 'contrast' | 'minimal';
type ScrollTone = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';

const style = `
  :host {
    display: block;
    max-height: 240px;
    min-height: 0;
    position: relative;
    color-scheme: light dark;

    --ui-scroll-radius: 12px;
    --ui-scroll-pad: 0px;
    --ui-scroll-track-size: 10px;
    --ui-scroll-track-bg: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 18%, transparent);
    --ui-scroll-thumb-bg: color-mix(in srgb, var(--ui-color-border, #94a3b8) 64%, transparent);
    --ui-scroll-thumb-hover: color-mix(in srgb, var(--ui-color-border, #64748b) 84%, transparent);
    --ui-scroll-bg: transparent;
    --ui-scroll-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-scroll-shadow:
      0 1px 2px rgba(2, 6, 23, 0.05),
      0 14px 28px rgba(2, 6, 23, 0.08);
  }

  .shell {
    position: relative;
    inline-size: 100%;
    block-size: 100%;
    max-height: inherit;
    border: 1px solid var(--ui-scroll-border);
    border-radius: var(--ui-scroll-radius);
    background: var(--ui-scroll-bg);
    overflow: hidden;
    box-shadow: var(--ui-scroll-shadow);
  }

  .scroll-area {
    position: relative;
    inline-size: 100%;
    block-size: 100%;
    max-height: inherit;
    min-height: 0;
    overflow: auto;
    border-radius: inherit;
    padding: var(--ui-scroll-pad);
    scrollbar-width: none;
    outline: none;
    overscroll-behavior: contain;
  }

  .scroll-area::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .scroll-content {
    min-width: 100%;
    min-height: 100%;
    box-sizing: border-box;
  }

  .shadow {
    position: absolute;
    pointer-events: none;
    z-index: 2;
    opacity: 0;
    transition: opacity 180ms ease;
  }

  .shadow.top,
  .shadow.bottom {
    left: 0;
    right: 0;
    height: 14px;
  }

  .shadow.left,
  .shadow.right {
    top: 0;
    bottom: 0;
    width: 14px;
  }

  .shadow.top {
    top: 0;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.16), transparent);
  }

  .shadow.bottom {
    bottom: 0;
    background: linear-gradient(0deg, rgba(15, 23, 42, 0.16), transparent);
  }

  .shadow.left {
    left: 0;
    background: linear-gradient(90deg, rgba(15, 23, 42, 0.16), transparent);
  }

  .shadow.right {
    right: 0;
    background: linear-gradient(270deg, rgba(15, 23, 42, 0.16), transparent);
  }

  .scrollbar {
    position: absolute;
    z-index: 3;
    border-radius: 999px;
    background: var(--ui-scroll-track-bg);
    opacity: 0;
    transition: opacity 180ms ease, background-color 140ms ease;
    pointer-events: none;
  }

  .shell[data-scrolling="true"] .scrollbar,
  .shell:hover .scrollbar,
  .shell:focus-within .scrollbar {
    opacity: 1;
    pointer-events: auto;
  }

  .scrollbar.vertical {
    top: 8px;
    bottom: 8px;
    right: 6px;
    width: var(--ui-scroll-track-size);
  }

  .scrollbar.horizontal {
    left: 8px;
    right: 8px;
    bottom: 6px;
    height: var(--ui-scroll-track-size);
  }

  .thumb {
    position: absolute;
    border-radius: inherit;
    background: var(--ui-scroll-thumb-bg);
    cursor: grab;
    transition: background-color 120ms ease;
  }

  .thumb:hover,
  .thumb[data-dragging="true"] {
    background: var(--ui-scroll-thumb-hover);
  }

  .scrollbar.vertical .thumb {
    left: 1px;
    width: calc(100% - 2px);
    min-height: 24px;
  }

  .scrollbar.horizontal .thumb {
    top: 1px;
    height: calc(100% - 2px);
    min-width: 24px;
  }

  :host([size="sm"]) {
    --ui-scroll-radius: 10px;
    --ui-scroll-track-size: 8px;
  }

  :host([size="lg"]) {
    --ui-scroll-radius: 14px;
    --ui-scroll-track-size: 12px;
  }

  :host([variant="soft"]) {
    --ui-scroll-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, #f8fafc 8%);
    --ui-scroll-shadow: 0 1px 3px rgba(2, 6, 23, 0.05);
  }

  :host([variant="inset"]) {
    --ui-scroll-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 86%, #eef2ff 14%);
    --ui-scroll-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 58%, transparent);
    --ui-scroll-shadow: inset 0 1px 1px rgba(2, 6, 23, 0.08);
    --ui-scroll-pad: 2px;
  }

  :host([variant="contrast"]) {
    --ui-scroll-bg: #0f172a;
    --ui-scroll-border: #334155;
    --ui-scroll-track-bg: rgba(148, 163, 184, 0.22);
    --ui-scroll-thumb-bg: rgba(226, 232, 240, 0.64);
    --ui-scroll-thumb-hover: rgba(226, 232, 240, 0.86);
    --ui-scroll-shadow: none;
  }

  :host([variant="minimal"]) {
    --ui-scroll-bg: transparent;
    --ui-scroll-border: transparent;
    --ui-scroll-shadow: none;
  }

  :host([tone="brand"]) {
    --ui-scroll-thumb-bg: color-mix(in srgb, #2563eb 52%, transparent);
    --ui-scroll-thumb-hover: color-mix(in srgb, #2563eb 72%, transparent);
  }

  :host([tone="info"]) {
    --ui-scroll-thumb-bg: color-mix(in srgb, #0ea5e9 52%, transparent);
    --ui-scroll-thumb-hover: color-mix(in srgb, #0284c7 72%, transparent);
  }

  :host([tone="success"]) {
    --ui-scroll-thumb-bg: color-mix(in srgb, #16a34a 52%, transparent);
    --ui-scroll-thumb-hover: color-mix(in srgb, #15803d 72%, transparent);
  }

  :host([tone="warning"]) {
    --ui-scroll-thumb-bg: color-mix(in srgb, #d97706 52%, transparent);
    --ui-scroll-thumb-hover: color-mix(in srgb, #b45309 72%, transparent);
  }

  :host([tone="danger"]) {
    --ui-scroll-thumb-bg: color-mix(in srgb, #dc2626 52%, transparent);
    --ui-scroll-thumb-hover: color-mix(in srgb, #b91c1c 72%, transparent);
  }

  :host([orientation="horizontal"]) .scrollbar.vertical,
  :host([orientation="horizontal"]) .shadow.top,
  :host([orientation="horizontal"]) .shadow.bottom {
    display: none;
  }

  :host([orientation="vertical"]) .scrollbar.horizontal,
  :host([orientation="vertical"]) .shadow.left,
  :host([orientation="vertical"]) .shadow.right {
    display: none;
  }

  :host([headless]) .shell {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .shadow,
    .scrollbar,
    .thumb {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .shell {
      border-width: 2px;
      box-shadow: none;
    }

    .scrollbar {
      background: color-mix(in srgb, var(--ui-scroll-track-bg) 70%, transparent);
    }

    .thumb {
      border: 1px solid color-mix(in srgb, var(--ui-scroll-thumb-hover) 72%, transparent);
    }
  }

  @media (forced-colors: active) {
    .shell {
      border-color: CanvasText;
      background: Canvas;
      box-shadow: none;
    }

    .scrollbar {
      background: Canvas;
      border: 1px solid CanvasText;
    }

    .thumb {
      background: Highlight;
    }
  }
`;

function normalizeOrientation(raw: string | null): ScrollOrientation {
  if (raw === 'both' || raw === 'horizontal') return raw;
  return 'vertical';
}

function normalizeSize(raw: string | null): ScrollSize {
  if (raw === 'sm' || raw === 'lg') return raw;
  return 'md';
}

function normalizeVariant(raw: string | null): ScrollVariant {
  if (raw === 'soft' || raw === 'inset' || raw === 'contrast' || raw === 'minimal') return raw;
  return 'default';
}

function normalizeTone(raw: string | null): ScrollTone {
  if (raw === 'brand' || raw === 'info' || raw === 'success' || raw === 'warning' || raw === 'danger') return raw;
  return 'neutral';
}

function booleanAttr(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const value = raw.toLowerCase();
  return value !== 'false' && value !== '0';
}

export class UIScrollArea extends ElementBase {
  static get observedAttributes() {
    return ['orientation', 'size', 'variant', 'tone', 'auto-hide', 'shadows', 'headless'];
  }

  private _domReady = false;
  private _headless = false;
  private _orientation: ScrollOrientation = 'vertical';
  private _autoHide = true;
  private _showShadows = true;

  private _shellEl: HTMLElement | null = null;
  private _viewportEl: HTMLElement | null = null;
  private _contentEl: HTMLElement | null = null;
  private _vTrackEl: HTMLElement | null = null;
  private _hTrackEl: HTMLElement | null = null;
  private _vThumbEl: HTMLElement | null = null;
  private _hThumbEl: HTMLElement | null = null;
  private _shadowTopEl: HTMLElement | null = null;
  private _shadowBottomEl: HTMLElement | null = null;
  private _shadowLeftEl: HTMLElement | null = null;
  private _shadowRightEl: HTMLElement | null = null;

  private _resizeObserver: ResizeObserver | null = null;
  private _mutationObserver: MutationObserver | null = null;
  private _raf = 0;
  private _hideTimer = 0;

  private _dragAxis: 'x' | 'y' | null = null;
  private _dragStart = 0;
  private _dragScrollStart = 0;

  private _atStartY = false;
  private _atEndY = false;
  private _atStartX = false;
  private _atEndX = false;

  constructor() {
    super();
  }

  override connectedCallback(): void {
    this._syncFromAttributes();
    super.connectedCallback();
    this._observe();
    this._scheduleMetrics();
  }

  override disconnectedCallback(): void {
    this._unobserve();
    this._detachDrag();
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._hideTimer) window.clearTimeout(this._hideTimer);
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this._syncFromAttributes();
    super.attributeChangedCallback(name, oldValue, newValue);
    this._scheduleMetrics();
  }

  get viewport(): HTMLElement | null {
    return this._viewportEl;
  }

  scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    this._viewportEl?.scrollTo({ top: 0, behavior });
  }

  scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    const el = this._viewportEl;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }

  scrollToLeft(behavior: ScrollBehavior = 'smooth'): void {
    this._viewportEl?.scrollTo({ left: 0, behavior });
  }

  scrollToRight(behavior: ScrollBehavior = 'smooth'): void {
    const el = this._viewportEl;
    if (!el) return;
    el.scrollTo({ left: el.scrollWidth, behavior });
  }

  scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth'): void {
    const content = this._contentEl;
    if (!content) return;
    const children = Array.from(content.children) as HTMLElement[];
    const target = children[index];
    if (!target) return;
    target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior });
  }

  private _syncFromAttributes(): void {
    this._headless = this.hasAttribute('headless');
    this._orientation = normalizeOrientation(this.getAttribute('orientation'));
    this._autoHide = booleanAttr(this.getAttribute('auto-hide'), true);
    this._showShadows = booleanAttr(this.getAttribute('shadows'), true);
  }

  private _ensureDom(): void {
    if (this._domReady) return;

    this.setContent(`
      <style>${style}</style>
      <div class="shell" part="shell" data-scrolling="false">
        <div class="shadow top" part="shadow-top"></div>
        <div class="shadow bottom" part="shadow-bottom"></div>
        <div class="shadow left" part="shadow-left"></div>
        <div class="shadow right" part="shadow-right"></div>

        <div class="scroll-area" part="viewport" role="region" tabindex="0" aria-label="Scrollable area">
          <div class="scroll-content" part="content"><slot></slot></div>
        </div>

        <div class="scrollbar vertical" part="scrollbar scrollbar-vertical">
          <div class="thumb" part="thumb thumb-vertical"></div>
        </div>

        <div class="scrollbar horizontal" part="scrollbar scrollbar-horizontal">
          <div class="thumb" part="thumb thumb-horizontal"></div>
        </div>
      </div>
    `);

    this._shellEl = this.root.querySelector('.shell');
    this._viewportEl = this.root.querySelector('.scroll-area');
    this._contentEl = this.root.querySelector('.scroll-content');
    this._vTrackEl = this.root.querySelector('.scrollbar.vertical');
    this._hTrackEl = this.root.querySelector('.scrollbar.horizontal');
    this._vThumbEl = this.root.querySelector('.scrollbar.vertical .thumb');
    this._hThumbEl = this.root.querySelector('.scrollbar.horizontal .thumb');
    this._shadowTopEl = this.root.querySelector('.shadow.top');
    this._shadowBottomEl = this.root.querySelector('.shadow.bottom');
    this._shadowLeftEl = this.root.querySelector('.shadow.left');
    this._shadowRightEl = this.root.querySelector('.shadow.right');

    this._domReady = true;
  }

  private _attachDomListeners(): void {
    if (this._viewportEl) {
      this._viewportEl.removeEventListener('scroll', this._onViewportScroll);
      this._viewportEl.addEventListener('scroll', this._onViewportScroll);
    }
    if (this._vThumbEl) {
      this._vThumbEl.removeEventListener('pointerdown', this._onThumbPointerDownY);
      this._vThumbEl.addEventListener('pointerdown', this._onThumbPointerDownY);
    }
    if (this._hThumbEl) {
      this._hThumbEl.removeEventListener('pointerdown', this._onThumbPointerDownX);
      this._hThumbEl.addEventListener('pointerdown', this._onThumbPointerDownX);
    }
  }

  private _observe(): void {
    if (typeof ResizeObserver !== 'undefined') {
      if (!this._resizeObserver) {
        this._resizeObserver = new ResizeObserver(() => this._scheduleMetrics());
      }
      if (this._viewportEl) this._resizeObserver.observe(this._viewportEl);
      if (this._contentEl) this._resizeObserver.observe(this._contentEl);
      this._resizeObserver.observe(this);
    }

    if (typeof MutationObserver !== 'undefined' && this._contentEl) {
      if (!this._mutationObserver) {
        this._mutationObserver = new MutationObserver(() => this._scheduleMetrics());
      }
      this._mutationObserver.observe(this._contentEl, { childList: true, subtree: true, characterData: true });
    }
  }

  private _unobserve(): void {
    if (this._viewportEl) this._viewportEl.removeEventListener('scroll', this._onViewportScroll);
    this._vThumbEl?.removeEventListener('pointerdown', this._onThumbPointerDownY);
    this._hThumbEl?.removeEventListener('pointerdown', this._onThumbPointerDownX);

    this._resizeObserver?.disconnect();
    this._mutationObserver?.disconnect();
    this._resizeObserver = null;
    this._mutationObserver = null;
  }

  private _scheduleMetrics(): void {
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => {
      this._raf = 0;
      this._updateMetrics();
    });
  }

  private _showScrollbarsTemporarily(): void {
    if (!this._shellEl) return;

    if (!this._autoHide) {
      this._shellEl.dataset.scrolling = 'true';
      return;
    }

    this._shellEl.dataset.scrolling = 'true';
    if (this._hideTimer) window.clearTimeout(this._hideTimer);
    this._hideTimer = window.setTimeout(() => {
      if (this._shellEl) this._shellEl.dataset.scrolling = 'false';
    }, 860);
  }

  private _updateMetrics(): void {
    const viewport = this._viewportEl;
    const vTrack = this._vTrackEl;
    const hTrack = this._hTrackEl;
    const vThumb = this._vThumbEl;
    const hThumb = this._hThumbEl;

    if (!viewport || !vTrack || !hTrack || !vThumb || !hThumb) return;

    const canY = this._orientation !== 'horizontal' && viewport.scrollHeight > viewport.clientHeight + 1;
    const canX = this._orientation !== 'vertical' && viewport.scrollWidth > viewport.clientWidth + 1;

    vTrack.style.display = canY ? '' : 'none';
    hTrack.style.display = canX ? '' : 'none';

    const maxY = Math.max(1, viewport.scrollHeight - viewport.clientHeight);
    const maxX = Math.max(1, viewport.scrollWidth - viewport.clientWidth);

    if (canY) {
      const trackHeight = Math.max(1, vTrack.clientHeight);
      const thumbHeight = Math.max(24, (viewport.clientHeight / viewport.scrollHeight) * trackHeight);
      const yTravel = Math.max(0, trackHeight - thumbHeight);
      const yOffset = (viewport.scrollTop / maxY) * yTravel;
      vThumb.style.height = `${thumbHeight}px`;
      vThumb.style.transform = `translateY(${yOffset}px)`;
    }

    if (canX) {
      const trackWidth = Math.max(1, hTrack.clientWidth);
      const thumbWidth = Math.max(24, (viewport.clientWidth / viewport.scrollWidth) * trackWidth);
      const xTravel = Math.max(0, trackWidth - thumbWidth);
      const xOffset = (viewport.scrollLeft / maxX) * xTravel;
      hThumb.style.width = `${thumbWidth}px`;
      hThumb.style.transform = `translateX(${xOffset}px)`;
    }

    this._updateShadows(viewport, maxY, maxX);
    this._emitEdgeEvents(viewport, maxY, maxX);
  }

  private _updateShadows(viewport: HTMLElement, maxY: number, maxX: number): void {
    const show = this._showShadows;

    const top = show && viewport.scrollTop > 1;
    const bottom = show && viewport.scrollTop < maxY - 1;
    const left = show && viewport.scrollLeft > 1;
    const right = show && viewport.scrollLeft < maxX - 1;

    if (this._shadowTopEl) this._shadowTopEl.style.opacity = top ? '1' : '0';
    if (this._shadowBottomEl) this._shadowBottomEl.style.opacity = bottom ? '1' : '0';
    if (this._shadowLeftEl) this._shadowLeftEl.style.opacity = left ? '1' : '0';
    if (this._shadowRightEl) this._shadowRightEl.style.opacity = right ? '1' : '0';
  }

  private _emitEdgeEvents(viewport: HTMLElement, maxY: number, maxX: number): void {
    const atStartY = viewport.scrollTop <= 0;
    const atEndY = viewport.scrollTop >= maxY - 1;
    const atStartX = viewport.scrollLeft <= 0;
    const atEndX = viewport.scrollLeft >= maxX - 1;

    if (atStartY && !this._atStartY) this.dispatchEvent(new CustomEvent('reach-start', { bubbles: true, composed: true }));
    if (atEndY && !this._atEndY) this.dispatchEvent(new CustomEvent('reach-end', { bubbles: true, composed: true }));

    if (atStartX && !this._atStartX) this.dispatchEvent(new CustomEvent('reach-start-x', { bubbles: true, composed: true }));
    if (atEndX && !this._atEndX) this.dispatchEvent(new CustomEvent('reach-end-x', { bubbles: true, composed: true }));

    this._atStartY = atStartY;
    this._atEndY = atEndY;
    this._atStartX = atStartX;
    this._atEndX = atEndX;
  }

  private readonly _onViewportScroll = (): void => {
    const viewport = this._viewportEl;
    if (!viewport) return;

    const maxY = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    const maxX = Math.max(0, viewport.scrollWidth - viewport.clientWidth);

    this.dispatchEvent(
      new CustomEvent('scroll', {
        detail: {
          scrollTop: viewport.scrollTop,
          scrollLeft: viewport.scrollLeft,
          maxScrollTop: maxY,
          maxScrollLeft: maxX,
          progressY: maxY > 0 ? viewport.scrollTop / maxY : 0,
          progressX: maxX > 0 ? viewport.scrollLeft / maxX : 0
        },
        bubbles: true,
        composed: true
      })
    );

    this._showScrollbarsTemporarily();
    this._scheduleMetrics();
  };

  private readonly _onThumbPointerDownY = (event: Event): void => {
    const pointer = event as PointerEvent;
    if (!this._viewportEl || !this._vThumbEl) return;
    pointer.preventDefault();
    this._dragAxis = 'y';
    this._dragStart = pointer.clientY;
    this._dragScrollStart = this._viewportEl.scrollTop;
    this._vThumbEl.dataset.dragging = 'true';
    this._attachDrag();
  };

  private readonly _onThumbPointerDownX = (event: Event): void => {
    const pointer = event as PointerEvent;
    if (!this._viewportEl || !this._hThumbEl) return;
    pointer.preventDefault();
    this._dragAxis = 'x';
    this._dragStart = pointer.clientX;
    this._dragScrollStart = this._viewportEl.scrollLeft;
    this._hThumbEl.dataset.dragging = 'true';
    this._attachDrag();
  };

  private _attachDrag(): void {
    window.addEventListener('pointermove', this._onPointerMove);
    window.addEventListener('pointerup', this._onPointerUp);
  }

  private _detachDrag(): void {
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    if (this._vThumbEl) this._vThumbEl.dataset.dragging = 'false';
    if (this._hThumbEl) this._hThumbEl.dataset.dragging = 'false';
    this._dragAxis = null;
  }

  private readonly _onPointerMove = (event: PointerEvent): void => {
    const viewport = this._viewportEl;
    if (!viewport || !this._dragAxis) return;

    if (this._dragAxis === 'y' && this._vTrackEl && this._vThumbEl) {
      const trackHeight = Math.max(1, this._vTrackEl.clientHeight);
      const thumbHeight = Math.max(1, this._vThumbEl.clientHeight);
      const maxThumbTravel = Math.max(1, trackHeight - thumbHeight);
      const maxScroll = Math.max(1, viewport.scrollHeight - viewport.clientHeight);
      const delta = event.clientY - this._dragStart;
      viewport.scrollTop = this._dragScrollStart + (delta / maxThumbTravel) * maxScroll;
      return;
    }

    if (this._dragAxis === 'x' && this._hTrackEl && this._hThumbEl) {
      const trackWidth = Math.max(1, this._hTrackEl.clientWidth);
      const thumbWidth = Math.max(1, this._hThumbEl.clientWidth);
      const maxThumbTravel = Math.max(1, trackWidth - thumbWidth);
      const maxScroll = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
      const delta = event.clientX - this._dragStart;
      viewport.scrollLeft = this._dragScrollStart + (delta / maxThumbTravel) * maxScroll;
    }
  };

  private readonly _onPointerUp = (): void => {
    this._detachDrag();
  };

  protected render(): void {
    this._ensureDom();

    const shell = this._shellEl;
    const viewport = this._viewportEl;

    if (!shell || !viewport) return;

    this._attachDomListeners();

    const size = normalizeSize(this.getAttribute('size'));
    const variant = normalizeVariant(this.getAttribute('variant'));
    const tone = normalizeTone(this.getAttribute('tone'));

    shell.dataset.size = size;
    shell.dataset.variant = variant;
    shell.dataset.tone = tone;
    shell.dataset.orientation = this._orientation;

    if (!this.hasAttribute('aria-label')) {
      viewport.setAttribute('aria-label', 'Scrollable area');
    } else {
      const label = this.getAttribute('aria-label') || 'Scrollable area';
      viewport.setAttribute('aria-label', label);
    }

    this._observe();
    this._scheduleMetrics();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-scroll-area')) {
  customElements.define('ui-scroll-area', UIScrollArea);
}
