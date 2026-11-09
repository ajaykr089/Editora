import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-card';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => { document.body.innerHTML = ''; });

describe('ui-card without a header', () => {
  it('marks whether it has a header or media, which pads the top of the body when it has neither', async () => {
    document.body.innerHTML = '<ui-card id="plain"><p>Body only</p></ui-card><ui-card id="titled"><div slot="header">Title</div><p>Body</p></ui-card>';
    await tick();
    const frame = (id: string) => document.getElementById(id)!.shadowRoot!.querySelector('.card')!;
    expect(frame('plain').getAttribute('data-has-header')).toBe('false');
    expect(frame('plain').getAttribute('data-has-media')).toBe('false');
    expect(frame('titled').getAttribute('data-has-header')).toBe('true');
    const css = document.getElementById('plain')!.shadowRoot!.querySelector('style')!.textContent!;
    expect(css).toMatch(/\.card\[data-has-header="false"\]\[data-has-media="false"\] \.body \{\s*padding-top: var\(--ui-card-padding\);/);
  });
});
