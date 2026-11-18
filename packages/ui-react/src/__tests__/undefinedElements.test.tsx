import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../components/Button';
import { resetUndefinedElementCheck } from '../components/_undefinedElements';
import { findUndefinedElements } from '../components/_undefinedElementsReport';

// Importing from the root no longer registers every ui-core element, so raw <ui-*> tags in an app's JSX stay unknown
// elements unless the app registers them. The first component to render schedules one check that names them.
describe('raw <ui-*> tags that nothing registered', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    resetUndefinedElementCheck();
  });

  function mount(children: React.ReactNode) {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    flushSync(() => root.render(<>{children}</>));
    return root;
  }

  it('are named once, with the import that registers them, after the page settles', async () => {
    vi.useFakeTimers();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // ui-nope and ui-zzz-panel are not ui-core elements, so nothing in the test run defines them.
    const root = mount(
      <>
        <Button>Save</Button>
        {React.createElement('ui-nope')}
        {React.createElement('ui-zzz-panel')}
      </>
    );
    expect(findUndefinedElements()).toEqual(['ui-nope', 'ui-zzz-panel']);
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('ui-nope'));

    await vi.advanceTimersByTimeAsync(3000);
    await vi.waitFor(() => expect(warn.mock.calls.some((call) => String(call[0]).includes('not registered'))).toBe(true));
    const messages = warn.mock.calls.map((call) => String(call[0])).filter((m) => m.includes('not registered'));
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('ui-nope, ui-zzz-panel are on the page but not registered');
    expect(messages[0]).toContain('@editora/ui-core/nope, @editora/ui-core/zzz-panel');
    expect(messages[0]).not.toContain('ui-button');

    flushSync(() => root.render(<Button>Again</Button>));
    await vi.advanceTimersByTimeAsync(3000);
    await import('../components/_undefinedElementsReport');
    await vi.advanceTimersByTimeAsync(0);
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('not registered'))).toHaveLength(1);
    root.unmount();
  });

  it('stay quiet when every element on the page is registered', async () => {
    vi.useFakeTimers();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const root = mount(<Button>Save</Button>);
    await vi.advanceTimersByTimeAsync(3000);
    // Let the report chunk load and run, so a warning it wrongly wrote would be seen.
    await import('../components/_undefinedElementsReport');
    await Promise.resolve();
    expect(warn.mock.calls.filter((call) => String(call[0]).includes('not registered'))).toEqual([]);
    root.unmount();
  });
});
