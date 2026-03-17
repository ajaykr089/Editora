import React, { useState } from 'react';
import { Box, Grid } from '@editora/ui-react';
import { Tree } from '@editora/ui-react/Tree';

export default {
  title: 'UI/Tree',
  component: Tree
};

export const Explorer = () => {
  const [value, setValue] = useState('button');

  return (
    <Grid columns="320px 1fr" gap="16px" style={{ minHeight: 420 }}>
      <Tree
        value={value}
        indentSize="14px"
        onSelect={(detail) => setValue(detail.value)}
        style={{ minHeight: 360 }}
      >
        <Tree.Item value="src" label="src" expanded>
          <Tree.Item value="components" label="components" expanded>
            <Tree.Item value="button" label="button.tsx" />
            <Tree.Item value="dialog" label="dialog.tsx" />
            <Tree.Item value="tree" label="tree.tsx" />
          </Tree.Item>
          <Tree.Item value="hooks" label="hooks" expanded>
            <Tree.Item value="use-floating" label="useFloating.ts" />
            <Tree.Item value="use-theme" label="useTheme.ts" />
          </Tree.Item>
        </Tree.Item>
        <Tree.Item value="docs" label="docs" expanded>
          <Tree.Item value="changelog" label="changelog.md" />
          <Tree.Item value="roadmap" label="roadmap.md" />
        </Tree.Item>
      </Tree>

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #cbd5e1)',
          borderRadius: 'var(--ui-radius, 12px)',
          padding: 16,
          background: 'var(--ui-color-surface, #ffffff)'
        }}
      >
        <strong>Selected node</strong>
        <Box style={{ marginTop: 8, color: 'var(--ui-color-muted, #64748b)' }}>{value}</Box>
        <Box style={{ marginTop: 12, color: 'var(--ui-color-muted, #64748b)' }}>
          Production-style explorer navigation with nested groups, roving focus, expand/collapse arrows, and typeahead.
        </Box>
      </Box>
    </Grid>
  );
};
