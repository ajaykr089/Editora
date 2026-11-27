import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, InputGroup, Kbd, Spinner } from '@editora/ui-react';

const meta: Meta<typeof InputGroup> = {
  title: 'UI/InputGroup',
  component: InputGroup,
  argTypes: { size: { control: 'radio', options: ['sm', 'md', 'lg'] } },
};
export default meta;
type Story = StoryObj<typeof InputGroup>;

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" />
  </svg>
);

export const Addons: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
      <InputGroup>
        <SearchIcon slot="start" />
        <input type="search" aria-label="Search" placeholder="Search…" />
        <Kbd slot="end" keys={['⌘', 'K']} />
      </InputGroup>
      <InputGroup>
        <span slot="start">https://</span>
        <input aria-label="Website" placeholder="example.com" />
      </InputGroup>
      <InputGroup>
        <input aria-label="Amount" placeholder="0.00" inputMode="decimal" />
        <span slot="end">USD</span>
      </InputGroup>
      <InputGroup>
        <input aria-label="Repository" defaultValue="editora" />
        <Spinner slot="end" size="sm" label="Checking the name" />
      </InputGroup>
      <InputGroup invalid>
        <input aria-label="Email" defaultValue="not-an-email" />
      </InputGroup>
      <InputGroup disabled>
        <input aria-label="Disabled field" defaultValue="Disabled" />
      </InputGroup>
    </Box>
  ),
};

export const Composer: Story = {
  render: () => (
    <Box style={{ maxWidth: 560 }}>
      <InputGroup>
        <textarea aria-label="Message" placeholder="Ask anything…" />
        <div slot="bottom" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button size="sm" variant="ghost">Attach</Button>
          <Button size="sm">Send</Button>
        </div>
      </InputGroup>
    </Box>
  ),
};
