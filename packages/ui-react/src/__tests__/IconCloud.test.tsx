import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-icon-cloud';
import { IconCloud, type IconCloudElement } from '../components/IconCloud';

describe('IconCloud wrapper', () => {
  it('forwards icon-cloud attributes to the host element', () => {
    const { container } = render(
      <IconCloud
        radius={128}
        perspective={980}
        depth={0.9}
        speed={1.8}
        direction="counterclockwise"
        itemSize={58}
        centerSize={122}
        padding="22 26"
        variant="glass"
        tone="info"
        size="lg"
        surfaceRadius={34}
        elevation="high"
        interactive
        autoFit
        paused
        pauseOnHover
        pauseOnItemHover
        pauseOnFocus
      >
        <IconCloud.Center>Core</IconCloud.Center>
        <IconCloud.Item clickable aria-label="Search">S</IconCloud.Item>
        <IconCloud.Item>Trust</IconCloud.Item>
      </IconCloud>
    );

    const el = container.querySelector('ui-icon-cloud') as HTMLElement | null;
    expect(el?.getAttribute('radius')).toBe('128px');
    expect(el?.getAttribute('perspective')).toBe('980px');
    expect(el?.getAttribute('depth')).toBe('0.9');
    expect(el?.getAttribute('speed')).toBe('1.8');
    expect(el?.getAttribute('direction')).toBe('counterclockwise');
    expect(el?.getAttribute('item-size')).toBe('58px');
    expect(el?.getAttribute('center-size')).toBe('122px');
    expect(el?.getAttribute('padding')).toBe('22px 26px');
    expect(el?.getAttribute('variant')).toBe('glass');
    expect(el?.getAttribute('tone')).toBe('info');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('surface-radius')).toBe('34px');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.hasAttribute('interactive')).toBe(true);
    expect(el?.hasAttribute('auto-fit')).toBe(true);
    expect(el?.hasAttribute('paused')).toBe(true);
    expect(el?.hasAttribute('pause-on-hover')).toBe(true);
    expect(el?.hasAttribute('pause-on-item-hover')).toBe(true);
    expect(el?.hasAttribute('pause-on-focus')).toBe(true);
    expect(container.querySelector('[slot="center"]')?.hasAttribute('data-ui-icon-cloud-center')).toBe(true);
    expect(container.querySelectorAll('[data-ui-icon-cloud-item]').length).toBe(2);
    expect(container.querySelector('[data-ui-icon-cloud-clickable]')?.tagName).toBe('BUTTON');
  });

  it('exposes the imperative API through the React ref', () => {
    const ref = React.createRef<IconCloudElement>();
    render(
      <IconCloud ref={ref}>
        <IconCloud.Item>One</IconCloud.Item>
      </IconCloud>
    );

    ref.current?.pause();
    expect(ref.current?.hasAttribute('paused')).toBe(true);

    ref.current?.play();
    expect(ref.current?.hasAttribute('paused')).toBe(false);

    ref.current?.refresh();
    expect(ref.current).not.toBeNull();
    expect(ref.current?.hasAttribute('interactive')).toBe(true);
  });

  it('renders clickable items as interactive elements when requested', () => {
    const { container } = render(
      <IconCloud>
        <IconCloud.Item clickable aria-label="Open search">
          Search
        </IconCloud.Item>
      </IconCloud>
    );

    const button = container.querySelector('button[data-ui-icon-cloud-clickable]');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('aria-label')).toBe('Open search');
  });
});
