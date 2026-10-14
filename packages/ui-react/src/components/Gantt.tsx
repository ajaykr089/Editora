import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

import '@editora/ui-core/gantt';
import { createUIElement } from './_internals';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type GanttTaskType = 'task' | 'summary' | 'milestone';
/** `fit` scales the whole project to the width of the chart; the others are fixed pixels-per-day scales. */
export type GanttZoom = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'fit';
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

export type GanttBeforeTaskChangeDetail = {
  id: string;
  start: string;
  end: string;
  previousStart: string;
  previousEnd: string;
  /** What moved it: a drag of the bar, a resize from a handle, or the keyboard. */
  source: 'drag' | 'resize' | 'keyboard';
  /** Other tasks the same change moves (empty unless cascade or scheduling is on). */
  affected: Array<{ id: string; start: string; end: string; previousStart: string; previousEnd: string }>;
};

export type GanttTaskRenameDetail = { id: string; label: string; previousLabel: string };

/** Where the user asked for a task: its dates (a week long) and the neighbour it was asked next to. */
export type GanttTaskCreateDetail = { start: string; end: string; parent?: string; after?: string };

export type GanttLinkSelectDetail = {
  id: string;
  source: string;
  target: string;
  type: GanttLink['type'];
};

export type GanttColumnKey = 'label' | 'assignee' | 'owner' | 'dates' | 'start' | 'end' | 'duration' | 'progress';

/** A grid column: a key, or an object that also sets the header text and the width in px. */
export type GanttColumn = GanttColumnKey | { key: GanttColumnKey; label?: string; width?: number };

/** Every word the chart shows or announces. `tasksCount` takes `{shown}` and `{total}`. */
export type GanttLabels = {
  title: string;
  tasksCount: string;
  filterPlaceholder: string;
  filterLabel: string;
  sortLabel: string;
  sortManual: string;
  sortStart: string;
  sortEnd: string;
  sortName: string;
  sortProgress: string;
  zoomDay: string;
  zoomWeek: string;
  zoomMonth: string;
  zoomQuarter: string;
  zoomYear: string;
  zoomFit: string;
  zoomFitTitle: string;
  columnTask: string;
  columnOwner: string;
  columnDates: string;
  columnProgress: string;
  columnStart: string;
  columnEnd: string;
  columnDuration: string;
  splitter: string;
  scrollToToday: string;
  addTask: string;
  rename: string;
  empty: string;
  noMatches: string;
  expand: string;
  collapse: string;
  timeline: string;
  today: string;
  summary: string;
  milestone: string;
  to: string;
  complete: string;
  assigned: string;
  critical: string;
};

/** What `ref` gives you: the element, with the methods to move around the chart. */
export interface GanttElement extends HTMLElement {
  /** Scroll the timeline to a date (`'YYYY-MM-DD'`, a `Date`, a timestamp or `'today'`). */
  scrollToDate(date: string | number | Date, options?: { behavior?: ScrollBehavior; align?: 'center' | 'start' }): void;
  /** Open the branches above a task and bring its row and bar on screen. False when the task is not there or is filtered out. */
  scrollToTask(id: string, options?: { behavior?: ScrollBehavior }): boolean;
  /** Open or close a branch (toggles when `open` is left out). */
  toggleTask(id: string, open?: boolean): void;
  expandAll(): void;
  collapseAll(): void;
}

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
  /** First day of the week in the time header, as `Date#getDay` numbers it (0 is Sunday). Defaults to the locale's. */
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** The task list's columns, in order. The name column is always first. Default: name, owner, dates, progress. */
  columns?: GanttColumn[];
  /** Show a "+ Add task" button and let a double-click on empty timeline space ask for a task (`onTaskCreate`). Off in a `readonly` chart. */
  creatable?: boolean;
  /** How far a drag snaps: to whole `'day'`s (the default), `'week'`s or `'month'`s. Arrow keys still move a day at a time. */
  snap?: 'day' | 'week' | 'month';
  /** Where the chart opens: on `'today'` (the default, when today is not on the first screen) or at the `'start'`. */
  initialScroll?: 'today' | 'start';
  /** Fill the height of the container (which must have one): the toolbar keeps its height and the chart scrolls inside the rest. */
  fill?: boolean;
  /** Cap on the chart's height when it is not `fill`: a number (px) or a plain CSS length (`'60vh'`, `'none'`). Default 620px. */
  maxHeight?: number | string;
  /** Width of the task list in px. The user can also drag the splitter; see `onGridResize`. */
  gridWidth?: number;
  /** Translations: any subset of the labels. */
  labels?: Partial<GanttLabels>;
  /** BCP 47 locale for dates (month names, date formats, the week's first day). Defaults to the browser's. */
  locale?: string;
  /** Fired before a drag, resize or key changes dates. Call `event.preventDefault()` to refuse the change: nothing moves and `onTaskChange` does not fire. */
  onBeforeTaskChange?: (detail: GanttBeforeTaskChangeDetail, event: CustomEvent<GanttBeforeTaskChangeDetail>) => void;
  /** Fired when a name is edited in place (double-click it, or F2). Call `event.preventDefault()` to refuse. The component only keeps the new name until `tasks` is written again. */
  onTaskRename?: (detail: GanttTaskRenameDetail, event: CustomEvent<GanttTaskRenameDetail>) => void;
  /** Fired when the user asks for a new task (the Add button, or a double-click on empty timeline space). The host adds it. */
  onTaskCreate?: (detail: GanttTaskCreateDetail, event: CustomEvent<GanttTaskCreateDetail>) => void;
  onTaskToggle?: (detail: { id: string; open: boolean }, event: CustomEvent<{ id: string; open: boolean }>) => void;
  onGridResize?: (detail: { width: number }, event: CustomEvent<{ width: number }>) => void;
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

