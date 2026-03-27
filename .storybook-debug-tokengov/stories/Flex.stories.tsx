import React from 'react';
import { Flex, Box} from '@editora/ui-react';

export default {
  title: 'UI/Flex',
  component: Flex
};

export const Default = () => (
  <Flex gap="8px" align="center" justify="space-between" style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
    <Box style={{ background: '#e2e8f0', padding: 8, borderRadius: 8 }}>Left</Box>
    <Box style={{ background: '#e2e8f0', padding: 8, borderRadius: 8 }}>Center</Box>
    <Box style={{ background: '#e2e8f0', padding: 8, borderRadius: 8 }}>Right</Box>
  </Flex>
);

export const ResponsiveProps = () => (
  <Flex
    direction={{ initial: 'column', md: 'row' } as any}
    gap={{ initial: '8px', md: '14px' } as any}
    align={{ initial: 'stretch', md: 'center' } as any}
    style={{ border: '1px dashed #cbd5e1', borderRadius: 10, padding: 12 }}
  >
    <Box style={{ background: '#dbeafe', padding: 10, borderRadius: 8 }}>Card A</Box>
    <Box style={{ background: '#dcfce7', padding: 10, borderRadius: 8 }}>Card B</Box>
    <Box style={{ background: '#fef3c7', padding: 10, borderRadius: 8 }}>Card C</Box>
  </Flex>
);
