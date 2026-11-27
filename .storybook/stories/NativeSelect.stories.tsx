import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, NativeSelect } from '@editora/ui-react';

const meta: Meta<typeof NativeSelect> = {
  title: 'UI/NativeSelect',
  component: NativeSelect,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['outline', 'soft', 'ghost'] },
  },
};
export default meta;
type Story = StoryObj<typeof NativeSelect>;

export const Playground: Story = {
  render: (args) => (
    <Box style={{ maxWidth: 280 }}>
      <NativeSelect {...args}>
        <select aria-label="Country" defaultValue="in">
          <option value="in">India</option>
          <option value="us">United States</option>
          <option value="de">Germany</option>
        </select>
      </NativeSelect>
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
      <label htmlFor="ns-time" style={{ fontSize: 'var(--ui-font-size-sm, 13px)' }}>Time zone</label>
      <NativeSelect>
        <select id="ns-time" defaultValue="ist">
          <optgroup label="Asia">
            <option value="ist">India (IST)</option>
          </optgroup>
          <optgroup label="Europe">
            <option value="cet">Central Europe (CET)</option>
          </optgroup>
        </select>
      </NativeSelect>
      <NativeSelect size="sm" variant="soft">
        <select aria-label="Small soft"><option>Small soft</option></select>
      </NativeSelect>
      <NativeSelect invalid>
        <select aria-label="Invalid"><option>Invalid</option></select>
      </NativeSelect>
      <NativeSelect>
        <select aria-label="Disabled" disabled><option>Disabled</option></select>
      </NativeSelect>
      <NativeSelect>
        <select aria-label="Several" multiple defaultValue={['a']}>
          <option value="a">Option A</option>
          <option value="b">Option B</option>
          <option value="c">Option C</option>
        </select>
      </NativeSelect>
    </Box>
  ),
};
