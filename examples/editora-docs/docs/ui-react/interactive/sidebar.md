---
title: Sidebar
description: Resizable application sidebar with nested navigation, compound React wrappers, search, link items, promo sections, and responsive collapse behavior.
sidebar_label: Sidebar
---

# Sidebar

`Sidebar` is a token-driven navigation shell for product side rails, admin workspaces, content libraries, and app layouts. It supports nested items, search, custom row content, optional promo/footer regions, responsive collapse, and persisted width.

## Basic Usage

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarPromo,
  SidebarSearchInput
} from '@editora/ui-react';
import {
  BookIcon,
  DashboardIcon,
  FolderOpenIcon,
  HelpCircleIcon,
  SettingsIcon
} from '@editora/react-icons';

<Sidebar
  value="dashboard"
  collapsible
  resizable
  onSelect={(detail) => console.log(detail.value)}
>
  <SidebarHeader>
    <strong>Publify</strong>
  </SidebarHeader>

  <SidebarSearchInput placeholder="Search library" />

  <SidebarContent>
    <SidebarGroup title="Library">
      <SidebarItem value="dashboard" label="Dashboard" icon={<DashboardIcon />} />
      <SidebarItem value="library" label="My Library" icon={<FolderOpenIcon />} />
      <SidebarItem value="books" label="Books" icon={<BookIcon />} />
      <SidebarItem value="settings" label="Settings" icon={<SettingsIcon />}>
        <SidebarItem value="preferences" label="Preferences" />
        <SidebarItem value="devices" label="Devices" />
      </SidebarItem>
    </SidebarGroup>

    <SidebarGroup title="Support">
      <SidebarItem value="help" label="Help & Support" icon={<HelpCircleIcon />} />
    </SidebarGroup>
  </SidebarContent>

  <SidebarPromo>
    <div>Upgrade to premium</div>
  </SidebarPromo>

  <SidebarFooter>
    <div>Signed in as premium@publify.app</div>
  </SidebarFooter>
</Sidebar>;
```

## Compound Structure

The recommended React structure is:

```tsx
<Sidebar>
  <SidebarHeader />
  <SidebarSearchInput />
  <SidebarContent>
    <SidebarGroup>
      <SidebarItem />
      <SidebarItem />
    </SidebarGroup>
  </SidebarContent>
  <SidebarPromo />
  <SidebarFooter />
</Sidebar>
```

Available compound exports:

- `SidebarHeader`
- `SidebarSearch`
- `SidebarSearchInput`
- `SidebarContent`
- `SidebarGroup`
- `SidebarItem`
- `SidebarPromo`
- `SidebarFooter`

## Navigation Links

Leaf items can navigate to another route or page by using `href`.

```tsx
<SidebarItem
  value="guides"
  label="Guides"
  href="/guides"
/>

<SidebarItem
  value="docs"
  label="Documentation"
  href="https://example.com/docs"
  target="_blank"
  rel="noreferrer"
/>
```

Link items still participate in sidebar selection and styling, but render as anchors instead of buttons.

## Custom Item Content

`SidebarItem` can render custom row content instead of only `label` and `description`.

```tsx
<SidebarItem value="collections" href="#collections">
  <BookIcon />
  <span>Collections</span>
  <span>Curated reading lists</span>
</SidebarItem>
```

Behavior:

- the first non-text child can act as the leading icon
- remaining content is serialized into the row copy area
- nested `SidebarItem` children still become submenu items

## Nested Submenus

Submenus are created by nesting `SidebarItem` components.

```tsx
<SidebarItem value="settings" label="Settings" icon={<SettingsIcon />}>
  <SidebarItem value="preferences" label="Preferences" />
  <SidebarItem value="devices" label="Devices" />
  <SidebarItem value="security" label="Security" />
</SidebarItem>
```

Submenus:

- expand and collapse inline
- animate open and closed
- render submenu arrows only for items that actually own children

## Search

Use `SidebarSearchInput` for a ready-made search field, or `SidebarSearch` if you want to supply custom search UI.

```tsx
<Sidebar
  onSearchChange={(query) => console.log(query)}
>
  <SidebarSearchInput placeholder="Search…" />
</Sidebar>
```

You can also control filtering directly:

```tsx
<Sidebar searchQuery="books" />
```

## Baseline Defaults

Without passing any sizing props, the sidebar starts from a compact baseline:

- width: `236px`
- min width: `180px`
- max width: `320px`
- collapsed width: `72px`
- radius: `4px`
- item radius: `4px`
- item gap: `8px`
- item padding x: `6px`
- item padding y: `3px`
- item height: `45px`
- item font size: `12px`
- item line height: `22px`
- elevation: `high`

These defaults come from the shared theme tokens and can be overridden by props or `ThemeProvider`.

## Visual Props

### Shell

- `variant`: `surface | soft | floating | contrast | minimal | split`
- `size`: `sm | md | lg | 1 | 2 | 3`
- `density`: `compact | default | comfortable`
- `tone`: `default | brand | success | warning | danger`
- `radius`
- `elevation`: `none | low | high`

### Item Metrics

- `itemRadius`
- `itemGap`
- `itemPaddingX`
- `itemPaddingY`
- `itemHeight`
- `itemFontSize`
- `itemLineHeight`

### Layout / Behavior

- `collapsed`
- `collapsible`
- `rail`
- `resizable`
- `position`: `left | right`
- `width`
- `minWidth`
- `maxWidth`
- `collapsedWidth`
- `storageKey`
- `autoSave`
- `showIcons`
- `showBadges`
- `searchQuery`
- `sectionLabelTransform`: `uppercase | none | capitalize`

## Events

- `onSelect(detail)`
- `onChange(detail)`
- `onToggle(collapsed)`
- `onCollapseChange(collapsed)`
- `onWidthChange(detail)`
- `onSearchChange(query)`

## Responsive Behavior

The sidebar automatically collapses on small viewports. If the user manually expands or collapses it, that preference is respected instead of being immediately overridden.

## Theme Customization

You can override the sidebar globally through `ThemeProvider`.

```tsx
<ThemeProvider
  tokens={{
    components: {
      sidebar: {
        width: '280px',
        'item-height': '52px',
        'item-font-size': '14px',
        'item-radius': '10px'
      }
    }
  }}
>
  <Sidebar />
</ThemeProvider>
```

## Notes

- `SidebarContent` renders compound items into the underlying web component item model.
- `SidebarPromo` and `SidebarFooter` are optional.
- Section labels default to no text transformation.
- Collapsed mode hides copy, meta, promo, and footer content while keeping icon-first navigation accessible.
