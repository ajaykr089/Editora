import React from 'react';
import { Alert } from '@editora/ui-react/Alert';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { Checkbox } from '@editora/ui-react/Checkbox';
import { Form } from '@editora/ui-react/Form';
import { Icon } from '@editora/ui-react/Icon';
import { Input } from '@editora/ui-react/Input';
import { PasswordField } from '@editora/ui-react/PasswordField';
import { PinInput } from '@editora/ui-react/PinInput';
import { Separator } from '@editora/ui-react/Separator';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { signIn } from '../../../shared/data';
import { navigate, useTitle } from '../lib/router';

type Props = { screen: string; mode: 'light' | 'dark'; onToggleMode: () => void };

/** Sign in, sign up, forgot password and a one-time code: centred cards, no app shell. */
export function Auth({ screen, mode, onToggleMode }: Props) {
  const view = ['sign-in', 'sign-up', 'forgot', 'verify'].includes(screen) ? screen : 'sign-in';
  useTitle({ 'sign-in': 'Sign in', 'sign-up': 'Create an account', forgot: 'Reset your password', verify: 'Check your email' }[view]!);
  return (
    <main className="lk-auth">
      <div className="lk-auth-top">
        <a className="lk-brand" href="#/" aria-label="Larkspur, dashboard">
          <svg className="lk-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--ui-color-primary)" /><path d="M16 7c2.6 3 2.6 6 0 9-2.6-3-2.6-6 0-9Zm-6.5 6c3.4.6 5.4 2.6 6 6-3.4-.6-5.4-2.6-6-6Zm13 0c-.6 3.4-2.6 5.4-6 6 .6-3.4 2.6-5.4 6-6ZM16 18v8" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" /></svg>
          <span>Larkspur</span>
        </a>
        <Button variant="ghost" size="sm" aria-label={mode === 'dark' ? 'Use light theme' : 'Use dark theme'} onClick={onToggleMode}><Icon name={mode === 'dark' ? 'sun' : 'moon'} decorative /></Button>
      </div>
      <Card className="lk-auth-card">
        {view === 'sign-up' ? <SignUp /> : view === 'forgot' ? <Forgot /> : view === 'verify' ? <Verify /> : <SignIn />}
      </Card>
      <p className="lk-muted lk-auth-foot">A demo: nothing you type leaves this page.</p>
    </main>
  );
}

function SignIn() {
  const [errors, setErrors] = React.useState<Record<string, string> | null>(null);
  const [busy, setBusy] = React.useState(false);
  const submit = async (values: Record<string, unknown>) => {
    setBusy(true);
    const result = await signIn(String(values.email || ''), String(values.password || ''));
    setBusy(false);
    if (!result.ok) { setErrors(result.errors); return; }
    toastApi.success('Welcome back, Maya');
    navigate('/');
  };
  return (
    <>
      <h1 className="lk-h1">Sign in</h1>
      <p className="lk-muted">Use maya.chen@example.com and the password larkspur-demo.</p>
      <Form errors={errors} onSubmit={submit} loading={busy} aria-label="Sign in">
        <div className="lk-stack">
          <Input name="email" type="email" label="Email" autoComplete="email" defaultValue="maya.chen@example.com" required />
          <PasswordField name="password" label="Password" autoComplete="current-password" required />
          <div className="lk-row lk-between">
            <Checkbox name="remember" defaultChecked>Keep me signed in</Checkbox>
            <a href="#/auth/forgot">Forgot password?</a>
          </div>
          <Button type="submit" loading={busy} className="lk-full">Sign in</Button>
        </div>
      </Form>
      <Separator label="or" />
      <Button variant="secondary" className="lk-full" icon="key" onClick={() => toastApi.info('Single sign-on is not set up in the demo.')}>Sign in with SSO</Button>
      <p className="lk-muted lk-center">New to Larkspur? <a href="#/auth/sign-up">Create an account</a></p>
    </>
  );
}

function SignUp() {
  const [busy, setBusy] = React.useState(false);
  const submit = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 400));
    setBusy(false);
    navigate('/auth/verify');
  };
  return (
    <>
      <h1 className="lk-h1">Create an account</h1>
      <p className="lk-muted">Free for 14 days. No card needed.</p>
      <Form onSubmit={submit} loading={busy} aria-label="Create an account">
        <div className="lk-stack">
          <div className="lk-form-grid">
            <Input name="first" label="First name" autoComplete="given-name" required />
            <Input name="last" label="Last name" autoComplete="family-name" required />
          </div>
          <Input name="email" type="email" label="Work email" autoComplete="email" required />
          <Input name="shop" label="Shop name" placeholder="Larkspur Goods" />
          <PasswordField name="password" label="Password" autoComplete="new-password" description="At least 12 characters." required minlength={12} />
          <Checkbox name="terms" required>I agree to the terms and the privacy policy</Checkbox>
          <Button type="submit" loading={busy} className="lk-full">Create account</Button>
        </div>
      </Form>
      <p className="lk-muted lk-center">Already have an account? <a href="#/auth/sign-in">Sign in</a></p>
    </>
  );
}

function Forgot() {
  const [sent, setSent] = React.useState(false);
  return (
    <>
      <h1 className="lk-h1">Reset your password</h1>
      {sent ? (
        <Alert tone="success" title="Check your email" description="If an account uses that address, a reset link is on its way. It works for 30 minutes." />
      ) : (
        <Form onSubmit={() => setSent(true)} aria-label="Reset your password">
          <div className="lk-stack">
            <p className="lk-muted">We will email you a link to choose a new one.</p>
            <Input name="email" type="email" label="Email" autoComplete="email" required />
            <Button type="submit" className="lk-full">Send reset link</Button>
          </div>
        </Form>
      )}
      <p className="lk-muted lk-center"><a href="#/auth/sign-in">Back to sign in</a></p>
    </>
  );
}

function Verify() {
  const [code, setCode] = React.useState('');
  return (
    <>
      <h1 className="lk-h1">Check your email</h1>
      <p className="lk-muted">Enter the 6-digit code we sent. (Any code works in the demo.)</p>
      <div className="lk-stack">
        <PinInput length={6} aria-label="Verification code" value={code} onChange={setCode} onComplete={() => { toastApi.success('Email confirmed'); navigate('/'); }} />
        <Button className="lk-full" disabled={code.length < 6} onClick={() => navigate('/')}>Confirm</Button>
      </div>
    </>
  );
}
