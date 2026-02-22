import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, Input } from '@editora/ui-react';
import { mockApi } from '@/shared/api/mockApi';
import { toastAdvanced } from '@editora/toast';

const schema = z.object({
  email: z.string().email('Provide a valid email')
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' }
  });

  const onSubmit = handleSubmit(async (values: FormValues) => {
    try {
      await mockApi.forgotPassword(values);
      toastAdvanced.success('Reset instructions sent', { position: 'top-right', theme: 'light' });
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  });

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100dvh', padding: 16 }}>
      <Box variant="surface" p="20px" radius="lg" style={{ width: 'min(420px, 100%)', display: 'grid', gap: 10 }}>
        <Box style={{ fontSize: 22, fontWeight: 700 }}>Forgot password</Box>
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
          Enter your account email to receive reset instructions.
        </Box>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
          <Input
            label="Email"
            value={watch('email')}
            onChange={(next) => setValue('email', next, { shouldDirty: true, shouldValidate: true })}
            placeholder="you@hospital.test"
            validation={errors.email ? 'error' : 'none'}
          >
            {errors.email ? <span slot="error">{errors.email.message}</span> : null}
          </Input>
          <Button onClick={onSubmit} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Send reset link'}</Button>
        </form>
        <Link to="/login" style={{ color: '#1d4ed8', fontSize: 13, fontWeight: 600 }}>
          Back to login
        </Link>
      </Box>
    </Flex>
  );
}
