import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';
import '../components/ui-placement-grid';
import '../components/ui-menu';
import '../components/ui-dropdown';
import '../components/ui-button';
import '../components/ui-dock';
import '../components/ui-avatar';
import '../components/ui-color-picker';
import '../components/ui-calendar';
import '../components/ui-card';
import '../components/ui-drawer';
import '../components/ui-switch';
import '../components/ui-toggle';
import '../components/ui-rating';
import '../components/ui-tabs';
import '../components/ui-wizard';
import '../components/ui-floating-toolbar';
import '../components/ui-quick-actions';

// ARIA a role can only sit on the elements the specification allows, and a reference by id cannot cross
// a shadow root. These cases pin the structure that keeps each component valid for assistive technology.

const flush = () => new Promise((resolve) => setTimeout(resolve, 30));

const mount = async (html: string) => {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  await flush();
  return host;
};

const shadow = (el: Element | null) => el?.shadowRoot as ShadowRoot;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt', () => {
  const tasks = JSON.stringify([
    { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-06', assignee: 'Ava' },
    { id: 'b', label: 'Build', start: '2026-03-09', end: '2026-03-20', assignee: 'Sam' },
  ]);

  it('exposes the task list as a tree grid with headers, rows and cells', async () => {
    const host = await mount(`<ui-gantt tasks='${tasks}' aria-label="Release plan"></ui-gantt>`);
    const root = shadow(host.querySelector('ui-gantt'));
    const grid = root.querySelector('[role="treegrid"]')!;

    expect(grid.getAttribute('aria-label')).toBeTruthy();
    expect(grid.getAttribute('aria-rowcount')).toBe('3');
    expect(grid.querySelectorAll('[role="columnheader"]').length).toBeGreaterThan(0);
    expect(grid.querySelectorAll('[role="row"]').length).toBe(3);
    expect(grid.querySelectorAll('[role="rowgroup"]').length).toBe(1);
    expect(grid.querySelectorAll('[role="gridcell"]').length).toBeGreaterThan(0);
  });

  it('keeps every interactive element out of a grid cell that is not a native or ARIA control', async () => {
    const host = await mount(`<ui-gantt tasks='${tasks}'></ui-gantt>`);
    const root = shadow(host.querySelector('ui-gantt'));

    // The sortable column header holds a real button inside the header cell, not a role on the cell.
    const header = root.querySelector('[role="columnheader"]')!;
    expect(header.querySelector('button.head-button')).toBeTruthy();
    expect(header.hasAttribute('tabindex')).toBe(false);
  });

  it('draws the timeline as a labelled group, hidden header included, apart from the grid', async () => {
    const host = await mount(`<ui-gantt tasks='${tasks}'></ui-gantt>`);
    const root = shadow(host.querySelector('ui-gantt'));

    expect(root.querySelector('.timeline-head')!.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('.timeline-body')!.getAttribute('role')).toBe('group');
    expect(root.querySelector('[role="treegrid"] .bar')).toBeNull();
  });
});

describe('ui-placement-grid', () => {
  it('is a list of list items when the items are interactive', async () => {
    const host = await mount(`
      <ui-placement-grid interactive>
        <div data-ui-placement-item data-value="a">A</div>
        <div data-ui-placement-item data-value="b">B</div>
      </ui-placement-grid>`);
    const grid = host.querySelector('ui-placement-grid')!;
    const items = Array.from(grid.querySelectorAll('[data-ui-placement-item]'));

    expect(grid.getAttribute('role')).toBe('list');
    expect(items.map((item) => item.getAttribute('role'))).toEqual(['listitem', 'listitem']);
    expect(items.map((item) => item.getAttribute('aria-posinset'))).toEqual(['1', '2']);
    expect(items[0].getAttribute('aria-setsize')).toBe('2');
    expect(grid.hasAttribute('aria-rowcount')).toBe(false);
  });

  it('does not take a role it did not need and gives it back on removal', async () => {
    const host = await mount(`
      <ui-placement-grid interactive>
        <div data-ui-placement-item data-value="a">A</div>
      </ui-placement-grid>`);
    const grid = host.querySelector('ui-placement-grid')!;

    grid.removeAttribute('interactive');
    await flush();
    expect(grid.hasAttribute('role')).toBe(false);
    expect(grid.querySelector('[data-ui-placement-item]')!.hasAttribute('role')).toBe(false);
  });
});

