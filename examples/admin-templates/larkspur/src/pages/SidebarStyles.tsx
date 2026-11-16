import React from 'react';
import { Badge } from '@editora/ui-react/Badge';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Sidebar, type SidebarItemInput } from '@editora/ui-react/Sidebar';
import { useTitle } from '../lib/router';

// The same navigation in every frame, so the styles compare like for like.
const ITEMS: SidebarItemInput[] = [
  { value: 'home', label: 'Overview', icon: 'dashboard', section: 'Workspace' },
  { value: 'orders', label: 'Orders', icon: 'cart', section: 'Workspace', badge: '12' },
  { value: 'customers', label: 'Customers', icon: 'users', section: 'Workspace' },
  {
    value: 'reports', label: 'Reports', icon: 'chart-line', section: 'Workspace',
    children: [
      { value: 'sales', label: 'Sales' },
      { value: 'traffic', label: 'Traffic' },
      { value: 'cohorts', label: 'Cohorts' },
    ],
  },
  { value: 'mail', label: 'Mail', icon: 'mail', section: 'Apps', badge: '3' },
  { value: 'calendar', label: 'Calendar', icon: 'calendar', section: 'Apps' },
  { value: 'settings', label: 'Settings', icon: 'settings', section: 'Account' },
];

// layout="dual": each top-level item is a rail area, its children fill the panel.
const DUAL_ITEMS: SidebarItemInput[] = [
  { value: 'home', label: 'Home', icon: 'home' },
  {
    value: 'commerce', label: 'Commerce', icon: 'store', description: 'Orders, customers and reports', badge: '12',
    children: [
      { value: 'orders', label: 'Orders', icon: 'cart', badge: '12' },
      { value: 'customers', label: 'Customers', icon: 'users' },
      {
        value: 'reports', label: 'Reports', icon: 'chart-line', section: 'Insights',
        children: [
          { value: 'sales', label: 'Sales' },
          { value: 'traffic', label: 'Traffic' },
          { value: 'cohorts', label: 'Cohorts' },
        ],
      },
    ],
  },
  {
    value: 'apps', label: 'Apps', icon: 'app-grid', description: 'Mail and calendar',
    children: [
      { value: 'mail', label: 'Mail', icon: 'mail', badge: '3' },
      { value: 'calendar', label: 'Calendar', icon: 'calendar' },
    ],
  },
  { value: 'settings', label: 'Settings', icon: 'settings', section: 'Account' },
];

type Variant = 'inset' | 'indicator' | 'pill' | 'solid' | 'gradient' | 'glass' | 'minimal' | 'contrast' | 'split' | 'floating';

const STYLES: Array<{ variant: Variant; title: string; note: string; collapsed?: boolean }> = [
  { variant: 'inset', title: 'Inset', note: 'Sidebar on a soft canvas, content on a raised card. Layout inset + Sidebar variant="inset".' },
  { variant: 'indicator', title: 'Indicator bar', note: 'A brand-colour bar marks the current page; the rest stays quiet.' },
  { variant: 'pill', title: 'Pills', note: 'Rounded, roomier rows; the current page is a brand-tinted pill.' },
  { variant: 'solid', title: 'Solid', note: 'The current page filled with the brand colour, white text.' },
  { variant: 'gradient', title: 'Gradient', note: 'A deep brand gradient with a bright current item, for AI and creative tools.' },
  { variant: 'glass', title: 'Glass', note: 'Frosted over a photo or colour mesh. Give it something behind to blur.' },
  { variant: 'minimal', title: 'Minimal', note: 'No frame; a subtle tint for the current page.' },
  { variant: 'contrast', title: 'Dark', note: 'Neutral near-black beside a light page; brand only on the current item.' },
  { variant: 'split', title: 'Split', note: 'Flat panel with one divider, for dense back-office tools.' },
  {
    variant: 'solid', title: 'Icon only', collapsed: true,
    note: 'collapsed: hover or focus an icon for its name; a group (Reports) opens its pages in a flyout. The chevron toggles it (collapseButton).',
  },
];

function DualFrame() {
  return (
    <figure className="lk-sb-frame is-inset is-dual">
      <div className="lk-sb-app">
        <Sidebar layout="dual" variant="inset" value="sales" items={DUAL_ITEMS} width="200px" collapsible aria-label="Icon rail and panel sidebar example" className="lk-sb-sidebar">
          <Sidebar.RailStart>
            <span className="lk-sb-avatar" aria-hidden="true">L</span>
          </Sidebar.RailStart>
          <Sidebar.RailEnd>
            <span className="lk-sb-avatar" aria-hidden="true">MC</span>
          </Sidebar.RailEnd>
        </Sidebar>
        <div className="lk-sb-main">
          <div className="lk-sb-line w60" />
          <div className="lk-sb-line w40" />
          <div className="lk-sb-cards"><div /><div /><div /></div>
          <div className="lk-sb-block" />
        </div>
      </div>
      <figcaption>
        <strong>Icon rail + panel</strong> <Badge size="sm" variant="outline" tone="neutral">layout="dual"</Badge>
        <span className="cell-sub">
          Top-level items become a rail; the open area's pages fill the panel (as in Slack or Supabase). Click
          the open area again to fold the panel away. Works with every variant.
        </span>
      </figcaption>
    </figure>
  );
}

function Frame({ variant, title, note, collapsed }: (typeof STYLES)[number]) {
  return (
    <figure className={`lk-sb-frame is-${variant}${collapsed ? ' is-collapsed' : ''}`}>
      <div className="lk-sb-app" aria-hidden="false">
        <Sidebar
          variant={variant}
          value="sales"
          items={ITEMS}
          width="220px"
          collapsible
          collapseButton={collapsed}
          defaultCollapsed={collapsed}
          aria-label={`${title} sidebar example`}
          className="lk-sb-sidebar"
        >
          <Sidebar.Footer>
            <div className="lk-sb-user">
              <span className="lk-sb-avatar" aria-hidden="true">MC</span>
              <span><strong>Maya Chen</strong><br />Owner</span>
            </div>
          </Sidebar.Footer>
        </Sidebar>
        <div className="lk-sb-main">
          <div className="lk-sb-line w60" />
          <div className="lk-sb-line w40" />
          <div className="lk-sb-cards"><div /><div /><div /></div>
          <div className="lk-sb-block" />
        </div>
      </div>
      <figcaption>
        <strong>{title}</strong>{' '}
        <Badge size="sm" variant="outline" tone="neutral">{collapsed ? 'collapsed' : `variant="${variant}"`}</Badge>
        <span className="cell-sub">{note}</span>
      </figcaption>
    </figure>
  );
}

/** Every sidebar style side by side. The account menu (top right) switches the real one. */
export function SidebarStyles() {
  useTitle('Sidebar styles');
  return (
    <div className="lk-screen lk-screen-wide">
      <PageHeader
        title="Sidebar styles"
        subtitle="The same navigation in each style. Switch the app's own sidebar from the account menu (top right), and compare in dark mode too."
      />
      <div className="lk-sb-grid">
        {STYLES.map((style) => <Frame key={style.title} {...style} />)}
        <DualFrame />
      </div>
    </div>
  );
}
