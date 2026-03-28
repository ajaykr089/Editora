class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class PointerEventStub extends MouseEvent {}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

if (typeof globalThis.PointerEvent === 'undefined') {
  globalThis.PointerEvent = PointerEventStub as unknown as typeof PointerEvent;
}
