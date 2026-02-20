import React, { useState } from 'react';
import { BlockControls, Button , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/BlockControls',
  component: BlockControls
};

export const Default = () => (
  <BlockControls>
    <Button>Bold</Button>
    <Button>Italic</Button>
    <Button>Link</Button>
  </BlockControls>
);

export const ActiveToolState = () => {
  const [tool, setTool] = useState('paragraph');

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <BlockControls>
        <Button variant={tool === 'paragraph' ? 'primary' : 'secondary'} onClick={() => setTool('paragraph')}>Paragraph</Button>
        <Button variant={tool === 'heading' ? 'primary' : 'secondary'} onClick={() => setTool('heading')}>Heading</Button>
        <Button variant={tool === 'quote' ? 'primary' : 'secondary'} onClick={() => setTool('quote')}>Quote</Button>
      </BlockControls>
      <Box style={{ fontSize: 13, color: '#475569' }}>Active block: <strong>{tool}</strong></Box>
    </Grid>
  );
};

export const CustomStyled = () => (
  <BlockControls style={{ display: 'inline-flex', gap: 8, padding: 8, border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc' }}>
    <Button size="sm">Undo</Button>
    <Button size="sm">Redo</Button>
    <Button size="sm" variant="secondary">More</Button>
  </BlockControls>
);
