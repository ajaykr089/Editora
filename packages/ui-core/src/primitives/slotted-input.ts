/**
 * "Bring your own input" for the text fields: `<input slot="input">` in the light DOM.
 *
 * Password managers and browser autofill look for real inputs in the document; one inside a shadow
 * root is found unreliably, so sign-in forms could not be filled. With a slotted native input the
 * component keeps its label, styling, clear and visibility buttons around it but uses that input as
 * its control: it is an ordinary form field (name, autocomplete, FormData, Enter submits) that the
 * component never renames or retypes.
 */

const AUTO_NAME = 'data-ui-auto-name';

export function findSlottedInput(host: HTMLElement): HTMLInputElement | null {
  for (const child of Array.from(host.children)) {
    if (child instanceof HTMLInputElement && child.getAttribute('slot') === 'input') return child;
  }
  return null;
}

/**
 * Names the slotted input after the component's label when it has no name of its own (a <label for>,
 * aria-label or aria-labelledby). IDREFs into the shadow root cannot resolve from the light DOM, so
 * the label text is copied; a description is copied into aria-description for the same reason.
 */
export function nameSlottedInput(input: HTMLInputElement, label: string, description: string): void {
  const ownName =
    (input.hasAttribute('aria-label') && !input.hasAttribute(AUTO_NAME)) ||
    input.hasAttribute('aria-labelledby') ||
    (input.labels?.length ?? 0) > 0;
  if (!ownName) {
    if (label) {
      input.setAttribute('aria-label', label);
      input.setAttribute(AUTO_NAME, '');
    } else if (input.hasAttribute(AUTO_NAME)) {
      input.removeAttribute('aria-label');
      input.removeAttribute(AUTO_NAME);
    }
  }
  if (description) input.setAttribute('aria-description', description);
  else input.removeAttribute('aria-description');
}

/** The component's inner-input rules, applied to a slotted input. */
export function slottedInputCss(inputRules: string): string {
  return `
  ::slotted(input[slot="input"]) {
    ${inputRules}
  }
  `;
}
