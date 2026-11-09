import React from 'react';
import { AppHeader } from '@editora/ui-react/AppHeader';
import { Avatar } from '@editora/ui-react/Avatar';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { CommandPalette } from '@editora/ui-react/CommandPalette';
import { Dropdown } from '@editora/ui-react/Dropdown';
import { Icon } from '@editora/ui-react/Icon';
import { Kbd } from '@editora/ui-react/Kbd';
import { Layout } from '@editora/ui-react/Layout';
import { Sidebar, type SidebarItemInput } from '@editora/ui-react/Sidebar';
import { NOTIFICATIONS, mailCounts } from '../../shared/data';
import { navigate, type Route } from './lib/router';
import type { Density } from './lib/theme';

type Props = {
  route: Route;
  mode: 'light' | 'dark';
  density: Density;
  onToggleMode: () => void;
  onDensity: (density: Density) => void;
  children: React.ReactNode;
};

function navItems(): SidebarItemInput[] {
  const counts = mailCounts();
  return [
    {
      value: 'dashboards', label: 'Dashboards', icon: 'dashboard', section: 'Overview',
      children: [
        { value: '/', label: 'eCommerce', href: '#/' },
        { value: '/analytics', label: 'Analytics', href: '#/analytics' },
        { value: '/crm', label: 'CRM', href: '#/crm' },
        { value: '/projects', label: 'Projects', href: '#/projects' },
      ],
    },
    { value: '/orders', label: 'Orders', href: '#/orders', icon: 'cart', section: 'Store' },
    { value: '/products', label: 'Products', href: '#/products', icon: 'package', section: 'Store' },
    { value: '/customers', label: 'Customers', href: '#/customers', icon: 'users', section: 'Store' },
    { value: '/invoices', label: 'Invoices', href: '#/invoices', icon: 'invoice', section: 'Store' },
    { value: '/mail', label: 'Mail', href: '#/mail', icon: 'mail', section: 'Apps', badge: counts.inbox ? String(counts.inbox) : undefined },
    { value: '/calendar', label: 'Calendar', href: '#/calendar', icon: 'calendar', section: 'Apps' },
    { value: '/kanban', label: 'Kanban', href: '#/kanban', icon: 'columns', section: 'Apps' },
    { value: '/journal', label: 'Journal', href: '#/journal', icon: 'book', section: 'Apps' },
    {
      value: 'pages', label: 'Pages', icon: 'layers', section: 'Pages',
      children: [
        { value: '/profile', label: 'Profile', href: '#/profile' },
        { value: '/settings', label: 'Settings', href: '#/settings' },
        { value: '/pricing', label: 'Pricing', href: '#/pricing' },
        { value: '/auth/sign-in', label: 'Sign in', href: '#/auth/sign-in' },
        { value: '/auth/sign-up', label: 'Sign up', href: '#/auth/sign-up' },
        { value: '/does-not-exist', label: 'Error 404', href: '#/does-not-exist' },
      ],
    },
    { value: '/ui', label: 'UI elements', href: '#/ui', icon: 'grid', section: 'Pages' },
  ];
}

/** The sidebar entry for a route: the first path segment, or the dashboard path itself. */
function activeValue(route: Route) {
  if (['/', '/analytics', '/crm', '/projects'].includes(route.path)) return route.path;
  return `/${route.parts[0] || ''}`;
}

const COMMANDS = [
  { value: '#/', label: 'Go to eCommerce dashboard', keywords: 'home sales revenue' },
  { value: '#/analytics', label: 'Go to Analytics', keywords: 'traffic sessions visitors' },
  { value: '#/crm', label: 'Go to CRM', keywords: 'deals pipeline sales' },
  { value: '#/projects', label: 'Go to Projects', keywords: 'gantt timeline' },
  { value: '#/orders', label: 'Orders', keywords: 'sales purchases' },
  { value: '#/customers', label: 'Customers', keywords: 'people clients' },
  { value: '#/products', label: 'Products', keywords: 'catalogue inventory stock' },
  { value: '#/products?new=1', label: 'Add a product', keywords: 'create new' },
  { value: '#/invoices', label: 'Invoices', keywords: 'billing' },
  { value: '#/mail', label: 'Mail', keywords: 'inbox email' },
  { value: '#/mail?compose=1', label: 'Compose a message', keywords: 'write email new' },
  { value: '#/calendar', label: 'Calendar', keywords: 'events schedule' },
  { value: '#/kanban', label: 'Kanban board', keywords: 'tasks board' },
  { value: '#/journal/new', label: 'Write a journal post', keywords: 'blog article editor' },
  { value: '#/settings', label: 'Settings', keywords: 'preferences account' },
  { value: '#/profile', label: 'Your profile', keywords: 'account me' },
];

