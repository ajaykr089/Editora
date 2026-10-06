// Naming a control that lives inside a component's shadow root.
//
// The visible label is referenced by id (label and control share the shadow root, so the reference
// resolves). Without one, the host's own aria-label is copied onto the inner control: an aria-label
// on a custom element that has no role is invisible to assistive technology, and nothing outside
// the shadow root can reference the inner control by id. `fallbackName` (a placeholder, say) is used
// last, so a control is never exposed with no name at all.

export function syncControlName(
  control: HTMLElement | null | undefined,
  host: HTMLElement,
  labelId: string | null,
  fallbackName = ''
): void {
  if (!control) return;

  if (labelId) {
    control.setAttribute('aria-labelledby', labelId);
    control.removeAttribute('aria-label');
    return;
  }

  control.removeAttribute('aria-labelledby');
  const name = (host.getAttribute('aria-label') || '').trim() || fallbackName.trim();
  if (name) control.setAttribute('aria-label', name);
  else control.removeAttribute('aria-label');
}

/**
 * Keeps the text of an `<slot>`'s fallback content in step with an attribute. Fallback text written
 * only at first render goes stale when a framework sets the attribute after the element connects
 * (React does), leaving an empty label or description.
 */
export function syncSlotFallbackText(slot: HTMLSlotElement | null | undefined, text: string): void {
  if (!slot) return;
  if (slot.assignedNodes().length > 0) return;
  if (slot.textContent !== text) slot.textContent = text;
}
