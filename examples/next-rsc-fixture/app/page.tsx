import React from 'react';
import { Anchor, Box, Container, Flex, Section, Separator } from '@editora/ui-react/server';
import { ClientShowcase } from './client-showcase';

export default function Page() {
  return (
    <Container size="lg">
      <Section
        style={{
          minHeight: '100vh',
          padding: '48px 24px',
          display: 'grid',
          alignItems: 'start',
          background: 'linear-gradient(180deg, #f8fbff 0%, #eef3fb 100%)',
        }}
      >
        <Flex direction="column" gap="24px">
          <Box
            style={{
              display: 'grid',
              gap: 14,
              padding: 24,
              borderRadius: 20,
              background: '#ffffff',
              border: '1px solid rgba(148, 163, 184, 0.24)',
            }}
          >
            <Box style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              Server Component
            </Box>
            <Box style={{ fontSize: 34, lineHeight: 1.05, fontWeight: 800 }}>
              Next.js RSC compatibility fixture
            </Box>
            <Box style={{ maxWidth: 760, fontSize: 16, lineHeight: 1.7, color: '#475569' }}>
              This page renders server-safe layout primitives from <code>@editora/ui-react/server</code> and now links
              into a split client-demo suite below using <code>@editora/ui-react/client</code> plus broader
              <code>@editora/ui-react</code> wrappers where the fuller component surface needs to be exercised. The
              fixtures are grouped by purpose so the experience stays lighter while covering much more of the library.
            </Box>
            <Anchor href="#client-fixture" style={{ color: '#2563eb', fontWeight: 600 }}>
              Browse client demo routes
            </Anchor>
          </Box>

          <Separator />

          <Box id="client-fixture">
            <ClientShowcase />
          </Box>
        </Flex>
      </Section>
    </Container>
  );
}
