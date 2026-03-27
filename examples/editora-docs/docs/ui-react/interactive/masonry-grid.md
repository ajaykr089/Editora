---
title: MasonryGrid
description: CSS multi-column masonry layout for uneven-height cards, galleries, content walls, and visually packed columns.
sidebar_label: MasonryGrid
---

# MasonryGrid

`MasonryGrid` is the right layout primitive when items should keep their natural height and pack into columns without leaving the dead space you get from strict row alignment.

## Best For

- Uneven-height cards
- Gallery-style layouts
- Dashboard and content walls
- Visually packed columns

## Import

```tsx
import { MasonryGrid } from '@editora/ui-react';
// or subpath
import { MasonryGrid } from '@editora/ui-react/MasonryGrid';
```

## Basic Usage

```tsx
<MasonryGrid columns={{ initial: 1, md: 2, lg: 3 }} gap="lg">
  <article>Short card</article>
  <article>Taller card with more content</article>
  <article>Medium card</article>
</MasonryGrid>
```

## Uneven-Height Cards

```tsx
import { Card, MasonryGrid } from '@editora/ui-react';

function UnevenCardsExample() {
  return (
    <MasonryGrid columns={{ initial: 1, md: 2, lg: 3 }} gap="lg">
      <Card style={{ padding: 20, minHeight: 140 }}>Short summary</Card>
      <Card style={{ padding: 20, minHeight: 260 }}>
        Longer editorial note with more copy and metadata.
      </Card>
      <Card style={{ padding: 20, minHeight: 180 }}>Medium card</Card>
      <Card style={{ padding: 20, minHeight: 320 }}>
        Research digest with multiple sections.
      </Card>
    </MasonryGrid>
  );
}
```

## Gallery-Style Layouts

```tsx
import { Card, MasonryGrid } from '@editora/ui-react';

const images = [
  { id: 1, h: 180, src: '/img/gallery-1.jpg', alt: 'Editorial cover study' },
  { id: 2, h: 280, src: '/img/gallery-2.jpg', alt: 'Campaign moodboard' },
  { id: 3, h: 220, src: '/img/gallery-3.jpg', alt: 'Product still life' },
  { id: 4, h: 340, src: '/img/gallery-4.jpg', alt: 'Archive photography' }
];

function GalleryExample() {
  return (
    <MasonryGrid columnWidth="220px" gap="md">
      {images.map((image) => (
        <Card
          key={image.id}
          style={{
            padding: 12,
            borderRadius: 24,
            overflow: 'hidden'
          }}
        >
          <img
            src={image.src}
            alt={image.alt}
            style={{
              width: '100%',
              height: image.h,
              objectFit: 'cover',
              display: 'block',
              borderRadius: 18
            }}
          />
        </Card>
      ))}
    </MasonryGrid>
  );
}
```

## Dashboard And Content Walls

```tsx
import { Badge, Card, Flex, MasonryGrid } from '@editora/ui-react';

function DashboardWallExample() {
  return (
    <MasonryGrid columns={{ initial: 1, md: 2, xl: 4 }} gap="lg">
      <Card style={{ padding: 14, minHeight: 280, borderRadius: 24, overflow: 'hidden' }}>
        <Flex direction="column" gap="10px">
          <img
            src="/img/dashboard-revenue.jpg"
            alt="Revenue dashboard preview"
            style={{ width: '100%', height: 132, objectFit: 'cover', display: 'block', borderRadius: 16 }}
          />
          <Badge tone="brand">Revenue</Badge>
          <div>$128K this month</div>
        </Flex>
      </Card>

      <Card style={{ padding: 14, minHeight: 352, borderRadius: 24, overflow: 'hidden' }}>
        <img
          src="/img/dashboard-activity.jpg"
          alt="Team activity feed preview"
          style={{ width: '100%', height: 176, objectFit: 'cover', display: 'block', borderRadius: 16, marginBottom: 12 }}
        />
        Team activity feed
      </Card>
      <Card style={{ padding: 14, minHeight: 300, borderRadius: 24, overflow: 'hidden' }}>
        <img
          src="/img/dashboard-approvals.jpg"
          alt="Approvals queue preview"
          style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block', borderRadius: 16, marginBottom: 12 }}
        />
        Approvals queue
      </Card>
      <Card style={{ padding: 14, minHeight: 300, borderRadius: 24, overflow: 'hidden' }}>
        <img
          src="/img/dashboard-summary.jpg"
          alt="Performance narrative preview"
          style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', borderRadius: 16, marginBottom: 12 }}
        />
        Performance narrative and trends
      </Card>
    </MasonryGrid>
  );
}
```

## Visually Packed Columns

```tsx
import { Card, MasonryGrid } from '@editora/ui-react';

function PackedColumnsExample() {
  return (
    <MasonryGrid columns={4} columnGap="md" itemGap="md" fill="balance">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card
          key={index}
          style={{
            padding: 16,
            minHeight: 120 + (index % 4) * 50
          }}
        >
          Column item {index + 1}
        </Card>
      ))}
    </MasonryGrid>
  );
}
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `columns` | `Responsive<string \| number>` | Number of columns |
| `columnWidth` | `Responsive<string \| number>` | Preferred column width |
| `gap` | `Responsive<string \| number>` | Shared horizontal and vertical spacing |
| `columnGap` | `Responsive<string \| number>` | Space between columns |
| `itemGap` | `Responsive<string \| number>` | Space between stacked items |
| `fill` | `Responsive<'auto' \| 'balance' \| 'balance-all' \| string \| number>` | Column balancing strategy |
| `display` | `Responsive<string \| number>` | Host display override |
| `headless` | `boolean` | Hide the host entirely |

## Notes

- `MasonryGrid` uses CSS multi-column layout, so visual scan order follows columns.
- Use `columnWidth` for gallery-style walls and `columns` for more dashboard-like control.
- If visual row order must exactly match reading order, use `PlacementGrid` instead.
