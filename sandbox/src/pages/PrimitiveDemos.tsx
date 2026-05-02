import React, { useState } from 'react';
import {
  BlockControls, Box, Button, Calendar, CodeBlock, DirectionProvider,
  FiltersBar, Flex, Gantt, Grid, NavigationMenu,
  PluginPanel, Portal, Presence, SelectionPopup, Slot, Sortable,
} from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };

export function PortalDemo() {
  return (
    <div>
      <h2 style={h2}>Portal</h2>
      <div style={panel}>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 12 }}>
          Portal teleports its children to a different DOM node. The content below is rendered inside a portal targeting <code>#portal-target</code>.
        </p>
        <div id="portal-target" style={{ padding: 12, border: '2px dashed #e2e8f0', borderRadius: 10, minHeight: 60, fontSize: 13, color: '#94a3b8' }}>
          Portal target (content appears here)
        </div>
        <Portal target="#portal-target">
          <Box style={{ padding: 10, background: '#eff6ff', borderRadius: 8, fontSize: 13, color: '#2563eb', fontWeight: 600 }}>
            ✓ This content was teleported via Portal
          </Box>
        </Portal>
      </div>
    </div>
  );
}

export function PresenceDemo() {
  const [states, setStates] = React.useState<Record<string, boolean>>({});
  const modes = ['fade', 'scale', 'slide-up', 'slide-down', 'blur'] as const;

  return (
    <div>
      <h2 style={h2}>Presence</h2>
      <div style={panel}>
        <h3 style={h3}>Animation modes</h3>
        <Grid style={{ gap: 16 }}>
          {modes.map((mode) => (
            <Flex key={mode} style={{ gap: 12, alignItems: 'center' }}>
              <Button size="sm" variant="secondary" style={{ width: 130 }} onClick={() => setStates((s) => ({ ...s, [mode]: !s[mode] }))}>
                {states[mode] ? 'Hide' : 'Show'} {mode}
              </Button>
              <Presence present={!!states[mode]} mode={mode}>
                <Box style={{ padding: '6px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                  {mode} content
                </Box>
              </Presence>
            </Flex>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function SelectionPopupDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h2 style={h2}>SelectionPopup</h2>
      <div style={panel}>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 12 }}>
          SelectionPopup appears near selected text or an anchor element.
        </p>
        <Box
          id="selection-anchor"
          style={{ padding: 16, background: '#f8fafc', borderRadius: 10, fontSize: 14, cursor: 'pointer', border: '1px solid #e2e8f0', userSelect: 'text' }}
          onMouseUp={() => {
            const sel = window.getSelection();
            if (sel && sel.toString().length > 0) setOpen(true);
          }}
        >
          Select some of this text to trigger the popup. Try highlighting a word or phrase here.
        </Box>
        {open && (
          <SelectionPopup anchorId="selection-anchor" open placement="top" onClose={() => setOpen(false)}>
            <SelectionPopup.Content>
              <Flex style={{ gap: 4 }}>
                <Button size="sm" onClick={() => { toastAdvanced.info('Bold applied', { duration: 1200, theme: 'light' }); setOpen(false); }}>Bold</Button>
                <Button size="sm" variant="secondary" onClick={() => { toastAdvanced.info('Comment added', { duration: 1200, theme: 'light' }); setOpen(false); }}>Comment</Button>
                <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>✕</Button>
              </Flex>
            </SelectionPopup.Content>
          </SelectionPopup>
        )}
      </div>
    </div>
  );
}

export function NavigationMenuDemo() {
  return (
    <div>
      <h2 style={h2}>NavigationMenu</h2>
      <div style={panel}>
        <h3 style={h3}>Horizontal</h3>
        <NavigationMenu variant="surface" radius={10}>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <Box style={{ padding: 16, minWidth: 200 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Products</div>
                <Grid style={{ gap: 6 }}>
                  {['Editor', 'Components', 'Themes', 'Plugins'].map((item) => (
                    <Box key={item} style={{ padding: '6px 10px', borderRadius: 6, fontSize: 13, color: '#475569', cursor: 'pointer' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >{item}</Box>
                  ))}
                </Grid>
              </Box>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Docs</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <Box style={{ padding: 16, minWidth: 180 }}>
                <Grid style={{ gap: 6 }}>
                  {['Getting Started', 'API Reference', 'Examples'].map((item) => (
                    <Box key={item} style={{ padding: '6px 10px', borderRadius: 6, fontSize: 13, color: '#475569', cursor: 'pointer' }}>{item}</Box>
                  ))}
                </Grid>
              </Box>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">GitHub</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu>
      </div>
      <div style={panel}>
        <h3 style={h3}>Vertical</h3>
        <NavigationMenu orientation="vertical" variant="soft" radius={10} style={{ maxWidth: 220 }}>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Dashboard</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <Box style={{ padding: 12 }}>
                <Grid style={{ gap: 4 }}>
                  {['Overview', 'Analytics', 'Reports'].map((item) => (
                    <Box key={item} style={{ padding: '5px 8px', fontSize: 13, color: '#475569', borderRadius: 6, cursor: 'pointer' }}>{item}</Box>
                  ))}
                </Grid>
              </Box>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">Settings</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#">Help</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu>
      </div>
    </div>
  );
}

export function CalendarDemo() {
  const [value, setValue] = useState('');
  return (
    <div>
      <h2 style={h2}>Calendar</h2>
      <div style={panel}>
        <h3 style={h3}>Single date</h3>
        <Calendar value={value} onSelect={(d: any) => setValue(d.value)} />
        {value && <div style={{ marginTop: 10, fontSize: 13, color: '#64748b' }}>Selected: {value}</div>}
      </div>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))' }}>
          {(['surface', 'soft', 'outline'] as const).map((v) => (
            <div key={v}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', fontWeight: 600 }}>{v}</div>
              <Calendar variant={v} />
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function CodeBlockDemo() {
  const jsCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('Editora'));`;

  const tsCode = `interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = async (id: number): Promise<User> => {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
};`;

  return (
    <div>
      <h2 style={h2}>CodeBlock</h2>
      <div style={panel}>
        <h3 style={h3}>JavaScript</h3>
        <CodeBlock language="javascript" code={jsCode} lineNumbers />
      </div>
      <div style={panel}>
        <h3 style={h3}>TypeScript</h3>
        <CodeBlock language="typescript" code={tsCode} lineNumbers />
      </div>
      <div style={panel}>
        <h3 style={h3}>Themes</h3>
        <Grid style={{ gap: 12 }}>
          {(['dark', 'light', 'github-dark'] as const).map((theme) => (
            <div key={theme}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{theme}</div>
              <CodeBlock language="javascript" code={`const x = 42;`} title={theme} />
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function FiltersBarDemo() {
  const [status, setStatus] = useState('');
  const options = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'archived', label: 'Archived' },
  ];
  return (
    <div>
      <h2 style={h2}>FiltersBar</h2>
      <div style={panel}>
        <FiltersBar
          status={status}
          statusOptions={options}
          statusPlaceholder="Filter by status..."
          onStatusChange={setStatus}
          onClear={() => setStatus('')}
        />
        {status && (
          <div style={{ marginTop: 10, fontSize: 13, color: '#64748b' }}>
            Active filter: {status}
          </div>
        )}
      </div>
    </div>
  );
}

export function GanttDemo() {
  const tasks = [
    { id: '1', label: 'Design system', start: '2024-01-01', end: '2024-01-15', progress: 100 },
    { id: '2', label: 'Component library', start: '2024-01-10', end: '2024-02-10', progress: 75 },
    { id: '3', label: 'Documentation', start: '2024-01-20', end: '2024-02-20', progress: 40 },
    { id: '4', label: 'Testing', start: '2024-02-01', end: '2024-02-28', progress: 20 },
    { id: '5', label: 'Release', start: '2024-02-25', end: '2024-03-05', progress: 0 },
  ];
  return (
    <div>
      <h2 style={h2}>Gantt</h2>
      <div style={panel}>
        <Gantt tasks={tasks} />
      </div>
    </div>
  );
}

export function SortableDemo() {
  const [items, setItems] = useState([
    { id: '1', label: 'Design tokens' },
    { id: '2', label: 'Component library' },
    { id: '3', label: 'Documentation site' },
    { id: '4', label: 'Storybook setup' },
    { id: '5', label: 'Release pipeline' },
  ]);
  return (
    <div>
      <h2 style={h2}>Sortable</h2>
      <div style={panel}>
        <h3 style={h3}>Drag to reorder</h3>
        <Sortable
          lists={[{ id: 'main', items }]}
          onChange={(d: any) => {
            if (d.lists?.[0]) setItems(d.lists[0].items);
          }}
          renderItem={(ctx: any) => (
            <Box style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, cursor: 'grab', userSelect: 'none' }}>
              ⠿ {ctx.item.label}
            </Box>
          )}
        />
      </div>
    </div>
  );
}

export function DirectionProviderDemo() {
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  return (
    <div>
      <h2 style={h2}>DirectionProvider</h2>
      <div style={panel}>
        <Flex style={{ gap: 8, marginBottom: 16 }}>
          <Button size="sm" variant={dir === 'ltr' ? 'primary' : 'secondary'} onClick={() => setDir('ltr')}>LTR</Button>
          <Button size="sm" variant={dir === 'rtl' ? 'primary' : 'secondary'} onClick={() => setDir('rtl')}>RTL</Button>
        </Flex>
        <DirectionProvider dir={dir}>
          <Box style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 14, marginBottom: 8, fontWeight: 600 }}>Direction: {dir.toUpperCase()}</div>
            <div style={{ fontSize: 13, color: '#475569' }}>
              {dir === 'rtl'
                ? 'هذا النص يُعرض من اليمين إلى اليسار'
                : 'This text is displayed left to right'}
            </div>
          </Box>
        </DirectionProvider>
      </div>
    </div>
  );
}

export function SlotDemo() {
  return (
    <div>
      <h2 style={h2}>Slot</h2>
      <div style={panel}>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 16 }}>
          Slot merges its props onto its child element, enabling polymorphic rendering without extra DOM nodes.
        </p>
        <Grid style={{ gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Slot as button</div>
            <Slot as="button" style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', background: '#f8fafc', fontSize: 14 }}
              onClick={() => toastAdvanced.info('Slot clicked', { duration: 1200, theme: 'light' })}>
              Click me (rendered as button)
            </Slot>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Slot as anchor</div>
            <Slot as="a" href="#" style={{ color: '#2563eb', fontSize: 14, textDecoration: 'underline' }}>
              Link via Slot
            </Slot>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export function BlockControlsDemo() {
  return (
    <div>
      <h2 style={h2}>BlockControls</h2>
      <div style={panel}>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 16 }}>
          BlockControls provides floating controls for editor blocks (move up/down, delete, drag handle).
        </p>
        <Box style={{ position: 'relative', padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
          <BlockControls
            onMoveUp={() => toastAdvanced.info('Move up', { duration: 1200, theme: 'light' })}
            onMoveDown={() => toastAdvanced.info('Move down', { duration: 1200, theme: 'light' })}
            onDelete={() => toastAdvanced.error('Block deleted', { duration: 1200, theme: 'light' })}
          />
          <div style={{ fontSize: 14, color: '#475569' }}>
            Hover this block to see the block controls appear.
          </div>
        </Box>
      </div>
    </div>
  );
}

export function PluginPanelDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h2 style={h2}>PluginPanel</h2>
      <div style={panel}>
        <Button onClick={() => setOpen((v) => !v)}>{open ? 'Close' : 'Open'} plugin panel</Button>
        <PluginPanel open={open} title="Format Options" onClose={() => setOpen(false)} style={{ marginTop: 16 }}>
          <Grid style={{ gap: 10, padding: 16 }}>
            <Button size="sm" variant="secondary" onClick={() => toastAdvanced.info('Bold applied', { duration: 1200, theme: 'light' })}>Bold</Button>
            <Button size="sm" variant="secondary" onClick={() => toastAdvanced.info('Italic applied', { duration: 1200, theme: 'light' })}>Italic</Button>
            <Button size="sm" variant="secondary" onClick={() => toastAdvanced.info('Underline applied', { duration: 1200, theme: 'light' })}>Underline</Button>
          </Grid>
        </PluginPanel>
      </div>
    </div>
  );
}
