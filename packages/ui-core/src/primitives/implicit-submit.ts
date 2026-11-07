/**
 * Implicit form submission for text fields that render their `<input>` inside a shadow root.
 *
 * A browser only submits a form on Enter when the focused input belongs to that form, and an input
 * in a shadow root never does, so pressing Enter in a ui-input inside a `<form>` did nothing.
 * This reproduces the native behaviour: activate the form's default button (its first submit
 * button) when there is one and it is enabled, otherwise request a submit. Inside a ui-form element
 * (whose `<form>` lives in its own shadow root) it calls that element's `requestSubmit()`.
 */

const DEFAULT_BUTTON_SELECTOR = [
  'button[type="submit"]',
  'button:not([type])',
  'input[type="submit"]',
  'input[type="image"]',
  'ui-button[type="submit"]'
].join(', ');

type SubmittableHost = HTMLElement & { requestSubmit?: () => unknown };

/** The nearest ancestor matching `selector`, crossing shadow-root boundaries. */
function closestAcrossRoots(start: Element, selector: string): Element | null {
  let node: Element | null = start;
  while (node) {
    const found = node.closest(selector);
    if (found) return found;
    const root = node.getRootNode();
    node = root instanceof ShadowRoot ? root.host : null;
  }
  return null;
}

function isDisabled(button: Element): boolean {
  if ('disabled' in button && (button as HTMLButtonElement).disabled) return true;
  const value = button.getAttribute('disabled');
  return value != null && value !== 'false';
}

export function submitImplicitly(host: HTMLElement, form?: HTMLFormElement | null): void {
  const nativeForm = form || (closestAcrossRoots(host, 'form') as HTMLFormElement | null);
  if (nativeForm) {
    const submitter = nativeForm.querySelector(DEFAULT_BUTTON_SELECTOR) as HTMLElement | null;
    if (submitter) {
      // Native rule: a disabled default button blocks implicit submission.
      if (!isDisabled(submitter)) submitter.click();
      return;
    }
    if (typeof nativeForm.requestSubmit === 'function') nativeForm.requestSubmit();
    else nativeForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    return;
  }

  const uiForm = closestAcrossRoots(host, 'ui-form') as SubmittableHost | null;
  uiForm?.requestSubmit?.();
}

/**
 * Call from the inner input's `keydown`. Submission waits until the event has finished
 * dispatching, so any keydown listener (on the field, the host or the page) can still cancel it
 * with `preventDefault()`, as it could cancel the native default action.
 */
export function scheduleImplicitSubmit(event: KeyboardEvent, host: HTMLElement, form?: () => HTMLFormElement | null): void {
  if (event.key !== 'Enter' || event.isComposing || event.keyCode === 229) return;
  if (event.defaultPrevented) return;
  setTimeout(() => {
    if (event.defaultPrevented || !host.isConnected) return;
    submitImplicitly(host, form?.() || null);
  }, 0);
}
