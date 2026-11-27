import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';

/**
 * A carousel: one slide at a time, with previous/next buttons, slide picker, swipe, keyboard,
 * optional auto-rotation. Follows the WAI-ARIA carousel pattern.
 *
 *   <ui-carousel label="Featured" loop>
 *     <img src="a.jpg" alt="…" />
 *     <div label="Pricing">…</div>
 *     …
 *   </ui-carousel>
 *
 * Every element child is a slide. The host is a region with aria-roledescription "carousel"
 * (name: `label`); each slide is a group named "N of M" (or by its own `label` attribute); slides
 * that are not shown are `inert`, so Tab never lands inside a hidden slide.
 *
 * Auto-rotation (`autoplay`, `interval` in ms, default 5000) shows a pause/play button first in
 * the tab order, stops while the pointer is over the carousel, focus is inside it or the page is
 * in a background tab, and is off
 * under prefers-reduced-motion until the user presses play. While it rotates, slide changes are
 * not announced (aria-live off); otherwise they are (polite).
 *
 * Attributes: `index` (the shown slide, 0-based; kept in sync when present), `loop`, `autoplay`, `interval`,
 * `no-pause-on-hover`, `orientation` (horizontal | vertical), `transition` (slide | fade | none),
 * `controls` (always | hover | hidden), `controls-variant` (button | arrow), `controls-position`
 * (center | top | bottom), `indicators` (dot | pill | line | hidden), `previous-label`,
 * `next-label`, `label`.
 * Events: `change` (detail: { index, previousIndex, reason: 'next' | 'previous' | 'indicator' |
 * 'autoplay' | 'keyboard' | 'swipe' | 'api' }). Methods: next(), previous(), goTo(index),
 * play(), pause().
 */
