import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastManager } from '../src/core/ToastManager';
import { toast as simpleToast, toastAdvanced } from '../src/index';

let manager: ToastManager;

beforeEach(() => {
  document.body.innerHTML = '';
  manager = new ToastManager();
});

afterEach(() => {
  manager.destroy();
  toastAdvanced.destroy();
  vi.restoreAllMocks();
});

const toasts = () => Array.from(document.querySelectorAll<HTMLElement>('.editora-toast'));
const container = () => document.querySelector<HTMLElement>('.editora-toast-container')!;
const waitForToasts = (n: number) => vi.waitFor(() => expect(toasts().length).toBe(n));
const byText = (text: string) => toasts().find((el) => el.textContent?.includes(text))!;

describe('status icons', () => {
  it('shows an icon for each level, drawn as an svg and hidden from screen readers', async () => {
    for (const level of ['info', 'success', 'warning', 'error', 'loading'] as const) {
      manager.show({ message: level, level, duration: 0, maxVisible: 9 } as any);
    }
    manager.configure({ maxVisible: 9 });
    await waitForToasts(5);
    for (const el of toasts()) {
      const icon = el.querySelector('.editora-toast-icon')!;
      expect(icon, el.textContent || '').not.toBeNull();
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.querySelector('svg')).not.toBeNull();
    }
  });

  it('gives every level its own shape, so colour is never the only cue', async () => {
    manager.configure({ maxVisible: 9 });
    for (const level of ['info', 'success', 'warning', 'error'] as const) {
      manager.show({ message: level, level, duration: 0 });
    }
    await waitForToasts(4);
    const shapes = toasts().map((el) => el.querySelector('svg')!.innerHTML);
    expect(new Set(shapes).size).toBe(4);
  });

  it('spins the loading icon and stops spinning when the toast becomes a success', async () => {
    const toast = manager.show({ message: 'working', level: 'loading', duration: 0 });
    await waitForToasts(1);
    expect(toasts()[0].querySelector('.editora-toast-icon')!.getAttribute('data-spin')).toBe('true');
    manager.update(toast.id, { message: 'done', level: 'success' });
    await vi.waitFor(() => expect(toasts()[0].dataset.level).toBe('success'));
    await vi.waitFor(() => expect(toasts()[0].querySelector('.editora-toast-icon')!.hasAttribute('data-spin')).toBe(false));
  });

  it('lets a toast bring its own icon (text, a node) or none', async () => {
    manager.configure({ maxVisible: 9 });
    const node = document.createElement('b');
    node.textContent = 'N';
    manager.show({ message: 'text', icon: '🎉', duration: 0 });
    manager.show({ message: 'node', icon: node, duration: 0 });
    manager.show({ message: 'none', level: 'success', icon: false, duration: 0 });
    await waitForToasts(3);
    expect(byText('text').querySelector('.editora-toast-icon')!.textContent).toBe('🎉');
    expect(byText('node').querySelector('.editora-toast-icon b')).toBe(node);
    expect(byText('none').querySelector('.editora-toast-icon')).toBeNull();
  });

  it('can be turned off for the whole page, and a plain toast has none', async () => {
    manager.configure({ icons: false, maxVisible: 9 });
    manager.show({ message: 'quiet', level: 'success', duration: 0 });
    manager.show({ message: 'neutral', level: 'custom', duration: 0 });
    await waitForToasts(2);
    expect(document.querySelector('.editora-toast-icon')).toBeNull();
    manager.configure({ icons: true });
    manager.show({ message: 'neutral again', level: 'custom', duration: 0 });
    await waitForToasts(3);
    expect(byText('neutral again').querySelector('.editora-toast-icon')).toBeNull();
  });
});