describe('menu and dropdown triggers', () => {
  it('put the popup state on the real button inside a wrapper, never on the wrapper', async () => {
    const host = await mount(`
      <ui-menu>
        <div slot="trigger"><button id="inner">Actions</button></div>
        <div slot="content" role="menu"><button role="menuitem">One</button></div>
      </ui-menu>`);
    const wrapper = host.querySelector('[slot="trigger"]')!;
    const button = host.querySelector('#inner')!;

    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(wrapper.hasAttribute('aria-haspopup')).toBe(false);
    expect(wrapper.hasAttribute('role')).toBe(false);
  });

  it('treat a ui-button as the control', async () => {
    const host = await mount(`
      <ui-dropdown>
        <div slot="trigger"><ui-button id="inner">Open</ui-button></div>
        <div slot="content" role="menu"><button role="menuitem">One</button></div>
      </ui-dropdown>`);

    expect(host.querySelector('#inner')!.getAttribute('aria-haspopup')).toBeTruthy();
    expect(host.querySelector('[slot="trigger"]')!.hasAttribute('aria-expanded')).toBe(false);
  });

  it('make a bare wrapper a button when nothing inside is interactive', async () => {
    const host = await mount(`
      <ui-menu>
        <span slot="trigger">Actions</span>
        <div slot="content" role="menu"><button role="menuitem">One</button></div>
      </ui-menu>`);
    const trigger = host.querySelector('[slot="trigger"]')!;

    expect(trigger.getAttribute('role')).toBe('button');
    expect(trigger.getAttribute('tabindex')).toBe('0');
  });

  it('ui-button forwards popup state from its host to the inner button', async () => {
    const host = await mount('<ui-button aria-haspopup="menu" aria-expanded="false">Open</ui-button>');
    const button = host.querySelector('ui-button')!;
    const inner = () => shadow(button).querySelector('button')!;

    expect(inner().getAttribute('aria-haspopup')).toBe('menu');
    expect(inner().getAttribute('aria-expanded')).toBe('false');

    button.setAttribute('aria-expanded', 'true');
    expect(inner().getAttribute('aria-expanded')).toBe('true');
  });
});

describe('tabs and wizard', () => {
  it('do not point aria-controls or aria-activedescendant at ids in another tree', async () => {
    const host = await mount(`
      <ui-tabs aria-label="Sections">
        <button slot="tab" data-value="one">One</button>
        <button slot="tab" data-value="two">Two</button>
        <div slot="panel" data-value="one">First</div>
        <div slot="panel" data-value="two">Second</div>
      </ui-tabs>`);
    const tabs = host.querySelector('ui-tabs')!;

    expect(tabs.hasAttribute('aria-activedescendant')).toBe(false);
    expect(tabs.hasAttribute('aria-controls')).toBe(false);
    const tabButtons = shadow(tabs).querySelectorAll('[role="tab"]');
    expect(tabButtons.length).toBe(2);
    tabButtons.forEach((tab) => expect(tab.hasAttribute('aria-controls')).toBe(false));
  });
});

describe('ui-dock', () => {
  it('folds a badge count into the item name so it is not lost', async () => {
    const host = await mount(`
      <ui-dock>
        <button data-ui-dock-item aria-label="Library"><span data-ui-dock-icon>L</span><span data-ui-dock-badge>12</span></button>
        <button data-ui-dock-item aria-label="Home"><span data-ui-dock-icon>H</span></button>
      </ui-dock>`);
    const [library, home] = Array.from(host.querySelectorAll('[data-ui-dock-item]'));

    expect(library.getAttribute('aria-label')).toBe('Library, 12');
    expect(home.getAttribute('aria-label')).toBe('Home');
  });

  it('follows the badge as it changes and does not mistake the added count for the author label', async () => {
    const host = await mount(`
      <ui-dock>
        <button data-ui-dock-item aria-label="Inbox"><span data-ui-dock-icon>I</span><span data-ui-dock-badge>3</span></button>
      </ui-dock>`);
    const dock = host.querySelector('ui-dock') as HTMLElement;
    const item = host.querySelector('[data-ui-dock-item]')!;

    host.querySelector('[data-ui-dock-badge]')!.textContent = '7';
    dock.setAttribute('gap', '4');
    await flush();
    expect(item.getAttribute('aria-label')).toBe('Inbox, 7');
  });
});

