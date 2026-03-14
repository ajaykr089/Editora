import React from 'react';
import { Box, Button, Flex, Grid, Menu, MenuItem, MenuSectionLabel, MenuSeparator } from '@editora/ui-react';

export default {
  title: 'UI/Menu',
  component: Menu,
  argTypes: {
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'flat', 'contrast'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    radius: { control: 'text' },
    tone: { control: 'select', options: ['default', 'neutral', 'info', 'success', 'warning', 'danger'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    closeOnSelect: { control: 'boolean' },
    typeahead: { control: 'boolean' }
  }
};

function menuContent() {
  return (
    <div slot="content">
      <MenuItem icon="✏" shortcut="R">Rename</MenuItem>
      <MenuItem icon="⧉" shortcut="D">Duplicate</MenuItem>
      <MenuSeparator />
      <MenuItem role="menuitemcheckbox" checked shortcut="⌘L" caption="Editor preference">
        Show line numbers
      </MenuItem>
      <MenuSeparator />
      <MenuItem tone="danger" icon="🗑" shortcut="⌘⌫">Delete permanently</MenuItem>
    </div>
  );
}

function PreviewMenu({
  label,
  menuProps,
  buttonRecipe = 'surface',
  children,
}: {
  label: React.ReactNode;
  menuProps?: Record<string, unknown>;
  buttonRecipe?: 'surface' | 'solid' | 'soft' | 'outline' | 'ghost' | 'classic';
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {children}
      <Menu
        open={open}
        onOpenChange={(next) => setOpen(Boolean(next))}
        {...menuProps}
      >
        <Button slot="trigger" recipe={buttonRecipe}>
          {label}
        </Button>
        {menuContent()}
      </Menu>
    </Flex>
  );
}

export const Playground = (args: any) => {
  const [lastAction, setLastAction] = React.useState('none');

  return (
    <Box style={{ padding: 64 }}>
      <Menu
        open={args.open}
        placement={args.placement}
        variant={args.variant}
        size={args.size}
        radius={args.radius}
        tone={args.tone}
        elevation={args.elevation}
        closeOnSelect={args.closeOnSelect}
        typeahead={args.typeahead}
        onSelectDetail={(detail) => {
          setLastAction(detail.label || detail.value || (typeof detail.index === 'number' ? `item-${detail.index}` : 'item'));
        }}
      >
        <Button slot="trigger" recipe="solid">Open menu</Button>
        {menuContent()}
      </Menu>
      <Box style={{ marginTop: 12, fontSize: 13, color: '#475569' }}>Last action: {lastAction}</Box>
    </Box>
  );
};

Playground.args = {
  open: false,
  placement: 'bottom',
  variant: 'surface',
  size: 'md',
  tone: 'default',
  elevation: 'default',
  closeOnSelect: true,
  typeahead: true,
  radius: ''
};

export const VariantGallery = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(260px, 1fr))', gap: 18, padding: 20 }}>
    {[
      ['Surface', { variant: 'surface' }],
      ['Soft', { variant: 'soft' }],
      ['Solid', { variant: 'solid' }],
      ['Outline', { variant: 'outline' }],
      ['Flat', { variant: 'flat', elevation: 'none' }],
      ['Contrast', { variant: 'contrast', elevation: 'high' }],
    ].map(([label, props]) => (
      <Box key={label as string} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>{label}</div>
        <PreviewMenu label="Open menu" menuProps={props as Record<string, unknown>} />
      </Box>
    ))}
  </Grid>
);

export const SizeGallery = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: '160px repeat(3, minmax(240px, 1fr))', gap: 18, padding: 20, alignItems: 'start' }}>
    <div />
    <div style={{ textAlign: 'center', color: '#64748b' }}>Surface</div>
    <div style={{ textAlign: 'center', color: '#64748b' }}>Soft</div>
    <div style={{ textAlign: 'center', color: '#64748b' }}>Solid</div>

    {(['sm', 'md', 'lg'] as const).map((size) => (
      <React.Fragment key={size}>
        <div style={{ fontSize: 18, color: '#64748b', alignSelf: 'center' }}>{size.toUpperCase()}</div>
        <PreviewMenu label="Open menu" menuProps={{ size, variant: 'surface' }} />
        <PreviewMenu label="Open menu" menuProps={{ size, variant: 'soft' }} />
        <PreviewMenu label="Open menu" menuProps={{ size, variant: 'solid' }} />
      </React.Fragment>
    ))}
  </Grid>
);

export const SelectionModes = () => {
  const [last, setLast] = React.useState('none');
  return (
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
      <Menu closeOnSelect={false} onSelectDetail={(detail) => setLast(detail.label || detail.value || 'item')}>
        <Button slot="trigger" recipe="surface">View options</Button>
        <div slot="content">
          <MenuSectionLabel>Canvas</MenuSectionLabel>
          <MenuItem role="menuitemcheckbox" checked data-value="show-grid">
            Show grid
          </MenuItem>
          <MenuItem role="menuitemcheckbox" data-value="snap-guides">
            Snap to guides
          </MenuItem>
          <MenuSeparator />
          <MenuSectionLabel>Mode</MenuSectionLabel>
          <MenuItem role="menuitemradio" data-group="mode" checked data-value="mode-edit">
            Mode: Edit
          </MenuItem>
          <MenuItem role="menuitemradio" data-group="mode" data-value="mode-review">
            Mode: Review
          </MenuItem>
        </div>
      </Menu>
      <Box style={{ fontSize: 13, color: '#475569' }}>Last action: {last}</Box>
    </Flex>
  );
};
