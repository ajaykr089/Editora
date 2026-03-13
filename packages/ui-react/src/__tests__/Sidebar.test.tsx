import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-sidebar';
import { DashboardIcon } from '@editora/react-icons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarPromo,
  SidebarSearch,
  SidebarSearchInput
} from '../components/Sidebar';

describe('Sidebar wrapper', () => {
  it('forwards nested items and visual props to the host element', () => {
    const items = [
      {
        value: 'library',
        label: 'Library',
        href: '/library',
        icon: <DashboardIcon />,
        children: [{ value: 'books', label: 'Books' }]
      }
    ];

    const { container } = render(
      <Sidebar
        items={items}
        variant="contrast"
        size="lg"
        density="comfortable"
        tone="warning"
        radius={24}
        itemRadius={12}
        itemGap={10}
        itemPaddingX={14}
        itemPaddingY={8}
        itemHeight={45}
        itemFontSize={15}
        itemLineHeight={22}
        sectionLabelTransform="none"
        searchQuery="books"
        elevation="high"
        resizable
      />
    );

    const el = container.querySelector('ui-sidebar') as HTMLElement | null;
    expect(el?.getAttribute('variant')).toBe('contrast');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('density')).toBe('comfortable');
    expect(el?.getAttribute('tone')).toBe('warning');
    expect(el?.getAttribute('radius')).toBe('24px');
    expect(el?.getAttribute('item-radius')).toBe('12px');
    expect(el?.getAttribute('item-gap')).toBe('10px');
    expect(el?.getAttribute('item-padding-x')).toBe('14px');
    expect(el?.getAttribute('item-padding-y')).toBe('8px');
    expect(el?.getAttribute('item-height')).toBe('45px');
    expect(el?.getAttribute('item-font-size')).toBe('15px');
    expect(el?.getAttribute('item-line-height')).toBe('22px');
    expect(el?.getAttribute('section-label-transform')).toBeNull();
    expect(el?.getAttribute('search-query')).toBe('books');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.hasAttribute('resizable')).toBe(true);
    const serialized = JSON.parse(el?.getAttribute('items') || '[]');
    expect(serialized[0].href).toBe('/library');
    expect(serialized[0].iconHtml).toContain('<svg');
    expect(serialized[0].children[0].value).toBe('books');
  });

  it('maps header, search, promo, and footer slots through the wrapper', () => {
    const { container } = render(
      <Sidebar>
        <SidebarHeader>Header</SidebarHeader>
        <SidebarSearch>Search</SidebarSearch>
        <SidebarPromo>Promo</SidebarPromo>
        <SidebarFooter>Footer</SidebarFooter>
      </Sidebar>
    );

    expect(container.querySelector('[slot="header"]')?.textContent).toBe('Header');
    expect(container.querySelector('[slot="search"]')?.textContent).toBe('Search');
    expect(container.querySelector('[slot="promo"]')?.textContent).toBe('Promo');
    expect(container.querySelector('[slot="footer"]')?.textContent).toBe('Footer');
  });

  it('renders SidebarSearchInput into the search slot', () => {
    const { container } = render(
      <Sidebar>
        <SidebarSearchInput placeholder="Search library" defaultValue="books" />
      </Sidebar>
    );

    const slotHost = container.querySelector('[slot="search"]') as HTMLElement | null;
    expect(slotHost?.querySelector('input[type="search"]')?.getAttribute('placeholder')).toBe('Search library');
  });

  it('renders grouped sidebar items into slot=item data nodes', () => {
    const { container } = render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup title="Library">
            <SidebarItem value="dashboard" label="Dashboard" icon={<DashboardIcon />} />
            <SidebarItem value="magazines" label="Magazines" icon="file">
              <SidebarItem value="editorial" label="Editorial picks" />
              <SidebarItem value="trending" label="Trending now" />
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );

    const items = Array.from(container.querySelectorAll('[slot="item"]')) as HTMLElement[];
    expect(items).toHaveLength(2);
    expect(items[0]?.dataset.section).toBe('Library');
    expect(items[0]?.dataset.label).toBe('Dashboard');
    expect(items[0]?.dataset.iconHtml).toContain('<svg');
    expect(items[1]?.dataset.children).toContain('Editorial picks');
  });

  it('forwards href metadata for link sidebar items', () => {
    const { container } = render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup title="Library">
            <SidebarItem value="books" label="Books" href="/books" target="_blank" rel="noreferrer" />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );

    const item = container.querySelector('[slot="item"]') as HTMLElement | null;
    expect(item?.dataset.href).toBe('/books');
    expect(item?.dataset.target).toBe('_blank');
    expect(item?.dataset.rel).toBe('noreferrer');
  });

  it('serializes custom item content when SidebarItem children are display markup', () => {
    const { container } = render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup title="Library">
            <SidebarItem value="collections">
              <span>Collections</span>
              <span>Curated reading lists</span>
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );

    const item = container.querySelector('[slot="item"]') as HTMLElement | null;
    expect(item?.dataset.contentHtml).toContain('Collections');
    expect(item?.dataset.contentHtml).toContain('Curated reading lists');
    expect(item?.dataset.children).toBeUndefined();
  });

  it('promotes a leading custom icon child into iconHtml for SidebarItem content markup', () => {
    const { container } = render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup title="Library">
            <SidebarItem value="guides" href="#guides">
              <DashboardIcon />
              <span>Guides</span>
              <span>Patterns and implementation notes</span>
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );

    const item = container.querySelector('[slot="item"]') as HTMLElement | null;
    expect(item?.dataset.iconHtml).toContain('<svg');
    expect(item?.dataset.contentHtml).toContain('Guides');
    expect(item?.dataset.contentHtml).toContain('Patterns and implementation notes');
  });
});
