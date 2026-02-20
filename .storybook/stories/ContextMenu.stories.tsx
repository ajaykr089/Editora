import React from 'react';
import { ContextMenu, Button , Box} from '@editora/ui-react';

export default {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  argTypes: { open: { control: 'boolean' }, anchorId: { control: 'text' } }
};




export const Default = (args: any) => (
  <div>
    <Box id="ctx-anchor" style={{ margin: 40, padding: 20, border: '1px dashed #ccc', display: 'inline-block' }}>Right-click / anchor</Box>
    <ContextMenu anchorId={args.anchorId || 'ctx-anchor'} open={args.open}>
      <div slot="menu">
        <div className="menuitem" role="menuitem" tabIndex={0}><span className="icon">🍔</span><span className="label">Menu with icon</span></div>
        <div className="menuitem" role="menuitem" tabIndex={0}><span className="icon"><img src="/images/edit.svg" style={{width:'1em',height:'1em'}} alt="edit"/></span><span className="label">Edit (SVG icon)</span></div>
        <div className="menuitem" role="menuitem" tabIndex={-1} aria-disabled="true"><span className="label">Disabled item</span></div>
        <div className="separator" role="separator" />
        <div className="menuitem" role="menuitem" tabIndex={0}><span className="label">Regular item</span></div>
        <div className="menuitem" role="menuitem" tabIndex={0}><span className="icon">⭐</span><span className="label">Starred</span></div>
      </div>
    </ContextMenu>
  </div>
);
Default.args = { open: true, anchorId: 'ctx-anchor' };




export const RightClickDemo = () => {
  const [state, setState] = React.useState<{open: boolean; point?: {x:number;y:number}}>({ open: false });
  return (
    <Box style={{ padding: 40 }} onContextMenu={(e) => { e.preventDefault(); setState({ open: true, point: { x: e.clientX, y: e.clientY } }); }}>
      <Box style={{ padding: 20, border: '1px dashed #ccc', display: 'inline-block' }}>Right-click anywhere inside this box</Box>
      <ContextMenu open={state.open} anchorPoint={state.point}>
        <div slot="menu">
          <div className="menuitem" role="menuitem" tabIndex={0}><span className="icon">📝</span><span className="label">Edit</span></div>
          <div className="menuitem" role="menuitem" tabIndex={-1} aria-disabled="true"><span className="icon">🗑</span><span className="label">Delete (disabled)</span></div>
          <div className="separator" role="separator" />
          <div className="menuitem" role="menuitem" tabIndex={0}><span className="label">Copy</span></div>
          <div className="menuitem" role="menuitem" tabIndex={0}>
            <span className="icon">➡</span><span className="label">Submenu ▶</span>
            <div className="submenu">
              <div className="menuitem" role="menuitem" tabIndex={0}><span className="label">Subitem 1</span></div>
              <div className="menuitem" role="menuitem" tabIndex={0}><span className="label">Subitem 2</span></div>
            </div>
          </div>
        </div>
      </ContextMenu>
    </Box>
  );
};
