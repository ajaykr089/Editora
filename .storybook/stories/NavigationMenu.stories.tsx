import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu, ThemeProvider } from '@editora/ui-react';
import { createThemeTokens, type AccentPaletteName } from '@editora/ui-core';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseBodyStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcaseMonoStyle,
  showcasePanelStyle
} from './storybook-showcase';

const meta: Meta<typeof NavigationMenu> = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  args: {
    orientation: 'horizontal',
    activation: 'automatic',
    variant: 'surface',
    size: 'md',
    radius: 12,
    elevation: 'low',
    tone: 'default',
    loop: true,
    collapsible: false,
  },
  argTypes: {
    selected: { control: 'number' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    activation: { control: 'select', options: ['automatic', 'manual'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'flat', 'contrast'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'neutral', 'info', 'success', 'warning', 'danger'] },
    loop: { control: 'boolean' },
    collapsible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

function paletteTokens(name: AccentPaletteName) {
  return createThemeTokens({}, { accentPalette: name, mode: 'light' });
}

const heroCanvasStyle: React.CSSProperties = {
  position: 'relative',
  display: 'grid',
  alignItems: 'start',
  justifyItems: 'center',
  minHeight: 780,
  padding: '40px 20px 120px',
  borderRadius: 28,
  overflow: 'hidden',
  background: 'linear-gradient(120deg, #4361d9 0%, #6165dc 38%, #8756cf 100%)'
};

const heroGlowStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 'auto 10% 12% 10%',
  height: 220,
  borderRadius: 999,
  background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 68%)',
  filter: 'blur(20px)',
  pointerEvents: 'none'
};

const codeWindowStyle: React.CSSProperties = {
  position: 'absolute',
  left: 20,
  right: 20,
  bottom: 20,
  height: 380,
  borderRadius: 22,
  overflow: 'hidden',
  border: '1px solid rgba(15, 23, 42, 0.14)',
  background: '#f8f7fb',
  boxShadow: '0 22px 70px rgba(15, 23, 42, 0.18)'
};

const codeTabsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 28,
  alignItems: 'center',
  height: 54,
  padding: '0 20px',
  borderBottom: '1px solid rgba(148, 163, 184, 0.22)',
  background: 'rgba(255,255,255,0.86)'
};

const codeTabStyle: React.CSSProperties = {
  fontSize: 13,
  lineHeight: '20px',
  fontWeight: 600,
  color: '#475569'
};

const codeBodyStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '280px minmax(0, 1fr)',
  height: 'calc(100% - 54px)'
};

const codeSidebarStyle: React.CSSProperties = {
  borderRight: '1px solid rgba(148, 163, 184, 0.18)',
  background: 'rgba(255,255,255,0.72)'
};

const codePanelStyle: React.CSSProperties = {
  padding: '26px 34px',
  fontSize: 16,
  lineHeight: 1.55,
  background: 'rgba(255,255,255,0.84)'
};

const codeLineStyle: React.CSSProperties = {
  margin: 0,
  color: '#334155'
};

const panelGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.02fr 1fr',
  gap: 18
};

const leadCardStyle: React.CSSProperties = {
  display: 'grid',
  alignContent: 'end',
  minHeight: 100,
  padding: 28,
  borderRadius: 18,
  color: '#ffffff',
  background: 'linear-gradient(145deg, #9551d2 0%, #5d64da 55%, #4b67e1 100%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)'
};

const stackCardStyle: React.CSSProperties = {
  ...showcasePanelStyle,
  gap: 10,
  minHeight: 176,
  background: 'rgba(240, 235, 244, 0.94)',
  border: '1px solid rgba(192, 186, 206, 0.42)'
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.15,
  fontWeight: 700,
  color: '#1f2937'
};

const sectionBodyStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  lineHeight: 1.45,
  color: '#6b7280'
};

const galleryFrameStyle: React.CSSProperties = {
  position: 'relative',
  display: 'grid',
  justifyItems: 'center',
  alignItems: 'start',
  minHeight: 520,
  padding: '28px 20px 360px',
  borderRadius: 24,
  border: '1px solid rgba(148, 163, 184, 0.18)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,247,251,0.98) 100%)',
  boxSizing: 'border-box',
  overflow: 'visible'
};

const compactGalleryFrameStyle: React.CSSProperties = {
  ...galleryFrameStyle,
  minHeight: 480,
  paddingBottom: 320
};

function ReferenceNavigation(props: React.ComponentProps<typeof NavigationMenu>) {
  return (
    <NavigationMenu.Root {...props} style={{ width: '100%', maxWidth: 1180 }}>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Learn</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div style={panelGridStyle}>
              <div style={leadCardStyle}>
                 <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>
                    Unstyled, accessible components for React and design-system teams.
                  </p>
              </div>
              <div style={{ display: 'grid', gap: 18 }}>
                <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '1fr 1fr' }}>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Getting started</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>A quick tutorial to get you up and running.</p>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Accessibility</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Tested in a range of browsers and assistive technologies.</p>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Styling</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Unstyled and compatible with any styling solution.</p>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Releases</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Track updates and ship consistent foundations.</p>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Overview</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div style={panelGridStyle}>
              <div style={leadCardStyle}>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ fontSize: 64, lineHeight: 1, fontWeight: 700 }}>✦</div>
                  <div style={{ fontSize: 54, lineHeight: 0.98, fontWeight: 700, letterSpacing: '-0.03em' }}>
                    Platform
                    <br />
                    Overview
                  </div>
                  <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>
                    Core packages, token system, and implementation guides for product teams.
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 18 }}>
                <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '1fr' }}>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Colors</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Beautiful, thought-out palettes with auto dark mode.</p>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Icons</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>A crisp set of 15x15 icons, balanced and consistent.</p>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="https://editora-free.netlify.app/">Github</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Indicator />
      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  );
}