describe('progress bar', () => {
  const trackOf = (el: HTMLElement) => el.querySelector<HTMLElement>('.editora-toast-progress-track');

  it('sits in the text column, not beside it, with the value as its width', async () => {
    manager.show({ message: 'Uploading', progress: { value: 64, showPercentage: true }, duration: 0 });
    await waitForToasts(1);
    const track = trackOf(toasts()[0])!;
    expect(track.parentElement!.classList.contains('editora-toast-body')).toBe(true);
    expect(track.getAttribute('aria-valuenow')).toBe('64');
    expect((track.querySelector('.editora-toast-progress-bar') as HTMLElement).style.width).toBe('64%');
    expect(track.querySelector('.editora-toast-progress-text')!.textContent).toBe('64%');
  });

  it('survives an update of the message and follows an update of the value', async () => {
    const toast = manager.show({ message: 'Uploading', progress: { value: 10 }, duration: 0 });
    await waitForToasts(1);
    manager.update(toast.id, { message: 'Uploading 2 of 3' });
    await vi.waitFor(() => expect(toasts()[0].textContent).toContain('Uploading 2 of 3'));
    expect(trackOf(toasts()[0])).not.toBeNull();
    manager.update(toast.id, { progress: { value: 80, showPercentage: true } });
    await vi.waitFor(() => expect(trackOf(toasts()[0])!.getAttribute('aria-valuenow')).toBe('80'));
    expect(toasts()[0].querySelectorAll('.editora-toast-progress-track').length).toBe(1);
    manager.update(toast.id, { progress: undefined as any, message: 'Done' });
    await vi.waitFor(() => expect(toasts()[0].textContent).toContain('Done'));
  });
});

describe('promise results', () => {
  it('replaces the loading text when the result is given as a title and a description', async () => {
    await manager.promise(Promise.resolve(1), {
      loading: 'Uploading',
      success: { title: 'Upload complete', description: 'Three files' },
      error: 'Nope'
    });
    await vi.waitFor(() => expect(toasts()[0].textContent).toContain('Upload complete'));
    expect(toasts()[0].textContent).not.toContain('Uploading');
    expect(toasts()[0].dataset.level).toBe('success');
  });
});

describe('stack layout', () => {
  // jsdom has no layout; give every toast a height so the offsets can be checked.
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(50);
  });

  const yOf = (el: HTMLElement) => el.style.getPropertyValue('--et-y');

  it('puts the newest toast at the edge, and the older ones further in, in a list', async () => {
    manager.configure({ stack: false, maxVisible: 5, position: 'bottom-right' });
    manager.show({ message: 'first', duration: 0 });
    await waitForToasts(1);
    manager.show({ message: 'second', duration: 0 });
    manager.show({ message: 'third', duration: 0 });
    await waitForToasts(3);
    expect(yOf(byText('third'))).toBe('0px');
    expect(yOf(byText('second'))).toBe('-58px'); // 50 high + 8 gap, up from the bottom edge
    expect(yOf(byText('first'))).toBe('-116px');
    expect(container().dataset.expanded).toBe('true');
    expect(container().style.height).toBe('166px'); // 3 x 50 + 2 gaps of 8
  });

  it('grows downward from a top edge', async () => {
    manager.configure({ stack: false, maxVisible: 5, position: 'top-center' });
    manager.show({ message: 'old', duration: 0 });
    await waitForToasts(1);
    manager.show({ message: 'new', duration: 0 });
    await waitForToasts(2);
    expect(yOf(byText('new'))).toBe('0px');
    expect(yOf(byText('old'))).toBe('58px');
  });

  it('is a collapsed deck by default and opens while the pointer is over it', async () => {
    manager.configure({ maxVisible: 5 });
    manager.show({ message: 'one', duration: 0 });
    await waitForToasts(1);
    manager.show({ message: 'two', duration: 0 });
    manager.show({ message: 'three', duration: 0 });
    await waitForToasts(3);

    expect(container().dataset.expanded).toBe('false');
    expect(byText('three').dataset.front).toBe('true');
    expect(byText('three').dataset.collapsed).toBe('false');
    expect(byText('two').dataset.collapsed).toBe('true');
    expect(byText('one').dataset.collapsed).toBe('true');
    // Every toast in the deck is as high as the front one.
    expect(toasts().every((el) => el.style.height === '50px')).toBe(true);

    container().dispatchEvent(new MouseEvent('mouseenter'));
    expect(container().dataset.expanded).toBe('true');
    expect(toasts().every((el) => el.dataset.collapsed === 'false')).toBe(true);

    container().dispatchEvent(new MouseEvent('mouseleave'));
    expect(container().dataset.expanded).toBe('false');
    expect(byText('one').dataset.collapsed).toBe('true');
  });

  it('opens on a tap (some touch browsers send no mouse events for one) and closes on a tap elsewhere', async () => {
    manager.configure({ maxVisible: 5 });
    manager.show({ message: 'one', duration: 0 });
    await waitForToasts(1);
    manager.show({ message: 'two', duration: 0 });
    await waitForToasts(2);
    const touch = (target: EventTarget) => {
      const event = new Event('pointerdown', { bubbles: true }) as any;
      event.pointerType = 'touch';
      target.dispatchEvent(event);
    };
    expect(container().dataset.expanded).toBe('false');
    touch(byText('two'));
    expect(container().dataset.expanded).toBe('true');
    touch(document.body);
    expect(container().dataset.expanded).toBe('false');
  });

  it('closes the gap at once when a toast is dismissed, before its exit animation ends', async () => {
    manager.configure({ stack: false, maxVisible: 5 });
    manager.show({ message: 'keep', duration: 0 });
    await waitForToasts(1);
    const gone = manager.show({ message: 'gone', duration: 0 });
    await waitForToasts(2);
    expect(yOf(byText('keep'))).toBe('-58px');
    manager.dismiss(gone.id);
    await vi.waitFor(() => expect(yOf(byText('keep'))).toBe('0px'));
    expect(byText('keep').dataset.front).toBe('true');
  });

  it('measures a toast again after an update changes its content', async () => {
    let height = 50;
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(() => height);
    manager.configure({ stack: false, maxVisible: 5 });
    manager.show({ message: 'below', duration: 0 });
    await waitForToasts(1);
    const tall = manager.show({ message: 'short', duration: 0 });
    await waitForToasts(2);
    expect(yOf(byText('below'))).toBe('-58px');
    height = 90;
    manager.update(tall.id, { message: 'a much taller message', description: 'with a description' });
    await vi.waitFor(() => expect(yOf(byText('below'))).toBe('-98px'));
  });
});

