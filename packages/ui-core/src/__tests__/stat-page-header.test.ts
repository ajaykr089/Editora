import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-stat';
import '../components/ui-page-header';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => {
  document.body.innerHTML = '';
});

const part = (el: Element, name: string) => el.shadowRoot!.querySelector<HTMLElement>(`[part~="${name}"]`)!;

describe('ui-stat', () => {
  it('shows label, value, trend and an icon from attributes, and hides empty rows', async () => {
    document.body.innerHTML = '<ui-stat label="Revenue" value="$17,950" trend="+8.1%" tone="success" icon="wallet"></ui-stat>';
    const el = document.querySelector('ui-stat')!;
    await tick();
    expect(part(el, 'label').textContent).toContain('Revenue');
    expect(part(el, 'value').textContent).toContain('$17,950');
    expect(part(el, 'trend').hidden).toBe(false);
    expect(part(el, 'meta').hidden).toBe(true);
    expect(part(el, 'description').hidden).toBe(true);
    expect(part(el, 'icon').hidden).toBe(false);
    expect(part(el, 'icon').getAttribute('aria-hidden')).toBe('true');
    expect(part(el, 'icon').querySelector('ui-icon')?.getAttribute('name')).toBe('wallet');
  });

  it('escapes attribute text', async () => {
    document.body.innerHTML = '<ui-stat label="&lt;b&gt;x&lt;/b&gt;" value="1"></ui-stat>';
    const el = document.querySelector('ui-stat')!;
    await tick();
    expect(part(el, 'label').querySelector('b')).toBeNull();
    expect(part(el, 'label').textContent).toContain('<b>x</b>');
  });

  it('takes rich content from slots, and shows a row when its slot fills later', async () => {
    document.body.innerHTML = '<ui-stat label="Orders"><strong slot="value">66</strong></ui-stat>';
    const el = document.querySelector('ui-stat')!;
    await tick();
    expect(part(el, 'meta').hidden).toBe(true);
    const meta = document.createElement('span');
    meta.slot = 'meta';
    meta.textContent = 'vs May';
    el.appendChild(meta);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(part(el, 'meta').hidden).toBe(false);
  });

  it('ui-metric-card is a ui-stat in a card', async () => {
    document.body.innerHTML = '<ui-metric-card label="Orders" value="66"></ui-metric-card>';
    const el = document.querySelector('ui-metric-card')!;
    await tick();
    expect(el.getAttribute('variant')).toBe('card');
    const css = el.shadowRoot!.querySelector('style')!.textContent!;
    expect(css).toContain(':host([variant="card"]) .stat');
  });
});

describe('ui-page-header', () => {
  it('renders the title as a heading (h1 by default, heading-level to change it)', async () => {
    document.body.innerHTML = '<ui-page-header heading="Orders" subtitle="Every order." eyebrow="Store"></ui-page-header>';
    const el = document.querySelector('ui-page-header')!;
    await tick();
    expect(el.shadowRoot!.querySelector('h1')?.textContent).toContain('Orders');
    expect(part(el, 'subtitle').hidden).toBe(false);
    expect(part(el, 'status').hidden).toBe(true);
    expect(part(el, 'actions').hidden).toBe(true);

    el.setAttribute('heading-level', '2');
    await tick();
    expect(el.shadowRoot!.querySelector('h1')).toBeNull();
    expect(el.shadowRoot!.querySelector('h2')?.textContent).toContain('Orders');
  });

  it('shows a status chip and a named group of actions', async () => {
    document.body.innerHTML = `<ui-page-header heading="Orders" status="Live" status-tone="success">
      <button slot="actions">Export</button></ui-page-header>`;
    const el = document.querySelector('ui-page-header')!;
    await tick();
    const badge = part(el, 'status').querySelector('ui-badge')!;
    expect(badge.getAttribute('tone')).toBe('success');
    expect(badge.textContent).toBe('Live');
    const actions = part(el, 'actions');
    expect(actions.hidden).toBe(false);
    expect(actions.getAttribute('role')).toBe('group');
    expect(actions.getAttribute('aria-label')).toBe('Page actions');
  });

  it('puts unslotted children below the header', async () => {
    document.body.innerHTML = '<ui-page-header heading="Orders"><p>Filters go here</p></ui-page-header>';
    const el = document.querySelector('ui-page-header')!;
    await tick();
    expect(part(el, 'body').hidden).toBe(false);
  });
});
