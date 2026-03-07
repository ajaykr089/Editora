import React from 'react';
import { Box, Button, Field, Flex, Input, Select, Textarea, Wizard } from '@editora/ui-react';

export default {
  title: 'UI/Wizard',
  component: Wizard,
  argTypes: {
    linear: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'soft', 'glass', 'flat', 'contrast', 'minimal'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['rounded', 'square', 'pill'] },
    showProgress: { control: 'boolean' },
    busy: { control: 'boolean' }
  }
};

export const EnterpriseOnboarding = (args: any) => {
  const [value, setValue] = React.useState('org');
  const [busy, setBusy] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState('idle');

  return (
    <Box style={{ maxWidth: 920, display: 'grid', gap: 12 }}>
      <Wizard
        value={value}
        linear={args.linear}
        variant={args.variant || 'glass'}
        orientation={args.orientation || 'horizontal'}
        density={args.density || 'default'}
        shape={args.shape || 'rounded'}
        showProgress={args.showProgress ?? true}
        busy={busy || args.busy}
        title="Workspace Provisioning"
        description="Configure tenant profile, modules, and policy in a guided enterprise flow."
        onBeforeChange={(detail) => {
          if (detail.nextValue === 'review' && !value) return false;
          return true;
        }}
        onChange={(detail) => {
          setValue(detail.value);
          setLastEvent(`step:${detail.value}`);
        }}
        onComplete={() => {
          setBusy(true);
          setLastEvent('publishing');
          window.setTimeout(() => {
            setBusy(false);
            setLastEvent('complete');
          }, 1100);
        }}
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

      <Flex style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
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

EnterpriseOnboarding.args = {
  linear: true,
  variant: 'glass',
  orientation: 'horizontal',
  density: 'default',
  shape: 'rounded',
  showProgress: true,
  busy: false
};

export const VerticalClinicalChecklist = () => (
  <Box style={{ maxWidth: 340 }}>
    <Wizard
      value="triage"
      orientation="vertical"
      linear
      variant="soft"
      density="compact"
      title="Clinical Intake"
      description="Guided patient onboarding checklist"
      finishLabel="Complete intake"
    >
      <Box slot="step" data-value="register" data-title="Registration" data-description="Identity and insurance" data-state="success">
        <Box style={{ fontSize: '13px' }}>Registration data captured.</Box>
      </Box>
      <Box slot="step" data-value="triage" data-title="Triage" data-description="Vitals and severity" data-state="warning">
        <Box style={{ fontSize: '13px' }}>Vitals pending manual review.</Box>
      </Box>
      <Box slot="step" data-value="doctor" data-title="Doctor" data-description="Assign physician">
        <Box style={{ fontSize: '13px' }}>Physician assignment queued.</Box>
      </Box>
      <Box slot="step" data-value="admit" data-title="Admission" data-description="Finalize care plan" data-optional>
        <Box style={{ fontSize: '13px' }}>Optional for outpatient cases.</Box>
      </Box>
    </Wizard>
  </Box>
);

export const ContrastReview = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 920 }}>
    <Wizard
      value="2"
      variant="contrast"
      linear
      title="Deployment Control"
      description="Secure release workflow"
    >
      <Box slot="step" data-value="1" data-title="Data import" data-description="Source mapping" data-state="success">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Import source selected.</Box>
      </Box>
      <Box slot="step" data-value="2" data-title="Schema" data-description="Validate entities">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Schema validation in progress.</Box>
      </Box>
      <Box slot="step" data-value="3" data-title="Permissions" data-description="RBAC rules" data-state="error">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Permissions policy conflict detected.</Box>
      </Box>
    </Wizard>
  </Box>
);

export const EmptyState = () => (
  <Box style={{ maxWidth: 700 }}>
    <Wizard title="New Flow" description="No steps attached yet." emptyLabel="Add <Box slot='step'> panels to initialize this wizard." />
  </Box>
);
