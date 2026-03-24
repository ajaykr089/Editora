import React, { useState } from 'react';
import { Box, Grid, PasswordField } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcasePanelStyle
} from './storybook-showcase';

export default {
  title: 'UI/PasswordField',
  component: PasswordField,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    clearable: { control: 'boolean' },
    counter: { control: 'boolean' },
    floatingLabel: { control: 'boolean' },
    showStrength: { control: 'boolean' },
    revealable: { control: 'boolean' },
    validation: { control: 'radio', options: ['none', 'error', 'success'] },
    variant: { control: 'select', options: ['classic', 'surface', 'soft', 'outlined', 'filled', 'flushed', 'minimal', 'contrast', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
};

export const Playground = (args: any) => {
  const [revealed, setRevealed] = useState(false);
  const [length, setLength] = useState(0);
  return (
    <ShowcasePage
      eyebrow="Credential Entry"
      title="Password inputs should feel deliberate, secure, and operationally clear"
      description="This field packages visibility control and strength feedback into the same design system language as the rest of the input stack."
      meta={[
        { label: 'Reveal toggle', value: args.revealable ? 'Enabled' : 'Disabled' },
        { label: 'Strength', value: args.showStrength ? 'Visible' : 'Hidden' },
        { label: 'Pattern', value: 'Production auth' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Core Pattern"
        title="Password toggle field"
        description="The default pattern should handle form semantics, visibility changes, and password quality feedback without custom one-off suffix wiring."
      >
        <Grid style={{ display: 'grid', gap: 18, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
          <Box style={{ display: 'grid', gap: 14 }}>
            <div style={showcaseChipRowStyle}>
              <span style={showcaseChipStyle}>Visibility toggle</span>
              <span style={showcaseChipStyle}>Strength guidance</span>
              <span style={showcaseChipStyle}>Form ready</span>
            </div>
            <PasswordField
              {...args}
              onInput={(next) => setLength(next.length)}
              onVisibilityChange={setRevealed}
            />
          </Box>
          <Box style={showcasePanelStyle}>
            <strong style={{ color: '#0f172a' }}>Live state</strong>
            <Box style={{ color: '#64748b', fontSize: 13 }}>
              Visibility: {revealed ? 'visible' : 'hidden'}
            </Box>
            <Box style={{ color: '#64748b', fontSize: 13 }}>
              Characters: {length}
            </Box>
            <p style={showcaseCaptionStyle}>Use `showStrength` for signup, recovery, or admin-reset flows where quality feedback is part of the product contract.</p>
          </Box>
        </Grid>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

Playground.args = {
  label: 'Workspace password',
  description: 'Used for admin-level changes and destructive actions.',
  placeholder: 'Enter password',
  disabled: false,
  readOnly: false,
  required: false,
  clearable: false,
  counter: false,
  floatingLabel: false,
  showStrength: true,
  revealable: true,
  validation: 'none',
  variant: 'surface',
  tone: 'default',
  density: 'default',
  shape: 'default',
  size: 'md'
};

export const SignupRequirements = () => (
  <ShowcaseSection
    eyebrow="Account Creation"
    title="Strength-led signup pattern"
    description="This is the common SaaS account-creation path: strong password guidance, floating label, and a slightly more elevated shell."
  >
    <Box style={{ maxWidth: 520, display: 'grid', gap: 12 }}>
      <PasswordField
        label="Create password"
        description="Use at least 12 characters. Mix uppercase, lowercase, numbers, and symbols."
        placeholder="Choose a strong password"
        showStrength
        floatingLabel
        variant="elevated"
        clearable
        autoComplete="new-password"
      />
      <p style={showcaseCaptionStyle}>Pair this with a confirm-password field and a mismatch validator when the flow requires explicit confirmation.</p>
    </Box>
  </ShowcaseSection>
);

export const SecurityConsole = () => (
  <ShowcaseSection
    eyebrow="Admin Console"
    title="Compact verification field"
    description="For higher-friction admin checks, the field should stay dense and deliberate without losing the reveal affordance."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))' }}>
      <PasswordField
        label="Current password"
        description="Required before rotating signing keys."
        variant="outlined"
        density="compact"
        shape="square"
        autoComplete="current-password"
      />
      <PasswordField
        label="Recovery key"
        description="Reveal is disabled when shoulder-surfing risk is higher."
        variant="contrast"
        tone="warning"
        density="compact"
        revealable={false}
        autoComplete="one-time-code"
      />
    </Grid>
  </ShowcaseSection>
);

export const EnterprisePolicy = () => {
  const [label, setLabel] = useState('Awaiting input');
  return (
    <ShowcaseSection
      eyebrow="Custom Policy"
      title="Policy-driven strength evaluation"
      description="Production auth flows often need to plug in enterprise-specific password rules instead of relying on fixed heuristics."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
        <PasswordField
          label="Privileged account password"
          description="Requires a minimum length plus a company-specific rule set."
          showStrength
          strengthEvaluator={(value) => {
            if (value.length >= 16 && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value)) {
              return {
                score: 4,
                label: 'Enterprise strong',
                caption: 'Matches privileged-account policy.'
              };
            }
            return {
              score: 2,
              label: 'Needs policy work',
              caption: 'Use 16+ chars with uppercase, numbers, and symbols.'
            };
          }}
          onStrengthChange={(detail) => setLabel(detail.label)}
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Current strength label</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>{label}</Box>
          <p style={showcaseCaptionStyle}>This is the integration path for products with their own password policy language or compliance requirements.</p>
        </Box>
      </Grid>
    </ShowcaseSection>
  );
};

export const VariantGallery = () => {
  const variants = [
    ['classic', 'Classic'],
    ['surface', 'Surface'],
    ['soft', 'Soft'],
    ['outlined', 'Outlined'],
    ['filled', 'Filled'],
    ['flushed', 'Flushed'],
    ['minimal', 'Minimal'],
    ['contrast', 'Contrast'],
    ['elevated', 'Elevated']
  ] as const;

  return (
    <ShowcaseSection
      eyebrow="Visual System"
      title="Variant gallery"
      description="Each password field variant should keep the same affordances: direct typing, reveal control, and predictable password guidance."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {variants.map(([variant, title]) => (
          <Box key={variant} style={{ display: 'grid', gap: 10 }}>
            <strong style={{ color: '#0f172a', fontSize: 13 }}>{title}</strong>
            <PasswordField
              label={`${title} password`}
              description="Reveal stays ghosted by default so it reads as a field affordance, not a pill button."
              placeholder="Enter password"
              variant={variant}
              showStrength
              clearable
            />
          </Box>
        ))}
      </Grid>
    </ShowcaseSection>
  );
};

export const StateMatrix = () => (
  <ShowcaseSection
    eyebrow="Operational States"
    title="Production state coverage"
    description="The component needs to hold up not just in the default state, but in readonly, invalid, success, no-reveal, and dense admin usage."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <PasswordField
        label="Readonly password"
        description="Used in audit views where reveal should not mutate the field."
        value="ReadonlySecret42!"
        readOnly
        variant="surface"
      />
      <PasswordField
        label="Validation error"
        description="Used when the backend rejects the credential or policy requirements are unmet."
        value="short"
        validation="error"
        error="Password must be at least 12 characters."
        showStrength
        tone="danger"
        variant="outlined"
      />
      <PasswordField
        label="Validated success"
        description="Used after policy confirmation in setup or reset flows."
        value="VeryStrongPassword#42"
        validation="success"
        showStrength
        tone="success"
        variant="soft"
      />
      <PasswordField
        label="No reveal"
        description="For sensitive support-console flows where reveal is intentionally suppressed."
        placeholder="Enter recovery secret"
        revealable={false}
        autoComplete="off"
        variant="contrast"
        tone="warning"
      />
      <PasswordField
        label="Disabled field"
        description="Communicates locked state cleanly without showing stray toggle chrome."
        value="DisabledValue42!"
        disabled
        showStrength
        variant="filled"
      />
      <PasswordField
        label="Clearable with counter"
        description="Useful for temporary secret entry or wizard-style setup steps."
        placeholder="Set workspace password"
        clearable
        counter
        maxlength={32}
        variant="elevated"
      />
    </Grid>
  </ShowcaseSection>
);

export const DensityAndShape = () => (
  <ShowcaseSection
    eyebrow="Layout Variations"
    title="Density, size, and shape patterns"
    description="These are the combinations teams usually need when the same field moves from app shell forms into admin rails or console drawers."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
      <PasswordField
        label="Compact square"
        description="Toolbar-style administrative density."
        density="compact"
        size="sm"
        shape="square"
        variant="outlined"
      />
      <PasswordField
        label="Default soft"
        description="Balanced product default."
        density="default"
        size="md"
        shape="soft"
        variant="surface"
        showStrength
      />
      <PasswordField
        label="Comfortable large"
        description="Signup and recovery forms that need more breathing room."
        density="comfortable"
        size="lg"
        shape="soft"
        floatingLabel
        variant="elevated"
        showStrength
      />
    </Grid>
  </ShowcaseSection>
);
