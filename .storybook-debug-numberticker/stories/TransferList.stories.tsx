import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, TransferList, type TransferListProps } from '@editora/ui-react';

const options = [
  { value: 'read', label: 'Read access', description: 'View workspaces, dashboards, and audit summaries.' },
  { value: 'write', label: 'Write access', description: 'Create, edit, and publish team content.' },
  { value: 'comment', label: 'Commenting', description: 'Review drafts and leave contextual feedback.' },
  { value: 'export', label: 'Exports', description: 'Download CSV and operational audit packages.' },
  { value: 'admin', label: 'Administration', description: 'Manage billing, roles, and org-level settings.' },
  { value: 'security', label: 'Security controls', description: 'Rotate keys, manage SSO, and review access logs.' }
];

const meta = {
  title: 'UI/TransferList',
  component: TransferList,
  args: {
    label: 'Workspace permissions',
    description: 'Move permissions into the selected column to grant them to the current role.',
    variant: 'surface',
    tone: 'brand',
    size: 'md',
    elevation: 'low',
    selectionIndicator: 'checkbox',
    addActionLabel: 'Add selected',
    removeActionLabel: 'Remove selected',
    showActionLabels: true,
    showActionCounts: true,
    showPanelCounts: true,
    options,
    value: ['read', 'comment'],
    availableLabel: 'Available permissions',
    selectedLabel: 'Granted permissions',
  },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'glass', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    selectionIndicator: { control: 'select', options: ['checkbox', 'tick', 'none'] },
    addActionLabel: { control: 'text' },
    removeActionLabel: { control: 'text' },
    showActionLabels: { control: 'boolean' },
    showActionCounts: { control: 'boolean' },
    showPanelCounts: { control: 'boolean' },
  }
} satisfies Meta<typeof TransferList>;

export default meta;

type Story = StoryObj<typeof meta>;

function StatefulTransferList(args: TransferListProps) {
  const [value, setValue] = React.useState<string[]>(args.value ?? []);

  React.useEffect(() => {
    setValue(args.value ?? []);
  }, [args.value]);

  return (
    <Box style={{ maxWidth: 1040 }}>
      <TransferList {...args} value={value} onValueChange={setValue} />
    </Box>
  );
}

export const Playground: Story = {
  render: (args) => <StatefulTransferList {...args} />
};

export const VariantGallery: Story = {
  render: () => {
    const variants: TransferListProps['variant'][] = ['surface', 'soft', 'solid', 'glass', 'contrast', 'minimal'];

    return (
      <Box style={{ display: 'grid', gap: 24 }}>
        {variants.map((variant) => (
          <StatefulTransferList
            key={variant}
            label={`${variant?.charAt(0).toUpperCase()}${variant?.slice(1)} transfer list`}
            description="The same transfer workflow shown with each supported surface treatment."
            variant={variant}
            tone={variant === 'contrast' ? 'info' : 'brand'}
            options={options}
            value={['read', 'export']}
            availableLabel="Available"
            selectedLabel="Selected"
          />
        ))}
      </Box>
    );
  }
};

export const SizeGallery: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 24 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <StatefulTransferList
          key={size}
          label={`${size.toUpperCase()} scale`}
          description="Size presets now scale the shell, items, copy, and action controls together."
          size={size}
          variant="soft"
          tone="success"
          elevation="low"
          options={options}
          value={['security']}
          availableLabel="Available controls"
          selectedLabel="Assigned controls"
        />
      ))}
    </Box>
  )
};

export const IndicatorGallery: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 24 }}>
      {(['checkbox', 'tick', 'none'] as const).map((selectionIndicator) => (
        <StatefulTransferList
          key={selectionIndicator}
          label={`${selectionIndicator.charAt(0).toUpperCase()}${selectionIndicator.slice(1)} indicator`}
          description="Transfer rows can use a boxed check, a lighter tick, or no leading indicator at all."
          selectionIndicator={selectionIndicator}
          variant="soft"
          tone="brand"
          options={options}
          value={['comment', 'security']}
          availableLabel="Available"
          selectedLabel="Selected"
        />
      ))}
    </Box>
  )
};

export const CompactActions: Story = {
  render: () => (
    <StatefulTransferList
      label="Compact transfer controls"
      description="Action labels and counters can be hidden when you want a tighter transfer surface."
      variant="minimal"
      tone="neutral"
      selectionIndicator="tick"
      showActionLabels={false}
      showActionCounts={false}
      showPanelCounts={false}
      options={options}
      value={['write', 'admin']}
      availableLabel="Available"
      selectedLabel="Selected"
    />
  )
};

export const ActionPresentationGallery: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 24 }}>
      <StatefulTransferList
        label="Default action rail"
        description="The full transfer pattern with explicit action labels and counts."
        variant="surface"
        tone="brand"
        selectionIndicator="checkbox"
        showActionLabels
        showActionCounts
        showPanelCounts
        options={options}
        value={['read', 'comment']}
        availableLabel="Available permissions"
        selectedLabel="Granted permissions"
      />

      <StatefulTransferList
        label="Icon-first action rail"
        description="Hide action labels and counts when the transfer surface needs to stay visually compact."
        variant="minimal"
        tone="neutral"
        selectionIndicator="tick"
        showActionLabels={false}
        showActionCounts={false}
        showPanelCounts={false}
        options={options}
        value={['write', 'admin']}
        availableLabel="Available"
        selectedLabel="Selected"
      />

      <StatefulTransferList
        label="Custom workflow language"
        description="Rename the actions when the transfer list represents approvals, grants, or assignment flows."
        variant="soft"
        tone="success"
        selectionIndicator="none"
        addActionLabel="Grant access"
        removeActionLabel="Revoke access"
        showActionLabels
        showActionCounts={false}
        showPanelCounts
        options={options}
        value={['security']}
        availableLabel="Unassigned controls"
        selectedLabel="Granted controls"
      />
    </Box>
  )
};
