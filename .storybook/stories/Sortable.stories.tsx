import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, Button, Input, Sortable, type SortableChangeDetail, type SortableItem, type SortableList, type SortableProps } from '@editora/ui-react';

const lists: SortableList[] = [
  {
    id: 'templates',
    label: 'Templates',
    description: 'Clone-only source list for reusable work.',
    cloneOnDrag: true,
    emptyLabel: 'Template shelf is empty.'
  },
  {
    id: 'backlog',
    label: 'Backlog',
    description: 'Single-list reordering and hierarchy live here.',
    emptyLabel: 'Nothing waiting in backlog.'
  },
  {
    id: 'active',
    label: 'In Progress',
    description: 'Cross-list transfer target for active work.',
    emptyLabel: 'Drag work here to start.'
  },
  {
    id: 'done',
    label: 'Done',
    description: 'Horizontal completion lane.',
    orientation: 'horizontal',
    emptyLabel: 'Completed cards show up here.'
  }
];

const initialItems: SortableItem[] = [
  { id: 'template-brief', label: 'Launch brief template', description: 'Reusable planning outline', listId: 'templates', cloneOnDrag: true },
  { id: 'template-qa', label: 'QA checklist', description: 'Reusable acceptance template', listId: 'templates', cloneOnDrag: true },
  { id: 'epic', label: 'Release epic', description: 'Top-level hierarchy parent', listId: 'backlog' },
  { id: 'brief', label: 'Draft launch brief', description: 'Can be nested under the epic', listId: 'backlog', parentId: 'epic' },
  { id: 'review', label: 'Design review', description: 'Move this across lanes to test transfers', listId: 'active' },
  { id: 'handoff', label: 'Support handoff', description: 'Finished work example', listId: 'done' },
];

const flatListLists: SortableList[] = [
  {
    id: 'queue',
    label: 'Editorial Queue',
    description: 'Simple single-column ranking with no nesting.',
    emptyLabel: 'Everything is scheduled.'
  }
];

const flatListItems: SortableItem[] = [
  { id: 'headline', label: 'Headline polish', description: 'Tighten tone and hierarchy', listId: 'queue' },
  { id: 'legal', label: 'Legal review', description: 'Required before release', listId: 'queue' },
  { id: 'seo', label: 'SEO metadata', description: 'Add title and description tags', listId: 'queue' },
  { id: 'publish', label: 'Publish checklist', description: 'Last release gate', listId: 'queue' },
];

const templateLists: SortableList[] = [
  {
    id: 'library',
    label: 'Template Library',
    description: 'Reusable templates stay here and clone on drag.',
    cloneOnDrag: true,
    emptyLabel: 'Drop reusable assets here.'
  },
  {
    id: 'campaign',
    label: 'Campaign Plan',
    description: 'Build a release plan from cloned templates.',
    emptyLabel: 'Drag templates in to start assembling the plan.'
  }
];

const templateItems: SortableItem[] = [
  { id: 'press-kit', label: 'Press kit template', description: 'Media bundle with assets and links', listId: 'library', cloneOnDrag: true },
  { id: 'email-series', label: 'Lifecycle email series', description: 'Announcement, reminder, and recap sequence', listId: 'library', cloneOnDrag: true },
  { id: 'launch-tweet', label: 'Social launch pack', description: 'Short-form copy variants for launch day', listId: 'library', cloneOnDrag: true },
  { id: 'owner-sync', label: 'Owner sync', description: 'Live plan item already in the campaign', listId: 'campaign' },
];

const hierarchyLists: SortableList[] = [
  {
    id: 'roadmap',
    label: 'Roadmap',
    description: 'Nest milestones under initiatives to create structure.',
    emptyLabel: 'Start with a top-level initiative.'
  }
];

const hierarchyItems: SortableItem[] = [
  { id: 'initiative', label: 'Reader retention initiative', description: 'Parent program for the quarter', listId: 'roadmap' },
  { id: 'survey', label: 'Audience survey', description: 'Research workstream', listId: 'roadmap', parentId: 'initiative' },
  { id: 'onboarding', label: 'Onboarding revamp', description: 'Conversion-focused checklist', listId: 'roadmap', parentId: 'initiative' },
  { id: 'experiment', label: 'Paywall experiment', description: 'Independent backlog item', listId: 'roadmap' },
];

