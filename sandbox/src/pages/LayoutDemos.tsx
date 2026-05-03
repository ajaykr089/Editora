import React, { useState } from 'react';
import {
  AppHeader, AspectRatio, Box, Button, Card, Container, Flex, Grid,
  Layout, PanelGroup, Panel, Splitter, Section, Sidebar,
} from '@editora/ui-react';
import { BellIcon, SearchIcon, ShieldIcon } from '@editora/react-icons';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };

export function AppHeaderDemo() {
  return (
    <div>
      <h2 style={h2}>AppHeader</h2>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 12 }}>
          {(['surface','soft','outline','solid'] as const).map((variant) => (
            <div key={variant}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>{variant}</div>
              <AppHeader variant={variant} tone="neutral" bordered radius={10} style={{ width: '100%' }}>
                <AppHeader.Start>
                  <Flex align="center" style={{ gap: 8 }}>
                    <Box style={{ width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center', background: 'color-mix(in srgb,var(--ui-color-primary,#2563eb) 12%,transparent)', color: 'var(--ui-color-primary,#2563eb)' }}>
                      <ShieldIcon size={14} />
                    </Box>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Editora</span>
                  </Flex>
                </AppHeader.Start>
                <AppHeader.Title>Dashboard</AppHeader.Title>
                <AppHeader.End>
                  <Button size="sm" variant="secondary"><SearchIcon size={13} /> Search</Button>
                  <Button size="sm" variant="secondary"><BellIcon size={13} /></Button>
                </AppHeader.End>
              </AppHeader>
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function AspectRatioDemo() {
  const img = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80';
  return (
    <div>
      <h2 style={h2}>AspectRatio</h2>
      <div style={panel}>
        <h3 style={h3}>Ratios</h3>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))' }}>
          {(['16/9','4/3','1/1'] as const).map((ratio) => (
            <div key={ratio}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{ratio}</div>
              <AspectRatio ratio={ratio} radius={10} showRatioBadge style={{ width: '100%' }}>
                <img src={img} alt="demo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </AspectRatio>
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function BoxDemo() {
  return (
    <div>
      <h2 style={h2}>Box</h2>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))' }}>
          {(['surface','outline','contrast'] as const).map((v) => (
            <Box key={v} variant={v} p="12px" radius="md" style={{ textAlign: 'center', fontSize: 13 }}>{v}</Box>
          ))}
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Padding & Radius</h3>
        <Flex style={{ gap: 10, flexWrap: 'wrap' }}>
          {(['sm','md','lg','xl'] as const).map((r) => (
            <Box key={r} variant="surface" p="12px" radius={r} style={{ fontSize: 13, border: '1px solid #e2e8f0' }}>radius={r}</Box>
          ))}
        </Flex>
      </div>
    </div>
  );
}

export function ContainerDemo() {
  return (
    <div>
      <h2 style={h2}>Container</h2>
      <div style={panel}>
        <h3 style={h3}>Sizes</h3>
        <Grid style={{ gap: 10 }}>
          {(['sm','md','lg','xl'] as const).map((size) => (
            <Container key={size} size={size} style={{ background: '#f1f5f9', borderRadius: 8, padding: 12, fontSize: 13 }}>
              Container size="{size}"
            </Container>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function FlexDemo() {
  return (
    <div>
      <h2 style={h2}>Flex</h2>
      <div style={panel}>
        <h3 style={h3}>Direction & Alignment</h3>
        <Grid style={{ gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Row (default)</div>
            <Flex gap="8px" style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              {['A','B','C'].map((l) => <Box key={l} style={{ padding: '6px 14px', background: '#e0e7ff', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>{l}</Box>)}
            </Flex>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Column</div>
            <Flex direction="column" gap="6px" style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              {['X','Y','Z'].map((l) => <Box key={l} style={{ padding: '6px 14px', background: '#dcfce7', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>{l}</Box>)}
            </Flex>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Justify between</div>
            <Flex justify="between" style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              <Box style={{ padding: '6px 14px', background: '#fef9c3', borderRadius: 6, fontSize: 13 }}>Left</Box>
              <Box style={{ padding: '6px 14px', background: '#fef9c3', borderRadius: 6, fontSize: 13 }}>Right</Box>
            </Flex>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export function GridDemo() {
  return (
    <div>
      <h2 style={h2}>Grid</h2>
      <div style={panel}>
        <h3 style={h3}>Column Layouts</h3>
        <Grid style={{ gap: 16 }}>
          {[2,3,4].map((cols) => (
            <div key={cols}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{cols} columns</div>
              <Grid columns={cols} gap="8px">
                {Array.from({ length: cols * 2 }).map((_, i) => (
                  <Box key={i} style={{ padding: 12, background: '#f1f5f9', borderRadius: 8, fontSize: 13, textAlign: 'center' }}>Cell {i + 1}</Box>
                ))}
              </Grid>
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function SectionDemo() {
  return (
    <div>
      <h2 style={h2}>Section</h2>
      <div style={panel}>
        <Section style={{ background: '#f8fafc', borderRadius: 12, padding: 20, marginBottom: 12 }}>
          <h3 style={{ margin: 0, marginBottom: 8 }}>Section A</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Semantic section wrapper for page regions.</p>
        </Section>
        <Section style={{ background: '#eff6ff', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: 0, marginBottom: 8 }}>Section B</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Another section with different background.</p>
        </Section>
      </div>
    </div>
  );
}

export function SidebarDemo() {
  const [selected, setSelected] = useState('dashboard');
  return (
    <div>
      <h2 style={h2}>Sidebar</h2>
      <div style={{ ...panel, padding: 0, overflow: 'hidden', height: 420 }}>
        <Flex style={{ height: '100%' }}>
          <Sidebar style={{ width: 220, height: '100%', borderRight: '1px solid #e2e8f0' }} onSelect={(d: any) => setSelected(d.value)}>
            <Sidebar.Header>
              <div style={{ fontWeight: 700, fontSize: 15, padding: '16px 16px 8px' }}>Editora</div>
            </Sidebar.Header>
            <Sidebar.SearchInput placeholder="Search..." />
            <Sidebar.Content>
              <Sidebar.Group label="Main">
                <Sidebar.Item value="dashboard" selected={selected === 'dashboard'}>Dashboard</Sidebar.Item>
                <Sidebar.Item value="analytics" selected={selected === 'analytics'}>Analytics</Sidebar.Item>
                <Sidebar.Item value="reports" selected={selected === 'reports'}>Reports</Sidebar.Item>
              </Sidebar.Group>
              <Sidebar.Group label="Settings">
                <Sidebar.Item value="profile" selected={selected === 'profile'}>Profile</Sidebar.Item>
                <Sidebar.Item value="billing" selected={selected === 'billing'}>Billing</Sidebar.Item>
              </Sidebar.Group>
            </Sidebar.Content>
            <Sidebar.Footer>
              <div style={{ padding: '8px 16px', fontSize: 12, color: '#94a3b8' }}>v0.1.12</div>
            </Sidebar.Footer>
          </Sidebar>
          <Box style={{ flex: 1, padding: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Selected: {selected}</div>
            <div style={{ color: '#64748b', fontSize: 14 }}>Click sidebar items to navigate.</div>
          </Box>
        </Flex>
      </div>
    </div>
  );
}

export function PanelGroupDemo() {
  return (
    <div>
      <h2 style={h2}>PanelGroup</h2>
      <div style={{ ...panel, padding: 0, overflow: 'hidden', height: 300 }}>
        <PanelGroup direction="horizontal" style={{ height: '100%' }}>
          <Panel defaultSize={30} minSize={20} style={{ padding: 16, background: '#f8fafc' }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Left Panel</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Drag the splitter to resize.</div>
          </Panel>
          <Splitter />
          <Panel style={{ padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Right Panel</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Content area.</div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
