import React, { useState } from 'react';
import { Portal, Button , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Portal',
  component: Portal
};

export const TargetedPortal = () => {
  const [show, setShow] = useState(true);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Button size="sm" onClick={() => setShow((v) => !v)}>{show ? 'Unmount portal content' : 'Mount portal content'}</Button>

      <Box id="storybook-portal-target" style={{ minHeight: 80, padding: 12, border: '1px dashed #cbd5e1', borderRadius: 10 }}>
        Portal target container
      </Box>

      {show && (
        <Portal target="#storybook-portal-target">
          <Box style={{ padding: 10, borderRadius: 8, background: '#e0f2fe' }}>
            This content is rendered through <code>ui-portal</code>.
          </Box>
        </Portal>
      )}
    </Grid>
  );
};

export const BodyPortal = () => (
  <Portal>
    <Box style={{ position: 'fixed', right: 20, bottom: 20, background: '#0f172a', color: '#fff', padding: '8px 10px', borderRadius: 8 }}>
      Portaled to document.body
    </Box>
  </Portal>
);
