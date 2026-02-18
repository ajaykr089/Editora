import React from 'react';
import { Input } from '@editora/ui-react';

export default {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' }
  }
};

const Template = (args: any) => <Input value={args.value} placeholder={args.placeholder} disabled={args.disabled} />;

export const Default = Template.bind({});
Default.args = { value: '', placeholder: 'Type here…', disabled: false };

export const WithValue = Template.bind({});
WithValue.args = { value: 'Hello', placeholder: 'Type here…', disabled: false };

export const Disabled = Template.bind({});
Disabled.args = { value: '', placeholder: 'Disabled', disabled: true };
