import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../../../ui-core/src/components/ui-chart';
import { Chart } from '../components/Chart';

describe('Chart wrapper', () => {
  it('forwards multi-series and value formatting props to the host element', () => {
    const series = [
      {
        name: 'Revenue',
        tone: '#2f7ef7',
        data: [
          { label: 'Jan', value: 12 },
          { label: 'Feb', value: 18 }
        ]
      }
    ];

    const { container } = render(
      <Chart type="area" series={series} valueSuffix="%" showSummary={false}>
        <div slot="header">Filters</div>
      </Chart>
    );

    const el = container.querySelector('ui-chart') as HTMLElement | null;
    expect(el?.getAttribute('type')).toBe('area');
    expect(el?.getAttribute('series')).toBe(JSON.stringify(series));
    expect(el?.getAttribute('value-suffix')).toBe('%');
    expect(el?.getAttribute('show-summary')).toBe('false');
  });

  it('exposes a compound header slot component', () => {
    const { container } = render(
      <Chart.Root
        data={[
          { label: 'Jan', value: 12 },
          { label: 'Feb', value: 18 }
        ]}
      >
        <Chart.Header data-testid="chart-header">Filters</Chart.Header>
      </Chart.Root>
    );

    const el = container.querySelector('ui-chart') as HTMLElement | null;
    const header = el?.querySelector('[slot="header"]') as HTMLDivElement | null;
    expect(header?.textContent).toBe('Filters');
    expect(header?.getAttribute('data-testid')).toBe('chart-header');
  });

  it('exposes compound title and subtitle slot components', () => {
    const { container } = render(
      <Chart.Root data={[{ label: 'Jan', value: 12 }]}>
        <Chart.Title data-testid="chart-title">Revenue comparison</Chart.Title>
        <Chart.Subtitle data-testid="chart-subtitle">Last 12 months</Chart.Subtitle>
      </Chart.Root>
    );

    const el = container.querySelector('ui-chart') as HTMLElement | null;
    const title = el?.querySelector('[slot="title"]') as HTMLHeadingElement | null;
    const subtitle = el?.querySelector('[slot="subtitle"]') as HTMLParagraphElement | null;
    expect(title?.textContent).toBe('Revenue comparison');
    expect(title?.getAttribute('data-testid')).toBe('chart-title');
    expect(subtitle?.textContent).toBe('Last 12 months');
    expect(subtitle?.getAttribute('data-testid')).toBe('chart-subtitle');
  });

  it('bridges extended point select detail events', () => {
    const onPointSelect = vi.fn();
    const { container } = render(
      <Chart
        data={[
          { label: 'Jan', value: 12 },
          { label: 'Feb', value: 18 }
        ]}
        onPointSelect={onPointSelect}
      />
    );

    const el = container.querySelector('ui-chart') as HTMLElement | null;
    fireEvent(
      el as HTMLElement,
      new CustomEvent('ui-point-select', {
        detail: {
          index: 1,
          label: 'Feb',
          value: 18,
          series: 'Revenue',
          seriesValues: [{ series: 'Revenue', value: 18, tone: '#2f7ef7' }],
          type: 'line',
          total: 30,
          min: 12,
          max: 18
        },
        bubbles: true
      })
    );

    expect(onPointSelect).toHaveBeenCalledWith({
      index: 1,
      label: 'Feb',
      value: 18,
      series: 'Revenue',
      seriesValues: [{ series: 'Revenue', value: 18, tone: '#2f7ef7' }],
      type: 'line',
      total: 30,
      min: 12,
      max: 18
    });
  });
});
