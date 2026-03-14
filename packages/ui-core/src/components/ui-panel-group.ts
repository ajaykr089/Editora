import { ElementBase } from '../ElementBase';
import { normalizePanelLayout, resizePanelPair, type PanelConstraint } from '../primitives/panel-layout';
import './ui-panel';
import './ui-splitter';
import { UIPanel } from './ui-panel';
import { UISplitter } from './ui-splitter';

const style = `
  :host {
    display: block;
    min-inline-size: 0;
    min-block-size: 0;
    --ui-panel-group-gap: 0px;
  }

  .group {
    inline-size: 100%;
    block-size: 100%;
    min-inline-size: 0;
    min-block-size: 0;
    display: flex;
    gap: var(--ui-panel-group-gap);
  }

  :host([orientation="vertical"]) .group {
    flex-direction: column;
  }

  slot {
    display: contents;
  }

  ::slotted(ui-panel) {
    min-inline-size: 0;
    min-block-size: 0;
    overflow: hidden;
  }
`;

type DragState = {
  splitterIndex: number;
  pointerId: number;
  origin: number;
  startLayout: number[];
};

function clampPercent(value: number, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(100, Math.max(0, parsed));
}

export class UIPanelGroup extends ElementBase {
  static get observedAttributes() {
    return ['orientation', 'storage-key', 'auto-save'];
  }

  private _observer: MutationObserver | null = null;
  private _panels: UIPanel[] = [];
  private _splitters: UISplitter[] = [];
  private _layout: number[] = [];
  private _initialLayout: number[] = [];
  private _dragState: DragState | null = null;
  private _isMutatingChildren = false;

  constructor() {
    super();
    this._onMutation = this._onMutation.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('pointerdown', this._onPointerDown);
    this.addEventListener('keydown', this._onKeyDown);
    this._observer = new MutationObserver(this._onMutation);
    this._observer.observe(this, { childList: true, attributes: true, subtree: true });
    queueMicrotask(() => this._syncStructure({ restore: true }));
  }

  override disconnectedCallback(): void {
    this.removeEventListener('pointerdown', this._onPointerDown);
    this.removeEventListener('keydown', this._onKeyDown);
    this._observer?.disconnect();
    this._observer = null;
    this._teardownDrag();
    super.disconnectedCallback();
  }

  getLayout(): number[] {
    return [...this._layout];
  }

  setLayout(sizes: number[]): void {
    const normalized = normalizePanelLayout(this._constraints(), sizes);
    this._applyLayout(normalized, { persist: true, emit: true });
  }

  resetLayout(): void {
    const target = this._initialLayout.length ? this._initialLayout : normalizePanelLayout(this._constraints(), []);
    this._applyLayout(target, { persist: true, emit: true });
  }

  collapsePanel(panel: UIPanel): void {
    const index = this._panels.indexOf(panel);
    if (index < 0) return;
    const constraints = this._constraints();
    const next = [...this._layout];
    const freed = next[index] - constraints[index].collapsedSize;
    next[index] = constraints[index].collapsedSize;
    this._distributeRemainder(next, index, freed);
    panel.setAttribute('collapsed', '');
    this._applyLayout(normalizePanelLayout(this._constraints(), next), { persist: true, emit: true });
  }

  expandPanel(panel: UIPanel): void {
    const index = this._panels.indexOf(panel);
    if (index < 0) return;
    panel.removeAttribute('collapsed');
    const constraints = this._constraints();
    const desired = this._layout[index] <= constraints[index].collapsedSize + 0.001
      ? normalizePanelLayout(constraints, this._initialLayout)[index]
      : this._layout[index];
    const next = [...this._layout];
    const delta = desired - next[index];
    next[index] = desired;
    this._distributeRemainder(next, index, -delta);
    this._applyLayout(normalizePanelLayout(this._constraints(), next), { persist: true, emit: true });
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'orientation') {
      this._syncOrientation();
      this._applyLayout(this._layout.length ? this._layout : normalizePanelLayout(this._constraints(), []), { persist: false, emit: false });
      return;
    }
    if (name === 'storage-key' || name === 'auto-save') return;
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private _onMutation(records: MutationRecord[]): void {
    if (this._isMutatingChildren) return;
    const shouldSync = records.some((record) => {
      if (record.type === 'childList') return true;
      return record.target instanceof UIPanel && (
        record.attributeName === 'size' ||
        record.attributeName === 'min-size' ||
        record.attributeName === 'max-size' ||
        record.attributeName === 'collapsed-size' ||
        record.attributeName === 'collapsed'
      );
    });
    if (shouldSync) this._syncStructure({ restore: false });
  }

  private _orientation(): 'horizontal' | 'vertical' {
    return this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
  }

