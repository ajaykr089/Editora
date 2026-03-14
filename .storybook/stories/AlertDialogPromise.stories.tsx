import React from 'react';
import type { Meta } from '@storybook/react';
import { AlertDialogProvider, Box, Button, Flex, Grid, useAlertDialog } from '@editora/ui-react';

const meta: Meta = {
  title: 'UI/AlertDialogPromise'
};

export default meta;

function SurfaceFrame({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      style={{
        gap: 14,
        maxInlineSize: 980,
        padding: 20,
        border: '1px solid var(--base-panel-border, var(--ui-border))',
        borderRadius: 'var(--ui-radius, 4px)',
        background: 'var(--base-panel-bg, var(--color-panel-solid, #fff))',
        boxShadow: 'var(--base-panel-shadow, none)'
      }}
    >
      {children}
    </Grid>
  );
}

function PromiseConsole() {
  const dialogs = useAlertDialog();
  const [result, setResult] = React.useState('No result yet');

  const runAlert = async () => {
    const next = await dialogs.alert({
      title: 'Maintenance complete',
      description: 'Your deployment finished successfully.',
      confirmText: 'Great',
      tone: 'success'
    });
    setResult(JSON.stringify(next));
  };

  const runConfirm = async () => {
    const next = await dialogs.confirm({
      title: 'Delete customer account?',
      description: 'This cannot be undone and will remove all related records.',
      confirmText: 'Delete',
      cancelText: 'Keep',
      tone: 'danger',
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 700));
      },
      onCancel: async () => {
        await new Promise((resolve) => setTimeout(resolve, 180));
      },
      onDismiss: async () => {
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
    });
    setResult(JSON.stringify(next));
  };

  const runPrompt = async () => {
    const next = await dialogs.prompt({
      title: 'Rename workspace',
      description: 'Use 3+ characters. This demonstrates validation and async confirm.',
      confirmText: 'Save',
      cancelText: 'Cancel',
      input: {
        label: 'Workspace name',
        placeholder: 'e.g. Northwind Ops',
        required: true,
        validate: (value: string) => {
          if (value.trim().length < 3) return 'Use at least 3 characters.';
          return null;
        }
      },
      onConfirm: async ({ value }) => {
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (value?.toLowerCase() === 'error') {
          throw new Error('"error" is reserved. Use another name.');
        }
      }
    });

    setResult(JSON.stringify(next));
  };

  return (
    <SurfaceFrame>
      <Grid style={{ gap: 12 }}>
        <Box>
          <Box style={{ fontWeight: 700, fontSize: 18 }}>Promise-driven confirmation flows</Box>
          <Box style={{ color: 'var(--ui-muted, #646464)', fontSize: 13, marginTop: 4 }}>
            Provider defaults keep promise dialogs visually aligned without repeating the same shell props on every call.
          </Box>
        </Box>
        <Flex gap="10px" wrap="wrap">
          <Button onClick={runAlert}>Run alert</Button>
          <Button variant="secondary" onClick={runConfirm}>
            Run confirm
          </Button>
          <Button variant="ghost" onClick={runPrompt}>
            Run prompt
          </Button>
        </Flex>
        <Box
          style={{
            border: '1px solid var(--base-panel-border, var(--ui-border))',
            borderRadius: 'var(--ui-radius, 4px)',
            padding: 12,
            fontSize: 13,
            color: 'var(--ui-muted, #646464)'
          }}
        >
          Result: <code>{result}</code>
        </Box>
      </Grid>
    </SurfaceFrame>
  );
}

export function ProductionWorkflow() {
  return (
    <AlertDialogProvider
      defaults={{
        variant: 'soft',
        tone: 'warning',
        radius: 12,
        elevation: 'high',
        indicator: 'line',
        closeOnBackdrop: false
      }}
    >
      <PromiseConsole />
    </AlertDialogProvider>
  );
}

function VariantHarness() {
  const dialogs = useAlertDialog();

  const openVariant = (variant: 'surface' | 'soft' | 'outline' | 'solid') => {
    void dialogs.confirm({
      title: `${variant[0].toUpperCase()}${variant.slice(1)} dialog`,
      description: 'The promise API now carries the same visual system props as the base component.',
      variant,
      tone: variant === 'solid' ? 'danger' : 'warning',
      radius: 12,
      elevation: variant === 'outline' ? 'none' : 'high',
      indicator: variant === 'surface' ? 'none' : 'line',
      confirmText: 'Continue',
      cancelText: 'Cancel'
    });
  };

  return (
    <SurfaceFrame>
      <Grid style={{ gap: 12 }}>
        <Box>
          <Box style={{ fontWeight: 700, fontSize: 18 }}>Variant gallery</Box>
          <Box style={{ color: 'var(--ui-muted, #646464)', fontSize: 13, marginTop: 4 }}>
            Use provider defaults for baseline behavior, then override variant props per workflow when needed.
          </Box>
        </Box>
        <Flex gap="10px" wrap="wrap">
          <Button onClick={() => openVariant('surface')}>Surface</Button>
          <Button onClick={() => openVariant('soft')}>Soft</Button>
          <Button onClick={() => openVariant('outline')}>Outline</Button>
          <Button onClick={() => openVariant('solid')}>Solid</Button>
        </Flex>
      </Grid>
    </SurfaceFrame>
  );
}

export function VariantRecipes() {
  return (
    <AlertDialogProvider defaults={{ size: 'lg', closeOnBackdrop: false }}>
      <VariantHarness />
    </AlertDialogProvider>
  );
}
