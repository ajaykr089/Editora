import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaPlugin, SpellcheckPlugin } from '../index';
import { resetDeprecationWarnings } from '../deprecation';

const spyOnWarn = () => vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('deprecated enterprise scaffolds', () => {
  let warn: ReturnType<typeof spyOnWarn>;

  beforeEach(() => {
    resetDeprecationWarnings();
    warn = spyOnWarn();
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('SpellcheckPlugin still builds a plugin but warns, pointing at @editora/spell-check', () => {
    const plugin = SpellcheckPlugin({ enabled: true });
    expect(plugin.name).toBe('spellcheck');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain('SpellcheckPlugin');
    expect(String(warn.mock.calls[0][0])).toContain('@editora/spell-check');
  });

  it('MediaPlugin still builds a plugin but warns, pointing at @editora/media-manager', () => {
    const plugin = MediaPlugin();
    expect(plugin.name).toBe('media');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain('@editora/media-manager');
  });

  it('warns once per scaffold, not on every construction', () => {
    SpellcheckPlugin();
    SpellcheckPlugin();
    MediaPlugin();
    MediaPlugin();
    expect(warn).toHaveBeenCalledTimes(2);
  });
});
