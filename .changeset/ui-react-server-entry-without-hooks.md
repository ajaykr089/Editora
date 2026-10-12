---
"@editora/ui-react": patch
---

Fix `@editora/ui-react/server` failing in React Server Components. The entry is meant for server components, but its components shared a chunk with the hooks of the client wrappers (`useRef`, `useEffect`, ...) and imported `@editora/ui-core`, which needs `HTMLElement` when it is loaded, so Next.js answered every page that used it with HTTP 500 ("You're importing a component that needs `useRef`"). The entry now loads only React: the markup comes from a hook-free `createUIElement`, and the elements are no longer registered by the server graph. Define them in the browser by importing `@editora/ui-react/client` (or `@editora/ui-core`) from a client component. A deep import such as `@editora/ui-react/Box` still registers its element and is now a client module.
