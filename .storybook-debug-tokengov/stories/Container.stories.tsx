import React from 'react';
import { Container , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Container',
  component: Container,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] }
  }
};

export const Default = (args: any) => (
  <Container size={args.size} style={{ padding: 24, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
    Container content ({args.size})
  </Container>
);
Default.args = { size: 'md' };

export const SizeComparison = () => (
  <Grid style={{ display: 'grid', gap: 10 }}>
    <Container size="sm" style={{ background: '#f1f5f9', padding: 12 }}>Small</Container>
    <Container size="md" style={{ background: '#f1f5f9', padding: 12 }}>Medium</Container>
    <Container size="lg" style={{ background: '#f1f5f9', padding: 12 }}>Large</Container>
    <Container size="xl" style={{ background: '#f1f5f9', padding: 12 }}>Extra Large</Container>
  </Grid>
);
