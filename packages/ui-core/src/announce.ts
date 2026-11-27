/**
 * Screen-reader announcements.
 *
 *   import { announce } from '@editora/ui-core';
 *   announce('3 results');                              polite: after the current speech
 *   announce('Connection lost', { politeness: 'assertive' });
 *
 * Messages go to two visually hidden live regions (one polite, one assertive) in the light DOM
 * of document.body, created on first use and shared by everything on the page; live regions inside
 * shadow roots are not announced by every screen reader. A region has to exist before its text
 * changes to be announced, so the first message waits a moment after the region is created; the
 * same message twice in a row is announced twice.
 *
 * While a modal <dialog> is open the rest of the page is inert and some screen readers ignore live
 * regions outside it: pass the dialog as `within` and the message goes to regions inside it.
 */
export type AnnouncePoliteness = 'polite' | 'assertive';

export type AnnounceOptions = {
  politeness?: AnnouncePoliteness;
  /** Remove the text again after this many ms (default 7000), so it is not read when browsing. */
  clearAfter?: number;
  /** Announce inside this element (an open modal) instead of document.body. */
  within?: Element | null;
};

const REGION_ATTR = 'data-editora-announcer';
const VISUALLY_HIDDEN = [
  'position:absolute', 'width:1px', 'height:1px', 'margin:-1px', 'padding:0', 'overflow:hidden',
  'clip:rect(0 0 0 0)', 'clip-path:inset(50%)', 'white-space:nowrap', 'border:0',
].join(';');

type RegionState = { el: HTMLElement; timer: ReturnType<typeof setTimeout> | null; fresh: boolean };
const regions = new WeakMap<Element, Partial<Record<AnnouncePoliteness, RegionState>>>();

function regionFor(host: Element, politeness: AnnouncePoliteness): RegionState {
  let byPoliteness = regions.get(host);
  if (!byPoliteness) {
    byPoliteness = {};
    regions.set(host, byPoliteness);
  }
  const existing = byPoliteness[politeness];
  if (existing && existing.el.isConnected && existing.el.parentElement === host) return existing;

  const doc = host.ownerDocument;
  const el = doc.createElement('div');
  el.setAttribute(REGION_ATTR, politeness);
  el.setAttribute('aria-live', politeness);
  el.setAttribute('aria-atomic', 'true');
  // role=alert/status give older screen readers (and JAWS) the same politeness as aria-live.
  el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  el.setAttribute('style', VISUALLY_HIDDEN);
  host.appendChild(el);
  const state: RegionState = { el, timer: null, fresh: true };
  byPoliteness[politeness] = state;
  return state;
}

export function announce(message: string, options: AnnounceOptions = {}): void {
  if (typeof document === 'undefined') return;
  const text = String(message ?? '').trim();
  if (!text) return;
  const politeness: AnnouncePoliteness = options.politeness === 'assertive' ? 'assertive' : 'polite';
  const host = options.within && options.within.isConnected ? options.within : document.body;
  if (!host) return;
  const region = regionFor(host, politeness);

  if (region.timer) clearTimeout(region.timer);
  // Empty first, then write in a later task: a change is what gets announced, and a brand-new
  // region needs a moment to be noticed by the accessibility tree.
  region.el.textContent = '';
  const delay = region.fresh ? 150 : 50;
  region.fresh = false;
  region.timer = setTimeout(() => {
    region.el.textContent = text;
    const clearAfter = options.clearAfter ?? 7000;
    region.timer = clearAfter > 0
      ? setTimeout(() => {
        region.el.textContent = '';
        region.timer = null;
      }, clearAfter)
      : null;
  }, delay);
}

/** Empties the page's announcement regions (for example when the view they described is gone). */
export function clearAnnouncements(within?: Element | null): void {
  if (typeof document === 'undefined') return;
  const host = within || document.body;
  const byPoliteness = host ? regions.get(host) : undefined;
  if (!byPoliteness) return;
  for (const state of Object.values(byPoliteness)) {
    if (!state) continue;
    if (state.timer) clearTimeout(state.timer);
    state.timer = null;
    state.el.textContent = '';
  }
}
