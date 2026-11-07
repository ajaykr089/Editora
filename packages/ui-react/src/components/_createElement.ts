import { createElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { IS_SERVER, takeServerAttributes } from './_serverAttributes';

// Kept apart from _internals.ts on purpose: this file is reachable from `@editora/ui-react/server`,
// which React Server Components load, so it must not import a hook or anything that needs a DOM.

/**
 * Builds a `<ui-*>` host element. Every wrapper must create its host through this instead of
 * `React.createElement('ui-…')`: React 16-18 only map `className` to `class` on built-in elements
 * and write a literal `classname` attribute on custom elements, so a consumer's `className` would
 * otherwise be silently dropped (React 19 maps it, and `class` works on all of them).
 */
export function createUIElement(
  tag: string,
  props?: (Record<string, unknown> & { className?: unknown; class?: unknown }) | null,
  ...children: ReactNode[]
): ReactElement {
  if (!props || !tag.includes('-')) {
    return createElement(tag, props, ...children);
  }

  const { className, ...rest } = props;
  // On the server, the attributes the wrapper's effects would write (see _serverAttributes.ts).
  const recorded = IS_SERVER ? takeServerAttributes(rest.ref) : null;
  const merged = [rest.class, className, recorded?.class]
    .filter((token): token is string => typeof token === 'string' && token !== '')
    .join(' ');
  const hostProps: Record<string, unknown> = recorded ? { ...rest, ...recorded } : { ...rest };
  if (merged) hostProps.class = merged;
  else delete hostProps.class;
  // The server markup carries those attributes and the client props do not (the effects write
  // them after hydrating), so React would report the difference as a hydration mismatch. This
  // only covers the host's own attributes and text, not its children.
  if (!IS_SERVER && 'ref' in rest && hostProps.suppressHydrationWarning === undefined) {
    hostProps.suppressHydrationWarning = true;
  }

  return createElement(tag, hostProps, ...children);
}