const horizontalLists: SortableList[] = [
  {
    id: 'milestones',
    label: 'Milestones',
    description: 'Horizontal sequencing for release checkpoints.',
    orientation: 'horizontal',
    emptyLabel: 'No milestones yet.'
  }
];

const horizontalItems: SortableItem[] = [
  { id: 'brief-approved', label: 'Brief approved', listId: 'milestones' },
  { id: 'design-ready', label: 'Design ready', listId: 'milestones' },
  { id: 'content-final', label: 'Content final', listId: 'milestones' },
  { id: 'launch-live', label: 'Launch live', listId: 'milestones' },
];

const lockedLists: SortableList[] = [
  {
    id: 'ops',
    label: 'Operations Queue',
    description: 'Pinned records plus filtering and lock states.',
    emptyLabel: 'No operational work queued.'
  }
];

const lockedItems: SortableItem[] = [
  { id: 'incident', label: 'Incident review', description: 'Pinned until signed off', listId: 'ops', dragDisabled: true },
  { id: 'migration', label: 'Schema migration', description: 'High-risk scheduled change', listId: 'ops' },
  { id: 'analytics', label: 'Analytics audit', description: 'Backfill missing events', listId: 'ops' },
  { id: 'cleanup', label: 'Legacy cleanup', description: 'Refactor unused content rules', listId: 'ops' },
];

const largeBoardLists: SortableList[] = [
  {
    id: 'perf-backlog',
    label: 'Performance Backlog',
    description: 'Deep queue with initiatives, tasks, and subtasks.',
    emptyLabel: 'Backlog is clear.'
  },
  {
    id: 'perf-active',
    label: 'Execution Lane',
    description: 'Active work for transfer and regrouping.',
    emptyLabel: 'No work in progress.'
  },
  {
    id: 'perf-review',
    label: 'Review Queue',
    description: 'Verification and sign-off list.',
    emptyLabel: 'Nothing waiting for review.'
  }
];

const largeBoardItems: SortableItem[] = (() => {
  const items: SortableItem[] = [];

  for (let initiative = 1; initiative <= 6; initiative += 1) {
    const initiativeId = `perf-backlog-initiative-${initiative}`;
    items.push({
      id: initiativeId,
      label: `Initiative ${initiative}`,
      description: `Top-level planning group ${initiative}`,
      listId: 'perf-backlog'
    });

    for (let task = 1; task <= 6; task += 1) {
      const taskId = `perf-backlog-task-${initiative}-${task}`;
      items.push({
        id: taskId,
        label: `Task ${initiative}.${task}`,
        description: `Nested backlog task ${task} under initiative ${initiative}`,
        listId: 'perf-backlog',
        parentId: initiativeId
      });

      if (task <= 3) {
        items.push({
          id: `perf-backlog-subtask-${initiative}-${task}-1`,
          label: `Subtask ${initiative}.${task}.1`,
          description: 'Child work item for scale testing',
          listId: 'perf-backlog',
          parentId: taskId
        });
      }
    }
  }

  for (let item = 1; item <= 18; item += 1) {
    items.push({
      id: `perf-active-root-${item}`,
      label: `Active work ${item}`,
      description: 'Execution lane root task',
      listId: 'perf-active'
    });
  }

  for (let item = 1; item <= 12; item += 1) {
    items.push({
      id: `perf-review-root-${item}`,
      label: `Review item ${item}`,
      description: 'Queued verification item',
      listId: 'perf-review'
    });
  }

  return items;
})();

const meta = {
  title: 'UI/Sortable',
  component: Sortable,
  args: {
    lists,
    items: initialItems,
    selection: ['epic'],
    sort: 'manual',
    allowNesting: true,
    dropIndicatorVisibility: 'active',
    dragPreviewSize: 'match-item',
    dragHandleMode: 'handle',
    showSelectionBadge: true,
  },
  argTypes: {
    sort: { control: 'select', options: ['manual', 'label'] },
    persistKey: { control: 'text' },
    allowFilteredDrag: { control: 'boolean' },
    allowNesting: { control: 'boolean' },
    dropIndicatorVisibility: { control: 'select', options: ['active', 'always'] },
    dragPreviewSize: { control: 'select', options: ['match-item', 'compact'] },
    dragHandleMode: { control: 'select', options: ['handle', 'item'] },
    dragHandleSelector: { control: 'text' },
    itemRadius: { control: 'text' },
    handleRadius: { control: 'text' },
    listGap: { control: 'text' },
    itemSpacing: { control: 'text' },
    showSelectionBadge: { control: 'boolean' },
    disabled: { control: 'boolean' },
  }
} satisfies Meta<typeof Sortable>;

