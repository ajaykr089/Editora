import React, { useState, useMemo } from 'react';
import { Box, Flex, Grid, Icon, IconCloud } from '@editora/ui-react';
import {
  ActivityIcon, BellIcon, ChartBarIcon,
  FolderIcon, GlobeIcon, LayersIcon,
  SearchIcon, ShieldIcon,
} from '@editora/react-icons';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };

const nodeShellStyle: React.CSSProperties = {
  width: '100%', height: '100%',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: 'transparent',
};

const nodeGlyphStyle: React.CSSProperties = {
  width: 30, height: 30,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 10,
  background: '#ffffff',
  boxShadow: '0 8px 18px rgba(15,23,42,0.10), 0 0 0 1px rgba(148,163,184,0.22)',
  color: '#1d4ed8',
};

const CLOUD_ITEMS = [
  { value: 'search', label: 'Search', Ic: SearchIcon },
  { value: 'alerts', label: 'Alerts', Ic: BellIcon },
  { value: 'assets', label: 'Assets', Ic: FolderIcon },
  { value: 'status', label: 'Status', Ic: ActivityIcon },
  { value: 'trust', label: 'Trust', Ic: ShieldIcon },
  { value: 'global', label: 'Global', Ic: GlobeIcon },
  { value: 'metrics', label: 'Metrics', Ic: ChartBarIcon },
  { value: 'layers', label: 'Layers', Ic: LayersIcon },
];

export function IconCloudDemo() {
  const ref = React.useRef<any>(null);
  const [selected, setSelected] = useState('Editora');

  return (
    <div>
      <h2 style={h2}>IconCloud</h2>
      <div style={panel}>
        <h3 style={h3}>Interactive 3D cloud</h3>
        <Box style={{
          padding: 24,
          borderRadius: 16,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          display: 'grid',
          gap: 16,
        }}>
          <Flex style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>Click an orbit item to update the center label.</Box>
            <button style={{ borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', padding: '8px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }} onClick={() => ref.current?.pause()}>Pause</button>
            <button style={{ borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', padding: '8px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }} onClick={() => ref.current?.play()}>Play</button>
            <button style={{ borderRadius: 10, border: '1px solid #cbd5e1', background: '#fff', padding: '8px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }} onClick={() => ref.current?.refresh()}>Refresh</button>
            <Box style={{ padding: '8px 12px', borderRadius: 10, background: '#eff6ff', fontSize: 13, color: '#2563eb', fontWeight: 600 }}>Selected: {selected}</Box>
          </Flex>
          <Flex style={{ justifyContent: 'center', alignItems: 'center', minHeight: 420 }}>
            <Box style={{ width: 'min(100%, 440px)', aspectRatio: '1 / 1', display: 'grid', placeItems: 'center' }}>
            <IconCloud
              ref={ref}
              variant="surface"
              tone="brand"
              size="md"
              radius={124}
              perspective={900}
              depth={0.9}
              itemSize={42}
              centerSize={92}
              speed={0.45}
              surfaceRadius={16}
              elevation="low"
              interactive
              autoFit
              pauseOnHover
              pauseOnItemHover
            >
              <IconCloud.Center>
                <Box style={{ display: 'grid', gap: 2, textAlign: 'center', width: '100%', height: '100%', alignContent: 'center', padding: 10, borderRadius: 18, background: '#ffffff', boxShadow: '0 14px 32px rgba(15,23,42,0.12), 0 0 0 1px rgba(148,163,184,0.18)' }}>
                  <Box style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>Core</Box>
                  <Box style={{ fontSize: 18, lineHeight: 1.1, fontWeight: 800, color: '#0f172a' }}>{selected}</Box>
                </Box>
              </IconCloud.Center>
              {CLOUD_ITEMS.map(({ value, label, Ic }) => (
                <IconCloud.Item key={value} clickable aria-label={label} title={label} style={nodeShellStyle} onClick={() => setSelected(label)}>
                  <Box style={nodeGlyphStyle}><Ic size={17} /></Box>
                </IconCloud.Item>
              ))}
            </IconCloud>
            </Box>
          </Flex>
        </Box>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variant gallery</h3>
        <Grid style={{ gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))' }}>
          {(['surface', 'soft', 'glass', 'contrast', 'minimal'] as const).map((v, i) => (
            <Box key={v} style={{ display: 'grid', placeItems: 'center', gap: 10, padding: 14, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
              <IconCloud variant={v} tone="brand" radius={72} perspective={680} depth={0.85} itemSize={28} centerSize={58} speed={0.35 + i * 0.08} autoFit size="sm" surfaceRadius={12}>
                <IconCloud.Center>
                  <Box style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>{v}</Box>
                </IconCloud.Center>
                {CLOUD_ITEMS.slice(0, 6).map(({ value, label, Ic }) => (
                  <IconCloud.Item key={value} aria-label={label} style={nodeShellStyle}>
                    <Box style={{ ...nodeGlyphStyle, width: 22, height: 22, borderRadius: 8, boxShadow: '0 4px 10px rgba(15,23,42,0.10), 0 0 0 1px rgba(148,163,184,0.18)' }}><Ic size={13} /></Box>
                  </IconCloud.Item>
                ))}
              </IconCloud>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{v}</div>
            </Box>
          ))}
        </Grid>
      </div>
    </div>
  );
}

const FALLBACK_ICONS = [
  'activity','alert-circle','alert-triangle','archive','arrow-down','arrow-left',
  'arrow-right','arrow-up','bell','bookmark','calendar','check','check-circle',
  'chevron-down','chevron-left','chevron-right','chevron-up','clipboard','clock',
  'cloud','code','copy','credit-card','download','edit','eye','file','filter',
  'flag','folder','globe','grid','heart','help-circle','home','image','inbox',
  'info','layers','layout','link','list','lock','log-out','mail','map','menu',
  'message-circle','minus','moon','more-horizontal','more-vertical','package',
  'paperclip','pause','play','plus','printer','refresh-cw','save','search',
  'send','settings','share','shield','shopping-cart','sliders','star','sun',
  'tag','trash','trending-up','upload','user','users','x','x-circle','zap',
  'zoom-in','zoom-out',
];

export function IconsCatalogDemo() {
  const [query, setQuery] = useState('');
  const [allNames] = useState<string[]>(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require('@editora/icons') as { iconNameList?: string[] };
      return mod.iconNameList ?? FALLBACK_ICONS;
    } catch {
      return FALLBACK_ICONS;
    }
  });

  const filteredNames = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? allNames.filter((n) => n.includes(term)) : allNames;
  }, [query, allNames]);

  return (
    <div>
      <h2 style={h2}>Icons Catalog</h2>
      <div style={panel}>
        <Flex style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 13, color: '#475569' }}>
          <span>Showing <strong>{filteredNames.length}</strong> / {allNames.length} icons</span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>@editora/icons</span>
        </Flex>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons..."
          style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 12px', fontSize: 14, outline: 'none', marginBottom: 14, boxSizing: 'border-box' }}
        />
        <Grid style={{ gap: 8, gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))' }}>
          {filteredNames.map((name) => (
            <Box
              key={name}
              title={name}
              style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, display: 'grid', justifyItems: 'center', background: '#fff', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#eff6ff')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              <Box style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
                <Icon name={name} size={20} decorative />
              </Box>
            </Box>
          ))}
        </Grid>
        {filteredNames.length === 0 && (
          <Box style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>No icons match "{query}"</Box>
        )}
      </div>
    </div>
  );
}
