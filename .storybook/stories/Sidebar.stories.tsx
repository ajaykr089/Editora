import React, { useMemo, useState } from 'react';
import { createThemeTokens, withAccentPalette } from '@editora/ui-core';
import {
  BookIcon,
  BookmarkIcon,
  CreditCardIcon,
  DashboardIcon,
  DownloadIcon,
  FileIcon,
  FolderOpenIcon,
  HelpCircleIcon,
  HistoryIcon,
  ReceiptIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon
} from '@editora/react-icons';
import { Box, Button, Flex, Grid, Sidebar, ThemeProvider, type SidebarItemInput } from '@editora/ui-react';

export default {
  title: 'UI/Sidebar',
  component: Sidebar,
  argTypes: {
    collapsed: { control: 'boolean' },
    collapsible: { control: 'boolean' },
    resizable: { control: 'boolean' },
    variant: { control: 'select', options: ['surface', 'soft', 'floating', 'contrast', 'minimal', 'split'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    density: { control: 'select', options: ['compact', 'default', 'comfortable'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] }
  }
};

const operationsItems = [
  { section: 'Overview', value: 'home', label: 'Overview', icon: <DashboardIcon />, active: true, description: 'System status and KPIs' },
  { section: 'Overview', value: 'alerts', label: 'Alerts', badge: '5', tone: 'danger', description: 'Urgent incidents' },
  {
    section: 'Operations',
    value: 'orders',
    label: 'Orders',
    icon: <FolderOpenIcon />,
    children: [
      { value: 'pending', label: 'Pending approval', badge: '18' },
      { value: 'packed', label: 'Packed & staged' },
      { value: 'returns', label: 'Returns', tone: 'warning' }
    ]
  },
  { section: 'Operations', value: 'inventory', label: 'Inventory', description: 'Realtime stock health' },
  { section: 'Growth', value: 'campaigns', label: 'Campaigns', icon: <SparklesIcon /> },
  { section: 'Growth', value: 'audiences', label: 'Audiences' },
  { section: 'System', value: 'settings', label: 'Settings', icon: <SettingsIcon /> }
] satisfies SidebarItemInput[];

const premiumTokens = withAccentPalette(
  createThemeTokens({
    colors: {
      text: '#f7fbff',
      muted: '#9fb6d7',
      border: 'rgba(142, 197, 255, 0.18)',
      primary: '#0f68e8',
      primaryHover: '#0b58c8',
      foregroundOnPrimary: '#ffffff'
    },
    surfaces: {
      panel: 'rgba(10, 28, 58, 0.82)',
      panelSolid: '#0c2447'
    },
    components: {
      sidebar: {
        bg: 'linear-gradient(180deg, rgba(5, 24, 50, 0.96), rgba(11, 39, 76, 0.92))',
        border: '1px solid rgba(143, 196, 255, 0.12)',
        radius: '26px',
        shadow: '0 36px 68px rgba(2, 12, 30, 0.42)',
        padding: '18px',
        gap: '14px',
        'item-radius': '16px',
        'item-height': '54px',
        'item-padding-x': '16px',
        'item-padding-y': '12px',
        'item-gap': '14px',
        'item-font-size': '16px',
        'item-line-height': '24px',
        'submenu-indent': '20px',
        'promo-radius': '20px',
        'promo-padding': '22px'
      }
    }
  }),
  'blue'
);

const pageFrameStyle: React.CSSProperties = {
  padding: 24,
  borderRadius: 32,
  minHeight: 820,
  background:
    'radial-gradient(circle at 72% 18%, rgba(25, 122, 255, 0.22), transparent 28%), linear-gradient(180deg, #04162f 0%, #0a2446 48%, #0b2c56 100%)'
};

const previewShellStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  minHeight: 760,
  gap: 18
};

function PremiumPromoCard() {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 20,
        background: 'linear-gradient(140deg, rgba(16, 96, 226, 0.96), rgba(98, 154, 255, 0.42))',
        color: '#ffffff',
        display: 'grid',
        gap: 18,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)'
      }}
    >
      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ fontSize: 18, lineHeight: '1.25', fontWeight: 800 }}>Upgrade to Premium</div>
        <div style={{ fontSize: 14, lineHeight: '1.55', color: 'rgba(255,255,255,0.82)' }}>
          Unlock unlimited reading and offline access across your whole library.
        </div>
      </div>
      <Button recipe="solid" scale="2" radius={4} style={{ width: '100%' }}>
        Upgrade Now
      </Button>
    </div>
  );
}

