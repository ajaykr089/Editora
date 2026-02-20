import React from 'react';
import { Button, Toast, type ToastElement , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/Toast',
  component: Toast
};

export const Playground = () => {
  const ref = React.useRef<ToastElement | null>(null);
  const [lastToastId, setLastToastId] = React.useState<number | null>(null);
  const [lastEvent, setLastEvent] = React.useState<string>('none');

  const showToast = (message: string, duration = 2200) => {
    const id = ref.current?.show(message, { duration });
    if (typeof id === 'number') setLastToastId(id);
  };

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Toast
        ref={ref}
        onShow={(detail) => setLastEvent(`show #${detail.id}`)}
        onHide={(detail) => setLastEvent(`hide #${detail.id}`)}
      />

      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button onClick={() => showToast('Saved successfully')}>Show toast</Button>
        <Button variant="secondary" onClick={() => showToast('Publishing in progress...', 4000)}>
          Show long toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (lastToastId != null) ref.current?.hide(lastToastId);
          }}
        >
          Hide last toast
        </Button>
      </Flex>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Last event: {lastEvent} {lastToastId != null ? `(id: ${lastToastId})` : ''}
      </Box>
    </Grid>
  );
};