const style = `
  :host {
    --ui-carousel-radius: var(--ui-radius, 10px);
    --ui-carousel-duration: 420ms;
    --ui-carousel-easing: var(--ui-motion-easing, cubic-bezier(0.22, 1, 0.36, 1));
    --ui-carousel-height: 320px;
    --ui-carousel-control-size: 34px;
    --ui-carousel-control-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, transparent);
    --ui-carousel-control-color: var(--ui-color-text, #0f172a);
    --ui-carousel-control-border: var(--ui-color-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 16%, transparent));
    --ui-carousel-indicator: color-mix(in srgb, var(--ui-color-text, #0f172a) 26%, transparent);
    --ui-carousel-indicator-active: var(--ui-color-primary, #2563eb);
    --ui-carousel-dir: 1;
    color-scheme: light dark;
    display: block;
    position: relative;
    min-inline-size: 0;
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
  }

  :host([hidden]) { display: none; }
  :host(:dir(rtl)) { --ui-carousel-dir: -1; }

  .root { position: relative; display: grid; gap: 10px; }

  .top-footer {
    position: absolute;
    inset-block-start: 10px;
    inset-inline-end: 10px;
    z-index: 3;
    min-block-size: 0;
  }
  .rotation { background: var(--ui-carousel-control-bg) !important; -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }

  .viewport {
    position: relative;
    overflow: hidden;
    border-radius: var(--ui-carousel-radius);
    touch-action: pan-y;
  }
  :host([orientation="vertical"]) .viewport { block-size: var(--ui-carousel-height); touch-action: pan-x; }

  .track {
    display: flex;
    transform: translateX(calc(var(--ui-carousel-index, 0) * -100% * var(--ui-carousel-dir)));
    transition: transform var(--ui-carousel-duration) var(--ui-carousel-easing);
    will-change: transform;
  }
  :host([orientation="vertical"]) .track {
    flex-direction: column;
    block-size: 100%;
    transform: translateY(calc(var(--ui-carousel-index, 0) * -100%));
  }
  .track[data-dragging] { transition: none; }

  ::slotted(*) {
    flex: 0 0 100%;
    min-inline-size: 0;
    box-sizing: border-box;
  }
  :host([orientation="vertical"]) ::slotted(*) { flex-basis: 100%; block-size: 100%; }

  /* Fade: slides stack in one cell and cross-fade. */
  :host([transition="fade"]) .track {
    display: grid;
    transform: none;
  }
  :host([transition="fade"]) ::slotted(*) {
    grid-area: 1 / 1;
    opacity: 0;
    transition: opacity var(--ui-carousel-duration) ease;
  }
  :host([transition="fade"]) ::slotted([data-carousel-active]) { opacity: 1; z-index: 1; }

  :host([transition="none"]) .track,
  :host([transition="none"]) ::slotted(*) { transition: none; }

  .control {
    position: absolute;
    inset-block-start: 50%;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--ui-carousel-control-size);
    block-size: var(--ui-carousel-control-size);
    margin-block-start: calc(var(--ui-carousel-control-size) / -2);
    padding: 0;
    border: 1px solid var(--ui-carousel-control-border);
    border-radius: var(--ui-control-radius-2, 6px);
    background: var(--ui-carousel-control-bg);
    color: var(--ui-carousel-control-color);
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
    cursor: pointer;
    transition: opacity 160ms ease, background-color 160ms ease;
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }
  :host([controls-variant="arrow"]) .control { border-radius: 999px; }
  .control svg { inline-size: 16px; block-size: 16px; }
  .control:hover:not(:disabled) { background: var(--ui-color-surface, #ffffff); }
  .control:disabled { opacity: 0.4; cursor: default; }
  .control:focus-visible,
  .indicator:focus-visible,
  .rotation:focus-visible {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: 2px;
  }
  .prev { inset-inline-start: 10px; }
  .next { inset-inline-end: 10px; }
  :host(:dir(rtl)) .control svg { transform: scaleX(-1); }

  :host([controls-position="top"]) .control { inset-block-start: 10px; margin-block-start: 0; }
  :host([controls-position="bottom"]) .control { inset-block-start: auto; inset-block-end: 10px; margin-block-start: 0; }
  :host([orientation="vertical"]) .control { inset-block-start: auto; inset-inline-start: 50%; margin-block-start: 0; margin-inline-start: calc(var(--ui-carousel-control-size) / -2); }
  :host([orientation="vertical"]) .prev { inset-block-start: 10px; }
  :host([orientation="vertical"]) .next { inset-block-end: 10px; }
  :host([orientation="vertical"]) .control svg { transform: rotate(90deg); }

  :host([controls="hidden"]) .control { display: none; }
  :host([controls="hover"]) .control { opacity: 0; }
  :host([controls="hover"]:hover) .control,
  :host([controls="hover"]:focus-within) .control { opacity: 1; }
  :host([controls="hover"]) .control:disabled { opacity: 0; }
  :host([controls="hover"]:hover) .control:disabled { opacity: 0.4; }
  @media (hover: none) { :host([controls="hover"]) .control { opacity: 1; } }

  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-block-size: 20px;
  }
  .footer[hidden] { display: none; }

  .indicators { display: flex; align-items: center; justify-content: center; gap: 2px; flex-wrap: wrap; }
  .indicators[hidden] { display: none; }

  .indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* 24px hit area around a small mark (WCAG 2.5.8). */
    min-inline-size: 24px;
    block-size: 24px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    border-radius: 999px;
  }
  .indicator i {
    display: block;
    inline-size: 8px;
    block-size: 8px;
    border-radius: 999px;
    background: var(--ui-carousel-indicator);
    transition: background-color 160ms ease, inline-size 200ms ease;
  }
  .indicator[aria-current="true"] i { background: var(--ui-carousel-indicator-active); }
  :host([indicators="pill"]) .indicator[aria-current="true"] i { inline-size: 22px; }
  :host([indicators="line"]) .indicator i { inline-size: 22px; block-size: 3px; }
  .indicator:hover i { background: color-mix(in srgb, var(--ui-carousel-indicator-active) 55%, var(--ui-carousel-indicator)); }

  .rotation {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 28px;
    block-size: 28px;
    padding: 0;
    border: 1px solid var(--ui-carousel-control-border);
    border-radius: 999px;
    background: transparent;
    color: var(--ui-carousel-control-color);
    cursor: pointer;
  }
  .rotation[hidden] { display: none; }
  .rotation svg { inline-size: 12px; block-size: 12px; }

  .sr {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .track, ::slotted(*) { transition: none !important; }
  }

  @media (forced-colors: active) {
    .control, .rotation { border-color: ButtonText; background: ButtonFace; color: ButtonText; }
    .indicator i { background: GrayText; }
    .indicator[aria-current="true"] i { background: Highlight; }
  }
`;