function PremiumSidebarStructure({ value }: { value: string }) {
  return (
    <>
      <Sidebar.Header>
        <Flex align="center" gap="12px" style={{ color: '#ffffff', fontWeight: 900, fontSize: 21 }}>
          <span
            style={{
              display: 'inline-grid',
              placeItems: 'center',
              width: 38,
              height: 38,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
            }}
          >
            <BookIcon width={22} height={22} />
          </span>
          <span>Publify</span>
        </Flex>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group title="Library">
          <Sidebar.Item value="dashboard" label="Dashboard" icon={<DashboardIcon />} active={value === 'dashboard'} />
          <Sidebar.Item value="library" label="My Library" icon={<FolderOpenIcon />} active={value === 'library'} />
          <Sidebar.Item value="books" label="Books" icon={<BookIcon />} active={value === 'books'} />
          <Sidebar.Item value="magazines" label="Magazines" icon={<FileIcon />} active={value === 'magazines'}>
            <Sidebar.Item value="editorial" label="Editorial picks" description="Weekly hand-picked reads" />
            <Sidebar.Item value="trending" label="Trending now" description="Most opened this week" />
            <Sidebar.Item value="collections" href="#collections">
              <span>Collections</span>
              <span>Curated reading lists</span>
            </Sidebar.Item>
          </Sidebar.Item>
          <Sidebar.Item value="bookmarks" label="Bookmarks" icon={<BookmarkIcon />} active={value === 'bookmarks'} />
          <Sidebar.Item value="history" label="Reading History" icon={<HistoryIcon />} active={value === 'history'} />
        </Sidebar.Group>
        <Sidebar.Group title="Account">
          <Sidebar.Item value="subscription" label="Subscription" icon={<CreditCardIcon />} active={value === 'subscription'} />
          <Sidebar.Item value="downloads" label="Downloads" icon={<DownloadIcon />} active={value === 'downloads'} />
          <Sidebar.Item value="payments" label="Payments" icon={<ReceiptIcon />} active={value === 'payments'} />
          <Sidebar.Item value="settings" label="Settings" icon={<SettingsIcon />} active={value === 'settings'}>
            <Sidebar.Item value="preferences" label="Preferences" />
            <Sidebar.Item value="devices" label="Devices" />
            <Sidebar.Item value="security" label="Security" />
          </Sidebar.Item>
          <Sidebar.Item value="support" label="Help & Support" icon={<HelpCircleIcon />} active={value === 'support'} />
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Promo>
        <PremiumPromoCard />
      </Sidebar.Promo>
      <Sidebar.Footer>
        <div style={{ color: 'rgba(255,255,255,0.72)' }}>Signed in as premium@publify.app</div>
      </Sidebar.Footer>
    </>
  );
}