export default meta;

type Story = StoryObj<typeof meta>;

type DemoSurfaceProps = SortableProps & {
  title?: string;
  description?: string;
  showFilter?: boolean;
  showSortControls?: boolean;
};

function StatefulSortable({
  title = 'Production-ready sortable workflow',
  description = 'Drag from the handle, drop directly on an item body to nest, use Cmd/Ctrl-click or Shift-click for multi-select, and press Space then arrows for keyboard moves. Use the controls to switch preview sizing and drag activator modes.',
  showFilter = true,
  showSortControls = true,
  ...args
}: DemoSurfaceProps) {
  const [items, setItems] = React.useState<SortableItem[]>(args.items);
  const [selection, setSelection] = React.useState<string[]>(args.selection ?? []);
  const [filterQuery, setFilterQuery] = React.useState('');
  const [sort, setSort] = React.useState<SortableProps['sort']>(args.sort ?? 'manual');
  const [status, setStatus] = React.useState('Waiting for drag and drop activity.');

  React.useEffect(() => {
    setItems(args.items);
  }, [args.items]);

  React.useEffect(() => {
    setSelection(args.selection ?? []);
  }, [args.selection]);

  React.useEffect(() => {
    setSort(args.sort ?? 'manual');
  }, [args.sort]);

  const handlePersist = React.useCallback((detail: SortableChangeDetail) => {
    setStatus(
      `${detail.operation} via ${detail.source}: ${detail.movedIds.join(', ')}. ` +
      `Snapshot has ${detail.persistence.records.length} ordered records.`
    );
  }, []);

  const snapshot = items.map((item) => `${item.id}:${item.listId}:${item.parentId ?? 'root'}`).join('\n');

  return (
    <Box style={{ display: 'grid', gap: 18 }}>
      <Box
        style={{
          display: 'grid',
          gap: 12,
          padding: 18,
          borderRadius: 20,
          border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)',
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent), color-mix(in srgb, #0f766e 4%, var(--ui-color-surface, #ffffff)))'
        }}
      >
        <Box style={{ display: 'grid', gap: 8 }}>
          <strong>{title}</strong>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            {description}
          </Box>
        </Box>
        {(showFilter || showSortControls) && (
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: showFilter ? 'minmax(0, 1fr) auto auto' : 'auto auto',
              gap: 12,
              alignItems: 'end'
            }}
          >
            {showFilter && (
              <Input
                label="Filter cards"
                placeholder="Type to filter labels and descriptions"
                value={filterQuery}
                onChange={setFilterQuery}
              />
            )}
            {showSortControls && (
              <Button recipe={sort === 'manual' ? 'solid' : 'outline'} size="sm" onClick={() => setSort('manual')}>
                Manual sort
              </Button>
            )}
            {showSortControls && (
              <Button recipe={sort === 'label' ? 'solid' : 'outline'} size="sm" onClick={() => setSort('label')}>
                A-Z lock
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Sortable
        {...args}
        items={items}
        selection={selection}
        sort={sort}
        filterQuery={filterQuery}
        onItemsChange={setItems}
        onSelectionChange={(detail) => setSelection(detail.selection)}
        onPersistRequest={handlePersist}
      />

      <Box
        data-testid="sortable-status"
        style={{
          padding: 16,
          borderRadius: 18,
          background: 'color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, #eff6ff)',
          border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent)',
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13
        }}
      >
        {status}
      </Box>

      <pre
        data-testid="sortable-snapshot"
        style={{
          margin: 0,
          padding: 16,
          borderRadius: 18,
          background: '#0f172a',
          color: '#e2e8f0',
          fontSize: 12,
          lineHeight: 1.6,
          overflow: 'auto'
        }}
      >
        {snapshot}
      </pre>
    </Box>
  );
}

export const Playground: Story = {
  render: (args) => (
    <StatefulSortable
      {...args}
      title="Sortable playground"
      description="Use the Storybook controls to compare handle-only drag, whole-item drag, preview sizing, rail visibility, selection chrome, and radius styling in one place."
    />
  )
};

