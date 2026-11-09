import { describe, expect, it } from 'vitest';
import { createThemeTokens } from '../theme';

describe('createThemeTokens focus ring', () => {
  it('follows a new primary colour unless one is given', () => {
    expect(createThemeTokens({ colors: { primary: '#5b21b6' } } as any).colors.focusRing).toBe('#5b21b6');
    expect(createThemeTokens({ colors: { primary: '#5b21b6' } } as any, { mode: 'dark' }).colors.focusRing).toBe('#5b21b6');
    expect(createThemeTokens({ colors: { primary: '#5b21b6', focusRing: '#0ea5e9' } } as any).colors.focusRing).toBe('#0ea5e9');
  });
});
