/**
 * Shared helpers for plugin dialogs.
 */

/**
 * Stop a drag that merely *ends* on the backdrop from dismissing the dialog.
 *
 * When mousedown and mouseup land on different elements the browser dispatches
 * `click` on their closest common ancestor. Selecting text inside a dialog
 * input and releasing the pointer over the backdrop therefore produces a click
 * whose target is the overlay itself, which every "click the backdrop to close"
 * handler reads as an intentional dismissal - discarding whatever the user typed.
 *
 * Call this right after creating the overlay, before attaching any close
 * handlers. It registers a capture-phase listener that swallows only the
 * backdrop click that follows a press which began inside the dialog; genuine
 * backdrop clicks, clicks on dialog controls and programmatic `overlay.click()`
 * calls pass through untouched.
 */
function guardBackdropDrag(overlay: HTMLElement): void {
  let pressStartedInside = false;

  overlay.addEventListener(
    'pointerdown',
    (event) => {
      pressStartedInside = event.target !== overlay;
    },
    true,
  );

  overlay.addEventListener(
    'click',
    (event) => {
      if (event.target === overlay && pressStartedInside) {
        event.stopImmediatePropagation();
      }
      pressStartedInside = false;
    },
    true,
  );
}

const DIALOG_BASE_STYLE_ID = 'rte-dialog-base-styles';

/**
 * Dialogs are appended to <body>, outside `.rte-editor`, so they used to inherit the
 * host page's body font while their inputs and buttons used the browser default -
 * mixed serif/sans text, and never the editor's own typeface. Give every dialog the
 * editor's base font (falling back to the same system stack when the theme CSS isn't
 * loaded). Applied through an attribute selector because plugins later reassign the
 * overlay's className and style.cssText, which would wipe a class or inline style.
 */
