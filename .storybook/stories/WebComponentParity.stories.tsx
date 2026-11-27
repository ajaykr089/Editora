import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '@editora/ui-core/kbd';
import '@editora/ui-core/code-block';
import '@editora/ui-core/carousel';

// The ui-core elements that have a separate React implementation (Kbd, CodeBlock, Carousel), shown as
// plain custom elements for apps without React.
const meta: Meta = {
  title: 'UI Core/Elements without React',
};
export default meta;
type Story = StoryObj;

const el = (tag: string, props: Record<string, unknown>, ...children: React.ReactNode[]) => React.createElement(tag, props, ...children);

export const KbdElement: Story = {
  render: () => (
    <p style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}>
      Press {el('ui-kbd', {}, 'Esc')} or {el('ui-kbd', { keys: 'Ctrl+Shift+P' })} or {el('ui-kbd', { keys: '["⌘","K"]', separator: '' })}
    </p>
  ),
};

export const CodeBlockElement: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
      {el('ui-code-block', {
        filename: 'app.ts',
        language: 'ts',
        'line-numbers': '',
        highlight: '2',
        code: "import { announce } from '@editora/ui-core';\nannounce('Saved');\n\nexport function save() {\n  return fetch('/api/save', { method: 'POST' });\n}",
      })}
      {el('ui-code-block', { language: 'bash', code: 'npm install @editora/ui-core' })}
    </div>
  ),
};

const slide = (label: string, color: string) => (
  <div key={label} style={{ height: 180, display: 'grid', placeItems: 'center', background: color, color: '#fff', fontSize: 28 }}>
    {label}
  </div>
);

export const CarouselElement: Story = {
  render: () => (
    <div style={{ maxWidth: 640, display: 'grid', gap: 20 }}>
      {el('ui-carousel', { label: 'Featured', loop: '' }, slide('One', '#4338ca'), slide('Two', '#0e7490'), slide('Three', '#15803d'))}
      {el('ui-carousel', { label: 'Autoplay', autoplay: '', interval: '4000', indicators: 'pill', transition: 'fade' }, slide('A', '#9f1239'), slide('B', '#854d0e'))}
    </div>
  ),
};
