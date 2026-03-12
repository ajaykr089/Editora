import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AppHeader,
  AppHeaderCenter,
  AppHeaderEnd,
  AppHeaderStart,
  AppHeaderSubtitle,
  AppHeaderTitle,
  Badge,
  Box,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Flex,
  Grid,
} from '@editora/ui-react';
import { BellIcon, SearchIcon, ShieldIcon, SparklesIcon } from '@editora/react-icons';

const meta: Meta<typeof AppHeader> = {
  title: 'UI/AppHeader',
  component: AppHeader,
  args: {
    bordered: true,
    sticky: false,
    variant: 'surface',
    tone: 'neutral',
    size: 'md',
    elevation: 'low',
    radius: 12,
  },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'soft', 'outline', 'solid'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    radius: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof AppHeader>;

function HeaderChrome(props: React.ComponentProps<typeof AppHeader>) {
  return (
    <AppHeader {...props} style={{ width: '100%' }}>
      <AppHeaderStart>
        <Flex align="center" style={{ gap: 10 }}>
          <Box
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)',
              color: 'var(--ui-color-primary, #2563eb)',
            }}
          >
            <ShieldIcon size={15} />
          </Box>
          <Flex direction="column" style={{ gap: 0 }}>
            <Box style={{ fontWeight: 600 }}>Editora Ops</Box>
          </Flex>
        </Flex>
      </AppHeaderStart>

      <AppHeaderCenter>
        <Badge tone="info" variant="soft">Live</Badge>
      </AppHeaderCenter>

      <AppHeaderTitle>Clinical Command Center</AppHeaderTitle>
      <AppHeaderSubtitle>North campus · Shift A · 08:15 UTC</AppHeaderSubtitle>

      <AppHeaderEnd>
        <Button size="sm" recipe="soft" variant="secondary">
          <SearchIcon size={14} />
          Search
        </Button>
        <Button size="sm" recipe="soft" variant="secondary">
          <BellIcon size={14} />
          Alerts
        </Button>
      </AppHeaderEnd>
    </AppHeader>
  );
}

function InteractiveHeaderShell(props: React.ComponentProps<typeof AppHeader>) {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <Grid style={{ gap: 12 }}>
      <HeaderChrome
        {...props}
        showMenuButton
        onMenuTrigger={() => setNavOpen((open) => !open)}
      />
      <Box
        style={{
          display: navOpen ? 'block' : 'none',
          padding: 14,
          borderRadius: 14,
          border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
          background: 'color-mix(in srgb, var(--ui-color-surface-alt, #f8fafc) 78%, transparent)',
        }}
      >
        <Flex direction="column" style={{ gap: 8 }}>
          <Box style={{ fontWeight: 600 }}>Navigation</Box>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            Dashboard, Patients, Staffing, and Billing are available from the app shell.
          </Box>
        </Flex>
      </Box>
    </Grid>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16 }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>App header</CardTitle>
        <CardDescription>
          Token-backed shell for branding, title context, search/actions, and mobile navigation.
        </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{ padding: 12 }}>
          <InteractiveHeaderShell {...args} />
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'neutral' },
        { label: 'Soft', variant: 'soft', tone: 'info' },
        { label: 'Outline', variant: 'outline', tone: 'warning' },
        { label: 'Solid', variant: 'solid', tone: 'info' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <HeaderChrome
            bordered
            showMenuButton
            variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'}
            tone={entry.tone as 'neutral' | 'info' | 'warning'}
            radius={12}
          />
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Small', size: 'sm' },
        { label: 'Medium', size: 'md' },
        { label: 'Large', size: 'lg' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <HeaderChrome
            bordered
            showMenuButton
            size={entry.size as 'sm' | 'md' | 'lg'}
            radius={entry.size === 'lg' ? 16 : 12}
          />
        </Grid>
      ))}
    </Grid>
  ),
};

export const ProductShellPattern: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      <InteractiveHeaderShell
        sticky
        bordered
        variant="soft"
        tone="info"
        elevation="low"
        radius={16}
      />
      <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[
          {
            title: 'Critical escalations',
            description: '3 cases require acknowledgment inside the next 30 minutes.',
          },
          {
            title: 'Automation coverage',
            description: '92% of nightly triage rules completed without manual intervention.',
          },
          {
            title: 'Priority releases',
            description: 'Two release trains are queued for clinical review and approval.',
          },
        ].map((card) => (
          <Card key={card.title} variant="soft" radius={16}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </Grid>
      <Box
        style={{
          padding: 16,
          borderRadius: 16,
          border: '1px dashed color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
          color: 'var(--ui-color-muted, #64748b)',
        }}
      >
        Scrollable workspace content begins here. The header remains visually stable and can switch between surface,
        soft, outline, and solid treatments without story-specific CSS overrides.
      </Box>
    </Grid>
  ),
};

export const DenseUtilityRail: Story = {
  render: () => (
    <HeaderChrome
      dense
      bordered
      showMenuButton
      variant="outline"
      tone="neutral"
      radius={8}
      elevation="none"
    />
  ),
};

export const SignalBar: Story = {
  render: () => (
    <AppHeader variant="solid" tone="success" size="sm" bordered radius={12}>
      <AppHeaderStart>
        <Flex align="center" style={{ gap: 8, fontWeight: 600 }}>
          <SparklesIcon size={14} />
          Deployment complete
        </Flex>
      </AppHeaderStart>
      <AppHeaderTitle>Release 2026.03.12.4 is now active</AppHeaderTitle>
      <AppHeaderSubtitle>Observability checks are healthy across all regions</AppHeaderSubtitle>
      <AppHeaderEnd>
        <Button size="sm" recipe="surface" variant="secondary">
          View changes
        </Button>
      </AppHeaderEnd>
    </AppHeader>
  ),
};
