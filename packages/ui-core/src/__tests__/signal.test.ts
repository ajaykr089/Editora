import { describe, it, expect } from 'vitest';
import { createSignal, effect } from '../signal';

describe('signals', () => {
  it('propagates updates to effects', () => {
    const s = createSignal(1);
    let seen = 0;
    effect(() => {
      seen = s.get();
    });
    expect(seen).toBe(1);
    s.set(2);
    expect(seen).toBe(2);
  });
});
