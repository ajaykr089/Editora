import { afterEach, describe, expect, it, vi } from 'vitest';
import { ToolbarRenderer } from '../ToolbarRenderer';

// The overflow ("more") logic added up button widths and left out the space between `|` groups,
// so the last button it kept was cut in half by the row's overflow: hidden.
const PLUGIN = {
  name: 'buttons',
  toolbar: ['a', 'b', 'c', 'd', 'e', 'f'].map((command) => ({ label: command, command, icon: '<svg></svg>' })),
} as any;

const BUTTON = 40;
const GROUP_GAP = 30; // margin + separator between `|` groups

function layout(host: HTMLElement, toolbarWidth: number) {
  const container = (host.classList.contains('editora-toolbar') ? host : host.querySelector('.editora-toolbar')) as HTMLElement;
  Object.defineProperty(container, 'clientWidth', { configurable: true, get: () => toolbarWidth });
  const items = host.querySelector('.editora-toolbar-items-container') as HTMLElement;
  items.getBoundingClientRect = () => ({ left: 8, right: 8 + toolbarWidth - 16, top: 0, bottom: 30, width: toolbarWidth - 16, height: 30, x: 8, y: 0, toJSON() {} }) as DOMRect;
  // Lay the buttons out left to right, in their groups, with a gap between groups.
  let x = 8;
  host.querySelectorAll<HTMLElement>('.editora-toolbar-group').forEach((group, groupIndex) => {
    if (groupIndex > 0) x += GROUP_GAP;
    group.querySelectorAll<HTMLElement>('button[data-command]').forEach((button) => {
      const left = x;
      button.getBoundingClientRect = () => ({ left, right: left + BUTTON, top: 0, bottom: 30, width: BUTTON, height: 30, x: left, y: 0, toJSON() {} }) as DOMRect;
      x += BUTTON + 4;
    });
  });
}

afterEach(() => { document.body.innerHTML = ''; vi.unstubAllGlobals(); });

describe('toolbar overflow', () => {
  it('moves a button to the "more" row when the gaps between groups push it past the edge', async () => {
    let observerCallback: (() => void) | null = null;
    vi.stubGlobal('ResizeObserver', class { constructor(cb: () => void) { observerCallback = cb; } observe() {} disconnect() {} });
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { cb(0); return 1; });
    const host = document.createElement('div');
    document.body.appendChild(host);
    const renderer = new ToolbarRenderer({ items: 'a b | c d | e f' }, [PLUGIN]);
    renderer.setCommandHandler(() => {});
    renderer.render(host);
    // Six 40px buttons in three groups need 6*44 + 2*30 = 324px. 300px of toolbar holds four
    // buttons by width (176px) but the group gaps put the fourth at 8+30+3*44+30... measured.
    layout(host, 300);
    observerCallback?.();
    const visible = Array.from(host.querySelectorAll<HTMLElement>('.editora-toolbar-items-container button[data-command]')).map((b) => b.dataset.command);
    const items = (host.querySelector('.editora-toolbar-items-container') as HTMLElement).getBoundingClientRect();
    // Every button left in the row ends inside it, short of the "more" button.
    host.querySelectorAll<HTMLElement>('.editora-toolbar-items-container button[data-command]').forEach((button) => {
      expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(items.left + 300 - 16 - 44);
    });
    expect(visible.length).toBeLessThan(6);
    renderer.destroy?.();
  });

  it('keeps every button when they all fit, without a "more" button', async () => {
    let observerCallback: (() => void) | null = null;
    vi.stubGlobal('ResizeObserver', class { constructor(cb: () => void) { observerCallback = cb; } observe() {} disconnect() {} });
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { cb(0); return 1; });
    const host = document.createElement('div');
    document.body.appendChild(host);
    const renderer = new ToolbarRenderer({ items: 'a b | c d | e f' }, [PLUGIN]);
    renderer.setCommandHandler(() => {});
    renderer.render(host);
    layout(host, 400);
    observerCallback?.();
    expect(host.querySelectorAll('.editora-toolbar-items-container button[data-command]')).toHaveLength(6);
    expect((host.querySelector('.editora-toolbar-more-button') as HTMLElement).style.display).toBe('none');
    renderer.destroy?.();
  });
});
