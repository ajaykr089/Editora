import React from 'react';
import { Collapsible , Box} from '@editora/ui-react';

export default {
  title: 'UI/Collapsible',
  component: Collapsible,
  argTypes: {
    open: { control: 'boolean' },
    headless: { control: 'boolean' }
  }
};

export const Default = (args: any) => (
  <Collapsible header="Click to expand" open={args.open} headless={args.headless}>
    <Box style={{ paddingTop: 8 }}>Collapsible content with keyboard support (Enter/Space on header).</Box>
  </Collapsible>
);
Default.args = { open: false, headless: false };

export const RichHeader = () => (
  <Collapsible
    header={<span><strong>Advanced Settings</strong> <small style={{ color: '#64748b' }}>(optional)</small></span>}
  >
    <p style={{ margin: 0, paddingTop: 8 }}>Tune rendering density, spellcheck behavior, and content filters.</p>
  </Collapsible>
);
