'use client';

import React from 'react';
import { Anchor, Badge, Box, Container, Flex, Grid, Section } from '@editora/ui-react/client';

export type DemoRoute = {
  href: string;
  title: string;
  eyebrow: string;
  description: string;
  components: string[];
};

export const demoRoutes: DemoRoute[] = [
  {
    href: '/server',
    title: 'Server',
    eyebrow: 'RSC-safe Components',
    description: 'A dedicated server-rendered route that demonstrates the components exported by @editora/ui-react/server without relying on client wrappers.',
    components: [
      'Anchor',
      'AspectRatio',
      'Box',
      'Container',
      'DirectionProvider',
      'Field',
      'Flex',
      'Grid',
      'Icon',
      'Label',
      'Section',
      'Separator',
      'VisuallyHidden',
    ],
  },
  {
    href: '/foundation',
    title: 'Foundation',
    eyebrow: 'Layout & Feedback',
    description: 'Core layout primitives, media surfaces, alerts, empty states, and general presentation wrappers.',
    components: [
      'Alert',
      'AlertActions',
      'AlertDescription',
      'AlertIcon',
      'AlertTitle',
      'Anchor',
      'AspectRatio',
      'Avatar',
      'Badge',
      'Box',
      'Button',
      'Container',
      'DirectionProvider',
      'EmptyState',
      'Flex',
      'Grid',
      'Icon',
      'Section',
      'Separator',
      'Skeleton',
      'VisuallyHidden',
    ],
  },
  {
    href: '/forms',
    title: 'Forms',
    eyebrow: 'Text & Entry',
    description: 'Field semantics, text inputs, secure inputs, token inputs, and responsive PIN/OTP demos.',
    components: [
      'ControlGroup',
      'Description',
      'Field',
      'FieldError',
      'Fieldset',
      'Input',
      'Label',
      'NumberField',
      'OTPInput',
      'PasswordField',
      'PinInput',
      'TagsInput',
      'Textarea',
    ],
  },
  {
    href: '/selection',
    title: 'Selection',
    eyebrow: 'Choices & Indicators',
    description: 'Interactive controls, status meters, animated counters, slider controls, and step-based workflows.',
    components: [
      'AnimatedNumber',
      'Checkbox',
      'ColorPicker',
      'Meter',
      'Progress',
      'RadioGroup',
      'Select',
      'Slider',
      'Stepper',
      'Switch',
      'Toggle',
    ],
  },
  {
    href: '/dates',
    title: 'Date & Time',
    eyebrow: 'Calendars & Pickers',
    description: 'All calendar and picker wrappers split into dedicated, scroll-safe demo surfaces.',
    components: [
      'Calendar',
      'DateField',
      'DatePicker',
      'DateRangePicker',
      'DateRangeTimePicker',
      'DateTimePicker',
      'TimeField',
      'TimePicker',
    ],
  },
  {
    href: '/hooks',
    title: 'Hooks',
    eyebrow: 'Animated APIs',
    description: 'The two non-component exports from the client barrel, each exercised with a live visual demo.',
    components: [
      'useAnimatedNumber',
      'useAnimatedNumberValue',
    ],
  },
  {
    href: '/advanced',
    title: 'Advanced',
    eyebrow: 'Data & Composition',
    description: 'Higher-level wrappers from the broader ui-react surface, including accordions, tabs, charts, cards, and richer table demos.',
    components: [
      'Accordion',
      'Card',
      'Chart',
      'DataTable',
      'Pagination',
      'Table',
      'Tabs',
    ],
  },
  {
    href: '/overlays',
    title: 'Overlays',
    eyebrow: 'Navigation & Floating UI',
    description: 'Navigation trails, disclosure shells, floating surfaces, menus, and dismissible overlays from the broader ui-react surface.',
    components: [
      'Breadcrumb',
      'Collapsible',
      'Dialog',
      'Drawer',
      'Dropdown',
      'Menubar',
      'Popover',
      'QuickActions',
      'Tooltip',
    ],
  },
  {
    href: '/workflow',
    title: 'Workflow',
    eyebrow: 'Inputs & Process',
    description: 'More advanced entry and workflow components including comboboxes, multi-select controls, transfer lists, uploads, timelines, ratings, and wizards.',
    components: [
      'Combobox',
      'Dropzone',
      'FileUpload',
      'MultiSelect',
      'Rating',
      'Timeline',
      'TransferList',
      'Wizard',
    ],
  },
  {
    href: '/shells',
    title: 'Shells',
    eyebrow: 'App Chrome & Layout',
    description: 'Application-shell components for headers, nav structures, sidebars, trees, panel splits, and slotted page layouts.',
    components: [
      'AppHeader',
      'Layout',
      'NavigationMenu',
      'Panel',
      'PanelGroup',
      'Sidebar',
      'Splitter',
      'Tree',
    ],
  },
  {
    href: '/motion',
    title: 'Motion',
    eyebrow: 'Animated Display',
    description: 'Expressive display components for hero copy, counters, clouds, beams, marquees, docks, orbiters, and animated lists.',
    components: [
      'AnimatedBeam',
      'AnimatedList',
      'AnimatedText',
      'Dock',
      'IconCloud',
      'Marquee',
      'NumberTicker',
      'Orbiter',
      'SpinningText',
    ],
  },
  {
    href: '/studio',
    title: 'Studio',
    eyebrow: 'Commands & Editor UI',
    description: 'Command surfaces, menus, selection utilities, inline editing, floating toolbars, and other editor-style wrappers that were still missing from the fixture.',
    components: [
      'AlertDialog',
      'BlockControls',
      'Command',
      'CommandPalette',
      'ContextMenu',
      'FloatingToolbar',
      'HoverCard',
      'InlineEdit',
      'Menu',
      'PluginPanel',
      'ScrollArea',
      'SelectionPopup',
      'SplitButton',
      'ToggleGroup',
      'Toolbar',
    ],
  },
  {
    href: '/systems',
    title: 'Systems',
    eyebrow: 'Forms, Grids & Planning',
    description: 'The final feature-level gaps from the broader ui-react surface: managed forms, toast notifications, planning timelines, and the advanced placement and masonry grid wrappers.',
    components: [
      'Form',
      'Gantt',
      'MasonryGrid',
      'PlacementGrid',
      'Toast',
    ],
  },
];

