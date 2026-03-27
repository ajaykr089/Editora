import React from 'react';
import { Button, toast, toastApi, ToastProvider, useToast, Flex } from '@editora/ui-react';

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

function ProviderDemoInner() {
  const notifications = useToast();
  return (
    <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button onClick={() => notifications.success('Policy saved')}>useToast().success</Button>
      <Button variant="secondary" onClick={() => notifications.loading('Uploading assets')}>
        useToast().loading
      </Button>
    </Flex>
  );
}

export const ProviderPattern = () => (
  <ToastProvider config={{ position: 'bottom-right', theme: 'glass' }}>
    <ProviderDemoInner />
  </ToastProvider>
);
