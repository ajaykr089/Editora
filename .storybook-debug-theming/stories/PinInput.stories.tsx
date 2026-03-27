import React from 'react';
import { Box, Button, Fieldset, OTPInput, PinInput } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcaseMonoStyle,
  showcasePanelStyle
} from './storybook-showcase';

export default {
  title: 'UI/PinInput',
  component: PinInput,
  argTypes: {
    length: { control: { type: 'range', min: 4, max: 8, step: 1 } },
    mask: { control: 'boolean' },
    mode: { control: 'select', options: ['numeric', 'alpha', 'alphanumeric'] }
  }
};

export const VerificationCode = (args: any) => {
  const [value, setValue] = React.useState('');
  const [completed, setCompleted] = React.useState('');

  return (
    <ShowcasePage
      eyebrow="Verification Inputs"
      title="Segmented pin entry should feel secure, calm, and operationally clear"
      description="These stories are intended to validate focus flow, paste behavior, completion states, and visual rhythm for authentication and approval flows."
      meta={[
        { label: 'Entry mode', value: args.mode },
        { label: 'Length', value: `${args.length} cells` },
        { label: 'Masking', value: args.mask ? 'On' : 'Off', tone: args.mask ? 'warning' : 'neutral' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Default Pattern"
        title="Verification code"
        description="The segmented field should be easy to scan, forgiving to paste, and visually balanced enough to sit in auth screens without looking improvised."
      >
        <Box style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Auto-advance</span>
            <span style={showcaseChipStyle}>Paste friendly</span>
            <span style={showcaseChipStyle}>Completion event</span>
          </div>
          <PinInput
            length={args.length}
            mode={args.mode}
            mask={args.mask}
            label="Verification code"
            description="Enter the one-time code sent to your device."
            value={value}
            onChange={setValue}
            onComplete={setCompleted}
            placeholderChar="•"
          />
          <div style={{ ...showcasePanelStyle, gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              Input state
            </div>
            <div style={{ fontSize: 14, color: '#0f172a' }}>
              Current: <code style={showcaseMonoStyle}>{value || '(empty)'}</code>
            </div>
            <div style={{ fontSize: 14, color: '#0f172a' }}>
              Complete: <code style={showcaseMonoStyle}>{completed || '(waiting)'}</code>
            </div>
          </div>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

VerificationCode.args = {
  length: 6,
  mode: 'numeric',
  mask: false
};

export const RecoveryCode = () => (
  <ShowcaseSection
    eyebrow="Admin Recovery"
    title="Longer OTP pattern"
    description="Alpha-numeric recovery paths need stronger framing and more semantic grouping than a standard login OTP."
  >
    <Fieldset
      legend="Recovery verification"
      description="Alpha-numeric challenge code for admin recovery flows."
      variant="surface"
      style={{ maxWidth: 640 }}
    >
      <OTPInput length={8} mode="alphanumeric" label="Recovery code" description="Paste or type the issued code." />
    </Fieldset>
    <p style={showcaseCaptionStyle}>Use this for account recovery, secondary approval, and high-assurance admin challenges.</p>
  </ShowcaseSection>
);

export const MaskedEntry = () => {
  const ref = React.useRef<HTMLElement | null>(null);
  return (
    <ShowcaseSection
      eyebrow="Sensitive Flow"
      title="Masked approval entry"
      description="Masking should still preserve calm spacing and an obvious recovery action when the user needs to restart entry."
    >
      <Box style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
        <PinInput ref={ref} length={6} mask label="Secure approval code" description="Masked entry for high-sensitivity flows." />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="sm" onClick={() => (ref.current as any)?.clear?.()}>Clear code</Button>
          <p style={showcaseCaptionStyle}>Reset should feel secondary and deliberate, not like a destructive primary action.</p>
        </div>
      </Box>
    </ShowcaseSection>
  );
};
