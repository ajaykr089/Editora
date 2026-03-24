import React from 'react';
import { render } from '@testing-library/react';
import '../../../ui-core/src/components/ui-placement-grid';
import { PlacementGrid, type PlacementGridElement } from '../components/PlacementGrid';

async function flushRender() {
  await Promise.resolve();
  await Promise.resolve();
}

describe('PlacementGrid wrapper', () => {
  it('forwards placement grid attributes and item data attributes', async () => {
    const { container } = render(
      <PlacementGrid columns="repeat(3, minmax(0, 1fr))" gap="12px" order="row-major" interactive draggable>
        <PlacementGrid.Item value="hero" row={1} column={2} columnSpan={2} label="Hero card">
          Hero
        </PlacementGrid.Item>
      </PlacementGrid>
    );
    await flushRender();

    const host = container.querySelector('ui-placement-grid') as HTMLElement | null;
    const item = container.querySelector('[data-ui-placement-item]') as HTMLElement | null;

    expect(host?.getAttribute('columns')).toBe('repeat(3, minmax(0, 1fr))');
    expect(host?.getAttribute('gap')).toBe('12px');
    expect(host?.getAttribute('order')).toBe('row-major');
    expect(host?.hasAttribute('interactive')).toBe(true);
    expect(host?.hasAttribute('draggable')).toBe(true);

    expect(item?.getAttribute('data-value')).toBe('hero');
    expect(item?.getAttribute('data-row')).toBe('1');
    expect(item?.getAttribute('data-column')).toBe('2');
    expect(item?.getAttribute('data-column-span')).toBe('2');
    expect(item?.getAttribute('aria-label')).toBe('Hero card');
  });

  it('exposes the custom element imperative API through the React ref', async () => {
    const ref = React.createRef<PlacementGridElement>();
    render(
      <PlacementGrid ref={ref} columns="2" interactive>
        <PlacementGrid.Item value="alpha" row={1} column={1}>
          Alpha
        </PlacementGrid.Item>
        <PlacementGrid.Item value="beta" row={1} column={2}>
          Beta
        </PlacementGrid.Item>
      </PlacementGrid>
    );

    await flushRender();
    ref.current?.focusItem('beta');
    await flushRender();

    const active = document.activeElement as HTMLElement | null;
    expect(active?.getAttribute('data-value')).toBe('beta');
  });
});
