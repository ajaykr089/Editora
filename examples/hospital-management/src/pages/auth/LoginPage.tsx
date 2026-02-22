import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Input } from '@editora/ui-react';
import { useAuth } from '@/app/auth/useAuth';
import { toastAdvanced } from '@editora/toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters')
});

type FormValues = z.infer<typeof schema>;

function roleHints() {
  return [
    'admin@hospital.test',
    'reception@hospital.test',
    'doctor@hospital.test',
    'nurse@hospital.test',
    'lab@hospital.test',
    'pharmacy@hospital.test',
    'billing@hospital.test'
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const redirect = (location.state as { from?: string } | undefined)?.from || '/dashboard';

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'admin@hospital.test',
      password: 'password123'
    }
  });

  const onSubmit = handleSubmit(async (values: FormValues) => {
    try {
      await auth.login(values);
      toastAdvanced.success('Signed in successfully', { position: 'top-right', theme: 'light' });
      navigate(redirect, { replace: true });
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  });

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100dvh', padding: 16 }}>
      <Box
        variant="surface"
        radius="lg"
        p="20px"
        style={{
          width: 'min(460px, 100%)',
          border: '1px solid var(--ui-color-border, #cbd5e1)',
          boxShadow: '0 20px 42px rgba(15, 23, 42, 0.1)',
          display: 'grid',
          gap: 14
        }}
      >
        <Box>
          <Box style={{ fontWeight: 700, fontSize: 22 }}>Hospital Admin Login</Box>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
            Secure access for operations, clinical, billing, and lab modules.
          </Box>
        </Box>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
          <Input
            label="Email"
            value={watch('email')}
            onChange={(next) => setValue('email', next, { shouldDirty: true, shouldValidate: true })}
            placeholder="admin@hospital.test"
            validation={errors.email ? 'error' : 'none'}
          >
            {errors.email ? <span slot="error">{errors.email.message}</span> : null}
          </Input>

          <Input
            type="password"
            label="Password"
            value={watch('password')}
            onChange={(next) => setValue('password', next, { shouldDirty: true, shouldValidate: true })}
            placeholder="••••••••"
            validation={errors.password ? 'error' : 'none'}
          >
            {errors.password ? <span slot="error">{errors.password.message}</span> : null}
          </Input>

          <Button onClick={onSubmit} disabled={isSubmitting || auth.loading}>
            {isSubmitting || auth.loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <Box style={{ borderTop: '1px solid var(--ui-color-border, #e2e8f0)', paddingTop: 10, display: 'grid', gap: 8 }}>
          <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>
            Demo accounts:
          </Box>
          <Flex style={{ gap: 6, flexWrap: 'wrap' }}>
            {roleHints().map((hint) => (
              <Button key={hint} size="sm" variant="ghost" onClick={() => setValue('email', hint, { shouldDirty: true })}>
                {hint}
              </Button>
            ))}
          </Flex>
          <Link to="/forgot-password" style={{ color: '#1d4ed8', fontSize: 13, fontWeight: 600 }}>
            Forgot password?
          </Link>
        </Box>
      </Box>
    </Flex>
  );
}
