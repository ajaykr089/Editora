import React from 'react';
import { Box, InlineEdit } from '@editora/ui-react';

export default {
  title: 'UI/InlineEdit',
  component: InlineEdit
};

export const EditorialCard = () => {
  const [title, setTitle] = React.useState('Q2 Incident Review');
  const [summary, setSummary] = React.useState('Summarize the operational learnings and remediation follow-up for the release train.');
  return (
    <Box style={{ display: 'grid', gap: 18, maxWidth: 720 }}>
      <InlineEdit value={title} placeholder="Untitled note" onValueChange={setTitle} />
      <InlineEdit multiline value={summary} placeholder="Add summary" onValueChange={setSummary} />
    </Box>
  );
};
