// Selectors that arrive through attributes (item-selector, target, anchor, ...) are typed by
// people, so a typo must not throw out of attributeChangedCallback or an event handler.

let lastChecked: string | null = null;
let lastValid = true;

export function isValidSelector(selector: string): boolean {
  if (selector === lastChecked) return lastValid;

  let valid = true;
  try {
    document.createDocumentFragment().querySelector(selector);
  } catch {
    valid = false;
  }

  lastChecked = selector;
  lastValid = valid;
  return valid;
}

/** `root.querySelector(selector)` that yields null instead of throwing on an invalid selector. */
export function safeQuerySelector<T extends Element = Element>(root: ParentNode, selector: string): T | null {
  if (!selector || !isValidSelector(selector)) return null;
  return root.querySelector<T>(selector);
}
