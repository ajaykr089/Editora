import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-field';
import '../components/ui-input';
import '../components/ui-textarea';
import '../components/ui-number-field';
import '../components/ui-password-field';
import '../components/ui-tags-input';
import '../components/ui-checkbox';
import '../components/ui-radio';
import '../components/ui-progress';
import '../components/ui-tree';
import '../components/ui-tabs';
import '../components/ui-alert-dialog';
import '../components/ui-rating';
import '../components/ui-card';
import '../components/ui-date-picker';
import '../components/ui-combobox';
import '../components/ui-multi-select';
import '../components/ui-transfer-list';
import '../components/ui-sortable';

// Controls draw their accessible name from somewhere inside a shadow root. A name has to be
// reachable there: an aria-label on a custom element with no role is invisible to assistive
// technology, and an aria-labelledby cannot cross a shadow boundary.

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const mount = async (html: string) => {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  await flush();
  await flush();
  return host;
};

const inner = (el: Element | null, selector: string) => el?.shadowRoot?.querySelector(selector) as HTMLElement | null;

afterEach(() => {
  document.body.innerHTML = '';
});

describe.each([
  ['ui-input', 'input'],
  ['ui-textarea', 'textarea'],
  ['ui-number-field', 'input'],
  ['ui-password-field', 'input'],
  ['ui-tags-input', 'input'],
])('%s names its inner control', (tag, selector) => {
  it('uses the host aria-label when there is no visible label', async () => {
    const host = await mount(`<${tag} aria-label="Search the catalog"></${tag}>`);
    const el = host.querySelector(tag)!;

    const control = inner(el, selector)!;
    expect(control.getAttribute('aria-label')).toBe('Search the catalog');
    expect(control.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('prefers the visible label, which it references by id inside the shadow root', async () => {
    const host = await mount(`<${tag} label="Email" aria-label="ignored"></${tag}>`);
    const el = host.querySelector(tag)!;

    const control = inner(el, selector)!;
    const labelledBy = control.getAttribute('aria-labelledby')!;
    expect(labelledBy).toBeTruthy();
    expect(el.shadowRoot!.getElementById(labelledBy)?.textContent?.trim()).toContain('Email');
    expect(control.hasAttribute('aria-label')).toBe(false);
  });

  it('follows later changes to aria-label', async () => {
    const host = await mount(`<${tag} aria-label="First"></${tag}>`);
    const el = host.querySelector(tag)!;
    const control = inner(el, selector)!;

    el.setAttribute('aria-label', 'Second');
    await flush();
    expect(control.getAttribute('aria-label')).toBe('Second');

    el.removeAttribute('aria-label');
    await flush();
    expect(control.hasAttribute('aria-label')).toBe(false);
  });
});

describe('ui-password-field label text', () => {
  it('shows the label and description when the attributes arrive after the element connected', async () => {
    // React connects the element first and sets attributes in an effect.
    const host = await mount('<ui-password-field></ui-password-field>');
    const el = host.querySelector('ui-password-field')!;

    el.setAttribute('label', 'Current password');
    el.setAttribute('description', 'Required before rotating keys');
    el.setAttribute('data-error', 'Too short');
    await flush();

    expect(inner(el, '.label')!.textContent).toContain('Current password');
    expect(inner(el, '.description')!.textContent).toContain('Required before rotating keys');
    expect(inner(el, '.error')!.textContent).toContain('Too short');
  });

  it('lets slotted label content win over the attribute text', async () => {
    const host = await mount('<ui-password-field label="From attribute"><span slot="label">From slot</span></ui-password-field>');
    const el = host.querySelector('ui-password-field')!;
    const slot = inner(el, 'slot[name="label"]') as HTMLSlotElement;

    expect(slot.assignedNodes()).toHaveLength(1);
    expect(slot.assignedNodes()[0].textContent).toBe('From slot');
  });
});

describe('ui-field names the control it labels', () => {
  it('copies the label onto a native input', async () => {
    const host = await mount('<ui-field label="Email address"><input type="email" /></ui-field>');
    const input = host.querySelector('input')!;

    expect(input.getAttribute('aria-label')).toBe('Email address');
  });

  it('names a ui-input and, through it, the inner <input>', async () => {
    const host = await mount('<ui-field label="API key"><ui-input></ui-input></ui-field>');
    const el = host.querySelector('ui-input')!;

    expect(el.getAttribute('aria-label')).toBe('API key');
    expect(inner(el, 'input')!.getAttribute('aria-label')).toBe('API key');
  });

  it('names a ui-textarea and a role-on-host control such as ui-checkbox', async () => {
    const host = await mount('<ui-field label="Notes"><ui-textarea></ui-textarea></ui-field><ui-field label="Confirm"><ui-checkbox></ui-checkbox></ui-field>');

    expect(inner(host.querySelector('ui-textarea'), 'textarea')!.getAttribute('aria-label')).toBe('Notes');
    expect(host.querySelector('ui-checkbox')!.getAttribute('aria-label')).toBe('Confirm');
  });

  it('uses slotted label text', async () => {
    const host = await mount('<ui-field><span slot="label">Display <b>name</b></span><input /></ui-field>');

    expect(host.querySelector('input')!.getAttribute('aria-label')).toBe('Display name');
  });

  it('follows the label and removes what it added when the label goes away', async () => {
    const host = await mount('<ui-field label="First"><input /></ui-field>');
    const field = host.querySelector('ui-field')!;
    const input = host.querySelector('input')!;

    field.setAttribute('label', 'Second');
    await flush();
    expect(input.getAttribute('aria-label')).toBe('Second');

    field.removeAttribute('label');
    await flush();
    expect(input.hasAttribute('aria-label')).toBe(false);
    expect(input.hasAttribute('data-ui-field-label')).toBe(false);
  });

  it('never overrides a name the author supplied', async () => {
    const host = await mount(`
      <ui-field label="Field label"><input id="by-aria" aria-label="Author label" /></ui-field>
      <ui-field label="Field label"><ui-input label="Own label"></ui-input></ui-field>
      <label for="by-native">Native label</label>
      <ui-field label="Field label"><input id="by-native" /></ui-field>
      <span id="caption">Caption</span>
      <ui-field label="Field label"><input id="by-labelledby" aria-labelledby="caption" /></ui-field>
      <ui-field label="Terms"><ui-checkbox>I agree to the terms</ui-checkbox></ui-field>
    `);

    expect(host.querySelector('#by-aria')!.getAttribute('aria-label')).toBe('Author label');
    expect(host.querySelector('ui-input')!.hasAttribute('aria-label')).toBe(false);
    expect(host.querySelector('#by-native')!.hasAttribute('aria-label')).toBe(false);
    expect(host.querySelector('#by-labelledby')!.hasAttribute('aria-label')).toBe(false);
    // A checkbox that carries its own caption keeps it as its name.
    expect(host.querySelector('ui-checkbox')!.hasAttribute('aria-label')).toBe(false);
  });
});


describe('ui-progress', () => {
  const bars = (el: Element) => Array.from(el.shadowRoot!.querySelectorAll('[role="progressbar"]')) as HTMLElement[];

  it('always has a name: host aria-label, then the label attribute, then "Progress"', async () => {
    const host = await mount(`
      <ui-progress id="a" value="20"></ui-progress>
      <ui-progress id="b" value="20" label="Uploading report"></ui-progress>
      <ui-progress id="c" value="20" label="ignored" aria-label="Import status"></ui-progress>
      <ui-progress id="d" value="20" mode="circle"></ui-progress>
    `);

    const name = (id: string) => bars(host.querySelector(id)!).map((bar) => bar.getAttribute('aria-label'));
    expect(name('#a')).toContain('Progress');
    expect(name('#b')).toContain('Uploading report');
    expect(name('#c')).toContain('Import status');
    expect(name('#d').filter(Boolean)).toContain('Progress');
  });

  it('follows aria-label changes', async () => {
    const host = await mount('<ui-progress value="20" aria-label="One"></ui-progress>');
    const el = host.querySelector('ui-progress')!;
    el.setAttribute('aria-label', 'Two');
    await flush();
    expect(bars(el).map((bar) => bar.getAttribute('aria-label'))).toContain('Two');
  });
});

describe('ui-tree', () => {
  it('copies aria-label to the role="tree" element in its shadow root', async () => {
    const host = await mount('<ui-tree aria-label="Project files"></ui-tree>');
    const el = host.querySelector('ui-tree')!;
    expect(inner(el, '[role="tree"]')!.getAttribute('aria-label')).toBe('Project files');

    el.setAttribute('aria-label', 'Assets');
    await flush();
    expect(inner(el, '[role="tree"]')!.getAttribute('aria-label')).toBe('Assets');
  });
});

describe('ui-tabs', () => {
  const markup = (attrs = '') => `
    <ui-tabs ${attrs}>
      <button slot="tab" data-value="a">Overview</button>
      <button slot="tab" data-value="b">Billing</button>
      <div slot="panel">First panel</div>
      <div slot="panel" aria-label="Author name">Second panel</div>
    </ui-tabs>`;

  it('names the tablist from the host aria-label', async () => {
    const host = await mount(markup('aria-label="Account sections"'));
    expect(inner(host.querySelector('ui-tabs'), '[role="tablist"]')!.getAttribute('aria-label')).toBe('Account sections');
  });

  it('names each panel with its tab text (aria-labelledby cannot cross into the shadow root)', async () => {
    const host = await mount(markup());
    const [first, second] = Array.from(host.querySelectorAll('[slot="panel"]'));

    expect(first.hasAttribute('aria-labelledby')).toBe(false);
    expect(first.getAttribute('aria-label')).toBe('Overview');
    // a name the author wrote is kept
    expect(second.getAttribute('aria-label')).toBe('Author name');
  });
});

describe('ui-alert-dialog host', () => {
  it('is hidden from assistive technology while closed, and named while open', async () => {
    const host = await mount('<ui-alert-dialog title="Delete this project?"></ui-alert-dialog>');
    const el = host.querySelector('ui-alert-dialog')!;

    expect(el.getAttribute('aria-hidden')).toBe('true');

    el.setAttribute('open', '');
    await flush();
    expect(el.hasAttribute('aria-hidden')).toBe(false);
    expect(el.getAttribute('aria-label')).toBe('Delete this project?');

    el.removeAttribute('open');
    await flush();
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.hasAttribute('aria-label')).toBe(false);
  });

  it('keeps an author-supplied aria-label', async () => {
    const host = await mount('<ui-alert-dialog open title="Delete?" aria-label="Danger zone"></ui-alert-dialog>');
    const el = host.querySelector('ui-alert-dialog')!;

    expect(el.getAttribute('aria-label')).toBe('Danger zone');
    expect(el.hasAttribute('data-ui-auto-name')).toBe(false);
  });
});

describe('ui-rating', () => {
  it('has a name: aria-label, then the label, then "Rating"', async () => {
    const host = await mount(`
      <ui-rating id="a"></ui-rating>
      <ui-rating id="b" label="Product quality"></ui-rating>
      <ui-rating id="c" label="ignored" aria-label="Overall score"></ui-rating>
      <ui-rating id="d" aria-labelledby="caption"></ui-rating>
    `);

    expect(host.querySelector('#a')!.getAttribute('aria-label')).toBe('Rating');
    expect(host.querySelector('#b')!.getAttribute('aria-label')).toBe('Product quality');
    expect(host.querySelector('#c')!.getAttribute('aria-label')).toBe('Overall score');
    expect(host.querySelector('#d')!.hasAttribute('aria-label')).toBe(false);
  });

  it('replaces the fallback once a real label arrives', async () => {
    const host = await mount('<ui-rating></ui-rating>');
    const el = host.querySelector('ui-rating')!;
    expect(el.getAttribute('aria-label')).toBe('Rating');

    el.setAttribute('label', 'Service');
    await flush();
    expect(el.getAttribute('aria-label')).toBe('Service');
  });
});

describe('ui-card', () => {
  it('names an interactive card after its title', async () => {
    const host = await mount(`
      <ui-card interactive><div slot="header"><h3 data-ui-card-title>Project summary</h3><p>Open to see details</p></div></ui-card>
      <ui-card interactive aria-label="Author name"><div slot="header"><h3>Ignored</h3></div></ui-card>
      <ui-card><div slot="header"><h3>Static</h3></div></ui-card>
    `);
    const [titled, authored, plain] = Array.from(host.querySelectorAll('ui-card'));

    expect(titled.getAttribute('aria-label')).toBe('Project summary');
    expect(authored.getAttribute('aria-label')).toBe('Author name');
    expect(plain.hasAttribute('aria-label')).toBe(false);
  });

  it('drops its automatic name when the card stops being interactive', async () => {
    const host = await mount('<ui-card interactive><div slot="header"><h3>Title</h3></div></ui-card>');
    const card = host.querySelector('ui-card')!;
    expect(card.getAttribute('aria-label')).toBe('Title');

    card.removeAttribute('interactive');
    await flush();
    expect(card.hasAttribute('aria-label')).toBe(false);
  });
});

describe('inputs behind a picker or combobox', () => {
  it('ui-date-picker falls back to its placeholder, and prefers a label or aria-label', async () => {
    const host = await mount(`
      <ui-date-picker id="a" placeholder="Select date"></ui-date-picker>
      <ui-date-picker id="b" placeholder="Select date" label="Start"></ui-date-picker>
      <ui-date-picker id="c" placeholder="Select date" aria-label="Departure"></ui-date-picker>
    `);

    expect(inner(host.querySelector('#a'), 'input')!.getAttribute('aria-label')).toBe('Select date');
    const labelled = inner(host.querySelector('#b'), 'input')!;
    expect(labelled.hasAttribute('aria-label')).toBe(false);
    expect(labelled.getAttribute('aria-labelledby')).toBeTruthy();
    expect(inner(host.querySelector('#c'), 'input')!.getAttribute('aria-label')).toBe('Departure');
  });

  it('ui-combobox forwards the host aria-label to its input', async () => {
    const host = await mount('<ui-combobox aria-label="Assignee"></ui-combobox>');
    expect(inner(host.querySelector('ui-combobox'), '[role="combobox"]')!.getAttribute('aria-label')).toBe('Assignee');
  });

  it('ui-multi-select labels its combobox from the label, else the host aria-label', async () => {
    const host = await mount(`
      <ui-multi-select id="a" label="Teams"></ui-multi-select>
      <ui-multi-select id="b" aria-label="Teams filter"></ui-multi-select>
    `);

    const byLabel = inner(host.querySelector('#a'), '[role="combobox"]')!;
    expect(host.querySelector('#a')!.shadowRoot!.getElementById(byLabel.getAttribute('aria-labelledby')!)?.textContent).toContain('Teams');
    expect(inner(host.querySelector('#b'), '[role="combobox"]')!.getAttribute('aria-label')).toBe('Teams filter');
  });
});

describe('list-like controls', () => {
  it('ui-transfer-list names both listboxes and its icon-only move buttons', async () => {
    const host = await mount(
      `<ui-transfer-list available-label="People" selected-label="Chosen" show-action-labels="false" show-action-counts="false" options='[{"value":"a","label":"A"}]'></ui-transfer-list>`
    );
    const el = host.querySelector('ui-transfer-list')!;
    const lists = Array.from(el.shadowRoot!.querySelectorAll('[role="listbox"]'));

    expect(lists.map((list) => list.getAttribute('aria-label'))).toEqual(['People', 'Chosen']);
    expect(inner(el, '[data-action="add"]')!.getAttribute('aria-label')).toBe('Add selected');
    expect(inner(el, '[data-action="remove"]')!.getAttribute('aria-label')).toBe('Remove selected');
  });

  it('ui-transfer-list leaves visible button text to name the buttons', async () => {
    const host = await mount('<ui-transfer-list options=\'[{"value":"a","label":"A"}]\'></ui-transfer-list>');
    expect(inner(host.querySelector('ui-transfer-list'), '[data-action="add"]')!.hasAttribute('aria-label')).toBe(false);
  });

  it('ui-sortable names each list\'s listbox after the list', async () => {
    const host = await mount(
      `<ui-sortable lists='[{"id":"a","label":"Backlog"},{"id":"b","label":"Done"}]' items='[{"id":"x","label":"X","listId":"a"}]'></ui-sortable>`
    );
    const boxes = Array.from(host.querySelector('ui-sortable')!.shadowRoot!.querySelectorAll('[role="listbox"]'));

    expect(boxes.map((box) => box.getAttribute('aria-label'))).toEqual(['Backlog', 'Done']);
  });
});


describe('ui-checkbox and ui-radio', () => {
  it('do not point aria-labelledby into their own shadow root (it can never resolve)', async () => {
    const host = await mount('<ui-checkbox label="Accept"></ui-checkbox><ui-radio>Option</ui-radio>');

    expect(host.querySelector('ui-checkbox')!.hasAttribute('aria-labelledby')).toBe(false);
    expect(host.querySelector('ui-radio')!.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('leave an aria-labelledby the author wrote untouched', async () => {
    const host = await mount('<span id="legend">Notify me</span><ui-checkbox aria-labelledby="legend"></ui-checkbox>');

    expect(host.querySelector('ui-checkbox')!.getAttribute('aria-labelledby')).toBe('legend');
  });
});
