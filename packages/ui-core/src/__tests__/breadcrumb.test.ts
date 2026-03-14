import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-breadcrumb';

function waitForRender() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

async function settle() {
  await Promise.resolve();
  await waitForRender();
}

function mountBreadcrumb(markup: string, attrs: Record<string, string> = {}) {
  const el = document.createElement('ui-breadcrumb');
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  el.innerHTML = markup;
  document.body.appendChild(el);
  return el as HTMLElement;
}

describe('ui-breadcrumb', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('uses current-index when provided and marks only that item as current', async () => {
    const el = mountBreadcrumb(
      `
        <span slot="item">Home</span>
        <span slot="item">Patients</span>
        <span slot="item">Ward</span>
      `,
      { 'current-index': '1' }
    );

    await settle();

    const current = Array.from(el.shadowRoot?.querySelectorAll('.crumb-current') || []);
    expect(current).toHaveLength(1);
    expect(current[0].textContent?.trim()).toBe('Patients');
  });

  it('collapses long trails and preserves current context around max-items', async () => {
    const el = mountBreadcrumb(
      `
        <span slot="item">A</span>
        <span slot="item">B</span>
        <span slot="item">C</span>
        <span slot="item">D</span>
        <span slot="item">E</span>
        <span slot="item">F</span>
        <span slot="item">G</span>
      `,
      { 'max-items': '4', 'current-index': '3' }
    );

    await settle();

    const renderedItems = el.shadowRoot?.querySelectorAll('li[part="item"]') || [];
    const ellipsis = el.shadowRoot?.querySelectorAll('.crumb-ellipsis') || [];
    expect(renderedItems.length).toBeGreaterThanOrEqual(4);
    expect(ellipsis.length).toBeGreaterThanOrEqual(1);
    expect(el.shadowRoot?.textContent).toContain('D');
  });

  it('emits cancelable select event and mirrors ui-select payload on click', async () => {
    const el = mountBreadcrumb(
      `
        <a slot="item" href="/home">Home</a>
        <a slot="item" href="/patients">Patients</a>
        <span slot="item">Details</span>
      `
    );

    await settle();

    const selectSpy = vi.fn((event: Event) => {
      event.preventDefault();
    });
    const mirroredSpy = vi.fn();
    el.addEventListener('select', selectSpy as EventListener);
    el.addEventListener('ui-select', mirroredSpy as EventListener);

    const action = el.shadowRoot?.querySelector('.crumb-action[data-source-index="0"]') as HTMLElement;
    expect(action).toBeTruthy();

    const click = new MouseEvent('click', { bubbles: true, cancelable: true, composed: true });
    const notCanceled = action.dispatchEvent(click);

    expect(notCanceled).toBe(false);
    expect(selectSpy).toHaveBeenCalledTimes(1);
    expect(mirroredSpy).toHaveBeenCalledTimes(1);
    const mirroredEvent = mirroredSpy.mock.calls[0][0] as CustomEvent<{ source: string; index: number }>;
    expect(mirroredEvent.detail.index).toBe(0);
    expect(mirroredEvent.detail.source).toBe('click');
  });

  it('does not emit select when host is disabled', async () => {
    const el = mountBreadcrumb(
      `
        <span slot="item">Home</span>
        <span slot="item">Patients</span>
      `,
      { disabled: '' }
    );

    await settle();

    const selectSpy = vi.fn();
    el.addEventListener('select', selectSpy as EventListener);

    const action = el.shadowRoot?.querySelector('.crumb-action') as HTMLElement | null;
    expect(action).toBeNull();

    expect(selectSpy).not.toHaveBeenCalled();
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  it('updates when slotted items change and emits keyboard source for space on links', async () => {
    const el = mountBreadcrumb(
      `
        <a slot="item" href="/home">Home</a>
        <a slot="item" href="/patients">Patients</a>
        <span slot="item">Details</span>
      `
    );
    await settle();

    const mirroredSpy = vi.fn();
    el.addEventListener('ui-select', mirroredSpy as EventListener);

    const firstLink = el.shadowRoot?.querySelector('.crumb-link[data-source-index="0"]') as HTMLElement;
    expect(firstLink).toBeTruthy();
    firstLink.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true, composed: true }));
    expect(mirroredSpy).toHaveBeenCalledTimes(1);
    const keyEvent = mirroredSpy.mock.calls[0][0] as CustomEvent<{ source: string }>;
    expect(keyEvent.detail.source).toBe('keyboard');

    const added = document.createElement('span');
    added.setAttribute('slot', 'item');
    added.textContent = 'Audit';
    el.appendChild(added);
    await settle();

    const listText = el.shadowRoot?.textContent || '';
    expect(listText).toContain('Audit');
  });

  it('normalizes radius values into the host style contract', async () => {
    const el = mountBreadcrumb(
      `
        <span slot="item">Workspace</span>
        <span slot="item">Audit logs</span>
      `,
      { radius: 'full' }
    );

    await settle();
    expect(el.style.getPropertyValue('--ui-breadcrumb-radius')).toBe('9999px');

    el.setAttribute('radius', '12');
    await settle();
    expect(el.style.getPropertyValue('--ui-breadcrumb-radius')).toBe('12px');
  });
});
