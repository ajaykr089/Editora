import React from 'react';
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Input, Tabs } from '../index';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('hydrating server markup that carries wrapper attributes', () => {
  it('hydrates without a mismatch warning and keeps the attributes', async () => {
    // What the server renders for this tree (see ssr-attributes.server.test.tsx).
    const container = document.createElement('div');
    container.innerHTML =
      '<ui-input label="Email"></ui-input><ui-tabs selected="1"><div slot="tab">A</div><div slot="tab">B</div><div slot="panel">a</div><div slot="panel">b</div></ui-tabs>';
    document.body.appendChild(container);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});

    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(
        container,
        <>
          <Input label="Email" />
          <Tabs selected={1}>
            <Tabs.Tab>A</Tabs.Tab>
            <Tabs.Tab>B</Tabs.Tab>
            <Tabs.Panel>a</Tabs.Panel>
            <Tabs.Panel>b</Tabs.Panel>
          </Tabs>
        </>
      );
    });

    expect(errors.mock.calls.map((call) => call.map(String).join(" | "))).toEqual([]);
    expect(container.querySelector('ui-input')!.getAttribute('label')).toBe('Email');
    expect(container.querySelector('ui-tabs')!.getAttribute('selected')).toBe('1');
    await act(async () => root!.unmount());
  });
});
