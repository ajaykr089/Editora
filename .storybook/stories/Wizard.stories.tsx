import React from 'react';
import { Box, Button, Field, Flex, Input, Select, Textarea, Wizard } from '@editora/ui-react';

export default {
  title: 'UI/Wizard',
  component: Wizard,
  argTypes: {
    linear: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'contrast', 'minimal'] }
  }
};

export const SetupFlow = (args: any) => {
  const [value, setValue] = React.useState('org');
  const [lastEvent, setLastEvent] = React.useState('idle');

  return (
    <Box style={{ maxWidth: 860, display: 'grid', gap: 12 }}>
      <Wizard
        value={value}
        linear={args.linear}
        variant={args.variant || 'default'}
        onChange={(detail) => {
          setValue(detail.value);
          setLastEvent(`step:${detail.value}`);
        }}
        onComplete={() => setLastEvent('complete')}
      >
        <Box slot="step" data-value="org" data-title="Organization" data-description="Tenant profile">
          <Field label="Organization name" htmlFor="wizard-org-name" required>
            <Input id="wizard-org-name" placeholder="Northstar Hospital" required />
          </Field>
        </Box>

        <Box slot="step" data-value="modules" data-title="Modules" data-description="Feature toggles">
          <Field label="Primary module" htmlFor="wizard-module">
            <Select id="wizard-module" value="hospital">
              <option value="hospital">Hospital management</option>
              <option value="school">School management</option>
              <option value="commerce">E-commerce operations</option>
            </Select>
          </Field>
        </Box>

        <Box slot="step" data-value="policy" data-title="Policy" data-description="Validation rules">
          <Field label="Retention policy" htmlFor="wizard-policy">
            <Textarea id="wizard-policy" rows={3} value="7 years for records" />
          </Field>
        </Box>

        <Box slot="step" data-value="review" data-title="Review" data-description="Ready to ship">
          <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
            Review all fields and click Finish to publish this admin workspace.
          </Box>
        </Box>
      </Wizard>

      <Flex style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Current value: <strong>{value}</strong> • Event: <strong>{lastEvent}</strong>
        </Box>
        <Flex style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setValue('org')}>Reset</Button>
          <Button size="sm" onClick={() => setValue('review')}>Jump review</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

SetupFlow.args = {
  linear: true,
  variant: 'default'
};

export const Contrast = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 860 }}>
    <Wizard value="2" variant="contrast" linear>
      <Box slot="step" data-value="1" data-title="Data import" data-description="Source mapping">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Import source selected.</Box>
      </Box>
      <Box slot="step" data-value="2" data-title="Schema" data-description="Validate entities">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Schema validation in progress.</Box>
      </Box>
      <Box slot="step" data-value="3" data-title="Permissions" data-description="RBAC rules">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Permissions pending approval.</Box>
      </Box>
    </Wizard>
  </Box>
);
