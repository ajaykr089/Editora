import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('client entrypoint', () => {
  it('exposes the client-safe wrappers and registers their web components', async () => {
    const clientEntry = await import('../client');

    expect(clientEntry.Button).toBeDefined();
    expect(clientEntry.AnimatedNumber).toBeDefined();
    expect(clientEntry.Input).toBeDefined();

    await (window as typeof window & { __editoraUICoreRegistrationPromise__?: Promise<void> })
      .__editoraUICoreRegistrationPromise__;

    await waitFor(() => {
      expect(customElements.get('ui-button')).toBeDefined();
      expect(customElements.get('ui-odometer')).toBeDefined();
      expect(customElements.get('ui-input')).toBeDefined();
    }, { timeout: 5000 });
  });
});
