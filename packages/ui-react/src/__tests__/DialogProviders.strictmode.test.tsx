import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-alert-dialog';
import '../../../ui-core/src/components/ui-dialog';

import { AlertDialogProvider, useAlertDialog } from '../components/AlertDialogProvider';
import { DialogProvider, useDialog } from '../components/DialogProvider';

// React.StrictMode runs every effect's cleanup and setup a second time in development, without rendering in between.
// Create React App, Vite and Next.js all turn it on, so the providers have to work under it.
function Outcome({ result }: { result: string }) {
  return <output data-testid="result">{result}</output>;
}

function DialogHarness() {
  const dialogs = useDialog();
  const [result, setResult] = React.useState('pending');
  return (
    <>
      <button onClick={() => void dialogs.confirm({ title: 'Archive?' }).then((answer) => setResult(answer.action))}>Open</button>
      <Outcome result={result} />
    </>
  );
}

function AlertHarness() {
  const dialogs = useAlertDialog();
  const [result, setResult] = React.useState('pending');
  return (
    <>
      <button onClick={() => void dialogs.confirm({ title: 'Publish?' }).then((answer) => setResult(answer.action))}>Open</button>
      <Outcome result={result} />
    </>
  );
}

describe('the promise dialog providers under StrictMode', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('DialogProvider keeps a dialog open instead of dismissing it at once', async () => {
    const { getByText, getByTestId } = render(
      <React.StrictMode>
        <DialogProvider hostId="strict-dialog-host">
          <DialogHarness />
        </DialogProvider>
      </React.StrictMode>,
    );

    fireEvent.click(getByText('Open'));

    await waitFor(() => expect(document.querySelector('ui-dialog')).toBeTruthy());
    expect(getByTestId('result').textContent).toBe('pending');
  });

  it('AlertDialogProvider keeps a dialog open and still applies its defaults', async () => {
    const { getByText, getByTestId } = render(
      <React.StrictMode>
        <AlertDialogProvider hostId="strict-alert-host" defaults={{ variant: 'outline' }}>
          <AlertHarness />
        </AlertDialogProvider>
      </React.StrictMode>,
    );

    fireEvent.click(getByText('Open'));

    await waitFor(() => expect(document.querySelector('ui-alert-dialog')).toBeTruthy());
    expect(document.querySelector('ui-alert-dialog')?.getAttribute('variant')).toBe('outline');
    expect(getByTestId('result').textContent).toBe('pending');
  });
});
