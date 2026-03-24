import React from 'react';
import { Presence, Button, Box, Grid, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Presence',
  component: Presence,
  argTypes: {
    present: { control: 'boolean' },
    mode: { control: 'select', options: ['fade', 'scale', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'blur', 'flip'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'soft', 'glass', 'contrast'] },
    keepMounted: { control: 'boolean' },
    lazy: { control: 'boolean' },
    enterDuration: { control: { type: 'number', min: 50, max: 600, step: 10 } },
    exitDuration: { control: { type: 'number', min: 50, max: 600, step: 10 } },
    delay: { control: { type: 'number', min: 0, max: 500, step: 10 } }
  }
};

export const Playground = (args: any) => {
  const [present, setPresent] = React.useState(!!args.present);
  const [events, setEvents] = React.useState<string[]>([]);

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setPresent((v) => !v)}>
          {present ? 'Hide card' : 'Show card'}
        </Button>
      </Flex>

      <Presence
        present={present}
        mode={args.mode}
        size={args.size}
        variant={args.variant}
        keepMounted={args.keepMounted}
        lazy={args.lazy}
        enterDuration={args.enterDuration}
        exitDuration={args.exitDuration}
        delay={args.delay}
        onBeforeEnter={() => setEvents((prev) => ['before-enter', ...prev].slice(0, 6))}
        onEnter={() => setEvents((prev) => ['enter', ...prev].slice(0, 6))}
        onAfterEnter={() => setEvents((prev) => ['after-enter', ...prev].slice(0, 6))}
        onBeforeExit={() => setEvents((prev) => ['before-exit', ...prev].slice(0, 6))}
        onExit={() => setEvents((prev) => ['exit', ...prev].slice(0, 6))}
        onAfterExit={() => setEvents((prev) => ['after-exit', ...prev].slice(0, 6))}
      >
        <Box
          style={{
            padding: 16,
            borderRadius: 12,
            border: '1px solid #bfdbfe',
            background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)'
          }}
        >
          Presence-aware content with configurable motion states.
        </Box>
      </Presence>

      <Box style={{ fontSize: 12, color: '#64748b' }}>{events.length ? events.join(' | ') : 'No motion events yet.'}</Box>
    </Grid>
  );
};

Playground.args = {
  present: true,
  mode: 'fade',
  size: 'md',
  variant: 'default',
  keepMounted: false,
  lazy: false,
  enterDuration: 180,
  exitDuration: 150,
  delay: 0
};

export const MotionModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))', gap: 12, maxWidth: 700 }}>
    <Presence present mode="fade">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>Fade</Box>
    </Presence>
    <Presence present mode="scale" variant="soft">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>Scale</Box>
    </Presence>
    <Presence present mode="slide-up">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>Slide Up</Box>
    </Presence>
    <Presence present mode="slide-right">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>Slide Right</Box>
    </Presence>
    <Presence present mode="blur" variant="glass">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
        Blur
      </Box>
    </Presence>
    <Presence present mode="flip" variant="contrast">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }}>
        Flip
      </Box>
    </Presence>
  </Grid>
);

export const KeepMounted = () => {
  const [present, setPresent] = React.useState(true);
  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <Button size="sm" onClick={() => setPresent((v) => !v)}>
        Toggle (keep-mounted)
      </Button>
      <Presence present={present} keepMounted mode="slide-down">
        <Box style={{ padding: 14, borderRadius: 10, border: '1px solid #dbeafe', background: '#f8fbff' }}>
          This node stays mounted in DOM even after exit transitions.
        </Box>
      </Presence>
    </Grid>
  );
};
