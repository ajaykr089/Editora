/**
 * Native form participation for the headless controls: a visually hidden input next to the control
 * carries its value into FormData and form submission, and the control returns to its default
 * value when the form is reset.
 */

const HIDDEN = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;pointer-events:none;opacity:0';

/** A hidden input placed after `anchor`, out of the tab order and the accessibility tree. */
export function createHiddenInput(anchor: HTMLElement, type: 'checkbox' | 'hidden', name: string): HTMLInputElement {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.tabIndex = -1;
  input.setAttribute('aria-hidden', 'true');
  input.setAttribute('data-headless-input', '');
  input.style.cssText = HIDDEN;
  anchor.insertAdjacentElement('afterend', input);
  return input;
}

/** Runs `onReset` when the form around `el` is reset. Returns the unsubscribe function. */
export function onFormReset(el: HTMLElement, onReset: () => void): () => void {
  const form = el.closest('form');
  if (!form) return () => {};
  // After the browser's own reset of the hidden inputs.
  const handler = () => setTimeout(onReset, 0);
  form.addEventListener('reset', handler);
  return () => form.removeEventListener('reset', handler);
}
