import { afterEach, describe, expect, it, vi } from 'vitest';
import { normalizeLocale } from '../components/date-time-utils';

describe('normalizeLocale', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('keeps a usable tag and falls back for an unusable one', () => {
    expect(normalizeLocale('fr-FR')).toBe('fr-FR');
    expect(normalizeLocale('not a tag')).not.toBe('not a tag');
  });

  it('does not use a browser language that Intl rejects (some profiles report the string "undefined")', () => {
    vi.stubGlobal('navigator', { language: 'undefined' });
    expect(normalizeLocale(null)).toBe('en-US');
    vi.stubGlobal('navigator', { language: 'de-DE' });
    expect(normalizeLocale('')).toBe('de-DE');
  });
});
