import React from 'react';
import { Box, Flex, Grid, Icon, Kbd, Separator, VisuallyHidden } from '@editora/ui-react';
import { BellIcon, CheckCircleIcon, HomeIcon, SearchIcon, SettingsIcon, UserIcon } from '@editora/react-icons';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };

export function IconDemo() {
  const icons = [BellIcon, CheckCircleIcon, HomeIcon, SearchIcon, SettingsIcon, UserIcon];
  return (
    <div>
      <h2 style={h2}>Icon</h2>
      <div style={panel}>
        <h3 style={h3}>Sizes</h3>
        <Flex style={{ gap: 16, alignItems: 'center' }}>
          {[12, 16, 20, 24, 32, 40].map((s) => (
            <Icon key={s} size={s}><BellIcon /></Icon>
          ))}
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Icon set sample</h3>
        <Flex style={{ gap: 20, flexWrap: 'wrap' }}>
          {icons.map((Ic, i) => (
            <Box key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Ic size={22} />
              <span style={{ fontSize: 10, color: '#94a3b8' }}>Icon {i + 1}</span>
            </Box>
          ))}
        </Flex>
      </div>
    </div>
  );
}

export function ShortcutDemo() {
  return (
    <div>
      <h2 style={h2}>Shortcut</h2>
      <div style={panel}>
        <Grid style={{ gap: 10 }}>
          <Flex style={{ gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#475569', width: 140 }}>Open search</span>
            <Kbd keys={['⌘', 'K']} size="sm" />
          </Flex>
          <Flex style={{ gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#475569', width: 140 }}>New document</span>
            <Kbd keys={['⌘', 'N']} size="sm" />
          </Flex>
          <Flex style={{ gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#475569', width: 140 }}>Toggle sidebar</span>
            <Kbd keys={['⌘', '⇧', 'B']} size="sm" />
          </Flex>
          <Flex style={{ gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#475569', width: 140 }}>Find & replace</span>
            <Kbd keys={['⌘', '⇧', 'H']} size="sm" />
          </Flex>
        </Grid>
      </div>
    </div>
  );
}

export function VisuallyHiddenDemo() {
  return (
    <div>
      <h2 style={h2}>VisuallyHidden</h2>
      <div style={panel}>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 12 }}>
          The button below has a visually hidden label for screen readers.
        </p>
        <Flex style={{ gap: 12, alignItems: 'center' }}>
          <button style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BellIcon size={16} />
            <VisuallyHidden>Notifications</VisuallyHidden>
          </button>
          <span style={{ fontSize: 13, color: '#64748b' }}>← has hidden "Notifications" label</span>
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Separator</h3>
        <Box style={{ padding: 16, background: '#f8fafc', borderRadius: 10 }}>
          <div style={{ fontSize: 14 }}>Above separator</div>
          <Separator style={{ margin: '10px 0' }} />
          <div style={{ fontSize: 14 }}>Below separator</div>
        </Box>
        <Box style={{ marginTop: 12, padding: 16, background: '#f8fafc', borderRadius: 10 }}>
          <Flex style={{ height: 36, alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14 }}>Left</span>
            <Separator orientation="vertical" />
            <span style={{ fontSize: 14 }}>Right</span>
          </Flex>
        </Box>
      </div>
    </div>
  );
}
