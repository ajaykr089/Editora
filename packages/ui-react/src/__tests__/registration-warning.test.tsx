import { afterEach, describe, expect, it, vi } from 'vitest';
import { warnIfElementNotRegistered } from '../components/_internals';

describe('wrapper registration warnings', () => {
  const warned = (tag: string) => `__editora_warned_${tag}`;

  afterEach(() => {
    delete (window as unknown as Record<string, unknown>)[warned('ui-test-missing')];
    vi.restoreAllMocks();
  });

  it('warns at once, and names the entry that registers the element', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    warnIfElementNotRegistered('ui-test-missing', 'TestComponent');

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const message = String(warnSpy.mock.calls[0]?.[0]);
    expect(message).toContain('[ui-react/TestComponent] ui-test-missing is not registered.');
    expect(message).toContain('@editora/ui-core/test-missing');
  });

  it('warns once per tag', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    warnIfElementNotRegistered('ui-test-missing', 'TestComponent');
    warnIfElementNotRegistered('ui-test-missing', 'TestComponent');

    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('stays quiet for an element that is defined', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    customElements.define('ui-test-defined', class extends HTMLElement {});

    warnIfElementNotRegistered('ui-test-defined', 'TestComponent');

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('does not load @editora/ui-core to find out', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    warnIfElementNotRegistered('ui-test-missing', 'TestComponent');
    await new Promise((resolve) => setTimeout(resolve, 20));

    // Nothing imported ui-core in this file, so no catalog element can exist.
    expect(customElements.get('ui-button')).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });
});
