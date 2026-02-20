import React from 'react';
import { Label, Input , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Label',
  component: Label
};

export const Default = () => (
  <Grid style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
    <Label {...({ for: 'storybook-label-input' } as any)}>Display name</Label>
    <Input id="storybook-label-input" placeholder="Your display name" />
  </Grid>
);

export const WithHint = () => (
  <Grid style={{ display: 'grid', gap: 6, maxWidth: 320 }}>
    <Label {...({ for: 'storybook-email-input' } as any)} style={{ fontWeight: 600 }}>Email</Label>
    <small style={{ color: '#64748b' }}>We use this only for account notifications.</small>
    <Input id="storybook-email-input" type="email" placeholder="you@company.com" />
  </Grid>
);
