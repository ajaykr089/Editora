import React from 'react';
import { render } from '@testing-library/react';
import { AlertDialogProvider, DialogProvider } from '../components';

describe('Dialog host lifecycle', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('does not remove a pre-existing dialog host on unmount', () => {
    const host = document.createElement('div');
    host.id = 'shared-dialog-host';
    document.body.appendChild(host);

    const { unmount } = render(
      <DialogProvider hostId="shared-dialog-host">
        <div>content</div>
      </DialogProvider>
    );

    expect(document.getElementById('shared-dialog-host')).toBe(host);
    unmount();
    expect(document.getElementById('shared-dialog-host')).toBe(host);
  });

  it('keeps shared dialog host while at least one provider remains mounted', () => {
    function Harness({ showSecond }: { showSecond: boolean }) {
      return (
        <>
          <DialogProvider hostId="dialog-host">
            <div>one</div>
          </DialogProvider>
          {showSecond ? (
            <DialogProvider hostId="dialog-host">
              <div>two</div>
            </DialogProvider>
          ) : null}
        </>
      );
    }

    const { rerender, unmount } = render(<Harness showSecond />);
    expect(document.getElementById('dialog-host')).toBeTruthy();

    rerender(<Harness showSecond={false} />);
    expect(document.getElementById('dialog-host')).toBeTruthy();

    unmount();
    expect(document.getElementById('dialog-host')).toBeNull();
  });

  it('does not remove a pre-existing alert dialog host on unmount', () => {
    const host = document.createElement('div');
    host.id = 'shared-alert-host';
    document.body.appendChild(host);

    const { unmount } = render(
      <AlertDialogProvider hostId="shared-alert-host">
        <div>content</div>
      </AlertDialogProvider>
    );

    expect(document.getElementById('shared-alert-host')).toBe(host);
    unmount();
    expect(document.getElementById('shared-alert-host')).toBe(host);
  });
});