describe('timers', () => {
  const delays = () => {
    const spy = vi.spyOn(window, 'setTimeout');
    return () => spy.mock.calls.map((call) => call[1]).filter((ms): ms is number => typeof ms === 'number' && ms >= 300 && ms <= 5000);
  };

  it('holds every toast while the stack is hovered, and keeps the time that was left', async () => {
    const recorded = delays();
    manager.show({ message: 'timed', duration: 1000 });
    await waitForToasts(1);
    const instance = manager.getToasts()[0];
    await new Promise((r) => setTimeout(r, 350));

    container().dispatchEvent(new MouseEvent('mouseenter'));
    expect(instance.timeoutId).toBeUndefined();
    await new Promise((r) => setTimeout(r, 200));
    container().dispatchEvent(new MouseEvent('mouseleave'));
    expect(instance.timeoutId).toBeDefined();

    // The timer was started at 1000 ms; it is re-armed with what was left, not with a fresh 1000.
    const last = recorded().pop()!;
    expect(last).toBeLessThan(900);
    expect(last).toBeGreaterThan(300);
  });

  it('does not restart a toast while another hold is still on it', async () => {
    manager.show({ message: 'held', duration: 5000 });
    await waitForToasts(1);
    const instance = manager.getToasts()[0];
    await vi.waitFor(() => expect(instance.timeoutId).toBeDefined()); // the timer starts once the toast has appeared
    const renderer = (manager as any).renderer;
    renderer.pauseToast(instance, 'pointer');
    renderer.pauseToast(instance, 'window');
    renderer.resumeToast(instance, 'pointer');
    expect(instance.timeoutId).toBeUndefined();
    renderer.resumeToast(instance, 'window');
    expect(instance.timeoutId).toBeDefined();
  });

  it('starts a toast that was held before its timer began once the hold is released', async () => {
    manager.show({ message: 'early', duration: 5000 });
    await waitForToasts(1);
    const instance = manager.getToasts()[0];
    await vi.waitFor(() => expect(instance.timeoutId).toBeDefined());
    const renderer = (manager as any).renderer;
    renderer.pauseToast(instance, 'pointer');
    manager.update(instance.id, { duration: 4000 });
    await vi.waitFor(() => expect(instance.options.duration).toBe(4000));
    expect(instance.timeoutId).toBeUndefined();
    renderer.resumeToast(instance, 'pointer');
    expect(instance.timeoutId).toBeDefined();
  });
});

describe('a toast that arrives while the stack is hovered', () => {
  it('is held with the others until the pointer leaves', async () => {
    manager.show({ message: 'first', duration: 600 });
    await waitForToasts(1);
    container().dispatchEvent(new MouseEvent('mouseenter'));
    const late = manager.show({ message: 'late', duration: 600 });
    await waitForToasts(2);
    await new Promise((r) => setTimeout(r, 900));
    expect(toasts().length).toBe(2);
    expect(late.timeoutId).toBeUndefined();
    container().dispatchEvent(new MouseEvent('mouseleave'));
    await vi.waitFor(() => expect(toasts().length).toBe(0), { timeout: 3000 });
  });
});

