import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/AlertDialogProvider';
import '../../../ui-core/src/components/ui-alert-dialog';

import { AlertDialogProvider, useAlertDialog } from '../components/AlertDialogProvider';

function Harness() {
  const dialogs = useAlertDialog();
  return (
    <button
      onClick={() => {
        void dialogs.confirm({
          title: 'Delete environment',
          tone: 'danger',
          size: '3'
        });
      }}
    >
      Open
    </button>
  );
}

describe('AlertDialogProvider', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('applies provider defaults to promise-driven dialogs', async () => {
    const { getByText } = render(
      <AlertDialogProvider
        hostId="alert-provider-host"
        defaults={{
          variant: 'outline',
          radius: 12,
          elevation: 'high',
          indicator: 'none'
        }}
      >
        <Harness />
      </AlertDialogProvider>
    );

    fireEvent.click(getByText('Open'));

    await waitFor(() => {
      const dialog = document.querySelector('ui-alert-dialog') as HTMLElement | null;
      expect(dialog).toBeTruthy();
      expect(dialog?.getAttribute('variant')).toBe('outline');
      expect(dialog?.getAttribute('tone')).toBe('danger');
      expect(dialog?.getAttribute('size')).toBe('3');
      expect(dialog?.getAttribute('elevation')).toBe('high');
      expect(dialog?.getAttribute('indicator')).toBe('none');
      expect(dialog?.style.getPropertyValue('--ui-alert-radius')).toBe('12px');
    });
  });
});
