import { describe, expect, it } from 'vitest';
import { PluginManager, createPluginManager } from '../Plugin';

describe('createPluginManager', () => {
  it('returns a fresh, empty PluginManager each call (as index.d.ts promises)', () => {
    const a = createPluginManager();
    const b = createPluginManager();
    expect(a).toBeInstanceOf(PluginManager);
    expect(a).not.toBe(b);
    expect(a.plugins).toEqual([]);
  });

  it('registers plugins like a manually constructed manager', () => {
    const manager = createPluginManager();
    manager.register({ name: 'demo' } as any);
    expect(manager.plugins.map((p) => p.name)).toEqual(['demo']);
  });
});
