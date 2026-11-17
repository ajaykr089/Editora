// @vitest-environment jsdom
import { act, createElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EditoraEditor } from '@editora/react';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom has no ResizeObserver, which the toolbar uses to measure itself
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= ResizeObserverStub;

type Call = { contentPresent: boolean; hydrated: boolean };

// Stands in for the collaboration plugin: its init hook finds the editor that is already in the page and
// puts its own node next to it. Done while React hydrates server HTML, that breaks the hydration.
function probePlugin(calls: Call[]) {
  return {
    name: 'probe',
    toolbar: [],
    init: () => {
      const content = document.querySelector('.rte-content');
      calls.push({
        contentPresent: !!content,
        // React puts its bookkeeping on a DOM node only once it has hydrated (or created) it
        hydrated: !!content && Object.keys(content).some((k) => k.startsWith('__reactFiber$')),
      });
      if (content?.parentElement) {
        const bar = document.createElement('div');
        bar.className = 'probe-bar';
        content.parentElement.insertBefore(bar, content);
      }
    },
  };
}

describe('plugin init hooks around hydration', () => {
  let errors: ReturnType<typeof vi.spyOn>;
  let container: HTMLElement;
  beforeEach(() => {
    errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  it('does not run them while server HTML is hydrated, and runs them once afterwards', async () => {
    const calls: Call[] = [];
    const element = () => createElement(EditoraEditor, { plugins: [probePlugin(calls)] } as never);

    container.innerHTML = renderToString(element());
    expect(calls).toEqual([]); // the server render only lists plugins

    await act(async () => {
      hydrateRoot(container, element());
    });

    expect(calls).toEqual([{ contentPresent: true, hydrated: true }]);
    expect(container.querySelectorAll('.probe-bar')).toHaveLength(1);
    // (renderToString in jsdom also prints React 18's "useLayoutEffect does nothing on the server": a jsdom artefact)
    const hydrationErrors = errors.mock.calls
      .map((c) => c.map(String).join(' '))
      .filter((m) => !m.includes('useLayoutEffect does nothing on the server'))
      .filter((m) => /hydrat|did not match|Expected server HTML/i.test(m));
    expect(hydrationErrors).toEqual([]);
  });

  it('still runs them while rendering when there is no server HTML', async () => {
    const calls: Call[] = [];
    await act(async () => {
      createRoot(container).render(createElement(EditoraEditor, { plugins: [probePlugin(calls)] } as never));
    });
    // before the editor exists in the page, as before
    expect(calls[0]).toEqual({ contentPresent: false, hydrated: false });
    expect(calls).toHaveLength(1);
  });
});
