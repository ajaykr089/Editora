import React, { useState } from 'react';
import {
  Accordion, Alert, AlertActions, AlertDescription, AlertIcon, AlertTitle,
  Box, Button, Collapsible, EmptyState, Flex, Grid, Meter, Progress,
} from '@editora/ui-react';
import { AlertTriangleIcon, CheckCircleIcon, InboxIcon, ShieldIcon } from '@editora/react-icons';
import { toastAdvanced } from '@editora/toast';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };

export function AccordionDemo() {
  const [open, setOpen] = useState<number | number[]>(0);
  return (
    <div>
      <h2 style={h2}>Accordion</h2>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 14 }}>
          {(['surface', 'soft', 'outline', 'ghost'] as const).map((v) => (
            <div key={v}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>{v}</div>
              <Accordion collapsible variant={v} radius={10}>
                <Accordion.Item description="First item"><Accordion.Trigger>Question one</Accordion.Trigger><Accordion.Panel>Answer to question one.</Accordion.Panel></Accordion.Item>
                <Accordion.Item description="Second item"><Accordion.Trigger>Question two</Accordion.Trigger><Accordion.Panel>Answer to question two.</Accordion.Panel></Accordion.Item>
              </Accordion>
            </div>
          ))}
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Controlled single-open</h3>
        <Flex style={{ gap: 8, marginBottom: 12 }}>
          {[0, 1, 2].map((i) => <Button key={i} size="sm" variant="secondary" onClick={() => setOpen(i)}>Open {i + 1}</Button>)}
        </Flex>
        <Accordion open={open} onToggle={setOpen} variant="soft" tone="info" radius={10}>
          {['Section A', 'Section B', 'Section C'].map((s, i) => (
            <Accordion.Item key={s} description={s} badge={String(i + 1)}>
              <Accordion.Trigger>{s}</Accordion.Trigger>
              <Accordion.Panel>Content for {s}.</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
      <div style={panel}>
        <h3 style={h3}>Sizes</h3>
        <Grid style={{ gap: 12 }}>
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <div key={s}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>size="{s}"</div>
              <Accordion collapsible size={s} variant="outline" radius={8}>
                <Accordion.Item><Accordion.Trigger>Item</Accordion.Trigger><Accordion.Panel>Content.</Accordion.Panel></Accordion.Item>
              </Accordion>
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function AlertDemo() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <h2 style={h2}>Alert</h2>
      <div style={panel}>
        <h3 style={h3}>Variants & Tones</h3>
        <Grid style={{ gap: 12 }}>
          <Alert variant="surface" tone="info" radius={10}><AlertTitle>Info</AlertTitle><AlertDescription>Surface info alert.</AlertDescription></Alert>
          <Alert variant="soft" tone="success" radius={10}><AlertIcon><CheckCircleIcon size={15} /></AlertIcon><AlertTitle>Success</AlertTitle><AlertDescription>Soft success alert.</AlertDescription></Alert>
          <Alert variant="outline" tone="warning" radius={10}><AlertIcon><AlertTriangleIcon size={15} /></AlertIcon><AlertTitle>Warning</AlertTitle><AlertDescription>Outline warning alert.</AlertDescription></Alert>
          <Alert variant="solid" tone="danger" radius={10}><AlertTitle>Danger</AlertTitle><AlertDescription>Solid danger alert.</AlertDescription></Alert>
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Dismissible with Actions</h3>
        {show ? (
          <Alert tone="warning" variant="soft" radius={10} dismissible onClose={() => setShow(false)}>
            <AlertIcon><ShieldIcon size={15} /></AlertIcon>
            <AlertTitle>Security update required</AlertTitle>
            <AlertDescription>Apply the latest patch to stay protected.</AlertDescription>
            <AlertActions style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" onClick={() => toastAdvanced.success('Update scheduled', { duration: 1500, theme: 'light' })}>Schedule</Button>
              <Button size="sm" variant="secondary">Later</Button>
            </AlertActions>
          </Alert>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => setShow(true)}>Restore alert</Button>
        )}
      </div>
    </div>
  );
}

