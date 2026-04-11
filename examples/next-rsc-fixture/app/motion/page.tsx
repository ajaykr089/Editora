'use client';

import React from 'react';
import {
  AnimatedBeam,
  AnimatedList,
  AnimatedText,
  Badge,
  Box,
  Button,
  Carousel,
  DirectionProvider,
  Dock,
  Grid,
  IconCloud,
  Marquee,
  NumberTicker,
  Orbiter,
  SpinningText,
} from '@editora/ui-react';
import { ShowcaseCard, ShowcaseShell, eyebrowStyle, hintStyle, stageStyle } from '../showcase/shared';

export default function MotionPage() {
  const [tickerTarget, setTickerTarget] = React.useState(128420);
  const [motionNote, setMotionNote] = React.useState('Motion components are mounted and ready.');

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/motion"
        eyebrow="Motion"
        title="Animated display and storytelling components"
        description="This route covers the more expressive wrappers from the broader ui-react surface: animated text, tickers, marquees, orbiting layouts, dock interactions, icon clouds, and connection diagrams."
      >
        <Grid
          style={{
            display: 'grid',
            gap: 18,
            justifyItems: 'stretch',
            alignItems: 'start',
          }}
        >
          <ShowcaseCard
            eyebrow="Copy"
            title="AnimatedText, SpinningText, NumberTicker, and Carousel"
            description="These wrappers are useful for premium hero moments, counters, high-signal callouts, and narrative slide sequences."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>AnimatedText</Box>
                <AnimatedText effect="fade-up" split="words" variant="gradient" size="lg">
                  Editorial automation that feels alive
                </AnimatedText>
                <AnimatedText
                  effect="wave"
                  split="words"
                  trigger="visible"
                  variant="soft"
                  tone="info"
                  size="md"
                  padding="10 14"
                >
                  Motion stays readable while still feeling intentional.
                </AnimatedText>
              </Box>

              <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, justifyItems: 'stretch', alignItems: 'start' }}>
                <Box style={{ ...stageStyle, width: '100%' }}>
                  <Box style={eyebrowStyle}>SpinningText</Box>
                  <SpinningText
                    text="Release systems ready for distribution"
                    repeat={2}
                    speed={4.5}
                    variant="glass"
                    tone="brand"
                    size="lg"
                    elevation="high"
                  >
                    <SpinningText.Center>
                      <Box style={{ fontWeight: 800, letterSpacing: '0.08em' }}>ET</Box>
                    </SpinningText.Center>
                  </SpinningText>
                </Box>

                <Box style={{ ...stageStyle, width: '100%' }}>
                  <Box style={eyebrowStyle}>NumberTicker</Box>
                  <NumberTicker
                    value={tickerTarget}
                    from={120000}
                    duration={1400}
                    formatStyle="currency"
                    currency="USD"
                    tone="brand"
                    size="xl"
                  />
                  <Button recipe="outline" size="sm" onClick={() => setTickerTarget((current) => current + 8420)}>
                    Increase target
                  </Button>
                </Box>
              </Grid>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Carousel</Box>
                <Carousel label="Launch storytelling carousel">
                  <Carousel.Item label="Narrative setup">
                    <Grid style={{ display: 'grid', gap: 12, alignItems: 'start', justifyItems: 'start' }}>
                      <Badge tone="info">Story beat 1</Badge>
                      <Box style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
                        Introduce the release in one high-clarity frame
                      </Box>
                      <Box style={hintStyle}>
                        Carousel works best when each panel has a distinct job: context, momentum, and proof.
                      </Box>
                    </Grid>
                  </Carousel.Item>
                  <Carousel.Item label="Momentum">
                    <Grid style={{ display: 'grid', gap: 12, alignItems: 'start', justifyItems: 'start' }}>
                      <Badge tone="success">Story beat 2</Badge>
                      <Box style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
                        Pair motion copy with a focused supporting metric
                      </Box>
                      <Box style={hintStyle}>
                        This makes it useful for marketing heroes, gallery highlights, and launch recaps instead of only image rails.
                      </Box>
                    </Grid>
                  </Carousel.Item>
                  <Carousel.Item label="Action">
                    <Grid style={{ display: 'grid', gap: 12, alignItems: 'start', justifyItems: 'start' }}>
                      <Badge tone="warning">Story beat 3</Badge>
                      <Box style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
                        Finish with an action or next step while the attention is warm
                      </Box>
                      <Button recipe="outline" size="sm">
                        Review launch checklist
                      </Button>
                    </Grid>
                  </Carousel.Item>
                </Carousel>
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Collections"
            title="AnimatedList, Marquee, and Dock"
            description="These wrappers animate sequences of items, ticker-style badges, and launcher surfaces without reaching for a larger animation framework."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>AnimatedList</Box>
                <AnimatedList effect="blur-in" animation="snappy" stagger={80} variant="soft" tone="success">
                  <AnimatedList.Item><Badge tone="success">Deploy checks passed</Badge></AnimatedList.Item>
                  <AnimatedList.Item><Badge tone="info">Release notes generated</Badge></AnimatedList.Item>
                  <AnimatedList.Item><Badge tone="warning">Post-launch monitoring enabled</Badge></AnimatedList.Item>
                </AnimatedList>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Marquee</Box>
                <Marquee speed={18} fade gap={16} variant="soft" tone="info" style={{ width: '100%' }}>
                  <Marquee.Item><Badge tone="info">QA cleared</Badge></Marquee.Item>
                  <Marquee.Item><Badge tone="success">Accessibility reviewed</Badge></Marquee.Item>
                  <Marquee.Item><Badge tone="warning">Analytics verified</Badge></Marquee.Item>
                  <Marquee.Item><Badge tone="success">Rollback plan ready</Badge></Marquee.Item>
                </Marquee>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Dock</Box>
                <Dock magnification={1.6} distance={140} variant="surface" tone="brand" labelMode="always">
                  <Dock.Item value="home" label="Home" badge="2">H</Dock.Item>
                  <Dock.Item value="search" label="Search">S</Dock.Item>
                  <Dock.Item value="docs" label="Docs">D</Dock.Item>
                  <Dock.Item value="alerts" label="Alerts" badge="9">A</Dock.Item>
                </Dock>
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Spatial"
            title="IconCloud, Orbiter, and AnimatedBeam"
            description="These are the more visual storytelling wrappers for ecosystem maps, launch heroes, and spatial navigation concepts."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, justifyItems: 'stretch', alignItems: 'start' }}>
                <Box style={{ ...stageStyle, width: '100%' }}>
                  <Box style={eyebrowStyle}>IconCloud</Box>
                  <IconCloud radius={124} perspective={940} speed={1} interactive autoFit pauseOnHover>
                    <IconCloud.Center>Core</IconCloud.Center>
                    <IconCloud.Item clickable aria-label="Search">S</IconCloud.Item>
                    <IconCloud.Item clickable aria-label="Trust">T</IconCloud.Item>
                    <IconCloud.Item clickable aria-label="Metrics">M</IconCloud.Item>
                    <IconCloud.Item clickable aria-label="Alerts">A</IconCloud.Item>
                  </IconCloud>
                </Box>

                <Box style={{ ...stageStyle, width: '100%' }}>
                  <Box style={eyebrowStyle}>Orbiter</Box>
                  <Orbiter orbitRadius={88} itemSize={52} centerSize={88} variant="soft" tone="info" pauseOnHover>
                    <Orbiter.Center>Hub</Orbiter.Center>
                    <Orbiter.Item clickable>AI</Orbiter.Item>
                    <Orbiter.Item clickable>Docs</Orbiter.Item>
                    <Orbiter.Item clickable>Ops</Orbiter.Item>
                  </Orbiter>
                </Box>
              </Grid>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>AnimatedBeam</Box>
                <AnimatedBeam
                  animation="surge"
                  variant="minimal"
                  tone="brand"
                  columns={3}
                  rows={4}
                  minHeight={320}
                  columnGap={160}
                  rowGap={68}
                  nodeSize={72}
                  hubSize={104}
                  path
                  glow
                >
                  <AnimatedBeam.Node nodeId="source" column={1} row={2}>Source</AnimatedBeam.Node>
                  <AnimatedBeam.Hub nodeId="hub" column={2} row={2}>Hub</AnimatedBeam.Hub>
                  <AnimatedBeam.Node nodeId="docs" column={3} row={1}>Docs</AnimatedBeam.Node>
                  <AnimatedBeam.Node nodeId="alerts" column={3} row={2}>Alerts</AnimatedBeam.Node>
                  <AnimatedBeam.Node nodeId="drive" column={3} row={3}>Drive</AnimatedBeam.Node>
                  <AnimatedBeam.Connection from="source" to="hub" curve="straight" />
                  <AnimatedBeam.Connection from="hub" to="docs" curve="arc" />
                  <AnimatedBeam.Connection from="hub" to="alerts" curve="soft" />
                  <AnimatedBeam.Connection from="hub" to="drive" curve="arc" />
                </AnimatedBeam>
                <Box style={hintStyle}>{motionNote}</Box>
              </Box>
            </Grid>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
