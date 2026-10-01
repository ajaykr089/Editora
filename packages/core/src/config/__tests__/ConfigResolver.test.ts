import { describe, expect, it } from 'vitest';
import { ConfigResolver } from '../ConfigResolver';

const resolve = (attributes: Record<string, string>) => ConfigResolver.resolve({ attributes });

describe('ConfigResolver boolean attributes', () => {
  it('treats a bare readonly attribute as true', () => {
    expect(resolve({ readonly: '' }).readonly).toBe(true);
  });

  it('accepts readonly="readonly" and readonly="true"', () => {
    expect(resolve({ readonly: 'readonly' }).readonly).toBe(true);
    expect(resolve({ readonly: 'true' }).readonly).toBe(true);
  });

  it('keeps readonly="false" off', () => {
    expect(resolve({ readonly: 'false' }).readonly).toBe(false);
  });

  it('applies the same rule to nested boolean attributes', () => {
    const config = resolve({ 'toolbar-sticky': '', 'security-sanitize-on-paste': '' });
    expect(config.toolbarSticky).toBe(true);
    expect(config.securitySanitizeOnPaste).toBe(true);
  });

  it('does not turn an empty string attribute into true for non-boolean attributes', () => {
    expect(resolve({ placeholder: '' }).placeholder).toBe('');
  });
});
