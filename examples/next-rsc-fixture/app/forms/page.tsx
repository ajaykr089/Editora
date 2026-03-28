'use client';

import React from 'react';
import {
  Box,
  Button,
  ControlGroup,
  Description,
  DirectionProvider,
  Field,
  FieldError,
  Fieldset,
  Grid,
  Input,
  Label,
  NumberField,
  OTPInput,
  PasswordField,
  PinInput,
  TagsInput,
  Textarea,
} from '@editora/ui-react/client';
import { ShowcaseCard, ShowcaseShell, stageStyle } from '../showcase/shared';

export default function FormsPage() {
  const [name, setName] = React.useState('Ava Stone');
  const [notes, setNotes] = React.useState('This page focuses on text entry, field semantics, and secure inputs.');
  const [budget, setBudget] = React.useState(4800);
  const [password, setPassword] = React.useState('Starter!234');
  const [tags, setTags] = React.useState<string[]>(['forms', 'tokens', 'fixture']);
  const [pin, setPin] = React.useState('3141');
  const [otp, setOtp] = React.useState('802145');

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/forms"
        eyebrow="Forms"
        title="Text entry and field semantics"
        description="This route isolates the form-oriented wrappers so they can be tested without the heavier calendar and visual widgets loading at the same time."
      >
        <Grid
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 18,
            justifyItems: 'stretch',
            alignItems: 'start',
          }}
        >
          <ShowcaseCard
            eyebrow="Semantics"
            title="Field, fieldset, labels, and helper content"
            description="These wrappers make the underlying form structure visible and easy to test."
          >
            <Fieldset style={{ display: 'grid', gap: 14 }}>
              <Label htmlFor="forms-name">Name</Label>
              <Description>The input below also uses `ControlGroup` and the compound `Input` API.</Description>
              <ControlGroup style={{ display: 'grid', gap: 12 }}>
                <Input id="forms-name" label="Name" value={name} onChange={setName} placeholder="Type a name">
                  <Input.Prefix>@</Input.Prefix>
                  <Input.Suffix>live</Input.Suffix>
                </Input>
                <Button recipe="outline" onClick={() => setName((current) => `${current} Jr.`)}>
                  Append suffix
                </Button>
              </ControlGroup>
              <FieldError>{name.trim().length < 4 ? 'Use a longer name to clear this example error state.' : 'FieldError is mounted and ready.'}</FieldError>
            </Fieldset>

            <Field label="Fixture summary" description="`Field` can wrap non-input content too.">
              <Box style={{ fontSize: 14, color: '#475569' }}>
                Current name: <strong>{name}</strong>
              </Box>
            </Field>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Inputs"
            title="Textarea, number, and password fields"
            description="Common field wrappers grouped together with live state wiring."
          >
            <Grid style={{ display: 'grid', gap: 14, justifyItems: 'stretch', alignItems: 'start' }}>
              <Textarea label="Notes" value={notes} onChange={setNotes} style={{ minHeight: 120 }} />

              <NumberField
                value={budget}
                label="Budget"
                prefix="$"
                step={100}
                showSteppers
                onValueChange={(detail) => setBudget(detail.value ?? 0)}
              />

              <PasswordField
                value={password}
                label="Password"
                description="Strength meter and revealable mode enabled."
                showStrength
                revealable
                clearable
                onChange={setPassword}
              />
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Tokens"
            title="Tags, PIN, and OTP inputs"
            description="These demos stay on a dedicated route so their layout can remain generous and easy to inspect."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <TagsInput
                value={tags}
                label="Tags"
                description="Add and remove tokens directly inside the web component."
                onChange={setTags}
              />

              <Box style={stageStyle}>
                <Grid
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 14,
                    justifyItems: 'stretch',
                    alignItems: 'start',
                  }}
                >
                  <Box style={{ minWidth: 0 }}>
                    <PinInput
                      value={pin}
                      label="PinInput"
                      length={4}
                      size="sm"
                      density="compact"
                      onChange={setPin}
                      style={{ width: '100%', maxWidth: '100%' }}
                    />
                  </Box>
                  <Box style={{ minWidth: 0 }}>
                    <OTPInput
                      value={otp}
                      label="OTPInput"
                      length={6}
                      size="sm"
                      density="compact"
                      onChange={setOtp}
                      style={{ width: '100%', maxWidth: '100%' }}
                    />
                  </Box>
                </Grid>
              </Box>
            </Grid>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
