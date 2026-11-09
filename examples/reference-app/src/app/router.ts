import React from 'react';

// A tiny hash router: #/ is the marketing site, #/app/... the product. Hash URLs keep the app a
// static page (no server rewrites) while links stay real, shareable links.
export type Route =
  | { name: 'site' }
  | { name: 'dashboard' }
  | { name: 'expenses' }
  | { name: 'expense'; id: string }
  | { name: 'new-expense' }
  | { name: 'not-found'; path: string };

export function parse(hash: string): Route {
  const path = hash.replace(/^#/, '').split('?')[0] || '/';
  if (path === '/' || path === '') return { name: 'site' };
  if (path === '/app' || path === '/app/') return { name: 'dashboard' };
  if (path === '/app/expenses') return { name: 'expenses' };
  if (path === '/app/expenses/new') return { name: 'new-expense' };
  const expense = /^\/app\/expenses\/([\w-]+)$/.exec(path);
  if (expense) return { name: 'expense', id: expense[1] };
  return { name: 'not-found', path };
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
