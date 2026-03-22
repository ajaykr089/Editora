import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-dock';
import { Dock } from '../components/Dock';

describe('Dock wrapper', () => {
  it('forwards dock attributes to the host element', () => {
    const { container } = render(
      <Dock
        orientation="vertical"
        magnification={2.1}
        distance={140}
        idleScale={0.94}
        lift={26}
        smoothing={0.24}
        animation="snappy"
        gap={14}
        padding="12 16"
        itemSize={62}
        labelMode="always"
        labelPlacement="start"
        variant="glass"
        tone="info"
        size="xl"
        radius={24}
        elevation="high"
      >
        <Dock.Item label="Home">H</Dock.Item>
        <Dock.Item label="Search">S</Dock.Item>
      </Dock>
    );

    const el = container.querySelector('ui-dock') as HTMLElement | null;
    expect(el?.getAttribute('orientation')).toBe('vertical');
    expect(el?.getAttribute('magnification')).toBe('2.1');
    expect(el?.getAttribute('distance')).toBe('140');
    expect(el?.getAttribute('idle-scale')).toBe('0.94');
    expect(el?.getAttribute('lift')).toBe('26');
    expect(el?.getAttribute('smoothing')).toBe('0.24');
    expect(el?.getAttribute('animation')).toBe('snappy');
    expect(el?.getAttribute('gap')).toBe('14px');
    expect(el?.getAttribute('padding')).toBe('12px 16px');
    expect(el?.getAttribute('item-size')).toBe('62px');
    expect(el?.getAttribute('label-mode')).toBe('always');
    expect(el?.getAttribute('label-placement')).toBe('start');
    expect(el?.getAttribute('variant')).toBe('glass');
    expect(el?.getAttribute('tone')).toBe('info');
    expect(el?.getAttribute('size')).toBe('xl');
    expect(el?.getAttribute('radius')).toBe('24');
    expect(el?.getAttribute('elevation')).toBe('high');
  });

  it('renders Dock.Item with dock markers and accessibility attributes', () => {
    const { container } = render(
      <Dock>
        <Dock.Item value="inbox" label="Inbox" badge="9" active>
          I
        </Dock.Item>
      </Dock>
    );

    const item = container.querySelector('[data-ui-dock-item]') as HTMLElement | null;
    expect(item?.getAttribute('data-value')).toBe('inbox');
    expect(item?.hasAttribute('data-active')).toBe(true);
    expect(item?.getAttribute('aria-label')).toBe('Inbox');
    expect(item?.getAttribute('title')).toBe('Inbox');
    expect(item?.querySelector('[data-ui-dock-icon]')?.textContent).toBe('I');
    expect(item?.querySelector('[data-ui-dock-label]')?.textContent).toBe('Inbox');
    expect(item?.querySelector('[data-ui-dock-badge]')?.textContent).toBe('9');
  });

  it('exposes the custom element imperative API through the React ref', async () => {
    const ref = React.createRef<
      HTMLElement & { refresh(): void; focusItem(target: number | string): void; clearActive(): void }
    >();
    render(
      <Dock ref={ref}>
        <Dock.Item value="home" label="Home">
          H
        </Dock.Item>
        <Dock.Item value="docs" label="Docs">
          D
        </Dock.Item>
      </Dock>
    );

    await new Promise((resolve) => setTimeout(resolve, 24));
    ref.current?.refresh();
    ref.current?.focusItem('docs');
    await new Promise((resolve) => setTimeout(resolve, 24));

    const active = document.activeElement as HTMLElement | null;
    expect(active).toBe(ref.current?.querySelector('[data-value="docs"]') ?? null);

    ref.current?.clearActive();
    await new Promise((resolve) => setTimeout(resolve, 24));
    expect(ref.current?.getAttribute('data-state')).toBe('idle');
  });
});