export const PremiumReadingShell = (args: any) => {
  const [value, setValue] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ThemeProvider tokens={premiumTokens} storageKey={null}>
      <div style={pageFrameStyle}>
        <div style={previewShellStyle}>
          <Sidebar
            {...args}
            value={value}
            collapsed={collapsed}
            onSelect={(detail) => setValue(detail.value)}
            onToggle={setCollapsed}
            collapsible
            resizable
            variant="contrast"
            tone="brand"
            size="sm"
            itemFontSize={12}
          >
            <PremiumSidebarStructure value={value} />
          </Sidebar>

          <div
            style={{
              minHeight: 760,
              borderRadius: 28,
              border: '1px solid rgba(158, 197, 255, 0.16)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
              padding: 26,
              color: '#f7fbff',
            }}
          >
            <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
              <div style={{ fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.54)' }}>
                Reading dashboard
              </div>
              <div style={{ fontSize: 40, lineHeight: 1.05, fontWeight: 900 }}>
                Sidebar-driven premium shell
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)' }}>
                The sidebar keeps the reading app navigation structured with grouped links, expandable subsections, and a dedicated promo rail without sacrificing keyboard support or resize persistence.
              </div>
              <Flex gap="10px" wrap="wrap">
                <Button recipe="solid" scale="2" radius={14}>
                  Open active module
                </Button>
                <Button recipe="surface" scale="2" radius={14} onClick={() => setCollapsed((c) => !c)}>
                  {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                </Button>
              </Flex>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

PremiumReadingShell.parameters = {
  controls: { exclude: ['children'] }
};

export const OperationsWorkspace = () => {
  const [value, setValue] = useState('home');
  const items = useMemo(
    () => operationsItems.map((item) => ({ ...item, active: item.value === value })),
    [value]
  );

  return (
    <Grid columns="auto minmax(0, 1fr)" style={{ minHeight: 620, border: '1px solid var(--ui-color-border, #d6dce6)', borderRadius: 28, overflow: 'hidden' }}>
      <Sidebar
        items={items}
        value={value}
        onSelect={(detail) => setValue(detail.value)}
        collapsible
        resizable
        variant="surface"
      >
        <Sidebar.Header>
          <Flex align="center" justify="space-between" style={{ fontWeight: 800, fontSize: 18 }}>
            <span>Operations Hub</span>
            <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>24/7</Box>
          </Flex>
        </Sidebar.Header>
        <Sidebar.SearchInput
          placeholder="Search orders, audiences, incidents…"
          icon={<SearchIcon width={16} height={16} />}
        />
        <Sidebar.Promo>
          <Box
            style={{
              borderRadius: 18,
              padding: 18,
              background: 'linear-gradient(140deg, color-mix(in srgb, var(--ui-color-primary) 92%, #1d4ed8 8%), color-mix(in srgb, var(--ui-color-primary) 22%, #ffffff 78%))',
              color: '#ffffff',
              display: 'grid',
              gap: 12
            }}
          >
            <Flex align="center" gap="8px" style={{ fontWeight: 800 }}>
              <SparklesIcon width={16} height={16} />
              <strong>Quarter-end launch</strong>
            </Flex>
            <span style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>Review every open operational blocker before the release checklist closes.</span>
          </Box>
        </Sidebar.Promo>
      </Sidebar>

      <Box p="24px" style={{ background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
        <div style={{ display: 'grid', gap: 10, maxWidth: 760 }}>
          <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ui-color-muted, #64748b)' }}>
            Selected module
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.08, fontWeight: 900 }}>{value}</div>
          <div style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ui-color-muted, #64748b)' }}>
            Light theme application shell with nested operations routes, inline promo card, and search/header/footer regions.
          </div>
        </div>
      </Box>
    </Grid>
  );
};

export const VariantGallery = () => {
  const rows = ['surface', 'soft', 'floating', 'contrast', 'minimal'] as const;
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {rows.map((variant) => (
        <div key={variant} style={{ display: 'grid', gridTemplateColumns: '120px auto', alignItems: 'start', gap: 18 }}>
          <div style={{ fontWeight: 800, textTransform: 'capitalize' }}>{variant}</div>
          <Sidebar items={operationsItems.slice(0, 4)} variant={variant} style={{ height: 340 }}>
            <Box slot="header" style={{ fontWeight: 800 }}>Shell</Box>
          </Sidebar>
        </div>
      ))}
    </div>
  );
};

export const SizeAndDensityGallery = () => (
  <div style={{ display: 'grid', gap: 18 }}>
    {(['sm', 'md', 'lg'] as const).map((size) => (
      <div key={size} style={{ display: 'grid', gridTemplateColumns: '120px auto auto', gap: 18, alignItems: 'start' }}>
        <div style={{ fontWeight: 800, textTransform: 'uppercase' }}>{size}</div>
        <Sidebar items={operationsItems.slice(0, 4)} size={size} density="compact" style={{ height: 300 }} />
        <Sidebar items={operationsItems.slice(0, 4)} size={size} density="comfortable" style={{ height: 300 }} />
      </div>
    ))}
  </div>
);

export const NavigationLinksAndCustomContent = () => {
  const [value, setValue] = useState('dashboard');

  return (
    <Grid
      columns="auto minmax(0, 1fr)"
      style={{
        minHeight: 640,
        border: '1px solid var(--ui-color-border, #d6dce6)',
        borderRadius: 28,
        overflow: 'hidden',
        background: 'var(--ui-color-surface-alt, #f8fafc)'
      }}
    >
      <Sidebar
        value={value}
        onSelect={(detail) => setValue(detail.value)}
        collapsible
        resizable
        sectionLabelTransform="none"
      >
        <Sidebar.Header>
          <Flex align="center" justify="space-between" style={{ fontWeight: 800, fontSize: 18 }}>
            <span>Product docs</span>
            <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>v4.2</Box>
          </Flex>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group title="Getting started">
            <Sidebar.Item value="dashboard" label="Overview" icon={<DashboardIcon />} href="#overview" active={value === 'dashboard'} />
            <Sidebar.Item value="guides" href="#guides">
              <BookIcon />
              <span>Guides</span>
              <span>Patterns, conventions, and implementation notes</span>
            </Sidebar.Item>
            <Sidebar.Item value="components" label="Components" icon={<FolderOpenIcon />}>
              <Sidebar.Item value="navigation" label="Navigation" href="#navigation" />
              <Sidebar.Item value="feedback" label="Feedback" href="#feedback" />
              <Sidebar.Item value="data-entry" label="Data entry" href="#data-entry" />
            </Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group title="Resources">
            <Sidebar.Item value="releases" label="Release notes" icon={<SparklesIcon />} href="#releases" />
            <Sidebar.Item value="support" label="Help & Support" icon={<HelpCircleIcon />} href="#support" />
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <div style={{ color: 'var(--ui-color-muted, #64748b)' }}>Links use real anchor navigation and still emit sidebar selection.</div>
        </Sidebar.Footer>
      </Sidebar>

      <Box p="28px" style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
        <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ui-color-muted, #64748b)' }}>
          Current selection
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.05, fontWeight: 900 }}>{value}</div>
        <div style={{ maxWidth: 720, fontSize: 16, lineHeight: 1.7, color: 'var(--ui-color-muted, #64748b)' }}>
          This story demonstrates two new sidebar capabilities: leaf items can be real links through <code>href</code>, and display content can be authored directly inside <code>Sidebar.Item</code> instead of relying only on <code>label</code> and <code>description</code>.
        </div>
        <Box
          style={{
            padding: 18,
            borderRadius: 18,
            border: '1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)',
            background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--color-panel-solid, #ffffff))'
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 8 }}>API example</div>
          <pre
            style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.55, color: 'var(--ui-color-text, #202020)' }}
          >{`<Sidebar.Item value="guides" href="#guides">
  <BookIcon />
  <span>Guides</span>
  <span>Patterns, conventions, and implementation notes</span>
</Sidebar.Item>`}</pre>
        </Box>
        <Box
          style={{
            padding: 18,
            borderRadius: 18,
            border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 84%, transparent)',
            background: 'var(--color-panel-solid, #ffffff)',
            display: 'grid',
            gap: 10
          }}
        >
          <div style={{ fontWeight: 800 }}>What this demo covers</div>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', lineHeight: 1.65 }}>
            Link rows keep anchor navigation semantics, custom leading icons can be authored directly in the item body, and nested submenu sections animate open and closed instead of snapping.
          </div>
        </Box>
      </Box>
    </Grid>
  );
};

