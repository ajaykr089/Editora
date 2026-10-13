import { describe, it, expect, beforeEach } from 'vitest';
// Only ui-input is defined up front. ui-form is defined later, as when a page's markup comes before the script that
// registers the elements and ui-input happens to be defined first.
import '../components/ui-input';

function settle() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe('ui-form with controls that were upgraded first', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('collects values and validates controls that registered before the form was defined', async () => {
    document.body.innerHTML = `
      <ui-form id="profile">
        <ui-field label="Name" required>
          <ui-input name="fullName" required></ui-input>
        </ui-field>
      </ui-form>`;
    await settle();

    await import('../components/ui-form');
    await settle();

    const form = document.getElementById('profile') as HTMLElement & {
      getValues: () => Record<string, unknown>;
      validate: () => Promise<{ valid: boolean; errors: Record<string, string> }>;
    };
    const input = form.querySelector('ui-input') as HTMLElement & { value: string };

    input.value = 'Ada';
    expect(form.getValues()).toEqual({ fullName: 'Ada' });

    input.value = '';
    await settle();
    const result = await form.validate();
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors)).toEqual(['fullName']);
  });
});
