/**
 * The error message a field control shows: the `data-error` of the Editora field it belongs to
 * (validation or `form.setErrors()`), else a native control's validity message while it is marked
 * `aria-invalid`. Empty when there is none.
 *
 * Self-contained on purpose: the Playwright helpers run this same function in the page with
 * `locator.evaluate`, which serializes its source, so it must not use anything from outside.
 */
export function fieldError(control: Element): string {
  const root = control.getRootNode() as Document | ShadowRoot;
  const shadowHost = (root as ShadowRoot).host as Element | undefined;
  // The control is inside an Editora field's shadow root, or is an <input slot="input"> in it.
  const owners = [shadowHost, control.closest('[data-error]')].filter(Boolean) as Element[];
  for (const owner of owners) {
    const message = (owner.getAttribute('data-error') || '').trim();
    if (message) return message;
  }
  const native = control as HTMLInputElement;
  if (control.getAttribute('aria-invalid') === 'true' && typeof native.validationMessage === 'string') {
    return native.validationMessage.trim();
  }
  return '';
}