const CHEVRON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>';
const CHEVRON_PREV = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5"/></svg>';
const PAUSE = '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="2.5" y="2" width="2.4" height="8" rx="0.6"/><rect x="7.1" y="2" width="2.4" height="8" rx="0.6"/></svg>';
const PLAY = '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3.5 2.2v7.6a.5.5 0 0 0 .76.43l6.1-3.8a.5.5 0 0 0 0-.86l-6.1-3.8a.5.5 0 0 0-.76.43Z"/></svg>';

export type CarouselChangeReason = 'next' | 'previous' | 'indicator' | 'autoplay' | 'keyboard' | 'swipe' | 'api';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export class UICarousel extends ElementBase {
  static get observedAttributes() {
    return [
      'index', 'loop', 'autoplay', 'interval', 'no-pause-on-hover', 'orientation', 'transition',
      'controls', 'controls-variant', 'controls-position', 'indicators', 'previous-label', 'next-label', 'label',
    ];
  }

  private _index = 0;
  private playing = false;
  private userPaused = false;
  private hovering = false;
  private focusInside = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private observer: MutationObserver | null = null;
  private drag: { id: number; start: number; startCross: number; delta: number; size: number; active: boolean } | null = null;
  private reflecting = false;

  private readonly onKeyDown = (event: KeyboardEvent) => this.handleKey(event);
  private readonly onVisibility = () => this.syncTimer();
  private readonly onPointerEnter = () => { this.hovering = true; this.syncTimer(); };
  private readonly onPointerLeave = () => { this.hovering = false; this.syncTimer(); };
  private readonly onFocusIn = () => { this.focusInside = true; this.syncTimer(); };
  private readonly onFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && (this.contains(next) || this.root.contains(next))) return;
    this.focusInside = false;
    this.syncTimer();
  };

  constructor() {
    super();
    // Delegated once: render() may keep the previous DOM (setContent skips identical HTML), so
    // binding per render would stack handlers.
    this.root.addEventListener('click', (event) => {
      const button = (event.target as Element | null)?.closest?.('button');
      if (!button || !this.root.contains(button)) return;
      if (button.classList.contains('prev')) this.previous('previous');
      else if (button.classList.contains('next')) this.next('next');
      else if (button.classList.contains('indicator')) this.goTo(Number(button.getAttribute('data-index')), 'indicator');
      else if (button.classList.contains('rotation')) {
        if (this.playing) this.pause();
        else this.play();
      }
    });
    this.bindDrag();
  }

  get slides(): HTMLElement[] {
    return Array.from(this.children).filter((child): child is HTMLElement => child instanceof HTMLElement && child.localName !== 'template' && !child.hasAttribute('slot'));
  }

  get index(): number {
    return this._index;
  }

  set index(value: number) {
    this.goTo(Number(value), 'api');
  }

  override connectedCallback(): void {
    const attr = Number.parseInt(this.getAttribute('index') || '', 10);
    if (Number.isFinite(attr)) this._index = attr;
    if (this.hasAttribute('autoplay') && !prefersReducedMotion() && !this.userPaused) this.playing = true;
    super.connectedCallback();
    this.addEventListener('keydown', this.onKeyDown);
    this.addEventListener('pointerenter', this.onPointerEnter);
    this.addEventListener('pointerleave', this.onPointerLeave);
    this.addEventListener('focusin', this.onFocusIn);
    this.addEventListener('focusout', this.onFocusOut);
    document.addEventListener('visibilitychange', this.onVisibility);
    if (!this.observer && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.requestRender());
      this.observer.observe(this, { childList: true });
    }
    this.syncState();
    this.syncTimer();
  }

  override disconnectedCallback(): void {
    this.removeEventListener('keydown', this.onKeyDown);
    this.removeEventListener('pointerenter', this.onPointerEnter);
    this.removeEventListener('pointerleave', this.onPointerLeave);
    this.removeEventListener('focusin', this.onFocusIn);
    this.removeEventListener('focusout', this.onFocusOut);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.observer?.disconnect();
    this.observer = null;
    this.clearTimer();
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(name: string, _old: string | null, value: string | null): boolean {
    if (name === 'index') {
      if (this.reflecting) return false;
      const next = Number.parseInt(value || '', 10);
      if (Number.isFinite(next)) this.goTo(next, 'api', { reflect: false });
      return false;
    }
    if (name === 'autoplay') {
      this.playing = value != null && !prefersReducedMotion() && !this.userPaused;
      this.syncState();
      this.syncTimer();
      return true;
    }
    if (name === 'interval') {
      this.syncTimer();
      return false;
    }
    return true;
  }

  private clampIndex(index: number, count = this.slides.length): number {
    if (count <= 1) return 0;
    if (this.hasAttribute('loop')) return ((index % count) + count) % count;
    return Math.max(0, Math.min(count - 1, index));
  }

  goTo(index: number, reason: CarouselChangeReason = 'api', options: { reflect?: boolean } = {}): void {
    if (!Number.isFinite(index)) return;
    const count = this.slides.length;
    const next = this.clampIndex(Math.trunc(index), count);
    const previous = this._index;
    this._index = next;
    if (options.reflect !== false) {
      this.reflecting = true;
      if (this.getAttribute('index') !== String(next) && this.hasAttribute('index')) this.setAttribute('index', String(next));
      this.reflecting = false;
    }
    this.syncState();
    if (next !== previous) {
      this.dispatchEvent(new CustomEvent('change', { detail: { index: next, previousIndex: previous, reason }, bubbles: true }));
    }
    this.syncTimer();
  }

  next(reason: CarouselChangeReason = 'next'): void {
    const count = this.slides.length;
    if (count < 2) return;
    if (this._index >= count - 1 && !this.hasAttribute('loop')) return;
    this.goTo(this._index + 1, reason);
  }

  previous(reason: CarouselChangeReason = 'previous'): void {
    const count = this.slides.length;
    if (count < 2) return;
    if (this._index <= 0 && !this.hasAttribute('loop')) return;
    this.goTo(this._index - 1, reason);
  }

  play(): void {
    this.userPaused = false;
    this.playing = true;
    this.syncState();
    this.syncTimer();
  }

  pause(): void {
    this.userPaused = true;
    this.playing = false;
    this.syncState();
    this.syncTimer();
  }

  private clearTimer(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  private syncTimer(): void {
    this.clearTimer();
    if (!this.playing || !this.isConnected || this.slides.length < 2) return;
    // Rotation stops while the user is looking at or working in the carousel.
    if (this.focusInside) return;
    // Nobody is watching a background tab: do not advance behind the user's back.
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    if (this.hovering && !this.hasAttribute('no-pause-on-hover')) return;
    const interval = Math.max(1000, Number.parseInt(this.getAttribute('interval') || '', 10) || 5000);
    this.timer = setTimeout(() => {
      this.timer = null;
      const count = this.slides.length;
      // Auto-rotation always wraps, even without `loop`, or it would stop at the last slide.
      if (this._index >= count - 1) this.goTo(0, 'autoplay');
      else this.goTo(this._index + 1, 'autoplay');
    }, interval);
  }

  private handleKey(event: KeyboardEvent): void {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    // Keys typed in a form control inside a slide belong to that control.
    const origin = event.composedPath()[0] as HTMLElement | undefined;
    if (origin && origin.closest && origin.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return;
    const vertical = this.getAttribute('orientation') === 'vertical';
    const rtl = getComputedStyle(this).direction === 'rtl';
    const prevKey = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    const nextKey = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    if (event.key === prevKey) this.previous('keyboard');
    else if (event.key === nextKey) this.next('keyboard');
    else if (event.key === 'Home') this.goTo(0, 'keyboard');
    else if (event.key === 'End') this.goTo(this.slides.length - 1, 'keyboard');
    else return;
    event.preventDefault();
  }

  private bindDrag(): void {
    const vertical = () => this.getAttribute('orientation') === 'vertical';
    const parts = () => ({
      viewport: this.root.querySelector('.viewport') as HTMLElement,
      track: this.root.querySelector('.track') as HTMLElement,
    });
    this.root.addEventListener('pointerdown', (raw) => {
      const event = raw as PointerEvent;
      const { viewport } = parts();
      if (!viewport || !event.composedPath().includes(viewport)) return;
      if (event.button !== 0 || this.slides.length < 2 || event.pointerType === 'mouse' && (event.target as Element | null)?.closest?.('a, button, input, textarea, select')) return;
      const rect = viewport.getBoundingClientRect();
      this.drag = {
        id: event.pointerId,
        start: vertical() ? event.clientY : event.clientX,
        startCross: vertical() ? event.clientX : event.clientY,
        delta: 0,
        size: (vertical() ? rect.height : rect.width) || 1,
        active: false,
      };
    });
    this.root.addEventListener('pointermove', (raw) => {
      const event = raw as PointerEvent;
      const { viewport, track } = parts();
      const drag = this.drag;
      if (!drag || drag.id !== event.pointerId) return;
      const pos = vertical() ? event.clientY : event.clientX;
      const cross = vertical() ? event.clientX : event.clientY;
      drag.delta = pos - drag.start;
      if (!drag.active) {
        // Only take over once the gesture is clearly along the carousel axis.
        if (Math.abs(drag.delta) < 8 || Math.abs(drag.delta) < Math.abs(cross - drag.startCross)) return;
        drag.active = true;
        try { viewport.setPointerCapture(event.pointerId); } catch { /* not capturable */ }
        track.setAttribute('data-dragging', '');
      }
      if (this.getAttribute('transition') === 'fade') return;
      // The track follows the finger: its resting offset plus the pointer's travel in pixels.
      const dir = vertical() ? 1 : getComputedStyle(this).direction === 'rtl' ? -1 : 1;
      const axis = vertical() ? 'Y' : 'X';
      track.style.transform = `translate${axis}(calc(${-this._index * 100 * dir}% + ${drag.delta}px))`;
    });
    const end = (raw: Event) => {
      const event = raw as PointerEvent;
      const { track } = parts();
      const drag = this.drag;
      if (!drag || drag.id !== event.pointerId) return;
      this.drag = null;
      track.removeAttribute('data-dragging');
      track.style.transform = '';
      if (!drag.active) return;
      track.setAttribute('data-was-dragged', '');
      setTimeout(() => track.removeAttribute('data-was-dragged'), 0);
      const threshold = Math.min(80, drag.size * 0.18);
      const rtl = !vertical() && getComputedStyle(this).direction === 'rtl';
      const forward = rtl ? drag.delta > 0 : drag.delta < 0;
      if (Math.abs(drag.delta) >= threshold) {
        if (forward) this.next('swipe');
        else this.previous('swipe');
      }
    };
    this.root.addEventListener('pointerup', end);
    this.root.addEventListener('pointercancel', end);
    // A drag that moved should not also click a link inside the slide.
    this.root.addEventListener('click', (event) => {
      const { track } = parts();
      if (track?.hasAttribute('data-was-dragged')) {
        event.preventDefault();
        event.stopPropagation();
        track.removeAttribute('data-was-dragged');
      }
    }, true);
  }

  private syncState(): void {
    const slides = this.slides;
    const count = slides.length;
    this._index = this.clampIndex(this._index, count);
    const index = this._index;
    this.style.setProperty('--ui-carousel-index', String(index));

    slides.forEach((slide, i) => {
      const active = i === index;
      slide.toggleAttribute('data-carousel-active', active);
      if (!slide.hasAttribute('role') || slide.hasAttribute('data-carousel-role')) {
        slide.setAttribute('role', 'group');
        slide.setAttribute('data-carousel-role', '');
      }
      slide.setAttribute('aria-roledescription', 'slide');
      const own = slide.getAttribute('label') || slide.getAttribute('data-label');
      if (!slide.hasAttribute('aria-labelledby')) slide.setAttribute('aria-label', own ? `${own} (${i + 1} of ${count})` : `${i + 1} of ${count}`);
      // The attribute (not only the property) so it also holds where `inert` is not implemented
      // as a property, and survives serialisation.
      slide.toggleAttribute('inert', !active);
      if (active) slide.removeAttribute('aria-hidden');
      else slide.setAttribute('aria-hidden', 'true');
    });

    const loop = this.hasAttribute('loop');
    const prev = this.root.querySelector('.prev') as HTMLButtonElement | null;
    const next = this.root.querySelector('.next') as HTMLButtonElement | null;
    if (prev) prev.disabled = count < 2 || (!loop && index <= 0);
    if (next) next.disabled = count < 2 || (!loop && index >= count - 1);

    this.root.querySelectorAll<HTMLButtonElement>('.indicator').forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });

    const viewport = this.root.querySelector('.viewport');
    viewport?.setAttribute('aria-live', this.playing ? 'off' : 'polite');

    const rotation = this.root.querySelector('.rotation') as HTMLButtonElement | null;
    if (rotation) {
      const autoplay = this.hasAttribute('autoplay') && count > 1;
      rotation.hidden = !autoplay;
      rotation.setAttribute('aria-label', this.playing ? 'Stop automatic slide show' : 'Start automatic slide show');
      rotation.innerHTML = this.playing ? PAUSE : PLAY;
    }
  }

  protected override render(): void {
    const count = this.slides.length;
    const label = this.getAttribute('label') || '';
    const prevLabel = this.getAttribute('previous-label') || 'Previous slide';
    const nextLabel = this.getAttribute('next-label') || 'Next slide';
    const indicators = this.getAttribute('indicators');
    const showIndicators = indicators !== 'hidden' && count > 1;

    this.setAttribute('role', this.getAttribute('role') || 'region');
    this.setAttribute('aria-roledescription', 'carousel');
    if (label) this.setAttribute('aria-label', label);

    const dots = showIndicators
      ? Array.from({ length: count }, (_, i) => `<button type="button" class="indicator" part="indicator" data-index="${i}" aria-label="Go to slide ${i + 1} of ${count}"><i></i></button>`).join('')
      : '';

    // Order matters: the rotation control comes first in the tab order (WAI-ARIA carousel).
    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="footer top-footer" part="rotation-bar" ${this.hasAttribute('autoplay') && count > 1 ? '' : 'hidden'}>
          <button type="button" class="rotation" part="rotation-button" hidden></button>
        </div>
        <div class="viewport" part="viewport">
          <button type="button" class="control prev" part="control previous" aria-label="${escapeHtml(prevLabel)}">${CHEVRON_PREV}</button>
          <div class="track" part="track"><slot></slot></div>
          <button type="button" class="control next" part="control next" aria-label="${escapeHtml(nextLabel)}">${CHEVRON}</button>
        </div>
        <div class="footer" part="footer" ${showIndicators ? '' : 'hidden'}>
          <div class="indicators" part="indicators" role="group" aria-label="Choose slide"${showIndicators ? '' : ' hidden'}>${dots}</div>
        </div>
      </div>
    `);

    this.syncState();
    this.syncTimer();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-carousel')) {
  customElements.define('ui-carousel', UICarousel);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-carousel': UICarousel;
  }
}