describe('ui-avatar', () => {
  it('keeps its generated name current when alt arrives after the first render', async () => {
    const host = await mount('<ui-avatar initials="DA"></ui-avatar>');
    const avatar = host.querySelector('ui-avatar')!;
    expect(avatar.getAttribute('aria-label')).toBe('DA');

    avatar.setAttribute('alt', 'Dr. Ava Singh');
    await flush();
    expect(avatar.getAttribute('aria-label')).toBe('Dr. Ava Singh');
  });

  it('includes the visible badge in the name, and leaves an author label alone', async () => {
    const host = await mount('<ui-avatar alt="Sam Lee" badge="3"></ui-avatar><ui-avatar alt="Sam Lee" badge="3" aria-label="Sam, online"></ui-avatar>');
    const [generated, authored] = Array.from(host.querySelectorAll('ui-avatar'));

    expect(generated.getAttribute('aria-label')).toBe('Sam Lee, 3');
    expect(authored.getAttribute('aria-label')).toBe('Sam, online');
  });
});

describe('ui-color-picker trigger', () => {
  it('is named by the label and the value it shows', async () => {
    const host = await mount('<ui-color-picker aria-label="Brand colour" value="#2563eb"></ui-color-picker>');
    const trigger = shadow(host.querySelector('ui-color-picker')).querySelector('.trigger')!;
    const shown = trigger.querySelector('[data-role="trigger-value"]')!.textContent!.trim();

    expect(shown.length).toBeGreaterThan(0);
    expect(trigger.getAttribute('aria-label')).toBe(`Brand colour, ${shown}`);
  });

  it('resolves a label element on the host, since an id cannot be followed from inside', async () => {
    const host = await mount('<span id="lbl">Accent</span><ui-color-picker aria-labelledby="lbl" value="#2563eb"></ui-color-picker>');
    const trigger = shadow(host.querySelector('ui-color-picker')).querySelector('.trigger')!;

    expect(trigger.hasAttribute('aria-labelledby')).toBe(false);
    expect(trigger.getAttribute('aria-label')).toMatch(/^Accent, /);
  });
});

describe('elements that carry a role', () => {
  it('ui-card, ui-drawer, the calendar grid and the floating bars use elements that allow it', async () => {
    const host = await mount(`
      <ui-card><span slot="header">Title</span>Body</ui-card>
      <ui-drawer open><span slot="header">Menu</span>Body</ui-drawer>
      <ui-calendar year="2026" month="3"></ui-calendar>
      <ui-floating-toolbar open><button>Bold</button></ui-floating-toolbar>
      <ui-quick-actions><button>New</button></ui-quick-actions>`);

    const card = shadow(host.querySelector('ui-card')).querySelector('[role="group"]')!;
    expect(card.tagName).toBe('DIV');

    const drawer = shadow(host.querySelector('ui-drawer'));
    expect(drawer.querySelector('[part="panel"], .panel, [role="dialog"]')).toBeTruthy();
    expect(drawer.querySelector('aside')).toBeNull();

    const grid = shadow(host.querySelector('ui-calendar')).querySelector('[role="grid"]')!;
    expect(['DIV', 'TABLE']).toContain(grid.tagName);

    const toolbars = [host.querySelector('ui-floating-toolbar'), host.querySelector('ui-quick-actions')].map((el) =>
      shadow(el).querySelector('[role="toolbar"]')
    );
    expect(toolbars.every(Boolean)).toBe(true);
    toolbars.forEach((bar) => expect(bar!.tagName).toBe('DIV'));
  });
});

describe('controls that are not buttons inside a switch, toggle or rating', () => {
  it('ui-switch draws its track with a span, not a nested button', async () => {
    const host = await mount('<ui-switch>Alerts</ui-switch>');
    const root = shadow(host.querySelector('ui-switch'));

    expect(root.querySelector('button')).toBeNull();
    expect(root.querySelector('.control')!.tagName).toBe('SPAN');
  });

  it('ui-toggle keeps pressed state on the host, not on an inner button', async () => {
    const host = await mount('<ui-toggle pressed>Bold</ui-toggle>');
    const toggle = host.querySelector('ui-toggle')!;
    const root = shadow(toggle);

    expect(root.querySelector('button')).toBeNull();
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('ui-rating stars are decorative; the host is the one slider', async () => {
    const host = await mount('<ui-rating value="3"></ui-rating>');
    const rating = host.querySelector('ui-rating')!;
    const stars = Array.from(shadow(rating).querySelectorAll('.star, [data-star]'));

    expect(rating.getAttribute('role')).toBe('slider');
    expect(stars.length).toBeGreaterThan(0);
    stars.forEach((star) => {
      expect(star.tagName).not.toBe('BUTTON');
      expect(star.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
