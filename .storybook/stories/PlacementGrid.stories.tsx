import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Button, Card, Flex, PlacementGrid } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

const shellStyle: React.CSSProperties = {
  display: 'grid',
  gap: 20,
  padding: 28,
  borderRadius: 30,
  background:
    'radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 34%), linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)',
  border: '1px solid rgba(148, 163, 184, 0.22)',
  boxShadow: '0 24px 72px rgba(15, 23, 42, 0.12)'
};

const cardStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: 'rgba(255,255,255,0.88)',
  border: '1px solid rgba(148, 163, 184, 0.16)',
  boxShadow: '0 14px 36px rgba(15, 23, 42, 0.08)'
};

function Tile({
  title,
  body,
  stat,
  tone = 'brand'
}: {
  title: string;
  body: string;
  stat: string;
  tone?: 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'neutral';
}) {
  return (
    <Card style={cardStyle}>
      <Flex direction="column" gap="10px">
        <Flex align="center" justify="space-between" gap="8px">
          <Badge variant="soft" tone={tone}>{stat}</Badge>
          <Box style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
            Grid item
          </Box>
        </Flex>
        <Box style={{ fontSize: 20, lineHeight: 1.08, fontWeight: 750, color: '#0f172a' }}>{title}</Box>
        <Box style={{ fontSize: 14, lineHeight: '22px', color: '#475569' }}>{body}</Box>
      </Flex>
    </Card>
  );
}

const meta: Meta<typeof PlacementGrid> = {
  title: 'UI/PlacementGrid',
  component: PlacementGrid,
  args: {
    columns: 'repeat(4, minmax(0, 1fr))',
    autoRows: 'minmax(140px, auto)',
    gap: 'lg',
    order: 'row-major'
  },
  argTypes: {
    columns: { control: 'text' },
    rows: { control: 'text' },
    gap: { control: 'text' },
    rowGap: { control: 'text' },
    columnGap: { control: 'text' },
    autoRows: { control: 'text' },
    autoFlow: { control: 'text' },
    order: { control: 'select', options: ['dom', 'row-major'] },
    interactive: { control: 'boolean' },
    draggable: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'PlacementGrid is for exact, row-aware layouts: explicit placement, row-major ordering, keyboard navigation, and draggable swapping when the visual structure must stay semantically aligned.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Box style={{ maxInlineSize: 1160 }}>
      <div style={shellStyle}>
        <Flex wrap="wrap" gap="8px">
          <Badge variant="soft" tone="brand">Explicit placement</Badge>
          <Badge variant="soft" tone="info">Row-major order</Badge>
          <Badge variant="soft" tone="success">Interactive grid</Badge>
        </Flex>

        <PlacementGrid {...args}>
          <PlacementGrid.Item row={1} column={1} columnSpan={2}>
            <Tile title="Primary narrative" stat="Hero" body="Lead with a wide card without sacrificing a true row-ordered DOM structure." />
          </PlacementGrid.Item>
          <PlacementGrid.Item row={1} column={3}>
            <Tile title="Approvals" stat="12 live" body="Small action modules can lock to exact cells." tone="info" />
          </PlacementGrid.Item>
          <PlacementGrid.Item row={1} column={4}>
            <Tile title="Signals" stat="4 alerts" body="Use semantic rows when attention order matters." tone="warning" />
          </PlacementGrid.Item>
          <PlacementGrid.Item row={2} column={1}>
            <Tile title="Content queue" stat="24 drafts" body="Keep operational cards compact and predictable." tone="success" />
          </PlacementGrid.Item>
          <PlacementGrid.Item row={2} column={2} columnSpan={2}>
            <Tile title="Roadmap" stat="Q3" body="Span multiple columns for timeline, planner, or release sequencing cards." tone="neutral" />
          </PlacementGrid.Item>
          <PlacementGrid.Item row={2} column={4}>
            <Tile title="Launch panel" stat="Tomorrow" body="Exact placement is useful when motion and hierarchy must stay stable." tone="danger" />
          </PlacementGrid.Item>
        </PlacementGrid>
      </div>
    </Box>
  )
};

