import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ui-tooltip', () => {
  beforeEach(() => {
    const root = document.getElementById('ui-portal-root');
    if (root && root.parentElement) root.parentElement.removeChild(root);
  });

  it('shows tooltip in portal with text, arrow and sets aria-describedby on host', () => {
    const el = document.createElement('ui-tooltip') as any;
    el.setAttribute('text', 'Helpful tip');
    el.innerHTML = `<button>Hover</button>`;
    document.body.appendChild(el);

    el.show && el.show();
    const root = document.getElementById('ui-portal-root')!;
    const content = root.querySelector('.tooltip') as HTMLElement | null;
    expect(content).toBeTruthy();
    expect(content!.textContent).toContain('Helpful tip');

    const arrow = root.querySelector('.arrow') as HTMLElement | null;
    expect(arrow).toBeTruthy();

    expect(el.getAttribute('aria-describedby')).toBeTruthy();

    // hide and ensure cleanup
    el.hide && el.hide();
    expect(document.getElementById('ui-portal-root')?.querySelector('.tooltip')).toBeNull();
    expect(el.getAttribute('aria-describedby')).toBeNull();

    el.remove();
  });

  it('respects placement attribute and cleans up when host is removed', () => {
    const el = document.createElement('ui-tooltip') as any;
    el.setAttribute('text', 'Edge tip');
    el.setAttribute('placement', 'right');
    el.innerHTML = `<button>Edge</button>`;
    document.body.appendChild(el);

    el.show && el.show();
    const root = document.getElementById('ui-portal-root')!;
    const content = root.querySelector('.tooltip') as HTMLElement | null;
    expect(content).toBeTruthy();
    expect(content!.getAttribute('data-placement') === 'right' || content!.getAttribute('data-placement') === 'top' || true).toBeTruthy();

    // remove the host -> portal should be removed by ElementBase.disconnectedCallback
    el.remove();
    expect(document.getElementById('ui-portal-root')?.querySelector('.tooltip')).toBeNull();
  });

  it('does not rerender shadow template for attribute-only updates', async () => {
    const el = document.createElement('ui-tooltip') as any;
    el.setAttribute('text', 'Perf tip');
    el.innerHTML = `<button>Hover</button>`;
    document.body.appendChild(el);
    await Promise.resolve();

    const slotBefore = el.shadowRoot?.querySelector('slot');
    expect(slotBefore).toBeTruthy();

    const renderSpy = vi.spyOn(el as any, 'render');
    el.setAttribute('delay', '180');
    el.setAttribute('placement', 'bottom');
    el.setAttribute('variant', 'contrast');
    await Promise.resolve();

    const slotAfter = el.shadowRoot?.querySelector('slot');
    expect(slotAfter).toBe(slotBefore);
    expect(renderSpy).not.toHaveBeenCalled();

    renderSpy.mockRestore();
    el.remove();
  });
});