export const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  padding: '40px 24px 64px',
  display: 'grid',
  gap: 20,
  alignItems: 'start',
  background: 'linear-gradient(180deg, #f8fbff 0%, #eef3fb 100%)',
};

export const cardStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
  padding: 20,
  borderRadius: 20,
  border: '1px solid rgba(148, 163, 184, 0.24)',
  background: 'rgba(255, 255, 255, 0.92)',
  boxShadow: '0 18px 38px rgba(15, 23, 42, 0.08)',
};

export const eyebrowStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#64748b',
};

export const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  lineHeight: 1.15,
  color: '#0f172a',
};

export const hintStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: '#475569',
};

export const stageStyle: React.CSSProperties = {
  display: 'grid',
  gap: 14,
  justifyItems: 'start',
  alignItems: 'start',
  alignContent: 'start',
  padding: 16,
  borderRadius: 18,
  background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.94))',
  border: '1px solid rgba(148, 163, 184, 0.2)',
};

export const scrollerStyle: React.CSSProperties = {
  overflowX: 'auto',
  overflowY: 'hidden',
  paddingBottom: 6,
};

function asWrapperChildren(children: React.ReactElement | React.ReactElement[]) {
  return children as unknown as any;
}

export function ShowcaseCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactElement | React.ReactElement[];
}) {
  return (
    <Box style={cardStyle}>
      <Grid style={{ display: 'grid', gap: 6 }}>
        <Box style={eyebrowStyle}>{eyebrow}</Box>
        <Box style={titleStyle}>{title}</Box>
        <Box style={hintStyle}>{description}</Box>
      </Grid>
      {asWrapperChildren(children)}
    </Box>
  );
}

export function ShowcaseShell({
  currentHref,
  eyebrow,
  title,
  description,
  children,
}: {
  currentHref: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactElement | React.ReactElement[];
}) {
  return (
    <Container size="lg">
      <Section style={pageStyle}>
        <Box
          style={{
            ...cardStyle,
            gap: 18,
            background:
              'radial-gradient(circle at top right, rgba(37, 99, 235, 0.14), transparent 34%), rgba(255, 255, 255, 0.96)',
          }}
        >
          <Grid style={{ display: 'grid', gap: 10 }}>
            <Box style={eyebrowStyle}>{eyebrow}</Box>
            <Box style={{ fontSize: 30, lineHeight: 1.05, fontWeight: 900, color: '#0f172a' }}>{title}</Box>
            <Box style={{ ...hintStyle, maxWidth: 860 }}>{description}</Box>
          </Grid>

          <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Badge tone="success">Split by route for faster loading</Badge>
            <Badge tone="info">Coverage expanding beyond the client barrel</Badge>
          </Flex>

          <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Anchor href="/" style={navLinkStyle(currentHref === '/')}>Overview</Anchor>
            {demoRoutes.map((route) => (
              <Anchor key={route.href} href={route.href} style={navLinkStyle(currentHref === route.href)}>
                {route.title}
              </Anchor>
            ))}
          </Flex>
        </Box>

        <Grid style={{ display: 'grid', gap: 20 }}>
          {asWrapperChildren(children)}
        </Grid>
      </Section>
    </Container>
  );
}

function navLinkStyle(active: boolean): React.CSSProperties {
  return {
    padding: '10px 14px',
    borderRadius: 999,
    border: active ? '1px solid rgba(37, 99, 235, 0.36)' : '1px solid rgba(148, 163, 184, 0.22)',
    background: active ? 'rgba(37, 99, 235, 0.12)' : 'rgba(255, 255, 255, 0.86)',
    color: active ? '#1d4ed8' : '#0f172a',
    fontWeight: 700,
    textDecoration: 'none',
  };
}
