// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as React from 'react';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { Toaster, toast } from '../src/react';
import { toastAdvanced } from '../src/index';

const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));
// Showing a toast is asynchronous (the queue, the enter animation); let it and React's commit run.
const settle = async (ms = 60) => {
  await act(async () => {
    await wait(ms);
  });
};

afterEach(async () => {
  cleanup();
  toast.clear();
  await wait(300);
  vi.restoreAllMocks();
});

const Theme = React.createContext('light');

describe('@editora/toast/react', () => {
  it('renders JSX given as the message, inside the toast card, with the icon and level of a normal toast', async () => {
    render(<Toaster />);
    toast.success(<span data-testid="jsx">Saved <b>draft.md</b></span>);
    await settle();

    const element = document.querySelector('.editora-toast')!;
    expect(element).not.toBeNull();
    expect(element.getAttribute('data-level')).toBe('success');
    expect(element.querySelector('.editora-toast-icon svg')).not.toBeNull();
    const jsx = element.querySelector('.editora-toast-message [data-testid="jsx"]')!;
    expect(jsx.textContent).toBe('Saved draft.md');
  });

  it('renders JSX with the context of where <Toaster /> is mounted', async () => {
    function Reader() {
      return <span data-testid="theme">{React.useContext(Theme)}</span>;
    }
    render(
      <Theme.Provider value="dark">
        <Toaster />
      </Theme.Provider>
    );
    toast(<Reader />, { title: <strong>Heads up</strong>, description: 'Plain text still works' });
    await settle();

    expect(document.querySelector('[data-testid="theme"]')!.textContent).toBe('dark');
    expect(document.querySelector('.editora-toast-title strong')!.textContent).toBe('Heads up');
    expect(document.querySelector('.editora-toast-description')!.textContent).toBe('Plain text still works');
  });

  it('keeps state in the JSX when the toast is updated, and swaps the JSX in place', async () => {
    function Counter() {
      const [count, setCount] = React.useState(0);
      return (
        <button type="button" data-testid="counter" onClick={() => setCount(count + 1)}>
          {count}
        </button>
      );
    }
    render(<Toaster />);
    const shown = toast(<Counter />, { duration: 0, title: 'Before' });
    await settle(300); // past the enter animation: an update made during it waits for it
    act(() => (document.querySelector('[data-testid="counter"]') as HTMLButtonElement).click());
    expect(document.querySelector('[data-testid="counter"]')!.textContent).toBe('1');

    toast.update(shown.id, { title: <em>After</em> });
    await settle();
    expect(document.querySelector('.editora-toast-title em')!.textContent).toBe('After');
    // The message's element was kept, so the component kept its state.
    expect(document.querySelector('[data-testid="counter"]')!.textContent).toBe('1');
  });

  it('toast.custom renders your JSX with the id and a dismiss function', async () => {
    render(<Toaster />);
    toast.custom(({ id, dismiss }) => (
      <div data-testid="custom">
        <span>{id.startsWith('toast-react-') ? 'has id' : 'no id'}</span>
        <button type="button" onClick={dismiss}>Undo</button>
      </div>
    ), { duration: 0 });
    await settle();

    const custom = document.querySelector('[data-testid="custom"]')!;
    expect(custom.textContent).toContain('has id');
    expect(document.querySelector('.editora-toast .editora-toast-icon')).toBeNull();

    act(() => custom.querySelector('button')!.click());
    // The exit animation runs on timers: wait for its end rather than a fixed time, which a busy CI
    // runner overran.
    await waitFor(() => expect(document.querySelector('[data-testid="custom"]')).toBeNull(), { timeout: 3000 });
    expect(toastAdvanced.getToasts().length).toBe(0);
  });

  it('removes the JSX when the toast goes', async () => {
    render(<Toaster />);
    const shown = toast(<span data-testid="gone">Bye</span>, { duration: 0 });
    await settle();
    expect(document.querySelector('[data-testid="gone"]')).not.toBeNull();
    toast.dismiss(shown.id);
    await waitFor(() => expect(document.querySelector('[data-testid="gone"]')).toBeNull(), { timeout: 3000 });
  });

  it('follows a promise with JSX for each state, and keeps the loading toast however long it takes', async () => {
    toast.configure({ duration: 200 });
    render(<Toaster />);
    let finish!: (name: string) => void;
    const done = toast.promise(new Promise<string>((resolve) => (finish = resolve)), {
      loading: <span data-testid="state">Saving</span>,
      success: (name) => ({ title: <span data-testid="state">Saved {name}</span>, description: 'All good' }),
      error: 'Could not save',
    });
    await settle(500); // longer than the duration
    expect(document.querySelector('[data-testid="state"]')!.textContent).toBe('Saving');

    finish('a.md');
    await act(async () => {
      await done;
    });
    await settle();
    expect(document.querySelector('.editora-toast')!.getAttribute('data-level')).toBe('success');
    expect(document.querySelector('[data-testid="state"]')!.textContent).toBe('Saved a.md');
    // The result given as options replaced the loading message.
    expect(document.querySelector('.editora-toast-message')).toBeNull();
    toast.configure({ duration: 4000 });
  });

  it('applies its props as the settings', async () => {
    render(<Toaster position="bottom-left" theme="dark" />);
    await settle();
    expect(toastAdvanced.getConfig().position).toBe('bottom-left');
    expect(toastAdvanced.getConfig().theme).toBe('dark');
    toast.configure({ position: 'top-right', theme: 'light' });
  });

  it('text needs no <Toaster />; JSX without one says what to mount', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    toast.info('Plain text');
    await settle();
    expect(document.querySelector('.editora-toast-message')!.textContent).toBe('Plain text');
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('<Toaster />'));

    toast(<span>JSX</span>);
    await settle();
    expect(warn.mock.calls.some(([message]) => String(message).includes('mount <Toaster />'))).toBe(true);
  });

  it('JSX shown before <Toaster /> mounts appears once it does', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    toast(<span data-testid="early">Early</span>, { duration: 0 });
    await settle();
    render(<Toaster />);
    await settle();
    expect(document.querySelector('[data-testid="early"]')!.textContent).toBe('Early');
  });

  it('a JSX toast is not a duplicate of another JSX toast', async () => {
    toast.configure({ preventDuplicate: true });
    render(<Toaster />);
    toast(<span>One</span>);
    toast(<span>Two</span>);
    await settle();
    expect(document.querySelectorAll('.editora-toast').length).toBe(2);
    toast.configure({ preventDuplicate: false });
  });
});
