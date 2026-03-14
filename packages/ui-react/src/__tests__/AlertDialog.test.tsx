import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../components/AlertDialog';
import '../../../ui-core/src/components/ui-alert-dialog';

import {
  AlertDialog,
  AlertDialogActions,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogTitle
} from '../components/AlertDialog';

describe('AlertDialog wrapper', () => {
  it('forwards baseline visual props to the host element', async () => {
    const { container } = render(
      <AlertDialog
        open
        tone="danger"
        variant="outline"
        size="3"
        radius="full"
        elevation="high"
        indicator="none"
      />
    );

    const el = container.querySelector('ui-alert-dialog') as HTMLElement | null;
    await waitFor(() => {
      expect(el?.getAttribute('tone')).toBe('danger');
      expect(el?.getAttribute('variant')).toBe('outline');
      expect(el?.getAttribute('size')).toBe('3');
      expect(el?.getAttribute('radius')).toBe('full');
      expect(el?.getAttribute('elevation')).toBe('high');
      expect(el?.getAttribute('indicator')).toBe('none');
    });
  });

  it('bridges close events back to React', () => {
    const onClose = vi.fn();
    const { container } = render(<AlertDialog open onClose={onClose} />);
    const el = container.querySelector('ui-alert-dialog') as HTMLElement | null;

    el?.dispatchEvent(
      new CustomEvent('ui-close', {
        bubbles: true,
        detail: { id: 'abc', action: 'dismiss', source: 'programmatic' }
      })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('maps structured helper components to the alert dialog slot contract', () => {
    const { container } = render(
      <AlertDialog open>
        <AlertDialogIcon>!</AlertDialogIcon>
        <AlertDialogTitle>Delete</AlertDialogTitle>
        <AlertDialogDescription>Permanent action</AlertDialogDescription>
        <AlertDialogContent>Review the impact.</AlertDialogContent>
        <AlertDialogActions>Actions</AlertDialogActions>
      </AlertDialog>
    );

    expect(container.querySelector('[slot="icon"]')?.textContent).toBe('!');
    expect(container.querySelector('[slot="title"]')?.textContent).toBe('Delete');
    expect(container.querySelector('[slot="description"]')?.textContent).toBe('Permanent action');
    expect(container.querySelector('[slot="content"]')?.textContent).toContain('Review the impact');
    expect(container.querySelector('[slot="footer"]')?.textContent).toContain('Actions');
  });
});
