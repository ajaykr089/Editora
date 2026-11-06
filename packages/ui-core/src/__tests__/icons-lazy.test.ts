import { describe, expect, it } from 'vitest';
import '../components/ui-icon';
import { loadIcons, iconsLoaded } from '../icons';

describe('built-in icons load on demand', () => {
  it('renders an empty glyph (no fallback letter) until the set arrives, then the svg', async () => {
    document.body.innerHTML = '<ui-icon name="search"></ui-icon>';
    const icon = document.querySelector('ui-icon')!;
    const glyph = () => icon.shadowRoot!.querySelector('.glyph')!;
    if (!iconsLoaded()) {
      expect(glyph().querySelector('svg')).toBeNull();
      expect(glyph().querySelector('.fallback')).toBeNull();
    }
    await loadIcons();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(glyph().querySelector('svg')).not.toBeNull();
  });

  it('still shows the fallback letter for a name that does not exist, once loaded', async () => {
    await loadIcons();
    document.body.innerHTML = '<ui-icon name="definitely-not-an-icon"></ui-icon>';
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.querySelector('ui-icon')!.shadowRoot!.querySelector('.fallback')?.textContent).toBe('D');
  });
});
