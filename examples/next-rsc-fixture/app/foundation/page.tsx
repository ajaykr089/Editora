'use client';

import React from 'react';
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Anchor,
  AspectRatio,
  Avatar,
  Badge,
  Box,
  Button,
  DirectionProvider,
  EmptyState,
  Flex,
  Grid,
  Icon,
  Separator,
  Skeleton,
  VisuallyHidden,
} from '@editora/ui-react/client';
import { ShowcaseCard, ShowcaseShell, eyebrowStyle, hintStyle, stageStyle } from '../showcase/shared';

export default function FoundationPage() {
  const [alertOpen, setAlertOpen] = React.useState(true);

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/foundation"
        eyebrow="Foundation"
        title="Layout, feedback, and presentation primitives"
        description="This route focuses on the smaller client-safe building blocks that shape the rest of the fixture: layout wrappers, avatars, alerts, badges, media frames, separators, and loading states."
      >
        <Grid
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 18,
            justifyItems: 'stretch',
            alignItems: 'start',
          }}
        >
          <ShowcaseCard
            eyebrow="Layout"
            title="Containers, boxes, flex, and grid"
            description="These primitives are intentionally visible here so you can confirm the client barrel hydrates the structural wrappers cleanly."
          >
            <Box style={{ ...stageStyle, gap: 18 }}>
              <Flex style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <Grid style={{ display: 'grid', gap: 8 }}>
                  <Box style={eyebrowStyle}>Client primitives</Box>
                  <Box style={{ fontSize: 18, fontWeight: 800 }}>Foundation route</Box>
                  <Box style={hintStyle}>A focused page so the old 853-line single-page demo no longer has to carry everything at once.</Box>
                </Grid>
                <Avatar alt="Foundation Page" initials="FP" status="online" badge="F" ring />
              </Flex>

              <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Badge tone="info">Badge</Badge>
                <Badge tone="success">Client-safe</Badge>
                <Badge tone="warning">Split route</Badge>
              </Flex>

              <Grid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, justifyItems: 'stretch', alignItems: 'start' }}>
                <Box style={{ ...stageStyle, padding: 14 }}>
                  <Box style={eyebrowStyle}>Anchor</Box>
                  <Anchor href="/forms" style={{ color: '#2563eb', fontWeight: 700 }}>
                    Go to forms demos
                  </Anchor>
                </Box>
                <Box style={{ ...stageStyle, padding: 14 }}>
                  <Box style={eyebrowStyle}>Button + Icon</Box>
                  <Button recipe="outline">
                    <Icon name="sparkles" decorative />
                    Trigger UI
                  </Button>
                </Box>
              </Grid>
            </Box>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Visual"
            title="Avatar, aspect ratio, and loading skeletons"
            description="A visual surface for the media-adjacent wrappers that are easiest to inspect at a glance."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <Avatar alt="Nadia Rivers" initials="NR" tone="info" badge="P" />
                <Avatar alt="Ava Stone" initials="AS" tone="success" status="online" />
                <Avatar alt="Kai Metrics" initials="KM" tone="warning" status="busy" />
              </Flex>

              <AspectRatio ratio={16 / 9} style={{ borderRadius: 16, overflow: 'hidden' }}>
                <Box
                  style={{
                    height: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(14, 165, 233, 0.22), rgba(255, 255, 255, 0.94))',
                    color: '#0f172a',
                    fontWeight: 800,
                  }}
                >
                  AspectRatio demo frame
                </Box>
              </AspectRatio>

              <Box style={{ ...stageStyle, gap: 8 }}>
                <Box style={eyebrowStyle}>Animated skeleton</Box>
                <Skeleton animated animation="wave" tone="brand" width="100%" height="12px" />
                <Skeleton animated animation="wave" tone="brand" width="82%" height="12px" />
                <Skeleton animated animation="wave" tone="brand" width="56%" height="12px" />
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Feedback"
            title="Alert composition and empty state"
            description="This card demonstrates the composed alert API and the empty-state wrapper in the same route."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              {alertOpen ? (
                <Alert tone="info" variant="soft" dismissible onClose={() => setAlertOpen(false)}>
                  <AlertIcon>
                    <Icon name="sparkles" decorative />
                  </AlertIcon>
                  <AlertTitle>Foundation wrappers are mounted</AlertTitle>
                  <AlertDescription>
                    This composed alert uses `Alert`, `AlertIcon`, `AlertTitle`, `AlertDescription`, and `AlertActions`.
                  </AlertDescription>
                  <AlertActions>
                    <Button recipe="outline" size="sm" onClick={() => setAlertOpen(false)}>
                      Dismiss
                    </Button>
                  </AlertActions>
                </Alert>
              ) : (
                <Button onClick={() => setAlertOpen(true)}>Reopen alert</Button>
              )}

              <Separator />

              <EmptyState
                title="No active issues"
                description="The foundation route uses EmptyState as a visible destination instead of a hidden placeholder."
                actionLabel="Open selection demos"
                onAction={() => {
                  window.location.href = '/selection';
                }}
              />

              <VisuallyHidden>Foundation page demonstrates visually hidden content too.</VisuallyHidden>
            </Grid>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
