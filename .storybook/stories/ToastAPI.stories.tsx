import React from 'react';
import { Button, toast, toastApi , Box, Flex} from '@editora/ui-react';

export default {
  title: 'UI/ToastAPI'
};

export const Basic = () => (
  <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Button onClick={() => toast('Saved')}>toast()</Button>
    <Button variant="secondary" onClick={() => toastApi.success('Published')}>
      success()
    </Button>
    <Button variant="secondary" onClick={() => toastApi.error('Publish failed')}>
      error()
    </Button>
    <Button variant="secondary" onClick={() => toastApi.warning('Storage is almost full')}>
      warning()
    </Button>
    <Button variant="secondary" onClick={() => toastApi.info('Background sync started')}>
      info()
    </Button>
  </Flex>
);
