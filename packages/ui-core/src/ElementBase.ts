export abstract class ElementBase extends HTMLElement {
  protected root: ShadowRoot;
  private _isRendering = false;
  private _renderRequested = false;
  private _renderScheduled = false;
  private _hasRendered = false;
  private _visibilityGuardApplied = false;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this._hasRendered && !this._visibilityGuardApplied) {
      const inlineVisibility = this.style.getPropertyValue('visibility').trim();
      if (!inlineVisibility) {
        this.style.setProperty('visibility', 'hidden');
        this._visibilityGuardApplied = true;
      }
    }
    this._scheduleRender();
  }

  disconnectedCallback() {
    // ensure any component-level portal cleanup runs when element is detached
    try {
      // prefer calling component close() if available (releases traps/manager state)
      if (typeof (this as any).close === 'function') {
        try { (this as any).close(); } catch (e) {}
      }
      // call stored cleanup functions created by showPortalFor
      if (typeof (this as any)._cleanup === 'function') {
        try { (this as any)._cleanup(); } catch (e) {}
        (this as any)._cleanup = undefined;
      }
      // some components store menu cleanup under __menuCleanup
      if (typeof (this as any).__menuCleanup === 'function') {
        try { (this as any).__menuCleanup(); } catch (e) {}
        (this as any).__menuCleanup = null;
      }
      // remove any attached portal element
      const portalEl = (this as any)._portalEl as HTMLElement | undefined | null;
      if (portalEl && portalEl.parentElement) {
        try { portalEl.parentElement.removeChild(portalEl); } catch (e) {}
      }
    } catch (e) {
      // swallow errors to avoid throwing during DOM teardown
    }
  }

  attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null) {
    // default behavior: re-render on attribute changes
    if (oldValue === newValue) return;
    if (!this.isConnected) return;
    this._scheduleRender();
  }

  protected setContent(html: string) {
    this.root.innerHTML = html;
  }

  protected requestRender(): void {
    this._scheduleRender();
  }

  private _scheduleRender(): void {
    if (this._renderScheduled) return;
    this._renderScheduled = true;
    queueMicrotask(() => {
      this._renderScheduled = false;
      this._requestRender();
    });
  }

  private _requestRender(): void {
    if (this._isRendering) {
      this._renderRequested = true;
      return;
    }
    this._isRendering = true;
    try {
      this.render();
    } finally {
      this._isRendering = false;
      if (!this._hasRendered) {
        this._hasRendered = true;
        if (this._visibilityGuardApplied) {
          this.style.removeProperty('visibility');
          this._visibilityGuardApplied = false;
        }
      }
    }
    if (this._renderRequested) {
      this._renderRequested = false;
      this._scheduleRender();
    }
  }

  protected abstract render(): void;
}
