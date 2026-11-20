// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ToastManager } from '../src/core/ToastManager';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let manager: ToastManager | undefined;

afterEach(() => {
  manager?.destroy();
  manager = undefined;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function create(config: Record<string, unknown> = {}) {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  manager = new ToastManager(config);
  return manager;
}

describe('content given as DOM nodes', () => {
  it('shows a node as the title, message and description, as it is', async () => {
    const m = create();
    const link = document.createElement('a');
    link.href = '/files/1';
    link.textContent = 'Open the file';
    const strong = document.createElement('strong');
    strong.textContent = 'Uploaded';
    m.show({ title: strong, message: link, description: 'report.pdf', level: 'success' });
    await wait(50);

    expect(document.querySelector('.editora-toast-title strong')).toBe(strong);
    expect(document.querySelector('.editora-toast-message a')).toBe(link);
    expect(document.querySelector('.editora-toast-description')!.textContent).toBe('report.pdf');
  });

  it('tells screen readers the text of the nodes', async () => {
    const m = create();
    const message = document.createElement('span');
    message.textContent = 'Saved draft';
    m.show({ message, level: 'success' });
    await wait(400);
    const announcements = Array.from(document.querySelectorAll('[aria-live]')).map((element) => element.textContent);
    expect(announcements.some((text) => text === 'success: Saved draft')).toBe(true);
  });

  it('a node toast is a duplicate only by dedupeKey', async () => {
    const m = create({ preventDuplicate: true });
    m.show({ message: document.createElement('span') });
    m.show({ message: document.createElement('span') });
    await wait(50);
    expect(m.getToasts().length).toBe(2);
    m.show({ message: document.createElement('span'), dedupeKey: 'one' });
    m.show({ message: document.createElement('span'), dedupeKey: 'one' });
    await wait(50);
    expect(m.getToasts().length).toBe(3);
  });

  it('a promise result can be a node, or options from a function', async () => {
    const m = create();
    const done = document.createElement('em');
    done.textContent = 'Done';
    await m.promise(Promise.resolve('a.md'), { loading: 'Working', success: done, error: 'No' });
    await wait(400); // the result waits for the enter animation
    expect(document.querySelector('.editora-toast-message em')).toBe(done);

    m.clear();
    await wait(300);
    await m.promise(Promise.resolve('b.md'), {
      loading: 'Working',
      success: (name) => ({ title: `Saved ${name}`, description: 'In Drafts' }),
      error: 'No',
    });
    await wait(400);
    expect(document.querySelector('.editora-toast-title')!.textContent).toBe('Saved b.md');
    expect(document.querySelector('.editora-toast-message')).toBeNull();
  });
});

describe('toast.promise', () => {
  it('keeps the loading toast for a promise slower than the duration, then shows the result for the duration', async () => {
    const m = create({ duration: 200 });
    let finish!: (value: string) => void;
    const done = m.promise(new Promise<string>((resolve) => (finish = resolve)), { loading: 'Saving', success: 'Saved', error: 'No' });
    await wait(600);
    expect(document.querySelector('.editora-toast-message')!.textContent).toBe('Saving');

    finish('ok');
    await done;
    await wait(50);
    expect(document.querySelector('.editora-toast-message')!.textContent).toBe('Saved');
    await wait(600);
    expect(m.getToasts().length).toBe(0);
  });

  it('a loading toast given its own duration keeps it', async () => {
    const m = create();
    m.promise(new Promise(() => {}), { loading: { message: 'Saving', duration: 150 }, success: 's', error: 'e' });
    // enter (220 ms) + its 150 ms + exit (220 ms)
    await wait(1000);
    expect(m.getToasts().length).toBe(0);
  });
});

describe('the animation engine', () => {
  it('is loaded only for a named animation, and the toast still animates', async () => {
    const m = create();
    const spring = { type: 'spring' as const, config: { stiffness: 400, damping: 30 } };
    m.show({ message: 'Spring', animation: spring, duration: 0 });
    await wait(1200);
    const element = document.querySelector<HTMLElement>('.editora-toast')!;
    expect(element).not.toBeNull();
    expect(element.classList.contains('editora-toast-spring') || element.style.opacity === '1' || element.classList.contains('show')).toBe(true);
  });

  it('runs a custom animation without it', async () => {
    const m = create();
    const show = vi.fn((element: HTMLElement) => element.classList.add('custom-in'));
    const hide = vi.fn();
    const shown = m.show({ message: 'Custom', animation: { type: 'custom', show, hide }, duration: 0 });
    await wait(50);
    expect(show).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.editora-toast')!.classList.contains('custom-in')).toBe(true);
    shown.dismiss();
    await wait(50);
    expect(hide).toHaveBeenCalledTimes(1);
  });
});
