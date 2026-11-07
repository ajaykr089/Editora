import React, { useEffect, useLayoutEffect, useRef } from 'react';

import '@editora/ui-core/layout';
import { createUIElement, hostOnly, flushElementRender, useControlledAttribute, whenHandled } from './_internals';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type LayoutMode = 'dashboard' | 'split' | 'stack';
/** `shell`: the app frame itself (full height, no outer box, unframed panels, drawer sidebar on narrow screens). */
export type LayoutVariant = 'default' | 'flat' | 'elevated' | 'glass' | 'contrast' | 'shell';
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
  /**
   * Narrow screens: `drawer` turns the sidebar into an off-canvas drawer with a backdrop, opened
   * by AppHeader's menu button or `sidebarOpen`; `stack` puts it above the content. Defaults to
   * `drawer` for variant="shell" and `stack` otherwise.
   */
  mobileSidebar?: 'drawer' | 'stack';
  /** Viewport width (px) at and below which the drawer is used. Default 980. */
  drawerBreakpoint?: number;
  /** The drawer is open. With onSidebarOpenChange it is controlled. */
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean, detail: { source: string }) => void;
  /** Accessible name of the drawer. Default "Navigation". */
  sidebarLabel?: string;
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
    mobileSidebar,
    drawerBreakpoint,
    sidebarOpen,
    onSidebarOpenChange,
    sidebarLabel,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = hostOnly(() => onLayoutChange?.());
    el.addEventListener('layoutchange', handler as EventListener);
    return () => el.removeEventListener('layoutchange', handler as EventListener);
  }, [onLayoutChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || !onSidebarOpenChange) return;
    const handler = hostOnly((event: Event) => {
      const detail = (event as CustomEvent<{ open: boolean; source: string }>).detail;
      if (detail) onSidebarOpenChange(detail.open, { source: detail.source });
    });
    el.addEventListener('sidebar-open-change', handler);
    return () => el.removeEventListener('sidebar-open-change', handler);
  }, [onSidebarOpenChange]);

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

    if (mobileSidebar) el.setAttribute('mobile-sidebar', mobileSidebar);
    else el.removeAttribute('mobile-sidebar');

    if (typeof drawerBreakpoint === 'number') el.setAttribute('drawer-breakpoint', String(drawerBreakpoint));
    else el.removeAttribute('drawer-breakpoint');

    if (sidebarLabel) el.setAttribute('sidebar-label', sidebarLabel);
    else el.removeAttribute('sidebar-label');

    if (typeof sidebarOpen === 'boolean') el.toggleAttribute('sidebar-open', sidebarOpen);
    flushElementRender(el);
  }, [mode, variant, density, maxWidth, sidebarSide, collapsed, headless, sidebarWidth, asideWidth, mobileSidebar, drawerBreakpoint, sidebarLabel, sidebarOpen]);

  useControlledAttribute(ref, {
    attribute: 'sidebar-open',
    value: whenHandled([onSidebarOpenChange], typeof sidebarOpen === 'boolean' ? sidebarOpen : undefined),
    events: ['sidebar-open-change']
  });

  return createUIElement('ui-layout', { ref, ...rest }, children);
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
