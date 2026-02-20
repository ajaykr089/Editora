import React from 'react';
import { Input, ThemeProvider , Box} from '@editora/ui-react';

export default {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    debounce: { control: 'number' },
    validation: { control: { type: 'radio', options: ['none', 'error', 'success'] } },
    size: { control: { type: 'radio', options: ['1','2','3','sm','md','lg'] } },
    maxlength: { control: 'number' },
    autofocus: { control: 'boolean' },
    type: { control: 'text' },
    name: { control: 'text' },
    required: { control: 'boolean' },
    pattern: { control: 'text' },
    inputMode: { control: 'text' },
    autoComplete: { control: 'text' },
    variant: { control: { type: 'radio', options: ['classic','surface','soft'] } },
    radius: { control: { type: 'radio', options: ['none','default','large','full'] } },
    label: { control: 'text' },
    description: { control: 'text' }
  }
};

const Template = (args: any) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = { value: '', placeholder: 'Type here…', disabled: false };

export const Clearable = Template.bind({});
Clearable.args = { value: 'Clear me', clearable: true };

export const Debounced = Template.bind({});
Debounced.args = { value: '', debounce: 200, placeholder: 'Debounced (200ms)' };

export const ValidationStates = Template.bind({});
ValidationStates.args = { value: '', validation: 'error', placeholder: 'Shows error state' };

export const WithSlots = (args: any) => (
  <Input {...args}>
    <span slot="prefix">🔍</span>
    <button slot="suffix">Go</button>
    <div slot="error">This is an error message</div>
  </Input>
);
WithSlots.args = { value: '', placeholder: 'With prefix / suffix / error slot' };

export const WithLabelAndDescription = Template.bind({});
WithLabelAndDescription.args = { value: '', label: 'Full name', description: 'Enter your legal full name', placeholder: 'Jane Doe' };

export const Variants = Template.bind({});
Variants.args = { value: '', variant: 'surface', placeholder: 'Surface variant' };

export const FormAttributes = Template.bind({});
FormAttributes.args = { value: '', type: 'email', name: 'email', required: true, pattern: '^.+@.+\\..+$', placeholder: 'you@company.com' };

export const StyledWithCSSVars = Template.bind({});
StyledWithCSSVars.args = { value: '', placeholder: 'Custom CSS vars', style: { ['--ui-input-border' as any]: '2px dashed #6b46c1', ['--ui-input-border-radius' as any]: '12px' } };

export const ThemedByTokens = () => (
  <ThemeProvider tokens={{ colors: { primary: '#16a34a', background: '#0f172a', text: '#f8fafc' }, radius: '12px' }}>
    <Box style={{ padding: 12, background: 'var(--ui-color-background)' }}>
      <Input placeholder="Token-driven input" />
    </Box>
  </ThemeProvider>
);

export const Autofocus = Template.bind({});
Autofocus.args = { value: '', autofocus: true, placeholder: 'Auto-focused' };

export const WithMaxLength = Template.bind({});
WithMaxLength.args = { value: '', maxlength: 8, placeholder: 'Max length 8' };
