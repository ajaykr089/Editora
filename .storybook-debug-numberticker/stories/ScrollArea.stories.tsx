import React, { useRef, useState } from 'react';
import { Box, Button, Grid, ScrollArea } from '@editora/ui-react';

export default {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal', 'both'] },
    variant: { control: 'select', options: ['default', 'soft', 'inset', 'contrast', 'minimal'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    tone: { control: 'select', options: ['neutral', 'brand', 'info', 'success', 'warning', 'danger'] },
    autoHide: { control: 'boolean' },
    shadows: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const ref = useRef<HTMLElement | null>(null);
  const [status, setStatus] = useState('Scroll to inspect edge events');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', gap: 8 }}>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.scrollToTop?.('smooth')}>
          Scroll Top
        </Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.scrollToBottom?.('smooth')}>
          Scroll Bottom
        </Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.scrollToIndex?.(24, 'smooth')}>
          Scroll to Row 25
        </Button>
      </Grid>

      <ScrollArea
        ref={ref as any}
        orientation={args.orientation}
        variant={args.variant}
        size={args.size}
        tone={args.tone}
        autoHide={args.autoHide}
        shadows={args.shadows}
        style={{ maxHeight: 220 }}
        onScrollChange={(detail) => {
          setStatus(`top: ${Math.round(detail.scrollTop)}px | left: ${Math.round(detail.scrollLeft)}px`);
        }}
        onReachStart={() => setStatus('Reached start')}
        onReachEnd={() => setStatus('Reached end')}
      >
        {Array.from({ length: 30 }).map((_, idx) => (
          <Box key={idx} style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0' }}>
            Activity row #{idx + 1}
          </Box>
        ))}
      </ScrollArea>

      <Box style={{ fontSize: 13, color: '#475569' }}>{status}</Box>
    </Grid>
  );
};

Playground.args = {
  orientation: 'vertical',
  variant: 'soft',
  size: 'md',
  tone: 'neutral',
  autoHide: true,
  shadows: true
};

export const HorizontalAndBoth = () => (
  <Grid style={{ display: 'grid', gap: 14, maxWidth: 760 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
      <strong style={{ fontSize: 13 }}>Horizontal</strong>
      <ScrollArea orientation="horizontal" variant="inset" tone="brand" style={{ maxHeight: 110 }}>
        <Grid style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '220px', gap: 10, padding: 8 }}>
          {Array.from({ length: 10 }).map((_, idx) => (
            <Box key={idx} style={{ border: '1px solid #dbeafe', borderRadius: 10, padding: 10, background: '#eff6ff' }}>
              Card {idx + 1}
            </Box>
          ))}
        </Grid>
      </ScrollArea>
    </Box>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
      <strong style={{ fontSize: 13 }}>Both axes</strong>
      <ScrollArea orientation="both" variant="default" tone="info" style={{ maxHeight: 180 }}>
        <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 180px)', gap: 8, padding: 8 }}>
          {Array.from({ length: 24 }).map((_, idx) => (
            <Box key={idx} style={{ border: '1px solid #bae6fd', borderRadius: 8, padding: 10, background: '#f0f9ff' }}>
              Item {idx + 1}
            </Box>
          ))}
        </Grid>
      </ScrollArea>
    </Box>
  </Grid>
);
