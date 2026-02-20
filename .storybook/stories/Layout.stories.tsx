import React, { useEffect, useRef } from 'react';
import { Button, Box, Flex, Grid, Section, Container } from '@editora/ui-react';

export default {
  title: 'UI/Layout',
};

export const FlexAndGrid = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const host = ref.current!;
    // create ui-flex
    const flex = document.createElement('ui-flex');
    flex.setAttribute('direction', 'row');
    flex.innerHTML = '<button part="slot">Flex item A</button><button part="slot">Flex item B</button>';
    // create ui-grid
    const grid = document.createElement('ui-grid');
    grid.setAttribute('columns', '1fr 1fr');
    grid.innerHTML = '<div>Grid A</div><div>Grid B</div>';
    host.appendChild(flex);
    host.appendChild(document.createElement('br'));
    host.appendChild(grid);
    return () => { host.innerHTML = ''; };
  }, []);

  return (
    <Box ref={ref} style={{ padding: 12 }}>
      <Box style={{ marginBottom: 8 }}>Flex and Grid primitives (native web components):</Box>
    </Box>
  );
};

export const BoxDemo = () => (
  <Box style={{ padding: 20 }}>
    <Flex style={{ display: "flex", gap: 12 }}>
      <Box p="md" w="100%" bg="red" color="white" display="flex">Box MD</Box>
      <Box p="sm" w="100%" bg="#fff" color="#000" border="1px solid #eee">Box SM</Box>
    </Flex>

    <Box style={{ marginTop: 16 }}>
      <Box style={{ marginBottom: 8 }}>Box align (explicit prop):</Box>
      <Box display="flex" align="flex-start" p="sm" bg="#f3f4f6" style={{ height: 72 }}>
        <Box style={{ background: '#fff', padding: 8 }}>start</Box>
        <Box style={{ background: '#fff', padding: 8 }}>start</Box>
      </Box>
    </Box>
  </Box>
);

export const SectionContainerDemo = () => (
  <div>
    <Section size="large" style={{ background: '#fafafa' }}>
      <Container size="md">
        <h3>Section / Container</h3>
        <p>Centered container and section spacing primitives (React wrappers).</p>
      </Container>
    </Section>
  </div>
);

