import React from 'react';
import { Button } from '@editora/ui-react';

export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' }
  }
};

const Template = (args: any) => <Button disabled={args.disabled} variant={args.variant} size={args.size} icon={args.icon} loading={args.loading} block={args.block} headless={args.headless}>{args.label}</Button>;

export const Default = Template.bind({});
Default.args = { label: 'Click me', disabled: false, variant: 'primary', size: 'md', icon: undefined, loading: false, block: false, headless: false };

export const Variants = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const WithIcon = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <Button icon="check">With icon</Button>
    <Button variant="secondary" icon="x">With icon</Button>
  </div>
);

export const Loading = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <Button loading>Loading</Button>
    <Button loading variant="secondary">Loading</Button>
  </div>
);

export const Headless = () => (
  <div>
    <Button headless style={{ color: 'rebeccapurple', padding: '4px 8px', border: '1px dashed #ccc' }}>Headless</Button>
  </div>
);

export const Block = () => (
  <div style={{ width: 320 }}>
    <Button block>Full width button</Button>
  </div>
);

export const Animations = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 12, color: '#666' }}>Default (no animation — opt-in)</div>
      <Button>Default</Button>
    </div>

    <Button animation="scale">Scale hover</Button>
    <Button animation="pulse" variant="secondary">Pulse</Button>
    <Button animation="none" variant="ghost">No animation</Button>
  </div>
);

export const Themes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button>Default</Button>
    <Button theme="dark">Dark theme</Button>
    <Button theme="brand">Brand theme</Button>
    <Button style={{ '--ui-primary': '#ec4899' } as React.CSSProperties}>Custom CSS var</Button>
  </div>
);

export const CustomSize = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 12, color: '#666' }}>Custom min-height using `--ui-min-height`</div>
      <Button style={{ '--ui-min-height': '56px', '--ui-padding': '14px 24px' } as React.CSSProperties}>Tall button</Button>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 12, color: '#666' }}>Fixed width via `--ui-width`</div>
      <Button style={{ '--ui-width': '220px' } as React.CSSProperties}>Fixed width</Button>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 12, color: '#666' }}>Remove border-radius & secondary border</div>
      <Button style={{ '--ui-radius': '0', '--ui-border': 'none' } as React.CSSProperties} variant="secondary">Flat secondary</Button>
      <Button headless style={{ padding: '8px 12px', border: '1px dashed #ccc' }}>Headless (custom look)</Button>
    </div>
  </div>
);

export const Disabled = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <Button disabled>Disabled</Button>
    <Button disabled loading>Disabled + loading</Button>
  </div>
);


