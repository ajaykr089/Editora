import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-data-table';

function createDataTable(markup: string, attrs: Record<string, string | boolean> = {}) {
  const el = document.createElement('ui-data-table') as HTMLElement;
  Object.entries(attrs).forEach(([name, value]) => {
    if (value === false) return;
    if (value === true) el.setAttribute(name, '');
    else el.setAttribute(name, String(value));
  });
  el.innerHTML = markup;
  document.body.appendChild(el);
  return el;
}

describe('ui-data-table accessibility + keyboard behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('supports keyboard column reorder with Alt+Arrow and emits column-order-change', () => {
    const el = createDataTable(`
      <table>
        <thead>
          <tr>
            <th data-key="name">Name</th>
            <th data-key="email">Email</th>
            <th data-key="role">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Ava</td><td>ava@acme.com</td><td>Admin</td></tr>
        </tbody>
      </table>
    `, {
      'draggable-columns': true
    });

    let payload: any = null;
    el.addEventListener('column-order-change', (event: Event) => {
      payload = (event as CustomEvent).detail;
    });

    const firstHeader = el.querySelector('thead th') as HTMLTableCellElement;
    expect(firstHeader).toBeTruthy();
    firstHeader.focus();
    firstHeader.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }));

    const headerTexts = Array.from(el.querySelectorAll('thead th')).map((header) => (header.textContent || '').trim());
    expect(headerTexts).toEqual(['Email', 'Name', 'Role']);
    expect(el.getAttribute('column-order')).toBe('email,name,role');
    expect(payload).toBeTruthy();
    expect(payload.order).toBe('email,name,role');
    expect(firstHeader.getAttribute('aria-keyshortcuts')).toContain('Alt+ArrowRight');
  });

  it('supports row keyboard navigation and selection', () => {
    const el = createDataTable(`
      <table>
        <thead><tr><th data-key="name">Name</th><th data-key="role">Role</th></tr></thead>
        <tbody>
          <tr><td>Ava</td><td>Admin</td></tr>
          <tr><td>Liam</td><td>Editor</td></tr>
          <tr><td>Mia</td><td>Analyst</td></tr>
        </tbody>
      </table>
    `, {
      selectable: true
    });

    const rows = Array.from(el.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
    expect(rows.length).toBe(3);
    rows[0].focus();
    rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(rows[1]);

    rows[1].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(rows[1].getAttribute('aria-selected')).toBe('true');
    expect(rows[1].getAttribute('data-selected')).toBe('true');
    expect(rows[1].getAttribute('aria-keyshortcuts')).toContain('ArrowUp');
  });

  it('uses RTL-aware keyboard mapping for header movement + reorder', () => {
    const el = createDataTable(`
      <table>
        <thead>
          <tr>
            <th data-key="name">Name</th>
            <th data-key="email">Email</th>
            <th data-key="role">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Ava</td><td>ava@acme.com</td><td>Admin</td></tr>
        </tbody>
      </table>
    `, {
      'draggable-columns': true
    });
    el.style.direction = 'rtl';

    const firstHeader = el.querySelector('thead th') as HTMLTableCellElement;
    firstHeader.focus();
    firstHeader.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, altKey: true }));

    const headerTexts = Array.from(el.querySelectorAll('thead th')).map((header) => (header.textContent || '').trim());
    expect(headerTexts).toEqual(['Email', 'Name', 'Role']);
    expect(el.getAttribute('column-order')).toBe('email,name,role');

    const focused = document.activeElement as HTMLElement | null;
    expect(focused?.textContent?.trim()).toBe('Name');
  });

  it('applies RTL-aware column resize delta', () => {
    const el = createDataTable(`
      <table>
        <thead>
          <tr>
            <th data-key="name">Name</th>
            <th data-key="role">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Ava</td><td>Admin</td></tr>
        </tbody>
      </table>
    `, {
      'resizable-columns': true
    });
    el.style.direction = 'rtl';

    const firstHeader = el.querySelector('thead th') as HTMLTableCellElement;
    expect(firstHeader).toBeTruthy();

    Object.defineProperty(firstHeader, 'getBoundingClientRect', {
      value: () => ({ width: 200, height: 32, top: 0, left: 0, right: 200, bottom: 32, x: 0, y: 0, toJSON() {} }),
      configurable: true
    });

    const handle = firstHeader.querySelector('.resize-handle') as HTMLElement | null;
    expect(handle).toBeTruthy();
    handle!.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 100 }));
    window.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 120 }));

    expect(firstHeader.style.width).toBe('180px');
    window.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, clientX: 120 }));
  });

  it('keeps aria row metadata in sync with filtering and reports empty-filter state', () => {
    const el = createDataTable(`
      <table>
        <thead><tr><th data-key="name">Name</th><th data-key="role">Role</th></tr></thead>
        <tbody>
          <tr><td>Ava</td><td>Admin</td></tr>
          <tr><td>Liam</td><td>Editor</td></tr>
          <tr><td>Mia</td><td>Analyst</td></tr>
        </tbody>
      </table>
    `, {
      'filter-query': 'mia'
    });

    const table = el.querySelector('table') as HTMLTableElement;
    expect(table.getAttribute('aria-rowcount')).toBe('1');
    expect(table.getAttribute('aria-colcount')).toBe('2');

    el.setAttribute('filter-query', 'zzz');
    const empty = el.shadowRoot?.querySelector('.empty') as HTMLElement | null;
    expect(empty).toBeTruthy();
    expect(empty?.hasAttribute('hidden')).toBe(false);
    expect((empty?.textContent || '').toLowerCase()).toContain('no matching records');
  });
});
