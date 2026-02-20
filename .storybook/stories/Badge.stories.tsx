import React from 'react';
import { Badge, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Badge',
  component: Badge,
  argTypes: {
    text: { control: 'text' },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger', 'purple'] } },
    variant: { control: { type: 'radio', options: ['solid', 'soft', 'outline', 'ghost'] } },
    size: { control: { type: 'radio', options: ['1', '2', '3', 'sm', 'md', 'lg'] } },
    pill: { control: 'boolean' },
    dot: { control: 'boolean' },
    removable: { control: 'boolean' },
    autoRemove: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
};

const Template = (args: any) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: 'Draft',
  tone: 'info',
  variant: 'soft'
};

export const TonePalette = () => (
  <Flex style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
    <Badge tone="neutral" text="Neutral" />
    <Badge tone="info" text="Info" />
    <Badge tone="success" text="Success" />
    <Badge tone="warning" text="Warning" />
    <Badge tone="danger" text="Danger" />
    <Badge tone="purple" text="Purple" />
  </Flex>
);

export const Variants = () => (
  <Flex style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
    <Badge variant="solid" tone="info" text="Solid" />
    <Badge variant="soft" tone="info" text="Soft" />
    <Badge variant="outline" tone="info" text="Outline" />
    <Badge variant="ghost" tone="info" text="Ghost" />
  </Flex>
);

export const WithDotAndIcon = () => (
  <Flex style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
    <Badge dot tone="success" text="Live" />
    <Badge tone="warning">
      <span slot="icon">⚡</span>
      High Priority
    </Badge>
    <Badge tone="danger" variant="outline">
      <span slot="icon">⛔</span>
      Blocked
    </Badge>
  </Flex>
);

export const Removable = () => {
  const [items, setItems] = React.useState(['Marketing', 'Design', 'Engineering']);
  return (
    <Flex style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {items.map((item) => (
        <Badge key={item} tone="neutral" removable onRemove={() => setItems((prev) => prev.filter((x) => x !== item))}>
          {item}
        </Badge>
      ))}
    </Flex>
  );
};

export const Sizes = () => (
  <Flex style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
    <Badge size="sm" tone="info" text="Small" />
    <Badge size="md" tone="info" text="Default" />
    <Badge size="lg" tone="info" text="Large" />
  </Flex>
);