  private _constraints(): PanelConstraint[] {
    return this._panels.map((panel) => {
      const collapsed = panel.hasAttribute('collapsed');
      const collapsedSize = clampPercent(Number(panel.getAttribute('collapsed-size') || 0), 0);
      const min = clampPercent(Number(panel.getAttribute('min-size') || (collapsed ? collapsedSize : 10)), collapsed ? collapsedSize : 10);
      const max = clampPercent(Number(panel.getAttribute('max-size') || 100), 100);
      return {
        min: collapsed ? collapsedSize : Math.min(min, max),
        max: collapsed ? collapsedSize : Math.max(min, max),
        collapsedSize,
        collapsed
      };
    });
  }

  private _desiredLayout(): number[] {
    const persisted = this._loadPersistedLayout();
    if (persisted?.length === this._panels.length) return persisted;
    return this._panels.map((panel) => {
      const raw = panel.getAttribute('size');
      if (raw == null || raw.trim() === '') return NaN;
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : NaN;
    });
  }

  private _syncStructure(options: { restore: boolean }): void {
    this._syncGeneratedSplitters();
    this._panels = Array.from(this.children).filter((child): child is UIPanel => child instanceof UIPanel);
    this._splitters = Array.from(this.children).filter((child): child is UISplitter => child instanceof UISplitter);
    this._syncOrientation();

    const desired = this._desiredLayout();
    const next = normalizePanelLayout(this._constraints(), desired);
    if (!this._initialLayout.length || options.restore) this._initialLayout = [...next];
    this._applyLayout(next, { persist: false, emit: false });
  }

  private _syncGeneratedSplitters(): void {
    const panels = Array.from(this.children).filter((child): child is UIPanel => child instanceof UIPanel);
    if (panels.length <= 1) return;

    this._isMutatingChildren = true;
    try {
      Array.from(this.children)
        .filter((child) => child instanceof UISplitter && child.hasAttribute('data-generated'))
        .forEach((splitter) => {
          const prev = splitter.previousElementSibling;
          const next = splitter.nextElementSibling;
          if (!(prev instanceof UIPanel) || !(next instanceof UIPanel)) splitter.remove();
        });

      for (let index = 1; index < panels.length; index += 1) {
        const panel = panels[index];
        let previous = panel.previousElementSibling;
        while (previous && !(previous instanceof UIPanel || previous instanceof UISplitter)) {
          previous = previous.previousElementSibling;
        }
        if (previous instanceof UISplitter) continue;

        const splitter = document.createElement('ui-splitter') as UISplitter;
        splitter.setAttribute('data-generated', '');
        panel.before(splitter);
      }
    } finally {
      this._isMutatingChildren = false;
    }
  }

  private _syncOrientation(): void {
    const orientation = this._orientation();
    this._splitters.forEach((splitter, index) => {
      splitter.setAttribute('orientation', orientation);
      splitter.setAttribute('data-index', String(index));
    });
  }

  private _applyLayout(layout: number[], options: { persist: boolean; emit: boolean }): void {
    this._layout = [...layout];
    const orientation = this._orientation();
    const constraints = this._constraints();

    this._panels.forEach((panel, index) => {
      const size = this._layout[index] ?? 0;
      const bounds = constraints[index];
      panel.style.flex = `${size} 1 0px`;
      if (orientation === 'horizontal') {
        panel.style.minWidth = `${bounds.min}%`;
        panel.style.maxWidth = `${bounds.max}%`;
        panel.style.minHeight = '0';
        panel.style.maxHeight = '';
      } else {
        panel.style.minHeight = `${bounds.min}%`;
        panel.style.maxHeight = `${bounds.max}%`;
        panel.style.minWidth = '0';
        panel.style.maxWidth = '';
      }
      panel.setAttribute('data-panel-size', String(size));
    });

    this._splitters.forEach((splitter, index) => {
      const value = this._layout[index] ?? 0;
      splitter.setAttribute('aria-valuemin', String(Math.round(constraints[index].min)));
      splitter.setAttribute('aria-valuemax', String(Math.round(constraints[index].max)));
      splitter.setAttribute('aria-valuenow', String(Math.round(value)));
    });

    if (options.persist) this._persistLayout();
    if (options.emit) {
      this.dispatchEvent(
        new CustomEvent('layout-change', {
          detail: { sizes: [...this._layout] },
          bubbles: true,
          composed: true
        })
      );
    }
  }

  private _availableSize(): number {
    const rect = this.getBoundingClientRect();
    const total = this._orientation() === 'horizontal' ? rect.width : rect.height;
    const splitterSize = this._splitters.reduce((sum, splitter) => {
      const splitterRect = splitter.getBoundingClientRect();
      return sum + (this._orientation() === 'horizontal' ? splitterRect.width : splitterRect.height);
    }, 0);
    return Math.max(1, total - splitterSize);
  }

