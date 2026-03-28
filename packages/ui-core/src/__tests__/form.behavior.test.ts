import { describe, expect, it, vi } from 'vitest';
import '../components/ui-form';

function nextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('ui-form behavior', () => {
  it('collects native control values for getValues()', async () => {
    const el = document.createElement('ui-form') as any;
    el.innerHTML = `
      <input name="firstName" value="Ava" />
      <input type="checkbox" name="enabled" checked />
      <select name="role">
        <option value="viewer">Viewer</option>
        <option value="admin" selected>Admin</option>
      </select>
    `;
    document.body.appendChild(el);
    await nextTick();

    const values = el.getValues();
    expect(values.firstName).toBe('Ava');
    expect(values.enabled).toBe(true);
    expect(values.role).toBe('admin');
  });

  it('fails validation for invalid native controls', async () => {
    const el = document.createElement('ui-form') as any;
    el.innerHTML = `<input name="email" type="email" value="not-email" />`;
    document.body.appendChild(el);
    await nextTick();

    const result = await el.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeTruthy();
  });

  it('autosave emits after dirty change when enabled', async () => {
    vi.useFakeTimers();
    try {
      const el = document.createElement('ui-form') as any;
      el.setAttribute('autosave', '');
      el.setAttribute('autosave-delay', '10');
      el.innerHTML = `<input name="name" value="Ava" />`;
      document.body.appendChild(el);
      await Promise.resolve();

      const autosave = vi.fn();
      el.addEventListener('autosave', autosave);

      const input = el.querySelector('input') as HTMLInputElement | null;
      expect(input).toBeTruthy();
      input!.value = 'Ava Dev';
      input!.dispatchEvent(new Event('input', { bubbles: true }));

      vi.advanceTimersByTime(40);
      await Promise.resolve();

      expect(autosave).toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('markClean clears dirty state after value updates', async () => {
    const el = document.createElement('ui-form') as any;
    el.innerHTML = `<input name="name" value="Ava" />`;
    document.body.appendChild(el);
    await nextTick();

    el.setValues({ name: 'Ava Dev' });
    await nextTick();
    expect(el.isDirty()).toBe(true);

    el.markClean();
    expect(el.isDirty()).toBe(false);
  });

  it('does not submit while disabled', async () => {
    const el = document.createElement('ui-form') as any;
    el.setAttribute('disabled', '');
    el.innerHTML = `<input name="name" value="Ava" />`;
    document.body.appendChild(el);
    await nextTick();

    const onSubmit = vi.fn();
    el.addEventListener('submit', onSubmit);

    const ok = await el.submit();
    expect(ok).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('maps legacy title attribute into heading and removes title tooltip source', async () => {
    const el = document.createElement('ui-form') as any;
    el.setAttribute('title', 'Legacy heading');
    document.body.appendChild(el);
    await nextTick();

    expect(el.getAttribute('heading')).toBe('Legacy heading');
    expect(el.hasAttribute('title')).toBe(false);
  });
});