export function Shell({ route, mode, density, onToggleMode, onDensity, children }: Props) {
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [notifications, setNotifications] = React.useState(NOTIFICATIONS);
  const unread = notifications.filter((n) => n.unread).length;

  // Cmd/Ctrl+K opens the command palette from anywhere.
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Layout variant="shell" sidebarLabel="Main navigation">
      <AppHeader slot="header" bordered showMenuButton="narrow">
        <AppHeader.Start>
          <a className="lk-brand" href="#/" aria-label="Larkspur, eCommerce dashboard">
            <svg className="lk-mark" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="9" fill="var(--ui-color-primary)" />
              <path d="M16 7c2.6 3 2.6 6 0 9-2.6-3-2.6-6 0-9Zm-6.5 6c3.4.6 5.4 2.6 6 6-3.4-.6-5.4-2.6-6-6Zm13 0c-.6 3.4-2.6 5.4-6 6 .6-3.4 2.6-5.4 6-6ZM16 18v8" fill="none" stroke="var(--ui-color-primary-foreground, #fff)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <span>Larkspur</span>
          </a>
        </AppHeader.Start>
        <AppHeader.Center>
          <button type="button" className="lk-search" onClick={() => setPaletteOpen(true)} aria-keyshortcuts="Meta+K Control+K">
            <Icon name="search" decorative />
            <span className="lk-search-label">Search or jump to…</span>
            <Kbd>⌘K</Kbd>
          </button>
        </AppHeader.Center>
        <AppHeader.End>
          <Button variant="ghost" size="sm" className="lk-search-icon" aria-label="Search" onClick={() => setPaletteOpen(true)}>
            <Icon name="search" decorative />
          </Button>
          <Button variant="ghost" size="sm" aria-label={mode === 'dark' ? 'Use light theme' : 'Use dark theme'} onClick={onToggleMode}>
            <Icon name={mode === 'dark' ? 'sun' : 'moon'} decorative />
          </Button>

          <Dropdown placement="bottom" align="end" closeOnSelect={false}>
            <Button slot="trigger" variant="ghost" size="sm" className="lk-bell" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}>
              <Icon name="bell" decorative />
              {unread ? <span className="lk-dot" aria-hidden="true" /> : null}
            </Button>
            <Dropdown.Content className="lk-notifications">
              <Dropdown.SectionLabel>Notifications</Dropdown.SectionLabel>
              {notifications.map((item) => (
                <Dropdown.Item
                  key={item.id}
                  value={item.id}
                  caption={`${item.detail} · ${item.when}`}
                  icon={<span className={`lk-tone-dot tone-${item.tone}`} aria-hidden="true" />}
                  onClick={() => setNotifications((all) => all.map((n) => (n.id === item.id ? { ...n, unread: false } : n)))}
                >
                  {item.unread ? <strong>{item.title}</strong> : item.title}
                </Dropdown.Item>
              ))}
              <Dropdown.Separator />
              <Dropdown.Item value="read-all" icon="check" onClick={() => setNotifications((all) => all.map((n) => ({ ...n, unread: false })))}>
                Mark all as read
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>

          <Dropdown placement="bottom" align="end">
            <Button slot="trigger" variant="ghost" size="sm" className="lk-user-trigger" aria-label="Account menu, Maya Chen">
              <Avatar initials="MC" size="sm" alt="" tone="neutral" variant="soft" status="online" />
              <span className="lk-user-name">Maya Chen</span>
              <Icon name="chevron-down" decorative />
            </Button>
            <Dropdown.Content>
              <Dropdown.SectionLabel>maya.chen@example.com</Dropdown.SectionLabel>
              <Dropdown.Item value="profile" icon="user" onClick={() => navigate('/profile')}>Profile</Dropdown.Item>
              <Dropdown.Item value="settings" icon="settings" onClick={() => navigate('/settings')}>Settings</Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.SectionLabel>Density</Dropdown.SectionLabel>
              {(['compact', 'default', 'comfortable'] as const).map((value) => (
                <Dropdown.Item key={value} role="menuitemradio" data-group="density" value={value} checked={density === value} onClick={() => onDensity(value)}>
                  {value[0].toUpperCase() + value.slice(1)}
                </Dropdown.Item>
              ))}
              <Dropdown.Separator />
              <Dropdown.Item value="sign-out" icon="logout" onClick={() => navigate('/auth/sign-in')}>Sign out</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </AppHeader.End>
      </AppHeader>

      <Sidebar slot="sidebar" value={activeValue(route)} items={navItems()} variant="minimal" aria-label="Main navigation">
        <Sidebar.Footer>
          <div className="lk-plan">
            <Badge tone="brand" variant="soft" size="sm">Pro plan</Badge>
            <p>8 of 10 seats used. Renews July 1.</p>
            <a href="#/pricing">Compare plans</a>
          </div>
        </Sidebar.Footer>
      </Sidebar>

      <main slot="content" className="lk-content" id="main">
        {children}
      </main>

      <CommandPalette
        open={paletteOpen}
        query={query}
        placeholder="Search pages and actions"
        emptyText="Nothing matches. Try “orders” or “compose”."
        onQueryChange={(detail) => setQuery(detail.value)}
        onOpenChange={(detail) => { setPaletteOpen(detail.open); if (!detail.open) setQuery(''); }}
        onSelect={(detail) => {
          setPaletteOpen(false);
          setQuery('');
          if (detail.value) navigate(detail.value);
        }}
      >
        {COMMANDS.map((command) => (
          <CommandPalette.Item key={command.value} value={command.value} label={command.label} keywords={command.keywords}>
            {command.label}
          </CommandPalette.Item>
        ))}
      </CommandPalette>
    </Layout>
  );
}