function injectDialogBaseStyles(): void {
  if (typeof document === 'undefined' || document.getElementById(DIALOG_BASE_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = DIALOG_BASE_STYLE_ID;
  style.textContent = `
    [data-rte-dialog] {
      font-family: var(--rte-font-family-base, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
    }

    /* Form controls ignore inherited fonts (browsers default them to Arial /
       system-ui). :where() keeps this at zero specificity so any control a plugin
       styles explicitly - e.g. a monospace formula field - keeps its own font. */
    :where([data-rte-dialog]) :where(button, input, select, textarea) {
      font-family: inherit;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Call right after creating a dialog's overlay element, before attaching handlers:
 * applies the shared editor typography and stops backdrop-drag dismissals
 * (see guardBackdropDrag).
 */
export function initDialogOverlay(overlay: HTMLElement): void {
  overlay.setAttribute('data-rte-dialog', '');
  injectDialogBaseStyles();
  guardBackdropDrag(overlay);
  makeDialogAccessible(overlay);
}

const FOCUSABLE =
  'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

function isShown(element: HTMLElement, within: HTMLElement): boolean {
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    if (node.hidden || node.getAttribute('aria-hidden') === 'true') return false;
    const style = window.getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (node === within) break;
  }
  return true;
}

function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) =>
      !(element as HTMLButtonElement).disabled &&
      element.getAttribute('tabindex') !== '-1' &&
      isShown(element, root),
  );
}

/** What Tab visits: the focusable items, with a radio group counted once (its checked radio, else its first). */
function tabStops(root: HTMLElement): HTMLElement[] {
  const items = focusableIn(root);
  return items.filter((item) => {
    if (!(item instanceof HTMLInputElement) || item.type !== 'radio' || !item.name) return true;
    const group = items.filter(
      (other): other is HTMLInputElement => other instanceof HTMLInputElement && other.type === 'radio' && other.name === item.name,
    );
    const stop = group.find((radio) => radio.checked) ?? group[0];
    return item === stop;
  });
}

/** The corner "x" that closes a dialog is not where someone who has just opened it wants to start. */
function isCloseControl(element: HTMLElement): boolean {
  const label = `${element.getAttribute('aria-label') ?? ''} ${element.className?.toString() ?? ''}`.toLowerCase();
  const text = (element.textContent ?? '').trim();
  return /close|dismiss/.test(label) || /^[\u00d7\u2715\u2716x]$/i.test(text);
}

/**
 * Moves the focus into a side panel that has just opened (comments, spell check, approvals): onto its first control
 * that is not the close button, or onto the panel itself when it has none. A panel opened from the toolbar used to
 * leave the focus behind in the editor, so a keyboard user did not know it was there and had to tab to it.
 */
export function focusPanel(panel: HTMLElement | null): void {
  if (!panel || !panel.isConnected) return;
  const items = focusableIn(panel);
  const target = items.find((item) => !isCloseControl(item)) ?? items[0];
  if (target) {
    target.focus({ preventScroll: true });
    return;
  }
  panel.setAttribute('tabindex', '-1');
  panel.focus({ preventScroll: true });
}

const IDENTIFYING_ATTRIBUTES = ['id', 'data-action', 'data-comment-id', 'data-id', 'data-index', 'data-suggestion', 'data-value', 'name'];

/** A selector for "the same kind of control as this one": its tag, class and any attribute that identifies it. */
function sameKindSelector(element: HTMLElement): string {
  let selector = element.tagName.toLowerCase();
  const first = element.classList[0];
  if (first && /^[\w-]+$/.test(first)) selector += `.${first}`;
  for (const name of IDENTIFYING_ATTRIBUTES) {
    const value = element.getAttribute(name);
    if (value !== null && /^[\w:.-]*$/.test(value)) selector += `[${name}="${value}"]`;
  }
  return selector;
}

/**
 * Runs a function that rebuilds a panel's contents (`innerHTML = ...`) without losing the keyboard's place. The
 * element that had the focus is removed by the rebuild, which drops the focus on the page; this notes which control it
 * was and gives the focus to the same control in the new contents (the same one by position among controls of that
 * kind, or the first control if there are none left).
 */
export function keepPanelFocus(panel: HTMLElement | null, render: () => void): void {
  const active = panel && panelHasFocus(panel) ? (document.activeElement as HTMLElement) : null;
  let selector = '';
  let index = 0;
  if (panel && active && active !== panel) {
    selector = sameKindSelector(active);
    index = Array.from(panel.querySelectorAll(selector)).indexOf(active);
  }

  const panelItselfHadFocus = !!panel && document.activeElement === panel;

  render();

  if (!panel) return;
  // The panel took the focus itself because it had nothing to focus yet; now it has contents.
  if (panelItselfHadFocus) {
    focusPanel(panel);
    return;
  }
  if (!active) return;
  if (active.isConnected) return; // the rebuild left it alone
  // Only controls that are on show can take the focus (a collapsed section's buttons cannot).
  const same = selector ? Array.from(panel.querySelectorAll<HTMLElement>(selector)).filter((item) => isShown(item, panel)) : [];
  const target = same[Math.min(Math.max(index, 0), same.length - 1)];
  if (target) target.focus({ preventScroll: true });
  else focusPanel(panel);
}

let listSequence = 0;

/**
 * While a list of suggestions (mentions, slash commands) is open, the focus stays in the editor so typing goes on. A
 * screen reader then has no way to know which suggestion the arrow keys are on, so the editor says so itself:
 * `aria-activedescendant` points at the active option and `aria-controls` at the list. Call it with no list to clear
 * both when the suggestions close.
 */
export function announceActiveOption(editor: HTMLElement | null, list: HTMLElement | null, option: HTMLElement | null): void {
  if (!editor) return;
  if (!list || !option || !option.id) {
    editor.removeAttribute('aria-activedescendant');
    editor.removeAttribute('aria-controls');
    return;
  }
  if (!list.id) list.id = `rte-suggestions-${++listSequence}`;
  editor.setAttribute('aria-controls', list.id);
  editor.setAttribute('aria-activedescendant', option.id);
}

/** True when the focus is in the panel, or has just been lost from it (its focused element was removed). */
export function panelHasFocus(panel: HTMLElement | null): boolean {
  if (!panel) return false;
  const active = document.activeElement;
  return !!active && panel.contains(active);
}

/** The name a dialog shows in its heading, without the close button that sits inside the same bar. */
function headingText(dialog: HTMLElement): string {
  const heading = dialog.querySelector<HTMLElement>(
    'h1, h2, h3, h4, [class*="title"], [class*="header"], header, [role="heading"]',
  );
  if (!heading) return '';
  const copy = heading.cloneNode(true) as HTMLElement;
  copy.querySelectorAll('button, [role="button"], [aria-label*="lose"], [class*="close"]').forEach((node) => node.remove());
  return (copy.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * What every modal dialog needs for someone who cannot see it or cannot use a pointer, applied once to the shared
 * overlay so each plugin does not repeat it (and cannot forget it): a dialog role with a name taken from its
 * heading, focus moved into it, Tab kept inside it, and focus returned to where it was when the dialog closes.
 * Runs after the plugin has built and attached the dialog, so it works with whatever structure the plugin made;
 * anything the plugin already set (a role, a name, focus on its own field) is left as it is.
 */
function makeDialogAccessible(overlay: HTMLElement): void {
  const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  // Moving focus into the dialog moves the document's selection out of the text. Remember it, with the text it
  // belonged to, so that a dialog that is closed without changing anything gives the caret back.
  const selection = window.getSelection();
  const savedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
  const savedHost = savedRange
    ? (savedRange.commonAncestorContainer instanceof HTMLElement
        ? savedRange.commonAncestorContainer
        : savedRange.commonAncestorContainer.parentElement
      )?.closest<HTMLElement>('[contenteditable="true"]') ?? null
    : null;
  const savedHTML = savedHost ? savedHost.innerHTML : null;

  overlay.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || event.defaultPrevented) return;
    // Move the focus ourselves for every Tab, not only at the ends. Left to the browser, Tab would skip the
    // buttons in Safari (its default) and so slip out of the dialog from the last text field.
    const items = tabStops(overlay);
    if (items.length === 0) {
      event.preventDefault();
      return;
    }
    const index = items.indexOf(document.activeElement as HTMLElement);
    const step = event.shiftKey ? -1 : 1;
    const next =
      index === -1 ? (event.shiftKey ? items[items.length - 1] : items[0]) : items[(index + step + items.length) % items.length];
    event.preventDefault();
    next.focus();
  });

  let wasShown = false;
  const setUp = (attempt: number) => {
    if (!overlay.isConnected) {
      // The plugin has not attached it yet (or never will): look again once, then give up.
      if (attempt < 3) window.setTimeout(() => setUp(attempt + 1), 50);
      return;
    }

    wasShown = true;
    // The dialog is whatever carries the role already, else the box inside the backdrop, else the overlay itself.
    const hasDialogRole = (element: Element) => ['dialog', 'alertdialog'].includes(element.getAttribute('role') ?? '');
    const box: HTMLElement =
      (hasDialogRole(overlay) ? overlay : null) ??
      overlay.querySelector<HTMLElement>('[role="dialog"], [role="alertdialog"]') ??
      (overlay.firstElementChild instanceof HTMLElement ? overlay.firstElementChild : null) ??
      overlay;

    if (!box.getAttribute('role')) box.setAttribute('role', 'dialog');
    if (!box.hasAttribute('aria-modal')) box.setAttribute('aria-modal', 'true');

    const labelledBy = box.getAttribute('aria-labelledby');
    const hasName =
      !!box.getAttribute('aria-label') || (!!labelledBy && !!document.getElementById(labelledBy.split(/\s+/)[0]));
    if (!hasName) {
      const name = headingText(box);
      if (name) {
        box.removeAttribute('aria-labelledby');
        box.setAttribute('aria-label', name);
      }
    }

    // Focus: leave it if the plugin has already put it on one of its own fields.
    if (!overlay.contains(document.activeElement)) {
      const items = focusableIn(overlay);
      const target = items.find((item) => !isCloseControl(item)) ?? items[0];
      if (target) {
        target.focus({ preventScroll: true });
      } else {
        box.setAttribute('tabindex', '-1');
        box.focus({ preventScroll: true });
      }
    }
  };
  window.setTimeout(() => setUp(0), 0);

  // When the dialog goes, put focus back where it came from, unless the plugin has already put it somewhere.
  const watch = new MutationObserver(() => {
    if (overlay.isConnected) wasShown = true;
    if (overlay.isConnected || !wasShown) return;
    watch.disconnect();
    const active = document.activeElement;
    const lost = !active || active === document.body || overlay.contains(active);
    if (lost) {
      const target = savedHost?.isConnected ? savedHost : opener;
      if (target && target.isConnected) target.focus({ preventScroll: true });
    }

    // Closed without changing the text (Cancel, Escape): the caret goes back where it was. When the dialog
    // did change it (an insert), the plugin has placed the caret itself and that is left alone.
    if (savedRange && savedHost && savedHost.isConnected && savedHost.innerHTML === savedHTML && selection) {
      const now = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const same =
        !!now &&
        now.compareBoundaryPoints(Range.START_TO_START, savedRange) === 0 &&
        now.compareBoundaryPoints(Range.END_TO_END, savedRange) === 0;
      if (!same && savedHost.contains(savedRange.startContainer) && savedHost.contains(savedRange.endContainer)) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
      }
    }
  });
  watch.observe(document.body, { childList: true, subtree: true });
}
