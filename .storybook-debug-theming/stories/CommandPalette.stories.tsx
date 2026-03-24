import React, { useMemo, useState } from 'react';
import { CommandPalette, Button , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/CommandPalette',
  component: CommandPalette,
  argTypes: { open: { control: 'boolean' } }
};

const commands = [
  { value: 'create-doc', label: 'Create document' },
  { value: 'insert-image', label: 'Insert image' },
  { value: 'toggle-sidebar', label: 'Toggle sidebar' },
  { value: 'export-pdf', label: 'Export as PDF' },
  { value: 'settings', label: 'Open settings' }
];

export const Default = (args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => setOpen(true)}>Open Palette</Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Flex>

      <CommandPalette
        open={open}
        query={query}
        placeholder="Search workflows"
        emptyText="No command matches"
        onQueryChange={(detail) => setQuery(detail.value)}
        onSelect={(detail) => {
          setSelected(detail.value || null);
          setOpen(false);
        }}
      >
        {commands.map((command) => (
          <CommandPalette.Item
            key={command.value}
            value={command.value}
            label={command.label}
            style={{ padding: 8, borderRadius: 6 }}
          >
            {command.label}
          </CommandPalette.Item>
        ))}
      </CommandPalette>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Selected: {selected || 'none'} • query: {query || 'empty'}
      </Box>
    </Grid>
  );
};
Default.args = { open: false };

export const FilteredList = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => commands.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => setOpen(true)}>Open Palette</Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Flex>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter commands before rendering"
        style={{ maxWidth: 320, padding: 8, border: '1px solid #cbd5e1', borderRadius: 8 }}
      />

      <CommandPalette 
        open={open} 
        query={query}
        placeholder="Search commands..."
        onQueryChange={(detail) => setQuery(detail.value)}
        onSelect={() => setOpen(false)}
      >
        {filtered.map((command) => (
          <CommandPalette.Item
            key={command.value}
            value={command.value}
            label={command.label}
          >
            {command.label}
          </CommandPalette.Item>
        ))}
      </CommandPalette>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Palette is {open ? 'open' : 'closed'} • Filtered results: {filtered.length}
      </Box>
    </Grid>
  );
};