  private _persistLayout(): void {
    const key = this.getAttribute('storage-key');
    if (!key || !readBooleanAttr(this, 'auto-save')) return;
    try {
      window.localStorage.setItem(`ui-panel-group:${key}`, JSON.stringify(this._layout));
    } catch {
      // ignore persistence failures
    }
  }

  private _loadPersistedLayout(): number[] | null {
    const key = this.getAttribute('storage-key');
    if (!key) return null;
    try {
      const raw = window.localStorage.getItem(`ui-panel-group:${key}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map((value) => Number(value)).filter(Number.isFinite) : null;
    } catch {
      return null;
    }
  }

  private _distributeRemainder(layout: number[], lockedIndex: number, delta: number): void {
    if (Math.abs(delta) < 0.001) return;
    const candidates = layout
      .map((_, index) => index)
      .filter((index) => index !== lockedIndex);
    if (!candidates.length) return;
    const portion = delta / candidates.length;
    candidates.forEach((index) => {
      layout[index] += portion;
    });
  }

  private _onPointerDown(event: PointerEvent): void {
    const splitter = event
      .composedPath()
      .find((node): node is UISplitter => node instanceof UISplitter);
    if (!splitter || splitter.hasAttribute('disabled')) return;
    const splitterIndex = Number(splitter.getAttribute('data-index'));
    if (!Number.isFinite(splitterIndex)) return;

    event.preventDefault();
    splitter.setAttribute('data-dragging', 'true');
    this._dragState = {
      splitterIndex,
      pointerId: event.pointerId,
      origin: this._orientation() === 'horizontal' ? event.clientX : event.clientY,
      startLayout: [...this._layout]
    };

    window.addEventListener('pointermove', this._onPointerMove);
    window.addEventListener('pointerup', this._onPointerUp);
    this.dispatchEvent(new CustomEvent('resize-start', { detail: { index: splitterIndex }, bubbles: true, composed: true }));
  }

  private _onPointerMove(event: PointerEvent): void {
    if (!this._dragState || event.pointerId !== this._dragState.pointerId) return;
    const current = this._orientation() === 'horizontal' ? event.clientX : event.clientY;
    const deltaPx = current - this._dragState.origin;
    const deltaPercent = (deltaPx / this._availableSize()) * 100;
    const next = resizePanelPair(this._dragState.startLayout, this._constraints(), this._dragState.splitterIndex, deltaPercent);
    this._applyLayout(next, { persist: false, emit: true });
    this.dispatchEvent(new CustomEvent('resize', { detail: { index: this._dragState.splitterIndex, sizes: [...this._layout] }, bubbles: true, composed: true }));
  }

  private _onPointerUp(event: PointerEvent): void {
    if (!this._dragState || event.pointerId !== this._dragState.pointerId) return;
    const splitter = this._splitters[this._dragState.splitterIndex];
    splitter?.removeAttribute('data-dragging');
    this._persistLayout();
    this.dispatchEvent(new CustomEvent('resize-end', { detail: { index: this._dragState.splitterIndex, sizes: [...this._layout] }, bubbles: true, composed: true }));
    this._teardownDrag();
  }

  private _teardownDrag(): void {
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    this._splitters.forEach((splitter) => splitter.removeAttribute('data-dragging'));
    this._dragState = null;
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const splitter = event
      .composedPath()
      .find((node): node is UISplitter => node instanceof UISplitter);
    if (!splitter || splitter.hasAttribute('disabled')) return;

    const index = Number(splitter.getAttribute('data-index'));
    if (!Number.isFinite(index)) return;

    const orientation = this._orientation();
    const horizontal = orientation === 'horizontal';
    const step = event.shiftKey ? 10 : 2;
    let delta = 0;

    if ((horizontal && event.key === 'ArrowRight') || (!horizontal && event.key === 'ArrowDown')) delta = step;
    if ((horizontal && event.key === 'ArrowLeft') || (!horizontal && event.key === 'ArrowUp')) delta = -step;

    if (event.key === 'Home') delta = -100;
    if (event.key === 'End') delta = 100;

    if (!delta) return;
    event.preventDefault();

    const next = resizePanelPair(this._layout, this._constraints(), index, delta);
    this._applyLayout(next, { persist: true, emit: true });
    this.dispatchEvent(new CustomEvent('resize', { detail: { index, sizes: [...this._layout] }, bubbles: true, composed: true }));
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="group" part="group">
        <slot></slot>
      </div>
    `);
  }
}

function readBooleanAttr(el: HTMLElement, name: string): boolean {
  const raw = el.getAttribute(name);
  if (raw == null) return false;
  const normalized = String(raw).trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-panel-group': UIPanelGroup;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-panel-group')) {
  customElements.define('ui-panel-group', UIPanelGroup);
}
