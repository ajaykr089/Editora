import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDialogManager } from '../dialog-manager';
import '../components/ui-dialog';

function tick() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

async function settle() {
  await Promise.resolve();
  await tick();
}

function getDialog(host: HTMLElement) {
  return host.querySelector('ui-dialog') as any;
}

function getShadowButton(dialog: any, selector: string): HTMLButtonElement {
  const button = dialog?.shadowRoot?.querySelector(selector) as HTMLButtonElement | null;
  expect(button).toBeTruthy();
  return button as HTMLButtonElement;
}

describe('dialog manager', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('resolves submit action', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createDialogManager({ container: host });

    const pending = manager.open({ title: 'Submit changes' });
    await settle();

    const dialog = getDialog(host);
    getShadowButton(dialog, '.btn-submit').click();

    await expect(pending).resolves.toMatchObject({ action: 'submit' });
  });

  it('resolves cancel action', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createDialogManager({ container: host });

    const pending = manager.open({ title: 'Cancel changes' });
    await settle();

    const dialog = getDialog(host);
    getShadowButton(dialog, '.btn-cancel').click();

    await expect(pending).resolves.toMatchObject({ action: 'cancel' });
  });

  it('resolves dismiss with esc and overlay sources', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createDialogManager({ container: host });

    const escPending = manager.open({ title: 'ESC' });
    await settle();

    const escDialog = getDialog(host);
    const panel = escDialog.shadowRoot.querySelector('.panel') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));

    await expect(escPending).resolves.toMatchObject({ action: 'dismiss', source: 'esc' });

    const overlayPending = manager.open({ title: 'Overlay' });
    await settle();

    const overlayDialog = getDialog(host);
    const overlay = overlayDialog.shadowRoot.querySelector('.overlay') as HTMLElement;
    overlay.click();

    await expect(overlayPending).resolves.toMatchObject({ action: 'dismiss', source: 'overlay' });
  });

  it('queue mode preserves FIFO order', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createDialogManager({ container: host });

    const first = manager.open({ title: 'First', mode: 'queue' });
    const second = manager.open({ title: 'Second', mode: 'queue' });

    await settle();
    expect(host.querySelectorAll('ui-dialog').length).toBe(1);

    getShadowButton(getDialog(host), '.btn-submit').click();
    await expect(first).resolves.toMatchObject({ action: 'submit' });

    await settle();
    getShadowButton(getDialog(host), '.btn-cancel').click();
    await expect(second).resolves.toMatchObject({ action: 'cancel' });
  });

  it('replace mode dismisses current and opens next', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createDialogManager({ container: host });

    const first = manager.open({ title: 'Old' });
    await settle();

    const second = manager.open({ title: 'New', mode: 'replace' });

    await expect(first).resolves.toMatchObject({ action: 'dismiss', source: 'replace' });

    await settle();
    getShadowButton(getDialog(host), '.btn-submit').click();
    await expect(second).resolves.toMatchObject({ action: 'submit' });
  });

  it('abort signal dismisses pending dialog', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createDialogManager({ container: host });

    const controller = new AbortController();
    const pending = manager.open({ title: 'Abort', signal: controller.signal });

    await settle();
    controller.abort();

    await expect(pending).resolves.toMatchObject({ action: 'dismiss', source: 'abort' });
  });

  it('async submit locks in loading and resolves after completion', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createDialogManager({ container: host });

    let resolveSubmit!: () => void;
    const onSubmit = vi.fn(() =>
      new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      })
    );

    const pending = manager.open({ title: 'Async', onSubmit, lockWhileLoading: true });
    await settle();

    const dialog = getDialog(host);
    getShadowButton(dialog, '.btn-submit').click();

    await settle();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(dialog.getAttribute('state')).toBe('loading');

    const panel = dialog.shadowRoot.querySelector('.panel') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    expect(dialog.hasAttribute('open')).toBe(true);

    resolveSubmit();
    await settle();

    await expect(pending).resolves.toMatchObject({ action: 'submit' });
  });

  it('async submit failure keeps dialog open and shows error', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createDialogManager({ container: host });

    const pending = manager.open({
      title: 'Async fail',
      onSubmit: async () => {
        throw new Error('Save failed');
      }
    });

    await settle();

    const dialog = getDialog(host);
    getShadowButton(dialog, '.btn-submit').click();

    await settle();
    expect(dialog.getAttribute('state')).toBe('error');
    expect(dialog.hasAttribute('open')).toBe(true);

    const error = dialog.shadowRoot.querySelector('.error') as HTMLElement;
    expect(error.textContent).toContain('Save failed');

    getShadowButton(dialog, '.btn-cancel').click();
    await expect(pending).resolves.toMatchObject({ action: 'cancel' });
  });

  it('destroy resolves pending as dismiss/unmount', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createDialogManager({ container: host });

    const pending = manager.open({ title: 'Pending' });
    await settle();

    manager.destroy('unmount');

    await expect(pending).resolves.toMatchObject({ action: 'dismiss', source: 'unmount' });
  });

  it('destroy resolves pending as dismiss/programmatic when called programmatically', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createDialogManager({ container: host });

    const pending = manager.open({ title: 'Pending' });
    await settle();

    manager.destroy('programmatic');

    await expect(pending).resolves.toMatchObject({ action: 'dismiss', source: 'programmatic' });
  });
});
