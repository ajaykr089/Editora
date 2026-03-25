import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  ControlGroup,
  Description,
  FieldError,
  Fieldset,
  Input,
  Switch
} from '@editora/ui-react';

export default {
  title: 'UI/FieldSemantics',
  component: Fieldset
};

export const StandaloneAssociations = () => (
  <Box style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
    <Input id="story-email" placeholder="ops@workspace.dev" />
    <Description htmlFor="story-email">Used for incident digests and weekly delivery reports.</Description>
    <FieldError htmlFor="story-email" active>
      Email domain must be allow-listed before rollout.
    </FieldError>
  </Box>
);

export const GroupedControls = () => (
  <Fieldset
    legend="Notification channels"
    description="Select the delivery paths that should receive deployment and incident updates."
    variant="surface"
    tone="brand"
    style={{ maxWidth: 640 }}
  >
    <ControlGroup label="Channels" orientation="horizontal" variant="soft">
      <Checkbox checked />
      <span>Email</span>
      <Checkbox />
      <span>SMS</span>
      <Checkbox checked />
      <span>Slack</span>
    </ControlGroup>
  </Fieldset>
);

export const PolicyReview = () => (
  <Fieldset
    legend="Publishing policy"
    description="These settings control how releases are exposed to customers."
    error="Approval and public release cannot both be disabled."
    invalid
    variant="soft"
    tone="warning"
    style={{ maxWidth: 720 }}
  >
    <ControlGroup label="Release controls" orientation="horizontal" variant="surface">
      <Switch checked />
      <span>Require approval</span>
      <Switch />
      <span>Auto-publish changelog</span>
      <Switch checked />
      <span>Notify account owners</span>
    </ControlGroup>
    <div slot="actions">
      <Button size="sm" variant="secondary">Reset</Button>
    </div>
    <div slot="footer">
      <Button size="sm">Save policy</Button>
    </div>
  </Fieldset>
);
