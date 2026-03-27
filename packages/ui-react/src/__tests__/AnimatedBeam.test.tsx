import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-animated-beam';
import { AnimatedBeam } from '../components/AnimatedBeam';

describe('AnimatedBeam wrapper', () => {
  it('forwards beam attributes and compound markers to the host and children', () => {
    const { container } = render(
      <AnimatedBeam
        animation="heartbeat"
        variant="glass"
        tone="info"
        size="lg"
        radius={28}
        elevation="high"
        columns={3}
        rows={5}
        padding={36}
        columnGap={180}
        rowGap={84}
        minHeight={420}
        nodeSize={88}
        hubSize={124}
        duration={2800}
        delay={120}
        stagger={90}
        trailWidth={4}
        beamWidth={6}
        beamFactor={0.22}
        path={false}
        glow={false}
        nodeEffect="glow"
        autoFit
        paused
        repeat={false}
        reverse
        direction="reverse"
        colorStart="#7c3aed"
        colorEnd="#fb923c"
        trailColor="rgba(148, 163, 184, 0.22)"
        curve="arc"
      >
        <AnimatedBeam.Node nodeId="source" column={1} row={3}>
          Source
        </AnimatedBeam.Node>
        <AnimatedBeam.Hub nodeId="hub" column={2} row={3}>
          Hub
        </AnimatedBeam.Hub>
        <AnimatedBeam.Node nodeId="target" column={3} row={1}>
          Target
        </AnimatedBeam.Node>
        <AnimatedBeam.Connection from="source" to="hub" />
        <AnimatedBeam.Connection from="hub" to="target" curve="arc" direction="reverse" />
      </AnimatedBeam>
    );

    const el = container.querySelector('ui-animated-beam') as HTMLElement | null;
    expect(el?.getAttribute('animation')).toBe('heartbeat');
    expect(el?.getAttribute('variant')).toBe('glass');
    expect(el?.getAttribute('tone')).toBe('info');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('28');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('columns')).toBe('3');
    expect(el?.getAttribute('rows')).toBe('5');
    expect(el?.getAttribute('padding')).toBe('36px');
    expect(el?.getAttribute('column-gap')).toBe('180px');
    expect(el?.getAttribute('row-gap')).toBe('84px');
    expect(el?.getAttribute('min-height')).toBe('420px');
    expect(el?.getAttribute('node-size')).toBe('88px');
    expect(el?.getAttribute('hub-size')).toBe('124px');
    expect(el?.getAttribute('duration')).toBe('2800ms');
    expect(el?.getAttribute('delay')).toBe('120ms');
    expect(el?.getAttribute('stagger')).toBe('90ms');
    expect(el?.getAttribute('trail-width')).toBe('4px');
    expect(el?.getAttribute('beam-width')).toBe('6px');
    expect(el?.getAttribute('beam-factor')).toBe('0.22');
    expect(el?.getAttribute('path')).toBe('false');
    expect(el?.getAttribute('glow')).toBe('false');
    expect(el?.getAttribute('node-effect')).toBe('glow');
    expect(el?.getAttribute('auto-fit')).toBe('true');
    expect(el?.getAttribute('repeat')).toBe('false');
    expect(el?.hasAttribute('paused')).toBe(true);
    expect(el?.hasAttribute('reverse')).toBe(true);
    expect(el?.getAttribute('direction')).toBe('reverse');
    expect(el?.getAttribute('color-start')).toBe('#7c3aed');
    expect(el?.getAttribute('color-end')).toBe('#fb923c');
    expect(el?.getAttribute('trail-color')).toBe('rgba(148, 163, 184, 0.22)');
    expect(el?.getAttribute('curve')).toBe('arc');
    expect(container.querySelectorAll('[data-ui-animated-beam-node]').length).toBe(2);
    expect(container.querySelector('[slot="hub"]')?.hasAttribute('data-ui-animated-beam-hub')).toBe(true);
    expect(container.querySelectorAll('[slot="connections"]').length).toBe(2);
    expect(container.querySelectorAll('[slot="connections"]')[1]?.getAttribute('direction')).toBe('reverse');
  });

  it('exposes the imperative API through the React ref', () => {
    const ref = React.createRef<HTMLElement & { play(): void; pause(): void; refresh(): void }>();
    render(
      <AnimatedBeam ref={ref}>
        <AnimatedBeam.Node nodeId="source">Source</AnimatedBeam.Node>
        <AnimatedBeam.Hub nodeId="hub">Hub</AnimatedBeam.Hub>
        <AnimatedBeam.Connection from="source" to="hub" />
      </AnimatedBeam>
    );

    ref.current?.pause();
    expect(ref.current?.hasAttribute('paused')).toBe(true);

    ref.current?.play();
    expect(ref.current?.hasAttribute('paused')).toBe(false);

    ref.current?.refresh();
    expect(ref.current).not.toBeNull();
  });
});
