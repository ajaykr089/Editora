import { describe, expect, it } from 'vitest';
import '../components/ui-placement-grid';

async function flushRender() {
  await Promise.resolve();
  await Promise.resolve();
}

describe('ui-placement-grid', () => {
  it('applies explicit row, column, and span placement to slotted items', async () => {
    const el = document.createElement('ui-placement-grid') as HTMLElement;
    el.innerHTML = `
      <article data-ui-placement-item data-value="hero" data-row="1" data-column="2" data-column-span="2">Hero</article>
      <article data-ui-placement-item data-value="side" data-row="2" data-column="1" data-row-span="2">Side</article>
    `;

    document.body.appendChild(el);
    await flushRender();

    const hero = el.querySelector('[data-value="hero"]') as HTMLElement | null;
    const side = el.querySelector('[data-value="side"]') as HTMLElement | null;
    expect(hero?.style.gridColumn).toBe('2 / span 2');
    expect(hero?.style.gridRow).toBe('1 / span 1');
    expect(side?.style.gridColumn).toBe('1 / span 1');
    expect(side?.style.gridRow).toBe('2 / span 2');

    el.remove();
  });

  it('can reorder DOM children to match row-major visual order', async () => {
    const el = document.createElement('ui-placement-grid') as HTMLElement;
    el.setAttribute('order', 'row-major');
    el.innerHTML = `
      <article data-ui-placement-item data-value="second" data-row="2" data-column="1">Second</article>
      <article data-ui-placement-item data-value="first" data-row="1" data-column="1">First</article>
    `;

    document.body.appendChild(el);
    await flushRender();

    const values = Array.from(el.children).map((child) => (child as HTMLElement).getAttribute('data-value'));
    expect(values).toEqual(['first', 'second']);

    el.remove();
  });

  it('supports keyboard navigation and keyboard-based repositioning', async () => {
    const el = document.createElement('ui-placement-grid') as HTMLElement & {
      focusItem(target: number | string): void;
    };
    el.setAttribute('interactive', '');
    el.setAttribute('draggable', '');
    el.setAttribute('columns', '2');
    el.innerHTML = `
      <button data-ui-placement-item data-value="alpha" data-row="1" data-column="1">Alpha</button>
      <button data-ui-placement-item data-value="beta" data-row="1" data-column="2">Beta</button>
    `;

    document.body.appendChild(el);
    await flushRender();

    const alpha = el.querySelector('[data-value="alpha"]') as HTMLElement;
    const beta = el.querySelector('[data-value="beta"]') as HTMLElement;

    el.focusItem('alpha');
    await flushRender();
    alpha.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flushRender();

    expect(document.activeElement).toBe(beta);

    beta.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true, bubbles: true }));
    await flushRender();

    expect(beta.getAttribute('data-row')).toBe('2');

    el.remove();
  });
});
