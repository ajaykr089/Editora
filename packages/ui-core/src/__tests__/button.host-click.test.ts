import { describe, expect, it, vi } from 'vitest';
import '../components/ui-button';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('ui-button host click()', () => {
  it('submits its form like a native button, once', async () => {
    const form = document.createElement('form');
    form.innerHTML = '<ui-button type="submit">Save</ui-button>';
    document.body.appendChild(form);
    await tick();
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    const onClick = vi.fn();
    form.addEventListener('submit', onSubmit);
    const button = form.querySelector('ui-button') as HTMLElement;
    button.addEventListener('click', onClick);
    button.click();
    await tick();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    form.remove();
  });

  it('does nothing while disabled', async () => {
    const form = document.createElement('form');
    form.innerHTML = '<ui-button type="submit" disabled>Save</ui-button>';
    document.body.appendChild(form);
    await tick();
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', onSubmit);
    (form.querySelector('ui-button') as HTMLElement).click();
    await tick();
    expect(onSubmit).not.toHaveBeenCalled();
    form.remove();
  });
});
