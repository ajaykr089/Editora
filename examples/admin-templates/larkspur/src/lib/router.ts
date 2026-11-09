import React from 'react';

// A small hash router. Hash URLs keep the template a static page (no server rewrites) while every
// link stays a real, shareable link. Swap it for React Router or TanStack Router in a real app:
// Editora only needs a `navigate(href)` function (see NavigationProvider in main.tsx).
export type Route = { path: string; parts: string[]; query: URLSearchParams };

export function parse(hash: string): Route {
  const [rawPath, rawQuery = ''] = hash.replace(/^#/, '').split('?');
  const path = rawPath.replace(/\/+$/, '') || '/';
  return { path, parts: path.split('/').filter(Boolean), query: new URLSearchParams(rawQuery) };
}

export function navigate(href: string) {
  const hash = href.startsWith('#') ? href : `#${href}`;
  if (window.location.hash !== hash) window.location.hash = hash;
}

export function useRoute(): Route {
  const [route, setRoute] = React.useState(() => parse(window.location.hash));
  React.useEffect(() => {
    const update = () => {
      setRoute(parse(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return route;
}

/** Sets document.title for the current screen. */
export function useTitle(title: string) {
  React.useEffect(() => {
    document.title = `${title} · Larkspur Admin`;
  }, [title]);
}
