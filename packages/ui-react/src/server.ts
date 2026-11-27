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
export { EditoraPreloadStyle } from './components/server/EditoraPreloadStyle';
export type { EditoraPreloadStyleProps } from './components/server/EditoraPreloadStyle';
export { AccessibleIcon } from './components/server/AccessibleIcon';
export type { AccessibleIconProps } from './components/server/AccessibleIcon';
export { Announcer } from './components/server/Announcer';
export type { AnnouncerProps } from './components/server/Announcer';
export { AttachmentGroup } from './components/server/AttachmentGroup';
export type { AttachmentGroupProps } from './components/server/AttachmentGroup';
export { Bubble } from './components/server/Bubble';
export type { BubbleProps } from './components/server/Bubble';
export { BubbleGroup } from './components/server/BubbleGroup';
export type { BubbleGroupProps } from './components/server/BubbleGroup';
export { ButtonGroup } from './components/server/ButtonGroup';
export type { ButtonGroupProps } from './components/server/ButtonGroup';
export { Heading } from './components/server/Heading';
export type { HeadingProps } from './components/server/Heading';
export { InputGroup } from './components/server/InputGroup';
export type { InputGroupProps } from './components/server/InputGroup';
export { Item } from './components/server/Item';
export type { ItemProps } from './components/server/Item';
export { ItemGroup } from './components/server/ItemGroup';
export type { ItemGroupProps } from './components/server/ItemGroup';
export { Marker } from './components/server/Marker';
export type { MarkerProps } from './components/server/Marker';
export { Message } from './components/server/Message';
export type { MessageProps } from './components/server/Message';
export { NativeSelect } from './components/server/NativeSelect';
export type { NativeSelectProps } from './components/server/NativeSelect';
export { Prose } from './components/server/Prose';
export type { ProseProps } from './components/server/Prose';
export { Question } from './components/server/Question';
export type { QuestionProps } from './components/server/Question';
export { Spinner } from './components/server/Spinner';
export type { SpinnerProps } from './components/server/Spinner';
export { Text } from './components/server/Text';
export type { TextProps } from './components/server/Text';
export { Trace } from './components/server/Trace';
export type { TraceProps } from './components/server/Trace';
