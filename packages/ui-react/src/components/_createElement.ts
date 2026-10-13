import { createElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

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
  if (!props || !('className' in props) || !tag.includes('-')) {
    return createElement(tag, props, ...children);
  }

  const { className, ...rest } = props;
  const merged = [rest.class, className]
    .filter((token): token is string => typeof token === 'string' && token !== '')
    .join(' ');
  const hostProps = merged ? { ...rest, class: merged } : rest;

  return createElement(tag, hostProps, ...children);
}
