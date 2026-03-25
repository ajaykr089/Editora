import React from 'react';
import { Separator , Box, Flex} from '@editora/ui-react';

export default {
  title: 'UI/Separator',
  component: Separator
};

export const Horizontal = () => (
  <Box style={{ maxWidth: 560 }}>
    <Box style={{ fontSize: 13, color: '#334155' }}>Pipeline overview</Box>
    <Separator label="Milestone" variant="gradient" tone="brand" />
    <Box style={{ fontSize: 13, color: '#334155' }}>Live environments</Box>
    <Separator variant="dashed" tone="warning" inset="sm" />
    <Box style={{ fontSize: 13, color: '#334155' }}>Archived releases</Box>
  </Box>
);

export const Vertical = () => (
  <Flex style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 36 }}>
    <span>Left</span>
    <Separator orientation="vertical" variant="gradient" tone="brand" size="medium" />
    <span>Center</span>
    <Separator orientation="vertical" variant="glow" tone="success" />
    <span>Right</span>
  </Flex>
);

export const Variants = () => (
  <Flex style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 580 }}>
    <Separator label="Solid" variant="solid" />
    <Separator label="Dashed" variant="dashed" tone="warning" />
    <Separator label="Dotted" variant="dotted" tone="danger" />
    <Separator label="Gradient" variant="gradient" tone="brand" />
    <Separator label="Glow" variant="glow" tone="success" size="medium" />
  </Flex>
);
