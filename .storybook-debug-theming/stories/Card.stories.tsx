import React from 'react';
import type { Meta } from '@storybook/react';
import { Card, Flex, Grid } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  argTypes: {
    variant: { control: { type: 'radio', options: ['surface', 'outline', 'soft', 'solid', 'ghost', 'glass'] } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    radius: { control: 'text' },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
    elevation: { control: { type: 'radio', options: ['none', 'low', 'high'] } },
    interactive: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
};

export default meta;

function InsetArtwork() {
  return (
    <div
      style={{
        aspectRatio: '4 / 2.4',
        background:
          'linear-gradient(135deg, rgba(236,242,255,1) 0%, rgba(248,250,252,1) 38%, rgba(226,232,240,1) 100%)',
        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '14% 18%',
          transform: 'rotate(-12deg)',
          background: '#ffffff',
          borderRadius: 8,
          boxShadow: '0 22px 50px rgba(15, 23, 42, 0.12)',
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          padding: 18,
          gap: 14
        }}
      >
        <div style={{ borderRight: '1px solid rgba(15, 23, 42, 0.08)', paddingRight: 12 }}>
          <div style={{ fontSize: 54, lineHeight: 1, fontWeight: 700, color: '#111827' }}>A</div>
          <div style={{ marginTop: 10, fontSize: 10, lineHeight: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Editorial layout
          </div>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ inlineSize: 110, blockSize: 34, background: '#1f2937', color: '#ffffff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
            FACTURES
          </div>
          <div style={{ fontSize: 11, lineHeight: '16px', color: '#475569' }}>
            Typography is the art and technique of arranging type to make written language legible and expressive.
          </div>
        </div>
      </div>
    </div>
  );
}

export const Playground = {
  args: {
    variant: 'surface',
    size: 'md',
    radius: '4',
    tone: 'neutral',
    elevation: 'low',
    interactive: false,
    disabled: false
  },
  render: (args: Record<string, unknown>) => (
    <Card {...args} style={{ maxInlineSize: 360 }}>
      <Card.Header>
        <Card.Title>Project overview</Card.Title>
        <Card.Description>
          Launch health and release readiness.
        </Card.Description>
      </Card.Header>
      <div style={{ fontSize: 14, lineHeight: '20px', color: '#334155' }}>
        Track migration progress, QA handoff, and final release blockers from one place.
      </div>
      <Card.Footer style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, lineHeight: '18px', color: '#64748b' }}>
        <span>Updated 2m ago</span>
        <span>12 items</span>
      </Card.Footer>
    </Card>
  )
};

export const WithInsetContent = () => (
  <ShowcasePage
    eyebrow="Composition"
    title="With inset content"
    description="Use the inset slot to align media flush with the card edges while keeping the reading content padded."
  >
    <ShowcaseSection title="Inset media" description="Full-bleed artwork and a readable text block can live in the same card without custom wrappers.">
      <Card variant="surface" size="lg" radius={8} style={{ maxInlineSize: 520 }}>
        <Card.Inset>
          <InsetArtwork />
        </Card.Inset>
        <div style={{ display: 'grid', gap: 10 }}>
          <Card.Title as="div">
            Typography is the art and technique of arranging type.
          </Card.Title>
          <div style={{ fontSize: 15, lineHeight: '24px', color: '#334155' }}>
            Use inset sections when imagery, charts, or media should sit flush against the card frame while the rest of the content stays comfortably padded.
          </div>
        </div>
      </Card>
    </ShowcaseSection>
  </ShowcasePage>
);

export const VariantGallery = () => (
  <ShowcasePage eyebrow="Visual language" title="Variant" description="Use the variant prop to control the visual style.">
    <ShowcaseSection title="Card variants" description="Choose a surface that matches the amount of visual weight the layout needs.">
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {[
          ['surface', 'Quick start'],
          ['outline', 'Documentation shell'],
          ['soft', 'Status summary'],
          ['solid', 'Priority insight'],
          ['ghost', 'Canvas section'],
          ['glass', 'Overlay surface']
        ].map(([variant, title]) => (
          <Card key={variant} variant={variant as any} size="md" radius={8} style={{ minBlockSize: 132 }}>
            <Card.Header>
              <div style={{ fontSize: 14, lineHeight: '18px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{variant}</div>
              <Card.Title as="div">{title}</Card.Title>
            </Card.Header>
            <Card.Description as="div">
              Start building your next project in minutes.
            </Card.Description>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const SizeGallery = () => (
  <ShowcasePage eyebrow="Scaling" title="Size" description="Use the size prop to control the padding rhythm of the card.">
    <ShowcaseSection title="Size ramp" description="Size now drives content rhythm too, including media height, title scale, description line height, and footer density.">
      <Flex direction="column" style={{ gap: 18, maxInlineSize: 980 }}>
        {[
          ['sm', 40],
          ['md', 54],
          ['lg', 68]
        ].map(([size, avatar]) => (
          <Card key={size} size={size as any} variant="surface" radius={8} style={{ maxInlineSize: size === 'lg' ? 760 : size === 'md' ? 610 : 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  inlineSize: avatar as number,
                  blockSize: avatar as number,
                  borderRadius: 999,
                  display: 'grid',
                  placeItems: 'center',
                  background: '#e2e8f0',
                  color: '#3358c5',
                  fontSize: (avatar as number) * 0.45,
                  lineHeight: 1
                }}
              >
                T
              </div>
              <div style={{ display: 'grid', gap: 'var(--ui-card-header-gap, 4px)' }}>
                <Card.Title as="div">Teodros Girmay</Card.Title>
                <Card.Description as="div">Engineering</Card.Description>
              </div>
            </div>
            <Card.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{String(size).toUpperCase()} density</span>
              <span>Footer follows size too</span>
            </Card.Footer>
          </Card>
        ))}
      </Flex>
    </ShowcaseSection>
  </ShowcasePage>
);

export const StructuredComposition = () => (
  <ShowcasePage
    eyebrow="Composition"
    title="Structured card composition"
    description="Use the convenience subcomponents to write readable card markup while preserving the same slot contract underneath."
  >
    <ShowcaseSection title="Semantic sections" description="Header, media, inset, title, description, and footer helpers keep the structure clear for developers.">
        <Card variant="soft" tone="info" size="lg" radius={12} style={{ maxInlineSize: 540 }}>
          <Card.Media>
            <div
            style={{
              aspectRatio: '16 / 8',
              background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)',
              display: 'grid',
              placeItems: 'center',
              color: '#1d4ed8',
              fontSize: 42,
              fontWeight: 700
            }}
          >
            Q3
          </div>
        </Card.Media>
        <Card.Header>
          <Card.Title>Quarterly planning workspace</Card.Title>
          <Card.Description style={{ color: '#475569' }}>
            Centralize milestones, owner updates, and launch decisions for the quarter.
          </Card.Description>
        </Card.Header>
        <div style={{ color: '#334155', fontSize: 14, lineHeight: '22px' }}>
          Use the convenience exports when teams want a clear authoring model without remembering slot names for every section.
        </div>
        <Card.Footer style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 13, lineHeight: '18px' }}>
          <span>6 active workstreams</span>
          <span>Updated today</span>
        </Card.Footer>
      </Card>
    </ShowcaseSection>
  </ShowcasePage>
);

export const InteractiveStates = () => (
  <ShowcasePage
    eyebrow="Interaction"
    title="Interactive card states"
    description="Interactive cards now support keyboard focus, activation, and disabled semantics in addition to hover styling."
  >
    <ShowcaseSection
      title="Focus and activation"
      description="Use interactive cards for clickable summary surfaces. They receive button semantics and keyboard activation by default."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Card
          interactive
          variant="surface"
          elevation="low"
          radius={12}
          onClick={() => window.alert('Card activated')}
          style={{ minBlockSize: 152 }}
        >
          <Card.Header>
            <Card.Title>Interactive project summary</Card.Title>
            <Card.Description>Press Enter or Space after focusing the card to activate it.</Card.Description>
          </Card.Header>
          <div style={{ color: '#334155', fontSize: 14, lineHeight: '22px' }}>
            This is the production interaction model for clickable cards.
          </div>
        </Card>

        <Card interactive disabled variant="outline" radius={12} style={{ minBlockSize: 152 }}>
          <Card.Header>
            <Card.Title>Disabled state</Card.Title>
            <Card.Description>The disabled card is not focusable and exposes aria-disabled.</Card.Description>
          </Card.Header>
          <div style={{ color: '#64748b', fontSize: 14, lineHeight: '22px' }}>
            Use disabled when the whole card surface should be unavailable.
          </div>
        </Card>
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const ComposedComponentPattern = () => (
  <ShowcasePage
    eyebrow="Composition"
    title="Composed component pattern"
    description="Card sub-components are available as properties on the Card component, enabling clean and readable markup."
  >
    <ShowcaseSection title="Composed sub-components" description="All Card sub-components are available as properties: Card.Header, Card.Title, Card.Description, Card.Media, Card.Inset, Card.Footer.">
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card variant="soft" size="md" radius={10} style={{ minBlockSize: 200 }}>
          <Card.Header>
            <Card.Title>Project Dashboard</Card.Title>
            <Card.Description>Overview of current project status and metrics.</Card.Description>
          </Card.Header>
          <div style={{ color: '#334155', fontSize: 14, lineHeight: '22px' }}>
            This demonstrates the composed component pattern where all sub-components are accessed as properties of the main Card component.
          </div>
          <Card.Footer style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 13, lineHeight: '18px' }}>
            <span>Updated 5m ago</span>
            <span>4 metrics</span>
          </Card.Footer>
        </Card>

        <Card variant="outline" size="md" radius={10} style={{ minBlockSize: 200 }}>
          <Card.Media>
            <div
              style={{
                aspectRatio: '16 / 9',
                background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
                display: 'grid',
                placeItems: 'center',
                color: '#0369a1',
                fontSize: 24,
                fontWeight: 700
              }}
            >
              MEDIA
            </div>
          </Card.Media>
          <Card.Header>
            <Card.Title>Content Preview</Card.Title>
            <Card.Description>Preview of the media content with structured layout.</Card.Description>
          </Card.Header>
          <Card.Footer style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 13, lineHeight: '18px' }}>
            <span>Preview mode</span>
            <span>Click to view</span>
          </Card.Footer>
        </Card>

        <Card variant="surface" size="md" radius={10} style={{ minBlockSize: 200 }}>
          <Card.Inset>
            <div
              style={{
                padding: 16,
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: 8,
                border: '1px solid rgba(15, 23, 42, 0.08)'
              }}
            >
              <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Inset Content
              </div>
              <div style={{ fontSize: 14, color: '#334155', lineHeight: '20px' }}>
                This content sits flush against the card edges while maintaining proper spacing.
              </div>
            </div>
          </Card.Inset>
          <Card.Header>
            <Card.Title>Inset Example</Card.Title>
            <Card.Description>Demonstrates the inset slot for full-bleed content.</Card.Description>
          </Card.Header>
        </Card>
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);