export const SectionLabelTransformGallery = () => (
  <Grid columns="repeat(3, minmax(0, 1fr))" style={{ gap: 18, alignItems: 'start' }}>
    {([
      { title: 'Uppercase', transform: 'uppercase' as const },
      { title: 'None', transform: 'none' as const },
      { title: 'Capitalize', transform: 'capitalize' as const }
    ]).map((example) => (
      <div key={example.transform} style={{ display: 'grid', gap: 14 }}>
        <div style={{ fontWeight: 800 }}>{example.title}</div>
        <Sidebar variant="surface" sectionLabelTransform={example.transform} style={{ height: 360 }}>
          <Sidebar.Header>
            <Flex align="center" justify="space-between" style={{ fontWeight: 800 }}>
              <span>Sidebar labels</span>
              <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{example.transform}</Box>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group title="Primary navigation">
              <Sidebar.Item value="overview" label="Overview" icon={<DashboardIcon />} />
              <Sidebar.Item value="reading" icon={<BookIcon />}>
                <span>Reading lists</span>
                <span>Custom content rendered inside the row</span>
              </Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group title="Account settings">
              <Sidebar.Item value="billing" label="Billing" icon={<CreditCardIcon />} />
              <Sidebar.Item value="preferences" label="Preferences" icon={<SettingsIcon />} />
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
      </div>
    ))}
  </Grid>
);

