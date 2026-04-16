import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../../../ui-core/src/components/ui-button';
import { CopyButton } from '../components/CopyButton';

describe('CopyButton', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('copies text and updates its label', async () => {
    const onCopy = vi.fn();
    const { container } = render(
      <CopyButton copiedLabel="Done" onCopy={onCopy} value="npm run build" />
    );

    const button = container.querySelector('ui-button') as HTMLElement | null;
    fireEvent.click(button as HTMLElement);

    await waitFor(() => expect(screen.getByText('Done')).toBeTruthy());
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('npm run build');
    expect(onCopy).toHaveBeenCalledWith({ value: 'npm run build', success: true });
  });

  it('supports icon variations and icon-only mode', async () => {
    const { container } = render(
      <CopyButton
        copiedIcon={<span>done-icon</span>}
        icon={<span>copy-icon</span>}
        iconOnly
        value="npm run build"
      />
    );

    const button = container.querySelector('ui-button') as HTMLElement | null;

    expect(button?.getAttribute('aria-label')).toBe('Copy');
    expect(screen.getByText('copy-icon')).toBeTruthy();

    fireEvent.click(button as HTMLElement);

    await waitFor(() => expect(screen.getByText('done-icon')).toBeTruthy());
  });

  it('applies the compact icon variant defaults', () => {
    const { container } = render(
      <CopyButton
        value="npm run build"
        variant="icon"
      />
    );

    const button = container.querySelector('ui-button') as HTMLElement | null;
    const idleIcon = container.querySelector('svg') as SVGElement | null;

    expect(button?.getAttribute('variant')).toBe('secondary');
    expect(button?.getAttribute('recipe')).toBe('ghost');
    expect(button?.style.inlineSize).toBe('28px');
    expect(button?.style.blockSize).toBe('28px');
    expect(button?.textContent).not.toContain('Copy');
    expect(idleIcon).toBeTruthy();
  });
});
