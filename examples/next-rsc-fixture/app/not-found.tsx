import React from 'react';
import { Box, Container, Section } from '@editora/ui-react/server';

export default function NotFound() {
  return (
    <Container size="sm">
      <Section
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: '#f5f7fb',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <Box style={{ textAlign: 'center', display: 'grid', gap: 8 }}>
        <Box style={{ fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
          Not Found
        </Box>
        <h1 style={{ margin: 0, fontSize: 28 }}>This fixture route does not exist.</h1>
      </Box>
      </Section>
    </Container>
  );
}
