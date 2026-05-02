import React, { useState } from 'react';
import {
  AlertDialog, AlertDialogIcon, AlertDialogContent,
  Box, Button, ContextMenu, Dialog, Drawer, Dropdown, Flex, Grid,
  HoverCard, Menu, MenuItem, MenuSeparator, Menubar, Popover, Tooltip,
  useAlertDialog,
} from '@editora/ui-react';
import { AlertTriangleIcon, CheckCircleIcon } from '@editora/react-icons';
import { toastAdvanced } from '@editora/toast';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };

export function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  const [openInput, setOpenInput] = useState(false);
  const [last, setLast] = useState('none');
  return (
    <div>
      <h2 style={h2}>AlertDialog</h2>
      <div style={panel}>
        <h3 style={h3}>Basic Confirmation</h3>
        <Flex style={{ gap: 8, marginBottom: 10 }}>
          <Button onClick={() => setOpen(true)}>Delete workspace</Button>
          <Button variant="secondary" onClick={() => setOpenInput(true)}>With input</Button>
        </Flex>
        <div style={{ fontSize: 13, color: '#64748b' }}>Last: {last}</div>
        <AlertDialog open={open} tone="danger" variant="soft" radius={12} dismissible
          onConfirm={() => setLast('confirmed')} onCancel={() => setLast('cancelled')}
          onClose={(d: any) => { setOpen(false); setLast(`closed:${d.action}`); }}
          config={{ title: 'Delete workspace', description: 'This cannot be undone.', confirmText: 'Delete', cancelText: 'Cancel' }}
        />
        <AlertDialog open={openInput} tone="warning" variant="soft" radius={12} dismissible
          onConfirm={(d: any) => { setLast(`input:${d.value}`); toastAdvanced.success(`Confirmed: ${d.value}`, { duration: 1500, theme: 'light' }); }}
          onClose={() => setOpenInput(false)}
          config={{ title: 'Confirm action', description: 'Type CONFIRM to proceed.', confirmText: 'Confirm', cancelText: 'Cancel', input: { enabled: true, label: 'Type CONFIRM', placeholder: 'CONFIRM', required: true } }}
        >
          <AlertDialogIcon><AlertTriangleIcon size={16} /></AlertDialogIcon>
        </AlertDialog>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variant Gallery (headless)</h3>
        <Grid style={{ gap: 12 }}>
          {(['surface','soft','outline','solid'] as const).map((v) => (
            <AlertDialog key={v} open headless tone={v === 'solid' ? 'danger' : 'warning'} variant={v} radius={10}
              config={{ title: `${v} dialog`, description: 'Preview of this variant.', confirmText: 'OK', cancelText: 'Cancel' }}
            />
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function AlertDialogPromiseDemo() {
  const dialogs = useAlertDialog();
  const [result, setResult] = useState('No result yet');
  return (
    <div>
      <h2 style={h2}>AlertDialog Promise API</h2>
      <div style={panel}>
        <Flex style={{ gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <Button onClick={async () => { const r = await dialogs.alert({ title: 'Done!', description: 'Operation complete.', confirmText: 'OK', tone: 'success' }); setResult(JSON.stringify(r)); }}>Alert</Button>
          <Button variant="secondary" onClick={async () => { const r = await dialogs.confirm({ title: 'Delete?', description: 'Cannot be undone.', confirmText: 'Delete', cancelText: 'Keep', tone: 'danger' }); setResult(JSON.stringify(r)); }}>Confirm</Button>
          <Button variant="ghost" onClick={async () => { const r = await dialogs.prompt({ title: 'Rename', description: 'Enter new name.', confirmText: 'Save', cancelText: 'Cancel', input: { label: 'Name', placeholder: 'My project', required: true, validate: (v: string) => v.length < 3 ? 'Min 3 chars' : null } }); setResult(JSON.stringify(r)); }}>Prompt</Button>
        </Flex>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, fontSize: 13, color: '#64748b' }}>
          Result: <code>{result}</code>
        </Box>
      </div>
    </div>
  );
}

export function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h2 style={h2}>Dialog</h2>
      <div style={panel}>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog open={open} title="Edit profile" description="Update your account details."
          submitText="Save" cancelText="Cancel"
          onDialogSubmit={() => { toastAdvanced.success('Profile saved', { duration: 1500, theme: 'light' }); setOpen(false); }}
          onDialogClose={() => setOpen(false)}
        >
          <Grid style={{ gap: 10 }}>
            <input placeholder="Full name" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 }} />
            <input placeholder="Email" type="email" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 }} />
          </Grid>
        </Dialog>
      </div>
    </div>
  );
}

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<'left'|'right'|'top'|'bottom'>('right');
  return (
    <div>
      <h2 style={h2}>Drawer</h2>
      <div style={panel}>
        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          {(['left','right','top','bottom'] as const).map((s) => (
            <Button key={s} variant="secondary" onClick={() => { setSide(s); setOpen(true); }}>Open {s}</Button>
          ))}
        </Flex>
        <Drawer open={open} side={side} title={`${side} drawer`} onClose={() => setOpen(false)}>
          <Box style={{ padding: 20 }}>
            <p style={{ color: '#64748b', fontSize: 14 }}>Drawer content from the {side}.</p>
            <Button onClick={() => setOpen(false)} style={{ marginTop: 12 }}>Close</Button>
          </Box>
        </Drawer>
      </div>
    </div>
  );
}

