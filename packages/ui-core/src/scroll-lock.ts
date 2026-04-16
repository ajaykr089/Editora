type ScrollLockState = {
  count: number;
  bodyOverflow: string;
  htmlOverflow: string;
  bodyPaddingRight: string;
  htmlScrollbarGutter: string;
  bodyScrollbarGutter: string;
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
    bodyPaddingRight: '',
    htmlScrollbarGutter: '',
    bodyScrollbarGutter: ''
  };
  globalObj[GLOBAL_SCROLL_LOCK_KEY] = created;
  return created;
}

function supportsStableScrollbarGutter(): boolean {
  return typeof CSS !== 'undefined'
    && typeof CSS.supports === 'function'
    && CSS.supports('scrollbar-gutter: stable');
}

function composeScrollbarCompensation(existingPaddingRight: string): string {
  const trimmed = existingPaddingRight.trim();
  if (!trimmed || trimmed === '0' || trimmed === '0px') {
    return 'calc(100vw - 100%)';
  }
  return `calc(${trimmed} + (100vw - 100%))`;
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
    state.htmlScrollbarGutter = html.style.scrollbarGutter;
    state.bodyScrollbarGutter = body.style.scrollbarGutter;

    if (supportsStableScrollbarGutter()) {
      html.style.scrollbarGutter = 'stable';
      body.style.scrollbarGutter = 'stable';
    } else {
      body.style.paddingRight = composeScrollbarCompensation(state.bodyPaddingRight);
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
  html.style.scrollbarGutter = state.htmlScrollbarGutter;
  body.style.scrollbarGutter = state.bodyScrollbarGutter;
}

export function getBodyScrollLockCount(): number {
  return getState().count;
}
