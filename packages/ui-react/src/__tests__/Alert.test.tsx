import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../components/Alert';
import '../../../ui-core/src/components/ui-alert';

import { Alert, AlertActions, AlertDescription, AlertIcon, AlertTitle } from '../components/Alert';

describe('Alert wrapper', () => {
  it('forwards baseline visual props to the host element', () => {
    const { container } = render(
      <Alert variant="surface" tone="success" size="lg" radius={12} elevation="high" indicator="none" />
    );

    const el = container.querySelector('ui-alert') as HTMLElement | null;
    expect(el?.getAttribute('variant')).toBe('surface');
    expect(el?.getAttribute('tone')).toBe('success');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('12');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('indicator')).toBe('none');
  });

  it('bridges close events back to React', () => {
    const onClose = vi.fn();
    const { container } = render(<Alert dismissible onClose={onClose} />);
    const el = container.querySelector('ui-alert') as HTMLElement | null;

    el?.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('supports open state through the wrapper', () => {
    const { container, rerender } = render(<Alert open={false} />);
    const el = container.querySelector('ui-alert') as HTMLElement | null;
    expect(el?.hasAttribute('hidden')).toBe(true);

    rerender(<Alert open />);
    expect(el?.hasAttribute('hidden')).toBe(false);
  });

  it('maps structured helper components to the alert slot contract', () => {
    const { container } = render(
      <Alert>
        <AlertIcon>i</AlertIcon>
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
        <AlertActions>Actions</AlertActions>
      </Alert>
    );

    expect(container.querySelector('[slot="icon"]')?.textContent).toBe('i');
    expect(container.querySelector('[slot="title"]')?.textContent).toBe('Title');
    expect(container.querySelector('[slot="actions"]')?.textContent).toBe('Actions');
    expect(container.querySelector('[data-ui-alert-description]')?.textContent).toBe('Description');
  });
});