export function DropdownDemo() {
  return (
    <div>
      <h2 style={h2}>Dropdown</h2>
      <div style={panel}>
        <Flex style={{ gap: 12, flexWrap: 'wrap' }}>
          <Dropdown>
            <Dropdown.Trigger>Actions ▾</Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item onClick={() => toastAdvanced.info('Edit clicked', { duration: 1200, theme: 'light' })}>Edit</Dropdown.Item>
              <Dropdown.Item onClick={() => toastAdvanced.info('Duplicate clicked', { duration: 1200, theme: 'light' })}>Duplicate</Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item onClick={() => toastAdvanced.error('Delete clicked', { duration: 1200, theme: 'light' })}>Delete</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
          <Dropdown>
            <Dropdown.Trigger>Settings ▾</Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.SectionLabel>Account</Dropdown.SectionLabel>
              <Dropdown.Item onClick={() => toastAdvanced.info('Profile', { duration: 1200, theme: 'light' })}>Profile</Dropdown.Item>
              <Dropdown.Item onClick={() => toastAdvanced.info('Billing', { duration: 1200, theme: 'light' })}>Billing</Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item onClick={() => toastAdvanced.warning('Signed out', { duration: 1200, theme: 'light' })}>Sign out</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </Flex>
      </div>
    </div>
  );
}

