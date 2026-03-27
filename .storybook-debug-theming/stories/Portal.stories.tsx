import React from 'react';
import { Portal, Button, Box, Grid, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Portal',
  component: Portal,
  argTypes: {
    target: { control: 'text' },
    strategy: { control: 'select', options: ['append', 'prepend'] },
    headless: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
};

export const TargetedPortal = (args: any) => {
  const [show, setShow] = React.useState(true);
  const [log, setLog] = React.useState<string[]>([]);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setShow((v) => !v)}>
          {show ? 'Unmount portaled content' : 'Mount portaled content'}
        </Button>
      </Flex>

      <Box
        id="storybook-portal-target"
        style={{
          minHeight: 96,
          padding: 12,
          border: '1px dashed #94a3b8',
          borderRadius: 10,
          background: 'linear-gradient(180deg, #f8fafc, #f1f5f9)'
        }}
      >
        <strong style={{ display: 'block', marginBottom: 8 }}>Portal target container</strong>
        Incoming content should render inside this box.
      </Box>

      {show && (
        <Portal
          target={args.target}
          strategy={args.strategy}
          headless={args.headless}
          disabled={args.disabled}
          onMount={(d) => setLog((prev) => [`mount (${d.count})`, ...prev].slice(0, 4))}
          onUnmount={(d) => setLog((prev) => [`unmount (${d.count})`, ...prev].slice(0, 4))}
          onSync={(d) => setLog((prev) => [`sync (${d.count})`, ...prev].slice(0, 4))}
          onTargetMissing={(d) => setLog((prev) => [`target missing: ${d.target}`, ...prev].slice(0, 4))}
        >
          <Box style={{ padding: 10, borderRadius: 8, background: '#dbeafe', border: '1px solid #bfdbfe' }}>
            This content is rendered by <code>ui-portal</code>.
          </Box>
        </Portal>
      )}

      <Box style={{ fontSize: 12, color: '#64748b' }}>{log.length ? log.join(' | ') : 'No portal events yet.'}</Box>
    </Grid>
  );
};

TargetedPortal.args = {
  target: '#storybook-portal-target',
  strategy: 'append',
  headless: false,
  disabled: false
};

export const StrategyComparison = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: 14 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Append Strategy</strong>
      <Box id="portal-append-target" style={{ marginTop: 8, minHeight: 72, padding: 10, border: '1px dashed #cbd5e1', borderRadius: 8 }}>
        <Box style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Existing content A</Box>
        <Portal target="#portal-append-target" strategy="append">
          <Box style={{ padding: 8, borderRadius: 8, background: '#e0f2fe' }}>Portaled (append)</Box>
        </Portal>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Prepend Strategy</strong>
      <Box id="portal-prepend-target" style={{ marginTop: 8, minHeight: 72, padding: 10, border: '1px dashed #cbd5e1', borderRadius: 8 }}>
        <Box style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Existing content B</Box>
        <Portal target="#portal-prepend-target" strategy="prepend">
          <Box style={{ padding: 8, borderRadius: 8, background: '#dcfce7' }}>Portaled (prepend)</Box>
        </Portal>
      </Box>
    </Box>
  </Grid>
);

export const BodyPortal = () => (
  <Portal>
    <Box
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 1600,
        background: '#0f172a',
        color: '#fff',
        padding: '8px 10px',
        borderRadius: 8,
        boxShadow: '0 14px 26px rgba(2, 6, 23, 0.28)'
      }}
    >
      Portaled to document.body
    </Box>
  </Portal>
);
