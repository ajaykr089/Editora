import React from 'react';
import type { Meta } from '@storybook/react';
import { Card, CardDescription, CardFooter, CardHeader, CardInset, CardMedia, CardTitle, Flex, Grid } from '@editora/ui-react';
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
      <CardHeader>
        <CardTitle>Project overview</CardTitle>
        <CardDescription>
          Launch health and release readiness.
        </CardDescription>
      </CardHeader>
      <div style={{ fontSize: 14, lineHeight: '20px', color: '#334155' }}>
        Track migration progress, QA handoff, and final release blockers from one place.
      </div>
      <CardFooter style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, lineHeight: '18px', color: '#64748b' }}>
        <span>Updated 2m ago</span>
        <span>12 items</span>
      </CardFooter>
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
        <CardInset>
          <InsetArtwork />
        </CardInset>
        <div style={{ display: 'grid', gap: 10 }}>
          <CardTitle as="div">
            Typography is the art and technique of arranging type.
          </CardTitle>
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
            <CardHeader>
              <div style={{ fontSize: 14, lineHeight: '18px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{variant}</div>
              <CardTitle as="div">{title}</CardTitle>
            </CardHeader>
            <CardDescription as="div">
              Start building your next project in minutes.
            </CardDescription>
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
                <CardTitle as="div">Teodros Girmay</CardTitle>
                <CardDescription as="div">Engineering</CardDescription>
              </div>
            </div>
            <CardFooter style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{String(size).toUpperCase()} density</span>
              <span>Footer follows size too</span>
            </CardFooter>
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
          <CardMedia>
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
        </CardMedia>
        <CardHeader>
          <CardTitle>Quarterly planning workspace</CardTitle>
          <CardDescription style={{ color: '#475569' }}>
            Centralize milestones, owner updates, and launch decisions for the quarter.
          </CardDescription>
        </CardHeader>
        <div style={{ color: '#334155', fontSize: 14, lineHeight: '22px' }}>
          Use the convenience exports when teams want a clear authoring model without remembering slot names for every section.
        </div>
        <CardFooter style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 13, lineHeight: '18px' }}>
          <span>6 active workstreams</span>
          <span>Updated today</span>
        </CardFooter>
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
          <CardHeader>
            <CardTitle>Interactive project summary</CardTitle>
            <CardDescription>Press Enter or Space after focusing the card to activate it.</CardDescription>
          </CardHeader>
          <div style={{ color: '#334155', fontSize: 14, lineHeight: '22px' }}>
            This is the production interaction model for clickable cards.
          </div>
        </Card>

        <Card interactive disabled variant="outline" radius={12} style={{ minBlockSize: 152 }}>
          <CardHeader>
            <CardTitle>Disabled state</CardTitle>
            <CardDescription>The disabled card is not focusable and exposes aria-disabled.</CardDescription>
          </CardHeader>
          <div style={{ color: '#64748b', fontSize: 14, lineHeight: '22px' }}>
            Use disabled when the whole card surface should be unavailable.
          </div>
        </Card>
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);
