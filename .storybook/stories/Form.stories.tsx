import React, { useState } from 'react';
import { Box, Button, Field, Flex, Form, Grid, Input, Progress, Select, Textarea, useForm } from '@editora/ui-react';

export default {
  title: 'UI/Form',
  component: Form,
  argTypes: {
    variant: { control: 'select', options: ['default', 'surface', 'outline', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    gap: { control: 'text' },
    novalidate: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const { ref, submit, getValues, validate } = useForm();

  return (
    <Box style={{ maxWidth: 620 }}>
      <Form
        ref={ref}
        variant={args.variant}
        tone={args.tone}
        density={args.density}
        shape={args.shape}
        elevation={args.elevation}
        gap={args.gap}
        novalidate={args.novalidate}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        onInvalid={(errors) => alert(`Invalid: ${JSON.stringify(errors, null, 2)}`)}
      >
        <Grid style={{ display: 'grid', gap: 12 }}>
          <Field label="First name" htmlFor="form-first-name" required variant="outline">
            <Input id="form-first-name" name="firstName" placeholder="Jane" required />
          </Field>

          <Field label="Email" htmlFor="form-email" required variant="outline">
            <Input id="form-email" name="email" type="email" placeholder="you@company.com" required />
          </Field>

          <Field label="Notes" htmlFor="form-notes" description="Optional context for reviewers." variant="soft">
            <Textarea id="form-notes" name="notes" rows={4} placeholder="Add additional details..." />
          </Field>
        </Grid>

        <Box style={{ marginTop: 12 }}>
          <Button onClick={() => submit()}>Submit</Button>
          <Button style={{ marginLeft: 8 }} variant="secondary" onClick={async () => alert(JSON.stringify(await validate(), null, 2))}>
            Validate
          </Button>
          <Button style={{ marginLeft: 8 }} variant="ghost" onClick={() => alert(JSON.stringify(getValues(), null, 2))}>
            Get values
          </Button>
        </Box>
      </Form>
    </Box>
  );
};

Playground.args = {
  variant: 'surface',
  tone: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  gap: '12px',
  novalidate: false
};

export const ValidationFlow = () => {
  const { ref, submit } = useForm();
  const [state, setState] = useState('idle');

  return (
    <Box style={{ maxWidth: 560 }}>
      <Form
        ref={ref}
        variant="outline"
        tone="warning"
        onSubmit={() => setState('submitted')}
        onInvalid={() => setState('invalid')}
      >
        <Field label="Project code" htmlFor="form-code" required>
          <Input id="form-code" name="code" pattern="[A-Z]{3}-[0-9]{3}" required placeholder="ABC-123" />
        </Field>

        <Box style={{ marginTop: 12 }}>
          <Button onClick={() => submit()}>Run validation</Button>
          <Box style={{ marginTop: 8, fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>State: {state}</Box>
        </Box>
      </Form>
    </Box>
  );
};

export const ContrastMode = () => {
  const { ref, submit } = useForm();
  return (
    <Box style={{ maxWidth: 620, background: 'color-mix(in srgb, var(--ui-color-text, #0f172a) 94%, transparent)', padding: 'var(--ui-space-md, 12px)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)' }}>
      <Form ref={ref} variant="contrast" shape="soft" elevation="high" onSubmit={() => {}}>
        <Field label="Workspace" htmlFor="form-workspace" variant="contrast">
          <Input id="form-workspace" name="workspace" value="Editora" />
        </Field>

        <Field label="Release notes" htmlFor="form-release" variant="contrast" description="Visible in changelog panel.">
          <Textarea id="form-release" name="release" rows={3} value="Sprint 3: hardening complete." />
        </Field>

        <Box style={{ marginTop: 12 }}>
          <Button onClick={() => submit()}>Save</Button>
        </Box>
      </Form>
    </Box>
  );
};

export const ProVisualModes = () => {
  const { ref, submit } = useForm();

  return (
    <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))', gap: 14 }}>
      <Form ref={ref} variant="minimal" tone="brand" onSubmit={() => {}}>
        <Field label="Minimal form" htmlFor="form-minimal">
          <Input id="form-minimal" name="minimal" placeholder="Flat mode for dense pages" />
        </Field>
        <Button onClick={() => submit()}>Submit</Button>
      </Form>

      <Form variant="elevated" tone="success" shape="soft" elevation="high" onSubmit={() => {}}>
        <Field label="Elevated form" htmlFor="form-elevated" variant="elevated">
          <Input id="form-elevated" name="elevated" placeholder="Depth-rich mode" />
        </Field>
        <Button>Save</Button>
      </Form>
    </Grid>
  );
};

export const AdvancedAdminFlow = () => {
  const { ref, submit } = useForm();
  const [step, setStep] = useState(1);
  const [dirty, setDirty] = useState(false);
  const [autosaveAt, setAutosaveAt] = useState('never');
  const [status, setStatus] = useState('idle');

  const progress = step === 1 ? 34 : step === 2 ? 68 : 100;

  return (
    <Box style={{ maxWidth: 760, display: 'grid', gap: 12 }}>
      <Progress value={progress} max={100} shape="round" />
      <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Step {step} of 3 • Dirty: <strong>{String(dirty)}</strong> • Autosave: <strong>{autosaveAt}</strong>
        </Box>
        <Box style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>Unsaved-change guard is enabled on this story.</Box>
      </Flex>

      <Form
        ref={ref}
        variant="elevated"
        tone="brand"
        autosave
        autosaveDelay={700}
        guardUnsaved
        onAutosave={() => setAutosaveAt(new Date().toLocaleTimeString())}
        onDirtyChange={(nextDirty) => setDirty(nextDirty)}
        onSubmit={() => setStatus('submitted')}
        onInvalid={() => setStatus('invalid')}
      >
        <Grid style={{ display: 'grid', gap: 12 }}>
          {step === 1 && (
            <>
              <Field label="Organization name" htmlFor="wizard-org" required variant="outline">
                <Input id="wizard-org" name="organization" required placeholder="Northstar Health" />
              </Field>
              <Field label="Primary admin email" htmlFor="wizard-email" required variant="outline">
                <Input id="wizard-email" name="adminEmail" type="email" required placeholder="admin@northstar.health" />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Module type" htmlFor="wizard-module" required variant="soft">
                <Select id="wizard-module" name="moduleType" required>
                  <option value="">Choose module</option>
                  <option value="hospital">Hospital</option>
                  <option value="school">School</option>
                  <option value="enterprise">Enterprise shared</option>
                </Select>
              </Field>
              <Field label="Record retention policy" htmlFor="wizard-policy" required description="Use uppercase code format." variant="soft">
                <Input id="wizard-policy" name="policyCode" required pattern="[A-Z]{3}-[0-9]{2}" placeholder="MED-07" />
              </Field>
            </>
          )}

          {step === 3 && (
            <Field label="Launch notes" htmlFor="wizard-notes" description="Inline validation remains consistent across steps." variant="elevated">
              <Textarea id="wizard-notes" name="notes" rows={4} placeholder="Team onboarding checklist and runbook notes..." />
            </Field>
          )}
        </Grid>

        <Flex style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, gap: 8 }}>
          <Button variant="ghost" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
            Previous
          </Button>
          <Flex style={{ display: 'flex', gap: 8 }}>
            {step < 3 ? (
              <Button variant="secondary" onClick={() => setStep((current) => Math.min(3, current + 1))}>
                Next
              </Button>
            ) : (
              <Button onClick={() => submit()}>Submit setup</Button>
            )}
          </Flex>
        </Flex>
      </Form>

      <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-text, #0f172a)' }}>Validation state: <strong>{status}</strong></Box>
    </Box>
  );
};
