class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class MediaQueryListStub implements MediaQueryList {
  readonly media: string;
  matches = false;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null = null;

  constructor(query: string) {
    this.media = query;
  }

  addEventListener() {}
  removeEventListener() {}
  addListener() {}
  removeListener() {}
  dispatchEvent() {
    return false;
  }
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => new MediaQueryListStub(query),
  });
}
