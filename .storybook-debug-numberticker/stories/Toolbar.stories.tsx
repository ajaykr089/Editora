import React from 'react';
import { Box, Button, Grid, Toolbar, Toggle, ToggleGroup } from '@editora/ui-react';

export default {
  title: 'UI/Toolbar',
  component: Toolbar,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'soft', 'contrast', 'minimal'] },
    wrap: { control: 'boolean' }
  }
};

export const Default = (args: any) => (
  <Toolbar
    orientation={args.orientation || 'horizontal'}
    variant={args.variant || 'default'}
    wrap={args.wrap}
    aria-label="Editor toolbar"
  >
    <Button size="sm">Undo</Button>
    <Button size="sm">Redo</Button>
    <div data-separator />
    <ToggleGroup multiple value={["bold"]}>
      <Toggle value="bold">Bold</Toggle>
      <Toggle value="italic">Italic</Toggle>
      <Toggle value="underline">Underline</Toggle>
    </ToggleGroup>
    <div data-separator />
    <Button size="sm" variant="secondary">Comment</Button>
  </Toolbar>
);

Default.args = {
  orientation: 'horizontal',
  variant: 'default',
  wrap: false
};

export const VisualModes = () => (
  <Grid gap="14px" style={{ maxWidth: 860 }}>
    <Toolbar variant="default">
      <Button size="sm">Default</Button>
      <Button size="sm" variant="secondary">Actions</Button>
      <Toggle pressed>Pin</Toggle>
    </Toolbar>

    <Toolbar variant="soft" size="lg" wrap>
      <Button size="sm">Soft</Button>
      <Button size="sm" variant="secondary">Export</Button>
      <Toggle pressed tone="success">Live</Toggle>
      <Toggle>Preview</Toggle>
      <Toggle>Share</Toggle>
    </Toolbar>

    <Box variant="contrast" p="12px" radius="lg">
      <Toolbar variant="contrast" density="compact">
        <Button size="sm">Runtime</Button>
        <Button size="sm" variant="secondary">Logs</Button>
        <Toggle pressed tone="warning">Alerts</Toggle>
      </Toolbar>
    </Box>

    <Toolbar variant="minimal" orientation="vertical" style={{ maxWidth: 220 }}>
      <Button size="sm">Cut</Button>
      <Button size="sm">Copy</Button>
      <Button size="sm">Paste</Button>
    </Toolbar>
  </Grid>
);