export const HandleVariations: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 24 }}>
      <StatefulSortable
        title="Built-in handle"
        description="The default mode keeps drag initiation on the built-in grip button, which is a good fit when cards contain clickable content."
        showFilter={false}
        lists={flatListLists}
        items={flatListItems}
        selection={['headline']}
        allowNesting={false}
        dragHandleMode="handle"
        showSelectionBadge={false}
      />
      <StatefulSortable
        title="Whole item drag"
        description="Switch to whole-item mode when the entire card should feel draggable and you do not need a dedicated grip."
        showFilter={false}
        lists={flatListLists}
        items={flatListItems}
        selection={['legal']}
        allowNesting={false}
        dragHandleMode="item"
        showSelectionBadge={false}
      />
      <StatefulSortable
        title="Custom selector handle"
        description="Use a selector when your custom JSX already has its own grip, icon, or affordance that should own drag initiation."
        showFilter={false}
        lists={flatListLists}
        items={flatListItems}
        selection={['seo']}
        allowNesting={false}
        showSelectionBadge={false}
        dragHandleSelector='[data-story-drag-grip]'
        renderItem={(item, context) => (
          <div
            style={{
              display: 'grid',
              gap: 10,
              padding: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                <strong style={{ fontSize: 14 }}>{item.label}</strong>
                {item.description && (
                  <div style={{ fontSize: 12, lineHeight: 1.6, color: '#64748b' }}>
                    {item.description}
                  </div>
                )}
              </div>
              <button
                type="button"
                data-story-drag-grip=""
                aria-label={`Drag ${item.label}`}
                style={{
                  display: 'inline-grid',
                  placeItems: 'center',
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  border: '1px solid #cbd5e1',
                  background: context.selected ? '#ecfeff' : '#f8fafc',
                  color: '#0f766e',
                  cursor: 'grab',
                  flexShrink: 0,
                }}
              >
                ::
              </button>
            </div>
          </div>
        )}
      />
    </Box>
  )
};

export const WholeItemDrag: Story = {
  render: () => (
    <StatefulSortable
      title="Whole item drag surface"
      description="Use item mode when you want the full card surface to initiate drag. A normal click still selects; drag begins only after movement crosses the threshold."
      showFilter={false}
      lists={flatListLists}
      items={flatListItems}
      selection={['headline']}
      allowNesting={false}
      dragHandleMode="item"
      showSelectionBadge={false}
    />
  )
};

export const CompactPreviewCard: Story = {
  render: () => (
    <StatefulSortable
      title="Compact drag preview"
      description="Use compact preview mode if you prefer the older floating card preview instead of matching the dragged item size."
      showFilter={false}
      lists={flatListLists}
      items={flatListItems}
      selection={['seo']}
      allowNesting={false}
      dragPreviewSize="compact"
      showSelectionBadge={false}
    />
  )
};

export const RadiusVariations: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 24 }}>
      <StatefulSortable
        title="Soft rounded cards"
        description="Use preset radius tokens when you want a softer editorial canvas without custom CSS."
        showFilter={false}
        lists={flatListLists}
        items={flatListItems}
        selection={['headline']}
        allowNesting={false}
        itemRadius="xl"
        handleRadius="full"
        showSelectionBadge={false}
      />
      <StatefulSortable
        title="Sharper utility layout"
        description="Dial the surfaces down when you want a denser operational list with cleaner edges."
        showFilter={false}
        lists={flatListLists}
        items={flatListItems}
        selection={['legal']}
        allowNesting={false}
        itemRadius="sm"
        handleRadius="sm"
        showSelectionBadge={false}
      />
      <StatefulSortable
        title="Custom CSS values"
        description="You can also pass raw CSS radius values like 24px, 1rem, or clamp(...) for full design control."
        showFilter={false}
        lists={flatListLists}
        items={flatListItems}
        selection={['seo']}
        allowNesting={false}
        itemRadius="24px"
        handleRadius="8px"
        showSelectionBadge={false}
      />
    </Box>
  )
};

export const ItemSpacingVariations: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 24 }}>
      <StatefulSortable
        title="Compact spacing"
        description="Use a tighter item gap when you want denser ranked lists or boards with more visible cards."
        showFilter={false}
        lists={flatListLists}
        items={flatListItems}
        selection={['headline']}
        allowNesting={false}
        itemSpacing="xs"
        showSelectionBadge={false}
      />
      <StatefulSortable
        title="Default spacing"
        description="The default gap is now slightly tighter than before, but still leaves enough separation for clean drag targets."
        showFilter={false}
        lists={flatListLists}
        items={flatListItems}
        selection={['legal']}
        allowNesting={false}
        showSelectionBadge={false}
      />
      <StatefulSortable
        title="Relaxed spacing"
        description="Open the list back up with a larger gap if your design wants more breathing room around each card."
        showFilter={false}
        lists={flatListLists}
        items={flatListItems}
        selection={['seo']}
        allowNesting={false}
        itemSpacing="18px"
        showSelectionBadge={false}
      />
    </Box>
  )
};

