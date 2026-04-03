import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  AlertTriangleIcon,
  ChartLineIcon,
  CheckCircleIcon,
  IconProvider,
  LogoGithubIcon,
  LogoGoogleDriveIcon,
  LogoSpotifyIcon,
  ShieldIcon,
  SparklesIcon,
  XCircleIcon,
} from '@editora/react-icons';
import { Box, Grid } from '@editora/ui-react';

const meta: Meta<typeof Box> = {
  title: 'Icons/React Icons Themes',
  component: Box,
};

export default meta;
type Story = StoryObj<typeof meta>;

const pageStyle: React.CSSProperties = {
  padding: 24,
  display: 'grid',
  gap: 32,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: '#0f172a',
  margin: 0,
};

const sectionTextStyle: React.CSSProperties = {
  margin: '8px 0 0 0',
  fontSize: 14,
  lineHeight: 1.6,
  color: '#475569',
  maxWidth: 780,
};

const darkCardStyle: React.CSSProperties = {
  minHeight: 120,
  padding: 18,
  borderRadius: 18,
  border: '1px solid rgba(148, 163, 184, 0.22)',
  background:
    'radial-gradient(circle at top left, rgba(56, 189, 248, 0.16), transparent 42%), linear-gradient(180deg, #0f172a, #111827)',
  boxShadow: '0 18px 48px rgba(15, 23, 42, 0.22)',
  display: 'grid',
  gap: 12,
  alignContent: 'space-between',
};

const colorCardStyle: React.CSSProperties = {
  minHeight: 120,
  padding: 18,
  borderRadius: 18,
  border: '1px solid #e2e8f0',
  background: 'linear-gradient(180deg, #ffffff, #f8fafc)',
  display: 'grid',
  gap: 12,
  alignContent: 'space-between',
};

const iconRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <Box style={{ display: 'grid', gap: 18 }}>
      <div>
        <h2 style={sectionTitleStyle}>{title}</h2>
        <p style={sectionTextStyle}>{description}</p>
      </div>
      {children}
    </Box>
  );
}

function DarkThemeExamples(): React.ReactElement {
  return (
    <IconProvider value={{ size: 26, strokeWidth: 1.75, absoluteStrokeWidth: true }}>
      <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="16px">
        <Box style={darkCardStyle}>
          <div style={iconRowStyle}>
            <LogoGithubIcon color="#f8fafc" ariaLabel="GitHub on dark surface" />
            <ShieldIcon color="#38bdf8" ariaLabel="Shield on dark surface" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc' }}>Neutral icons on dark UI</div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#94a3b8' }}>
              Default recommendation: give icons a light foreground color on dark panels.
            </div>
          </div>
        </Box>

        <Box style={darkCardStyle}>
          <div style={iconRowStyle}>
            <CheckCircleIcon color="#4ade80" ariaLabel="Success on dark surface" />
            <AlertTriangleIcon color="#fbbf24" ariaLabel="Warning on dark surface" />
            <XCircleIcon color="#f87171" ariaLabel="Error on dark surface" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc' }}>Semantic colors still work</div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#94a3b8' }}>
              Success, warning, and danger hues stay readable when saturation is balanced against the dark background.
            </div>
          </div>
        </Box>

        <Box style={darkCardStyle}>
          <div style={iconRowStyle}>
            <ChartLineIcon color="#e2e8f0" ariaLabel="Chart line on dark surface" />
            <SparklesIcon color="#c084fc" ariaLabel="Sparkles on dark surface" />
            <LogoGoogleDriveIcon color="#93c5fd" ariaLabel="Google Drive on dark surface" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc' }}>Accent icons for emphasis</div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#94a3b8' }}>
              Bright accent colors are fine as long as the background remains low-noise and dark enough for contrast.
            </div>
          </div>
        </Box>
      </Grid>
    </IconProvider>
  );
}

