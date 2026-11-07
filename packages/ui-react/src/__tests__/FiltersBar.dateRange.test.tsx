import React from 'react';
import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FiltersBar, commonDateRangePresets, type FiltersBarDateRange } from '../index';

const settle = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 10)); });
afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('FiltersBar date range', () => {
  it('computes the common presets in local time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 10, 12)); // 10 Feb 2026, local
    const ranges = Object.fromEntries(commonDateRangePresets.map((preset) => [preset.label, typeof preset.range === 'function' ? preset.range() : preset.range]));
    expect(ranges['Last 7 days']).toEqual({ start: '2026-02-04', end: '2026-02-10' });
    expect(ranges['Last 30 days']).toEqual({ start: '2026-01-12', end: '2026-02-10' });
    expect(ranges['This month']).toEqual({ start: '2026-02-01', end: '2026-02-28' });
    expect(ranges['Last month']).toEqual({ start: '2026-01-01', end: '2026-01-31' });
    expect(ranges['This year']).toEqual({ start: '2026-01-01', end: '2026-12-31' });
  });

  it('shows a picker and preset buttons that set the range and show which one is active', async () => {
    const presets = [
      { label: 'Q1', range: { start: '2026-01-01', end: '2026-03-31' } },
      { label: 'Q2', range: { start: '2026-04-01', end: '2026-06-30' } },
    ];
    function Harness({ onChange }: { onChange: (range: FiltersBarDateRange | null) => void }) {
      const [range, setRange] = React.useState<FiltersBarDateRange | null>(null);
      return (
        <FiltersBar
          dateRange={range}
          dateRangeLabel="Period"
          dateRangePresets={presets}
          onDateRangeChange={(next) => { setRange(next); onChange(next); }}
        />
      );
    }
    const onChange = vi.fn();
    const { container, getByRole } = render(<Harness onChange={onChange} />);
    await settle();
    expect(container.querySelector('ui-date-range-picker')!.getAttribute('label')).toBe('Period');
    const group = getByRole('group', { name: 'Period presets' });
    const q2 = Array.from(group.querySelectorAll('ui-button')).find((button) => button.textContent === 'Q2')!;
    act(() => { (q2 as HTMLElement).click(); });
    await settle();
    expect(onChange).toHaveBeenCalledWith({ start: '2026-04-01', end: '2026-06-30' });
    expect(q2.getAttribute('aria-pressed')).toBe('true');
    expect(JSON.parse(container.querySelector('ui-date-range-picker')!.getAttribute('value')!)).toEqual({ start: '2026-04-01', end: '2026-06-30' });
  });

  it('has no date range unless onDateRangeChange is passed', async () => {
    const { container } = render(<FiltersBar dateRangePresets={commonDateRangePresets} />);
    await settle();
    expect(container.querySelector('ui-date-range-picker')).toBeNull();
    expect(container.querySelector('[role="group"]')).toBeNull();
  });
});
