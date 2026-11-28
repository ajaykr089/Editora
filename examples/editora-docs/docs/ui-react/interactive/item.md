---
title: "Item"
description: "A list row with media, title, description and actions, for settings, members, files and results lists."
sidebar_label: "Item"
---

# Item

```tsx
import { Avatar, Button, Item, ItemGroup, Switch } from '@editora/ui-react';

## Try it

```tsx live
function Example() {
  return (
    <ThemeProvider>
      <Box style={{ maxWidth: 520 }}>
        <ItemGroup divided>
          <Item href="#ada" label="Ada Lovelace" description="ada@example.com">
            <Avatar slot="media" initials="AL" />
            <Button slot="actions" size="sm" variant="ghost">Remove</Button>
          </Item>
          <Item label="Notifications" description="Email and push">
            <Switch slot="actions" aria-label="Notifications" />
          </Item>
        </ItemGroup>
      </Box>
    </ThemeProvider>
  );
}
```

<ItemGroup divided>
  <Item href="/team/ada" label="Ada Lovelace" description="ada@example.com">
    <Avatar slot="media" initials="AL" />
    <Button slot="actions" size="sm" variant="ghost">Remove</Button>
  </Item>
  <Item label="Notifications" description="Email and push" mediaVariant="icon">
    <BellIcon slot="media" />
    <Switch slot="actions" aria-label="Notifications" />
  </Item>
</ItemGroup>
```

Slots: `media`, `title`, `description`, `actions`, `header`, `footer`, and the default slot (more content under the description). `label` and `description` props are shortcuts for the two text slots.

With `href`, the media and text become one link named by the title and description, while the actions stay separate buttons beside it, so there is never a button inside a link. `target="_blank"` adds `rel="noopener noreferrer"`.

| Prop | Values | Default |
| --- | --- | --- |
| `variant` | `default` `outline` `muted` | `default` |
| `size` | `sm` `md` | `md` |
| `mediaVariant` | `icon` (tinted square) `image` (cover-cropped) | |
| `href`, `target`, `rel` | make it a link | |
| `disabled` | | `false` |

`ItemGroup` is a `role="list"` and each `Item` in it a listitem, including items added later. `divided` draws a rule between items.

See the API reference for [Item](../api/item) and [ItemGroup](../api/item-group).
