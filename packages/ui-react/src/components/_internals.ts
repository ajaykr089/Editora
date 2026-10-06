import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { ensureUICoreRegistration } from '../core-registration';

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type ElementEventListener = {
  type: string;
  listener?: EventListener | null;
};

/**
 * Builds a `<ui-*>` host element. Every wrapper must create its host through this instead of
 * `React.createElement('ui-…')`: React 16-18 only map `className` to `class` on built-in elements
 * and write a literal `classname` attribute on custom elements, so a consumer's `className` would
 * otherwise be silently dropped (React 19 maps it, and `class` works on all of them).
 */
export function createUIElement(
  tag: string,
  props?: (Record<string, unknown> & { className?: unknown; class?: unknown }) | null,
  ...children: React.ReactNode[]
): React.ReactElement {
  if (!props || !('className' in props) || !tag.includes('-')) {
    return React.createElement(tag, props, ...children);
  }

  const { className, ...rest } = props;
  const merged = [rest.class, className]
    .filter((token): token is string => typeof token === 'string' && token !== '')
    .join(' ');
  const hostProps = merged ? { ...rest, class: merged } : rest;

  return React.createElement(tag, hostProps, ...children);
}

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

export function warnIfElementNotRegistered(tagName: string, componentName: string) {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') return;
  if (customElements.get(tagName)) return;

  const registrationPromise = ensureUICoreRegistration();
  const globalObj = window as unknown as Record<string, boolean | Promise<void>>;

  if (registrationPromise) {
    const pendingKey = `__editora_warn_pending_${tagName}`;
    if (!globalObj[pendingKey]) {
      globalObj[pendingKey] = true;
      void registrationPromise
        .catch(() => undefined)
        .finally(() => {
          delete globalObj[pendingKey];
          if (!customElements.get(tagName)) {
            warnIfElementNotRegisteredNow(tagName, componentName);
          }
        });
    }
    return;
  }

  warnIfElementNotRegisteredNow(tagName, componentName);
}

function warnIfElementNotRegisteredNow(tagName: string, componentName: string) {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') return;
  if (customElements.get(tagName)) return;

  const key = `__editora_warned_${tagName}`;
  const globalObj = window as unknown as Record<string, boolean>;
  if (globalObj[key]) return;
  globalObj[key] = true;

  // Keep warning concise and actionable for wrapper consumers.
  // eslint-disable-next-line no-console
  console.warn(
    `[ui-react/${componentName}] ${tagName} is not registered. ` +
      `Import/register the matching web component before using this wrapper.`
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
