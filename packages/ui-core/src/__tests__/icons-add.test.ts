import { describe, expect, it } from 'vitest';
import { checkIcon, chevronDownIcon } from '@editora/icons/glyphs';
import { renderIconSvg } from '@editora/icons';
import '../components/ui-icon';
import { getIcon, hasIcon, iconsLoaded } from '../icons';
import { addIcons } from '../add-icons';

// Runs in its own module state: the full set has not been loaded in this file.
describe('addIcons: icons by definition, without the full set', () => {
  it('renders registered icons at once, by name and alias, and never loads the set', async () => {
    addIcons(checkIcon, [chevronDownIcon]);
    expect(hasIcon('check')).toBe(true);
    expect(hasIcon('tick')).toBe(true);
    expect(hasIcon('chevron down')).toBe(true);

    document.body.innerHTML = '<ui-icon name="tick"></ui-icon><ui-icon name="chevron-down" variant="solid"></ui-icon>';
    const [tick, chevron] = Array.from(document.querySelectorAll('ui-icon'));
    expect(tick.shadowRoot!.querySelector('.glyph svg')).not.toBeNull();
    expect(chevron.shadowRoot!.querySelector('.glyph svg')).not.toBeNull();

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(iconsLoaded()).toBe(false);
  });

  it('draws the same svg the full set would', () => {
    addIcons(checkIcon);
    expect(getIcon('check', { variant: 'solid' })).toBe(renderIconSvg('check', { variant: 'solid', color: 'currentColor', decorative: true }));
  });
});
