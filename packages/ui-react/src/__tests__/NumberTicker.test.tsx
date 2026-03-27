import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-number-ticker';
import { NumberTicker, type NumberTickerElement } from '../components/NumberTicker';

describe('NumberTicker wrapper', () => {
  it('forwards number-ticker attributes to the host element', () => {
    const { container } = render(
      <NumberTicker
        value={12842}
        from={12000}
        duration={1400}
        delay={120}
        easing="ease-in-out"
        animation="odometer"
        trigger="visible"
        visibilityThreshold={0.6}
        stagger={24}
        staggerFrom="center"
        locale="en-US"
        formatStyle="currency"
        currency="USD"
        currencyDisplay="code"
        notation="compact"
        compactDisplay="long"
        fractionDigits={1}
        useGrouping={false}
        signDisplay="always"
        prefix="~"
        suffix=" ARR"
        tone="success"
        size="lg"
        align="center"
        fontSize={44}
        fontWeight={820}
        letterSpacing={-1}
        color="#123456"
        tabular={false}
        monospace
        paused
        pauseOnHover
        pauseOnFocus
      />
    );

    const el = container.querySelector('ui-number-ticker') as HTMLElement | null;
    expect(el?.getAttribute('value')).toBe('12842');
    expect(el?.getAttribute('from')).toBe('12000');
    expect(el?.getAttribute('duration')).toBe('1400ms');
    expect(el?.getAttribute('delay')).toBe('120ms');
    expect(el?.getAttribute('easing')).toBe('ease-in-out');
    expect(el?.getAttribute('animation')).toBe('odometer');
    expect(el?.getAttribute('trigger')).toBe('visible');
    expect(el?.getAttribute('visibility-threshold')).toBe('0.6');
    expect(el?.getAttribute('stagger')).toBe('24ms');
    expect(el?.getAttribute('stagger-from')).toBe('center');
    expect(el?.getAttribute('locale')).toBe('en-US');
    expect(el?.getAttribute('format-style')).toBe('currency');
    expect(el?.getAttribute('currency')).toBe('USD');
    expect(el?.getAttribute('currency-display')).toBe('code');
    expect(el?.getAttribute('notation')).toBe('compact');
    expect(el?.getAttribute('compact-display')).toBe('long');
    expect(el?.getAttribute('fraction-digits')).toBe('1');
    expect(el?.getAttribute('use-grouping')).toBe('false');
    expect(el?.getAttribute('sign-display')).toBe('always');
    expect(el?.getAttribute('prefix')).toBe('~');
    expect(el?.getAttribute('suffix')).toBe(' ARR');
    expect(el?.getAttribute('tone')).toBe('success');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('align')).toBe('center');
    expect(el?.getAttribute('font-size')).toBe('44px');
    expect(el?.getAttribute('font-weight')).toBe('820');
    expect(el?.getAttribute('letter-spacing')).toBe('-1px');
    expect(el?.getAttribute('color')).toBe('#123456');
    expect(el?.getAttribute('tabular')).toBe('false');
    expect(el?.hasAttribute('monospace')).toBe(true);
    expect(el?.hasAttribute('paused')).toBe(true);
    expect(el?.hasAttribute('pause-on-hover')).toBe(true);
    expect(el?.hasAttribute('pause-on-focus')).toBe(true);
  });

  it('exposes the imperative API through the React ref', () => {
    const ref = React.createRef<NumberTickerElement>();
    render(<NumberTicker ref={ref} value={42} from={0} />);

    ref.current?.pause();
    expect(ref.current?.hasAttribute('paused')).toBe(true);

    ref.current?.play();
    expect(ref.current?.hasAttribute('paused')).toBe(false);

    ref.current?.refresh();
    ref.current?.finish();
    expect(ref.current).not.toBeNull();
  });

  it('assigns a formatter callback to the custom element property', () => {
    const formatter = (value: number, context: { formatted: string }) => `${context.formatted} users`;
    const { container } = render(<NumberTicker value={42} from={0} formatter={formatter} />);

    const el = container.querySelector('ui-number-ticker') as NumberTickerElement | null;
    expect(el?.formatter).toBe(formatter);
  });
});
