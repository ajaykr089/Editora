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
}
