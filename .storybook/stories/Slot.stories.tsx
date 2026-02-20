import React, { useEffect, useRef, useState } from 'react';
import { Slot , Box, Grid, Flex} from '@editora/ui-react';

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
    const onSlotChange = () => setChanges((v) => v + 1);
    el.addEventListener('slotchange', onSlotChange as EventListener);
    return () => el.removeEventListener('slotchange', onSlotChange as EventListener);
  }, []);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <button onClick={() => setShowBadge((v) => !v)} style={{ width: 'fit-content' }}>
        Toggle slotted badge
      </button>

      <Flex style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span>Document title</span>
        <Slot ref={ref as any} name="badge">
          {showBadge ? <span slot="badge" style={{ padding: '2px 8px', borderRadius: 999, background: '#dbeafe', fontSize: 12 }}>Beta</span> : null}
        </Slot>
      </Flex>

      <Box style={{ fontSize: 13, color: '#475569' }}>slotchange fired: {changes}</Box>
    </Grid>
  );
};
