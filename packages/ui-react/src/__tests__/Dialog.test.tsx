import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../components/Dialog';
import '../../../ui-core/src/components/ui-dialog';

import { Dialog } from '../components/Dialog';

describe('Dialog wrapper', () => {
  it('bridges close events back to React while mounted', () => {
    const onClose = vi.fn();
    const onDialogClose = vi.fn();
    const { container } = render(<Dialog open onClose={onClose} onDialogClose={onDialogClose} />);
    const el = container.querySelector('ui-dialog') as HTMLElement | null;

    el?.dispatchEvent(
      new CustomEvent('close', {
        bubbles: true,
        detail: { id: 'dialog-1', action: 'dismiss', source: 'programmatic' }
      })
    );

    el?.dispatchEvent(
      new CustomEvent('ui-close', {
        bubbles: true,
        detail: { id: 'dialog-1', action: 'dismiss', source: 'programmatic' }
      })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onDialogClose).toHaveBeenCalledTimes(1);
  });

  it('does not leak unmount close events back into React callbacks', () => {
    const onClose = vi.fn();
    const onDialogClose = vi.fn();
    const { unmount } = render(<Dialog open onClose={onClose} onDialogClose={onDialogClose} />);

    unmount();

    expect(onClose).not.toHaveBeenCalled();
    expect(onDialogClose).not.toHaveBeenCalled();
  });
});
