import { describe, expect, it } from 'vitest';

describe('client entrypoint', () => {
  it('exposes the client-safe wrappers and registers their web components before returning the module', async () => {
    const clientEntry = await import('../client');

    expect(clientEntry.Button).toBeDefined();
    expect(clientEntry.AnimatedNumber).toBeDefined();
    expect(clientEntry.Input).toBeDefined();

    expect(customElements.get('ui-button')).toBeDefined();
    expect(customElements.get('ui-odometer')).toBeDefined();
    expect(customElements.get('ui-input')).toBeDefined();
  });
});
