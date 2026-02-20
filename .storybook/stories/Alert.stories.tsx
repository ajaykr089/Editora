import React from 'react';
import { Alert, Button, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Alert',
  component: Alert,
  argTypes: {
    tone: { control: 'radio', options: ['info', 'success', 'warning', 'danger'] },
    variant: { control: 'radio', options: ['soft', 'outline', 'solid'] },
    layout: { control: 'radio', options: ['inline', 'banner'] },
    dismissible: { control: 'boolean' }
  }
};

export const Default = (args: any) => (
  <Alert
    tone={args.tone}
    variant={args.variant}
    layout={args.layout}
    dismissible={args.dismissible}
    title="API latency is elevated"
    description="Some dashboard requests are taking longer than expected."
  />
);

Default.args = {
  tone: 'info',
  variant: 'soft',
  layout: 'inline',
  dismissible: false
};

export const WithActions = () => (
  <Alert
    tone="warning"
    title="Storage usage is above 85%"
    description="Consider archiving media files or increasing workspace quota."
  >
    <Flex slot="actions" style={{ display: 'flex', gap: 8 }}>
      <Button size="sm" variant="secondary">Review files</Button>
      <Button size="sm">Upgrade plan</Button>
    </Flex>
  </Alert>
);
