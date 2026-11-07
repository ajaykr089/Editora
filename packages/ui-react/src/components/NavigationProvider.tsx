import React, { createContext, useContext } from 'react';

export type NavigateDetail = { href: string } & Record<string, unknown>;

export type NavigationContextValue = {
  /** Called for every link a component activates (Sidebar, Breadcrumb, route Tabs, Pagination links). */
  navigate: (href: string, detail: NavigateDetail) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export type NavigationProviderProps = NavigationContextValue & { children?: React.ReactNode };

/**
 * Routes every Editora link through your router, once for the whole app:
 *
 *   <NavigationProvider navigate={(href) => router.push(href)}>…</NavigationProvider>
 *
 * Works with React Router (`useNavigate()`), TanStack Router, Next.js (`useRouter().push`) or
 * anything else that takes a URL. Clicks that open a new tab (Cmd/Ctrl/middle click, target="_blank")
 * stay with the browser. A component's own `onNavigate` runs first and can handle a link itself.
 */
export function NavigationProvider({ navigate, children }: NavigationProviderProps) {
  const value = React.useMemo(() => ({ navigate }), [navigate]);
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigationContext(): NavigationContextValue | null {
  return useContext(NavigationContext);
}

export default NavigationProvider;
