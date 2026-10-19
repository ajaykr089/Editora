import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { confirmAction, promptText } from '../confirmDialog';

let editor: HTMLElement;
const dialog = () => document.querySelector('.rte-confirm-dialog') as HTMLElement;
const overlay = () => document.querySelector('.rte-confirm-overlay') as HTMLElement;
const button = (action: 'confirm' | 'cancel') => dialog().querySelector(`[data-action="${action}"]`) as HTMLButtonElement;
const input = () => dialog().querySelector('input') as HTMLInputElement;
const press = (key: string, target: Element = document.activeElement ?? document.body) => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
};
const settle = async () => {
  await Promise.resolve();
  vi.advanceTimersByTime(20);
};

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = '<div id="editor" contenteditable="true" tabindex="0">text</div>';
  editor = document.getElementById('editor') as HTMLElement;
  editor.focus();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
  document.getElementById('rte-confirm-styles')?.remove();
});

describe('confirmAction', () => {
  it('opens an alert dialog with a name and a description, and does not use the browser\'s confirm()', async () => {
    const native = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    void confirmAction('Remove this media?', { title: 'Remove media' });
    await settle();

    expect(dialog().getAttribute('role')).toBe('alertdialog');
    expect(dialog().getAttribute('aria-modal')).toBe('true');
    expect(document.getElementById(dialog().getAttribute('aria-labelledby')!)?.textContent).toBe('Remove media');
    expect(document.getElementById(dialog().getAttribute('aria-describedby')!)?.textContent).toBe('Remove this media?');
    expect(native).not.toHaveBeenCalled();
    native.mockRestore();
  });

  it('starts the focus on Cancel, the choice that does no harm', async () => {
    void confirmAction('Remove this media?', { danger: true });
    await settle();
    expect(document.activeElement).toBe(button('cancel'));
  });

  it('resolves true when confirmed, and removes the dialog', async () => {
    const answer = confirmAction('Go ahead?');
    await settle();
    button('confirm').click();
    await expect(answer).resolves.toBe(true);
    expect(overlay()).toBeNull();
  });

  it('resolves false on Cancel, on Escape and on a click outside', async () => {
    let answer = confirmAction('Go ahead?');
    await settle();
    button('cancel').click();
    await expect(answer).resolves.toBe(false);

    answer = confirmAction('Go ahead?');
    await settle();
    press('Escape');
    await expect(answer).resolves.toBe(false);
    expect(overlay()).toBeNull();

    answer = confirmAction('Go ahead?');
    await settle();
    overlay().click();
    await expect(answer).resolves.toBe(false);
  });

  it('does not close on a click inside the dialog', async () => {
    void confirmAction('Go ahead?');
    await settle();
    dialog().click();
    expect(overlay()).not.toBeNull();
  });

  it('uses the words it is given, and escapes them', async () => {
    void confirmAction('Delete <b>everything</b>?', { title: 'Sure?', confirmText: 'Delete it', cancelText: 'Keep it', danger: true });
    await settle();
    expect(button('confirm').textContent).toBe('Delete it');
    expect(button('confirm').classList.contains('danger')).toBe(true);
    expect(button('cancel').textContent).toBe('Keep it');
    expect(dialog().querySelector('.rte-confirm-message b')).toBeNull();
    expect(dialog().querySelector('.rte-confirm-message')!.textContent).toBe('Delete <b>everything</b>?');
  });

  it('keeps Tab inside, and gives the focus back to where it was when it closes', async () => {
    const answer = confirmAction('Go ahead?');
    await settle();
    expect(document.activeElement).toBe(button('cancel'));
    button('confirm').focus();
    expect(press('Tab').defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(button('cancel'));

    button('cancel').click();
    await answer;
    await settle();
    expect(document.activeElement).toBe(editor);
  });

  it('takes Escape for itself, so a dialog it was opened over does not close as well', async () => {
    const behind = vi.fn();
    document.addEventListener('keydown', behind, true);
    try {
      const answer = confirmAction('Go ahead?');
      await settle();
      press('Escape');
      await expect(answer).resolves.toBe(false);
      expect(behind).not.toHaveBeenCalled();
    } finally {
      document.removeEventListener('keydown', behind, true);
    }
  });

  it('matches a dark editor', async () => {
    editor.classList.add('editora-theme-dark');
    void confirmAction('Go ahead?', { context: editor });
    await settle();
    expect(overlay().classList.contains('rte-confirm-dark')).toBe(true);
  });

  it('stops listening for Escape once it has closed', async () => {
    const answer = confirmAction('Go ahead?');
    await settle();
    button('confirm').click();
    await answer;
    const event = press('Escape', document.body);
    expect(event.defaultPrevented).toBe(false);
  });
});

describe('promptText', () => {
  it('opens a dialog with a labelled field that has the starting value selected and focused', async () => {
    void promptText('Enter width in pixels:', { title: 'Resize', initialValue: '320', inputMode: 'numeric' });
    await settle();
    expect(dialog().getAttribute('role')).toBe('dialog');
    expect(input().value).toBe('320');
    expect(input().getAttribute('inputmode')).toBe('numeric');
    expect(input().labels?.[0]?.textContent).toBe('Enter width in pixels:');
    expect(document.activeElement).toBe(input());
  });

  it('uses a label of its own when given one', async () => {
    void promptText('A longer question about the width', { label: 'Width (px)' });
    await settle();
    expect(input().labels?.[0]?.textContent).toBe('Width (px)');
  });

  it('resolves with the value on OK, and on Enter', async () => {
    let answer = promptText('Width?', { initialValue: '100' });
    await settle();
    input().value = '480';
    button('confirm').click();
    await expect(answer).resolves.toBe('480');

    answer = promptText('Width?', { initialValue: '100' });
    await settle();
    input().value = '640';
    press('Enter', input());
    await expect(answer).resolves.toBe('640');
  });

  it('resolves null on Cancel and on Escape', async () => {
    let answer = promptText('Width?');
    await settle();
    button('cancel').click();
    await expect(answer).resolves.toBeNull();

    answer = promptText('Width?');
    await settle();
    press('Escape', input());
    await expect(answer).resolves.toBeNull();
  });

  it('keeps the dialog open and says what is wrong when the value is not acceptable', async () => {
    const validate = (value: string) => (/^\d+$/.test(value) ? null : 'Enter a whole number, such as 480.');
    const answer = promptText('Width?', { initialValue: '', validate });
    let settled = false;
    void answer.then(() => (settled = true));
    await settle();

    input().value = 'wide';
    button('confirm').click();
    await settle();
    expect(settled).toBe(false);
    const error = dialog().querySelector('.rte-confirm-error') as HTMLElement;
    expect(error.hidden).toBe(false);
    expect(error.textContent).toBe('Enter a whole number, such as 480.');
    expect(error.getAttribute('role')).toBe('alert');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement).toBe(input());

    input().value = '480';
    button('confirm').click();
    await expect(answer).resolves.toBe('480');
  });

  it('can still be cancelled while it shows an error', async () => {
    const answer = promptText('Width?', { validate: () => 'No.' });
    await settle();
    button('confirm').click();
    press('Escape', input());
    await expect(answer).resolves.toBeNull();
  });

  it('escapes the starting value', async () => {
    void promptText('Width?', { initialValue: '"><img src=x onerror=alert(1)>' });
    await settle();
    expect(dialog().querySelector('img')).toBeNull();
    expect(input().value).toBe('"><img src=x onerror=alert(1)>');
  });
});