function ColoredIconExamples(): React.ReactElement {
  return (
    <IconProvider value={{ size: 28, strokeWidth: 1.75, absoluteStrokeWidth: true }}>
      <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="16px">
        <Box style={colorCardStyle}>
          <div style={iconRowStyle}>
            <CheckCircleIcon color="#16a34a" ariaLabel="Green check icon" />
            <AlertTriangleIcon color="#d97706" ariaLabel="Amber alert icon" />
            <XCircleIcon color="#dc2626" ariaLabel="Red error icon" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Status colors</div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>
              Pass `color` directly to a named component when you want semantic feedback icons.
            </div>
          </div>
        </Box>

        <Box style={colorCardStyle}>
          <div style={iconRowStyle}>
            <LogoSpotifyIcon color="#1db954" ariaLabel="Spotify brand color" />
            <LogoGithubIcon color="#111827" ariaLabel="GitHub brand color" />
            <LogoGoogleDriveIcon color="#2563eb" ariaLabel="Google Drive accent color" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Brand or feature colors</div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>
              Logos and product icons can use explicit brand tones when your UI allows colored marks.
            </div>
          </div>
        </Box>

        <Box style={colorCardStyle}>
          <div style={iconRowStyle}>
            <div style={{ color: '#7c3aed', display: 'flex', alignItems: 'center' }}>
              <SparklesIcon ariaLabel="Inherited purple color" />
            </div>
            <div style={{ color: '#0f766e', display: 'flex', alignItems: 'center' }}>
              <ChartLineIcon ariaLabel="Inherited teal color" />
            </div>
            <div style={{ color: '#ea580c', display: 'flex', alignItems: 'center' }}>
              <ShieldIcon ariaLabel="Inherited orange color" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Inherited color works too</div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>
              Icons use `currentColor`, so they can inherit from parent text color without extra props.
            </div>
          </div>
        </Box>
      </Grid>
    </IconProvider>
  );
}

function WeightVariationExamples(): React.ReactElement {
  const cardStyle: React.CSSProperties = {
    minHeight: 136,
    padding: 18,
    borderRadius: 18,
    border: '1px solid #e2e8f0',
    background: 'linear-gradient(180deg, #ffffff, #f8fafc)',
    display: 'grid',
    gap: 12,
    alignContent: 'space-between',
  };

  return (
    <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="16px">
      <IconProvider value={{ size: 28, iconWeight: 'thin', absoluteStrokeWidth: true }}>
        <Box style={cardStyle}>
          <div style={iconRowStyle}>
            <ChartLineIcon ariaLabel="Thin chart line icon" />
            <ShieldIcon ariaLabel="Thin shield icon" />
            <SparklesIcon ariaLabel="Thin sparkles icon" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Thin</div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>
              Best when the default outline feels too heavy in dense or refined UI surfaces.
            </div>
          </div>
        </Box>
      </IconProvider>

      <IconProvider value={{ size: 28, iconWeight: 'regular', absoluteStrokeWidth: true }}>
        <Box style={cardStyle}>
          <div style={iconRowStyle}>
            <ChartLineIcon ariaLabel="Regular chart line icon" />
            <ShieldIcon ariaLabel="Regular shield icon" />
            <SparklesIcon ariaLabel="Regular sparkles icon" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Regular</div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>
              Balanced default weight for most surfaces and matches the current library baseline.
            </div>
          </div>
        </Box>
      </IconProvider>

      <IconProvider value={{ size: 28, iconWeight: 'bold', absoluteStrokeWidth: true }}>
        <Box style={cardStyle}>
          <div style={iconRowStyle}>
            <ChartLineIcon ariaLabel="Bold chart line icon" />
            <ShieldIcon ariaLabel="Bold shield icon" />
            <SparklesIcon ariaLabel="Bold sparkles icon" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Bold</div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>
              Useful for stronger presence, small touch targets, or low-contrast surfaces.
            </div>
          </div>
        </Box>
      </IconProvider>
    </Grid>
  );
}

export const DarkThemeAndColorExamples: Story = {
  render: () => (
    <Box style={pageStyle}>
      <Section
        title="Dark Theme Visibility"
        description="Examples of named React icon components on dark surfaces. These show the safest pattern for contrast: light neutral foregrounds for default icons, with selective accent or semantic color when emphasis is needed."
      >
        <DarkThemeExamples />
      </Section>

      <Section
        title="Colored Icon Examples"
        description="Examples of direct `color` props and inherited color with named components like `CheckCircleIcon`, `ChartLineIcon`, and `LogoSpotifyIcon`. This is useful when a product wants semantic, branded, or contextual icon color."
      >
        <ColoredIconExamples />
      </Section>

      <Section
        title="Stroke Weight Variations"
        description="Outline icons now support `iconWeight` as a named variation. Use `thin` when the default set feels too bold, keep `regular` for the baseline, or choose `bold` when you want extra presence."
      >
        <WeightVariationExamples />
      </Section>
    </Box>
  ),
};
