import React from 'react';
import { Box, Button, Field, Flex, Input, Select, Textarea } from '@editora/ui-react';
import { Wizard } from '@editora/ui-react/Wizard';

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
        <Wizard.Step  value="org" title="Organization" description="Tenant profile">
          <Field label="Organization name" htmlFor="wizard-org-name" required>
            <Input id="wizard-org-name" placeholder="Northstar Hospital" required />
          </Field>
        </Wizard.Step>

        <Wizard.Step  value="modules" title="Modules" description="Feature toggles">
          <Field label="Primary module" htmlFor="wizard-module">
            <Select id="wizard-module" value="hospital">
              <option value="hospital">Hospital management</option>
              <option value="school">School management</option>
              <option value="commerce">E-commerce operations</option>
            </Select>
          </Field>
        </Wizard.Step>

        <Wizard.Step  value="policy" title="Policy" description="Validation rules">
          <Field label="Retention policy" htmlFor="wizard-policy">
            <Textarea id="wizard-policy" rows={3} value="7 years for records" />
          </Field>
        </Wizard.Step>

        <Wizard.Step  value="review" title="Review" description="Ready to ship">
          <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
            Review all fields and click Finish to publish this admin workspace.
          </Box>
        </Wizard.Step>
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
      <Wizard.Step  value="register" title="Registration" description="Identity and insurance" state="success">
        <Box style={{ fontSize: '13px' }}>Registration data captured.</Box>
      </Wizard.Step>
      <Wizard.Step  value="triage" title="Triage" description="Vitals and severity" state="warning">
        <Box style={{ fontSize: '13px' }}>Vitals pending manual review.</Box>
      </Wizard.Step>
      <Wizard.Step  value="doctor" title="Doctor" description="Assign physician">
        <Box style={{ fontSize: '13px' }}>Physician assignment queued.</Box>
      </Wizard.Step>
      <Wizard.Step  value="admit" title="Admission" description="Finalize care plan" optional>
        <Box style={{ fontSize: '13px' }}>Optional for outpatient cases.</Box>
      </Wizard.Step>
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
      <Wizard.Step  value="1" title="Data import" description="Source mapping" state="success">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Import source selected.</Box>
      </Wizard.Step>
      <Wizard.Step  value="2" title="Schema" description="Validate entities">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Schema validation in progress.</Box>
      </Wizard.Step>
      <Wizard.Step  value="3" title="Permissions" description="RBAC rules" state="error">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Permissions policy conflict detected.</Box>
      </Wizard.Step>
    </Wizard>
  </Box>
);

export const EmptyState = () => (
  <Box style={{ maxWidth: 700 }}>
    <Wizard title="New Flow" description="No steps attached yet." emptyLabel="Add <Wizard.Step> panels to initialize this wizard." />
  </Box>
);