export const KanbanAndHierarchy: Story = {
  render: () => (
    <StatefulSortable
      lists={lists}
      items={initialItems}
      selection={['epic', 'brief']}
      sort="manual"
      persistKey="storybook-sortable-kanban"
    />
  )
};

export const FilteredAndLocked: Story = {
  render: () => (
    <StatefulSortable
      lists={lists}
      items={initialItems}
      selection={['review']}
      sort="label"
      allowNesting={false}
    />
  )
};

export const FlatListSorting: Story = {
  render: () => (
    <StatefulSortable
      title="Flat list sorting"
      description="A minimal single-list reorder example with clean idle spacing. No hierarchy, no transfer lanes, just direct ranking with the drag handle."
      showFilter={false}
      lists={flatListLists}
      items={flatListItems}
      selection={['legal']}
      allowNesting={false}
      showSelectionBadge={false}
    />
  )
};

export const FlatListMultiSelect: Story = {
  render: () => (
    <StatefulSortable
      title="Flat list multi-select"
      description="Use Cmd/Ctrl-click or Shift-click to select a group, then drag any selected item to reorder the batch together."
      showFilter={false}
      lists={flatListLists}
      items={flatListItems}
      selection={['legal', 'seo']}
      allowNesting={false}
      persistKey="storybook-sortable-flat-multi"
    />
  )
};

export const CloneLibrary: Story = {
  render: () => (
    <StatefulSortable
      title="Clone library"
      description="Template shelves are great for reusable content blocks. Dragging from the source list creates copies instead of moving the originals."
      showSortControls={false}
      lists={templateLists}
      items={templateItems}
      selection={['press-kit']}
      allowNesting={false}
      persistKey="storybook-sortable-clone-library"
    />
  )
};

export const NestedBacklog: Story = {
  render: () => (
    <StatefulSortable
      title="Nested backlog"
      description="Drop onto an item body or inside drop zone to turn work into sub-items and build a hierarchy."
      showFilter={false}
      lists={hierarchyLists}
      items={hierarchyItems}
      selection={['initiative']}
      allowNesting
      persistKey="storybook-sortable-hierarchy"
    />
  )
};

export const HorizontalLane: Story = {
  render: () => (
    <StatefulSortable
      title="Horizontal lane"
      description="A single horizontal list works well for milestones, release phases, or roadmap checkpoints."
      showFilter={false}
      showSortControls={false}
      lists={horizontalLists}
      items={horizontalItems}
      selection={['design-ready']}
      allowNesting={false}
    />
  )
};

export const LargeNestedBoard: Story = {
  render: () => (
    <StatefulSortable
      title="Large nested board"
      description="Use this heavier scenario to validate focus movement, selection updates, transfer flows, and general responsiveness on a denser nested dataset."
      showFilter={false}
      showSortControls={false}
      lists={largeBoardLists}
      items={largeBoardItems}
      selection={['perf-backlog-task-4-3']}
      allowNesting
      listGap="xs"
      itemSpacing="xs"
      showSelectionBadge={false}
      persistKey="storybook-sortable-large-board"
    />
  )
};

export const CleanCanvas: Story = {
  render: () => (
    <StatefulSortable
      title="Clean canvas"
      description="This matches the latest default presentation: idle drop rails stay hidden, selection still works, and the default Selected badge is removed for a more design-neutral surface."
      showFilter={false}
      lists={flatListLists}
      items={flatListItems}
      selection={['legal']}
      allowNesting={false}
      dropIndicatorVisibility="active"
      showSelectionBadge={false}
    />
  )
};

export const ExplicitDropRails: Story = {
  render: () => (
    <StatefulSortable
      title="Explicit drop rails"
      description="Use always-visible rails when you want to teach the interaction model or keep insertion affordances visible even before drag starts."
      showFilter={false}
      lists={flatListLists}
      items={flatListItems}
      selection={['seo']}
      allowNesting={false}
      dropIndicatorVisibility="always"
      showSelectionBadge={false}
    />
  )
};

