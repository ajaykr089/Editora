import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAlertDialogManager } from '../alert-dialog-manager';
import '../components/ui-alert-dialog';

function tick() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

async function settle() {
  await Promise.resolve();
  await tick();
}

function getDialog(host: HTMLElement) {
  return host.querySelector('ui-alert-dialog') as any;
}

function getShadowButton(dialog: any, selector: string): HTMLButtonElement {
  const button = dialog?.shadowRoot?.querySelector(selector) as HTMLButtonElement | null;
  expect(button).toBeTruthy();
  return button as HTMLButtonElement;
}

describe('alert dialog manager', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('confirm resolves on confirm action', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    const promise = manager.confirm({ title: 'Delete user?' });
    await settle();

    const dialog = getDialog(host);
    getShadowButton(dialog, '.btn-confirm').click();

    await expect(promise).resolves.toMatchObject({ action: 'confirm' });
  });

  it('confirm resolves on cancel action', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    const promise = manager.confirm({ title: 'Discard changes?' });
    await settle();

    const dialog = getDialog(host);
    getShadowButton(dialog, '.btn-cancel').click();

    await expect(promise).resolves.toMatchObject({ action: 'cancel' });
  });

  it('dismiss resolves with source for esc and backdrop', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    const escPromise = manager.confirm({ title: 'Esc test' });
    await settle();

    const escDialog = getDialog(host);
    const panel = escDialog.shadowRoot.querySelector('.dialog') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));

    await expect(escPromise).resolves.toMatchObject({ action: 'dismiss', source: 'esc' });

    const backdropPromise = manager.confirm({ title: 'Backdrop test' });
    await settle();

    const backdropDialog = getDialog(host);
    const backdrop = backdropDialog.shadowRoot.querySelector('.backdrop') as HTMLElement;
    backdrop.click();

    await expect(backdropPromise).resolves.toMatchObject({ action: 'dismiss', source: 'backdrop' });
  });

  it('queue mode preserves FIFO order', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    const first = manager.confirm({ title: 'First', mode: 'queue' });
    const second = manager.confirm({ title: 'Second', mode: 'queue' });
    await settle();

    expect(host.querySelectorAll('ui-alert-dialog').length).toBe(1);
    getShadowButton(getDialog(host), '.btn-confirm').click();
    await expect(first).resolves.toMatchObject({ action: 'confirm' });

    await settle();
    expect(host.querySelectorAll('ui-alert-dialog').length).toBe(1);

    getShadowButton(getDialog(host), '.btn-cancel').click();
    await expect(second).resolves.toMatchObject({ action: 'cancel' });
  });

  it('replace mode dismisses current active request', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    const first = manager.confirm({ title: 'Old dialog' });
    await settle();

    const second = manager.confirm({ title: 'New dialog', mode: 'replace' });

    await expect(first).resolves.toMatchObject({ action: 'dismiss', source: 'replace' });
    await settle();

    getShadowButton(getDialog(host), '.btn-confirm').click();
    await expect(second).resolves.toMatchObject({ action: 'confirm' });
  });

  it('abort signal closes and resolves dismiss', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    const controller = new AbortController();
    const promise = manager.confirm({ title: 'Abort me', signal: controller.signal });
    await settle();

    controller.abort();

    await expect(promise).resolves.toMatchObject({ action: 'dismiss', source: 'abort' });
  });

  it('async onConfirm sets loading and blocks dismiss while pending', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    let resolveConfirm!: () => void;
    const onConfirm = vi.fn(() =>
      new Promise<void>((resolve) => {
        resolveConfirm = resolve;
      })
    );

    const promise = manager.confirm({ title: 'Async confirm', onConfirm, lockWhileLoading: true });
    await settle();

    const dialog = getDialog(host);
    getShadowButton(dialog, '.btn-confirm').click();
    await settle();

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(dialog.getAttribute('state')).toBe('loading');

    const panel = dialog.shadowRoot.querySelector('.dialog') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));

    expect(dialog.hasAttribute('open')).toBe(true);

    resolveConfirm();
    await settle();

    await expect(promise).resolves.toMatchObject({ action: 'confirm' });
  });

  it('async onConfirm failure keeps dialog open and shows error', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    const promise = manager.confirm({
      title: 'Fail confirm',
      onConfirm: async () => {
        throw new Error('Unable to continue');
      }
    });

    await settle();

    const dialog = getDialog(host);
    getShadowButton(dialog, '.btn-confirm').click();
    await settle();

    expect(dialog.hasAttribute('open')).toBe(true);
    expect(dialog.getAttribute('state')).toBe('error');

    const error = dialog.shadowRoot.querySelector('.error') as HTMLElement;
    expect(error.textContent).toContain('Unable to continue');

    getShadowButton(dialog, '.btn-cancel').click();
    await expect(promise).resolves.toMatchObject({ action: 'cancel' });
  });

  it('passes visual props through to the dialog config surface', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    manager.setDefaults({
      variant: 'outline',
      radius: 12,
      elevation: 'high',
      indicator: 'none'
    });

    const promise = manager.confirm({
      title: 'Delete environment',
      tone: 'danger',
      size: '3'
    });
    await settle();

    const dialog = getDialog(host);
    expect(dialog.getAttribute('tone')).toBe('danger');
    expect(dialog.getAttribute('variant')).toBe('outline');
    expect(dialog.getAttribute('size')).toBe('3');
    expect(dialog.getAttribute('elevation')).toBe('high');
    expect(dialog.getAttribute('indicator')).toBe('none');
    expect(dialog.style.getPropertyValue('--ui-alert-radius')).toBe('12px');

    getShadowButton(dialog, '.btn-confirm').click();
    await expect(promise).resolves.toMatchObject({ action: 'confirm' });
  });

  it('runs onCancel and onDismiss side-effect hooks', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    const onCancel = vi.fn(async () => {});
    const onDismiss = vi.fn(async () => {});

    const cancelPromise = manager.confirm({
      title: 'Cancel test',
      onCancel
    });
    await settle();

    getShadowButton(getDialog(host), '.btn-cancel').click();
    await expect(cancelPromise).resolves.toMatchObject({ action: 'cancel' });
    expect(onCancel).toHaveBeenCalledTimes(1);

    const dismissPromise = manager.confirm({
      title: 'Dismiss test',
      onDismiss
    });
    await settle();

    const dialog = getDialog(host);
    const backdrop = dialog.shadowRoot.querySelector('.backdrop') as HTMLElement;
    backdrop.click();

    await expect(dismissPromise).resolves.toMatchObject({ action: 'dismiss', source: 'backdrop' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss.mock.calls[0]?.[0]?.source).toBe('backdrop');
  });

  it('destroy resolves pending requests as dismiss (provider unmount equivalent)', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    const pending = manager.prompt({
      title: 'Name',
      input: { required: true }
    });

    await settle();
    manager.destroy('unmount');

    await expect(pending).resolves.toMatchObject({ action: 'dismiss', source: 'unmount' });
  });

  it('cleans up listeners after settle (no leak from abort listener)', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const manager = createAlertDialogManager({ container: host });

    const controller = new AbortController();
    const promise = manager.confirm({ title: 'Cancel then abort', signal: controller.signal });
    await settle();

    const dialog = getDialog(host);
    getShadowButton(dialog, '.btn-cancel').click();

    await expect(promise).resolves.toMatchObject({ action: 'cancel' });
    expect(host.querySelector('ui-alert-dialog')).toBeNull();

    controller.abort();
    await settle();

    expect(host.querySelector('ui-alert-dialog')).toBeNull();
  });
});
