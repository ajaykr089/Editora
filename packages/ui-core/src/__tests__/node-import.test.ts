// @vitest-environment node
import { describe, expect, it } from 'vitest';

/**
 * Server rendering imports ui-core (through @editora/ui-react/client) in a process that has no DOM.
 * Nothing may touch HTMLElement or customElements while a module is being evaluated; the elements
 * only get defined in a browser. This file runs in vitest's node environment on purpose.
 */
describe('ui-core in a process without a DOM', () => {
  it('has no DOM here', () => {
    expect(typeof HTMLElement).toBe('undefined');
    expect(typeof customElements).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });

  // A cold import transforms every component, which takes a few seconds and grows with the catalog.
  it('imports the whole catalog', async () => {
    const catalog = await import('../index');
    expect(Object.keys(catalog).length).toBeGreaterThan(50);
  }, 30_000);

  it('imports the standalone entries that extend HTMLElement directly or register late', async () => {
    for (const entry of ['anchor', 'collection', 'roving-focus-group', 'sidebar', 'color-picker', 'number-field']) {
      await expect(import(`../standalone/${entry}.ts`), entry).resolves.toBeDefined();
    }
  });

  it('imports the runtime and sortable entries', async () => {
    await expect(import('../runtime')).resolves.toBeDefined();
    await expect(import('../sortable')).resolves.toBeDefined();
  });
});