function HeroComposition(props: React.ComponentProps<typeof NavigationMenu>) {
  return (
    <div style={heroCanvasStyle}>
      <div style={heroGlowStyle} />
      <ReferenceNavigation {...props} />
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <ShowcasePage
      eyebrow="Interactive Navigation"
      title="Navigation Menu"
      description="A collection of links for navigating websites. The shell, trigger bar, and content viewport are styled to feel like one composed surface rather than a basic tab strip."
      meta={[
        { label: 'Pattern', value: 'Hero navigation' },
        { label: 'Viewport', value: 'Structured panel' },
        { label: 'State', value: 'Interactive' }
      ]}
    >
      <HeroComposition {...args} />
    </ShowcasePage>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <ShowcaseSection
      eyebrow="Visual Recipes"
      title="Navigation Variants"
      description="Use the same content with different shell treatments to validate how the trigger bar and panel feel across app surfaces."
    >
      <div style={{ display: 'grid', gap: 20 }}>
        {(['surface', 'soft', 'solid', 'outline', 'flat', 'contrast'] as const).map((variant) => (
          <div key={variant} style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>{variant}</div>
            <div style={galleryFrameStyle}>
              <ReferenceNavigation variant={variant} size="md" elevation={variant === 'flat' ? 'none' : 'low'} />
            </div>
          </div>
        ))}
      </div>
    </ShowcaseSection>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <ShowcaseSection
      eyebrow="Scale"
      title="Small, medium, large"
      description="The size prop affects trigger rhythm and viewport padding so the menu can sit comfortably inside compact tools or spacious landing sections."
    >
      <div style={{ display: 'grid', gap: 22 }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>{size}</div>
            <div style={compactGalleryFrameStyle}>
              <ReferenceNavigation size={size} />
            </div>
          </div>
        ))}
      </div>
    </ShowcaseSection>
  ),
};

export const ToneGallery: Story = {
  render: () => (
    <ShowcaseSection
      eyebrow="Tones"
      title="Semantic emphasis"
      description="Tone changes the ring and active treatments without changing the structural geometry."
    >
      <div style={{ display: 'grid', gap: 22 }}>
        {(['neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => (
          <div key={tone} style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>{tone}</div>
            <div style={galleryFrameStyle}>
              <ReferenceNavigation tone={tone} variant="soft" />
            </div>
          </div>
        ))}
      </div>
    </ShowcaseSection>
  ),
};

export const ColorPaletteGallery: Story = {
  render: () => (
    <ShowcaseSection
      eyebrow="Palettes"
      title="All colors"
      description="Preview the same navigation system across the accent palettes supported by the shared theme tokens."
    >
      <div style={{ display: 'grid', gap: 22 }}>
        {(['blue', 'amber', 'green', 'red', 'gray'] as const).map((palette) => (
          <ThemeProvider key={palette} tokens={paletteTokens(palette)}>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>{palette}</div>
              <div style={galleryFrameStyle}>
                <ReferenceNavigation variant="soft" />
              </div>
            </div>
          </ThemeProvider>
        ))}
      </div>
    </ShowcaseSection>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <ShowcaseSection
      eyebrow="Sidebar"
      title="Vertical navigation"
      description="The same API can collapse into a vertical rail with a stacked viewport for workspace side navigation."
    >
      <div style={{ maxWidth: 420 }}>
        <NavigationMenu.Root {...args} orientation="vertical" size="lg" variant="soft" radius={16} elevation="low">
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>Dashboard</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div style={{ display: 'grid', gap: 10 }}>
                  <h3 style={{ ...sectionTitleStyle, fontSize: 22 }}>Dashboard links</h3>
                  <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Daily summaries, service status, and team activity.</p>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>Analytics</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div style={{ display: 'grid', gap: 10 }}>
                  <h3 style={{ ...sectionTitleStyle, fontSize: 22 }}>Analytics links</h3>
                  <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Conversion, retention, and operational trend reports.</p>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>Billing</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div style={{ display: 'grid', gap: 10 }}>
                  <h3 style={{ ...sectionTitleStyle, fontSize: 22 }}>Billing links</h3>
                  <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Plans, invoices, entitlements, and workspace limits.</p>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
          <NavigationMenu.Indicator />
          <NavigationMenu.Viewport />
        </NavigationMenu.Root>
      </div>
    </ShowcaseSection>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [selected, setSelected] = React.useState(1);
    return (
      <ShowcaseSection
        eyebrow="Controlled"
        title="Selection managed in React"
        description="The component still supports a controlled model while keeping the more polished visual shell."
      >
        <div style={{ display: 'grid', gap: 14 }}>
          <ReferenceNavigation selected={selected} onSelect={(next) => setSelected(next)} />
          <div style={{ ...showcaseBodyStyle, fontSize: 13 }}>Selected index: {selected}</div>
          <div style={showcaseChipRowStyle}>
            {['Learn', 'Overview', 'Github'].map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelected(index)}
                style={{
                  ...showcaseChipStyle,
                  cursor: 'pointer',
                  border: index === selected ? '1px solid color-mix(in srgb, #2563eb 32%, transparent)' : showcaseChipStyle.border
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </ShowcaseSection>
    );
  },
};
