import React from 'react';
import { Section , Box} from '@editora/ui-react';

export default {
  title: 'UI/Section',
  component: Section,
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] }
  }
};

export const Default = (args: any) => (
  <Section size={args.size} style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
    <Box style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
      Section content ({args.size})
    </Box>
  </Section>
);
Default.args = { size: 'medium' };

export const SizeVariants = () => (
  <div>
    <Section size="small"><Box style={{ background: '#f8fafc' }}>Small spacing</Box></Section>
    <Section size="medium"><Box style={{ background: '#f1f5f9' }}>Medium spacing</Box></Section>
    <Section size="large"><Box style={{ background: '#e2e8f0' }}>Large spacing</Box></Section>
  </div>
);
