import React, { useState } from 'react';
import {
  Box, Button, CopyButton, Flex, Grid, QuickActions, SplitButton,
  Toggle, ToggleGroup, Toolbar,
} from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };

export function ButtonDemo() {
  return (
    <div>
      <h2 style={h2}>Button</h2>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          {(['primary','secondary','ghost','outline','danger','warning','success'] as const).map((v) => (
            <Button key={v} variant={v}>{v}</Button>
          ))}
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Sizes</h3>
        <Flex style={{ gap: 8, alignItems: 'center' }}>
          {(['xs','sm','md','lg','xl'] as const).map((s) => <Button key={s} size={s}>{s}</Button>)}
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>States</h3>
        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button variant="secondary" loading>Loading secondary</Button>
        </Flex>
      </div>
    </div>
  );
}

export function ButtonMatricesDemo() {
  return (
    <div>
      <h2 style={h2}>Button Matrices</h2>
      <div style={panel}>
        <h3 style={h3}>Variant × Size matrix</h3>
        <Grid style={{ gap: 8 }}>
          {(['primary','secondary','ghost','danger'] as const).map((v) => (
            <Flex key={v} style={{ gap: 8, alignItems: 'center' }}>
              <Box style={{ width: 90, fontSize: 12, color: '#64748b', fontWeight: 600 }}>{v}</Box>
              {(['xs','sm','md','lg'] as const).map((s) => <Button key={s} variant={v} size={s}>{s}</Button>)}
            </Flex>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function CopyButtonDemo() {
  return (
    <div>
      <h2 style={h2}>CopyButton</h2>
      <div style={panel}>
        <Grid style={{ gap: 12 }}>
          <Flex style={{ gap: 10, alignItems: 'center' }}>
            <code style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>npm install @editora/ui-react</code>
            <CopyButton value="npm install @editora/ui-react" />
          </Flex>
          <Flex style={{ gap: 10, alignItems: 'center' }}>
            <code style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>npx @editora/cli add button</code>
            <CopyButton value="npx @editora/cli add button" size="sm" />
          </Flex>
        </Grid>
      </div>
    </div>
  );
}

export function ToggleDemo() {
  const [pressed, setPressed] = useState(false);
  return (
    <div>
      <h2 style={h2}>Toggle</h2>
      <div style={panel}>
        <h3 style={h3}>States</h3>
        <Flex style={{ gap: 10, flexWrap: 'wrap' }}>
          <Toggle pressed={pressed} onChange={(d: any) => setPressed(d.pressed)}>
            {pressed ? 'On' : 'Off'}
          </Toggle>
          <Toggle defaultPressed>Default pressed</Toggle>
          <Toggle disabled>Disabled</Toggle>
          <Toggle disabled defaultPressed>Disabled pressed</Toggle>
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          {(['default','soft','outline','contrast','minimal'] as const).map((v) => (
            <Toggle key={v} variant={v}>{v}</Toggle>
          ))}
        </Flex>
      </div>
    </div>
  );
}

export function ToggleGroupDemo() {
  const [align, setAlign] = useState('left');
  const [formats, setFormats] = useState<string[]>(['bold']);
  return (
    <div>
      <h2 style={h2}>ToggleGroup</h2>
      <div style={panel}>
        <h3 style={h3}>Single select</h3>
        <ToggleGroup value={align} variant="soft" onValueChange={(d: any) => { if (typeof d.value === 'string') setAlign(d.value); }}>
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
          <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
          <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
        </ToggleGroup>
        <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Alignment: {align}</div>
      </div>
      <div style={panel}>
        <h3 style={h3}>Multiple select</h3>
        <ToggleGroup multiple value={formats} onValueChange={(d: any) => { if (Array.isArray(d.value)) setFormats(d.value); }}>
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
          <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
          <ToggleGroup.Item value="strike">Strike</ToggleGroup.Item>
        </ToggleGroup>
        <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Active: {formats.join(', ') || 'none'}</div>
      </div>
    </div>
  );
}

export function ToolbarDemo() {
  return (
    <div>
      <h2 style={h2}>Toolbar</h2>
      <div style={panel}>
        <h3 style={h3}>Default</h3>
        <Toolbar>
          <button onClick={() => toastAdvanced.info('Bold', { duration: 1200, theme: 'light' })} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 700 }}>B</button>
          <button onClick={() => toastAdvanced.info('Italic', { duration: 1200, theme: 'light' })} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontStyle: 'italic' }}>I</button>
          <button onClick={() => toastAdvanced.info('Underline', { duration: 1200, theme: 'light' })} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', textDecoration: 'underline' }}>U</button>
          <span style={{ width: 1, background: '#e2e8f0', margin: '0 4px', alignSelf: 'stretch' }} />
          <button onClick={() => toastAdvanced.info('Align left', { duration: 1200, theme: 'light' })} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Left</button>
          <button onClick={() => toastAdvanced.info('Align center', { duration: 1200, theme: 'light' })} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Center</button>
          <button onClick={() => toastAdvanced.info('Align right', { duration: 1200, theme: 'light' })} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Right</button>
        </Toolbar>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 12 }}>
          {(['default', 'soft', 'contrast', 'minimal'] as const).map((v) => (
            <div key={v}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', fontWeight: 600 }}>{v}</div>
              <Toolbar variant={v}>
                <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer' }}>File</button>
                <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer' }}>Edit</button>
                <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer' }}>View</button>
              </Toolbar>
            </div>
          ))}
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Vertical</h3>
        <Toolbar orientation="vertical" style={{ width: 'fit-content' }}>
          <button style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Top</button>
          <button style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Middle</button>
          <button style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Bottom</button>
        </Toolbar>
      </div>
    </div>
  );
}

