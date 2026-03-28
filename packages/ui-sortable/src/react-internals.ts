import React from 'react';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export type ElementEventListener = {
  type: string;
  listener?: EventListener | null;
};

export function useForwardedHostRef<T extends HTMLElement>(
  forwardedRef: React.ForwardedRef<T>
): React.MutableRefObject<T | null> {
  const ref = React.useRef<T | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as T);

  return ref;
}

export function useElementEventListeners<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  listeners: ElementEventListener[],
  dependencies: React.DependencyList
): void {
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const activeListeners = listeners.filter(
      (entry): entry is { type: string; listener: EventListener } => typeof entry.listener === 'function'
    );

    activeListeners.forEach(({ type, listener }) => {
      el.addEventListener(type, listener);
    });

    return () => {
      activeListeners.forEach(({ type, listener }) => {
        el.removeEventListener(type, listener);
      });
    };
  }, [ref, ...dependencies]);
}

export function useElementAttributes<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  sync: (element: T) => void,
  dependencies: React.DependencyList
): void {
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    sync(el);
  }, [ref, ...dependencies]);
}

export function getCustomEventDetail<T>(event: Event): T | undefined {
  return (event as CustomEvent<T>).detail;
}

export function syncStringAttribute(el: HTMLElement, name: string, next: string | null): void {
  const current = el.getAttribute(name);

  if (next == null || next === '') {
    if (current != null) el.removeAttribute(name);
    return;
  }

  if (current !== next) {
    el.setAttribute(name, next);
  }
}

export function syncBooleanAttribute(el: HTMLElement, name: string, next: boolean | undefined): void {
  if (next) {
    if (!el.hasAttribute(name)) el.setAttribute(name, '');
    return;
  }

  if (el.hasAttribute(name)) {
    el.removeAttribute(name);
  }
}

export function syncJsonAttribute(el: HTMLElement, name: string, next: unknown): void {
  if (next == null) {
    syncStringAttribute(el, name, null);
    return;
  }

  try {
    syncStringAttribute(el, name, JSON.stringify(next));
  } catch {
    syncStringAttribute(el, name, null);
  }
}
