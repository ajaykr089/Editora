// A menu/dropdown trigger is the element in `slot="trigger"`, which is very often a plain wrapper
// (the React wrapper renders a <div slot="trigger">) around the real button. aria-expanded and
// aria-haspopup are not allowed on a generic element, so the state belongs on the control inside.

const INTERACTIVE = 'button, a[href], input, select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"]), ui-button';

export function resolveTriggerControl(trigger: HTMLElement): HTMLElement {
  if (trigger.matches(INTERACTIVE)) return trigger;
  const inner = trigger.querySelector<HTMLElement>(INTERACTIVE);
  if (inner) return inner;
  // Nothing interactive inside: make the wrapper itself a button rather than leave it generic.
  if (!trigger.hasAttribute('role')) trigger.setAttribute('role', 'button');
  if (!trigger.hasAttribute('tabindex')) trigger.setAttribute('tabindex', '0');
  return trigger;
}
