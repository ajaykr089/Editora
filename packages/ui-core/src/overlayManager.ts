import { acquireBodyScrollLock, releaseBodyScrollLock } from './scroll-lock';

type OverlayItem = HTMLElement;

export const OverlayManager = {
  baseZ: 1000,
  stack: [] as OverlayItem[],
  _lockCount: 0,

  register(el: OverlayItem) {
    if (!el) return;
    // if already registered, bring to front
    const idx = this.stack.indexOf(el);
    if (idx !== -1) {
      this.stack.splice(idx, 1);
    }
    this.stack.push(el);
    this.reassignZ();
  },

  unregister(el: OverlayItem) {
    const idx = this.stack.indexOf(el);
    if (idx !== -1) {
      this.stack.splice(idx, 1);
      this.reassignZ();
    }
  },

  bringToFront(el: OverlayItem) {
    this.register(el);
  },

  top() {
    return this.stack.length ? this.stack[this.stack.length - 1] : null;
  },

  /*
    Lock-count API
    - acquireLock(): increments a lock counter and applies scroll-lock when transitioning 0->1
    - releaseLock(): decrements (never below 0) and removes scroll-lock when reaching 0
    - lockCount(): returns current count
    - lockScroll()/unlockScroll() remain for backwards compat and delegate to the lock-count methods
  */
  acquireLock() {
    this._lockCount = Math.max(0, (this._lockCount || 0) + 1);
    acquireBodyScrollLock();
  },

  releaseLock() {
    this._lockCount = Math.max(0, (this._lockCount || 0) - 1);
    releaseBodyScrollLock();
  },

  lockCount() {
    return this._lockCount || 0;
  },

  // backwards-compatible aliases
  lockScroll() { this.acquireLock(); },
  unlockScroll() { this.releaseLock(); },

  reassignZ() {
    // assign incremental z-indexes starting at baseZ
    for (let i = 0; i < this.stack.length; i++) {
      const el = this.stack[i];
      try { (el as HTMLElement).style.zIndex = String(this.baseZ + i + 1); } catch (e) { /* ignore */ }
    }
  }
};

export default OverlayManager;
