import React, { useMemo, useState } from 'react';
import { CommandPalette, Button , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/CommandPalette',
  component: CommandPalette,
  argTypes: { open: { control: 'boolean' } }
};

const commands = [
  'Create document',
  'Insert image',
  'Toggle sidebar',
  'Export as PDF',
  'Open settings'
];

export const Default = (args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => setOpen(true)}>Open Palette</Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Flex>

      <CommandPalette
        open={open}
        onSelect={(idx) => {
          setSelected(idx);
          setOpen(false);
        }}
      >
        {commands.map((command) => (
          <Box key={command} slot="command" style={{ padding: 8, borderRadius: 6 }}>
            {command}
          </Box>
        ))}
      </CommandPalette>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Selected: {selected == null ? 'none' : commands[selected]}
      </Box>
    </Grid>
  );
};
Default.args = { open: false };

export const FilteredList = () => {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => commands.filter((command) => command.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter commands before rendering"
        style={{ maxWidth: 320, padding: 8, border: '1px solid #cbd5e1', borderRadius: 8 }}
      />
      <CommandPalette open={open} onSelect={() => setOpen(false)}>
        {filtered.map((command) => (
          <div key={command} slot="command">{command}</div>
        ))}
      </CommandPalette>
      <Button size="sm" variant="secondary" onClick={() => setOpen((v) => !v)}>
        Toggle palette
      </Button>
    </Grid>
  );
};
