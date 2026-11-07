import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-toggle-group';
import '../components/ui-toggle';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => { document.body.innerHTML = ''; });

describe('ui-toggle-group track variants', () => {
  it('marks toggles inside a soft or contrast track, and unmarks them otherwise', async () => {
    document.body.innerHTML = '<ui-toggle-group variant="soft" value="b"><ui-toggle value="a">A</ui-toggle><ui-toggle value="b">B</ui-toggle></ui-toggle-group>';
    const group = document.querySelector('ui-toggle-group')!;
    await tick();
    const toggles = Array.from(group.querySelectorAll('ui-toggle'));
    expect(toggles.every((toggle) => toggle.hasAttribute('data-in-track'))).toBe(true);

    group.setAttribute('variant', 'minimal');
    await tick();
    expect(toggles.some((toggle) => toggle.hasAttribute('data-in-track'))).toBe(false);

    group.setAttribute('variant', 'contrast');
    await tick();
    expect(toggles.every((toggle) => toggle.hasAttribute('data-in-track'))).toBe(true);
  });

  it('pads the track and drops the frame of unpressed toggles inside it', async () => {
    document.body.innerHTML = '<ui-toggle-group variant="soft"><ui-toggle value="a">A</ui-toggle></ui-toggle-group>';
    await tick();
    const groupCss = document.querySelector('ui-toggle-group')!.shadowRoot!.querySelector('style')!.textContent!;
    expect(groupCss).toMatch(/:host\(\[variant="soft"\]\),\s*:host\(\[variant="contrast"\]\) \{\s*--ui-toggle-group-padding: 3px;/);
    const toggleCss = document.querySelector('ui-toggle')!.shadowRoot!.querySelector('style')!.textContent!;
    expect(toggleCss).toMatch(/:host\(\[data-in-track\]\[data-in-track\]:not\(\[pressed\]\)\) \{\s*--ui-toggle-border: transparent;/);
    expect(toggleCss).toMatch(/--ui-toggle-radius: max\(2px, calc\(var\(--ui-toggle-group-radius, 6px\) - 3px\)\)/);
  });
});
