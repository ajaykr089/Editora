class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

// MouseEvent only exists in a DOM environment; node-import.test.ts runs without one.
if (typeof globalThis.PointerEvent === 'undefined' && typeof MouseEvent !== 'undefined') {
  class PointerEventStub extends MouseEvent {}
  globalThis.PointerEvent = PointerEventStub as unknown as typeof PointerEvent;
}
