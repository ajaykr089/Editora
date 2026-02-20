import React from 'react';
import { Box, Button, Combobox, Field, Flex, Form, Grid, useForm } from '@editora/ui-react';

export default {
  title: 'UI/Combobox',
  component: Combobox,
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    debounce: { control: 'number' },
    allowCustom: { control: 'boolean' },
    noFilter: { control: 'boolean' },
    validation: { control: { type: 'radio', options: ['none', 'error', 'success'] } },
    size: { control: { type: 'radio', options: ['1', '2', '3', 'sm', 'md', 'lg'] } },
    variant: { control: { type: 'radio', options: ['classic', 'surface', 'soft'] } },
    radius: { control: { type: 'radio', options: ['none', 'default', 'large', 'full'] } },
    label: { control: 'text' },
    description: { control: 'text' }
  }
};

const teamOptions = [
  { value: 'design', label: 'Design Team' },
  { value: 'engineering', label: 'Engineering Team' },
  { value: 'product', label: 'Product Team' },
  { value: 'qa', label: 'Quality Assurance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' }
];

const renderOptions = () =>
  teamOptions.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));

const Template = (args: any) => (
  <Box style={{ maxWidth: 360 }}>
    <Combobox {...args}>{renderOptions()}</Combobox>
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  value: '',
  placeholder: 'Select a team...',
  clearable: true
};

export const Controlled = () => {
  const [value, setValue] = React.useState('engineering');
  const [query, setQuery] = React.useState('');
  return (
    <Grid style={{ display: 'grid', gap: 10, maxWidth: 380 }}>
      <Combobox
        value={value}
        clearable
        placeholder="Choose owner..."
        onChange={(next) => setValue(next)}
        onInput={(nextQuery) => setQuery(nextQuery)}
      >
        {renderOptions()}
      </Combobox>
      <Box style={{ fontSize: 13, color: '#475569' }}>
        value: <code>{value || '(empty)'}</code> | query: <code>{query || '(empty)'}</code>
      </Box>
    </Grid>
  );
};

export const AllowCustomValues = () => (
  <Box style={{ maxWidth: 380 }}>
    <Combobox
      allowCustom
      clearable
      placeholder="Type or choose a tag..."
      label="Tag"
      description="Press Enter to commit a custom value."
      emptyText="No preset tags match your input."
    >
      <option value="release-blocker">Release blocker</option>
      <option value="performance">Performance</option>
      <option value="customer-report">Customer report</option>
      <option value="internal-note">Internal note</option>
    </Combobox>
  </Box>
);

export const ValidationState = Template.bind({});
ValidationState.args = {
  value: '',
  placeholder: 'Required value missing',
  validation: 'error',
  label: 'Reviewer',
  description: 'Pick one reviewer before continuing.'
};

export const InForm = () => {
  const { ref, submit, getValues } = useForm();

  return (
    <Box style={{ maxWidth: 460 }}>
      <Form ref={ref} onSubmit={(values) => alert(JSON.stringify(values))}>
        <Grid style={{ display: 'grid', gap: 12 }}>
          <Field label="Team" htmlFor="team-combobox" required>
            <Combobox id="team-combobox" name="team" required placeholder="Select team..." clearable>
              {renderOptions()}
            </Combobox>
          </Field>
        </Grid>
      </Form>

      <Flex style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button onClick={() => submit()}>Submit</Button>
        <Button variant="secondary" onClick={() => alert(JSON.stringify(getValues()))}>
          Get values
        </Button>
      </Flex>
    </Box>
  );
};
