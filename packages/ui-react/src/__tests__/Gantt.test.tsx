import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../../../ui-core/src/components/ui-gantt';

import { Gantt } from '../components/Gantt';

const dayOffset = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// The chart spans today, so the today marker is drawn unless it is switched off.
const tasks = [
  { id: 'a', label: 'Design', start: dayOffset(-3), end: dayOffset(4) },
  { id: 'b', label: 'Build', start: dayOffset(2), end: dayOffset(12) },
];

const shadowOf = (container: HTMLElement) => (container.querySelector('ui-gantt') as HTMLElement).shadowRoot!;

describe('Gantt wrapper', () => {
  it('shows the toolbar and the today marker by default', async () => {
    const { container } = render(<Gantt tasks={tasks} />);
    await Promise.resolve();

    expect(shadowOf(container).querySelector('.toolbar')).not.toBeNull();
    expect(shadowOf(container).querySelector('.today')).not.toBeNull();
  });

  it('hides the toolbar and the today marker when they are set to false', async () => {
    const { container } = render(<Gantt tasks={tasks} showToolbar={false} showToday={false} />);
    await Promise.resolve();

    expect(shadowOf(container).querySelector('.toolbar')).toBeNull();
    expect(shadowOf(container).querySelector('.today')).toBeNull();
  });

  it('brings them back when the props go from false to true or undefined', async () => {
    const { container, rerender } = render(<Gantt tasks={tasks} showToolbar={false} showToday={false} />);
    await Promise.resolve();

    rerender(<Gantt tasks={tasks} showToolbar showToday={undefined} />);
    await Promise.resolve();

    expect(shadowOf(container).querySelector('.toolbar')).not.toBeNull();
    expect(shadowOf(container).querySelector('.today')).not.toBeNull();
  });

  it('passes weekStart through, including Sunday (0)', async () => {
    const { container, rerender } = render(<Gantt tasks={tasks} weekStart={1} />);
    await Promise.resolve();
    expect(container.querySelector('ui-gantt')!.getAttribute('week-start')).toBe('1');

    rerender(<Gantt tasks={tasks} weekStart={0} />);
    await Promise.resolve();
    expect(container.querySelector('ui-gantt')!.getAttribute('week-start')).toBe('0');

    rerender(<Gantt tasks={tasks} />);
    await Promise.resolve();
    expect(container.querySelector('ui-gantt')!.hasAttribute('week-start')).toBe(false);
  });

  it('passes zoom through, including fit, and reports it from the toolbar', async () => {
    const onZoomChange = vi.fn();
    const { container, rerender } = render(<Gantt tasks={tasks} zoom="fit" onZoomChange={onZoomChange} />);
    await Promise.resolve();
    const el = container.querySelector('ui-gantt') as HTMLElement;
    expect(el.getAttribute('zoom')).toBe('fit');
    expect(el.shadowRoot!.querySelector('.zoom-button[data-zoom="fit"]')!.getAttribute('aria-pressed')).toBe('true');

    (el.shadowRoot!.querySelector('.zoom-button[data-zoom="month"]') as HTMLButtonElement).click();
    expect(onZoomChange).toHaveBeenCalledWith({ zoom: 'month' }, expect.anything());

    rerender(<Gantt tasks={tasks} zoom="week" onZoomChange={onZoomChange} />);
    await Promise.resolve();
    expect(el.getAttribute('zoom')).toBe('week');
  });

  it('passes labels and locale through', async () => {
    const { container, rerender } = render(<Gantt tasks={tasks} labels={{ title: 'Planning', zoomWeek: 'semaine' }} locale="fr-FR" />);
    await Promise.resolve();
    const el = container.querySelector('ui-gantt') as HTMLElement;
    expect(el.getAttribute('locale')).toBe('fr-FR');
    expect(el.shadowRoot!.querySelector('.title')!.textContent).toContain('Planning');
    expect([...el.shadowRoot!.querySelectorAll('.zoom-button')].map((b) => b.textContent)).toContain('semaine');

    rerender(<Gantt tasks={tasks} />);
    await Promise.resolve();
    expect(el.hasAttribute('labels')).toBe(false);
    expect(el.hasAttribute('locale')).toBe(false);
    expect(el.shadowRoot!.querySelector('.title')!.textContent).toContain('Project schedule');
  });
});
