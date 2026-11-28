import * as React from 'react';

/**
 * `asChild` support: a part renders its single child element instead of its own element, with the
 * part's props merged in. Class names are joined, styles merged (the child's win), event handlers
 * both run (the child's first; the part's is skipped if the child called `preventDefault()`), refs
 * both receive the element, and other props from the child override the part's.
 */

type AnyProps = Record<string, any>;

export function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T>).current = node;
    }
  };
}

const MAJOR = Number.parseInt(React.version, 10);

/** The ref of a child element: a prop from React 19, a field before. */
function childRef(child: React.ReactElement): React.Ref<unknown> | undefined {
  return MAJOR >= 19 ? (child.props as AnyProps).ref : (child as any).ref;
}

export function mergeSlotProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps };
  for (const name of Object.keys(childProps)) {
    const slotValue = slotProps[name];
    const childValue = childProps[name];
    if (/^on[A-Z]/.test(name) && typeof slotValue === 'function' && typeof childValue === 'function') {
      merged[name] = (...args: unknown[]) => {
        childValue(...args);
        const event = args[0] as { defaultPrevented?: boolean } | undefined;
        if (!event?.defaultPrevented) slotValue(...args);
      };
    } else if (name === 'style' && slotValue && childValue) {
      merged.style = { ...slotValue, ...childValue };
    } else if (name === 'className' && slotValue && childValue) {
      merged.className = `${slotValue} ${childValue}`;
    } else if (childValue !== undefined) {
      merged[name] = childValue;
    }
  }
  return merged;
}

export type SlotCloneProps = React.HTMLAttributes<HTMLElement> & AnyProps & { children?: React.ReactNode };

/** Renders the only child with these props merged in. */
export const SlotClone = React.forwardRef<HTMLElement, SlotCloneProps>(function SlotClone({ children, ...slotProps }, forwardedRef) {
  const child = React.Children.only(children);
  if (!React.isValidElement(child)) {
    throw new Error('asChild expects a single React element as its child.');
  }
  const props = mergeSlotProps(slotProps, child.props as AnyProps);
  props.ref = forwardedRef ? composeRefs(forwardedRef, childRef(child)) : childRef(child);
  return React.cloneElement(child, props);
});
