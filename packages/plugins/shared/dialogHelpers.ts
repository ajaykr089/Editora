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
export function guardBackdropDrag(overlay: HTMLElement): void {
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
