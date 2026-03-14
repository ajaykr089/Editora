import React, { useState } from 'react';
import { Box, Grid, Tree, TreeItem } from '@editora/ui-react';

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
        <TreeItem value="src" label="src" expanded>
          <TreeItem value="components" label="components" expanded>
            <TreeItem value="button" label="button.tsx" />
            <TreeItem value="dialog" label="dialog.tsx" />
            <TreeItem value="tree" label="tree.tsx" />
          </TreeItem>
          <TreeItem value="hooks" label="hooks" expanded>
            <TreeItem value="use-floating" label="useFloating.ts" />
            <TreeItem value="use-theme" label="useTheme.ts" />
          </TreeItem>
        </TreeItem>
        <TreeItem value="docs" label="docs" expanded>
          <TreeItem value="changelog" label="changelog.md" />
          <TreeItem value="roadmap" label="roadmap.md" />
        </TreeItem>
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