describe('keyboard', () => {
  const press = (target: EventTarget, init: KeyboardEventInit) =>
    target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));

  it('makes each toast reachable with the Tab key', async () => {
    manager.show({ message: 'focusable', duration: 0 });
    await waitForToasts(1);
    expect(toasts()[0].tabIndex).toBe(0);
  });

  it('moves focus to the newest toast with Alt+T, and Escape dismisses it and gives focus back', async () => {
    const page = document.createElement('button');
    document.body.appendChild(page);
    page.focus();

    manager.configure({ maxVisible: 5 });
    manager.show({ message: 'older', duration: 0 });
    await waitForToasts(1);
    manager.show({ message: 'newer', duration: 0 });
    await waitForToasts(2);

    press(document, { code: 'KeyT', key: '†', altKey: true });
    expect(document.activeElement).toBe(byText('newer'));

    press(byText('newer'), { key: 'Escape' });
    await vi.waitFor(() => expect(toasts().some((el) => el.textContent?.includes('newer'))).toBe(false));
    expect(document.activeElement).toBe(byText('older'));

    press(byText('older'), { key: 'Escape' });
    await vi.waitFor(() => expect(toasts().length).toBe(0));
    expect(document.activeElement).toBe(page);
  });

  it('ignores the hotkey when it is switched off or another key is pressed', async () => {
    manager.show({ message: 'x', duration: 0 });
    await waitForToasts(1);
    press(document, { code: 'KeyT', altKey: true, shiftKey: true });
    expect(document.activeElement).not.toBe(toasts()[0]);
    manager.configure({ hotkey: false });
    press(document, { code: 'KeyT', altKey: true });
    expect(document.activeElement).not.toBe(toasts()[0]);
    manager.configure({ hotkey: 'ctrl+shift+k' });
    press(document, { code: 'KeyK', ctrlKey: true, shiftKey: true });
    expect(document.activeElement).toBe(toasts()[0]);
  });
});

describe('the simple toast API', () => {
  const waitFor = (n: number) => vi.waitFor(() => expect(toasts().length).toBe(n));

  it('toast("text") is a plain toast, and the level methods keep working', async () => {
    simpleToast('Copied to clipboard', { duration: 0 });
    simpleToast.success('Saved', { duration: 0 });
    await waitFor(2);
    const plain = byText('Copied');
    expect(plain.dataset.level).toBe('custom');
    expect(plain.querySelector('.editora-toast-icon')).toBeNull();
    expect(byText('Saved').dataset.level).toBe('success');
  });

  it('toast.promise follows a promise and resolves with its value', async () => {
    const value = await simpleToast.promise(Promise.resolve(42), {
      loading: 'Working',
      success: (n) => `Got ${n}`,
      error: 'Failed'
    });
    expect(value).toBe(42);
    await vi.waitFor(() => expect(toasts().some((el) => el.textContent?.includes('Got 42'))).toBe(true));
  });

  it('toast.update and toast.dismiss(id) change and remove one toast', async () => {
    const a = simpleToast.info('first', { duration: 0 });
    simpleToast.info('second', { duration: 0 });
    await waitFor(2);
    expect(simpleToast.update((a as any).id, { message: 'renamed' })).toBe(true);
    await vi.waitFor(() => expect(toasts().some((el) => el.textContent?.includes('renamed'))).toBe(true));
    simpleToast.dismiss((a as any).id);
    await vi.waitFor(() => expect(toasts().length).toBe(1));
    expect(toasts()[0].textContent).toContain('second');
  });

  it('toast.dismiss() without an id clears every toast', async () => {
    simpleToast.info('a', { duration: 0 });
    simpleToast.info('b', { duration: 0 });
    await waitFor(2);
    simpleToast.dismiss();
    await vi.waitFor(() => expect(toasts().length).toBe(0), { timeout: 3000 });
  });

  it('toast.configure changes the defaults', async () => {
    simpleToast.configure({ position: 'top-left' });
    simpleToast.info('placed', { duration: 0 });
    await waitFor(1);
    expect(document.querySelector('.editora-toast-container')!.getAttribute('data-position')).toBe('top-left');
  });
});
