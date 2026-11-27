import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';

/**
 * The scroll container of a chat transcript. It keeps the reader where they want to be while
 * messages stream in, older history loads above, and new turns start.
 *
 *   <ui-message-scroller style="height: 480px">
 *     …one child per message; mark the first message of each turn with scroll-anchor…
 *   </ui-message-scroller>
 *
 * Behaviour:
 * - Opens at the end (`initial-scroll`: end | start | last-anchor).
 * - Follows output: at the live edge, growing content (a streamed reply) keeps the view at the
 *   bottom. Wheel, touch, scroll keys, dragging the scrollbar or jumping to a message releases it;
 *   new content then arrives without moving the reader. Scrolling back to the bottom, the "Jump to
 *   latest" button or scrollToEnd() resumes following. `no-auto-scroll` turns following off.
 * - Anchors turns: when a child with `scroll-anchor` is added (the user's new question), it is
 *   scrolled near the top, `anchor-peek` px (default 24) of the previous message still visible,
 *   and the answer streams in under it; once the answer outgrows the view, following takes over.
 * - Keeps the reader's place when messages are added above (history loading).
 * - Fires `reach-start` when the reader gets near the top (to load older messages), and
 *   `follow-change` (detail: { following }) when following starts or stops.
 *
 * Accessibility: the viewport is a focusable region named `label` (default "Messages"); the
 * content is a log (aria-relevant additions), so new messages are announced, not every streamed
 * token; set `busy` while a reply streams to hold announcements until it is complete.
 *
 * Children are identified for scrollToMessage(id) by `message-id`, `data-message-id` or `id`.
 * Methods: scrollToEnd(options?), scrollToStart(options?), scrollToMessage(id, options?).
 * Properties: following, atEnd, atStart.
 */
const style = `
  :host {
    --ui-message-scroller-gap: 16px;
    --ui-message-scroller-pad: 16px;
    color-scheme: light dark;
    position: relative;
    display: block;
    block-size: 100%;
    min-block-size: 0;
    min-inline-size: 0;
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  :host([hidden]) { display: none; }

  .viewport {
    box-sizing: border-box;
    block-size: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    /* Our own place-keeping replaces the browser's, so the two never correct each other. */
    overflow-anchor: none;
    overscroll-behavior: contain;
    outline: none;
  }
  .viewport:focus-visible {
    box-shadow: inset 0 0 0 2px var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
  }
  /* Hidden until the opening position is applied, so the transcript never flashes at the top. */
  :host([data-pending-scroll]) .viewport { visibility: hidden; }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--ui-message-scroller-gap);
    padding: var(--ui-message-scroller-pad);
    min-block-size: 100%;
    box-sizing: border-box;
  }
  /* Short transcripts sit at the bottom, like a chat. */
  :host(:not([align-top])) .content::before { content: ""; flex: 1 1 auto; }

  .jump {
    position: absolute;
    inset-inline-start: 50%;
    inset-block-end: 14px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    block-size: 30px;
    padding: 0 12px;
    transform: translateX(-50%);
    border: 1px solid var(--ui-color-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 14%, transparent));
    border-radius: 999px;
    background: var(--ui-color-surface, #ffffff);
    color: var(--ui-color-text, #0f172a);
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.14);
    font: inherit;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 160ms ease, transform 160ms ease;
  }
  :host(:dir(rtl)) .jump { transform: translateX(50%); }
  .jump svg { inline-size: 14px; block-size: 14px; }
  .jump[data-active="false"] { opacity: 0; pointer-events: none; transform: translate(-50%, 6px); }
  .jump:focus-visible {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: 2px;
  }
  :host([no-jump-button]) .jump { display: none; }

  @media (prefers-reduced-motion: reduce) {
    .jump { transition: none; }
  }
  @media (forced-colors: active) {
    .jump { border-color: ButtonText; background: ButtonFace; color: ButtonText; }
  }
`;

const ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3v10m0 0 4-4m-4 4-4-4"/></svg>';
const EDGE = 4;
const RELEASE_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

type Mode = 'following' | 'anchored' | 'released';
type ScrollOptions = { behavior?: ScrollBehavior };

function reducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export class UIMessageScroller extends ElementBase {
  static get observedAttributes() {
    return ['label', 'busy', 'no-auto-scroll'];
  }

  private mode: Mode = 'following';
  private anchorEl: HTMLElement | null = null;
  private viewport: HTMLElement | null = null;
  private content: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private programmatic = 0;
  private lastScrollTop = 0;
  private reference: { el: Element; top: number } | null = null;
  private opened = false;
  private reachStartArmed = true;
  private pendingFrame = 0;
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;
  /** The latest turn anchor: the bottom spacer lets it reach the top of the view. */
  private lastAnchor: HTMLElement | null = null;

  constructor() {
    super();
    this.root.addEventListener('click', (event) => {
      if ((event.target as Element | null)?.closest?.('.jump')) this.scrollToEnd({ behavior: reducedMotion() ? 'auto' : 'smooth' });
    });
  }

  /** Whether new content keeps the view at the end. */
  get following(): boolean {
    return this.mode !== 'released';
  }

  get atEnd(): boolean {
    const vp = this.viewport;
    return !vp || vp.scrollHeight - vp.clientHeight - vp.scrollTop <= EDGE;
  }

  get atStart(): boolean {
    return !this.viewport || this.viewport.scrollTop <= EDGE;
  }

  override connectedCallback(): void {
    if (!this.opened && this.getAttribute('initial-scroll') !== 'start') this.setAttribute('data-pending-scroll', '');
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    this.resizeObserver = null;
    this.mutationObserver = null;
    if (this.pendingFrame) cancelAnimationFrame(this.pendingFrame);
    if (this.pendingTimer) clearTimeout(this.pendingTimer);
    this.pendingFrame = 0;
    this.pendingTimer = null;
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(name: string, _old: string | null, value: string | null): boolean {
    if (name === 'busy') {
      if (value != null) this.content?.setAttribute('aria-busy', 'true');
      else this.content?.removeAttribute('aria-busy');
      return false;
    }
    if (name === 'label') {
      this.viewport?.setAttribute('aria-label', value || 'Messages');
      return false;
    }
    return false;
  }

  private items(): HTMLElement[] {
    return Array.from(this.children).filter((child): child is HTMLElement => child instanceof HTMLElement && !child.hasAttribute('slot'));
  }

  private setScrollTop(top: number, behavior: ScrollBehavior = 'auto'): void {
    const vp = this.viewport;
    if (!vp) return;
    const max = Math.max(0, vp.scrollHeight - vp.clientHeight);
    const next = Math.max(0, Math.min(max, top));
    if (Math.abs(next - vp.scrollTop) < 0.5) return;
    this.programmatic += 1;
    if (behavior === 'smooth' && typeof vp.scrollTo === 'function') vp.scrollTo({ top: next, behavior: 'smooth' });
    else vp.scrollTop = next;
    // A smooth scroll fires many scroll events; treat them all as ours for a moment.
    setTimeout(() => { this.programmatic = Math.max(0, this.programmatic - 1); }, behavior === 'smooth' ? 600 : 50);
  }

  private setMode(mode: Mode): void {
    const was = this.following;
    this.mode = mode;
    if (mode !== 'anchored') this.anchorEl = null;
    if (was !== this.following) {
      this.dispatchEvent(new CustomEvent('follow-change', { detail: { following: this.following }, bubbles: true }));
    }
    this.syncButton();
  }

  scrollToEnd(options: ScrollOptions = {}): void {
    if (!this.viewport) return;
    this.setMode('following');
    this.setScrollTop(this.viewport.scrollHeight, options.behavior);
  }

  scrollToStart(options: ScrollOptions = {}): void {
    this.setMode('released');
    this.setScrollTop(0, options.behavior);
  }

  /** Scrolls a message to the top of the view. Returns false when no such message is mounted. */
  scrollToMessage(id: string, options: ScrollOptions & { block?: 'start' | 'center' | 'end' } = {}): boolean {
    const target = this.items().find((item) => item.getAttribute('message-id') === id || item.getAttribute('data-message-id') === id || item.id === id);
    const vp = this.viewport;
    if (!target || !vp) return false;
    this.setMode('released');
    const top = this.offsetIn(target);
    const block = options.block || 'start';
    const offset = block === 'center' ? (vp.clientHeight - target.offsetHeight) / 2 : block === 'end' ? vp.clientHeight - target.offsetHeight : 0;
    this.setScrollTop(top - offset, options.behavior);
    return true;
  }

  /** Top of `el` in the scrolled content's coordinates. */
  private offsetIn(el: Element): number {
    const vp = this.viewport!;
    return el.getBoundingClientRect().top - vp.getBoundingClientRect().top + vp.scrollTop;
  }

  private anchorTarget(el: HTMLElement): number {
    const peek = Number.parseFloat(this.getAttribute('anchor-peek') || '');
    return this.offsetIn(el) - (Number.isFinite(peek) ? peek : 24);
  }

  /**
   * Sizes the bottom spacer so the latest anchor can be scrolled to the top even while the answer
   * under it is still short. It shrinks to nothing as the answer grows.
   */
  private updateSpacer(): void {
    const vp = this.viewport;
    const spacer = this.root.querySelector('.spacer') as HTMLElement | null;
    if (!vp || !spacer) return;
    const anchor = this.lastAnchor;
    if (!anchor || !anchor.isConnected) {
      spacer.style.blockSize = '0px';
      return;
    }
    const current = spacer.offsetHeight;
    const target = this.anchorTarget(anchor);
    const needed = Math.max(0, Math.ceil(target + vp.clientHeight - (vp.scrollHeight - current)));
    if (Math.abs(needed - current) >= 1) spacer.style.blockSize = `${needed}px`;
  }

  /** Re-applies the mode after the content changed size. */
  private settle(): void {
    const vp = this.viewport;
    if (!vp || !this.opened) return;
    this.updateSpacer();
    if (this.hasAttribute('no-auto-scroll') && this.mode !== 'released') {
      this.keepReference();
    } else if (this.mode === 'following') {
      this.setScrollTop(vp.scrollHeight);
    } else if (this.mode === 'anchored' && this.anchorEl && this.anchorEl.isConnected) {
      const target = this.anchorTarget(this.anchorEl);
      const spacer = (this.root.querySelector('.spacer') as HTMLElement | null)?.offsetHeight || 0;
      // The answer under the anchor outgrew the view: follow its end from now on.
      if (vp.scrollHeight - spacer - target > vp.clientHeight + EDGE) {
        this.setMode('following');
        this.setScrollTop(vp.scrollHeight);
      } else {
        this.setScrollTop(target);
      }
    } else {
      this.keepReference();
    }
    this.rememberReference();
    this.syncButton();
  }

  /** Remembers the first visible message and where it is, to keep it in place across changes. */
  private rememberReference(): void {
    const vp = this.viewport;
    if (!vp) return;
    const top = vp.getBoundingClientRect().top;
    const items = this.items();
    // Items are in document order, so the first one whose bottom is below the viewport's top is
    // found by binary search: no layout read per message in a long transcript.
    let lo = 0;
    let hi = items.length - 1;
    let found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (items[mid].getBoundingClientRect().bottom > top + 1) {
        found = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    const visible = found >= 0 ? items[found] : null;
    this.reference = visible ? { el: visible, top: visible.getBoundingClientRect().top - top } : null;
  }

  /** Puts the remembered message back where it was (content was added or resized above it). */
  private keepReference(): void {
    const vp = this.viewport;
    const ref = this.reference;
    if (!vp || !ref || !ref.el.isConnected) return;
    const now = ref.el.getBoundingClientRect().top - vp.getBoundingClientRect().top;
    const delta = now - ref.top;
    if (Math.abs(delta) >= 0.5) this.setScrollTop(vp.scrollTop + delta);
  }

  private onMutations(records: MutationRecord[]): void {
    let anchor: HTMLElement | null = null;
    for (const record of records) {
      for (const node of Array.from(record.addedNodes)) {
        if (node instanceof HTMLElement && node.parentElement === this && node.hasAttribute('scroll-anchor')) anchor = node;
      }
    }
    if (anchor) {
      this.lastAnchor = anchor;
      if (!this.hasAttribute('no-auto-scroll')) {
        const was = this.following;
        this.mode = 'anchored';
        this.anchorEl = anchor;
        if (!was) this.dispatchEvent(new CustomEvent('follow-change', { detail: { following: true }, bubbles: true }));
      }
    }
    this.settle();
  }

  private release(): void {
    if (this.mode !== 'released') this.setMode('released');
  }

  private bindViewport(vp: HTMLElement): void {
    vp.addEventListener('wheel', (event) => { if ((event as WheelEvent).deltaY < 0 || !this.atEnd) this.release(); }, { passive: true });
    vp.addEventListener('touchmove', () => this.release(), { passive: true });
    vp.addEventListener('keydown', (event) => { if (RELEASE_KEYS.has(event.key)) this.release(); });
    // Pressing on the scrollbar (outside the content box) starts a drag of it.
    vp.addEventListener('pointerdown', (event) => {
      const rect = vp.getBoundingClientRect();
      if (event.clientX > rect.left + vp.clientWidth) this.release();
    });
    vp.addEventListener('scroll', () => {
      const top = vp.scrollTop;
      const user = this.programmatic === 0;
      if (user) {
        if (this.atEnd) {
          if (this.mode === 'released') this.setMode('following');
        } else if (top < this.lastScrollTop - 1) {
          this.release();
        }
      }
      this.lastScrollTop = top;
      if (this.mode === 'released' || user) this.rememberReference();
      if (top <= 48) {
        if (this.reachStartArmed && this.opened) {
          this.reachStartArmed = false;
          this.dispatchEvent(new CustomEvent('reach-start', { bubbles: true }));
        }
      } else if (top > 120) {
        this.reachStartArmed = true;
      }
      this.syncButton();
    }, { passive: true });
  }

  private syncButton(): void {
    const button = this.root.querySelector('.jump') as HTMLButtonElement | null;
    if (!button) return;
    const active = !this.atEnd;
    button.setAttribute('data-active', String(active));
    // Inactive: out of the tab order and the accessibility tree, so it adds no stop.
    button.tabIndex = active ? 0 : -1;
    button.toggleAttribute('inert', !active);
    if (active) button.removeAttribute('aria-hidden');
    else button.setAttribute('aria-hidden', 'true');
  }

  private open(): void {
    const vp = this.viewport;
    if (!vp) return;
    // Only the last-anchor opening reserves room under the last turn; "end" opens at the bottom.
    const anchors = this.items().filter((item) => item.hasAttribute('scroll-anchor'));
    this.lastAnchor = this.getAttribute('initial-scroll') === 'last-anchor' ? anchors[anchors.length - 1] || null : null;
    const initial = this.getAttribute('initial-scroll');
    if (initial === 'start') {
      this.mode = 'released';
      vp.scrollTop = 0;
    } else if (initial === 'last-anchor') {
      const last = anchors[anchors.length - 1];
      const target = last ? this.anchorTarget(last) : null;
      if (last && target != null && vp.scrollHeight - target > vp.clientHeight) {
        this.mode = 'released';
        vp.scrollTop = target;
      } else {
        vp.scrollTop = vp.scrollHeight;
      }
    } else {
      vp.scrollTop = vp.scrollHeight;
    }
    this.lastScrollTop = vp.scrollTop;
    this.opened = true;
    this.removeAttribute('data-pending-scroll');
    this.rememberReference();
    this.syncButton();
  }

  protected override render(): void {
    const label = this.getAttribute('label') || 'Messages';
    this.setContent(`
      <style>${style}</style>
      <div class="viewport" part="viewport" role="region" tabindex="0" aria-label="${escapeHtml(label)}">
        <div class="content" part="content" role="log" aria-relevant="additions"${this.hasAttribute('busy') ? ' aria-busy="true"' : ''}><slot></slot></div>
        <div class="spacer" aria-hidden="true"></div>
      </div>
      <button type="button" class="jump" part="jump-button" data-active="false" tabindex="-1" inert aria-hidden="true">${ARROW}<span>${escapeHtml(this.getAttribute('jump-label') || 'Jump to latest')}</span></button>
    `);
    const vp = this.root.querySelector('.viewport') as HTMLElement;
    const content = this.root.querySelector('.content') as HTMLElement;
    if (vp === this.viewport) return;
    this.viewport = vp;
    this.content = content;
    this.bindViewport(vp);

    this.resizeObserver?.disconnect();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.settle());
      this.resizeObserver.observe(content);
      this.resizeObserver.observe(vp);
    }
    this.mutationObserver?.disconnect();
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver((records) => this.onMutations(records));
      this.mutationObserver.observe(this, { childList: true, subtree: true, characterData: true });
    }
    // Lay out first, then place: one frame, while the viewport is hidden.
    // A background tab may never run the frame: a timer places it anyway.
    const place = () => {
      if (this.pendingFrame) cancelAnimationFrame(this.pendingFrame);
      if (this.pendingTimer) clearTimeout(this.pendingTimer);
      this.pendingFrame = 0;
      this.pendingTimer = null;
      if (!this.opened) this.open();
    };
    if (typeof requestAnimationFrame === 'function') this.pendingFrame = requestAnimationFrame(place);
    this.pendingTimer = setTimeout(place, 120);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-message-scroller')) {
  customElements.define('ui-message-scroller', UIMessageScroller);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-message-scroller': UIMessageScroller;
  }
}
