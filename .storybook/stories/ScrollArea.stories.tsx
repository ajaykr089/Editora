import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/ScrollArea',
  component: ScrollArea
};

export const Default = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = (event: Event) => {
      const detail = (event as CustomEvent<{ scrollTop: number }>).detail;
      if (detail?.scrollTop != null) {
        setScrollTop(Math.round(detail.scrollTop));
        setAtEnd(false);
      }
    };
    const handleEnd = () => setAtEnd(true);

    el.addEventListener('scroll', handleScroll as EventListener);
    el.addEventListener('reach-end', handleEnd as EventListener);
    return () => {
      el.removeEventListener('scroll', handleScroll as EventListener);
      el.removeEventListener('reach-end', handleEnd as EventListener);
    };
  }, []);

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 460 }}>
      <ScrollArea ref={ref as any} style={{ maxHeight: 180, border: '1px solid #e2e8f0', borderRadius: 10, padding: 8 }}>
        {Array.from({ length: 30 }).map((_, idx) => (
          <Box key={idx} style={{ padding: '8px 4px', borderBottom: '1px solid #f1f5f9' }}>
            Row {idx + 1}
          </Box>
        ))}
      </ScrollArea>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        scrollTop: {scrollTop}px {atEnd ? '• reached end' : ''}
      </Box>
    </Grid>
  );
};
