import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
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
} from '../server';

describe('server entrypoint', () => {
  it('renders the server-safe subset to static markup', () => {
    const html = renderToStaticMarkup(
      <DirectionProvider dir="rtl">
        <Container size="lg">
          <Section variant="elevated" tone="brand">
            <Box variant="surface" tone="brand">
              <Label htmlFor="email">Email</Label>
              <Field label="Profile" required>
                <span>Field body</span>
              </Field>
              <Flex direction="column" gap="1rem">
                <Grid columns={2}>
                  <Anchor id="anchor-marker" />
                  <Icon name="sparkles" decorative />
                  <AspectRatio ratio={16 / 9} showRatioBadge />
                  <Separator tone="warning" />
                  <VisuallyHidden>Screen reader text</VisuallyHidden>
                </Grid>
              </Flex>
            </Box>
          </Section>
        </Container>
      </DirectionProvider>
    );

    expect(html).toContain('<ui-direction-provider dir="rtl">');
    expect(html).toContain('<ui-container size="lg">');
    expect(html).toContain('<ui-section');
    expect(html).toContain('<ui-box');
    expect(html).toContain('<ui-label for="email">Email</ui-label>');
    expect(html).toContain('<ui-field label="Profile" required="">');
    expect(html).toContain('<ui-flex');
    expect(html).toContain('<ui-grid');
    expect(html).toContain('<ui-anchor id="anchor-marker"></ui-anchor>');
    expect(html).toContain('<ui-icon name="sparkles" decorative=""></ui-icon>');
    expect(html).toContain('<ui-aspect-ratio ratio="16/9" show-ratio-badge=""></ui-aspect-ratio>');
    expect(html).toContain('<ui-separator tone="warning">');
    expect(html).toContain('<ui-visually-hidden>Screen reader text</ui-visually-hidden>');
  });
});
