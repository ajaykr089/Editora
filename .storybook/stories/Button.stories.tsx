import React from 'react';
import { Button, ThemeProvider , Box, Flex} from '@editora/ui-react';

export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    variant: { control: { type: 'radio', options: ['primary','secondary','ghost','danger'] } },
    size: { control: { type: 'radio', options: ['sm','md','lg'] } },
    theme: { control: { type: 'radio', options: ['default','dark','brand'] } }
  }
};

const Template = (args: any) => <Button disabled={args.disabled} variant={args.variant} size={args.size} icon={args.icon} loading={args.loading} block={args.block} headless={args.headless} theme={args.theme}>{args.label}</Button>;

export const Default = Template.bind({});
Default.args = { label: 'Click me', disabled: false, variant: 'primary', size: 'md', icon: undefined, loading: false, block: false, headless: false, theme: 'default' };

export const Variants = () => (
  <Flex style={{ display: 'flex', gap: 12 }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
  </Flex>
);

export const Sizes = () => (
  <Flex style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </Flex>
);

export const WithIcon = () => (
  <Flex style={{ display: 'flex', gap: 12 }}>
    <Button icon="check">With icon</Button>
    <Button variant="secondary" icon="x">With icon</Button>
  </Flex>
);

export const Loading = () => (
  <Flex style={{ display: 'flex', gap: 12 }}>
    <Button loading>Loading</Button>
    <Button loading variant="secondary">Loading</Button>
  </Flex>
);

export const Headless = () => (
  <div>
    <Button headless style={{ color: 'rebeccapurple', padding: '4px 8px', border: '1px dashed #ccc' }}>Headless</Button>
  </div>
);

export const Block = () => (
  <Box style={{ width: 320 }}>
    <Button block>Full width button</Button>
  </Box>
);

export const Animations = () => (
  <Flex style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box style={{ fontSize: 12, color: '#666' }}>Default (no animation — opt-in)</Box>
      <Button>Default</Button>
    </Flex>

    <Button animation="scale">Scale hover</Button>
    <Button animation="pulse" variant="secondary">Pulse</Button>
    <Button animation="none" variant="ghost">No animation</Button>
  </Flex>
);

export const Themes = () => (
  <Flex style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button>Default</Button>
    <Button theme="dark">Dark theme</Button>
    <Button theme="brand">Brand theme</Button>
    <Button style={{ '--ui-primary': '#ec4899' } as React.CSSProperties}>Custom CSS var</Button>
  </Flex>
);

export const ThemedByTokens = () => (
  <Flex style={{ display: 'flex', gap: 12 }}>
    <ThemeProvider tokens={{ colors: { primary: '#7c3aed', background: '#0f172a', text: '#f8fafc' }, radius: '10px' }}>
      <Box style={{ padding: 12, background: 'var(--ui-color-background)' }}>
        <Button>Primary (token)</Button>
        <Button variant="secondary" style={{ marginLeft: 8 }}>Secondary</Button>
      </Box>
    </ThemeProvider>
  </Flex>
);

export const CustomSize = () => (
  <Flex style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box style={{ fontSize: 12, color: '#666' }}>Custom min-height using `--ui-min-height`</Box>
      <Button style={{ '--ui-min-height': '56px', '--ui-padding': '14px 24px' } as React.CSSProperties}>Tall button</Button>
    </Flex>

    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box style={{ fontSize: 12, color: '#666' }}>Fixed width via `--ui-width`</Box>
      <Button style={{ '--ui-width': '220px' } as React.CSSProperties}>Fixed width</Button>
    </Flex>

    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Box style={{ fontSize: 12, color: '#666' }}>Remove border-radius & secondary border</Box>
      <Button style={{ '--ui-radius': '0', '--ui-border': 'none' } as React.CSSProperties} variant="secondary">Flat secondary</Button>
      <Button headless style={{ padding: '8px 12px', border: '1px dashed #ccc' }}>Headless (custom look)</Button>
    </Flex>
  </Flex>
);

export const Disabled = () => (
  <Flex style={{ display: 'flex', gap: 12 }}>
    <Button disabled>Disabled</Button>
    <Button disabled loading>Disabled + loading</Button>
    <Button disabled={false} loading>Not Disabled + loading</Button>
  </Flex>
);
