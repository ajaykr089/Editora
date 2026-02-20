import React from 'react';
import { Menubar , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Menubar',
  component: Menubar,
  argTypes: {
    selected: { control: 'number' },
    open: { control: 'boolean' },
    loop: { control: 'boolean' }
  }
};

function EditorMenubar(args: any) {
  return (
    <Menubar {...args}>
      <button slot="item">File</button>
      <button slot="item">Edit</button>
      <button slot="item">View</button>

      <Box slot="content" style={{ minWidth: 200 }}>
        <Box style={{ padding: 8, borderRadius: 8 }}>New Document</Box>
        <Box style={{ padding: 8, borderRadius: 8 }}>Open...</Box>
        <Box style={{ padding: 8, borderRadius: 8 }}>Save</Box>
        <Box style={{ padding: 8, borderRadius: 8 }}>Export PDF</Box>
      </Box>

      <Box slot="content" style={{ minWidth: 200 }}>
        <Box style={{ padding: 8, borderRadius: 8 }}>Undo</Box>
        <Box style={{ padding: 8, borderRadius: 8 }}>Redo</Box>
        <Box style={{ padding: 8, borderRadius: 8 }}>Find</Box>
        <Box style={{ padding: 8, borderRadius: 8 }}>Replace</Box>
      </Box>

      <Box slot="content" style={{ minWidth: 220 }}>
        <Box style={{ padding: 8, borderRadius: 8 }}>Zoom In</Box>
        <Box style={{ padding: 8, borderRadius: 8 }}>Zoom Out</Box>
        <Box style={{ padding: 8, borderRadius: 8 }}>Zen Mode</Box>
      </Box>
    </Menubar>
  );
}

export const Default = (args: any) => <EditorMenubar {...args} />;
Default.args = {
  selected: 0,
  open: false
};

export const Interactive = () => {
  const [state, setState] = React.useState({ open: false, selected: 0 });
  return (
    <Grid style={{ display: 'grid', gap: 10 }}>
      <EditorMenubar
        selected={state.selected}
        open={state.open}
        onOpen={(selected) => setState({ open: true, selected })}
        onClose={() => setState((prev) => ({ ...prev, open: false }))}
        onChange={(detail) => setState({ open: detail.open, selected: detail.selected })}
      />
      <Box style={{ fontSize: 13, color: '#475569' }}>
        open: {String(state.open)} | selected: {state.selected}
      </Box>
    </Grid>
  );
};

export const OpenByDefault = (args: any) => <EditorMenubar {...args} />;
OpenByDefault.args = {
  selected: 1,
  open: true
};