export const PinnedAndFiltered: Story = {
  render: () => (
    <StatefulSortable
      title="Pinned and filtered"
      description="Pinned items stay in place with drag disabled, while filtering and alphabetical sorting can intentionally lock drag interactions."
      lists={lockedLists}
      items={lockedItems}
      selection={['incident']}
      sort="label"
      allowNesting={false}
    />
  )
};

export const CustomCards: Story = {
  render: () => (
    <StatefulSortable
      title="Custom JSX cards"
      description="Use renderItem when you want the sortable behavior but fully custom card markup inside each row. This example keeps the built-in Selected badge off so your design owns that state."
      showFilter={false}
      lists={flatListLists}
      items={flatListItems}
      selection={['headline']}
      allowNesting={false}
      showSelectionBadge={false}
      renderItem={(item, context) => (
        <div
          style={{
            display: 'grid',
            gap: 8,
            padding: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <strong style={{ fontSize: 14 }}>{item.label}</strong>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: 999,
                background: context.selected ? '#dcfce7' : '#e2e8f0',
                color: context.selected ? '#166534' : '#475569',
                fontSize: 11,
                fontWeight: 700
              }}
            >
              {context.selected ? 'Selected' : 'Ready'}
            </span>
          </div>
          {item.description && (
            <div style={{ fontSize: 12, lineHeight: 1.6, color: '#64748b' }}>
              {item.description}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#0f766e', fontWeight: 700 }}>
              {context.list?.label}
            </span>
            {context.dragDisabled && (
              <span style={{ fontSize: 11, color: '#b45309', fontWeight: 700 }}>
                Pinned
              </span>
            )}
          </div>
        </div>
      )}
    />
  )
};

export const CustomHandleSelector: Story = {
  render: () => (
    <StatefulSortable
      title="Custom handle selector"
      description="Pass dragHandleSelector when your custom JSX includes its own drag affordance and you want that specific element, not the full item, to start drag."
      showFilter={false}
      lists={flatListLists}
      items={flatListItems}
      selection={['headline']}
      allowNesting={false}
      showSelectionBadge={false}
      dragHandleSelector='[data-story-drag-grip]'
      renderItem={(item, context) => (
        <div
          style={{
            display: 'grid',
            gap: 10,
            padding: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
              <strong style={{ fontSize: 14 }}>{item.label}</strong>
              {item.description && (
                <div style={{ fontSize: 12, lineHeight: 1.6, color: '#64748b' }}>
                  {item.description}
                </div>
              )}
            </div>
            <button
              type="button"
              data-story-drag-grip=""
              aria-label={`Drag ${item.label}`}
              style={{
                display: 'inline-grid',
                placeItems: 'center',
                width: 34,
                height: 34,
                borderRadius: 12,
                border: '1px solid #cbd5e1',
                background: context.selected ? '#ecfeff' : '#f8fafc',
                color: '#0f766e',
                cursor: 'grab',
                flexShrink: 0,
              }}
            >
              ::
            </button>
          </div>
        </div>
      )}
    />
  )
};

export const CustomLists: Story = {
  render: () => (
    <StatefulSortable
      title="Custom list chrome"
      description="Use renderListHeader and renderEmptyState when you want branded lane headers, richer counts, or custom empty-state messaging."
      showFilter={false}
      lists={templateLists}
      items={templateItems.filter((item) => item.listId === 'library')}
      selection={['press-kit']}
      allowNesting={false}
      renderListHeader={(list, context) => (
        <div
          style={{
            display: 'grid',
            gap: 8,
            paddingBottom: 6,
            borderBottom: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <strong style={{ fontSize: 15 }}>{list.label}</strong>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: 999,
                background: '#e0f2fe',
                color: '#0c4a6e',
                fontSize: 11,
                fontWeight: 700
              }}
            >
              {context.itemCount} items
            </span>
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: '#64748b' }}>
            {list.description}
          </div>
        </div>
      )}
      renderEmptyState={(list) => (
        <div
          style={{
            display: 'grid',
            gap: 8,
            padding: 12,
            borderRadius: 16,
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            color: '#64748b',
            fontSize: 12,
          }}
        >
          <strong style={{ color: '#0f172a' }}>No items in {list.label}</strong>
          <span>Drag templates here to start assembling a plan.</span>
        </div>
      )}
    />
  )
};
