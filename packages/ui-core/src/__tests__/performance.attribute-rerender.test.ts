import { describe, it, expect } from 'vitest';
import '../components/ui-command-palette';
import '../components/ui-floating-toolbar';
import '../components/ui-tabs';
import '../components/ui-stepper';
import '../components/ui-wizard';
import '../components/ui-quick-actions';
import '../components/ui-dropdown';
import '../components/ui-context-menu';
import '../components/ui-menu';
import '../components/ui-menubar';
import '../components/ui-popover';
import '../components/ui-hover-card';
import '../components/ui-form';
import '../components/ui-input';
import '../components/ui-select';
import '../components/ui-textarea';
import '../components/ui-radio-group';
import '../components/ui-slider';
import '../components/ui-scroll-area';
import '../components/ui-portal';
import '../components/ui-presence';
import '../components/ui-table';
import '../components/ui-data-table';

function flushMicrotask() {
  return Promise.resolve();
}

describe('performance: non-template attribute updates should not rebuild shadow DOM', () => {
  it('ui-command-palette keeps panel node stable across open/close', async () => {
    const el = document.createElement('ui-command-palette') as HTMLElement;
    el.innerHTML = `<button slot="command">Open patients</button>`;
    document.body.appendChild(el);
    await flushMicrotask();

    const panelBefore = el.shadowRoot?.querySelector('.panel');
    expect(panelBefore).toBeTruthy();

    el.setAttribute('open', '');
    el.removeAttribute('open');
    el.setAttribute('open', '');
    await flushMicrotask();

    const panelAfter = el.shadowRoot?.querySelector('.panel');
    expect(panelAfter).toBe(panelBefore);
    el.remove();
  });

  it('ui-floating-toolbar keeps panel node stable across anchor/open updates', async () => {
    const anchor = document.createElement('button');
    anchor.id = 'perf-anchor';
    document.body.appendChild(anchor);

    const el = document.createElement('ui-floating-toolbar') as HTMLElement;
    el.innerHTML = `<button slot="toolbar">Action</button>`;
    document.body.appendChild(el);
    await flushMicrotask();

    const panelBefore = el.shadowRoot?.querySelector('.panel');
    expect(panelBefore).toBeTruthy();

    el.setAttribute('anchor-id', 'perf-anchor');
    el.setAttribute('open', '');
    el.removeAttribute('open');
    el.setAttribute('open', '');
    await flushMicrotask();

    const panelAfter = el.shadowRoot?.querySelector('.panel');
    expect(panelAfter).toBe(panelBefore);

    el.remove();
    anchor.remove();
  });

  it('ui-tabs keeps shell node stable while selected/value changes', async () => {
    const el = document.createElement('ui-tabs') as HTMLElement;
    el.innerHTML = `
      <button slot="tab" data-value="a">General</button>
      <button slot="tab" data-value="b">Security</button>
      <div slot="panel">Panel A</div>
      <div slot="panel">Panel B</div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const shellBefore = el.shadowRoot?.querySelector('.shell');
    expect(shellBefore).toBeTruthy();

    el.setAttribute('selected', '1');
    el.setAttribute('value', 'a');
    await flushMicrotask();

    const shellAfter = el.shadowRoot?.querySelector('.shell');
    expect(shellAfter).toBe(shellBefore);
    el.remove();
  });

  it('ui-stepper keeps frame node stable while value changes', async () => {
    const el = document.createElement('ui-stepper') as HTMLElement;
    el.setAttribute(
      'steps',
      JSON.stringify([
        { value: 'info', label: 'Info' },
        { value: 'billing', label: 'Billing' },
        { value: 'review', label: 'Review' }
      ])
    );
    el.setAttribute('value', 'info');
    document.body.appendChild(el);
    await flushMicrotask();

    const frameBefore = el.shadowRoot?.querySelector('.frame');
    expect(frameBefore).toBeTruthy();

    el.setAttribute('value', 'billing');
    el.setAttribute('value', 'review');
    await flushMicrotask();

    const frameAfter = el.shadowRoot?.querySelector('.frame');
    expect(frameAfter).toBe(frameBefore);
    el.remove();
  });

  it('ui-wizard keeps frame node stable while value changes', async () => {
    const el = document.createElement('ui-wizard') as HTMLElement;
    el.innerHTML = `
      <section slot="step" data-value="1" data-title="First">A</section>
      <section slot="step" data-value="2" data-title="Second">B</section>
      <section slot="step" data-value="3" data-title="Third">C</section>
    `;
    el.setAttribute('value', '1');
    document.body.appendChild(el);
    await flushMicrotask();

    const frameBefore = el.shadowRoot?.querySelector('.frame');
    expect(frameBefore).toBeTruthy();

    el.setAttribute('value', '2');
    el.setAttribute('value', '3');
    await flushMicrotask();

    const frameAfter = el.shadowRoot?.querySelector('.frame');
    expect(frameAfter).toBe(frameBefore);
    el.remove();
  });

  it('ui-quick-actions keeps root node stable while open toggles', async () => {
    const el = document.createElement('ui-quick-actions') as HTMLElement;
    el.innerHTML = `
      <button slot="action">A</button>
      <button slot="action">B</button>
    `;
    el.setAttribute('collapsible', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const rootBefore = el.shadowRoot?.querySelector('.root');
    expect(rootBefore).toBeTruthy();

    el.setAttribute('open', '');
    el.removeAttribute('open');
    el.setAttribute('open', '');
    await flushMicrotask();

    const rootAfter = el.shadowRoot?.querySelector('.root');
    expect(rootAfter).toBe(rootBefore);
    el.remove();
  });

  it('ui-dropdown keeps trigger shell stable across open and visual attribute updates', async () => {
    const el = document.createElement('ui-dropdown') as HTMLElement;
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button class="item">One</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const triggerBefore = el.shadowRoot?.querySelector('.trigger');
    expect(triggerBefore).toBeTruthy();

    el.setAttribute('open', '');
    el.setAttribute('variant', 'contrast');
    el.setAttribute('density', 'compact');
    await flushMicrotask();

    const triggerAfter = el.shadowRoot?.querySelector('.trigger');
    expect(triggerAfter).toBe(triggerBefore);
    el.remove();
  });

  it('ui-dropdown keeps portal node stable across visual attribute updates', async () => {
    const el = document.createElement('ui-dropdown') as HTMLElement & { _portalEl?: HTMLElement | null };
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button class="item">One</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.setAttribute('open', '');
    await flushMicrotask();
    const portalBefore = el._portalEl;
    expect(portalBefore).toBeTruthy();

    el.setAttribute('variant', 'contrast');
    el.setAttribute('density', 'comfortable');
    el.setAttribute('shape', 'soft');
    await flushMicrotask();

    const portalAfter = el._portalEl;
    expect(portalAfter).toBe(portalBefore);
    el.remove();
  });

  it('ui-context-menu keeps surface node stable across open and visual attribute updates', async () => {
    const el = document.createElement('ui-context-menu') as HTMLElement;
    el.innerHTML = `<div slot="content"><button class="menuitem">Open chart</button></div>`;
    document.body.appendChild(el);
    await flushMicrotask();

    const surfaceBefore = el.shadowRoot?.querySelector('.surface');
    expect(surfaceBefore).toBeTruthy();

    el.setAttribute('open', '');
    el.setAttribute('variant', 'contrast');
    el.setAttribute('density', 'comfortable');
    await flushMicrotask();

    const surfaceAfter = el.shadowRoot?.querySelector('.surface');
    expect(surfaceAfter).toBe(surfaceBefore);
    el.remove();
  });

  it('ui-menu keeps trigger shell stable across open and visual attribute updates', async () => {
    const el = document.createElement('ui-menu') as HTMLElement;
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button class="item">Export</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const triggerBefore = el.shadowRoot?.querySelector('.trigger');
    expect(triggerBefore).toBeTruthy();

    el.setAttribute('open', '');
    el.setAttribute('variant', 'contrast');
    el.setAttribute('density', 'comfortable');
    await flushMicrotask();

    const triggerAfter = el.shadowRoot?.querySelector('.trigger');
    expect(triggerAfter).toBe(triggerBefore);
    el.remove();
  });

  it('ui-menu keeps portal node stable across visual attribute updates', async () => {
    const el = document.createElement('ui-menu') as HTMLElement & { _portalEl?: HTMLElement | null };
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button class="item">Export</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.setAttribute('open', '');
    await flushMicrotask();
    const portalBefore = el._portalEl;
    expect(portalBefore).toBeTruthy();

    el.setAttribute('variant', 'contrast');
    el.setAttribute('density', 'comfortable');
    el.setAttribute('shape', 'square');
    await flushMicrotask();

    const portalAfter = el._portalEl;
    expect(portalAfter).toBe(portalBefore);
    el.remove();
  });

  it('ui-menubar keeps bar node stable across selected/open and visual attribute updates', async () => {
    const el = document.createElement('ui-menubar') as HTMLElement;
    el.innerHTML = `
      <button slot="item">File</button>
      <button slot="item">Edit</button>
      <div slot="content"><button class="item">New</button></div>
      <div slot="content"><button class="item">Undo</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const barBefore = el.shadowRoot?.querySelector('.bar');
    expect(barBefore).toBeTruthy();

    el.setAttribute('open', '');
    el.setAttribute('selected', '1');
    el.setAttribute('variant', 'contrast');
    await flushMicrotask();

    const barAfter = el.shadowRoot?.querySelector('.bar');
    expect(barAfter).toBe(barBefore);
    el.remove();
  });

  it('ui-popover keeps trigger slot stable across open toggles', async () => {
    const el = document.createElement('ui-popover') as HTMLElement;
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content">Popover body</div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const slotBefore = el.shadowRoot?.querySelector('slot[name="trigger"]');
    expect(slotBefore).toBeTruthy();

    el.setAttribute('open', '');
    el.removeAttribute('open');
    el.setAttribute('open', '');
    await flushMicrotask();

    const slotAfter = el.shadowRoot?.querySelector('slot[name="trigger"]');
    expect(slotAfter).toBe(slotBefore);
    el.remove();
  });

  it('ui-hover-card keeps panel node stable across open and placement updates', async () => {
    const el = document.createElement('ui-hover-card') as HTMLElement;
    el.innerHTML = `
      <button slot="trigger">Hover</button>
      <div slot="card">Card content</div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const panelBefore = el.shadowRoot?.querySelector('.panel');
    expect(panelBefore).toBeTruthy();

    el.setAttribute('open', '');
    el.setAttribute('placement', 'right');
    el.setAttribute('density', 'compact');
    await flushMicrotask();

    const panelAfter = el.shadowRoot?.querySelector('.panel');
    expect(panelAfter).toBe(panelBefore);
    el.remove();
  });

  it('ui-form keeps form node stable across loading/gap updates', async () => {
    const el = document.createElement('ui-form') as HTMLElement;
    el.innerHTML = `<input name="name" value="demo" />`;
    document.body.appendChild(el);
    await flushMicrotask();

    const formBefore = el.shadowRoot?.querySelector('.form');
    expect(formBefore).toBeTruthy();

    el.setAttribute('loading', '');
    el.setAttribute('gap', '20px');
    el.removeAttribute('loading');
    await flushMicrotask();

    const formAfter = el.shadowRoot?.querySelector('.form');
    expect(formAfter).toBe(formBefore);
    el.remove();
  });

  it('ui-input keeps shell node stable across value/control attribute updates', async () => {
    const el = document.createElement('ui-input') as HTMLElement;
    el.setAttribute('value', 'alpha');
    el.setAttribute('clearable', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const shellBefore = el.shadowRoot?.querySelector('.shell');
    expect(shellBefore).toBeTruthy();

    el.setAttribute('value', 'beta');
    el.setAttribute('placeholder', 'Search');
    el.setAttribute('disabled', '');
    await flushMicrotask();

    const shellAfter = el.shadowRoot?.querySelector('.shell');
    expect(shellAfter).toBe(shellBefore);
    el.remove();
  });

  it('ui-select keeps control node stable across value/control attribute updates', async () => {
    const el = document.createElement('ui-select') as HTMLElement;
    el.innerHTML = `
      <option value="one">One</option>
      <option value="two">Two</option>
    `;
    el.setAttribute('value', 'one');
    document.body.appendChild(el);
    await flushMicrotask();

    const controlBefore = el.shadowRoot?.querySelector('.control');
    expect(controlBefore).toBeTruthy();

    el.setAttribute('value', 'two');
    el.setAttribute('disabled', '');
    el.setAttribute('validation', 'error');
    await flushMicrotask();

    const controlAfter = el.shadowRoot?.querySelector('.control');
    expect(controlAfter).toBe(controlBefore);
    el.remove();
  });

  it('ui-textarea keeps shell node stable across value/control attribute updates', async () => {
    const el = document.createElement('ui-textarea') as HTMLElement;
    el.setAttribute('value', 'notes');
    el.setAttribute('clearable', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const shellBefore = el.shadowRoot?.querySelector('.shell');
    expect(shellBefore).toBeTruthy();

    el.setAttribute('value', 'updated notes');
    el.setAttribute('resize', 'none');
    el.setAttribute('show-count', '');
    await flushMicrotask();

    const shellAfter = el.shadowRoot?.querySelector('.shell');
    expect(shellAfter).toBe(shellBefore);
    el.remove();
  });

  it('ui-radio-group keeps root node stable across value/disabled/orientation updates', async () => {
    const el = document.createElement('ui-radio-group') as HTMLElement;
    el.setAttribute(
      'options',
      JSON.stringify([
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' }
      ])
    );
    el.setAttribute('value', 'a');
    document.body.appendChild(el);
    await flushMicrotask();

    const rootBefore = el.shadowRoot?.querySelector('.root');
    expect(rootBefore).toBeTruthy();

    el.setAttribute('value', 'b');
    el.setAttribute('disabled', '');
    el.setAttribute('orientation', 'horizontal');
    await flushMicrotask();

    const rootAfter = el.shadowRoot?.querySelector('.root');
    expect(rootAfter).toBe(rootBefore);
    el.remove();
  });

  it('ui-slider keeps shell node stable across value and visual attribute updates', async () => {
    const el = document.createElement('ui-slider') as HTMLElement;
    el.setAttribute('value', '24');
    document.body.appendChild(el);
    await flushMicrotask();

    const shellBefore = el.shadowRoot?.querySelector('.shell');
    expect(shellBefore).toBeTruthy();

    el.setAttribute('value', '42');
    el.setAttribute('orientation', 'vertical');
    el.setAttribute('variant', 'contrast');
    await flushMicrotask();

    const shellAfter = el.shadowRoot?.querySelector('.shell');
    expect(shellAfter).toBe(shellBefore);
    el.remove();
  });

  it('ui-scroll-area keeps shell node stable across orientation/visual updates', async () => {
    const el = document.createElement('ui-scroll-area') as HTMLElement;
    el.innerHTML = `<div style="height: 600px; width: 900px">content</div>`;
    document.body.appendChild(el);
    await flushMicrotask();

    const shellBefore = el.shadowRoot?.querySelector('.shell');
    expect(shellBefore).toBeTruthy();

    el.setAttribute('orientation', 'both');
    el.setAttribute('tone', 'brand');
    el.setAttribute('variant', 'inset');
    el.setAttribute('aria-label', 'Audit list');
    await flushMicrotask();

    const shellAfter = el.shadowRoot?.querySelector('.shell');
    expect(shellAfter).toBe(shellBefore);
    el.remove();
  });

  it('ui-presence keeps wrapper node stable across present/timing updates', async () => {
    const el = document.createElement('ui-presence') as HTMLElement;
    el.innerHTML = `<div>Presence content</div>`;
    document.body.appendChild(el);
    await flushMicrotask();

    const presenceBefore = el.shadowRoot?.querySelector('.presence');
    expect(presenceBefore).toBeTruthy();

    el.setAttribute('present', '');
    el.setAttribute('enter-duration', '280');
    el.setAttribute('exit-duration', '220');
    el.removeAttribute('present');
    await flushMicrotask();

    const presenceAfter = el.shadowRoot?.querySelector('.presence');
    expect(presenceAfter).toBe(presenceBefore);
    el.remove();
  });

  it('ui-portal keeps source node stable across strategy/disabled updates', async () => {
    const target = document.createElement('div');
    target.id = 'perf-portal-target';
    document.body.appendChild(target);

    const el = document.createElement('ui-portal') as HTMLElement;
    el.setAttribute('target', '#perf-portal-target');
    el.innerHTML = `<span data-portal="true">Portal content</span>`;
    document.body.appendChild(el);
    await flushMicrotask();

    const sourceBefore = el.shadowRoot?.querySelector('.source');
    expect(sourceBefore).toBeTruthy();

    el.setAttribute('strategy', 'prepend');
    el.setAttribute('disabled', '');
    el.removeAttribute('disabled');
    await flushMicrotask();

    const sourceAfter = el.shadowRoot?.querySelector('.source');
    expect(sourceAfter).toBe(sourceBefore);

    el.remove();
    target.remove();
  });

  it('ui-table keeps frame node stable across empty-text and visual behavior updates', async () => {
    const el = document.createElement('ui-table') as HTMLElement;
    el.innerHTML = `
      <table>
        <thead><tr><th>ID</th><th>Name</th></tr></thead>
        <tbody><tr><td>1</td><td>Ada</td></tr></tbody>
      </table>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const frameBefore = el.shadowRoot?.querySelector('.frame');
    expect(frameBefore).toBeTruthy();

    el.setAttribute('empty-text', 'Nothing here');
    el.setAttribute('sortable', '');
    el.setAttribute('selectable', '');
    await flushMicrotask();

    const frameAfter = el.shadowRoot?.querySelector('.frame');
    expect(frameAfter).toBe(frameBefore);
    el.remove();
  });

  it('ui-data-table keeps frame node stable across visual and label-only updates', async () => {
    const el = document.createElement('ui-data-table') as HTMLElement;
    el.innerHTML = `
      <table>
        <thead><tr><th data-key="id">ID</th><th data-key="name">Name</th></tr></thead>
        <tbody><tr><td>1</td><td>Ada</td></tr></tbody>
      </table>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const frameBefore = el.shadowRoot?.querySelector('.frame');
    expect(frameBefore).toBeTruthy();

    el.setAttribute('hover', '');
    el.setAttribute('striped', '');
    el.setAttribute('loading', '');
    el.setAttribute('hide-summary', '');
    el.setAttribute('bulk-actions-label', '{count} rows selected');
    el.setAttribute('bulk-clear-label', 'Reset');
    await flushMicrotask();

    const frameAfter = el.shadowRoot?.querySelector('.frame');
    expect(frameAfter).toBe(frameBefore);
    el.remove();
  });
});
