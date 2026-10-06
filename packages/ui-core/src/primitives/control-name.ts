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

const SR_ONLY_STYLE =
  'position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0';

/**
 * What the host was described with from outside its shadow root: its own `aria-description` plus the text
 * of any `aria-describedby` ids that resolve where the host lives. A `ui-field` supplies its description
 * and error this way; its own ids sit in another shadow root and could never be followed.
 */
export function externalDescriptionText(host: HTMLElement): string {
  const parts: string[] = [];
  const root = host.getRootNode() as Document | ShadowRoot;
  for (const id of (host.getAttribute('aria-describedby') || '').split(/\s+/)) {
    const text = id ? root.getElementById?.(id)?.textContent?.replace(/\s+/g, ' ').trim() : '';
    if (text) parts.push(text);
  }
  const own = (host.getAttribute('aria-description') || '').replace(/\s+/g, ' ').trim();
  if (own) parts.push(own);
  return parts.join(' ');
}

/**
 * Keeps one visually hidden element, next to `anchor`, holding the host's external description, and
 * returns its id (or null when there is nothing to say) so a control in the same shadow root can point
 * an aria-describedby at it.
 */
export function syncExternalDescription(anchor: HTMLElement | null | undefined, host: HTMLElement, uid: string): string | null {
  if (!anchor) return null;

  const id = `${uid}-external-description`;
  const root = anchor.getRootNode() as ShadowRoot | Document;
  let node = (root.getElementById?.(id) ?? null) as HTMLElement | null;
  const text = externalDescriptionText(host);

  if (!text) {
    node?.remove();
    return null;
  }

  if (!node) {
    node = document.createElement('span');
    node.id = id;
    node.setAttribute('style', SR_ONLY_STYLE);
    (anchor.parentNode ?? root).appendChild(node);
  }
  if (node.textContent !== text) node.textContent = text;
  return id;
}

/**
 * Sets `aria-describedby` on a control inside a shadow root: the ids of descriptions that live in that
 * same root (`ownIds`), plus the host's external description (see `syncExternalDescription`).
 */
export function syncControlDescription(
  control: HTMLElement | null | undefined,
  host: HTMLElement,
  uid: string,
  ownIds: string[] = []
): void {
  if (!control) return;

  const ids = [...ownIds];
  const externalId = syncExternalDescription(control, host, uid);
  if (externalId) ids.push(externalId);

  if (ids.length) control.setAttribute('aria-describedby', ids.join(' '));
  else control.removeAttribute('aria-describedby');
}

/** The same hidden description as markup, for components that render their shadow root from a template. */
export function externalDescriptionMarkup(host: HTMLElement, uid: string): { id: string; html: string } {
  const text = externalDescriptionText(host);
  if (!text) return { id: '', html: '' };
  const id = `${uid}-external-description`;
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return { id, html: `<span id="${id}" style="${SR_ONLY_STYLE}">${escaped}</span>` };
}
