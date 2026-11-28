// block: A sign-up card: name, email and password with a strength hint, terms, and a link to sign in.
import * as React from 'react';
import { Box, Button, Card, Checkbox, Heading, Input, Text } from '@editora/ui-react';

const LINK: React.CSSProperties = { color: 'inherit', textDecoration: 'underline' };

export type SignupValues = { name: string; email: string; password: string };

export type SignupBlockProps = {
  onSubmit?: (values: SignupValues) => void | Promise<void>;
  error?: string;
};

function strength(password: string): { label: string; tone: 'danger' | 'warning' | 'success' } {
  const score = [/.{10,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((rule) => rule.test(password)).length;
  if (score >= 3) return { label: 'Strong password', tone: 'success' };
  if (score === 2) return { label: 'Could be stronger: add length, numbers or symbols', tone: 'warning' };
  return { label: 'Use 10 or more characters with a mix of letters, numbers and symbols', tone: 'danger' };
}

/** A sign-up card with a live password strength hint and a terms checkbox. */
export function SignupBlock({ onSubmit, error }: SignupBlockProps) {
  const [pending, setPending] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const hint = password ? strength(password) : null;
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    try {
      await onSubmit?.({ name: String(data.get('name') || ''), email: String(data.get('email') || ''), password: String(data.get('password') || '') });
    } finally {
      setPending(false);
    }
  };
  return (
    <Box style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 16 }}>
      <Card style={{ width: '100%', maxWidth: 420 }}>
        <Card.Header>
          <Heading level={1} size="xl">Create your account</Heading>
          <Text variant="muted">Free for 14 days. No card needed.</Text>
        </Card.Header>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <Input name="name" label="Full name" required autoComplete="name" />
          <Input name="email" type="email" label="Work email" required autoComplete="email" />
          <div style={{ display: 'grid', gap: 4 }}>
            <Input
              name="password"
              type="password"
              label="Password"
              required
              autoComplete="new-password"
              onInput={(value: string) => setPassword(value)}
            />
            {hint ? <Text size="sm" tone={hint.tone} aria-live="polite">{hint.label}</Text> : null}
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            <Checkbox name="terms" required>I agree to the terms and privacy policy</Checkbox>
            <Text size="sm" variant="muted">Read the <a href="#terms" style={LINK}>terms</a> and the <a href="#privacy" style={LINK}>privacy policy</a>.</Text>
          </div>
          {error ? <Text tone="danger" role="alert">{error}</Text> : null}
          <Button type="submit" block loading={pending}>Create account</Button>
        </form>
        <Card.Footer>
          <Text variant="muted" size="sm">Already have an account? <a href="#signin" style={LINK}>Sign in</a></Text>
        </Card.Footer>
      </Card>
    </Box>
  );
}

export default SignupBlock;
