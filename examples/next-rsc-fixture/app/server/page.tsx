import React from 'react';
import {
  Anchor,
  AspectRatio,
  Box,
  Container,
  DirectionProvider,
  Field,
  Flex,
  Grid,
  Icon,
  Label,
  Section,
  Separator,
  VisuallyHidden,
} from '@editora/ui-react/server';

const serverExports = [
  'Box',
  'Flex',
  'Grid',
  'Container',
  'DirectionProvider',
  'Anchor',
  'AspectRatio',
  'Field',
  'Icon',
  'Label',
  'Section',
  'Separator',
  'VisuallyHidden',
];

const serverLinks = [
  { href: '/', label: 'Overview' },
  { href: '/foundation', label: 'Foundation' },
  { href: '/systems', label: 'Systems' },
];

export default function ServerPage() {
  return (
    <DirectionProvider dir="ltr">
      <Container size="lg">
        <Section
          style={{
            minHeight: '100vh',
            padding: '40px 24px 64px',
            display: 'grid',
            gap: 20,
            alignItems: 'start',
            background: 'linear-gradient(180deg, #f8fbff 0%, #eef3fb 100%)',
          }}
        >
          <Box
            style={{
              display: 'grid',
              gap: 18,
              padding: 24,
              borderRadius: 24,
              border: '1px solid rgba(148, 163, 184, 0.24)',
              background:
                'radial-gradient(circle at top right, rgba(14, 165, 233, 0.14), transparent 30%), rgba(255, 255, 255, 0.96)',
              boxShadow: '0 18px 38px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Grid style={{ display: 'grid', gap: 10 }}>
              <Box style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
                Server Route
              </Box>
              <Box style={{ fontSize: 30, lineHeight: 1.05, fontWeight: 900, color: '#0f172a' }}>
                @editora/ui-react/server showcase
              </Box>
              <Box style={{ maxWidth: 820, fontSize: 15, lineHeight: 1.7, color: '#475569' }}>
                This page is rendered from the server-safe entrypoint only. It avoids client wrappers and demonstrates the
                subset that is safe to use in React Server Components and SSR contexts.
              </Box>
            </Grid>

            <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {serverLinks.map((link) => (
                <Anchor
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 999,
                    border: '1px solid rgba(148, 163, 184, 0.22)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#0f172a',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Anchor>
              ))}
            </Flex>

            <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {serverExports.map((component) => (
                <Box
                  key={component}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 999,
                    background: 'rgba(14, 165, 233, 0.1)',
                    color: '#0c4a6e',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {component}
                </Box>
              ))}
            </Flex>
          </Box>

          <Grid style={{ display: 'grid', gap: 20 }}>
            <Box
              style={{
                display: 'grid',
                gap: 16,
                padding: 20,
                borderRadius: 20,
                border: '1px solid rgba(148, 163, 184, 0.24)',
                background: 'rgba(255, 255, 255, 0.92)',
                boxShadow: '0 18px 38px rgba(15, 23, 42, 0.08)',
              }}
            >
              <Grid style={{ display: 'grid', gap: 6 }}>
                <Box style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
                  Layout
                </Box>
                <Box style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15, color: '#0f172a' }}>
                  Box, Flex, Grid, Container, Section, DirectionProvider
                </Box>
                <Box style={{ fontSize: 14, lineHeight: 1.6, color: '#475569' }}>
                  The overall page shell and these demo blocks are all built from the server entrypoint primitives.
                </Box>
              </Grid>

              <Grid
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 14,
                }}
              >
                <Box
                  style={{
                    display: 'grid',
                    gap: 8,
                    padding: 16,
                    borderRadius: 18,
                    background: '#eff6ff',
                    color: '#1e3a8a',
                  }}
                >
                  <Box style={{ fontWeight: 800 }}>Box</Box>
                  <Box>General-purpose surface wrapper for spacing and grouping.</Box>
                </Box>
                <Flex
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    padding: 16,
                    borderRadius: 18,
                    background: '#ecfdf5',
                    color: '#166534',
                  }}
                >
                  <Box style={{ fontWeight: 800 }}>Flex</Box>
                  <Box>Stacked content aligned with server-safe flex layout.</Box>
                </Flex>
                <Grid
                  style={{
                    display: 'grid',
                    gap: 8,
                    padding: 16,
                    borderRadius: 18,
                    background: '#fff7ed',
                    color: '#9a3412',
                  }}
                >
                  <Box style={{ fontWeight: 800 }}>Grid</Box>
                  <Box>Responsive composition without any client hooks.</Box>
                </Grid>
              </Grid>
            </Box>

            <Box
              style={{
                display: 'grid',
                gap: 16,
                padding: 20,
                borderRadius: 20,
                border: '1px solid rgba(148, 163, 184, 0.24)',
                background: 'rgba(255, 255, 255, 0.92)',
                boxShadow: '0 18px 38px rgba(15, 23, 42, 0.08)',
              }}
            >
              <Grid style={{ display: 'grid', gap: 6 }}>
                <Box style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
                  Content
                </Box>
                <Box style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15, color: '#0f172a' }}>
                  Anchor, Icon, AspectRatio, Separator, VisuallyHidden
                </Box>
                <Box style={{ fontSize: 14, lineHeight: 1.6, color: '#475569' }}>
                  These components are safe to emit from the server and still useful for navigation, media, and accessibility.
                </Box>
              </Grid>

              <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Anchor href="/" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                  Back to overview
                </Anchor>
                <Anchor href="/systems" style={{ color: '#0f766e', fontWeight: 700, textDecoration: 'none' }}>
                  Open systems route
                </Anchor>
              </Flex>

              <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <Icon name="sparkles" decorative />
                <Icon name="settings" tone="warning" />
                <Icon name="shield-check" tone="success" />
              </Flex>

              <AspectRatio
                ratio={16 / 9}
                showRatioBadge
                style={{
                  width: 'min(100%, 420px)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1px solid rgba(148, 163, 184, 0.24)',
                  background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
                }}
              >
                <Box
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                    color: '#1e293b',
                  }}
                >
                  16:9 media surface
                </Box>
              </AspectRatio>

              <Separator tone="warning" />

              <Box style={{ fontSize: 14, lineHeight: 1.6, color: '#475569' }}>
                <VisuallyHidden>Server-only accessibility helper text for assistive technology.</VisuallyHidden>
                This paragraph also includes a hidden accessibility label rendered by <code>VisuallyHidden</code>.
              </Box>
            </Box>

            <Box
              style={{
                display: 'grid',
                gap: 16,
                padding: 20,
                borderRadius: 20,
                border: '1px solid rgba(148, 163, 184, 0.24)',
                background: 'rgba(255, 255, 255, 0.92)',
                boxShadow: '0 18px 38px rgba(15, 23, 42, 0.08)',
              }}
            >
              <Grid style={{ display: 'grid', gap: 6 }}>
                <Box style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
                  Forms
                </Box>
                <Box style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15, color: '#0f172a' }}>
                  Field and Label
                </Box>
                <Box style={{ fontSize: 14, lineHeight: 1.6, color: '#475569' }}>
                  This is a plain server-rendered form shell using the server barrel with native HTML inputs inside.
                </Box>
              </Grid>

              <Grid style={{ display: 'grid', gap: 14, maxWidth: 560 }}>
                <Label htmlFor="server-email">Notification email</Label>
                <Field
                  label="Workspace email"
                  description="Native inputs can still sit inside the field shell on the server route."
                  htmlFor="server-email"
                  required
                  variant="surface"
                  tone="brand"
                >
                  <input
                    id="server-email"
                    name="server-email"
                    type="email"
                    defaultValue="ops@editora.dev"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 12,
                      border: '1px solid rgba(148, 163, 184, 0.32)',
                      font: 'inherit',
                    }}
                  />
                </Field>

                <Field
                  label="Release note"
                  description="A second field to show stacked server-rendered composition."
                  htmlFor="server-note"
                  shell="soft"
                >
                  <textarea
                    id="server-note"
                    name="server-note"
                    defaultValue="Server-safe route for RSC verification."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 12,
                      border: '1px solid rgba(148, 163, 184, 0.32)',
                      font: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </Field>
              </Grid>
            </Box>
          </Grid>
        </Section>
      </Container>
    </DirectionProvider>
  );
}
