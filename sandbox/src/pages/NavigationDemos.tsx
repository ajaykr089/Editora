import React, { useState } from 'react';
import {
  Box, Breadcrumb, Button, Card, Command, CommandItem,
  Flex, Grid, Pagination, Stepper, Tabs, Timeline, Tree, Wizard,
} from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };

export function BreadcrumbDemo() {
  return (
    <div>
      <h2 style={h2}>Breadcrumb</h2>
      <div style={panel}>
        <Grid style={{ gap: 14 }}>
          <Breadcrumb>
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="#">Products</Breadcrumb.Item>
            <Breadcrumb.Item>Current page</Breadcrumb.Item>
          </Breadcrumb>
          <Breadcrumb separator="/">
            <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item href="#">Settings</Breadcrumb.Item>
            <Breadcrumb.Item>Profile</Breadcrumb.Item>
          </Breadcrumb>
          <Breadcrumb separator="›">
            <Breadcrumb.Item href="#">Workspace</Breadcrumb.Item>
            <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
            <Breadcrumb.Item href="#">Alpha</Breadcrumb.Item>
            <Breadcrumb.Item>Details</Breadcrumb.Item>
          </Breadcrumb>
        </Grid>
      </div>
    </div>
  );
}

export function TabsDemo() {
  const [tab, setTab] = useState(0);
  return (
    <div>
      <h2 style={h2}>Tabs</h2>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 20 }}>
          {(['default', 'soft', 'underline'] as const).map((v) => (
            <div key={v}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', fontWeight: 600 }}>{v}</div>
              <Tabs selected={0} variant={v}>
                <Tabs.Tab value="a">Overview</Tabs.Tab>
                <Tabs.Panel><Box style={{ padding: '12px 0', fontSize: 14, color: '#475569' }}>Overview content.</Box></Tabs.Panel>
                <Tabs.Tab value="b">Analytics</Tabs.Tab>
                <Tabs.Panel><Box style={{ padding: '12px 0', fontSize: 14, color: '#475569' }}>Analytics content.</Box></Tabs.Panel>
                <Tabs.Tab value="c">Settings</Tabs.Tab>
                <Tabs.Panel><Box style={{ padding: '12px 0', fontSize: 14, color: '#475569' }}>Settings content.</Box></Tabs.Panel>
              </Tabs>
            </div>
          ))}
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Controlled with actions</h3>
        <Tabs selected={tab} variant="soft" onChange={setTab}>
          <Tabs.Tab value="signals">Signals</Tabs.Tab>
          <Tabs.Panel>
            <Flex style={{ gap: 8, padding: '12px 0' }}>
              <Button size="sm" onClick={() => toastAdvanced.success('Signal sent', { duration: 1400, theme: 'light' })}>Send signal</Button>
              <Button size="sm" variant="secondary" onClick={() => toastAdvanced.warning('Warning signal', { duration: 1400, theme: 'light' })}>Warning</Button>
            </Flex>
          </Tabs.Panel>
          <Tabs.Tab value="queue">Queue</Tabs.Tab>
          <Tabs.Panel><Box style={{ padding: '12px 0', fontSize: 14, color: '#475569' }}>Queue is empty.</Box></Tabs.Panel>
          <Tabs.Tab value="config">Config</Tabs.Tab>
          <Tabs.Panel><Box style={{ padding: '12px 0', fontSize: 14, color: '#475569' }}>Configuration options here.</Box></Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export function TreeDemo() {
  const [selected, setSelected] = useState('button');
  return (
    <div>
      <h2 style={h2}>Tree</h2>
      <div style={panel}>
        <Grid columns="280px 1fr" gap="16px" style={{ minHeight: 320 }}>
          <Tree value={selected} indentSize="14px" onSelect={(d: any) => setSelected(d.value)} style={{ minHeight: 280 }}>
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
          <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Selected</div>
            <div style={{ color: '#64748b', fontSize: 14 }}>{selected}</div>
          </Box>
        </Grid>
      </div>
    </div>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(1);
  return (
    <div>
      <h2 style={h2}>Pagination</h2>
      <div style={panel}>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>Page: {page} of 10</div>
        <Pagination page={page} total={100} pageSize={10} onChange={(d: any) => setPage(d.page)} />
      </div>
      <div style={panel}>
        <h3 style={h3}>Sizes</h3>
        <Grid style={{ gap: 14 }}>
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <div key={s}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{s}</div>
              <Pagination page={1} total={50} pageSize={10} size={s} />
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function StepperDemo() {
  const [value, setValue] = useState('account');

  const steps = [
    { value: 'account', label: 'Account', description: 'Create account' },
    { value: 'profile', label: 'Profile', description: 'Set up profile' },
    { value: 'review', label: 'Review', description: 'Review details' },
    { value: 'done', label: 'Done', description: 'All set!' },
  ];

  const currentIndex = steps.findIndex((s) => s.value === value);

  return (
    <div>
      <h2 style={h2}>Stepper</h2>
      <div style={panel}>
        <Stepper steps={steps} value={value} clickable style={{ marginBottom: 20 }} onChange={(d: any) => setValue(d.value)} />
        <Box style={{ padding: 16, background: '#f8fafc', borderRadius: 10, marginBottom: 16, fontSize: 14, color: '#475569' }}>
          Current step: <strong>{steps[currentIndex]?.label}</strong> — {steps[currentIndex]?.description}
        </Box>
        <Flex style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" disabled={currentIndex <= 0} onClick={() => setValue(steps[currentIndex - 1].value)}>Back</Button>
          <Button size="sm" disabled={currentIndex >= steps.length - 1} onClick={() => setValue(steps[currentIndex + 1].value)}>Next</Button>
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Vertical</h3>
        <Stepper steps={steps.slice(0, 3)} value="profile" orientation="vertical" />
      </div>
    </div>
  );
}

export function CommandDemo() {
  return (
    <div>
      <h2 style={h2}>Command</h2>
      <div style={panel}>
        <Box style={{ maxWidth: 400, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          <Command placeholder="Search commands...">
            <CommandItem value="new-file" onSelect={() => toastAdvanced.info('New file', { duration: 1200, theme: 'light' })}>New file</CommandItem>
            <CommandItem value="open" onSelect={() => toastAdvanced.info('Open', { duration: 1200, theme: 'light' })}>Open...</CommandItem>
            <CommandItem value="save" onSelect={() => toastAdvanced.success('Saved', { duration: 1200, theme: 'light' })}>Save</CommandItem>
            <CommandItem value="settings" onSelect={() => toastAdvanced.info('Settings', { duration: 1200, theme: 'light' })}>Settings</CommandItem>
            <CommandItem value="logout" onSelect={() => toastAdvanced.warning('Signed out', { duration: 1200, theme: 'light' })}>Sign out</CommandItem>
          </Command>
        </Box>
      </div>
    </div>
  );
}

export function WizardDemo() {
  const [value, setValue] = useState('welcome');
  const steps = ['welcome', 'configure', 'review', 'finish'];
  const currentIndex = steps.indexOf(value);

  return (
    <div>
      <h2 style={h2}>Wizard</h2>
      <div style={panel}>
        <Wizard value={value} showStepper onChange={(d: any) => setValue(d.value)}>
          <Wizard.Step value="welcome" title="Welcome">
            <Box style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Welcome to setup</div>
              <div style={{ fontSize: 14, color: '#64748b' }}>Let's get you started in a few steps.</div>
            </Box>
          </Wizard.Step>
          <Wizard.Step value="configure" title="Configure">
            <Box style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Configuration</div>
              <div style={{ fontSize: 14, color: '#64748b' }}>Set your preferences here.</div>
            </Box>
          </Wizard.Step>
          <Wizard.Step value="review" title="Review">
            <Box style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Review</div>
              <div style={{ fontSize: 14, color: '#64748b' }}>Check your settings before finishing.</div>
            </Box>
          </Wizard.Step>
          <Wizard.Step value="finish" title="Finish">
            <Box style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>All done!</div>
              <div style={{ fontSize: 14, color: '#64748b' }}>Setup complete.</div>
            </Box>
          </Wizard.Step>
        </Wizard>
        <Flex style={{ gap: 8, marginTop: 16 }}>
          <Button size="sm" variant="secondary" disabled={currentIndex <= 0} onClick={() => setValue(steps[currentIndex - 1])}>Back</Button>
          <Button size="sm" disabled={currentIndex >= steps.length - 1} onClick={() => setValue(steps[currentIndex + 1])}>Next</Button>
        </Flex>
      </div>
    </div>
  );
}

export function TimelineDemo() {
  const items = [
    { title: 'Deployment complete', description: 'Production rollout finished successfully.', time: '2 hours ago', tone: 'success' as const },
    { title: 'Review started', description: 'Code review initiated by team lead.', time: '5 hours ago', tone: 'info' as const },
    { title: 'PR opened', description: 'Pull request #142 opened.', time: 'Yesterday', tone: 'default' as const },
    { title: 'Branch created', description: 'Feature branch created from main.', time: '2 days ago', tone: 'default' as const },
  ];

  return (
    <div>
      <h2 style={h2}>Timeline</h2>
      <div style={panel}>
        <Timeline items={items} />
      </div>
      <div style={panel}>
        <h3 style={h3}>Contrast variant</h3>
        <Box style={{ background: '#0f172a', borderRadius: 12, padding: 20 }}>
          <Timeline items={items} variant="contrast" />
        </Box>
      </div>
    </div>
  );
}
