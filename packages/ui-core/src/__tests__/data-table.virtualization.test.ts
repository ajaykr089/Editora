import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-data-table';

function wait(ms = 20) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('ui-data-table virtualization', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('emits virtual-range-change and renders spacer rows for large datasets', async () => {
    const rows = Array.from({ length: 120 }, (_, index) => (
      `<tr><td>USR-${index + 1}</td><td>User ${index + 1}</td></tr>`
    )).join('');

    const el = document.createElement('ui-data-table') as HTMLElement;
    el.setAttribute('virtualize', '');
    el.setAttribute('row-height', '40');
    el.setAttribute('overscan', '2');
    el.setAttribute('page-size', '500');
    el.innerHTML = `
      <table>
        <thead><tr><th data-key="id">ID</th><th data-key="name">Name</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    document.body.appendChild(el);

    const frame = el.shadowRoot?.querySelector('.frame') as HTMLElement | null;
    expect(frame).toBeTruthy();
    Object.defineProperty(frame!, 'clientHeight', { value: 240, configurable: true });

    let detail: any = null;
    el.addEventListener('virtual-range-change', (event: Event) => {
      detail = (event as CustomEvent).detail;
    });

    frame!.scrollTop = 480;
    frame!.dispatchEvent(new Event('scroll', { bubbles: true }));
    await wait();

    expect(detail).toBeTruthy();
    expect(detail.total).toBeGreaterThan(detail.visible);
    expect(detail.start).toBeGreaterThan(0);

    const spacerRows = el.querySelectorAll('tbody tr[data-virtual-spacer]');
    expect(spacerRows.length).toBe(2);
  });
});

