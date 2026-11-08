import { describe, expect, it } from 'vitest';

// Each test file has its own module registry, so nothing else has defined the elements here.
describe('dialog providers', () => {
  it('define the dialog elements their managers open', async () => {
    expect(customElements.get('ui-alert-dialog')).toBeUndefined();
    expect(customElements.get('ui-dialog')).toBeUndefined();
    await import('../components/AlertDialogProvider');
    await import('../components/DialogProvider');
    expect(customElements.get('ui-alert-dialog')).toBeDefined();
    expect(customElements.get('ui-dialog')).toBeDefined();
  });
});
