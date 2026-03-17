import React, { useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type LayoutMode = 'dashboard' | 'split' | 'stack';
export type LayoutVariant = 'default' | 'flat' | 'elevated' | 'glass' | 'contrast';
export type LayoutDensity = 'default' | 'compact' | 'comfortable';
export type LayoutMaxWidth = 'sm' | 'md' | 'lg' | 'xl';
export type LayoutSidebarSide = 'start' | 'end';

export type LayoutProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  mode?: LayoutMode;
  variant?: LayoutVariant;
  density?: LayoutDensity;
  maxWidth?: LayoutMaxWidth;
  sidebarSide?: LayoutSidebarSide;
  collapsed?: boolean;
  headless?: boolean;
  sidebarWidth?: string;
  asideWidth?: string;
  onLayoutChange?: () => void;
};

const Layout = React.forwardRef<HTMLElement, LayoutProps>(function Layout(
  {
    children,
    mode,
    variant,
    density,
    maxWidth,
    sidebarSide,
    collapsed,
    headless,
    sidebarWidth,
    asideWidth,
    onLayoutChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => onLayoutChange?.();
    el.addEventListener('layoutchange', handler as EventListener);
    return () => el.removeEventListener('layoutchange', handler as EventListener);
  }, [onLayoutChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (mode && mode !== 'dashboard') el.setAttribute('mode', mode);
    else el.removeAttribute('mode');

    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');

    if (maxWidth) el.setAttribute('max-width', maxWidth);
    else el.removeAttribute('max-width');

    if (sidebarSide && sidebarSide !== 'start') el.setAttribute('sidebar-side', sidebarSide);
    else el.removeAttribute('sidebar-side');

    if (collapsed) el.setAttribute('collapsed', '');
    else el.removeAttribute('collapsed');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (sidebarWidth) el.setAttribute('sidebar-width', sidebarWidth);
    else el.removeAttribute('sidebar-width');

    if (asideWidth) el.setAttribute('aside-width', asideWidth);
    else el.removeAttribute('aside-width');
  }, [mode, variant, density, maxWidth, sidebarSide, collapsed, headless, sidebarWidth, asideWidth]);

  return React.createElement('ui-layout', { ref, ...rest }, children);
});

Layout.displayName = 'Layout';

const LayoutHeader = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  function LayoutHeader({ ...props }, ref) {
    return React.createElement('div', { ref, slot: 'header', ...props });
  }
);

LayoutHeader.displayName = 'Layout.Header';

const LayoutSidebar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  function LayoutSidebar({ ...props }, ref) {
    return React.createElement('div', { ref, slot: 'sidebar', ...props });
  }
);

LayoutSidebar.displayName = 'Layout.Sidebar';

const LayoutContent = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  function LayoutContent({ ...props }, ref) {
    return React.createElement('div', { ref, slot: 'content', ...props });
  }
);

LayoutContent.displayName = 'Layout.Content';

const LayoutAside = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  function LayoutAside({ ...props }, ref) {
    return React.createElement('div', { ref, slot: 'aside', ...props });
  }
);

LayoutAside.displayName = 'Layout.Aside';

const LayoutFooter = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  function LayoutFooter({ ...props }, ref) {
    return React.createElement('div', { ref, slot: 'footer', ...props });
  }
);

LayoutFooter.displayName = 'Layout.Footer';

// Create composed component with sub-components as properties
const ComposedLayout = Object.assign(Layout, {
  Header: LayoutHeader,
  Sidebar: LayoutSidebar,
  Content: LayoutContent,
  Aside: LayoutAside,
  Footer: LayoutFooter,
});

ComposedLayout.displayName = 'Layout';

export { ComposedLayout as Layout, LayoutHeader, LayoutSidebar, LayoutContent, LayoutAside, LayoutFooter };
export default ComposedLayout;
