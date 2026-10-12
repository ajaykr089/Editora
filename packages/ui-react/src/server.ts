/// <reference path="./custom-elements.d.ts" />
// Server-safe entrypoint for React Server Components and SSR environments.
// Keep this surface limited to components that do not rely on hooks, effects,
// browser globals, custom-element registration checks, or imperative DOM sync.
//
// Everything here comes from ./components/server, which may import only react and
// ./components/_createElement: no hooks, no '@editora/ui-core' (its modules need HTMLElement
// when they are evaluated), no 'use client'. __tests__/server-entry.graph.test.ts enforces it.
//
// These components only render the <ui-*> markup. The elements are defined in the browser: import
// '@editora/ui-react/client' (or '@editora/ui-core') from a client component, or deep-import the
// component ('@editora/ui-react/Box'), which registers its element and is a client module.

export { Box } from './components/server/Box';
export { Flex } from './components/server/Flex';
export { Grid } from './components/server/Grid';
export { Container } from './components/server/Container';
export { DirectionProvider } from './components/server/DirectionProvider';
export { Anchor } from './components/server/Anchor';
export { AspectRatio } from './components/server/AspectRatio';
export { CodeBlock } from './components/server/CodeBlock';
export { CodeSnippet } from './components/server/CodeSnippet';
export { Field } from './components/server/Field';
export { Icon } from './components/server/Icon';
export { Kbd } from './components/server/Kbd';
export { Label } from './components/server/Label';
export { MetricCard } from './components/server/MetricCard';
export { Section } from './components/server/Section';
export { Separator } from './components/server/Separator';
export { Shortcut } from './components/server/Shortcut';
export { Stat } from './components/server/Stat';
export { VisuallyHidden } from './components/server/VisuallyHidden';
