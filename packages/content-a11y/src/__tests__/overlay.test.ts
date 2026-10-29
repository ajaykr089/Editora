import { attachContentChecker } from '../overlay';

function editor(html: string): HTMLElement {
  document.body.innerHTML = `<div contenteditable="true">${html}</div>`;
  return document.querySelector<HTMLElement>('[contenteditable]')!;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('attachContentChecker', () => {
  it('shows one marker per element without touching the content', () => {
    const root = editor('<p><img src="x.png"></p><h2></h2><p><a href="/y">here</a></p>');
    const before = root.innerHTML;
    const checker = attachContentChecker(root, { live: false });
    const markers = Array.from(document.querySelectorAll<HTMLButtonElement>('.cax-marker'));
    expect(markers.map((marker) => marker.dataset.severity)).toEqual(['error', 'error', 'warning']);
    expect(markers[0].getAttribute('aria-label')).toMatch(/^Accessibility error: This image has no alt text\./);
    expect(root.innerHTML).toBe(before);
    expect(checker.result.errors).toBe(2);
    checker.destroy();
    expect(document.querySelector('.cax-layer')).toBeNull();
  });

  it('opens details, applies a fix with input, reports it for undo and re-checks', () => {
    const root = editor('<p><img src="x.png"></p>');
    const fixes: string[] = [];
    const checker = attachContentChecker(root, { live: false, onFix: ({ fix, beforeHTML }) => fixes.push(`${fix.label}|${beforeHTML}`) });
    document.querySelector<HTMLButtonElement>('.cax-marker')!.click();
    const popover = document.querySelector('.cax-pop')!;
    expect(popover.getAttribute('role')).toBe('dialog');
    expect(popover.textContent).toContain('WCAG 1.1.1 (A)');
    const input = popover.querySelector('input')!;
    expect(document.activeElement).toBe(input);
    input.value = 'A red bicycle';
    popover.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(root.innerHTML).toBe('<p><img src="x.png" alt="A red bicycle"></p>');
    expect(fixes).toEqual(['Write alt text|<p><img src="x.png"></p>']);
    expect(checker.result.issues).toHaveLength(0);
    expect(document.querySelector('.cax-marker')).toBeNull();
    expect(document.querySelector('.cax-pop')).toBeNull();
  });

  it('closes on Escape and returns focus to the marker', () => {
    const root = editor('<h2></h2>');
    attachContentChecker(root, { live: false });
    const marker = document.querySelector<HTMLButtonElement>('.cax-marker')!;
    marker.click();
    document.querySelector('.cax-pop')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('.cax-pop')).toBeNull();
    expect(document.activeElement).toBe(marker);
  });

  it('re-checks after typing, and can hide the markers', async () => {
    const root = editor('<p>Fine.</p>');
    const checker = attachContentChecker(root, { delay: 10 });
    expect(document.querySelector('.cax-marker')).toBeNull();
    root.innerHTML = '<p><a href="/x"></a></p>';
    root.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(document.querySelectorAll('.cax-marker')).toHaveLength(1);
    checker.setMarkersVisible(false);
    expect(document.querySelector('.cax-marker')).toBeNull();
  });
});
