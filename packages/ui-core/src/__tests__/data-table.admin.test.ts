import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-data-table';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
// attribute changes re-sync on the next animation frame
const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

function table(rows: Array<[string, string, string]>, rowAttrs: (index: number) => string = () => '') {
  return `<table>
    <thead><tr><th data-key="name">Name</th><th data-key="email">Email</th><th data-key="amount">Amount</th></tr></thead>
    <tbody>${rows.map((cells, index) => `<tr ${rowAttrs(index)}>${cells.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;
}

async function mount(attrs: Record<string, string>, markup: string) {
  const el = document.createElement('ui-data-table') as HTMLElement;
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  el.innerHTML = markup;
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
}

const bodyRows = (el: HTMLElement) => Array.from(el.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
const summary = (el: HTMLElement) => el.shadowRoot!.querySelector('.summary')!.textContent;

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('ui-data-table server-side', () => {
  const page2: Array<[string, string, string]> = [['Kim', 'kim@x.io', '30'], ['Ava', 'ava@x.io', '10'], ['Lee', 'lee@x.io', '20']];

  it('shows the rows it is given as the current page of total-rows', async () => {
    const el = await mount({ 'server-side': '', 'total-rows': '23', 'page-size': '3', page: '2', sortable: '', 'filter-query': 'zzz' }, table(page2));
    // no client-side filtering or paging: all three rows stay visible
    expect(bodyRows(el).map((row) => row.hidden)).toEqual([false, false, false]);
    expect(bodyRows(el).map((row) => row.getAttribute('aria-rowindex'))).toEqual(['4', '5', '6']);
    expect(el.querySelector('table')!.getAttribute('aria-rowcount')).toBe('23');
    expect(summary(el)).toBe('Showing 4-6 of 23');
  });

  it('reports a sort without reordering the rows', async () => {
    const el = await mount({ 'server-side': '', 'total-rows': '3', sortable: '' }, table(page2));
    const sorted = vi.fn();
    el.addEventListener('sort-change', (event) => sorted((event as CustomEvent).detail));
    (el.querySelector('th[data-key="name"]') as HTMLElement).click();
    expect(sorted).toHaveBeenCalledWith(expect.objectContaining({ key: 'name', direction: 'asc' }));
    expect(bodyRows(el).map((row) => row.cells[0].textContent)).toEqual(['Kim', 'Ava', 'Lee']);
    expect(el.querySelector('th[data-key="name"]')!.getAttribute('aria-sort')).toBe('ascending');
  });

  it('reports a page change from its pagination for the app to fetch', async () => {
    const pager = document.createElement('div');
    pager.id = 'pager';
    document.body.appendChild(pager);
    const el = await mount({ 'server-side': '', 'total-rows': '23', 'page-size': '3', 'pagination-id': 'pager' }, table(page2));
    expect(pager.getAttribute('count')).toBe('8');
    const changed = vi.fn();
    el.addEventListener('page-change', (event) => changed((event as CustomEvent).detail));
    pager.dispatchEvent(new CustomEvent('change', { detail: { page: 3 } }));
    expect(changed).toHaveBeenCalledWith(expect.objectContaining({ page: 3, total: 23, start: 7, end: 9 }));
    expect(el.getAttribute('page')).toBe('3');
  });

  it('a short last page reports its real end', async () => {
    const el = await mount({ 'server-side': '', 'total-rows': '7', 'page-size': '3', page: '3' }, table([['Zed', 'z@x.io', '1']]));
    expect(summary(el)).toBe('Showing 7-7 of 7');
  });
});

describe('ui-data-table pagination-id', () => {
  it('binds a pager that comes after the table in the page', async () => {
    const el = await mount({ 'pagination-id': 'late-pager', 'page-size': '1' }, table([['A', 'a', '1'], ['B', 'b', '2'], ['C', 'c', '3']]));
    // added well after the table's first render (a slow page, a lazily rendered pager)
    await frame();
    await frame();
    const pager = document.createElement('div');
    pager.id = 'late-pager';
    document.body.appendChild(pager);
    await tick();
    expect(pager.getAttribute('count')).toBe('3');
    pager.dispatchEvent(new CustomEvent('change', { detail: { page: 2 }, bubbles: true }));
    expect(bodyRows(el).map((row) => row.hidden)).toEqual([true, false, true]);
    // change events from anything else do not page the table
    document.body.dispatchEvent(new CustomEvent('change', { detail: { page: 3 }, bubbles: true }));
    expect(el.getAttribute('page')).toBe('2');
  });
});

describe('ui-data-table hidden-columns', () => {
  it('hides columns by key or index and shows them again', async () => {
    const el = await mount({ 'hidden-columns': 'email, 2' }, table([['Ava', 'ava@x.io', '10']]));
    const visible = () => Array.from(el.querySelectorAll('tr')).map((row) => Array.from(row.cells).filter((cell) => !cell.hidden).map((cell) => cell.textContent));
    expect(visible()).toEqual([['Name'], ['Ava']]);
    el.setAttribute('hidden-columns', 'name');
    await frame();
    expect(visible()).toEqual([['Email', 'Amount'], ['ava@x.io', '10']]);
  });

  it('leaves cells the app hid itself alone', async () => {
    const el = await mount({}, table([['Ava', 'ava@x.io', '10']]));
    const cell = el.querySelector('tbody td') as HTMLElement;
    cell.hidden = true;
    el.setAttribute('hidden-columns', 'email');
    await frame();
    expect((el.querySelector('tbody td:nth-child(2)') as HTMLElement).hidden).toBe(true);
    el.setAttribute('hidden-columns', '');
    await frame();
    expect((el.querySelector('tbody td:nth-child(2)') as HTMLElement).hidden).toBe(false);
    expect(cell.hidden).toBe(true);
  });
});

describe('ui-data-table row links', () => {
  const rows: Array<[string, string, string]> = [['Ava', 'ava@x.io', '10'], ['Kim', 'kim@x.io', '30']];
  const links = (index: number) => `data-href="/people/${index}" data-id="p${index}"`;

  it('follows a row link through a cancelable navigate event', async () => {
    const el = await mount({}, table(rows, links) + '');
    el.querySelector('tbody tr:nth-child(2) td')!.insertAdjacentHTML('beforeend', ' <button>Edit</button>');
    const navigate = vi.fn((event: Event) => event.preventDefault());
    el.addEventListener('navigate', navigate);

    (el.querySelector('tbody tr td') as HTMLElement).click();
    expect(navigate).toHaveBeenCalledTimes(1);
    expect((navigate.mock.calls[0][0] as CustomEvent).detail).toEqual(
      expect.objectContaining({ href: '/people/0', rowId: 'p0', row: expect.objectContaining({ name: 'Ava' }) })
    );

    // a control inside the row keeps its own click
    (el.querySelector('tbody tr:nth-child(2) button') as HTMLElement).click();
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('makes link rows reachable with Tab and follows them with Enter', async () => {
    const el = await mount({}, table(rows, links));
    const navigate = vi.fn((event: Event) => event.preventDefault());
    el.addEventListener('navigate', navigate);
    const row = bodyRows(el)[1];
    expect(row.getAttribute('tabindex')).toBe('0');
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect((navigate.mock.calls[0][0] as CustomEvent).detail.href).toBe('/people/1');
  });

  it('opens a modifier or middle click in a new tab', async () => {
    const el = await mount({}, table(rows, links));
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const navigate = vi.fn();
    el.addEventListener('navigate', navigate);
    (el.querySelector('tbody tr td') as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }));
    (el.querySelector('tbody tr td') as HTMLElement).dispatchEvent(new MouseEvent('auxclick', { bubbles: true, button: 1 }));
    expect(open).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenCalledWith('/people/0', '_blank', 'noopener');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('in a selectable table a click selects and Enter follows the link', async () => {
    const el = await mount({ selectable: '' }, table(rows, links));
    const navigate = vi.fn((event: Event) => event.preventDefault());
    el.addEventListener('navigate', navigate);
    const row = bodyRows(el)[0];
    (row.cells[0] as HTMLElement).click();
    expect(row.getAttribute('aria-selected')).toBe('true');
    expect(navigate).not.toHaveBeenCalled();
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});

describe('ui-data-table loading text', () => {
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

  it('says Loading on the first load and Refreshing once there are rows', async () => {
    const el = document.createElement('ui-data-table');
    el.setAttribute('state', 'loading');
    el.innerHTML = '<table><thead><tr><th>Name</th><th>Total</th></tr></thead><tbody></tbody></table>';
    document.body.appendChild(el);
    await settle();
    const bar = el.shadowRoot!.querySelector('.statebar')!;
    expect(bar.textContent).toContain('Loading table data');
    expect(bar.getAttribute('data-state')).toBe('loading');

    el.querySelector('tbody')!.innerHTML = '<tr><td>Ada</td><td>3</td></tr>';
    el.setAttribute('state', 'idle');
    await settle();
    el.setAttribute('state', 'loading');
    await settle();
    expect(bar.textContent).toContain('Refreshing table data');
    el.remove();
  });
});
