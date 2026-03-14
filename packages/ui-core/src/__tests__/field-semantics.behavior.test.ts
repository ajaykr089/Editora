import { describe, expect, it } from 'vitest';
import '../components/ui-description';
import '../components/ui-field-error';
import '../components/ui-control-group';
import '../components/ui-fieldset';

function flushMicrotask() {
  return Promise.resolve();
}

describe('field semantics primitives', () => {
  it('ui-description links and unlinks aria-describedby on a target control', async () => {
    document.body.innerHTML = '<input id="email" />';
    const desc = document.createElement('ui-description');
    desc.setAttribute('for', 'email');
    desc.textContent = 'Used for delivery updates.';
    document.body.appendChild(desc);
    await flushMicrotask();

    const input = document.getElementById('email') as HTMLInputElement | null;
    expect(input?.getAttribute('aria-describedby')).toContain(desc.id);

    desc.remove();
    await flushMicrotask();
    expect(input?.hasAttribute('aria-describedby')).toBe(false);
  });

  it('ui-field-error marks a target invalid only when active', async () => {
    document.body.innerHTML = '<input id="api-key" />';
    const error = document.createElement('ui-field-error');
    error.setAttribute('for', 'api-key');
    error.textContent = 'API key is required.';
    document.body.appendChild(error);
    await flushMicrotask();

    const input = document.getElementById('api-key') as HTMLInputElement | null;
    expect(input?.hasAttribute('aria-invalid')).toBe(false);

    error.setAttribute('active', '');
    await flushMicrotask();
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-errormessage')).toBe(error.id);
  });

  it('ui-fieldset exposes legend and described-by metadata on the native fieldset shell', async () => {
    const el = document.createElement('ui-fieldset');
    el.setAttribute('legend', 'Notification channels');
    el.setAttribute('description', 'Pick one or more delivery paths.');
    el.setAttribute('error', 'Select at least one channel.');
    el.setAttribute('invalid', '');
    el.innerHTML = '<ui-control-group><input type="checkbox" checked /></ui-control-group>';
    document.body.appendChild(el);
    await flushMicrotask();

    const frame = el.shadowRoot?.querySelector('.frame') as HTMLFieldSetElement | null;
    expect(frame?.tagName).toBe('FIELDSET');
    expect(frame?.getAttribute('aria-labelledby')).toContain('legend');
    expect(frame?.getAttribute('aria-describedby')).toContain('description');
    expect(frame?.getAttribute('aria-describedby')).toContain('error');
    expect(frame?.getAttribute('aria-invalid')).toBe('true');
  });

  it('ui-control-group exposes a grouped a11y surface', async () => {
    const el = document.createElement('ui-control-group');
    el.setAttribute('label', 'Density options');
    el.setAttribute('orientation', 'horizontal');
    el.innerHTML = '<button>Compact</button><button>Comfortable</button>';
    document.body.appendChild(el);
    await flushMicrotask();

    const group = el.shadowRoot?.querySelector('.group') as HTMLElement | null;
    expect(group?.getAttribute('role')).toBe('group');
    expect(group?.getAttribute('aria-label')).toBe('Density options');
  });
});