export function TooltipDemo() {
  return (
    <div>
      <h2 style={h2}>Tooltip</h2>
      <div style={panel}>
        <Flex style={{ gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <Tooltip text="This is a tooltip"><Button variant="secondary">Hover me</Button></Tooltip>
          <Tooltip text="Top placement" placement="top"><Button variant="secondary">Top</Button></Tooltip>
          <Tooltip text="Bottom placement" placement="bottom"><Button variant="secondary">Bottom</Button></Tooltip>
          <Tooltip text="Left placement" placement="left"><Button variant="secondary">Left</Button></Tooltip>
          <Tooltip text="Right placement" placement="right"><Button variant="secondary">Right</Button></Tooltip>
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Flex style={{ gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {(['default', 'soft', 'contrast'] as const).map((v) => (
            <Tooltip key={v} text={`${v} tooltip`} variant={v}>
              <Button variant="secondary" size="sm">{v}</Button>
            </Tooltip>
          ))}
        </Flex>
      </div>
    </div>
  );
}

export function PopoverDemo() {
  return (
    <div>
      <h2 style={h2}>Popover</h2>
      <div style={panel}>
        <Flex style={{ gap: 12 }}>
          <Popover>
            <Popover.Trigger>
              <Button>Open popover</Button>
            </Popover.Trigger>
            <Popover.Content>
              <Box style={{ padding: 16, maxWidth: 240 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Popover title</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>This is popover content. Click outside to close.</div>
              </Box>
            </Popover.Content>
          </Popover>
          <Popover placement="bottom">
            <Popover.Trigger>
              <Button variant="secondary">Bottom</Button>
            </Popover.Trigger>
            <Popover.Content>
              <Box style={{ padding: 14, maxWidth: 200, fontSize: 13, color: '#475569' }}>Bottom placement popover.</Box>
            </Popover.Content>
          </Popover>
        </Flex>
      </div>
    </div>
  );
}

export function HoverCardDemo() {
  return (
    <div>
      <h2 style={h2}>HoverCard</h2>
      <div style={panel}>
        <HoverCard>
          <HoverCard.Trigger asChild>
            <Button variant="secondary">Hover for card</Button>
          </HoverCard.Trigger>
          <HoverCard.Content>
            <Box style={{ padding: 14, maxWidth: 220 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>User profile</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Joined January 2024 · 42 contributions</div>
            </Box>
          </HoverCard.Content>
        </HoverCard>
      </div>
    </div>
  );
}

export function MenuDemo() {
  return (
    <div>
      <h2 style={h2}>Menu</h2>
      <div style={panel}>
        <Box style={{ maxWidth: 220, border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
          <Menu>
            <MenuItem onSelect={() => toastAdvanced.info('Dashboard', { duration: 1200, theme: 'light' })}>Dashboard</MenuItem>
            <MenuItem onSelect={() => toastAdvanced.info('Analytics', { duration: 1200, theme: 'light' })}>Analytics</MenuItem>
            <MenuSeparator />
            <MenuItem onSelect={() => toastAdvanced.info('Settings', { duration: 1200, theme: 'light' })}>Settings</MenuItem>
            <MenuItem tone="danger" onSelect={() => toastAdvanced.error('Sign out', { duration: 1200, theme: 'light' })}>Sign out</MenuItem>
          </Menu>
        </Box>
      </div>
    </div>
  );
}

export function MenubarDemo() {
  return (
    <div>
      <h2 style={h2}>Menubar</h2>
      <div style={panel}>
        <Menubar>
          <button slot="item">File</button>
          <Menubar.Content>
            <Menu>
              <Menu.Item onClick={() => toastAdvanced.info('New file', { duration: 1200, theme: 'light' })}>New file</Menu.Item>
              <Menu.Item onClick={() => toastAdvanced.info('Open', { duration: 1200, theme: 'light' })}>Open...</Menu.Item>
              <Menu.Separator />
              <Menu.Item onClick={() => toastAdvanced.success('Saved', { duration: 1200, theme: 'light' })}>Save</Menu.Item>
            </Menu>
          </Menubar.Content>
          <button slot="item">Edit</button>
          <Menubar.Content>
            <Menu>
              <Menu.Item onClick={() => toastAdvanced.info('Undo', { duration: 1200, theme: 'light' })}>Undo</Menu.Item>
              <Menu.Item onClick={() => toastAdvanced.info('Redo', { duration: 1200, theme: 'light' })}>Redo</Menu.Item>
              <Menu.Separator />
              <Menu.Item onClick={() => toastAdvanced.info('Cut', { duration: 1200, theme: 'light' })}>Cut</Menu.Item>
              <Menu.Item onClick={() => toastAdvanced.info('Copy', { duration: 1200, theme: 'light' })}>Copy</Menu.Item>
            </Menu>
          </Menubar.Content>
          <button slot="item">View</button>
          <Menubar.Content>
            <Menu>
              <Menu.Item onClick={() => toastAdvanced.info('Zoom in', { duration: 1200, theme: 'light' })}>Zoom in</Menu.Item>
              <Menu.Item onClick={() => toastAdvanced.info('Zoom out', { duration: 1200, theme: 'light' })}>Zoom out</Menu.Item>
            </Menu>
          </Menubar.Content>
        </Menubar>
      </div>
    </div>
  );
}

export function ContextMenuDemo() {
  const [point, setPoint] = React.useState<{ x: number; y: number } | null>(null);
  const [last, setLast] = React.useState('None');

  const items = [
    { label: 'Copy', shortcut: '⌘C', onClick: () => { setLast('Copy'); setPoint(null); } },
    { label: 'Paste', shortcut: '⌘V', onClick: () => { setLast('Paste'); setPoint(null); } },
    { separator: true },
    { label: 'Rename', onClick: () => { setLast('Rename'); setPoint(null); } },
    { label: 'Duplicate', onClick: () => { setLast('Duplicate'); setPoint(null); } },
    { separator: true },
    { label: 'Delete', tone: 'danger' as const, onClick: () => { setLast('Delete'); setPoint(null); } },
  ];

  return (
    <div>
      <h2 style={h2}>ContextMenu</h2>
      <div style={panel}>
        <Box
          style={{ padding: 40, borderRadius: 12, border: '2px dashed #e2e8f0', textAlign: 'center', color: '#64748b', fontSize: 14, cursor: 'context-menu', userSelect: 'none' }}
          onContextMenu={(e) => {
            e.preventDefault();
            setPoint({ x: e.clientX, y: e.clientY });
          }}
        >
          Right-click anywhere in this area to open the context menu
        </Box>
        <div style={{ marginTop: 10, fontSize: 13, color: '#64748b' }}>Last action: <strong>{last}</strong></div>
        <ContextMenu
          anchorPoint={point ?? undefined}
          open={!!point}
          items={items}
          onClose={() => setPoint(null)}
        />
      </div>
      <div style={panel}>
        <h3 style={h3}>With icons</h3>
        <Box
          style={{ padding: 32, borderRadius: 12, border: '2px dashed #e2e8f0', textAlign: 'center', color: '#64748b', fontSize: 14, cursor: 'context-menu', userSelect: 'none', background: '#f8fafc' }}
          onContextMenu={(e) => {
            e.preventDefault();
            setPoint({ x: e.clientX, y: e.clientY });
          }}
        >
          Right-click for menu with icons
        </Box>
      </div>
    </div>
  );
}
