---
title: Sidebar
description: Resizable application sidebar with nested navigation, compound React wrappers, search, link items, promo sections, and responsive collapse behavior.
sidebar_label: Sidebar
---

# Sidebar

`Sidebar` is a token-driven navigation shell for product side rails, admin workspaces, content libraries, and app layouts. It supports nested items, search, custom row content, optional promo/footer regions, responsive collapse, and persisted width.

## Basic Usage

```tsx live
function SidebarDemo() {
  return (
    <ThemeProvider>
      <Sidebar
        value="dashboard"
        collapsible
        resizable
        onSelect={(detail) => console.log(detail.value)}
      >
        <Sidebar.Header>
          <strong>Publify</strong>
        </Sidebar.Header>

        <Sidebar.SearchInput placeholder="Search library" />

        <Sidebar.Content>
          <Sidebar.Group title="Library">
            <Sidebar.Item value="dashboard" label="Dashboard" icon={<DashboardIcon />} />
            <Sidebar.Item value="library" label="My Library" icon={<FolderOpenIcon />} />
            <Sidebar.Item value="books" label="Books" icon={<BookIcon />} />
            <Sidebar.Item value="settings" label="Settings" icon={<SettingsIcon />}>
              <Sidebar.Item value="preferences" label="Preferences" />
              <Sidebar.Item value="devices" label="Devices" />
            </Sidebar.Item>
          </Sidebar.Group>

          <Sidebar.Group title="Support">
            <Sidebar.Item value="help" label="Help & Support" icon={<HelpCircleIcon />} />
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Promo>
          <div>Upgrade to premium</div>
        </Sidebar.Promo>

        <Sidebar.Footer>
          <div>Signed in as premium@publify.app</div>
        </Sidebar.Footer>
      </Sidebar>
    </ThemeProvider>
  );
}
```

## Compound Structure

The recommended React structure is:

```tsx
<Sidebar>
  <Sidebar.Header />
  <Sidebar.SearchInput />
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.Item />
      <Sidebar.Item />
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Promo />
  <Sidebar.Footer />
</Sidebar>
```

Available compound exports:

- `Sidebar.Header`
- `Sidebar.Search`
- `Sidebar.SearchInput`
- `Sidebar.Content`
- `Sidebar.Group`
- `Sidebar.Item`
- `Sidebar.Promo`
- `Sidebar.Footer`

## Navigation Links

Leaf items can navigate to another route or page by using `href`.

```tsx
<Sidebar.Item
  value="guides"
  label="Guides"
  href="/guides"
/>

<Sidebar.Item
  value="docs"
  label="Documentation"
  href="https://example.com/docs"
  target="_blank"
  rel="noreferrer"
/>
```

Link items still participate in sidebar selection and styling, but render as anchors instead of buttons.

## Custom Item Content

`Sidebar.Item` can render custom row content instead of only `label` and `description`.

```tsx
<Sidebar.Item value="collections" href="#collections">
  <BookIcon />
  <span>Collections</span>
  <span>Curated reading lists</span>
</Sidebar.Item>
```

Behavior:

- the first non-text child can act as the leading icon
- remaining content is serialized into the row copy area
- nested `Sidebar.Item` children still become submenu items

## Nested Submenus

Submenus are created by nesting `Sidebar.Item` components.

```tsx
<Sidebar.Item value="settings" label="Settings" icon={<SettingsIcon />}>
  <Sidebar.Item value="preferences" label="Preferences" />
  <Sidebar.Item value="devices" label="Devices" />
  <Sidebar.Item value="security" label="Security" />
</Sidebar.Item>
```

Submenus:

- expand and collapse inline
- animate open and closed
- render submenu arrows only for items that actually own children

## Search

Use `Sidebar.SearchInput` for a ready-made search field, or `Sidebar.Search` if you want to supply custom search UI.

```tsx
<Sidebar
  onSearchChange={(query) => console.log(query)}
>
  <Sidebar.SearchInput placeholder="Search…" />
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

- `Sidebar.Content` renders compound items into the underlying web component item model.
- `Sidebar.Promo` and `Sidebar.Footer` are optional.
- Section labels default to no text transformation.
- Collapsed mode hides copy, meta, promo, and footer content while keeping icon-first navigation accessible.
