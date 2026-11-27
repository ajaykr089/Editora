import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Heading, Prose, Text } from '@editora/ui-react';

const meta: Meta<typeof Heading> = {
  title: 'UI/Typography',
  component: Heading,
};
export default meta;
type Story = StoryObj<typeof Heading>;

export const Headings: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 12 }}>
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4} tone="muted">Muted level 4</Heading>
      <Heading level={2} size="sm">Level 2, small size</Heading>
    </Box>
  ),
};

export const TextVariants: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 10, maxWidth: 560 }}>
      <Text variant="overline">Overline</Text>
      <Text variant="lead">A lead paragraph introduces the page in a slightly larger, softer voice.</Text>
      <Text>Body text for most content, with <Text inline variant="code">inline code</Text> inside.</Text>
      <Text variant="large">Large text</Text>
      <Text variant="small">Small text</Text>
      <Text variant="muted">Muted text for secondary details.</Text>
      <Text variant="caption">Caption text</Text>
      <Text lines={2} style={{ maxWidth: 280 }}>
        A long paragraph clamped to two lines, so cards keep the same height whatever their description says.
      </Text>
    </Box>
  ),
};

export const RichHtml: Story = {
  render: () => (
    <Prose measure>
      <h2>Release notes</h2>
      <p>
        Prose styles HTML you do not write element by element: <a href="#notes">links</a>, <strong>bold</strong>,{' '}
        <code>code</code> and <kbd>Ctrl</kbd>.
      </p>
      <ul>
        <li>First item</li>
        <li>
          Second item
          <ul><li>Nested item</li></ul>
        </li>
      </ul>
      <blockquote>A quotation, set apart from the text.</blockquote>
      <pre><code>{'const answer = 42;'}</code></pre>
      <table>
        <thead><tr><th>Plan</th><th>Price</th></tr></thead>
        <tbody><tr><td>Pro</td><td>$12</td></tr></tbody>
      </table>
    </Prose>
  ),
};