export function CollapsibleDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h2 style={h2}>Collapsible</h2>
      <div style={panel}>
        <h3 style={h3}>Controlled</h3>
        <Collapsible open={open} onChangeOpen={setOpen}>
          <Collapsible.Header>
            <Button variant="secondary" onClick={() => setOpen((v) => !v)}>
              {open ? 'Hide' : 'Show'} details
            </Button>
          </Collapsible.Header>
          <Collapsible.Content>
            <Box style={{ marginTop: 12, padding: 14, borderRadius: 10, background: '#f8fafc', fontSize: 14, color: '#475569' }}>
              This content is revealed when the collapsible is open. It can contain any content.
            </Box>
          </Collapsible.Content>
        </Collapsible>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 12 }}>
          {(['default', 'subtle', 'outline'] as const).map((v) => (
            <Collapsible key={v} variant={v}>
              <Collapsible.Header>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{v} collapsible</div>
              </Collapsible.Header>
              <Collapsible.Content>
                <Box style={{ padding: '10px 0', fontSize: 14, color: '#475569' }}>Content for {v} variant.</Box>
              </Collapsible.Content>
            </Collapsible>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function EmptyStateDemo() {
  return (
    <div>
      <h2 style={h2}>EmptyState</h2>
      <div style={panel}>
        <Grid style={{ gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))' }}>
          <EmptyState title="No results found" description="Try adjusting your search or filters." icon={<InboxIcon size={32} />}>
            <Button size="sm">Clear filters</Button>
          </EmptyState>
          <EmptyState title="Nothing here yet" description="Create your first item to get started." tone="info">
            <Button size="sm">Create item</Button>
          </EmptyState>
          <EmptyState title="Access denied" description="You don't have permission to view this." tone="danger" />
        </Grid>
      </div>
    </div>
  );
}

export function ProgressDemo() {
  const [val, setVal] = useState(60);
  return (
    <div>
      <h2 style={h2}>Progress</h2>
      <div style={panel}>
        <Grid style={{ gap: 14 }}>
          <div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Value: {val}%</div>
            <Flex style={{ gap: 8, marginBottom: 8 }}>
              <Button size="sm" onClick={() => setVal((v) => Math.max(0, v - 10))}>−10</Button>
              <Button size="sm" onClick={() => setVal((v) => Math.min(100, v + 10))}>+10</Button>
            </Flex>
            <Progress value={val} max={100} />
          </div>
          {(['info', 'success', 'warning', 'danger'] as const).map((tone) => (
            <div key={tone}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{tone}</div>
              <Progress value={65} max={100} tone={tone} />
            </div>
          ))}
          <div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Indeterminate</div>
            <Progress indeterminate />
          </div>
        </Grid>
      </div>
    </div>
  );
}

export function MeterDemo() {
  return (
    <div>
      <h2 style={h2}>Meter</h2>
      <div style={panel}>
        <Grid style={{ gap: 12 }}>
          <Meter value={70} min={0} max={100} label="Storage used" />
          <Meter value={45} min={0} max={100} label="CPU usage" tone="warning" />
          <Meter value={90} min={0} max={100} label="Memory" tone="danger" />
          <Meter value={30} min={0} max={100} label="Network" tone="success" />
        </Grid>
      </div>
    </div>
  );
}

export function ToastAPIDemo() {
  return (
    <div>
      <h2 style={h2}>ToastAPI</h2>
      <div style={panel}>
        <h3 style={h3}>Types</h3>
        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button onClick={() => toastAdvanced.success('Operation successful!', { theme: 'light', duration: 1800 })}>Success</Button>
          <Button variant="secondary" onClick={() => toastAdvanced.info('Here is some info.', { theme: 'light', duration: 1800 })}>Info</Button>
          <Button variant="warning" onClick={() => toastAdvanced.warning('Proceed with caution.', { theme: 'light', duration: 1800 })}>Warning</Button>
          <Button variant="danger" onClick={() => toastAdvanced.error('Something went wrong.', { theme: 'light', duration: 1800 })}>Error</Button>
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Promise Toast</h3>
        <Button onClick={() => toastAdvanced.promise(
          new Promise((res) => setTimeout(res, 1500)),
          { loading: { message: 'Saving...', duration: 1400 }, success: { message: 'Saved!', duration: 1500 }, error: { message: 'Failed' } }
        )}>Run Promise</Button>
      </div>
      <div style={panel}>
        <h3 style={h3}>Group Stream</h3>
        <Button variant="secondary" onClick={() => {
          toastAdvanced.group('stream', { message: 'Step 1: Initializing', level: 'info', theme: 'light' });
          setTimeout(() => toastAdvanced.group('stream', { message: 'Step 2: Processing', level: 'info', theme: 'light' }), 400);
          setTimeout(() => toastAdvanced.group('stream', { message: 'Step 3: Complete', level: 'success', theme: 'light' }), 800);
        }}>Simulate stream</Button>
      </div>
    </div>
  );
}
