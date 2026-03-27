import React from 'react';
import { act, render } from '@testing-library/react';
import { vi } from 'vitest';
import { AnimatedNumber, useAnimatedNumber, useAnimatedNumberValue } from '../components/AnimatedNumber';

vi.mock('../components/_internals', () => ({
  warnIfElementNotRegistered: vi.fn(),
}));

describe('AnimatedNumber', () => {
  beforeAll(() => {
    if (!customElements.get('ui-odometer')) {
      class MockUIOdometer extends HTMLElement {
        static get observedAttributes() {
          return [
            'value',
            'variant',
            'size',
            'tone',
            'theme',
            'format',
            'locale',
            'currency',
            'notation',
            'decimals',
            'minimum-fraction-digits',
            'maximum-fraction-digits',
            'duration',
            'animation',
            'direction',
            'animate',
            'animate-on-mount',
            'count-up',
            'prefix',
            'suffix',
            'decimal-separator',
            'group-separator',
            'label',
          ];
        }

        private _value = 0;

        connectedCallback() {
          this.attachShadow({ mode: 'open' });
          this.render();
        }

        attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
          if (name === 'value' && newValue !== null) {
            this._value = parseFloat(newValue) || 0;
          }
          this.render();
        }

        render() {
          if (!this.shadowRoot) return;
          this.shadowRoot.innerHTML = `<span class="value">${this._value}</span>`;
        }
      }

      customElements.define('ui-odometer', MockUIOdometer);
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with the inline variant by default', () => {
    const { container } = render(<AnimatedNumber value={1234} />);
    const host = container.querySelector('ui-odometer');

    expect(host?.getAttribute('value')).toBe('1234');
    expect(host?.getAttribute('variant')).toBe('inline');
  });

  it('supports explicit variants', () => {
    const { container, rerender } = render(<AnimatedNumber value={42} variant="digital" />);
    let host = container.querySelector('ui-odometer');
    expect(host?.getAttribute('variant')).toBe('digital');

    rerender(<AnimatedNumber value={42} variant="analog" />);
    host = container.querySelector('ui-odometer');
    expect(host?.getAttribute('variant')).toBe('analog');

    rerender(<AnimatedNumber value={42} variant="odometer" />);
    host = container.querySelector('ui-odometer');
    expect(host?.getAttribute('variant')).toBe('odometer');
  });

  it('maps formatting props to host attributes', () => {
    const { container } = render(
      <AnimatedNumber
        value={1234.56}
        format="currency"
        currency="USD"
        locale="en-US"
        notation="compact"
        fractionDigits={2}
        decimalSeparator=","
        groupSeparator="."
        prefix="~"
        suffix="!"
      />
    );

    const host = container.querySelector('ui-odometer');
    expect(host?.getAttribute('format')).toBe('currency');
    expect(host?.getAttribute('currency')).toBe('USD');
    expect(host?.getAttribute('locale')).toBe('en-US');
    expect(host?.getAttribute('notation')).toBe('compact');
    expect(host?.getAttribute('minimum-fraction-digits')).toBe('2');
    expect(host?.getAttribute('maximum-fraction-digits')).toBe('2');
    expect(host?.getAttribute('decimal-separator')).toBe(',');
    expect(host?.getAttribute('group-separator')).toBe('.');
    expect(host?.getAttribute('prefix')).toBe('~');
    expect(host?.getAttribute('suffix')).toBe('!');
  });

  it('supports animation props and event handlers', () => {
    const handleComplete = vi.fn();
    const { container } = render(
      <AnimatedNumber
        value={100}
        animate
        animateOnMount
        animation="spring"
        duration={300}
        onComplete={handleComplete}
      />
    );

    const host = container.querySelector('ui-odometer');
    expect(host?.hasAttribute('animate')).toBe(true);
    expect(host?.hasAttribute('animate-on-mount')).toBe(true);
    expect(host?.getAttribute('animation')).toBe('spring');
    expect(host?.getAttribute('duration')).toBe('300');

    host?.dispatchEvent(new CustomEvent('complete', { detail: { value: 100 }, bubbles: true, composed: true }));
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('forwards refs and DOM attributes', () => {
    const ref = React.createRef<HTMLElement>();
    const { container } = render(<AnimatedNumber ref={ref} value={100} className="custom-class" data-testid="animated-number" />);
    const host = container.querySelector('ui-odometer');

    expect(ref.current?.tagName.toLowerCase()).toBe('ui-odometer');
    expect(host?.className).toContain('custom-class');
    expect(host?.getAttribute('data-testid')).toBe('animated-number');
  });
});

describe('useAnimatedNumberValue', () => {
  it('returns the initial state and control functions', () => {
    const TestComponent = () => {
      const { value, isAnimating, start, reset, stop } = useAnimatedNumberValue({ end: 100 });
      return (
        <>
          <div data-testid="value">{value}</div>
          <div data-testid="animating">{String(isAnimating)}</div>
          <button onClick={() => start()}>Start</button>
          <button onClick={() => reset()}>Reset</button>
          <button onClick={() => stop()}>Stop</button>
        </>
      );
    };

    const { container } = render(<TestComponent />);
    expect(Number(container.querySelector('[data-testid="value"]')?.textContent)).toBe(0);
    expect(container.querySelector('[data-testid="animating"]')?.textContent).toBe('false');
    expect(container.querySelectorAll('button')).toHaveLength(3);
  });

  it('does not restart auto-start animations on intermediate frames', async () => {
    const queuedFrames = new Map<number, FrameRequestCallback>();
    let nextFrameId = 1;

    const requestAnimationFrameSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        const id = nextFrameId++;
        queuedFrames.set(id, callback);
        return id;
      });

    const cancelAnimationFrameSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation((id: number) => {
        queuedFrames.delete(id);
      });

    try {
      const TestComponent = () => {
        const { value } = useAnimatedNumberValue({ end: 100, autoStart: true, duration: 100 });
        return <div data-testid="value">{Math.round(value)}</div>;
      };

      const { container } = render(<TestComponent />);
      expect(queuedFrames.size).toBe(1);

      await act(async () => {
        const [frameId, callback] = Array.from(queuedFrames.entries())[0];
        queuedFrames.delete(frameId);
        callback(0);
        await Promise.resolve();
      });

      await act(async () => {
        const [frameId, callback] = Array.from(queuedFrames.entries())[0];
        queuedFrames.delete(frameId);
        callback(50);
        await Promise.resolve();
      });

      expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(3);
      expect(cancelAnimationFrameSpy).not.toHaveBeenCalled();
      expect(queuedFrames.size).toBe(1);
      expect(Number(container.querySelector('[data-testid="value"]')?.textContent)).toBeGreaterThan(0);
      expect(Number(container.querySelector('[data-testid="value"]')?.textContent)).toBeLessThan(100);
    } finally {
      requestAnimationFrameSpy.mockRestore();
      cancelAnimationFrameSpy.mockRestore();
    }
  });
});

describe('useAnimatedNumber', () => {
  it('returns ref, value, and update helpers', () => {
    const TestComponent = () => {
      const { ref, value, setValue, increment, decrement, reset } = useAnimatedNumber({
        initialValue: 75,
        variant: 'digital',
      });

      return (
        <>
          <AnimatedNumber ref={ref} value={value} />
          <div data-testid="value">{value}</div>
          <button onClick={() => setValue(100)}>Set</button>
          <button onClick={() => increment(10)}>Increment</button>
          <button onClick={() => decrement(10)}>Decrement</button>
          <button onClick={() => reset()}>Reset</button>
        </>
      );
    };

    const { container } = render(<TestComponent />);
    const host = container.querySelector('ui-odometer');

    expect(Number(container.querySelector('[data-testid="value"]')?.textContent)).toBe(75);
    expect(host?.getAttribute('variant')).toBe('digital');
    expect(container.querySelectorAll('button')).toHaveLength(4);
  });
});

describe('AnimatedNumber display name', () => {
  it('has the correct displayName', () => {
    expect(AnimatedNumber.displayName).toBe('AnimatedNumber');
  });
});
