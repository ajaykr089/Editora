import React from 'react';
import { Box, Grid, Icon } from '@editora/ui-react';
import { iconNameList } from '@editora/icons';

export default {
  title: 'UI/Icons Catalog',
  component: Icon,
  argTypes: {
    iconVariant: { control: 'select', options: ['outline', 'solid', 'duotone'] },
    size: { control: 'number' },
    strokeWidth: { control: 'number' },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    color: { control: 'color' },
    secondaryColor: { control: 'color' }
  }
};

export const AllIcons = (args: any) => {
  const [query, setQuery] = React.useState('');

  const filteredNames = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return iconNameList;
    return iconNameList.filter((name) => name.includes(term));
  }, [query]);

  return (
    <Box style={{ display: 'grid', gap: 12 }}>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#475569' }}>
        <span>Showing {filteredNames.length} / {iconNameList.length} icons</span>
        <span>Source: @editora/icons</span>
      </Box>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search icons..."
        style={{
          width: '100%',
          border: '1px solid #cbd5e1',
          borderRadius: 10,
          padding: '10px 12px',
          fontSize: 14,
          outline: 'none'
        }}
      />

      <Grid columns="repeat(auto-fill, minmax(48px, 1fr))" gap="10px">
        {filteredNames.map((name) => (
          <Box
            key={name}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 10,
              display: 'grid',
              gap: 8,
              justifyItems: 'start',
              background: 'linear-gradient(180deg, #ffffff, #f8fafc)'
            }}
          >
            <Icon
              name={name}
              iconVariant={args.iconVariant}
              size={args.size}
              strokeWidth={args.strokeWidth}
              variant={args.variant}
              tone={args.tone}
              shape={args.shape}
              color={args.color || undefined}
              secondaryColor={args.secondaryColor || undefined}
              label={name}
              decorative={false}
            />
            {/* <Box style={{ fontSize: 11, color: '#334155', lineHeight: 1.25, wordBreak: 'break-word' }}>{name}</Box> */}
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

AllIcons.args = {
  iconVariant: 'outline',
  size: 18,
  strokeWidth: 1.5,
  variant: 'minimal',
  tone: 'default',
  shape: 'default',
  color: '',
  secondaryColor: ''
};
