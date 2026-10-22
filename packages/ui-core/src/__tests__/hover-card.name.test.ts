import { describe, expect, it } from 'vitest';
import '../components/ui-hover-card';

const nameOf = async (html: string) => {
  document.body.innerHTML = html;
  const el = document.querySelector('ui-hover-card') as HTMLElement;
  await Promise.resolve();
  return el.shadowRoot!.querySelector('.panel')!.getAttribute('aria-label');
};

describe('ui-hover-card panel name', () => {
  it('uses the author label, then the trigger text, then the card heading, then a fallback', async () => {
    expect(await nameOf('<ui-hover-card aria-label="Profile preview"><a slot="trigger">Ava</a><div slot="card">x</div></ui-hover-card>')).toBe('Profile preview');
    expect(await nameOf('<ui-hover-card><a slot="trigger">Ava Johnson</a><div slot="card">x</div></ui-hover-card>')).toBe('Ava Johnson');
    expect(await nameOf('<ui-hover-card><span slot="trigger"></span><div slot="card"><h3>Release notes</h3></div></ui-hover-card>')).toBe('Release notes');
    expect(await nameOf('<ui-hover-card><span slot="trigger"></span><div slot="card">x</div></ui-hover-card>')).toBe('Details');
  });
});
