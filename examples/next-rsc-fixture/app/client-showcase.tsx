'use client';

import React from 'react';
import { Anchor, AnimatedNumber, Badge, Box, Button, Flex, Grid } from '@editora/ui-react/client';
import { ShowcaseCard, demoRoutes, eyebrowStyle, hintStyle, stageStyle } from './showcase/shared';

export function ClientShowcase() {
  const coverage = Array.from(new Set(demoRoutes.flatMap((route) => route.components)));

  return (
    <Grid style={{ display: 'grid', gap: 20, justifyItems: 'stretch', alignItems: 'start' }}>
      <ShowcaseCard
        eyebrow="Client Demo Hub"
        title="Split showcase routes"
        description="The original single-page client fixture grew too large, so the demos are now split into focused routes. This keeps the fixture faster to load while expanding coverage across both the trimmed client barrel and broader ui-react component surface."
      >
        <Box style={{ ...stageStyle, gap: 18 }}>
          <Grid style={{ display: 'grid', gap: 10, justifyItems: 'stretch', alignItems: 'start' }}>
            <Box style={eyebrowStyle}>Coverage summary</Box>
            <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge tone="success">{demoRoutes.length} focused routes</Badge>
              <Badge tone="info">{coverage.length} showcased exports covered</Badge>
            </Flex>
          </Grid>

          <Grid
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
              justifyItems: 'stretch',
              alignItems: 'start',
            }}
          >
            <Box style={stageStyle}>
              <Box style={eyebrowStyle}>Routes</Box>
              <AnimatedNumber value={demoRoutes.length} variant="digital" animate animateOnMount />
            </Box>
            <Box style={stageStyle}>
              <Box style={eyebrowStyle}>Covered exports</Box>
              <AnimatedNumber value={coverage.length} variant="inline" animate animateOnMount />
            </Box>
          </Grid>

          <Grid
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 14,
              justifyItems: 'stretch',
              alignItems: 'start',
            }}
          >
            {demoRoutes.map((route) => (
              <Box
                key={route.href}
                style={{
                  ...stageStyle,
                  alignContent: 'start',
                }}
              >
                <Grid style={{ display: 'grid', gap: 6 }}>
                  <Box style={eyebrowStyle}>{route.eyebrow}</Box>
                  <Box style={{ fontSize: 18, fontWeight: 800 }}>{route.title}</Box>
                  <Box style={hintStyle}>{route.description}</Box>
                </Grid>

                <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {route.components.slice(0, 5).map((component) => (
                    <Badge key={component} tone="info">
                      {component}
                    </Badge>
                  ))}
                  {route.components.length > 5 ? <Badge tone="warning">+{route.components.length - 5} more</Badge> : null}
                </Flex>

                <Anchor href={route.href} style={{ color: '#2563eb', fontWeight: 700 }}>
                  Open {route.title}
                </Anchor>
              </Box>
            ))}
          </Grid>

          <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Anchor href="/foundation" style={{ color: '#2563eb', fontWeight: 700 }}>
              Start with foundation
            </Anchor>
            <Button recipe="outline" onClick={() => window.location.assign('/dates')}>
              Open date & time demos
            </Button>
          </Flex>
        </Box>
      </ShowcaseCard>
    </Grid>
  );
}
