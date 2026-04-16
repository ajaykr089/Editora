import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-dialog';
import '../components/ui-select';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-dialog and ui-select integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps the dialog open while opening a short select menu inside the panel', async () => {
    const dialog = document.createElement('ui-dialog') as HTMLElement;
    dialog.setAttribute('open', '');
    dialog.setAttribute('title', 'Appointment booking wizard');
    dialog.innerHTML = `
      <ui-select label="Department">
        <option value="">Select department</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Orthopedics">Orthopedics</option>
        <option value="Pediatrics">Pediatrics</option>
        <option value="Neurology">Neurology</option>
      </ui-select>
    `;

    document.body.appendChild(dialog);
    await flushMicrotask();

    const select = dialog.querySelector('ui-select') as HTMLElement | null;
    const trigger = select?.shadowRoot?.querySelector('.trigger') as HTMLButtonElement | null;
    expect(select).toBeTruthy();
    expect(trigger).toBeTruthy();

    trigger?.click();
    await flushMicrotask();

    const panel = select?.shadowRoot?.querySelector('.panel') as HTMLElement | null;
    expect(dialog.hasAttribute('open')).toBe(true);
    expect(select?.hasAttribute('open')).toBe(true);
    expect(panel?.hidden).toBe(false);
  });
});
