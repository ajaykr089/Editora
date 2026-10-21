import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-dialog';
import '../components/ui-alert-dialog';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('headless dialogs stay in the page flow', () => {
  const originalMatches = Element.prototype.matches;
  const showPopover = vi.fn();

  beforeEach(() => {
    showPopover.mockClear();
    Object.defineProperty(HTMLElement.prototype, 'showPopover', { value: showPopover, configurable: true, writable: true });
    // jsdom does not know the :popover-open pseudo-class
    Element.prototype.matches = function (selector: string) {
      return selector === ':popover-open' ? false : originalMatches.call(this, selector);
    };
    document.body.innerHTML = '';
  });

  afterEach(() => {
    Element.prototype.matches = originalMatches;
    delete (HTMLElement.prototype as { showPopover?: unknown }).showPopover;
  });

  it.each(['ui-dialog', 'ui-alert-dialog'])('%s goes to the top layer normally and not when headless', async (tag) => {
    document.body.innerHTML = `<${tag} open></${tag}>`;
    await tick();
    await tick();
    expect(showPopover).toHaveBeenCalled();

    showPopover.mockClear();
    document.body.innerHTML = `<${tag} open headless></${tag}>`;
    await tick();
    await tick();
    expect(showPopover).not.toHaveBeenCalled();
  });
});
