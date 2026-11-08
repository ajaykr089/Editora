/**
 * A surface rendered at the end of `document.body` (a portal) inherits CSS variables from the
 * body, not from where its component sits. A theme set on a wrapper would not reach it: the panel
 * came out in the page's default colours.
 *
 * `copyThemeToPortal` writes onto the portal every custom property the component inherits from
 * its surroundings that differs from the page root's (a wrapper's theme), already resolved. The
 * component's own tokens are left to the component, whose portal styles may vary them by variant.
 * Call it each time the portal opens.
 */
export function copyThemeToPortal(host: Element, portal: HTMLElement): void {
  if (typeof getComputedStyle !== 'function' || typeof document === 'undefined') return;
  const context = host.parentElement || ((host.getRootNode() as ShadowRoot).host as Element | undefined) || host;
  const own = getComputedStyle(context);
  const page = getComputedStyle(document.documentElement);
  const previous = (portal as HTMLElement & { __uiPortalVars?: string[] }).__uiPortalVars || [];
  const copied: string[] = [];
  for (let index = 0; index < own.length; index += 1) {
    const name = own[index];
    if (!name || !name.startsWith('--')) continue;
    const value = own.getPropertyValue(name).trim();
    if (!value || value === page.getPropertyValue(name).trim()) continue;
    portal.style.setProperty(name, value);
    copied.push(name);
  }
  // A variable the component no longer differs on goes back to inheriting.
  previous.forEach((name) => {
    if (!copied.includes(name)) portal.style.removeProperty(name);
  });
  (portal as HTMLElement & { __uiPortalVars?: string[] }).__uiPortalVars = copied;
}
