import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Grid, Slot } from '@editora/ui-react';

export default {
  title: 'UI/Slot',
  component: Slot
};

export const NamedSlot = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [changes, setChanges] = useState(0);
  const [showBadge, setShowBadge] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onSlotChange = () => setChanges((value) => value + 1);
    el.addEventListener('slotchange', onSlotChange as EventListener);
    return () => el.removeEventListener('slotchange', onSlotChange as EventListener);
  }, []);

  return (
    <Grid gap="12px" style={{ maxWidth: 520 }}>
      <Button size="sm" variant="secondary" onClick={() => setShowBadge((value) => !value)}>
        Toggle slotted content
      </Button>

      <Flex align="center" gap="8px">
        <span>Document title</span>
        <Slot ref={ref as any} name="badge" variant="chip" tone="brand" fallback="No badge">
          {showBadge ? (
            <span slot="badge" style={{ padding: '2px 8px', borderRadius: 999, background: '#dbeafe', fontSize: 12 }}>
              Beta
            </span>
          ) : null}
        </Slot>
      </Flex>

      <Box style={{ fontSize: 13, color: '#475569' }}>slotchange fired: {changes}</Box>
    </Grid>
  );
};

export const VisualModes = () => (
  <Grid columns={{ initial: '1fr', md: 'repeat(2, minmax(0, 1fr))' } as any} gap="12px" style={{ maxWidth: 680 }}>
    <Slot variant="surface" fallback="No assignee">
      <span style={{ fontSize: 12 }}>Assignee: Ava</span>
    </Slot>

    <Slot variant="outline" tone="warning" fallback="No due date">
      <span style={{ fontSize: 12 }}>Due: Tomorrow</span>
    </Slot>

    <Slot variant="soft" tone="success" fallback="No status">
      <span style={{ fontSize: 12 }}>Status: Healthy</span>
    </Slot>

    <Slot variant="contrast" fallback="No environment">
      <span style={{ fontSize: 12 }}>Environment: Production</span>
    </Slot>
  </Grid>
);

export const RequiredState = () => {
  const [resolved, setResolved] = useState(false);
  const [value, setValue] = useState(false);

  return (
    <Grid gap="12px" style={{ maxWidth: 480 }}>
      <Button size="sm" onClick={() => setValue((current) => !current)}>
        {value ? 'Remove content' : 'Resolve content'}
      </Button>

      <Slot
        required
        name="status"
        fallback="Missing required slot"
        variant="outline"
        tone="danger"
        onMissing={() => setResolved(false)}
        onResolved={() => setResolved(true)}
      >
        {value ? <span slot="status">Ready</span> : null}
      </Slot>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Required slot resolved: {resolved ? 'yes' : 'no'}
      </Box>
    </Grid>
  );
};
