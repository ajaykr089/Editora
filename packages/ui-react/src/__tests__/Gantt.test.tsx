import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../../../ui-core/src/components/ui-gantt';

import { Gantt, type GanttElement } from '../components/Gantt';

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

  it('passes columns and gridWidth through, and reports a resize of the list', async () => {
    const onGridResize = vi.fn();
    const { container, rerender } = render(<Gantt tasks={tasks} columns={['label', { key: 'dates', label: 'When' }, 'progress']} gridWidth={420} onGridResize={onGridResize} />);
    await Promise.resolve();
    const el = container.querySelector('ui-gantt') as HTMLElement;
    expect(JSON.parse(el.getAttribute('columns')!)).toEqual(['label', { key: 'dates', label: 'When' }, 'progress']);
    expect(el.getAttribute('grid-width')).toBe('420');
    expect([...el.shadowRoot!.querySelectorAll('[role="columnheader"]')].map((h) => h.textContent!.trim())).toEqual(['Task', 'When', '%']);

    const splitter = el.shadowRoot!.querySelector('.splitter[role="separator"]') as HTMLElement;
    splitter.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    expect(onGridResize).toHaveBeenCalledWith({ width: 436 }, expect.anything());

    rerender(<Gantt tasks={tasks} />);
    await Promise.resolve();
    expect(el.hasAttribute('columns')).toBe(false);
    expect(el.hasAttribute('grid-width')).toBe(false);
  });

  it('passes fill and maxHeight through (a number is px)', async () => {
    const { container, rerender } = render(<Gantt tasks={tasks} fill maxHeight={480} />);
    await Promise.resolve();
    const el = container.querySelector('ui-gantt') as HTMLElement;
    expect(el.hasAttribute('fill')).toBe(true);
    expect(el.getAttribute('max-height')).toBe('480px');
    expect(el.shadowRoot!.querySelector<HTMLElement>('.frame')!.getAttribute('style')).toBe('--ui-gantt-max-height:480px');

    rerender(<Gantt tasks={tasks} maxHeight="60vh" />);
    await Promise.resolve();
    expect(el.hasAttribute('fill')).toBe(false);
    expect(el.getAttribute('max-height')).toBe('60vh');

    rerender(<Gantt tasks={tasks} />);
    await Promise.resolve();
    expect(el.hasAttribute('max-height')).toBe(false);
  });

  it('gives the ref the element with its methods, and reports tasktoggle', async () => {
    const onTaskToggle = vi.fn();
    const ref = React.createRef<GanttElement>();
    const nested = [
      { id: 'p', label: 'Phase', start: dayOffset(0), end: dayOffset(20), type: 'summary' as const },
      { id: 'a', label: 'Child', start: dayOffset(1), end: dayOffset(5), parent: 'p' },
    ];
    const { container } = render(<Gantt ref={ref} tasks={nested} initialScroll="start" onTaskToggle={onTaskToggle} />);
    await Promise.resolve();

    expect(ref.current).toBe(container.querySelector('ui-gantt'));
    expect(container.querySelector('ui-gantt')!.getAttribute('initial-scroll')).toBe('start');
    ref.current!.toggleTask('p', false);
    expect(onTaskToggle).toHaveBeenCalledWith({ id: 'p', open: false }, expect.anything());
    expect(ref.current!.scrollToTask('missing')).toBe(false);
    ref.current!.expandAll();
    expect(onTaskToggle).toHaveBeenLastCalledWith({ id: 'p', open: true }, expect.anything());
  });

  it('lets onBeforeTaskChange refuse a change, and passes snap through', async () => {
    const onBeforeTaskChange = vi.fn((_: unknown, event: Event) => event.preventDefault());
    const onTaskChange = vi.fn();
    const { container, rerender } = render(<Gantt tasks={tasks} snap="week" onBeforeTaskChange={onBeforeTaskChange} onTaskChange={onTaskChange} />);
    await Promise.resolve();
    const el = container.querySelector('ui-gantt') as HTMLElement;
    expect(el.getAttribute('snap')).toBe('week');

    const bar = el.shadowRoot!.querySelector('.bar') as HTMLElement;
    bar.focus();
    bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    expect(onBeforeTaskChange).toHaveBeenCalledTimes(1);
    expect(onBeforeTaskChange.mock.calls[0][0]).toMatchObject({ id: 'a', source: 'keyboard', affected: [] });
    expect(onTaskChange).not.toHaveBeenCalled();

    rerender(<Gantt tasks={tasks} onTaskChange={onTaskChange} />);
    await Promise.resolve();
    expect(el.hasAttribute('snap')).toBe(false);
  });

  it('passes creatable through and reports a rename and a request for a task', async () => {
    const onTaskRename = vi.fn();
    const onTaskCreate = vi.fn();
    const { container, rerender } = render(<Gantt tasks={tasks} creatable onTaskRename={onTaskRename} onTaskCreate={onTaskCreate} />);
    await Promise.resolve();
    const el = container.querySelector('ui-gantt') as HTMLElement;
    expect(el.hasAttribute('creatable')).toBe(true);

    (el.shadowRoot!.querySelector('.add-button') as HTMLButtonElement).click();
    expect(onTaskCreate).toHaveBeenCalledTimes(1);
    expect(onTaskCreate.mock.calls[0][0]).toMatchObject({ start: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/), end: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) });

    const row = el.shadowRoot!.querySelector('.grid-row') as HTMLElement;
    row.focus();
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'F2', bubbles: true, cancelable: true }));
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 20));
    const input = el.shadowRoot!.querySelector('.rename') as HTMLInputElement;
    input.value = 'Renamed';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    expect(onTaskRename).toHaveBeenCalledWith({ id: 'a', label: 'Renamed', previousLabel: 'Design' }, expect.anything());

    rerender(<Gantt tasks={tasks} />);
    await Promise.resolve();
    expect(el.hasAttribute('creatable')).toBe(false);
  });

  it('passes autoSummary and cascade through', async () => {
    const { container, rerender } = render(<Gantt tasks={tasks} autoSummary cascade />);
    await Promise.resolve();
    const el = container.querySelector('ui-gantt') as HTMLElement;
    expect(el.hasAttribute('auto-summary')).toBe(true);
    expect(el.hasAttribute('cascade')).toBe(true);

    rerender(<Gantt tasks={tasks} />);
    await Promise.resolve();
    expect(el.hasAttribute('auto-summary')).toBe(false);
    expect(el.hasAttribute('cascade')).toBe(false);
  });

  it('passes schedule and a link lag through', async () => {
    const linked = [
      { id: 'a', label: 'A', start: '2026-03-02', end: '2026-03-06' },
      { id: 'b', label: 'B', start: '2026-03-06', end: '2026-03-09' },
    ];
    const { container, rerender } = render(<Gantt tasks={linked} links={[{ source: 'a', target: 'b', lag: 2 }]} schedule="auto" />);
    await Promise.resolve();
    const el = container.querySelector('ui-gantt') as HTMLElement;
    expect(el.getAttribute('schedule')).toBe('auto');
    expect(JSON.parse(el.getAttribute('links')!)).toEqual([{ source: 'a', target: 'b', lag: 2 }]);
    expect(el.shadowRoot!.querySelectorAll('.link-hit.violated').length).toBe(1); // b may not start before the 8th

    rerender(<Gantt tasks={linked} links={[{ source: 'a', target: 'b', lag: 2 }]} schedule="off" />);
    await Promise.resolve();
    expect(el.shadowRoot!.querySelectorAll('.link-hit.violated').length).toBe(0);

    rerender(<Gantt tasks={linked} links={[{ source: 'a', target: 'b', lag: 2 }]} />);
    await Promise.resolve();
    expect(el.hasAttribute('schedule')).toBe(false);
    expect(el.shadowRoot!.querySelectorAll('.link-hit.violated').length).toBe(1);
  });

  it('passes criticalPath through', async () => {
    const chain = [
      { id: 'a', label: 'A', start: '2026-03-02', end: '2026-03-06' },
      { id: 'b', label: 'B', start: '2026-03-06', end: '2026-03-10' },
    ];
    const { container, rerender } = render(<Gantt tasks={chain} links={[{ source: 'a', target: 'b' }]} criticalPath />);
    await Promise.resolve();
    const el = container.querySelector('ui-gantt') as HTMLElement;
    expect(el.hasAttribute('critical-path')).toBe(true);
    expect(el.shadowRoot!.querySelectorAll('.bar.critical').length).toBe(2);

    rerender(<Gantt tasks={chain} links={[{ source: 'a', target: 'b' }]} />);
    await Promise.resolve();
    expect(el.shadowRoot!.querySelectorAll('.bar.critical').length).toBe(0);
  });

  it('passes nonWorkingDays and holidays through (a weekend keyword, Dates and labels)', async () => {
    const { container, rerender } = render(
      <Gantt tasks={tasks} zoom="week" nonWorkingDays="weekend" holidays={[new Date(2030, 0, 1), { date: '2030-02-02', label: 'Break' }]} />
    );
    await Promise.resolve();
    const el = container.querySelector('ui-gantt') as HTMLElement;
    expect(el.getAttribute('non-working-days')).toBe('');
    expect(JSON.parse(el.getAttribute('holidays')!)).toEqual(['2030-01-01', { date: '2030-02-02', label: 'Break' }]);

    rerender(<Gantt tasks={tasks} zoom="week" nonWorkingDays={[0]} />);
    await Promise.resolve();
    expect(el.getAttribute('non-working-days')).toBe('[0]');
    expect(el.hasAttribute('holidays')).toBe(false);

    rerender(<Gantt tasks={tasks} zoom="week" />);
    await Promise.resolve();
    expect(el.hasAttribute('non-working-days')).toBe(false);
  });

  it('passes linkable through and reports linkcreate and linkdelete', async () => {
    const linked = [
      { id: 'a', label: 'A', start: '2026-03-02', end: '2026-03-06' },
      { id: 'b', label: 'B', start: '2026-03-09', end: '2026-03-13' },
    ];
    const onLinkCreate = vi.fn();
    const onLinkDelete = vi.fn();
    const { container, rerender } = render(<Gantt tasks={linked} links={[{ id: 'ab', source: 'a', target: 'b' }]} linkable onLinkCreate={onLinkCreate} onLinkDelete={onLinkDelete} />);
    await Promise.resolve();
    const el = container.querySelector('ui-gantt') as HTMLElement;
    expect(el.hasAttribute('linkable')).toBe(true);
    expect(el.shadowRoot!.querySelectorAll('.connector').length).toBe(4);

    el.dispatchEvent(new CustomEvent('linkcreate', { detail: { source: 'b', target: 'a', type: 's2s' } }));
    expect(onLinkCreate).toHaveBeenCalledWith({ source: 'b', target: 'a', type: 's2s' }, expect.anything());

    const path = el.shadowRoot!.querySelector('.link-hit') as SVGElement;
    path.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }));
    expect(onLinkDelete).toHaveBeenCalledWith({ id: 'ab', source: 'a', target: 'b', type: 'e2s' }, expect.anything());

    rerender(<Gantt tasks={linked} links={[{ id: 'ab', source: 'a', target: 'b' }]} />);
    await Promise.resolve();
    expect(el.hasAttribute('linkable')).toBe(false);
  });

  it('exports the chart as an SVG through the ref', async () => {
    const ref = React.createRef<GanttElement>();
    render(<Gantt ref={ref} tasks={tasks} />);
    await Promise.resolve();

    const svg = ref.current!.exportSvg();
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('Design');
  });
});
