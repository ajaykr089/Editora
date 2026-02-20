import React from 'react';
import { Separator , Box, Flex} from '@editora/ui-react';

export default {
  title: 'UI/Separator',
  component: Separator
};

export const Horizontal = () => (
  <Box style={{ maxWidth: 480 }}>
    <div>Section A</div>
    <Separator />
    <div>Section B</div>
  </Box>
);

export const Vertical = () => (
  <Flex style={{ display: 'flex', alignItems: 'center' }}>
    <span>Left</span>
    <Separator orientation="vertical" />
    <span>Center</span>
    <Separator orientation="vertical" />
    <span>Right</span>
  </Flex>
);
