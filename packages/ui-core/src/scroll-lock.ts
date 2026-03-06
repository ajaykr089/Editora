type ScrollLockState = {
  count: number;
  bodyOverflow: string;
  htmlOverflow: string;
  bodyPaddingRight: string;
};

const GLOBAL_SCROLL_LOCK_KEY = '__editora_ui_scroll_lock_state__';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getState(): ScrollLockState {
  const globalObj = globalThis as Record<string, unknown>;
  const existing = globalObj[GLOBAL_SCROLL_LOCK_KEY] as ScrollLockState | undefined;
  if (existing) return existing;

  const created: ScrollLockState = {
    count: 0,
    bodyOverflow: '',
    htmlOverflow: '',
    bodyPaddingRight: ''
  };
  globalObj[GLOBAL_SCROLL_LOCK_KEY] = created;
  return created;
}

export function acquireBodyScrollLock(): () => void {
  if (!isBrowser()) return () => {};

  const state = getState();
  state.count += 1;

  if (state.count === 1) {
    const body = document.body;
    const html = document.documentElement;

    state.bodyOverflow = body.style.overflow;
    state.htmlOverflow = html.style.overflow;
    state.bodyPaddingRight = body.style.paddingRight;

    const scrollBarWidth = Math.max(0, window.innerWidth - html.clientWidth);
    if (scrollBarWidth > 0) {
      const currentPadding = parseFloat(window.getComputedStyle(body).paddingRight || '0') || 0;
      body.style.paddingRight = `${currentPadding + scrollBarWidth}px`;
    }

    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    releaseBodyScrollLock();
  };
}

export function releaseBodyScrollLock(): void {
  if (!isBrowser()) return;

  const state = getState();
  if (state.count <= 0) return;
  state.count -= 1;
  if (state.count > 0) return;

  const body = document.body;
  const html = document.documentElement;
  body.style.overflow = state.bodyOverflow;
  html.style.overflow = state.htmlOverflow;
  body.style.paddingRight = state.bodyPaddingRight;
}

export function getBodyScrollLockCount(): number {
  return getState().count;
}

