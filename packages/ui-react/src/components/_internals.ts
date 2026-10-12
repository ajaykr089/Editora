import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

// Re-exported so existing wrappers keep one import site; defined in its own hook-free module so the
// server entry can use it without loading this file (see _createElement.ts).
export { createUIElement } from './_createElement';

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type ElementEventListener = {
  type: string;
  listener?: EventListener | null;
};

export function useForwardedHostRef<T extends HTMLElement>(
  forwardedRef: React.ForwardedRef<T>
): React.MutableRefObject<T | null> {
  const ref = useRef<T | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as T);

  return ref;
}

export function useElementEventListeners<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  listeners: ElementEventListener[],
  dependencies: React.DependencyList
): void {
  useEffect(() => {
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

export function syncNumberAttribute(el: HTMLElement, name: string, next: number | undefined): void {
  syncStringAttribute(el, name, typeof next === 'number' ? String(next) : null);
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

/**
 * Warns, once per tag, when a wrapper renders an element nothing has defined. Every wrapper imports
 * the `@editora/ui-core/<name>` entries of the elements it renders, so this only fires for a wrapper
 * that forgot one (scripts/check-custom-element-registrations.js catches that in CI) or when the
 * consumer's bundler dropped a side-effect import.
 */
export function warnIfElementNotRegistered(tagName: string, componentName: string) {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') return;
  if (customElements.get(tagName)) return;

  const key = `__editora_warned_${tagName}`;
  const globalObj = window as unknown as Record<string, boolean>;
  if (globalObj[key]) return;
  globalObj[key] = true;

  // eslint-disable-next-line no-console
  console.warn(
    `[ui-react/${componentName}] ${tagName} is not registered. ` +
      `Import "@editora/ui-core/${tagName.replace(/^ui-/, '')}" (or "@editora/ui-core") to register it.`
  );
}

export function serializeTranslations(
  translations: string | Record<string, string> | undefined
): string | null {
  if (!translations) return null;
  if (typeof translations === 'string') return translations;
  try {
    return JSON.stringify(translations);
  } catch {
    return null;
  }
}