export const Gantt = React.forwardRef<GanttElement, GanttProps>(function Gantt(
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
    weekStart,
    labels,
    locale,
    columns,
    gridWidth,
    fill,
    maxHeight,
    initialScroll,
    snap,
    creatable,
    children,
    onTaskChange,
    onTaskSelect,
    onTaskDelete,
    onLinkSelect,
    onZoomChange,
    onFilterChange,
    onSortChange,
    onGridResize,
    onTaskToggle,
    onBeforeTaskChange,
    onTaskRename,
    onTaskCreate,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as GanttElement);

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

    // These two default to shown, so "off" has to be written as an attribute: removing it shows them.
    const syncShown = (name: string, shown: boolean | undefined) => {
      if (shown === false) syncAttr(name, 'false');
      else syncBool(name, shown);
    };

    syncAttr('tasks', serializeTasks(tasks));
    syncAttr('links', links?.length ? JSON.stringify(links) : null);
    syncAttr('zoom', zoom || null);
    syncAttr('sort', sort && sort !== 'none' ? sort : null);
    syncAttr('bar-variant', barVariant && barVariant !== 'solid' ? barVariant : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('filter', filterText || null);
    syncBool('readonly', readonly);
    syncShown('show-toolbar', showToolbar);
    syncShown('show-today', showToday);
    if (virtualized === false) syncAttr('virtualized', 'false');
    else syncAttr('virtualized', null);
    syncBool('headless', headless);
    syncAttr('week-start', weekStart == null ? null : String(weekStart));
    syncAttr('labels', labels ? JSON.stringify(labels) : null);
    syncAttr('locale', locale || null);
    syncAttr('columns', columns?.length ? JSON.stringify(columns) : null);
    syncAttr('grid-width', gridWidth != null && gridWidth > 0 ? String(gridWidth) : null);
    syncBool('fill', fill);
    syncBool('creatable', creatable);
    syncAttr('snap', snap && snap !== 'day' ? snap : null);
    syncAttr('initial-scroll', initialScroll && initialScroll !== 'today' ? initialScroll : null);
    syncAttr('max-height', maxHeight == null || maxHeight === '' ? null : typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight);
  }, [tasks, links, zoom, sort, barVariant, variant, readonly, showToolbar, showToday, filterText, virtualized, headless, weekStart, labels, locale, columns, gridWidth, fill, maxHeight, initialScroll, snap, creatable]);

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
    const handleGridResize = (event: Event) => onGridResize?.((event as CustomEvent<{ width: number }>).detail, event as CustomEvent<{ width: number }>);

    el.addEventListener('sortchange', handleSortChange);
    const handleTaskToggle = (event: Event) => onTaskToggle?.((event as CustomEvent<{ id: string; open: boolean }>).detail, event as CustomEvent<{ id: string; open: boolean }>);
    el.addEventListener('gridresize', handleGridResize);
    const handleBeforeTaskChange = (event: Event) => onBeforeTaskChange?.((event as CustomEvent<GanttBeforeTaskChangeDetail>).detail, event as CustomEvent<GanttBeforeTaskChangeDetail>);
    el.addEventListener('tasktoggle', handleTaskToggle);
    const handleTaskRename = (event: Event) => onTaskRename?.((event as CustomEvent<GanttTaskRenameDetail>).detail, event as CustomEvent<GanttTaskRenameDetail>);
    const handleTaskCreate = (event: Event) => onTaskCreate?.((event as CustomEvent<GanttTaskCreateDetail>).detail, event as CustomEvent<GanttTaskCreateDetail>);
    el.addEventListener('beforetaskchange', handleBeforeTaskChange);
    el.addEventListener('taskrename', handleTaskRename);
    el.addEventListener('taskcreate', handleTaskCreate);
    return () => {
      el.removeEventListener('taskrename', handleTaskRename);
      el.removeEventListener('taskcreate', handleTaskCreate);
      el.removeEventListener('beforetaskchange', handleBeforeTaskChange);
      el.removeEventListener('tasktoggle', handleTaskToggle);
      el.removeEventListener('gridresize', handleGridResize);
      el.removeEventListener('taskchange', handleTaskChange);
      el.removeEventListener('taskselect', handleTaskSelect);
      el.removeEventListener('taskdelete', handleTaskDelete);
      el.removeEventListener('linkselect', handleLinkSelect);
      el.removeEventListener('zoomchange', handleZoomChange);
      el.removeEventListener('filterchange', handleFilterChange);
      el.removeEventListener('sortchange', handleSortChange);
    };
  }, [onTaskChange, onTaskSelect, onTaskDelete, onLinkSelect, onZoomChange, onFilterChange, onSortChange, onGridResize, onTaskToggle, onBeforeTaskChange, onTaskRename, onTaskCreate]);

  return createUIElement('ui-gantt', { ref, ...rest }, children);
});

Gantt.displayName = 'Gantt';

export default Gantt;
