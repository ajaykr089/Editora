import React, { useState } from 'react';
import { Box, Grid, TagsInput } from '@editora/ui-react';

export default {
  title: 'UI/TagsInput',
  component: TagsInput,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    counter: { control: 'boolean' },
    maxTags: { control: 'number' },
    allowDuplicates: { control: 'boolean' },
    addOnBlur: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const [value, setValue] = useState<string[]>(['design', 'ops']);
  return (
    <Box style={{ maxWidth: 560 }}>
      <TagsInput {...args} value={value} onChange={setValue} />
    </Box>
  );
};

Playground.args = {
  label: 'Owners',
  description: 'Add recipients, labels, or reviewer groups.',
  placeholder: 'Add an owner',
  required: false,
  disabled: false,
  readOnly: false,
  counter: true,
  maxTags: 6,
  allowDuplicates: false,
  addOnBlur: true
};

export const ProductionPatterns = () => {
  const [reviewers, setReviewers] = useState(['ops', 'security', 'platform']);
  const [filters, setFilters] = useState(['p0', 'incident', 'customer-visible']);

  return (
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))' }}>
      <TagsInput
        label="Incident reviewers"
        description="Fast keyboard entry for multi-owner assignment."
        value={reviewers}
        onChange={setReviewers}
        maxTags={8}
        counter
        addOnBlur
      />
      <TagsInput
        label="Saved search filters"
        description="Tokenized filters without dropdown dependence."
        value={filters}
        onChange={setFilters}
        counter
      />
    </Grid>
  );
};
