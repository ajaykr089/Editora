import React from 'react';
import { Box, Grid, Icon } from '@editora/ui-react';
import { iconNameList } from '@editora/icons';

export default {
  title: 'UI/Icons Catalog',
  component: Icon,
  argTypes: {
    iconVariant: { control: 'select', options: ['outline', 'solid', 'duotone'] },
    iconWeight: { control: 'select', options: ['thin', 'regular', 'bold'] },
    size: { control: 'number' },
    strokeWidth: { control: 'number' },
    absoluteStrokeWidth: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    color: { control: 'color' },
    secondaryColor: { control: 'color' }
  }
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 10,
  display: 'grid',
  gap: 8,
  justifyItems: 'center',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #ffffff, #f8fafc)',
  minHeight: 52
};

const iconFrameStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#0f172a',
  lineHeight: 0,
  overflow: 'visible'
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

      <Grid columns="repeat(auto-fill, minmax(56px, 1fr))" gap="10px">
        {filteredNames.map((name) => (
          <Box key={name} style={cardStyle}>
            <Box style={iconFrameStyle}>
              <Icon
                name={name}
                iconVariant={args.iconVariant}
                iconWeight={args.iconWeight}
                size={args.size}
                strokeWidth={args.strokeWidth}
                absoluteStrokeWidth={args.absoluteStrokeWidth}
                variant={args.variant}
                tone={args.tone}
                shape={args.shape}
                color={args.color || undefined}
                secondaryColor={args.secondaryColor || undefined}
                label={name}
                decorative={false}
              />
            </Box>
            {/* <Box style={{ fontSize: 11, color: '#334155', lineHeight: 1.25, wordBreak: 'break-word' }}>{name}</Box> */}
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

AllIcons.args = {
  iconVariant: 'outline',
  iconWeight: 'thin',
  size: 20,
  absoluteStrokeWidth: true,
  variant: 'minimal',
  tone: 'default',
  shape: 'default',
  color: '',
  secondaryColor: ''
};
