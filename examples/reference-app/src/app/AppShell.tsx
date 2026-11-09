import React from 'react';
import { AppHeader } from '@editora/ui-react/AppHeader';
import { Avatar } from '@editora/ui-react/Avatar';
import { Button } from '@editora/ui-react/Button';
import { Icon } from '@editora/ui-react/Icon';
import { Layout } from '@editora/ui-react/Layout';
import { Sidebar } from '@editora/ui-react/Sidebar';
import type { Route } from './router';

type Props = { route: Route; mode: 'light' | 'dark'; onToggleMode: () => void; children: React.ReactNode };

const ITEMS = [
  { value: 'dashboard', label: 'Dashboard', href: '#/app', icon: 'dashboard', section: 'Workspace' },
  { value: 'expenses', label: 'Expenses', href: '#/app/expenses', icon: 'receipt', section: 'Workspace' },
  { value: 'approvals', label: 'Approvals', href: '#/app/expenses?status=submitted', icon: 'inbox', section: 'Workspace' },
  { value: 'reports', label: 'Reports', href: '#/app', icon: 'chart-pie', section: 'Workspace' },
  { value: 'cards', label: 'Cards', href: '#/app', icon: 'credit-card', section: 'Company' },
  { value: 'people', label: 'People', href: '#/app', icon: 'users', section: 'Company' },
  { value: 'settings', label: 'Settings', href: '#/app', icon: 'settings', section: 'Company' },
];

function activeItem(route: Route) {
  if (route.name === 'expenses' || route.name === 'expense' || route.name === 'new-expense') {
    return window.location.hash.includes('status=submitted') ? 'approvals' : 'expenses';
  }
  return 'dashboard';
}

/** The product's frame: header, sectioned sidebar (a drawer on narrow screens) and content. */
export function AppShell({ route, mode, onToggleMode, children }: Props) {
  return (
    <Layout variant="shell" sidebarLabel="Main navigation">
      <AppHeader slot="header" bordered showMenuButton="narrow">
        <AppHeader.Start>
          <a className="app-brand" href="#/" aria-label="Tallyhawk, back to the website">
            <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="9" fill="var(--ui-color-primary)" />
              <path d="M9 21.5 14.5 9M15 21.5 20.5 9M21 21.5 24 15" stroke="var(--th-on-primary)" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M7.5 17.5h17" stroke="var(--th-amber)" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
            <span>Tallyhawk</span>
          </a>
        </AppHeader.Start>
        <AppHeader.End>
          <Button variant="ghost" size="sm" aria-label={mode === 'dark' ? 'Use light theme' : 'Use dark theme'} onClick={onToggleMode}>
            <Icon name={mode === 'dark' ? 'sun' : 'moon'} decorative />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Notifications"><Icon name="bell" decorative /></Button>
          <Avatar initials="MC" size="sm" alt="Maya Chen" tone="neutral" variant="soft" />
        </AppHeader.End>
      </AppHeader>
      <Sidebar slot="sidebar" value={activeItem(route)} items={ITEMS} variant="minimal" aria-label="Main navigation" />
      <main slot="content" className="app-content">
        {children}
      </main>
    </Layout>
  );
}
