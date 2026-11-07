// Server-rendered attributes for wrapper hosts. Hook-free and DOM-free: _createElement.ts imports
// it, and that file is reachable from `@editora/ui-react/server`.
//
// Wrappers write their attributes (`label`, `selected`, `size`, ...) to the host in a layout effect,
// and effects never run on the server, so server HTML had bare ui-input tags: the preload styles
// keyed on `[label]` could not reserve the right height and the element upgraded from defaults. On
// the server, useElementAttributes queues its sync function against the host ref instead, and
// createUIElement runs it against a recorder and writes what it recorded into the markup.

type Sync = (element: never) => void;

export const IS_SERVER = typeof window === 'undefined';

const pending = new WeakMap<object, Sync[]>();

/** Server only: remembers an attribute sync for the host that `ref` will be attached to. */
export function queueServerAttributes(ref: object, sync: Sync): void {
  const list = pending.get(ref);
  if (list) list.push(sync);
  else pending.set(ref, [sync]);
}

/**
 * A stand-in host with the attribute API (what the sync helpers use). Other members read as
 * undefined and writes to them are dropped, so a sync that does more than set attributes stops at
 * that point (the attributes it set before are kept) instead of failing the render.
 */
function createRecorder(attributes: Map<string, string>): object {
  const api: Record<string, unknown> = {
    getAttribute: (name: string) => attributes.get(String(name).toLowerCase()) ?? null,
    hasAttribute: (name: string) => attributes.has(String(name).toLowerCase()),
    setAttribute: (name: string, value: unknown) => { attributes.set(String(name).toLowerCase(), String(value)); },
    removeAttribute: (name: string) => { attributes.delete(String(name).toLowerCase()); },
    toggleAttribute: (name: string, force?: boolean) => {
      const key = String(name).toLowerCase();
      const on = force ?? !attributes.has(key);
      if (on) attributes.set(key, attributes.get(key) ?? '');
      else attributes.delete(key);
      return on;
    },
  };
  return new Proxy(api, {
    get: (target, key) => (typeof key === 'string' && key in target ? target[key] : undefined),
    set: () => true,
  });
}

/**
 * Server only: runs the syncs queued for `ref` and returns the attributes they set (null when
 * nothing was queued). Each sync runs at most once.
 */
export function takeServerAttributes(ref: unknown): Record<string, string> | null {
  if (!ref || typeof ref !== 'object') return null;
  const list = pending.get(ref);
  if (!list) return null;
  pending.delete(ref);
  const attributes = new Map<string, string>();
  const recorder = createRecorder(attributes);
  for (const sync of list) {
    try {
      (sync as (element: object) => void)(recorder);
    } catch {
      // A sync that needs a real element: keep what it recorded before that.
    }
  }
  return Object.fromEntries(attributes);
}
