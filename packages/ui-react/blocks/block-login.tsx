// block: A sign-in card: email and password, remember me, Google and GitHub, links to sign up and reset.
import * as React from 'react';
import { Box, Button, Card, Checkbox, Flex, Heading, Input, Separator, Text } from '@editora/ui-react';

export type LoginBlockProps = {
  onSubmit?: (values: { email: string; password: string; remember: boolean }) => void | Promise<void>;
  onProvider?: (provider: 'google' | 'github') => void;
  error?: string;
};

/** A sign-in card: email and password, remember me, two OAuth providers, links to sign up and reset. */
export function LoginBlock({ onSubmit, onProvider, error }: LoginBlockProps) {
  const [pending, setPending] = React.useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    try {
      await onSubmit?.({ email: String(data.get('email') || ''), password: String(data.get('password') || ''), remember: data.get('remember') != null });
    } finally {
      setPending(false);
    }
  };
  return (
    <Box style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 16 }}>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Card.Header>
          <Heading level={1} size="xl">Sign in</Heading>
          <Text variant="muted">Welcome back. Enter your details to continue.</Text>
        </Card.Header>
        <form onSubmit={handleSubmit} noValidate={false} style={{ display: 'grid', gap: 14 }}>
          <Flex style={{ gap: 8 }}>
            <Button type="button" variant="secondary" block style={{ flex: 1 }} onClick={() => onProvider?.('google')}>Google</Button>
            <Button type="button" variant="secondary" block style={{ flex: 1 }} onClick={() => onProvider?.('github')}>GitHub</Button>
          </Flex>
          <Separator label="or" />
          <Input name="email" type="email" label="Email" placeholder="you@example.com" required autoComplete="email" />
          <Input name="password" type="password" label="Password" required autoComplete="current-password" />
          <Flex style={{ justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <Checkbox name="remember">Remember me</Checkbox>
            <a href="#reset" style={{ fontSize: 'var(--ui-font-size-sm, 13px)' }}>Forgot password?</a>
          </Flex>
          {error ? <Text tone="danger" role="alert">{error}</Text> : null}
          <Button type="submit" block loading={pending}>Sign in</Button>
        </form>
        <Card.Footer>
          <Text variant="muted" size="sm">No account? <a href="#signup">Create one</a></Text>
        </Card.Footer>
      </Card>
    </Box>
  );
}

export default LoginBlock;