export function SplitButtonDemo() {
  return (
    <div>
      <h2 style={h2}>SplitButton</h2>
      <div style={panel}>
        <Flex style={{ gap: 12, flexWrap: 'wrap' }}>
          <SplitButton
            label="Save"
            onClick={() => toastAdvanced.success('Saved', { duration: 1500, theme: 'light' })}
            items={[
              { label: 'Save as draft', onSelect: () => toastAdvanced.info('Saved as draft', { duration: 1500, theme: 'light' }) },
              { label: 'Save and publish', onSelect: () => toastAdvanced.success('Published', { duration: 1500, theme: 'light' }) },
            ]}
          />
          <SplitButton
            label="Deploy"
            variant="secondary"
            onClick={() => toastAdvanced.info('Deploying...', { duration: 1500, theme: 'light' })}
            items={[
              { label: 'Deploy to staging', onSelect: () => toastAdvanced.info('Staging deploy', { duration: 1500, theme: 'light' }) },
              { label: 'Deploy to production', onSelect: () => toastAdvanced.warning('Production deploy', { duration: 1500, theme: 'light' }) },
            ]}
          />
        </Flex>
      </div>
    </div>
  );
}

export function QuickActionsDemo() {
  return (
    <div>
      <h2 style={h2}>QuickActions</h2>
      <div style={panel}>
        <QuickActions>
          <QuickActions.Action label="Edit" onSelect={() => toastAdvanced.info('Edit', { duration: 1200, theme: 'light' })} />
          <QuickActions.Action label="Duplicate" onSelect={() => toastAdvanced.info('Duplicate', { duration: 1200, theme: 'light' })} />
          <QuickActions.Action label="Archive" onSelect={() => toastAdvanced.warning('Archived', { duration: 1200, theme: 'light' })} />
          <QuickActions.Action label="Delete" tone="danger" onSelect={() => toastAdvanced.error('Deleted', { duration: 1200, theme: 'light' })} />
        </QuickActions>
      </div>
    </div>
  );
}
