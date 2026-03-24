import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Button, Card, Flex, MasonryGrid } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

function toDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function sceneImage(
  palette: [string, string, string],
  accent: string,
  label: string,
  motif: 'peak' | 'orb' | 'grid' | 'ribbon' | 'sun' | 'arch'
) {
  const [bg1, bg2, bg3] = palette;
  const motifSvg =
    motif === 'peak'
      ? `<path d="M0 260 L90 170 L160 215 L250 120 L360 240 L360 320 L0 320 Z" fill="${accent}" fill-opacity="0.32" />`
      : motif === 'orb'
        ? `<circle cx="252" cy="108" r="68" fill="${accent}" fill-opacity="0.32" /><circle cx="128" cy="204" r="42" fill="#ffffff" fill-opacity="0.4" />`
        : motif === 'grid'
          ? `<g stroke="${accent}" stroke-opacity="0.22"><path d="M40 52 H320" /><path d="M40 112 H320" /><path d="M40 172 H320" /><path d="M40 232 H320" /><path d="M100 24 V280" /><path d="M180 24 V280" /><path d="M260 24 V280" /></g>`
          : motif === 'ribbon'
            ? `<path d="M-24 210 C50 150, 118 112, 182 142 S312 240, 392 168 L392 320 L-24 320 Z" fill="${accent}" fill-opacity="0.34" />`
            : motif === 'sun'
              ? `<circle cx="270" cy="90" r="56" fill="${accent}" fill-opacity="0.3" /><path d="M40 232 C100 180, 148 184, 218 224 S316 256, 360 224 L360 320 L40 320 Z" fill="#ffffff" fill-opacity="0.3" />`
              : `<path d="M68 260 V122 C68 78 98 46 142 46 H222 C266 46 296 78 296 122 V260" fill="${accent}" fill-opacity="0.24" /><path d="M108 260 V152 C108 122 128 104 158 104 H206 C236 104 256 122 256 152 V260" fill="#ffffff" fill-opacity="0.34" />`;

  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 320">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bg1}" />
          <stop offset="55%" stop-color="${bg2}" />
          <stop offset="100%" stop-color="${bg3}" />
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.72" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="360" height="320" rx="28" fill="url(#bg)" />
      <circle cx="70" cy="62" r="88" fill="url(#glow)" />
      <circle cx="300" cy="258" r="120" fill="${accent}" fill-opacity="0.12" />
      ${motifSvg}
      <rect x="28" y="24" width="120" height="30" rx="15" fill="#ffffff" fill-opacity="0.68" />
      <text x="44" y="44" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#0f172a">${label}</text>
    </svg>
  `);
}

const imageCards = [
  {
    title: 'Campaign performance',
    tone: 'brand' as const,
    body:
      'Blend channel mix, CAC trend, and conversion lift into one narrative card that can breathe vertically without forcing the rest of the layout into rigid rows.',
    stat: '+18.4%',
    minHeight: 420,
    imageHeight: 224,
    image: sceneImage(['#dbeafe', '#bfdbfe', '#c4b5fd'], '#2563eb', 'Atlas', 'peak')
  },
  {
    title: 'Editorial queue',
    tone: 'info' as const,
    body:
      'Surface quick summaries, owner notes, and due dates in denser cards so the board feels packed instead of row-locked.',
    stat: '24 items',
    minHeight: 372,
    imageHeight: 176,
    image: sceneImage(['#cffafe', '#a5f3fc', '#bfdbfe'], '#0891b2', 'Queue', 'grid')
  },
  {
    title: 'Research digest',
    tone: 'success' as const,
    body:
      'Long-form findings can expand naturally here. That is the main value of this primitive: heterogeneous card heights without leaving visible dead space.',
    stat: '7 sources',
    minHeight: 468,
    imageHeight: 250,
    image: sceneImage(['#dcfce7', '#bbf7d0', '#d9f99d'], '#16a34a', 'Fieldbook', 'sun')
  },
  {
    title: 'Release checklist',
    tone: 'warning' as const,
    body:
      'QA sign-off, analytics verification, rollout gates, and incident owner handoff all fit comfortably inside one compact column item.',
    stat: '5 blockers',
    minHeight: 396,
    imageHeight: 198,
    image: sceneImage(['#fef3c7', '#fde68a', '#fdba74'], '#d97706', 'Launch', 'ribbon')
  },
  {
    title: 'Customer notes',
    tone: 'neutral' as const,
    body:
      'Pair short excerpts, sentiment tags, and follow-up actions to create a feed that reads like a working wall of evidence.',
    stat: '13 threads',
    minHeight: 430,
    imageHeight: 216,
    image: sceneImage(['#e2e8f0', '#cbd5e1', '#bfdbfe'], '#475569', 'Signals', 'arch')
  },
  {
    title: 'Launch brief',
    tone: 'danger' as const,
    body:
      'High-priority cards can be taller, richer, and still snap into the same composition without forcing neighboring items to grow.',
    stat: 'Tomorrow',
    minHeight: 486,
    imageHeight: 264,
    image: sceneImage(['#fee2e2', '#fecaca', '#fbcfe8'], '#dc2626', 'Priority', 'orb')
  }
];

const meta: Meta<typeof MasonryGrid> = {
  title: 'UI/MasonryGrid',
  component: MasonryGrid,
  args: {
    columns: { initial: 1, md: 2, lg: 3 },
    gap: 'lg',
    fill: 'balance'
  },
  argTypes: {
    columns: { control: 'object' },
    columnWidth: { control: 'text' },
    gap: { control: 'text' },
    columnGap: { control: 'text' },
    itemGap: { control: 'text' },
    fill: { control: 'select', options: ['auto', 'balance', 'balance-all'] },
    display: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'MasonryGrid uses CSS multi-column layout to pack uneven-height cards. It is ideal for gallery and dashboard walls, but visual scan order follows columns rather than row-based grid placement.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderPlayground(args: React.ComponentProps<typeof MasonryGrid>) {
  return (
    <Box
      style={{
        maxInlineSize: 1120,
        padding: 28,
        borderRadius: 28,
        background:
          'radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 30%), radial-gradient(circle at bottom right, rgba(244, 114, 182, 0.12), transparent 34%), linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)',
        border: '1px solid rgba(148, 163, 184, 0.18)',
        boxShadow: '0 28px 80px rgba(15, 23, 42, 0.1)'
      }}
    >
      <Flex direction="column" gap="16px">
        <Flex wrap="wrap" gap="8px">
          <Badge variant="soft" tone="brand">Packed layout</Badge>
          <Badge variant="soft" tone="info">Uneven card heights</Badge>
          <Badge variant="soft" tone="success">Responsive columns</Badge>
        </Flex>

        <Box style={{ display: 'grid', gap: 10, maxInlineSize: 760 }}>
          <Box style={{ fontSize: 34, lineHeight: 1.05, fontWeight: 780, color: '#0f172a' }}>
            Build editorial walls and dashboard feeds without the dead air of fixed rows.
          </Box>
          <Box style={{ fontSize: 15, lineHeight: '24px', color: '#475569' }}>
            This story uses cards with intentionally uneven heights so the balancing behavior is easy to inspect at each breakpoint.
          </Box>
        </Box>

        <MasonryGrid {...args}>
          {imageCards.map((card) => (
            <Card
              key={card.title}
              style={{
                minHeight: card.minHeight,
                padding: 14,
                borderRadius: 26,
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(148, 163, 184, 0.16)',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
                overflow: 'hidden'
              }}
            >
              <Flex direction="column" gap="14px" style={{ minHeight: '100%' }}>
                <img
                  style={{
                    display: 'block',
                    width: '100%',
                    height: card.imageHeight,
                    objectFit: 'cover',
                    borderRadius: 18,
                    border: '1px solid rgba(148, 163, 184, 0.14)'
                  }}
                  src={card.image}
                  alt={card.title}
                />
                <Flex direction="column" gap="12px" style={{ padding: '2px 6px 6px' }}>
                  <Flex align="center" justify="space-between" gap="12px">
                    <Badge variant="soft" tone={card.tone}>{card.stat}</Badge>
                    <Box style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
                      Live module
                    </Box>
                  </Flex>
                  <Box style={{ fontSize: 20, lineHeight: 1.1, fontWeight: 720, color: '#0f172a' }}>
                    {card.title}
                  </Box>
                  <Box style={{ fontSize: 14, lineHeight: '22px', color: '#475569' }}>
                    {card.body}
                  </Box>
                  <Box style={{ marginTop: 'auto', paddingTop: 10 }}>
                    <Button variant="secondary">Open panel</Button>
                  </Box>
                </Flex>
              </Flex>
            </Card>
          ))}
        </MasonryGrid>
      </Flex>
    </Box>
  );
}

export const Playground: Story = {
  render: renderPlayground
};

export const EditorialWall = () => (
  <ShowcasePage
    eyebrow="Layout primitive"
    title="Use masonry when the content should feel collected, not regimented"
    description="The strongest MasonryGrid compositions mix short utility cards with a few deeper narrative cards. That creates rhythm without requiring a scripted, row-locked template."
  >
    <ShowcaseSection
      title="A research wall that can absorb cards of very different heights"
      description="Keep the reading order in DOM order, but let the visual packing optimize the wall density."
    >
      {renderPlayground({
        columns: { initial: 1, md: 2, lg: 3 },
        gap: 'lg',
        fill: 'balance'
      })}
    </ShowcaseSection>
  </ShowcasePage>
);

export const UnevenHeightCards = () => (
  <ShowcasePage
    eyebrow="Use case 1"
    title="Uneven-height cards"
    description="Use MasonryGrid when cards should keep their natural height instead of stretching into a rigid row system."
  >
    <ShowcaseSection
      title="Editorial and research cards"
      description="Long notes, short summaries, and medium-detail cards can coexist without leaving row gaps."
    >
      {renderPlayground({
        columns: { initial: 1, md: 2, lg: 3 },
        gap: 'lg',
        fill: 'balance'
      })}
    </ShowcaseSection>
  </ShowcasePage>
);

export const GalleryStyleLayouts = () => (
  <ShowcasePage
    eyebrow="Use case 2"
    title="Gallery-style layouts"
    description="MasonryGrid works well for poster walls, media collections, and image-first discovery surfaces."
  >
    <ShowcaseSection
      title="Visual gallery"
      description="This setup leans into fixed column width so each tile feels like a gallery card rather than a dashboard module."
    >
      <MasonryGrid columnWidth="220px" gap="md" fill="balance">
        {[
          ['Aurora archive', 180, sceneImage(['#dbeafe', '#bfdbfe', '#c4b5fd'], '#2563eb', 'Archive', 'peak')],
          ['Field notes', 300, sceneImage(['#fef3c7', '#fde68a', '#fdba74'], '#d97706', 'Field', 'sun')],
          ['Moodboard', 220, sceneImage(['#dcfce7', '#bbf7d0', '#d9f99d'], '#16a34a', 'Mood', 'arch')],
          ['Concept stills', 340, sceneImage(['#fbcfe8', '#f9a8d4', '#fecdd3'], '#db2777', 'Studio', 'orb')],
          ['Campaign selects', 260, sceneImage(['#e9d5ff', '#ddd6fe', '#bfdbfe'], '#7c3aed', 'Selects', 'ribbon')],
          ['Archive scan', 190, sceneImage(['#fde2e2', '#fecaca', '#ffe4e6'], '#dc2626', 'Scan', 'grid')]
        ].map(([label, height, image]) => (
          <Card
            key={String(label)}
            style={{
              minHeight: Number(height),
              padding: 12,
              borderRadius: 24,
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
              overflow: 'hidden'
            }}
          >
            <Flex direction="column" gap="12px" style={{ minHeight: '100%' }}>
              <img
                src={String(image)}
                alt={String(label)}
                style={{ display: 'block', width: '100%', height: Number(height) - 64, objectFit: 'cover', borderRadius: 18 }}
              />
              <Flex align="center" justify="space-between" style={{ padding: '0 6px 6px' }}>
                <Badge variant="soft" tone="neutral">Gallery tile</Badge>
                <Box style={{ fontSize: 18, fontWeight: 720, color: '#0f172a' }}>{label}</Box>
              </Flex>
            </Flex>
          </Card>
        ))}
      </MasonryGrid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const DashboardContentWalls = () => (
  <ShowcasePage
    eyebrow="Use case 3"
    title="Dashboard and content walls"
    description="Use MasonryGrid for mixed operational cards where density matters more than exact row alignment."
  >
    <ShowcaseSection
      title="Operational wall"
      description="Metrics, queues, narrative summaries, and alerts can stack into a packed command surface."
    >
      <MasonryGrid columns={{ initial: 1, md: 2, xl: 4 }} gap="lg" fill="balance">
        <Card style={{ padding: 14, minHeight: 280, borderRadius: 24, overflow: 'hidden' }}>
          <Flex direction="column" gap="12px">
            <img src={sceneImage(['#dbeafe', '#bfdbfe', '#c4b5fd'], '#2563eb', 'Revenue', 'peak')} alt="Revenue overview" style={{ width: '100%', height: 132, objectFit: 'cover', borderRadius: 16 }} />
            <Badge variant="soft" tone="brand">Revenue</Badge>
            <Box style={{ fontSize: 28, fontWeight: 760, color: '#0f172a' }}>$128K</Box>
            <Box style={{ color: '#475569' }}>Month-to-date performance is ahead of plan.</Box>
          </Flex>
        </Card>
        <Card style={{ padding: 14, minHeight: 352, borderRadius: 24, overflow: 'hidden' }}>
          <Flex direction="column" gap="12px">
            <img src={sceneImage(['#cffafe', '#a5f3fc', '#bfdbfe'], '#0891b2', 'Activity', 'grid')} alt="Activity feed" style={{ width: '100%', height: 176, objectFit: 'cover', borderRadius: 16 }} />
            <Badge variant="soft" tone="info">Activity feed</Badge>
            <Box style={{ color: '#475569' }}>Editorial review, asset sync, analytics refresh, and approval state all live in one taller feed card.</Box>
          </Flex>
        </Card>
        <Card style={{ padding: 14, minHeight: 300, borderRadius: 24, overflow: 'hidden' }}>
          <Flex direction="column" gap="12px">
            <img src={sceneImage(['#fef3c7', '#fde68a', '#fdba74'], '#d97706', 'Approvals', 'ribbon')} alt="Approvals overview" style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 16 }} />
            <Badge variant="soft" tone="warning">Approvals</Badge>
            <Box style={{ fontSize: 28, fontWeight: 760, color: '#0f172a' }}>12 live</Box>
            <Box style={{ color: '#475569' }}>Pending legal and partner sign-off.</Box>
          </Flex>
        </Card>
        <Card style={{ padding: 14, minHeight: 400, borderRadius: 24, overflow: 'hidden' }}>
          <Flex direction="column" gap="12px">
            <img src={sceneImage(['#dcfce7', '#bbf7d0', '#d9f99d'], '#16a34a', 'Summary', 'sun')} alt="Narrative summary" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 16 }} />
            <Badge variant="soft" tone="success">Narrative summary</Badge>
            <Box style={{ color: '#475569' }}>Longer written analysis can take a taller slot without forcing its neighboring cards to match height.</Box>
          </Flex>
        </Card>
      </MasonryGrid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const VisuallyPackedColumns = () => (
  <ShowcasePage
    eyebrow="Use case 4"
    title="Visually packed columns"
    description="This is the classic masonry feel: lots of items, varying heights, and a strong sense of continuous vertical flow."
  >
    <ShowcaseSection
      title="Dense column rhythm"
      description="Use explicit `columns`, `columnGap`, and `itemGap` when you want a sharper packed-column aesthetic."
    >
      <MasonryGrid columns={4} columnGap="md" itemGap="md" fill="balance">
        {Array.from({ length: 12 }).map((_, index) => (
          <Card
            key={index}
            style={{
              padding: 10,
              minHeight: 220 + (index % 4) * 44,
              borderRadius: 22,
              background: 'rgba(255,255,255,0.88)',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              overflow: 'hidden'
            }}
          >
            <Flex direction="column" gap="10px">
              <img
                src={sceneImage(
                  index % 4 === 0
                    ? ['#dbeafe', '#bfdbfe', '#c4b5fd']
                    : index % 4 === 1
                      ? ['#dcfce7', '#bbf7d0', '#d9f99d']
                      : index % 4 === 2
                        ? ['#fef3c7', '#fde68a', '#fdba74']
                        : ['#fbcfe8', '#f9a8d4', '#fecdd3'],
                  index % 4 === 0 ? '#2563eb' : index % 4 === 1 ? '#16a34a' : index % 4 === 2 ? '#d97706' : '#db2777',
                  `Item ${index + 1}`,
                  index % 4 === 0 ? 'peak' : index % 4 === 1 ? 'arch' : index % 4 === 2 ? 'sun' : 'orb'
                )}
                alt={`Packed item ${index + 1}`}
                style={{ width: '100%', height: 120 + (index % 4) * 28, objectFit: 'cover', borderRadius: 16 }}
              />
              <Flex direction="column" gap="8px" style={{ padding: '0 6px 6px' }}>
                <Badge variant="soft" tone="neutral">Column {Math.floor(index / 4) + 1}</Badge>
                <Box style={{ fontSize: 18, fontWeight: 720, color: '#0f172a' }}>Packed item {index + 1}</Box>
                <Box style={{ color: '#475569' }}>A compact wall of mixed-height content keeps the eye moving down the columns.</Box>
              </Flex>
            </Flex>
          </Card>
        ))}
      </MasonryGrid>
    </ShowcaseSection>
  </ShowcasePage>
);
