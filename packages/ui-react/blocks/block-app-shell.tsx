// block: An app layout: side navigation (a drawer on small screens), header and main region, with landmarks and a skip link.
import * as React from 'react';
import { Avatar, Box, Button, Flex, Heading, Item, ItemGroup, Text } from '@editora/ui-react';

export type AppShellNavItem = { label: string; href: string };

export type AppShellBlockProps = {
  title?: string;
  nav?: AppShellNavItem[];
  current?: string;
  user?: { name: string; email: string };
  children?: React.ReactNode;
};

const DEFAULT_NAV: AppShellNavItem[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Projects', href: '#projects' },
  { label: 'Team', href: '#team' },
  { label: 'Settings', href: '#settings' },
];

/**
 * An app layout: a side navigation (a drawer under 768px, opened from the header), a header and
 * the main region. Landmarks (nav, header, main) and a skip link are in place.
 */
export function AppShellBlock({ title = 'Acme', nav = DEFAULT_NAV, current = nav[0]?.href, user = { name: 'Ada Lovelace', email: 'ada@example.com' }, children }: AppShellBlockProps) {
  const [open, setOpen] = React.useState(false);
  const navId = React.useId();
  return (
    <Box style={{ minHeight: '100%', background: 'var(--ui-color-background)', color: 'var(--ui-color-text)' }}>
      <a href="#app-main" style={{ position: 'absolute', left: -9999 }} onFocus={(e) => { e.currentTarget.style.left = '8px'; }} onBlur={(e) => { e.currentTarget.style.left = '-9999px'; }}>Skip to content</a>
      <style>{`
        .ed-shell { display: grid; grid-template-columns: 240px minmax(0, 1fr); min-height: 100%; }
        .ed-shell-nav { border-inline-end: 1px solid var(--ui-color-border); padding: 12px; display: grid; align-content: start; gap: 16px; }
        .ed-shell-toggle { display: none; }
        @media (max-width: 767px) {
          .ed-shell { grid-template-columns: minmax(0, 1fr); }
          .ed-shell-nav { position: fixed; inset: 0 auto 0 0; width: 260px; z-index: 20; background: var(--ui-color-surface); transform: translateX(-100%); transition: transform 200ms ease; }
          .ed-shell-nav[data-open="true"] { transform: none; box-shadow: var(--ui-shadow-lg); }
          .ed-shell-toggle { display: inline-flex; }
        }
        @media (prefers-reduced-motion: reduce) { .ed-shell-nav { transition: none; } }
      `}</style>
      <div className="ed-shell">
        <nav id={navId} className="ed-shell-nav" data-open={open} aria-label="Main">
          <Heading level={2} size="md">{title}</Heading>
          <ItemGroup>
            {nav.map((entry) => (
              <Item key={entry.href} href={entry.href} label={entry.label} size="sm" variant={entry.href === current ? 'muted' : 'default'} aria-current={entry.href === current ? 'page' : undefined} />
            ))}
          </ItemGroup>
          <Item size="sm" label={user.name} description={user.email}>
            <Avatar slot="media" initials={user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)} size="sm" />
          </Item>
        </nav>
        <div>
          <header style={{ borderBlockEnd: '1px solid var(--ui-color-border)', padding: '10px 16px' }}>
            <Flex style={{ alignItems: 'center', gap: 10 }}>
              <Button className="ed-shell-toggle" variant="ghost" size="sm" aria-expanded={open} aria-controls={navId} onClick={() => setOpen((value) => !value)}>Menu</Button>
              <Text weight="semibold">{nav.find((entry) => entry.href === current)?.label}</Text>
            </Flex>
          </header>
          <main id="app-main" style={{ padding: 16 }}>{children}</main>
        </div>
      </div>
    </Box>
  );
}

export default AppShellBlock;
