import React from 'react';
import { BlockControls, Button } from '@editora/ui-react';

export default {
  title: 'UI/BlockControls',
  component: BlockControls
};

export const Default = (args: any) => (
  <BlockControls>
    <Button>Bold</Button>
    <Button>Link</Button>
    <Button>More</Button>
  </BlockControls>
);
