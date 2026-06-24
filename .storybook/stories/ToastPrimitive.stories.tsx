import React from 'react';
import { Button, Toast, toastAdvanced, type ToastElement , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/Toast',
  component: Toast
};

export const Playground = () => {
  const ref = React.useRef<ToastElement | null>(null);
  const [lastToastId, setLastToastId] = React.useState<string | number | null>(null);
  const [lastEvent, setLastEvent] = React.useState<string>('none');

  const showToast = (message: string, duration = 2200, options: Parameters<ToastElement['show']>[1] = {}) => {
    const id = ref.current?.show(message, { duration, ...options });
    if (id != null) setLastToastId(id);
    return id;
  };

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Toast
        ref={ref}
        position="bottom-right"
        maxVisible={4}
        config={{
          closeButton: true,
          richColors: false,
          stack: false,
          expand: true,
          gap: 8,
          pauseOnWindowBlur: true
        }}
        onShow={(detail) => setLastEvent(`show #${detail.id}`)}
        onHide={(detail) => setLastEvent(`hide #${detail.id}`)}
      />

      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button
          onClick={() =>
            showToast('Saved successfully', 2600, {
              level: 'success',
              title: 'Document saved',
              description: 'The close button is enabled for this playground.',
              icon: '✓'
            })
          }
        >
          Show toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            showToast('Publishing in progress...', 4000, {
              level: 'loading',
              title: 'Publishing',
              description: 'Hover or focus the toast to reveal the close control.',
              icon: '⏳'
            })
          }
        >
          Show long toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            showToast('This toast can be dismissed immediately.', 6000, {
              level: 'info',
              title: 'Close button toast',
              description: 'The × control appears in the top-right corner on hover/focus.',
              closeButton: true
            })
          }
        >
          Close button toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            showToast('The paragraph was removed.', 6000, {
              level: 'warning',
              title: 'Undo action',
              description: 'Action and cancel are first-class toast options.',
              action: {
                label: 'Undo',
                onClick: () => showToast('Paragraph restored', 1800, { level: 'success', title: 'Undo complete', icon: '✓' })
              },
              cancel: {
                label: 'Dismiss',
                onClick: () => undefined
              }
            })
          }
        >
          Action toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const id = showToast('Uploading media...', 0, {
              level: 'loading',
              title: 'Progress toast',
              progress: { value: 12, showPercentage: true },
              closeButton: true
            });

            let progress = 12;
            const interval = window.setInterval(() => {
              progress += 22;
              if (progress >= 100) {
                window.clearInterval(interval);
                if (id != null) {
                  toastAdvanced.update(String(id), {
                    level: 'success',
                    title: 'Upload complete',
                    message: 'Media upload complete',
                    progress: { value: 100, showPercentage: true },
                    icon: '✓',
                    duration: 2200
                  });
                }
                return;
              }

              if (id != null) {
                toastAdvanced.update(String(id), {
                  message: `Uploading media... ${progress}%`,
                  progress: { value: progress, showPercentage: true }
                });
              }
            }, 500);
          }}
        >
          Progress toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            ref.current?.configure({ stack: true, expand: false, maxVisible: 4 });
            showToast('Stack mode enabled', 2800, {
              level: 'info',
              title: 'Collapsed stack',
              description: 'Hover the toast group to expand stacked notifications.'
            });
            showToast('Queued visual stack item', 2800, { level: 'success', title: 'Second toast' });
            showToast('Another stack item', 2800, { level: 'warning', title: 'Third toast' });
          }}
        >
          Stacked toasts
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            ref.current?.configure({ stack: false, expand: true, richColors: true });
            showToast('Rich colors enabled', 2600, {
              level: 'success',
              title: 'Rich color surface',
              description: 'Semantic backgrounds are useful for demos and dashboards.'
            });
          }}
        >
          Rich colors
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (lastToastId != null) ref.current?.hide(lastToastId);
          }}
        >
          Hide last toast
        </Button>
        <Button variant="secondary" onClick={() => ref.current?.clear()}>
          Clear all
        </Button>
      </Flex>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Last event: {lastEvent} {lastToastId != null ? `(id: ${lastToastId})` : ''}
      </Box>
    </Grid>
  );
};
