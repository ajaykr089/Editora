import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-animated-beam';

function wait(ms = 40) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-animated-beam', () => {
  it('positions nodes and renders animated paths between declared connections', async () => {
    const el = document.createElement('ui-animated-beam');
    el.setAttribute('columns', '3');
    el.setAttribute('rows', '5');
    el.setAttribute('duration', '2600ms');
    el.setAttribute('stagger', '120ms');
    el.setAttribute('path', 'false');
    el.innerHTML = `
      <button node-id="source" column="1" row="3">Source</button>
      <button node-id="target-a" column="3" row="1">Target A</button>
      <button node-id="target-b" column="3" row="5">Target B</button>
      <div slot="hub" node-id="hub" column="2" row="3">Hub</div>
      <div slot="connections" from="source" to="hub"></div>
      <div slot="connections" from="hub" to="target-a" curve="arc"></div>
      <div slot="connections" from="hub" to="target-b"></div>
    `;
    document.body.appendChild(el);
    await wait();

    const nodes = Array.from(el.children).filter((child) => child.getAttribute('slot') !== 'connections') as HTMLElement[];
    const hub = el.querySelector('[slot="hub"]') as HTMLElement | null;
    const connectionGroups = el.shadowRoot?.querySelectorAll('.connection');
    const beamCore = el.shadowRoot?.querySelector('.beam-core') as SVGPathElement | null;

    expect(nodes).toHaveLength(4);
    expect(nodes.filter((node) => node.hasAttribute('data-ui-animated-beam-node')).length).toBe(3);
    expect(hub?.hasAttribute('data-ui-animated-beam-hub')).toBe(true);
    expect(nodes[0]?.style.left).toContain('px');
    expect(nodes[0]?.style.top).toContain('px');
    expect(connectionGroups?.length).toBe(3);
    expect(beamCore?.getAttribute('d')).toContain('M ');
    expect(el.getAttribute('data-state')).toBe('running');
    expect(el.getAttribute('data-path-visible')).toBe('false');
    expect(el.getAttribute('data-connection-count')).toBe('3');
  });

  it('supports pause, play, and runtime style synchronization', async () => {
    const el = document.createElement('ui-animated-beam') as HTMLElement & {
      play(): void;
      pause(): void;
      refresh(): void;
    };
    el.setAttribute('size', 'lg');
    el.setAttribute('animation', 'surge');
    el.setAttribute('duration', '4000ms');
    el.setAttribute('delay', '150ms');
    el.setAttribute('stagger', '80ms');
    el.setAttribute('node-size', '92');
    el.setAttribute('hub-size', '128');
    el.setAttribute('trail-width', '5');
    el.setAttribute('beam-width', '7');
    el.setAttribute('repeat', 'false');
    el.setAttribute('direction', 'reverse');
    el.innerHTML = `
      <div node-id="start" column="1" row="2">A</div>
      <div slot="hub" node-id="hub" column="2" row="2">Hub</div>
      <div node-id="end" column="3" row="2">B</div>
      <div slot="connections" from="start" to="hub"></div>
      <div slot="connections" from="hub" to="end" direction="forward"></div>
    `;
    document.body.appendChild(el);
    await wait();
    const connectionGroups = Array.from(el.shadowRoot?.querySelectorAll('.connection') || []);
    const getIterationCount = (index: number) => {
      const style = connectionGroups[index]?.getAttribute('style') || '';
      const match = style.match(/--ui-animated-beam-iteration-count:([^;]+);/);
      return match ? match[1] : '';
    };
    const getProgressOffset = (index: number) => {
      const style = connectionGroups[index]?.getAttribute('style') || '';
      const match = style.match(/--ui-animated-beam-progress-offset:([0-9.-]+);/);
      return match ? Number.parseFloat(match[1]) : NaN;
    };

    expect(el.style.getPropertyValue('--ui-animated-beam-duration')).toBe('2720ms');
    expect(el.style.getPropertyValue('--ui-animated-beam-delay')).toBe('150ms');
    expect(el.style.getPropertyValue('--ui-animated-beam-required-width')).toMatch(/px$/);
    expect(el.style.getPropertyValue('--ui-animated-beam-node-size')).toBe('92px');
    expect(el.style.getPropertyValue('--ui-animated-beam-hub-size')).toBe('128px');
    expect(el.style.getPropertyValue('--ui-animated-beam-trail-width')).toBe('5px');
    expect(el.style.getPropertyValue('--ui-animated-beam-beam-width')).toBe('7px');
    expect(getIterationCount(0)).toBe('1');
    expect(getIterationCount(1)).toBe('1');
    expect(getProgressOffset(0)).toBeLessThan(0);
    expect(getProgressOffset(1)).toBe(0);

    el.pause();
    expect(el.hasAttribute('paused')).toBe(true);
    expect(el.getAttribute('data-state')).toBe('paused');

    el.play();
    expect(el.hasAttribute('paused')).toBe(false);
    expect(el.getAttribute('data-state')).toBe('running');

    el.refresh();
    expect(el.getAttribute('data-connection-count')).toBe('2');
  });

  it('publishes an intrinsic minimum width so tracks and nodes stay aligned in narrow parents', async () => {
    const el = document.createElement('ui-animated-beam');
    el.setAttribute('size', 'lg');
    el.setAttribute('columns', '3');
    el.setAttribute('rows', '3');
    el.innerHTML = `
      <div node-id="source" column="1" row="2">A</div>
      <div slot="hub" node-id="hub" column="2" row="2">Hub</div>
      <div node-id="target" column="3" row="2">B</div>
      <div slot="connections" from="source" to="hub"></div>
      <div slot="connections" from="hub" to="target"></div>
    `;
    document.body.appendChild(el);
    await wait();

    const surface = el.shadowRoot?.querySelector('.surface') as HTMLElement | null;
    const canvas = el.shadowRoot?.querySelector('.canvas') as HTMLElement | null;

    expect(el.style.getPropertyValue('--ui-animated-beam-required-width')).toBe('798px');
    expect(surface).not.toBeNull();
    expect(canvas).not.toBeNull();
  });

  it('can auto-fit the layout to a narrow parent width', async () => {
    const el = document.createElement('ui-animated-beam');
    el.setAttribute('size', 'lg');
    el.setAttribute('columns', '3');
    el.setAttribute('rows', '3');
    el.setAttribute('auto-fit', 'true');
    el.innerHTML = `
      <div node-id="source" column="1" row="2">A</div>
      <div slot="hub" node-id="hub" column="2" row="2">Hub</div>
      <div node-id="target" column="3" row="2">B</div>
      <div slot="connections" from="source" to="hub"></div>
      <div slot="connections" from="hub" to="target"></div>
    `;
    document.body.appendChild(el);
    await wait();

    Object.defineProperty(el, 'clientWidth', {
      configurable: true,
      value: 480,
    });

    const canvas = el.shadowRoot?.querySelector('.canvas') as HTMLElement | null;
    expect(canvas).not.toBeNull();
    canvas!.getBoundingClientRect = () =>
      ({
        width: 480,
        height: 0,
        top: 0,
        left: 0,
        right: 480,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    el.refresh();
    await wait();

    const target = el.querySelector('[node-id="target"]') as HTMLElement | null;
    expect(el.style.getPropertyValue('--ui-animated-beam-required-width')).toBe('0px');
    expect(Number.parseFloat(target?.style.left || '0')).toBeLessThan(480);
  });

  it('can animate destination nodes when the beam arrives', async () => {
    const el = document.createElement('ui-animated-beam');
    el.setAttribute('duration', '1000ms');
    el.setAttribute('node-effect', 'glow');
    el.innerHTML = `
      <div node-id="user" column="1" row="2">User</div>
      <div slot="hub" node-id="hub" column="2" row="2">Hub</div>
      <div node-id="drive" column="3" row="2">Drive</div>
      <div slot="connections" from="user" to="hub"></div>
      <div slot="connections" from="hub" to="drive"></div>
    `;
    document.body.appendChild(el);
    await wait();

    const user = el.querySelector('[node-id="user"]') as HTMLElement | null;
    const hub = el.querySelector('[node-id="hub"]') as HTMLElement | null;
    const drive = el.querySelector('[node-id="drive"]') as HTMLElement | null;
    const animationCss = el.shadowRoot?.querySelector('style[data-ui-animated-beam-animations]')?.textContent || '';
    const connectionGroups = Array.from(el.shadowRoot?.querySelectorAll('.connection') || []);
    const getCycleMs = (index: number) => {
      const style = connectionGroups[index]?.getAttribute('style') || '';
      const match = style.match(/--ui-animated-beam-cycle-duration:([0-9.]+)ms/);
      return match ? Number.parseFloat(match[1]) : NaN;
    };

    expect(user?.style.getPropertyValue('--ui-animated-beam-node-effect-name')).toBe('');
    expect(hub?.style.getPropertyValue('--ui-animated-beam-node-effect-name')).toContain('node-effect');
    expect(drive?.style.getPropertyValue('--ui-animated-beam-node-effect-name')).toContain('node-effect');
    expect(getCycleMs(0)).toBe(2360);
    expect(getCycleMs(1)).toBe(2360);
    expect(animationCss).toContain('@keyframes');
  });

  it('waits for the upstream path before starting sibling fan-out connections', async () => {
    const el = document.createElement('ui-animated-beam');
    el.setAttribute('duration', '1000ms');
    el.innerHTML = `
      <div node-id="user" column="1" row="2">User</div>
      <div slot="hub" node-id="hub" column="2" row="2">Hub</div>
      <div node-id="drive" column="3" row="1">Drive</div>
      <div node-id="docs" column="3" row="3">Docs</div>
      <div slot="connections" from="user" to="hub"></div>
      <div slot="connections" from="hub" to="drive"></div>
      <div slot="connections" from="hub" to="docs"></div>
    `;
    document.body.appendChild(el);
    await wait();

    const connectionGroups = Array.from(el.shadowRoot?.querySelectorAll('.connection') || []);
    const getDelayMs = (index: number) => {
      const style = connectionGroups[index]?.getAttribute('style') || '';
      const match = style.match(/--ui-animated-beam-connection-delay:([0-9.]+)ms/);
      return match ? Number.parseFloat(match[1]) : NaN;
    };
    const getCycleMs = (index: number) => {
      const style = connectionGroups[index]?.getAttribute('style') || '';
      const match = style.match(/--ui-animated-beam-cycle-duration:([0-9.]+)ms/);
      return match ? Number.parseFloat(match[1]) : NaN;
    };
    const getBeamPath = (index: number) => connectionGroups[index]?.querySelector('.beam-core')?.getAttribute('d') || '';
    const getTrackPath = (index: number) => connectionGroups[index]?.querySelector('.trail')?.getAttribute('d') || '';

    expect(getDelayMs(0)).toBe(0);
    expect(getDelayMs(1)).toBe(1000);
    expect(getDelayMs(2)).toBe(1000);
    expect(getCycleMs(0)).toBe(2000);
    expect(getCycleMs(1)).toBe(2000);
    expect(getCycleMs(2)).toBe(2000);
    expect(connectionGroups).toHaveLength(3);
    expect(getBeamPath(1)).toBe(getTrackPath(1));
    expect(getBeamPath(2)).toBe(getTrackPath(2));
  });
});
