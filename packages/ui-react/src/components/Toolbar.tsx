import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

import '@editora/ui-core/toolbar';
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type BaseProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export type ToolbarProps = BaseProps & {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'soft' | 'contrast' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  density?: 'compact' | 'default' | 'comfortable';
  wrap?: boolean;
  loop?: boolean;
  headless?: boolean;
};

export const Toolbar = React.forwardRef<HTMLElement, ToolbarProps>(function Toolbar(
  {
    children,
    orientation,
    variant,
    size,
    density,
    wrap,
    loop,
    headless,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };

    syncAttr('orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncBool('wrap', wrap);
    if (typeof loop === 'boolean') syncBool('loop', loop);
    else syncAttr('loop', null);
    syncBool('headless', headless);
  }, [orientation, variant, size, density, wrap, loop, headless]);

  return React.createElement('ui-toolbar', { ref, ...rest }, children);
});

Toolbar.displayName = 'Toolbar';

export default Toolbar;