export const SubmenuMotionAndCustomIcons = () => {
  const [value, setValue] = useState('overview');

  return (
    <Grid
      columns="auto minmax(0, 1fr)"
      style={{
        minHeight: 620,
        border: '1px solid var(--ui-color-border, #d6dce6)',
        borderRadius: 28,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 3%, #ffffff), #f8fafc)'
      }}
    >
      <Sidebar
        value={value}
        onSelect={(detail) => setValue(detail.value)}
        variant="soft"
        sectionLabelTransform="capitalize"
      >
        <Sidebar.Header>
          <Flex align="center" justify="space-between" style={{ fontWeight: 800, fontSize: 18 }}>
            <span>Docs navigation</span>
            <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>animated</Box>
          </Flex>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group title="Core guides">
            <Sidebar.Item value="overview" href="#overview">
              <DashboardIcon />
              <span>Overview</span>
              <span>Entry points, architecture, and release notes</span>
            </Sidebar.Item>
            <Sidebar.Item value="patterns">
              <BookIcon />
              <span>Patterns</span>
              <span>Open this item to preview submenu motion</span>
              <Sidebar.Item value="forms" href="#forms" label="Forms" />
              <Sidebar.Item value="navigation" href="#navigation" label="Navigation" />
              <Sidebar.Item value="feedback" href="#feedback" label="Feedback" />
            </Sidebar.Item>
            <Sidebar.Item value="tooling" href="#tooling">
              <SparklesIcon />
              <span>Tooling</span>
              <span>Storybook, E2E, and docs automation</span>
            </Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group title="Support links">
            <Sidebar.Item value="account" href="#account" icon={<CreditCardIcon />} label="Account" />
            <Sidebar.Item value="support" href="#support" icon={<HelpCircleIcon />} label="Help & Support" />
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar>

      <Box p="28px" style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
        <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ui-color-muted, #64748b)' }}>
          Demo focus
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.05, fontWeight: 900 }}>Animated submenus and icon-as-child rows</div>
        <div style={{ maxWidth: 720, fontSize: 16, lineHeight: 1.7, color: 'var(--ui-color-muted, #64748b)' }}>
          This example is tuned for visual review. Open the "Patterns" group to inspect the submenu transition, and check that icon spacing remains correct even when icons are authored directly as children inside each <code>Sidebar.Item</code>.
        </div>
      </Box>
    </Grid>
  );
};
