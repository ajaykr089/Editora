/**
 * Registers a field whose value is its `value` attribute with the ui-form around it, so the form
 * collects it, checks `required` and shows server errors on it (`form.setErrors()`).
 *
 * The date and time pickers never registered: in a ui-form a picked date was missing from the
 * values and a required picker was never checked. Call `syncFormField` on connect and when `name`
 * changes (React sets attributes after the element connects), and `releaseFormField` on disconnect.
 */
type Registration = { name: string; form: Element; unregister: () => void };
type UIForm = Element & { registerField?: (name: string, field: Record<string, unknown>) => () => void };

const registrations = new WeakMap<HTMLElement, Registration>();

function enclosingForm(host: HTMLElement): UIForm | null {
  if (!host.isConnected) return null;
  const root = host.getRootNode() as Document | ShadowRoot;
  const outer = (root as ShadowRoot).host as HTMLElement | undefined;
  return ((outer?.closest?.('ui-form') || host.closest('ui-form')) as UIForm | null) ?? null;
}

export function syncFormField(host: HTMLElement, options: { requiredMessage: string }): void {
  const name = host.getAttribute('name') || '';
  const form = enclosingForm(host);
  const current = registrations.get(host);
  if (current && current.name === name && current.form === form) return;
  releaseFormField(host);
  if (!form || !name || typeof form.registerField !== 'function') return;
  try {
    const unregister = form.registerField(name, {
      name,
      getValue: () => host.getAttribute('value') || '',
      setValue: (next: unknown) => {
        if (next == null || next === '') host.removeAttribute('value');
        else host.setAttribute('value', typeof next === 'string' ? next : JSON.stringify(next));
      },
      validate: () =>
        host.hasAttribute('required') && !host.getAttribute('value')
          ? { valid: false, message: options.requiredMessage }
          : { valid: true },
      // The pickers show their `error` attribute; only an error the form set is removed again.
      setError: (message?: string) => {
        if (message) {
          host.setAttribute('data-error', message);
          host.setAttribute('data-form-error', '');
          host.setAttribute('error', message);
        } else {
          host.removeAttribute('data-error');
          if (host.hasAttribute('data-form-error')) {
            host.removeAttribute('data-form-error');
            host.removeAttribute('error');
          }
        }
      },
    });
    registrations.set(host, { name, form, unregister });
  } catch {
    // Not inside a form that accepts fields.
  }
}

export function releaseFormField(host: HTMLElement): void {
  registrations.get(host)?.unregister();
  registrations.delete(host);
}
