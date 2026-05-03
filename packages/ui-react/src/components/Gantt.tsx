import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type GanttTaskType = 'task' | 'summary' | 'milestone';
export type GanttZoom = 'day' | 'week' | 'month' | 'quarter' | 'year';
export type GanttSort = 'none' | 'start' | 'end' | 'label' | 'progress';
export type GanttBarVariant = 'solid' | 'soft' | 'striped' | 'outline' | 'glass';

export type GanttTask = {
  id?: string;
  label: string;
  start: string | Date;
  end?: string | Date;
  duration?: number;
  progress?: number;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  type?: GanttTaskType;
  parent?: string;
  open?: boolean;
  assignee?: string;
  owner?: string;
  readonly?: boolean;
  baselineStart?: string | Date;
  baselineEnd?: string | Date;
  critical?: boolean;
  segments?: Array<{ start: string | Date; end: string | Date; progress?: number }>;
};

export type GanttLink = {
  id?: string;
  source: string;
  target: string;
  type?: 'e2s' | 's2s' | 'e2e' | 's2e';
};

export type GanttTaskChangeDetail = {
  id: string;
  start?: string;
  end?: string;
};

export type GanttLinkSelectDetail = {
  id: string;
  source: string;
  target: string;
  type: GanttLink['type'];
};

export type GanttProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onSelect'> & {
  tasks?: GanttTask[];
  links?: GanttLink[];
  zoom?: GanttZoom;
  sort?: GanttSort;
  barVariant?: GanttBarVariant;
  variant?: 'default' | 'contrast';
  readonly?: boolean;
  showToolbar?: boolean;
  showToday?: boolean;
  filterText?: string;
  virtualized?: boolean;
  headless?: boolean;
  onTaskChange?: (detail: GanttTaskChangeDetail, event: CustomEvent<GanttTaskChangeDetail>) => void;
  onTaskSelect?: (detail: { id: string }, event: CustomEvent<{ id: string }>) => void;
  onTaskDelete?: (detail: { id: string }, event: CustomEvent<{ id: string }>) => void;
  onLinkSelect?: (detail: GanttLinkSelectDetail, event: CustomEvent<GanttLinkSelectDetail>) => void;
  onZoomChange?: (detail: { zoom: GanttZoom }, event: CustomEvent<{ zoom: GanttZoom }>) => void;
  onFilterChange?: (detail: { filter: string }, event: CustomEvent<{ filter: string }>) => void;
  onSortChange?: (detail: { sort: GanttSort }, event: CustomEvent<{ sort: GanttSort }>) => void;
};

function serializeDate(value: string | Date | undefined): string | undefined {
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return value;
}

function serializeTasks(tasks: GanttTask[] | undefined): string | null {
  if (!tasks?.length) return null;
  return JSON.stringify(tasks.map((task) => ({
    ...task,
    start: serializeDate(task.start),
    end: serializeDate(task.end),
    baselineStart: serializeDate(task.baselineStart),
    baselineEnd: serializeDate(task.baselineEnd),
    segments: task.segments?.map((segment) => ({
      ...segment,
      start: serializeDate(segment.start),
      end: serializeDate(segment.end),
    })),
  })));
}

export const Gantt = React.forwardRef<HTMLElement, GanttProps>(function Gantt(
  {
    tasks,
    links,
    zoom,
    sort,
    barVariant,
    variant,
    readonly,
    showToolbar,
    showToday,
    filterText,
    virtualized,
    headless,
    children,
    onTaskChange,
    onTaskSelect,
    onTaskDelete,
    onLinkSelect,
    onZoomChange,
    onFilterChange,
    onSortChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };

    syncAttr('tasks', serializeTasks(tasks));
    syncAttr('links', links?.length ? JSON.stringify(links) : null);
    syncAttr('zoom', zoom || null);
    syncAttr('sort', sort && sort !== 'none' ? sort : null);
    syncAttr('bar-variant', barVariant && barVariant !== 'solid' ? barVariant : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('filter', filterText || null);
    syncBool('readonly', readonly);
    syncBool('show-toolbar', showToolbar);
    syncBool('show-today', showToday);
    if (virtualized === false) syncAttr('virtualized', 'false');
    else syncAttr('virtualized', null);
    syncBool('headless', headless);
  }, [tasks, links, zoom, sort, barVariant, variant, readonly, showToolbar, showToday, filterText, virtualized, headless]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleTaskChange = (event: Event) => onTaskChange?.((event as CustomEvent<GanttTaskChangeDetail>).detail, event as CustomEvent<GanttTaskChangeDetail>);
    const handleTaskSelect = (event: Event) => onTaskSelect?.((event as CustomEvent<{ id: string }>).detail, event as CustomEvent<{ id: string }>);
    const handleTaskDelete = (event: Event) => onTaskDelete?.((event as CustomEvent<{ id: string }>).detail, event as CustomEvent<{ id: string }>);
    const handleLinkSelect = (event: Event) => onLinkSelect?.((event as CustomEvent<GanttLinkSelectDetail>).detail, event as CustomEvent<GanttLinkSelectDetail>);
    const handleZoomChange = (event: Event) => onZoomChange?.((event as CustomEvent<{ zoom: GanttZoom }>).detail, event as CustomEvent<{ zoom: GanttZoom }>);
    const handleFilterChange = (event: Event) => onFilterChange?.((event as CustomEvent<{ filter: string }>).detail, event as CustomEvent<{ filter: string }>);
    const handleSortChange = (event: Event) => onSortChange?.((event as CustomEvent<{ sort: GanttSort }>).detail, event as CustomEvent<{ sort: GanttSort }>);

    el.addEventListener('taskchange', handleTaskChange);
    el.addEventListener('taskselect', handleTaskSelect);
    el.addEventListener('taskdelete', handleTaskDelete);
    el.addEventListener('linkselect', handleLinkSelect);
    el.addEventListener('zoomchange', handleZoomChange);
    el.addEventListener('filterchange', handleFilterChange);
    el.addEventListener('sortchange', handleSortChange);
    return () => {
      el.removeEventListener('taskchange', handleTaskChange);
      el.removeEventListener('taskselect', handleTaskSelect);
      el.removeEventListener('taskdelete', handleTaskDelete);
      el.removeEventListener('linkselect', handleLinkSelect);
      el.removeEventListener('zoomchange', handleZoomChange);
      el.removeEventListener('filterchange', handleFilterChange);
      el.removeEventListener('sortchange', handleSortChange);
    };
  }, [onTaskChange, onTaskSelect, onTaskDelete, onLinkSelect, onZoomChange, onFilterChange, onSortChange]);

  return React.createElement('ui-gantt', { ref, ...rest }, children);
});

Gantt.displayName = 'Gantt';

export default Gantt;
