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

/**
 * Wraps a host-event listener so it only runs for events the element itself dispatched.
 *
 * Container elements (tabs, dialogs, drawers, menus, sidebars...) hold arbitrary children, and
 * `change` / `open` / `close` / `select` from those children bubble up to the host: a checkbox in a
 * tab panel fired the Tabs `onChange` with `undefined` and closed the panel, a dropdown closing
 * inside a dialog fired the Dialog `onClose`. Events dispatched from inside the host's shadow root
 * are retargeted to the host, so `target === currentTarget` keeps exactly the element's own events.
 */
export function hostOnly<E extends Event = Event>(listener: (event: E) => void): (event: Event) => void {
  return (event: Event) => {
    if (event.target !== event.currentTarget) return;
    listener(event as E);
  };
}

export function useElementEventListeners<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  listeners: ElementEventListener[],
  dependencies: React.DependencyList,
  options: { hostOnly?: boolean } = {}
): void {
  // A layout effect, so the listeners are in place before the attribute-sync effect renders the
  // element (an element may announce its initial state with an event during that render).
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const activeListeners = listeners
      .filter((entry): entry is { type: string; listener: EventListener } => typeof entry.listener === 'function')
      .map((entry) => (options.hostOnly ? { type: entry.type, listener: hostOnly(entry.listener) } : entry));

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

/**
 * Renders the element now if attribute changes left a render queued for the next microtask. Call it
 * at the end of a wrapper's attribute-sync layout effect: the element then shows the props on the
 * same commit instead of its defaults for one tick.
 */
export function flushElementRender(el: Element | null | undefined): void {
  const target = el as (Element & { flushPendingRender?: () => void }) | null | undefined;
  if (target && typeof target.flushPendingRender === 'function') target.flushPendingRender();
}

export type ControlledAttribute = {
  /** The host attribute the prop is written to. */
  attribute: string;
  /**
   * The prop, already in attribute form: a string to write, `true`/`false` for a presence
   * attribute, `null` for "attribute absent", or `undefined` when the prop was not passed
   * (uncontrolled: the element keeps whatever the user did).
   */
  value: string | boolean | null | undefined;
  /** Events the element dispatches when it changes that attribute itself. */
  events: string[];
};

/**
 * Makes a prop win over the element's own state, the way React treats `value` on an `<input>`.
 *
 * The elements update their own attributes when the user acts (a tab click sets `selected`, a pick
 * sets `value`, Escape removes `open`) and then dispatch an event. If the parent accepts the change
 * it re-renders with the new prop and nothing else happens. If it does not (no handler, or it
 * rejected the value), the attribute used to stay at the element's value, so the UI drifted from
 * React state. After each such event, once React has handled it, this writes the prop back.
 */
/**
 * The controlled value only when the parent listens for changes. A prop with no handler is the
 * initial value (the docs and stories use `<Tabs selected={1}>`, `<Switch checked>` that way), so
 * holding the element to it would freeze the control.
 */
export function whenHandled<T>(handlers: unknown[], value: T): T | undefined {
  return handlers.some((handler) => typeof handler === 'function') ? value : undefined;
}

export function useControlledAttribute<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  controlled: ControlledAttribute
): void {
  const latest = useRef(controlled);
  useIsomorphicLayoutEffect(() => {
    latest.current = controlled;
  });

  const eventKey = controlled.events.join(' ');
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let reconciling = false;

    const reconcile = () => {
      timer = undefined;
      const { attribute, value } = latest.current;
      if (value === undefined || !el.isConnected) return;
      reconciling = true;
      try {
        if (typeof value === 'boolean') {
          if (el.hasAttribute(attribute) !== value) el.toggleAttribute(attribute, value);
        } else if (value === null) {
          if (el.hasAttribute(attribute)) el.removeAttribute(attribute);
        } else if (el.getAttribute(attribute) !== value) {
          el.setAttribute(attribute, value);
        }
        flushElementRender(el);
      } finally {
        reconciling = false;
      }
    };

    // A macrotask: by then React has run the onChange handlers and re-rendered with the new prop
    // if the parent accepted it, so only a rejected change is undone.
    const onSelfChange = hostOnly(() => {
      if (reconciling || timer !== undefined) return;
      timer = setTimeout(reconcile, 0);
    });

    const types = eventKey.split(' ').filter(Boolean);
    types.forEach((type) => el.addEventListener(type, onSelfChange));
    return () => {
      types.forEach((type) => el.removeEventListener(type, onSelfChange));
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [ref, eventKey]);
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
    flushElementRender(el);
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