export const StrictRowByRowReadingOrder = () => (
  <ShowcasePage
    eyebrow="Use case 1"
    title="Strict row-by-row reading order"
    description="This pattern keeps the DOM order aligned to the visual grid so screen reader and keyboard progression stay predictable."
  >
    <ShowcaseSection
      title="Operations summary"
      description="Each item is explicitly positioned and the grid is set to row-major ordering."
    >
      <PlacementGrid columns="repeat(3, minmax(0, 1fr))" autoRows="minmax(150px, auto)" gap="lg" order="row-major">
        <PlacementGrid.Item row={1} column={1}><Tile title="Row 1, col 1" stat="1A" body="The first item is both visually and semantically first." /></PlacementGrid.Item>
        <PlacementGrid.Item row={1} column={2}><Tile title="Row 1, col 2" stat="1B" body="Use this for highly structured summary dashboards." tone="info" /></PlacementGrid.Item>
        <PlacementGrid.Item row={1} column={3}><Tile title="Row 1, col 3" stat="1C" body="Row progression remains consistent for assistive tech." tone="success" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={1}><Tile title="Row 2, col 1" stat="2A" body="Second-row cards come after the full first row." tone="warning" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={2} columnSpan={2}><Tile title="Row 2 span 2-3" stat="2B" body="Spans still respect row-major ordering." tone="neutral" /></PlacementGrid.Item>
      </PlacementGrid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const HighlyInteractiveGridSemantics = () => (
  <ShowcasePage
    eyebrow="Use case 2"
    title="Highly interactive grid semantics"
    description="Use arrow-key navigation across an actual semantic grid when the layout is closer to a planner or control surface than a passive content wall."
  >
    <ShowcaseSection
      title="Keyboard-first planner"
      description="Try arrow keys between cards. The grid exposes row and column indices for assistive technologies."
    >
      <PlacementGrid columns="repeat(3, minmax(0, 1fr))" autoRows="minmax(140px, auto)" gap="lg" interactive order="row-major">
        <PlacementGrid.Item row={1} column={1}><Tile title="Brief" stat="1" body="Focus starts here and moves with arrow keys." /></PlacementGrid.Item>
        <PlacementGrid.Item row={1} column={2}><Tile title="Legal" stat="2" body="The interaction model is grid-aware, not just tab-order aware." tone="info" /></PlacementGrid.Item>
        <PlacementGrid.Item row={1} column={3}><Tile title="QA" stat="3" body="Useful for dense editorial or ops workflows." tone="success" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={1}><Tile title="SEO" stat="4" body="Keep the surface spatially meaningful." tone="warning" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={2}><Tile title="Docs" stat="5" body="Gridcell semantics help when cards behave like a matrix." tone="neutral" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={3}><Tile title="Release" stat="6" body="Use Home and End to jump across the ordered surface." tone="danger" /></PlacementGrid.Item>
      </PlacementGrid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const PreciseItemPlacementLogic = () => (
  <ShowcasePage
    eyebrow="Use case 3"
    title="Precise item placement logic"
    description="This is the right primitive when item spans and exact cell coordinates matter more than automatic packing."
  >
    <ShowcaseSection
      title="Product launch command center"
      description="Wide cards, tall side rails, and exact placements stay stable across refreshes."
    >
      <PlacementGrid columns="repeat(4, minmax(0, 1fr))" autoRows="minmax(110px, auto)" gap="lg" order="row-major">
        <PlacementGrid.Item row={1} column={1} columnSpan={3}><Tile title="Launch timeline" stat="Pinned" body="Reserve a three-column region for the primary planning surface." /></PlacementGrid.Item>
        <PlacementGrid.Item row={1} column={4} rowSpan={2}><Tile title="Risk rail" stat="2 open" body="A tall side rail can occupy a fixed vertical strip." tone="warning" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={1}><Tile title="Content" stat="Ready" body="Exact cells make it easier to coordinate team handoffs." tone="success" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={2}><Tile title="Stakeholders" stat="7" body="No browser-driven packing surprises." tone="info" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={3}><Tile title="Analytics" stat="Live" body="Use spans only where they add meaning." tone="neutral" /></PlacementGrid.Item>
      </PlacementGrid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const DragAndDropBoardsWithExactPositioning = () => (
  <ShowcasePage
    eyebrow="Use case 4"
    title="Drag-and-drop boards with exact positioning"
    description="Drag one card onto another to swap their explicit coordinates. Alt plus arrow keys also move the focused card cell by cell."
  >
    <ShowcaseSection
      title="Triage board"
      description="This keeps the board spatially stable while still letting operators reposition cards."
    >
      <PlacementGrid columns="repeat(3, minmax(0, 1fr))" autoRows="minmax(150px, auto)" gap="lg" interactive draggable order="row-major">
        <PlacementGrid.Item row={1} column={1} value="incident"><Tile title="Incident" stat="P1" body="Drag onto another card to swap positions." tone="danger" /></PlacementGrid.Item>
        <PlacementGrid.Item row={1} column={2} value="review"><Tile title="Review" stat="Pending" body="Keyboard move with Alt plus Arrow keys." tone="warning" /></PlacementGrid.Item>
        <PlacementGrid.Item row={1} column={3} value="handoff"><Tile title="Handoff" stat="Ready" body="Exact cells remain visible and controllable." tone="info" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={1} value="retrospective"><Tile title="Retro" stat="Queued" body="Useful for triage and planning surfaces." tone="neutral" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={2} value="comms"><Tile title="Comms" stat="Draft" body="Movement updates the explicit row and column." tone="brand" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={3} value="verification"><Tile title="Verify" stat="Green" body="A better fit than masonry when operators need certainty." tone="success" /></PlacementGrid.Item>
      </PlacementGrid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const AccessibleLayoutsWhereVisualOrderMustMatchRowOrder = () => (
  <ShowcasePage
    eyebrow="Use case 5"
    title="Layouts where accessibility depends on row order matching visual order"
    description="This configuration is for regulated, operational, or assistive-tech-sensitive surfaces where the spoken order needs to mirror the sighted order."
  >
    <ShowcaseSection
      title="Assistive-tech-safe planning board"
      description="Row-major ordering, semantic indices, and exact placement work together here."
    >
      <PlacementGrid columns="repeat(2, minmax(0, 1fr))" autoRows="minmax(160px, auto)" gap="lg" interactive order="row-major">
        <PlacementGrid.Item row={1} column={1}><Tile title="Preparation" stat="Step 1" body="Assistive technologies encounter this tile first, exactly as sighted users do." /></PlacementGrid.Item>
        <PlacementGrid.Item row={1} column={2}><Tile title="Validation" stat="Step 2" body="The row-first order remains intact." tone="info" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={1}><Tile title="Approval" stat="Step 3" body="Choose this pattern when order is contractual or procedural." tone="success" /></PlacementGrid.Item>
        <PlacementGrid.Item row={2} column={2}><Tile title="Publish" stat="Step 4" body="This is the key place where PlacementGrid beats MasonryGrid." tone="warning" /></PlacementGrid.Item>
      </PlacementGrid>
    </ShowcaseSection>
  </ShowcasePage>
);
