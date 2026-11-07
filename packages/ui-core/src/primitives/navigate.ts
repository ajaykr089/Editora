/**
 * One link contract for every component that renders links (Sidebar, Breadcrumb, Tabs, Pagination).
 *
 * Before the browser follows a link the element dispatches a cancelable `navigate` event:
 *   detail: { href, ...component-specific fields }
 * Calling `preventDefault()` keeps the page so the app's router can handle `href`
 * (React: `onNavigate`, or one `<NavigationProvider navigate={…}>` for the whole app). Setting
 * `navigation="client"` on the element always keeps the page. Clicks that open a new tab or window
 * (a modifier key, the middle button, a `target` other than `_self`) are left to the browser and
 * dispatch nothing.
 */

export type NavigateDetail = { href: string } & Record<string, unknown>;

function opensElsewhere(event: Event | null | undefined, target: string): boolean {
  if (target && target !== '_self') return true;
  if (!event || !('button' in event)) return false;
  const mouse = event as MouseEvent;
  return mouse.metaKey || mouse.ctrlKey || mouse.shiftKey || mouse.altKey || (mouse.button ?? 0) !== 0;
}

/**
 * Dispatches `navigate` for a link activation. Returns true when the page should be kept (the
 * listener prevented it, or the element is `navigation="client"`); the caller then prevents the
 * native navigation (`originalEvent.preventDefault()` for an <a>, or simply does not navigate).
 * Returns false, without dispatching, for clicks that open a new tab or window.
 */
export function requestNavigate(
  host: HTMLElement,
  detail: NavigateDetail,
  originalEvent?: Event | null,
  linkTarget = ''
): boolean {
  if (!detail.href || opensElsewhere(originalEvent, linkTarget.trim())) return false;
  const event = new CustomEvent('navigate', { detail, bubbles: true, composed: true, cancelable: true });
  const allowed = host.dispatchEvent(event);
  return !allowed || host.getAttribute('navigation') === 'client';
}

/**
 * For components whose links are not <a> elements (tab buttons): ask, and follow the link with
 * a full navigation only if nothing kept the page.
 */
export function navigateTo(host: HTMLElement, detail: NavigateDetail): void {
  if (requestNavigate(host, detail)) return;
  if (typeof window !== 'undefined') window.location.assign(detail.href);
}
