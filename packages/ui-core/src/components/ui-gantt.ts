import { ElementBase } from '../ElementBase';
import { criticalPath, daysBetween, descendantsOf, pushSuccessors, rollUp, shiftDays, violatedLinks, type SchedLink, type SchedTask } from './gantt-schedule';

type GanttTone = 'default' | 'success' | 'warning' | 'danger' | 'info';
type GanttTaskType = 'task' | 'summary' | 'milestone';
type GanttUnit = 'day' | 'week' | 'month' | 'quarter' | 'year';
/** `fit` scales the whole project to the width of the chart; the others are a fixed pixels-per-day scale. */
type GanttZoom = GanttUnit | 'fit';
type GanttSort = 'none' | 'start' | 'end' | 'label' | 'progress';
type GanttBarVariant = 'solid' | 'soft' | 'striped' | 'outline' | 'glass';
type LinkType = 'e2s' | 's2s' | 'e2e' | 's2e';

type GanttTask = {
  id: string;
  label: string;
  start: string;
  end: string;
  progress?: number;
  tone?: GanttTone;
  type?: GanttTaskType;
  parent?: string;
  open?: boolean;
  assignee?: string;
  readonly?: boolean;
  baselineStart?: string;
  baselineEnd?: string;
  critical?: boolean;
  /** Internal: a parent given no dates, waiting for `auto-summary` to take them from its children. */
  undated?: boolean;
  segments?: Array<{ start: string; end: string; progress?: number }>;
};

type GanttLink = {
  id: string;
  source: string;
  target: string;
  type?: LinkType;
  /** Days the target must wait after what it follows (negative: it may overlap). */
  lag?: number;
};

type VisibleTask = GanttTask & {
  depth: number;
  hasChildren: boolean;
  startMs: number;
  endMs: number;
};

type DragState = {
  taskId: string;
  mode: 'move' | 'resize-start' | 'resize-end';
  startX: number;
  /** The scroll position at the start, so a drag that scrolls the chart keeps counting from where it began. */
  startScroll: number;
  lastClientX: number;
  originalStart: number;
  originalEnd: number;
  kind: GanttTaskType;
  rangeMin: number;
  dayWidth: number;
  latestStart: number;
  latestEnd: number;
  frame: number | null;
  scrollFrame: number | null;
  bar: HTMLElement;
  /** The bar's inline position before the drag, to put it back when the drag is cancelled. */
  originalLeft: string;
  originalWidth: string;
  moved: boolean;
  selectedChanged: boolean;
  onKey: (event: KeyboardEvent) => void;
};

type ChangeSource = 'drag' | 'resize' | 'keyboard';

type LinkDrag = {
  sourceId: string;
  side: 'start' | 'end';
  fromX: number;
  fromY: number;
  draft: SVGPathElement;
  targetId: string | null;
  targetSide: 'start' | 'end' | null;
  onKey: (event: KeyboardEvent) => void;
};

type TaskChange = { id: string; start: number; end: number; previousStart: number; previousEnd: number };

type FocusSnapshot = {
  selector: string;
  /** Scroll the control into view when it takes focus (keyboard navigation to a row that may be off screen). */
  reveal?: boolean;
  /** How many renders may pass while the control is not in the rendered window yet (a row far down a long chart). */
  retries?: number;
  /** Select the whole text of an input that takes focus (the rename field). */
  selectAll?: boolean;
  selection?: [number | null, number | null, 'forward' | 'backward' | 'none' | null];
};

const DAY = 24 * 60 * 60 * 1000;
const ROW_HEIGHT = 42;
const HEADER_HEIGHT = 62;
const GRID_WIDTH = 376;
/** The grid template of the default columns (name, owner, dates, progress): 170 + 82 + 80 + 44 = 376px. */
const DEFAULT_TEMPLATE = 'minmax(170px, 1fr) 82px 80px 44px';
/** Mirrors the container query in the stylesheet: at this host width or less the grid shrinks to COMPACT_GRID_WIDTH. */
const COMPACT_MAX_WIDTH = 640;
const COMPACT_GRID_WIDTH = 148;
const FRAME_BORDER = 2;
const MILESTONE_SIZE = 28;
const MILESTONE_SHAPE_SIZE = 15;
const MILESTONE_DIAMOND_HALF = (MILESTONE_SHAPE_SIZE * Math.SQRT2) / 2;

const zoomPixels: Record<GanttUnit, number> = {
  day: 36,
  week: 13,
  month: 4.4,
  quarter: 2.2,
  year: 1.15
};

const style = `
  :host {
    --ui-gantt-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-gantt-panel: var(--ui-color-surface, #ffffff);
    --ui-gantt-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-gantt-grid: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 56%, transparent);
    --ui-gantt-text: var(--ui-color-text, #0f172a);
    --ui-gantt-muted: var(--ui-color-muted, #526175);
    --ui-gantt-accent: var(--ui-color-primary, #2563eb);
    --ui-gantt-selected: color-mix(in srgb, var(--ui-gantt-accent) 10%, transparent);
    display: block;
    min-inline-size: 0;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .frame {
    container: ui-gantt / inline-size;
    border: 1px solid var(--ui-gantt-border);
    border-radius: calc(var(--ui-radius, 6px) + 2px);
    background: var(--ui-gantt-bg);
    box-shadow: none;
    overflow: hidden;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--ui-gantt-border);
    background: color-mix(in srgb, var(--ui-gantt-panel) 92%, transparent);
  }

  .title {
    min-inline-size: 0;
    font-size: 13px;
    font-weight: 750;
    color: var(--ui-gantt-text);
  }

  .meta {
    color: var(--ui-gantt-muted);
    font-weight: 600;
    margin-inline-start: 8px;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .control,
  .select,
  .zoom-button,
  .today-button,
  .add-button {
    border: 1px solid var(--ui-gantt-border);
    background: var(--ui-gantt-panel);
    color: var(--ui-gantt-text);
    border-radius: var(--ui-control-radius-2, var(--ui-radius, 6px));
    min-block-size: 30px;
    font: inherit;
    font-size: 12px;
  }

  .control {
    inline-size: min(220px, 34vw);
    padding: 0 9px;
  }

  .select {
    padding: 0 28px 0 9px;
    min-inline-size: 118px;
  }

  .zoom-button,
  .today-button,
  .add-button {
    padding: 0 9px;
    cursor: pointer;
  }

  .today-button:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .zoom-button[aria-pressed="true"] {
    border-color: transparent;
    background: var(--ui-color-accent-fill, color-mix(in srgb, var(--ui-gantt-accent) 10%, var(--ui-gantt-panel)));
    color: var(--ui-color-text-strong, var(--ui-gantt-text));
  }

  .viewport {
    overflow: auto;
    max-block-size: var(--ui-gantt-max-height, 620px);
  }

  /* fill: the chart takes the height of its container (which needs one): the toolbar keeps its height and the
     scroll area takes the rest, however tall. */
  :host([fill]) {
    block-size: 100%;
  }

  :host([fill]) .frame {
    display: flex;
    flex-direction: column;
    block-size: 100%;
  }

  :host([fill]) .toolbar {
    flex: none;
  }

  :host([fill]) .viewport {
    flex: 1 1 0;
    min-block-size: 0;
    max-block-size: none;
  }

  .surface {
    --gantt-grid-w: ${GRID_WIDTH}px;
    --gantt-cols: ${DEFAULT_TEMPLATE};
    display: grid;
    grid-template-columns: var(--gantt-grid-w) minmax(640px, 1fr);
    min-inline-size: 100%;
  }

  /* The task grid is sticky, so at 376px it covers a phone-sized chart completely and no bar can be
     reached. In a narrow host keep only the task name column and give the timeline the room. */
  @container ui-gantt (max-width: 640px) {
    .surface {
      --gantt-grid-w: 148px;
      --gantt-cols: minmax(0, 1fr);
    }

    .splitter-rail {
      display: none;
    }

    /* !important: the sortable header wrappers carry an inline display: contents. */
    .grid-head > :nth-child(n + 2),
    .grid-cell:nth-child(n + 2) {
      display: none !important;
    }

    .grid-cell.task-name {
      padding-inline-end: 6px;
    }
  }

  .grid-head,
  .timeline-head {
    position: sticky;
    top: 0;
    z-index: 4;
    min-block-size: 62px;
    /* Opaque: the rows scroll underneath, and at 96% they showed through as a ghost of the text. */
    background: var(--ui-gantt-panel);
    border-bottom: 1px solid var(--ui-gantt-border);
  }

  /* Explicit placement: the treegrid wrapper (display: contents) now holds the grid head and body
     next to each other in the DOM, so the four panes no longer rely on source order. */
  .grid-head { grid-column: 1; grid-row: 1; }
  .timeline-head { grid-column: 2; grid-row: 1; }
  .grid-body { grid-column: 1; grid-row: 2; }
  .timeline-body { grid-column: 2; grid-row: 2; }

  .grid-semantics {
    display: contents;
  }

  .grid-head {
    left: 0;
    z-index: 5;
    display: grid;
    grid-template-columns: var(--gantt-cols);
    border-right: 1px solid var(--ui-gantt-border);
  }

  .grid-head span,
  .head-button,
  .grid-cell {
    display: flex;
    align-items: center;
    min-inline-size: 0;
    padding: 0 10px;
    border-right: 1px solid color-mix(in srgb, var(--ui-gantt-border) 62%, transparent);
  }

  .grid-head span {
    font-size: 11px;
    font-weight: 750;
    color: var(--ui-gantt-muted);
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .head-button {
    border: 0;
    background: transparent;
    color: var(--ui-gantt-muted);
    cursor: pointer;
    font: inherit;
    font-size: 11px;
    font-weight: 750;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .head-button:hover,
  .head-button[aria-sort]:not([aria-sort="none"]) {
    color: var(--ui-gantt-accent);
  }

  .grid-head span:last-child,
  .grid-cell:last-child {
    border-right: 0;
  }

  .timeline-head {
    position: sticky;
    top: 0;
    overflow: hidden;
  }

  .scale {
    position: relative;
    min-block-size: 62px;
  }

  .band {
    position: absolute;
    inset-inline: 0;
  }

  .band.top {
    inset-block-start: 0;
    block-size: 26px;
    border-bottom: 1px solid var(--ui-gantt-grid);
  }

  .band.bottom {
    inset-block-start: 26px;
    block-size: 36px;
  }

  .scale[data-zoom="year"] .band.bottom {
    inset-block-start: 0;
    block-size: 62px;
  }

  .band-cell,
  .tick {
    position: absolute;
    inset-block: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-left: 1px solid var(--ui-gantt-grid);
    padding: 0 8px;
    color: var(--ui-gantt-muted);
    font-size: 11px;
    font-weight: 650;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .band-cell {
    color: var(--ui-gantt-text);
    font-weight: 700;
  }

  /* Labels sit at the top of their row so the today pill has the bottom of it to itself. */
  .band.bottom .tick {
    align-items: flex-start;
    padding-block-start: 6px;
  }

  .scale[data-zoom="year"] .tick {
    padding-block-start: 9px;
  }

  .tick.day {
    flex-direction: column;
    justify-content: flex-start;
    gap: 1px;
    padding: 3px 0 0;
    line-height: 1.15;
  }

  .tick .dow {
    font-size: 9px;
    font-weight: 600;
    opacity: 0.8;
  }

  .tick .num {
    font-variant-numeric: tabular-nums;
  }

  .tick.today-cell {
    color: var(--ui-gantt-accent);
    background: color-mix(in srgb, var(--ui-gantt-accent) 9%, transparent);
  }

  .grid-body {
    position: sticky;
    left: 0;
    z-index: 3;
    background: var(--ui-gantt-panel);
    border-right: 1px solid var(--ui-gantt-border);
  }

  .timeline-body {
    position: relative;
    /* grid lines can run a scrollbar's width past the track; clip them, and keep y visible for drag tips */
    overflow-x: clip;
    background:
      linear-gradient(to right, var(--ui-gantt-grid) 1px, transparent 1px) 0 0 / var(--day-width) 100%,
      color-mix(in srgb, var(--ui-gantt-panel) 98%, transparent);
  }

  /* The task list can be resized: a handle on its right edge, in the header and down the body. They are grid items
     of their own, in the cells of the header and the body, so the sticky grid underneath stays a plain treegrid. */
  .splitter-rail {
    position: sticky;
    left: 0;
    grid-column: 1;
    z-index: 4;
    pointer-events: none;
  }

  .splitter-rail.head {
    grid-row: 1;
    top: 0;
    z-index: 6;
  }

  .splitter-rail.body {
    grid-row: 2;
  }

  .splitter {
    position: absolute;
    inset-block: 0;
    inset-inline-end: -4px;
    inline-size: 8px;
    cursor: col-resize;
    pointer-events: auto;
    touch-action: none;
    outline: 0;
  }

  .splitter::after {
    content: "";
    position: absolute;
    inset-block: 0;
    inset-inline-start: 3px;
    inline-size: 2px;
    background: transparent;
    transition: background 120ms ease;
  }

  .splitter:hover::after,
  .splitter.dragging::after,
  .splitter:focus-visible::after {
    background: var(--ui-gantt-accent);
  }

  .timeline-body[data-zoom="month"],
  .timeline-body[data-zoom="quarter"],
  .timeline-body[data-zoom="year"] {
    background: color-mix(in srgb, var(--ui-gantt-panel) 98%, transparent);
  }

  /* Non-working days: a tint behind the rows, a warmer one for a holiday. */
  .off-day {
    position: absolute;
    inset-block: 0;
    background: color-mix(in srgb, var(--ui-gantt-muted) 11%, transparent);
    pointer-events: none;
  }

  .off-day.holiday {
    background: color-mix(in srgb, var(--ui-color-warning, #d97706) 15%, transparent);
  }

  .tick.off {
    background: color-mix(in srgb, var(--ui-gantt-muted) 9%, transparent);
  }

  /* The dots beside a bar that start a link (the linkable attribute), shown with the row's hover or focus. */
  .connector {
    position: absolute;
    top: 15px;
    inline-size: 12px;
    block-size: 12px;
    border: 2px solid var(--ui-gantt-accent);
    border-radius: 50%;
    background: var(--ui-gantt-panel);
    cursor: crosshair;
    opacity: 0;
    z-index: 3;
    touch-action: none;
    transition: opacity 120ms ease;
  }

  .timeline-row:hover .connector,
  .timeline-row:focus-within .connector,
  .frame[data-linking] .connector {
    opacity: 1;
  }

  .link-draft {
    fill: none;
    stroke: var(--ui-gantt-accent);
    stroke-width: 2;
    stroke-dasharray: 5 3;
    stroke-linecap: round;
    pointer-events: none;
  }

  .bar.link-target {
    outline: 2px solid var(--ui-gantt-accent);
    outline-offset: 2px;
  }

  .bar.link-target[data-link-side="start"] {
    box-shadow: inset 7px 0 0 var(--ui-gantt-accent);
  }

  .bar.link-target[data-link-side="end"] {
    box-shadow: inset -7px 0 0 var(--ui-gantt-accent);
  }

  .links path.selected:not(.link-hit) {
    stroke: var(--ui-gantt-accent);
    stroke-width: 2.4;
  }

  .links path.link-hit {
    outline: 0;
  }

  .unit-line {
    position: absolute;
    inset-block: 0;
    inline-size: 1px;
    background: color-mix(in srgb, var(--ui-gantt-border) 90%, transparent);
    pointer-events: none;
  }

  .grid-row,
  .timeline-row {
    block-size: ${ROW_HEIGHT}px;
    border-bottom: 1px solid color-mix(in srgb, var(--ui-gantt-border) 56%, transparent);
  }

  .grid-row {
    display: grid;
    grid-template-columns: var(--gantt-cols);
    color: var(--ui-gantt-text);
    font-size: 12px;
  }

  .grid-row {
    outline: 0;
  }

  .grid-row:focus-visible {
    outline: 2px solid var(--ui-gantt-accent);
    outline-offset: -2px;
  }

  .grid-row.selected,
  .timeline-row.selected {
    background: var(--ui-gantt-selected);
  }

  .task-name {
    gap: 7px;
    font-weight: 650;
  }

  .expander {
    flex: 0 0 22px;
    inline-size: 22px;
    block-size: 22px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--ui-gantt-muted);
    cursor: pointer;
    display: grid;
    place-items: center;
    font-size: 13px;
  }

  .expander:hover {
    background: color-mix(in srgb, var(--ui-gantt-accent) 9%, transparent);
    color: var(--ui-gantt-accent);
  }

  .rename {
    flex: 1 1 auto;
    min-inline-size: 0;
    block-size: 26px;
    padding: 0 6px;
    border: 1px solid var(--ui-gantt-accent);
    border-radius: 6px;
    background: var(--ui-gantt-panel);
    color: var(--ui-gantt-text);
    font: inherit;
    font-weight: 650;
    outline: 0;
  }

  .name-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .badge {
    justify-content: center;
    font-variant-numeric: tabular-nums;
    color: var(--ui-gantt-muted);
    font-size: 11px;
  }

  .timeline-row {
    position: relative;
  }

  .bar {
    position: absolute;
    top: 12px;
    block-size: 18px;
    min-inline-size: 10px;
    border: 0;
    border-radius: 4px;
    background:
      linear-gradient(180deg, color-mix(in srgb, #ffffff 22%, transparent), transparent 42%),
      var(--tone, var(--ui-gantt-accent));
    box-shadow:
      0 4px 10px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 18%, transparent),
      inset 0 0 0 1px color-mix(in srgb, #ffffff 20%, transparent);
    cursor: grab;
    overflow: hidden;
    outline: 0;
    touch-action: none;
    transition: box-shadow 140ms ease, filter 140ms ease, transform 140ms ease;
    will-change: left, width;
  }

  .bar:hover,
  .bar.dragging {
    filter: saturate(1.08);
    box-shadow:
      0 6px 14px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 26%, transparent),
      inset 0 0 0 1px color-mix(in srgb, #ffffff 30%, transparent);
  }

  .bar.dragging {
    cursor: grabbing;
    z-index: 5;
    transform: translateY(-1px);
  }

  .bar:focus-visible {
    outline: 2px solid var(--ui-gantt-accent);
    outline-offset: 2px;
  }

  .bar.critical {
    --tone: var(--ui-color-danger, #dc2626);
    box-shadow:
      0 5px 12px color-mix(in srgb, var(--ui-color-danger, #dc2626) 24%, transparent),
      inset 0 0 0 1px color-mix(in srgb, #ffffff 28%, transparent);
  }

  .bar.split {
    background: transparent;
    box-shadow: none;
    overflow: visible;
  }

  /* A split bar shows the progress of each part, inside the part, and not one fill across the gaps. */
  .bar.split > .progress {
    display: none;
  }

  .split-segment {
    position: absolute;
    inset-block: 0;
    overflow: hidden;
    border-radius: 4px;
    background:
      linear-gradient(180deg, color-mix(in srgb, #ffffff 22%, transparent), transparent 42%),
      var(--tone, var(--ui-gantt-accent));
    box-shadow:
      0 4px 10px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 18%, transparent),
      inset 0 0 0 1px color-mix(in srgb, #ffffff 24%, transparent);
  }

  .baseline {
    position: absolute;
    top: 33px;
    block-size: 4px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-gantt-muted) 54%, transparent);
    z-index: 1;
  }

  .bar.summary {
    block-size: 9px;
    top: 17px;
    border-radius: 3px;
    background: color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 82%, #0f172a);
  }

  .bar.milestone {
    inline-size: 28px !important;
    min-inline-size: 28px;
    block-size: 28px;
    top: 7px;
    border-radius: 8px;
    background: transparent;
    box-shadow: none;
    cursor: grab;
    overflow: visible;
    display: grid;
    place-items: center;
  }

  .bar.milestone:hover,
  .bar.milestone.dragging {
    box-shadow: none;
  }

  .milestone-shape {
    inline-size: 15px;
    block-size: 15px;
    border-radius: 4px;
    background:
      linear-gradient(135deg, color-mix(in srgb, #ffffff 24%, transparent), transparent 48%),
      var(--tone, var(--ui-gantt-accent));
    box-shadow:
      0 7px 18px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 28%, transparent),
      inset 0 0 0 1px color-mix(in srgb, #ffffff 34%, transparent);
    transform: rotate(45deg);
    transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease;
  }

  .bar.milestone:hover .milestone-shape,
  .bar.milestone.dragging .milestone-shape {
    filter: saturate(1.1);
    transform: rotate(45deg) scale(1.08);
    box-shadow:
      0 10px 24px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 36%, transparent),
      inset 0 0 0 1px color-mix(in srgb, #ffffff 44%, transparent);
  }

  .bar.milestone .progress,
  .bar.milestone .handle,
  .bar.summary .handle {
    display: none;
  }

  /* The done part of a bar: a solid, darker shade of the bar's tone with a light edge where it stops, so
     the amount is readable from the bar itself and not only from the % column. */
  .progress {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    inline-size: var(--progress, 0%);
    background:
      linear-gradient(180deg, color-mix(in srgb, #ffffff 16%, transparent), transparent 46%),
      color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 58%, #0b1220);
    box-shadow: inset -2px 0 0 color-mix(in srgb, #ffffff 62%, transparent);
  }

  .bar.complete .progress,
  .progress.full {
    box-shadow: none;
  }

  .bar.summary .progress {
    background: color-mix(in srgb, #0b1220 58%, transparent);
  }

  :host([bar-variant="soft"]) .bar.task .progress {
    background:
      linear-gradient(180deg, color-mix(in srgb, #ffffff 24%, transparent), transparent 46%),
      color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 62%, var(--ui-gantt-panel));
    box-shadow: inset -2px 0 0 color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 85%, transparent);
  }

  .handle {
    position: absolute;
    inset-block: 0;
    inline-size: 14px;
    cursor: ew-resize;
    z-index: 2;
    opacity: 0;
    transition: opacity 120ms ease;
  }

  .handle.start {
    inset-inline-start: 0;
  }

  .handle.end {
    inset-inline-end: 0;
  }

  .handle::after {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inline-size: 4px;
    block-size: 11px;
    border-radius: 999px;
    background: color-mix(in srgb, #ffffff 82%, transparent);
    transform: translateY(-50%);
  }

  .handle.start::after {
    inset-inline-start: 4px;
  }

  .handle.end::after {
    inset-inline-end: 4px;
  }

  .bar:hover .handle,
  .bar.dragging .handle {
    opacity: 1;
  }

  /* A finger needs the 24px minimum target size, and a touch screen has no hover to reveal the handles:
     task bars grow from 18 to 24px tall (centred on the same line, so links and baselines still meet them),
     the resize handles from 14 to 24px wide and always show their grip. A very short bar keeps a middle to
     grab by giving each handle at most 35% of it. */
  @media (pointer: coarse) {
    .bar.task {
      block-size: 24px;
      top: 9px;
    }

    .handle {
      inline-size: min(24px, 35%);
      opacity: 1;
    }

    .handle.start::after {
      inset-inline-start: 8px;
    }

    .handle.end::after {
      inset-inline-end: 8px;
    }

    .connector {
      opacity: 1;
      inline-size: 20px;
      block-size: 20px;
      top: 11px;
    }
  }

  /* One tooltip for the whole chart, outside the bars (which clip their children), placed by script. It
     repeats the bar's accessible name, so it is hidden from assistive technology. */
  .bar-tip {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    z-index: 7;
    max-inline-size: 280px;
    padding: 6px 9px;
    border-radius: 8px;
    background: #0f172a;
    color: #f8fafc;
    font-size: 11px;
    line-height: 1.4;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.28);
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity 90ms ease;
  }

  .bar-tip[data-open] {
    opacity: 1;
    visibility: visible;
  }

  .bar-tip strong {
    display: block;
    font-weight: 750;
  }

  .bar-tip span {
    display: block;
    opacity: 0.88;
  }

  :host([bar-variant="soft"]) .bar.task,
  :host([bar-variant="soft"]) .split-segment {
    background:
      linear-gradient(180deg, color-mix(in srgb, #ffffff 38%, transparent), transparent 46%),
      color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 22%, var(--ui-gantt-panel));
    color: var(--ui-gantt-text);
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 34%, transparent),
      0 6px 15px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 14%, transparent);
  }

  :host([bar-variant="soft"]) .milestone-shape {
    background:
      linear-gradient(135deg, color-mix(in srgb, #ffffff 42%, transparent), transparent 52%),
      color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 28%, var(--ui-gantt-panel));
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 42%, transparent),
      0 7px 16px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 16%, transparent);
  }

  :host([bar-variant="striped"]) .bar.task,
  :host([bar-variant="striped"]) .split-segment {
    background:
      repeating-linear-gradient(135deg, color-mix(in srgb, #ffffff 24%, transparent) 0 7px, transparent 7px 14px),
      var(--tone, var(--ui-gantt-accent));
  }

  :host([bar-variant="striped"]) .milestone-shape {
    background:
      repeating-linear-gradient(135deg, color-mix(in srgb, #ffffff 28%, transparent) 0 5px, transparent 5px 10px),
      var(--tone, var(--ui-gantt-accent));
  }

  :host([bar-variant="outline"]) .bar.task,
  :host([bar-variant="outline"]) .split-segment {
    background: color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 8%, var(--ui-gantt-panel));
    box-shadow:
      inset 0 0 0 1.5px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 72%, transparent),
      0 6px 15px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 10%, transparent);
  }

  :host([bar-variant="outline"]) .bar.task .progress {
    background: color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 42%, transparent);
    box-shadow: inset -2px 0 0 color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 85%, transparent);
  }

  :host([bar-variant="outline"]) .milestone-shape {
    background: color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 10%, var(--ui-gantt-panel));
    box-shadow:
      inset 0 0 0 2px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 72%, transparent),
      0 7px 16px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 10%, transparent);
  }

  :host([bar-variant="glass"]) .bar.task,
  :host([bar-variant="glass"]) .split-segment {
    background:
      linear-gradient(180deg, color-mix(in srgb, #ffffff 50%, transparent), color-mix(in srgb, #ffffff 10%, transparent)),
      color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 72%, transparent);
    backdrop-filter: blur(8px);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, #ffffff 48%, transparent),
      inset 0 0 0 1px color-mix(in srgb, #ffffff 26%, transparent),
      0 10px 24px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 20%, transparent);
  }

  :host([bar-variant="glass"]) .milestone-shape {
    background:
      linear-gradient(135deg, color-mix(in srgb, #ffffff 52%, transparent), color-mix(in srgb, #ffffff 8%, transparent)),
      color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 74%, transparent);
    backdrop-filter: blur(8px);
  }

  /* The parts of a split bar carry the variant skin; the bar around them stays empty so the gaps are gaps. */
  :host([bar-variant]) .bar.split {
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  /* After the variant skins, which draw their own edge: a finished bar or part has no edge to show. */
  :host([bar-variant]) .bar.complete .progress,
  :host([bar-variant]) .bar .progress.full {
    box-shadow: none;
  }

  .today {
    position: absolute;
    inset-block: 0;
    inline-size: 2px;
    background: var(--ui-color-danger, #dc2626);
    z-index: 2;
    pointer-events: none;
  }

  /* In the header, under the unit labels (which sit at the top of their row), centred on the today line
     and kept inside the track at either end. */
  .today-pill {
    position: absolute;
    inset-block-end: 3px;
    z-index: 3;
    transform: translateX(-50%);
    padding: 0 6px;
    block-size: 14px;
    border-radius: 7px;
    background: var(--ui-color-danger, #dc2626);
    color: #ffffff;
    font-size: 10px;
    font-weight: 750;
    line-height: 14px;
    pointer-events: none;
  }

  .links {
    position: absolute;
    inset: 0;
    overflow: visible;
    pointer-events: none;
    z-index: 1;
  }

  .links path {
    fill: none;
    stroke: color-mix(in srgb, var(--ui-gantt-muted) 82%, transparent);
    stroke-width: 1.35;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
    marker-end: url(#ui-gantt-arrow);
  }

  .links .link-hit {
    stroke: transparent;
    stroke-width: 10;
    marker-end: none;
    pointer-events: stroke;
    cursor: pointer;
  }

  .links path:not(.link-hit) {
    pointer-events: none;
  }

  /* A dependency whose target starts or ends earlier than the link allows. */
  .links path.violated:not(.link-hit) {
    stroke: var(--ui-color-danger, #dc2626);
    stroke-width: 1.8;
    stroke-dasharray: 5 3;
    marker-end: url(#ui-gantt-arrow-bad);
  }

  .links marker#ui-gantt-arrow-bad path {
    fill: var(--ui-color-danger, #dc2626);
  }

  .links marker path {
    fill: color-mix(in srgb, var(--ui-gantt-muted) 82%, transparent);
    stroke: none;
  }

  .empty {
    padding: 28px;
    color: var(--ui-gantt-muted);
    font-size: 13px;
  }

  :host([variant="contrast"]) {
    --ui-gantt-bg: #0f172a;
    --ui-gantt-panel: #111827;
    --ui-gantt-border: #334155;
    --ui-gantt-grid: #263449;
    --ui-gantt-text: #e2e8f0;
    --ui-gantt-muted: #93a4bd;
    --ui-gantt-accent: #60a5fa;
    --ui-gantt-selected: rgba(96, 165, 250, 0.13);
  }

  :host([readonly]) .bar {
    cursor: pointer;
  }

  :host([headless]) .frame {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .bar,
    .progress {
      transition: none !important;
    }
  }

  /* Print: the whole chart, not a scroll area. Controls and handles are for the screen; the sticky headers stay put on the
     page; colours print as they are. A wide timeline is cut at the page edge, so print with the fit zoom or use exportSvg(). */
  @media print {
    .frame {
      box-shadow: none;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .controls,
    .splitter-rail,
    .connector,
    .bar-tip,
    .handle {
      display: none !important;
    }

    .viewport,
    :host([fill]) .viewport {
      overflow: visible;
      max-block-size: none;
    }

    .grid-head,
    .timeline-head,
    .grid-body,
    .splitter-rail.head {
      position: static;
    }

    .grid-row,
    .timeline-row {
      break-inside: avoid;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-gantt-bg: Canvas;
      --ui-gantt-panel: Canvas;
      --ui-gantt-border: CanvasText;
      --ui-gantt-grid: CanvasText;
      --ui-gantt-text: CanvasText;
      --ui-gantt-muted: CanvasText;
      --ui-gantt-accent: Highlight;
      --ui-gantt-selected: Highlight;
    }

    .frame,
    .grid-head,
    .timeline-head,
    .grid-body,
    .bar,
    .select,
    .control,
    .zoom-button,
    .today-button,
    .add-button {
      forced-color-adjust: none;
      box-shadow: none;
    }

    .bar-tip {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
      box-shadow: none;
    }
  }
`;

const tones: Record<string, string> = {
  default: 'var(--ui-color-primary, #2563eb)',
  info: 'var(--ui-color-info, #0e7490)',
  success: 'var(--ui-color-success, #15803d)',
  warning: 'var(--ui-color-warning, #b45309)',
  danger: 'var(--ui-color-danger, #dc2626)'
};

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseDate(value: unknown): number | null {
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? startOfDay(time) : null;
  }
  const input = String(value || '').trim();
  // A task date is a calendar day. Anything after the day ("T23:30:00Z", " 08:00", an offset) is ignored, so
  // a task never moves a day because of the viewer's time zone.
  const isoDay = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/.exec(input);
  if (isoDay) {
    const year = Number(isoDay[1]);
    const month = Number(isoDay[2]);
    const day = Number(isoDay[3]);
    const localDate = new Date(year, month - 1, day);
    const time = localDate.getTime();
    return Number.isFinite(time) ? startOfDay(time) : null;
  }
  const parsed = Date.parse(input);
  if (!Number.isFinite(parsed)) return null;
  return startOfDay(parsed);
}

function startOfDay(value: number): number {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function addDays(value: number, days: number): number {
  return startOfDay(value + days * DAY);
}

function formatIso(value: number): string {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatShortDate(value: number): string {
  return dateFormat({ month: 'short', day: 'numeric' }).format(new Date(value));
}

function normalizeZoom(value: string | null): GanttZoom {
  return value === 'day' || value === 'month' || value === 'quarter' || value === 'year' || value === 'fit' ? value : 'week';
}

/** The `fit` scale stays between "a year is a speck" and "a day is wider than a screen". */
const FIT_MIN_DAY_WIDTH = 0.2;
const FIT_MAX_DAY_WIDTH = 48;
/** Used for `fit` before the chart has a measured width (not laid out yet, or a test). */
const FIT_FALLBACK_WIDTH = 680;
const FIT_MIN_TRACK = 160;
/** The length of a task made by the Add button or a double-click on the timeline. */
const NEW_TASK_DAYS = 7;

/**
 * The header unit that reads best at a given scale: the finest whose cells are still wide enough
 * (about 44px) to carry their label.
 */
function unitForDayWidth(dayWidth: number): GanttUnit {
  if (dayWidth >= 22) return 'day';
  if (dayWidth * 7 >= 44) return 'week';
  if (dayWidth * 30 >= 44) return 'month';
  if (dayWidth * 91 >= 44) return 'quarter';
  return 'year';
}

function normalizeSort(value: string | null): GanttSort {
  return value === 'start' || value === 'end' || value === 'label' || value === 'progress' ? value : 'none';
}

function normalizeBarVariant(value: string | null): GanttBarVariant {
  return value === 'soft' || value === 'striped' || value === 'outline' || value === 'glass' ? value : 'solid';
}

/** A parent with no dates of its own, while `auto-summary` is on, is given this one until its children decide (see applyRollUp). */
const UNDATED = new Date(1970, 0, 1).getTime();

function parseTasks(raw: string | null, overrides: Map<string, Partial<GanttTask>>, allowUndatedParents = false): GanttTask[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry, index) => {
        if (!entry || typeof entry !== 'object') return null;
        const item = entry as Record<string, unknown>;
        const label = String(item.label || item.text || '').trim();
        let startMs = parseDate(item.start);
        const duration = Number(item.duration);
        let endMs = parseDate(item.end);
        if (endMs == null && startMs != null && Number.isFinite(duration)) endMs = addDays(startMs, Math.max(0, duration));
        const undated = allowUndatedParents && startMs == null && item.type === 'summary';
        if (undated) {
          startMs = UNDATED;
          endMs = addDays(UNDATED, 1);
        }
        if (!label || startMs == null) return null;
        const type = item.type === 'summary' || item.type === 'milestone' ? item.type : 'task';
        const safeEnd = type === 'milestone' ? startMs : Math.max(endMs ?? addDays(startMs, 1), addDays(startMs, 1));
        const id = String(item.id || `task-${index + 1}`);
        const override = overrides.get(id) || {};
        return {
          id,
          label: override.label || label,
          start: override.start || formatIso(startMs),
          end: override.end || formatIso(safeEnd),
          progress: Number.isFinite(Number(item.progress)) ? Math.max(0, Math.min(100, Number(item.progress))) : undefined,
          tone: typeof item.tone === 'string' ? (item.tone as GanttTone) : undefined,
          type,
          parent: item.parent != null ? String(item.parent) : undefined,
          open: item.open !== false,
          assignee: item.assignee != null ? String(item.assignee) : item.owner != null ? String(item.owner) : undefined,
          readonly: item.readonly === true,
          baselineStart: item.baselineStart != null ? String(item.baselineStart) : undefined,
          baselineEnd: item.baselineEnd != null ? String(item.baselineEnd) : undefined,
          critical: item.critical === true,
          undated,
          segments: Array.isArray(item.segments) ? item.segments as GanttTask['segments'] : undefined
        };
      })
      .filter(Boolean) as GanttTask[];
  } catch {
    return [];
  }
}

function parseLinks(raw: string | null): GanttLink[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry, index) => {
        if (!entry || typeof entry !== 'object') return null;
        const item = entry as Record<string, unknown>;
        const source = String(item.source || '').trim();
        const target = String(item.target || '').trim();
        if (!source || !target) return null;
        const type = item.type === 's2s' || item.type === 'e2e' || item.type === 's2e' ? item.type : 'e2s';
        const lag = Math.round(Number(item.lag));
        return { id: String(item.id || `link-${index + 1}`), source, target, type, lag: Number.isFinite(lag) ? lag : 0 };
      })
      .filter(Boolean) as GanttLink[];
  } catch {
    return [];
  }
}

function sortTasks(tasks: GanttTask[], sort: GanttSort): GanttTask[] {
  if (sort === 'none') return tasks;
  return [...tasks].sort((a, b) => {
    if (sort === 'label') return a.label.localeCompare(b.label);
    if (sort === 'progress') return Number(b.progress ?? 0) - Number(a.progress ?? 0);
    const left = parseDate(sort === 'start' ? a.start : a.end) ?? 0;
    const right = parseDate(sort === 'start' ? b.start : b.end) ?? 0;
    return left - right;
  });
}

function flattenTasks(tasks: GanttTask[], collapsed: Set<string>, filterText: string, sort: GanttSort): VisibleTask[] {
  const byParent = new Map<string, GanttTask[]>();
  const byId = new Map(tasks.map((task) => [task.id, task]));
  tasks.forEach((task) => {
    const key = task.parent && byId.has(task.parent) ? task.parent : '__root__';
    const group = byParent.get(key) || [];
    group.push(task);
    byParent.set(key, group);
  });

  const query = filterText.trim().toLowerCase();
  const matches = (task: GanttTask): boolean => {
    if (!query) return true;
    if (task.label.toLowerCase().includes(query)) return true;
    if ((task.assignee || '').toLowerCase().includes(query)) return true;
    return (byParent.get(task.id) || []).some(matches);
  };

  const rows: VisibleTask[] = [];
  const visit = (parent: string, depth: number) => {
    sortTasks(byParent.get(parent) || [], sort).forEach((task) => {
      if (!matches(task)) return;
      const startMs = parseDate(task.start);
      const endMs = parseDate(task.end);
      if (startMs == null || endMs == null) return;
      const hasChildren = (byParent.get(task.id) || []).length > 0;
      rows.push({ ...task, depth, hasChildren, startMs, endMs });
      if (hasChildren && !collapsed.has(task.id)) visit(task.id, depth + 1);
    });
  };

  visit('__root__', 0);
  return rows;
}

type HeaderUnit = GanttUnit;

/** The first day of the week as `Date#getDay` numbers it (0 is Sunday), from the user's locale; Monday if unknown. */
function localeWeekStart(): number {
  try {
    const tag = dateFormat({}).resolvedOptions().locale;
    const locale = new Intl.Locale(tag) as Intl.Locale & {
      weekInfo?: { firstDay: number };
      getWeekInfo?: () => { firstDay: number };
    };
    const info = typeof locale.getWeekInfo === 'function' ? locale.getWeekInfo() : locale.weekInfo;
    if (info && Number.isInteger(info.firstDay)) return info.firstDay % 7; // 1..7 with 7 = Sunday
  } catch {
    // no Intl.Locale week data
  }
  return 1;
}

function normalizeWeekStart(value: string | null): number {
  const parsed = value == null || value === '' ? NaN : Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 6 ? parsed : localeWeekStart();
}

/** The calendar boundary at or before `ms` for a header unit (a Monday, a 1st of the month, a Jan 1...). */
function unitStart(ms: number, unit: HeaderUnit, weekStart: number): number {
  const date = new Date(ms);
  date.setHours(0, 0, 0, 0);
  if (unit === 'week') date.setDate(date.getDate() - ((date.getDay() - weekStart + 7) % 7));
  else if (unit === 'month') date.setDate(1);
  else if (unit === 'quarter') date.setMonth(Math.floor(date.getMonth() / 3) * 3, 1);
  else if (unit === 'year') date.setMonth(0, 1);
  return date.getTime();
}

/** The next boundary after a boundary from `unitStart`. Uses calendar arithmetic, so months and DST stay exact. */
function nextUnit(ms: number, unit: HeaderUnit): number {
  const date = new Date(ms);
  if (unit === 'day') date.setDate(date.getDate() + 1);
  else if (unit === 'week') date.setDate(date.getDate() + 7);
  else if (unit === 'month') date.setMonth(date.getMonth() + 1);
  else if (unit === 'quarter') date.setMonth(date.getMonth() + 3);
  else date.setFullYear(date.getFullYear() + 1);
  return date.getTime();
}

type HeaderCell = { left: number; width: number; start: number; label: string };

/**
 * The cells of one header row: every `unit` between `min` and `endMs`, clipped to that range, positioned in
 * pixels. Only cells near the visible part of the scroll area are built, so a ten-year day scale stays cheap.
 */
function headerCells(
  unit: HeaderUnit,
  weekStart: number,
  min: number,
  endMs: number,
  dayWidth: number,
  viewportLeft: number,
  viewportWidth: number
): HeaderCell[] {
  const cells: HeaderCell[] = [];
  const visibleFrom = min + (Math.max(0, viewportLeft - 480) / dayWidth) * DAY;
  const visibleTo = viewportLeft + viewportWidth + 960;
  let cursor = unitStart(Math.max(min, visibleFrom), unit, weekStart);
  while (cursor < endMs) {
    const next = nextUnit(cursor, unit);
    const from = Math.max(cursor, min);
    const to = Math.min(next, endMs);
    const left = ((from - min) / DAY) * dayWidth;
    if (left > visibleTo) break;
    if (to > from) cells.push({ left, width: ((to - from) / DAY) * dayWidth, start: cursor, label: '' });
    cursor = next;
  }
  return cells;
}

/** Which days are not working days: a weekday list and a set of dates, each date with an optional label. */
type NonWorking = { weekdays: Set<number>; holidays: Map<number, string> };

const NO_NON_WORKING: NonWorking = { weekdays: new Set(), holidays: new Map() };

/**
 * `non-working-days`: weekday numbers (0 is Sunday) as `0,6` or `[0, 6]`; the attribute with no value means the weekend.
 * `holidays`: a JSON array of dates (`YYYY-MM-DD`) or `{ "date": ..., "label": ... }` objects.
 */
function parseNonWorking(daysRaw: string | null, holidaysRaw: string | null): NonWorking {
  const weekdays = new Set<number>();
  if (daysRaw != null) {
    const text = daysRaw.trim();
    if (text === '') {
      weekdays.add(0);
      weekdays.add(6);
    } else {
      let items: unknown[] = text.split(',');
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) items = parsed;
        else if (typeof parsed === 'number') items = [parsed];
      } catch {
        // a plain comma list
      }
      for (const item of items) {
        const day = Number(typeof item === 'string' ? item.trim() : item);
        if (Number.isInteger(day) && day >= 0 && day <= 6) weekdays.add(day);
      }
    }
  }
  const holidays = new Map<number, string>();
  if (holidaysRaw) {
    try {
      const parsed = JSON.parse(holidaysRaw);
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          const object = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : null;
          const ms = parseDate(object ? object.date : entry);
          if (ms != null) holidays.set(ms, object && typeof object.label === 'string' ? object.label : '');
        }
      }
    } catch {
      // malformed JSON: no holidays
    }
  }
  return { weekdays, holidays };
}

function isNonWorking(ms: number, off: NonWorking): boolean {
  return off.holidays.has(ms) || off.weekdays.has(new Date(ms).getDay());
}

/** Below this many px a day the shading would be stripes, so it is left out (month scales and wider). */
const MIN_SHADE_DAY_WIDTH = 8;

/**
 * The shaded stretches of non-working days near the visible part of the scroll area, as absolutely positioned spans:
 * runs of the same kind of day are one span, and a holiday is drawn apart from an ordinary non-working day.
 */
function createNonWorkingShading(min: number, endMs: number, dayWidth: number, off: NonWorking, viewportLeft: number, viewportWidth: number): string {
  if (dayWidth < MIN_SHADE_DAY_WIDTH || (!off.weekdays.size && !off.holidays.size)) return '';
  const first = Math.max(0, Math.floor(Math.max(0, viewportLeft - 480) / dayWidth));
  const last = Math.min(Math.ceil((endMs - min) / DAY), Math.ceil((viewportLeft + viewportWidth + 960) / dayWidth));
  const spans: string[] = [];
  let runStart = -1;
  let runKind = '';
  const close = (end: number) => {
    if (runStart >= 0) spans.push(`<span class="off-day${runKind}" style="left:${(runStart * dayWidth).toFixed(2)}px;width:${((end - runStart) * dayWidth).toFixed(2)}px"></span>`);
    runStart = -1;
  };
  for (let i = first; i < last; i += 1) {
    const day = shiftDays(min, i);
    const kind = off.holidays.has(day) ? ' holiday' : off.weekdays.has(new Date(day).getDay()) ? '' : null;
    if (kind === null || (runStart >= 0 && kind !== runKind)) close(i);
    if (kind !== null && runStart < 0) {
      runStart = i;
      runKind = kind;
    }
  }
  close(last);
  return spans.join('');
}

/** Below this many pixels a clipped first or last cell has no room for its label. */
const MIN_LABEL_WIDTH = 36;

/**
 * The time header: a top band (month and year, or year) over a bottom row (day, week start, month, quarter),
 * so every column says exactly which period it is. At the year scale there is one row of years.
 */
function createTimeHeader(
  min: number,
  endMs: number,
  dayWidth: number,
  zoom: GanttUnit,
  weekStart: number,
  viewportLeft = 0,
  viewportWidth = Number.POSITIVE_INFINITY,
  off: NonWorking = NO_NON_WORKING
): string {
  const today = startOfDay(Date.now());
  const monthYear = dateFormat({ month: 'long', year: 'numeric' });
  const monthOnly = dateFormat({ month: 'short' });
  const weekday = dateFormat({ weekday: 'narrow' });
  const cell = (cls: string, item: HeaderCell, inner: string, title = '') =>
    `<span class="${cls}" style="left:${item.left.toFixed(2)}px;width:${item.width.toFixed(2)}px"${title ? ` title="${escapeHtml(title)}"` : ''}>${inner}</span>`;

  const bottomUnit: HeaderUnit = zoom;
  const bottom = headerCells(bottomUnit, weekStart, min, endMs, dayWidth, viewportLeft, viewportWidth).map((item) => {
    const date = new Date(item.start);
    const fits = item.width >= MIN_LABEL_WIDTH;
    if (zoom === 'day') {
      const isToday = item.start === today;
      const holiday = off.holidays.get(item.start);
      return cell(
        `tick day${isToday ? ' today-cell' : ''}${isNonWorking(item.start, off) ? ' off' : ''}`,
        item,
        `<span class="dow">${escapeHtml(weekday.format(date))}</span><span class="num">${date.getDate()}</span>`,
        holiday || ''
      );
    }
    if (zoom === 'week') return cell('tick', item, fits ? `<span class="num">${date.getDate()}</span>` : '', formatShortDate(item.start));
    if (zoom === 'month') return cell('tick', item, fits ? escapeHtml(monthOnly.format(date)) : '', monthYear.format(date));
    if (zoom === 'quarter') return cell('tick', item, fits ? `Q${Math.floor(date.getMonth() / 3) + 1}` : '', `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`);
    return cell('tick', item, fits ? String(date.getFullYear()) : '');
  }).join('');

  if (zoom === 'year') return `<div class="band bottom">${bottom}</div>`;

  const topUnit: HeaderUnit = zoom === 'day' || zoom === 'week' ? 'month' : 'year';
  const top = headerCells(topUnit, weekStart, min, endMs, dayWidth, viewportLeft, viewportWidth).map((item) => {
    const date = new Date(item.start);
    const full = topUnit === 'month' ? monthYear.format(date) : String(date.getFullYear());
    const label = item.width < MIN_LABEL_WIDTH ? '' : topUnit === 'month' && item.width < 120 ? monthOnly.format(date) : full;
    return cell('band-cell', item, escapeHtml(label), full);
  }).join('');
  return `<div class="band top">${top}</div><div class="band bottom">${bottom}</div>`;
}

function taskIds(raw: string | null): Set<string> {
  const ids = new Set<string>();
  if (!raw) return ids;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      parsed.forEach((entry, index) => {
        if (entry && typeof entry === 'object') ids.add(String((entry as { id?: unknown }).id || `task-${index + 1}`));
      });
    }
  } catch {
    // a malformed value has no ids
  }
  return ids;
}

function sharesAnId(a: Set<string>, b: Set<string>): boolean {
  for (const id of a) if (b.has(id)) return true;
  return false;
}

/**
 * Vertical lines on the header's unit boundaries, so the body lines up with the columns above it. The day
 * scale keeps its per-day lines from the stylesheet; the month scale and wider would otherwise be a solid
 * wash of lines a few pixels apart.
 */
function createUnitLines(
  min: number,
  endMs: number,
  dayWidth: number,
  zoom: GanttUnit,
  weekStart: number,
  viewportLeft: number,
  viewportWidth: number
): string {
  if (zoom === 'day') return '';
  return headerCells(zoom, weekStart, min, endMs, dayWidth, viewportLeft, viewportWidth)
    .filter((cell) => cell.start >= min)
    .map((cell) => `<span class="unit-line" style="left:${cell.left.toFixed(2)}px"></span>`)
    .join('');
}

/**
 * How much of each part of a split task is done, as percentages. A part with its own `progress` uses it; the
 * others share the task's overall progress in order, earliest first, weighted by their length.
 */
function segmentFills(parts: Array<{ duration: number; progress?: number }>, overall: number): number[] {
  const clamp = (value: number) => Math.max(0, Math.min(100, value));
  let remaining = parts.reduce((sum, part) => (part.progress == null ? sum + part.duration : sum), 0) * (clamp(overall) / 100);
  return parts.map((part) => {
    if (part.progress != null) return clamp(part.progress);
    const taken = Math.min(part.duration, remaining);
    remaining -= taken;
    return part.duration > 0 ? (taken / part.duration) * 100 : 0;
  });
}

/** The parts of a split task, each with its own progress fill. Parts outside the task's dates are clipped away. */
function renderSegments(task: VisibleTask, overall: number): string {
  const range = Math.max(DAY, task.endMs - task.startMs);
  const parts: Array<{ left: number; width: number; duration: number; progress?: number }> = [];
  for (const segment of task.segments || []) {
    const segmentStart = parseDate(segment.start);
    const segmentEnd = parseDate(segment.end);
    if (segmentStart == null || segmentEnd == null) continue;
    const clippedStart = Math.max(task.startMs, segmentStart);
    const clippedEnd = Math.min(task.endMs, segmentEnd);
    if (clippedEnd <= clippedStart) continue;
    const left = Math.max(0, Math.min(100, ((clippedStart - task.startMs) / range) * 100));
    const width = Math.min(100 - left, Math.max(1, ((clippedEnd - clippedStart) / range) * 100));
    if (width <= 0) continue;
    const own = Number(segment.progress);
    parts.push({
      left,
      width,
      duration: clippedEnd - clippedStart,
      progress: segment.progress != null && Number.isFinite(own) ? own : undefined
    });
  }
  const fills = segmentFills(parts, overall);
  return parts
    .map((part, index) =>
      `<span class="split-segment" style="left:${part.left.toFixed(2)}%;width:${part.width.toFixed(2)}%">` +
      `<span class="progress${fills[index] >= 100 ? ' full' : ''}" style="--progress:${fills[index].toFixed(2)}%"></span></span>`
    )
    .join('');
}

/** `CSS.escape` where it exists (it does not in jsdom); otherwise escape what would end a quoted attribute value. */
function cssEscape(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(value);
  return value.replace(/["\\]/g, '\\$&');
}

function rowSelector(taskId: string): string {
  return `.grid-row[data-task-id="${cssEscape(taskId)}"]`;
}

function barSelector(taskId: string): string {
  return `.bar[data-task-id="${cssEscape(taskId)}"]`;
}

/** A selector that finds the same control again after a re-render, or null for anything not worth restoring. */
function focusSelectorFor(el: HTMLElement): string | null {
  if (el.classList.contains('control')) return '.control';
  if (el.classList.contains('select')) return '.select';
  if (el.classList.contains('zoom-button') && el.dataset.zoom) return `.zoom-button[data-zoom="${cssEscape(el.dataset.zoom)}"]`;
  if (el.classList.contains('today-button')) return '.today-button';
  if (el.classList.contains('add-button')) return '.add-button';
  if (el.classList.contains('rename')) return '.rename';
  if (el.classList.contains('head-button') && el.dataset.sort) return `.head-button[data-sort="${cssEscape(el.dataset.sort)}"]`;
  if (el.classList.contains('splitter') && el.getAttribute('role') === 'separator') return '.splitter[role="separator"]';
  if (el.classList.contains('link-hit') && el.dataset.linkId) return `.link-hit[data-link-id="${cssEscape(el.dataset.linkId)}"]`;
  if (el.classList.contains('bar') && el.dataset.taskId) return barSelector(el.dataset.taskId);
  if (el.classList.contains('grid-row') && el.dataset.taskId) return rowSelector(el.dataset.taskId);
  if (el.classList.contains('expander') && el.dataset.taskId) return `.expander[data-task-id="${cssEscape(el.dataset.taskId)}"]`;
  return null;
}

/** Every word the component shows or announces, so a host can translate it. `tasksCount` takes {shown} and {total}. */
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
  linkViolated: string;
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

const DEFAULT_LABELS: GanttLabels = {
  title: 'Project schedule',
  tasksCount: '{shown}/{total} tasks',
  filterPlaceholder: 'Filter tasks',
  filterLabel: 'Filter tasks',
  sortLabel: 'Sort tasks',
  sortManual: 'Manual',
  sortStart: 'Start date',
  sortEnd: 'End date',
  sortName: 'Name',
  sortProgress: 'Progress',
  zoomDay: 'day',
  zoomWeek: 'week',
  zoomMonth: 'month',
  zoomQuarter: 'quarter',
  zoomYear: 'year',
  zoomFit: 'fit',
  zoomFitTitle: 'Fit the whole project to the width',
  columnTask: 'Task',
  columnOwner: 'Owner',
  columnDates: 'Dates',
  columnProgress: '%',
  columnStart: 'Start',
  columnEnd: 'End',
  columnDuration: 'Days',
  splitter: 'Resize the task list',
  scrollToToday: 'Scroll to today',
  addTask: 'Add task',
  rename: 'Rename task',
  linkViolated: 'dependency not met',
  empty: 'No tasks in this range',
  noMatches: 'No matching tasks',
  expand: 'Expand',
  collapse: 'Collapse',
  timeline: 'Timeline',
  today: 'Today',
  summary: 'summary',
  milestone: 'milestone',
  to: 'to',
  complete: 'complete',
  assigned: 'assigned to',
  critical: 'critical'
};

type ColumnKey = 'label' | 'assignee' | 'dates' | 'start' | 'end' | 'duration' | 'progress';

type ColumnDef = {
  key: ColumnKey;
  title: keyof GanttLabels;
  /** A header label that replaces the translated one. */
  custom?: string;
  sort?: GanttSort;
  /** Width in px. For the name column it is the minimum: that column takes the room the others leave. */
  width: number;
};

const COLUMN_DEFS: Record<ColumnKey, { title: keyof GanttLabels; sort?: GanttSort; width: number }> = {
  label: { title: 'columnTask', sort: 'label', width: 170 },
  assignee: { title: 'columnOwner', width: 82 },
  dates: { title: 'columnDates', sort: 'start', width: 80 },
  start: { title: 'columnStart', sort: 'start', width: 74 },
  end: { title: 'columnEnd', sort: 'end', width: 74 },
  duration: { title: 'columnDuration', width: 56 },
  progress: { title: 'columnProgress', sort: 'progress', width: 44 }
};
const DEFAULT_COLUMNS: ColumnKey[] = ['label', 'assignee', 'dates', 'progress'];
/** The least the name column keeps when the user drags the grid narrower than its natural width. */
const LABEL_MIN_USER = 96;

/**
 * The `columns` attribute: a JSON array of keys (`"assignee"`) or objects (`{"key": "dates", "label": "When", "width": 120}`).
 * The name column is always first; unknown and repeated keys are dropped.
 */
function parseColumns(raw: string | null): ColumnDef[] {
  let entries: unknown[] = DEFAULT_COLUMNS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) entries = parsed;
    } catch {
      // malformed JSON: the default columns
    }
  }
  const columns: ColumnDef[] = [];
  const seen = new Set<string>();
  for (const entry of entries) {
    const object = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : null;
    let key = typeof entry === 'string' ? entry : object ? object.key : null;
    if (key === 'owner') key = 'assignee';
    if (typeof key !== 'string' || !(key in COLUMN_DEFS) || seen.has(key)) continue;
    seen.add(key);
    const def = COLUMN_DEFS[key as ColumnKey];
    const width = object ? Number(object.width) : NaN;
    columns.push({
      key: key as ColumnKey,
      title: def.title,
      custom: object && typeof object.label === 'string' && object.label ? object.label : undefined,
      sort: def.sort,
      width: Number.isFinite(width) && width >= 36 ? Math.min(Math.round(width), 400) : def.width
    });
  }
  const at = columns.findIndex((column) => column.key === 'label');
  if (at > 0) columns.unshift(columns.splice(at, 1)[0]);
  if (at < 0) columns.unshift({ key: 'label', title: 'columnTask', sort: 'label', width: COLUMN_DEFS.label.width });
  return columns;
}

/** The grid's width and its column template, for the columns and a width the user may have set. */
function columnLayout(columns: ColumnDef[], userWidth: number | null) {
  const others = columns.slice(1).reduce((sum, column) => sum + column.width, 0);
  const labelMin = userWidth != null ? LABEL_MIN_USER : columns[0].width;
  const min = others + LABEL_MIN_USER;
  return {
    width: userWidth != null ? Math.max(Math.round(userWidth), min) : others + columns[0].width,
    min,
    template: columns.map((column, i) => (i === 0 ? `minmax(${labelMin}px, 1fr)` : `${column.width}px`)).join(' ')
  };
}


/**
 * The locale for dates, set from the `locale` attribute at the start of each render. A render is synchronous, so a
 * module variable is enough to reach the formatters without threading it through every helper.
 */
let activeLocale: string | undefined;

function dateFormat(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  try {
    return new Intl.DateTimeFormat(activeLocale, options);
  } catch {
    return new Intl.DateTimeFormat(undefined, options);
  }
}

type TaskDescription = {
  /** The accessible name of the bar: label, kind, dates, progress, assignee, critical. */
  name: string;
  title: string;
  /** The word for a summary or a milestone, or empty. */
  kindWord: string;
  /** Dates, with the kind in front of a summary or a milestone. */
  when: string;
  /** Progress, assignee and the critical flag, or empty. */
  more: string;
};

function describeTask(task: VisibleTask, kind: GanttTaskType, format: Intl.DateTimeFormat, text: GanttLabels): TaskDescription {
  const start = format.format(new Date(task.startMs));
  const dates = kind === 'milestone' ? start : `${start} ${text.to} ${format.format(new Date(task.endMs))}`;
  const kindWord = kind === 'summary' || kind === 'milestone' ? text[kind] : '';
  const extras: string[] = [];
  if (task.progress != null && kind !== 'milestone') extras.push(`${Math.round(task.progress)}% ${text.complete}`);
  if (task.assignee) extras.push(`${text.assigned} ${task.assignee}`);
  if (task.critical) extras.push(text.critical);
  return {
    name: [task.label, kindWord, dates, ...extras].filter(Boolean).join(', '),
    title: task.label,
    kindWord,
    when: [kindWord, dates].filter(Boolean).join(' · '),
    more: extras.join(' · ')
  };
}

function zoomLabel(zoom: GanttZoom, text: GanttLabels): string {
  return { day: text.zoomDay, week: text.zoomWeek, month: text.zoomMonth, quarter: text.zoomQuarter, year: text.zoomYear, fit: text.zoomFit }[zoom];
}

/** A CSS length for the `max-height` attribute (or `none`), or null for anything else, so it cannot carry other CSS. */
function parseCssLength(raw: string | null): string | null {
  const value = (raw || '').trim();
  return value === 'none' || /^\d*\.?\d+(px|em|rem|vh|dvh|svh|lvh|vw|%|ch)$/.test(value) ? value : null;
}

function toSchedLink(link: GanttLink): SchedLink {
  return { id: link.id, source: link.source, target: link.target, type: link.type || 'e2s', lag: link.lag ?? 0 };
}

/** `schedule`: "warn" (the default) draws a link whose target is too early in the danger colour; "auto" also pushes the tasks that follow a task that moved; "off" does neither. */
function normalizeSchedule(value: string | null): 'warn' | 'auto' | 'off' {
  return value === 'auto' || value === 'off' ? value : 'warn';
}

function toSched(task: GanttTask): SchedTask | null {
  const start = parseDate(task.start);
  const end = parseDate(task.end);
  if (start == null || end == null) return null;
  return { id: task.id, start, end, parent: task.parent, type: task.type, readonly: task.readonly, progress: task.progress };
}

/** `auto-summary`: a parent's dates (and its progress, when it has none of its own) follow its children. */
function applyRollUp(tasks: GanttTask[]): GanttTask[] {
  const rolled = rollUp(tasks.map(toSched).filter((task): task is SchedTask => task != null));
  return tasks
    .map((task) => {
      const value = rolled.get(task.id);
      if (!value) return task;
      return { ...task, undated: false, start: formatIso(value.start), end: formatIso(value.end), progress: task.progress ?? value.progress };
    })
    // a parent with no dates and no children has nothing to take them from
    .filter((task) => !task.undated);
}

/** `critical-path`: mark the tasks with no slack on a tight chain of links as critical (a `critical: true` you set stays). */
function applyCriticalPath(tasks: GanttTask[], links: GanttLink[]): GanttTask[] {
  const ids = criticalPath(tasks.map(toSched).filter((task): task is SchedTask => task != null), links.map(toSchedLink));
  return ids.size ? tasks.map((task) => (ids.has(task.id) && !task.critical ? { ...task, critical: true } : task)) : tasks;
}

function readJsonArray(raw: string | null): Array<any> {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** A `Date` becomes the calendar day it is locally, like the React wrapper writes it. */
function toAttrDate(value: unknown): unknown {
  return value instanceof Date ? (Number.isFinite(value.getTime()) ? formatIso(value.getTime()) : undefined) : value;
}

function writeJsonArray(el: HTMLElement, name: string, value: Array<Record<string, unknown>> | null | undefined, dates: boolean): void {
  if (!Array.isArray(value)) {
    el.removeAttribute(name);
    return;
  }
  const prepared = dates
    ? value.map((item) => {
        const next: Record<string, unknown> = { ...item };
        for (const key of ['start', 'end', 'baselineStart', 'baselineEnd']) if (key in next) next[key] = toAttrDate(next[key]);
        if (Array.isArray(next.segments)) {
          next.segments = (next.segments as Array<Record<string, unknown>>).map((segment) => ({ ...segment, start: toAttrDate(segment.start), end: toAttrDate(segment.end) }));
        }
        return next;
      })
    : value;
  try {
    el.setAttribute(name, JSON.stringify(prepared));
  } catch {
    // not serialisable (a cycle): leave the attribute as it is
  }
}

function parseUserGrid(raw: string | null): number | null {
  const value = raw == null || raw === '' ? NaN : Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function taskKind(task: VisibleTask): GanttTaskType {
  if (task.type === 'summary' || task.hasChildren) return 'summary';
  if (task.type === 'milestone' || task.startMs === task.endMs) return 'milestone';
  return 'task';
}

function barCenterY(task: VisibleTask): number {
  const kind = taskKind(task);
  if (kind === 'summary') return 17 + 9 / 2;
  if (kind === 'milestone') return 7 + MILESTONE_SIZE / 2;
  return 12 + 18 / 2;
}

function barStartX(task: VisibleTask, xForDate: (value: number) => number): number {
  return taskKind(task) === 'milestone'
    ? xForDate(task.startMs) - MILESTONE_DIAMOND_HALF
    : xForDate(task.startMs);
}

function barEndX(task: VisibleTask, xForDate: (value: number) => number): number {
  return taskKind(task) === 'milestone'
    ? xForDate(task.startMs) + MILESTONE_DIAMOND_HALF
    : xForDate(task.endMs);
}

function linkSideX(task: VisibleTask, side: 'start' | 'end', xForDate: (value: number) => number): number {
  return side === 'start' ? barStartX(task, xForDate) : barEndX(task, xForDate);
}

function linkTypeSides(type: LinkType = 'e2s'): { source: 'start' | 'end'; target: 'start' | 'end' } {
  if (type === 's2s') return { source: 'start', target: 'start' };
  if (type === 'e2e') return { source: 'end', target: 'end' };
  if (type === 's2e') return { source: 'start', target: 'end' };
  return { source: 'end', target: 'start' };
}

function routeDependencyPath(
  sourceTask: VisibleTask,
  sourceIndex: number,
  targetTask: VisibleTask,
  targetIndex: number,
  linkType: LinkType | undefined,
  xForDate: (value: number) => number
): string {
  const sides = linkTypeSides(linkType);
  const sourceDirection = sides.source === 'start' ? -1 : 1;
  const targetDirection = sides.target === 'start' ? 1 : -1;
  const x1 = linkSideX(sourceTask, sides.source, xForDate);
  const x2 = linkSideX(targetTask, sides.target, xForDate);
  const y1 = sourceIndex * ROW_HEIGHT + barCenterY(sourceTask);
  const y2 = targetIndex * ROW_HEIGHT + barCenterY(targetTask);
  const clearance = 22;
  const exitX = x1 + sourceDirection * clearance;
  const entryX = x2 - targetDirection * clearance;
  const minLaneGap = 26;
  let midX = (exitX + entryX) / 2;

  if (sourceDirection === targetDirection) {
    const openSide = sourceDirection === 1
      ? Math.max(exitX, entryX, x1, x2) + minLaneGap
      : Math.min(exitX, entryX, x1, x2) - minLaneGap;
    const hasRoom = sourceDirection === 1 ? entryX > exitX + minLaneGap : entryX < exitX - minLaneGap;
    midX = hasRoom ? midX : openSide;
  } else {
    const crossesBack = sourceDirection === 1 ? entryX < exitX : entryX > exitX;
    if (crossesBack) midX = sourceDirection === 1
      ? Math.max(exitX, x1, x2) + minLaneGap
      : Math.min(exitX, x1, x2) - minLaneGap;
  }

  const laneY = Math.abs(y2 - y1) < 1
    ? (sides.target === 'start' ? y2 - 16 : y2 + 16)
    : y2 > y1
      ? y2 - ROW_HEIGHT / 2 + 3
      : y2 + ROW_HEIGHT / 2 - 3;
  const points = [[x1, y1], [exitX, y1], [midX, y1], [midX, laneY], [entryX, laneY], [entryX, y2], [x2, y2]];

  return points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}

export class UIGantt extends ElementBase {
  static get observedAttributes() {
    return ['tasks', 'links', 'zoom', 'filter', 'sort', 'bar-variant', 'variant', 'readonly', 'show-toolbar', 'show-today', 'headless', 'week-start', 'labels', 'locale', 'columns', 'grid-width', 'fill', 'max-height', 'snap', 'creatable', 'auto-summary', 'cascade', 'schedule', 'critical-path', 'non-working-days', 'holidays', 'linkable'];
  }

  private focusRequest: FocusSnapshot | null = null;
  private collapsed = new Set<string>();
  /** Task ids already seen, so `open: false` collapses a branch once and never fights the user's toggle. */
  private seededIds = new Set<string>();
  private overrides = new Map<string, Partial<GanttTask>>();
  private drag: DragState | null = null;
  private selectedId: string | null = null;
  private internalFilter = '';
  private viewportTop = 0;
  private viewportLeft = 0;
  private viewportWidth = 1800;
  private hostWidth = 0;
  /** Where the scroll area was when the header cells and shading were last built: they cover a window around it. */
  private renderedLeft = 0;
  /** A smooth scroll in progress, so a render that replaces the scroll area can carry on with it. */
  private smoothTarget: { left?: number; top?: number } | null = null;
  private selectedLinkId: string | null = null;
  private linking: LinkDrag | null = null;
  private editingId: string | null = null;
  private editingValue = '';
  private suppressBlur = false;
  private layoutInfo = { min: 0, dayWidth: 13, gridWidth: GRID_WIDTH, rangeEnd: 0 };
  private visibleIds: string[] = [];
  private initialScrollPending = true;
  private pendingReveal: { id: string; behavior: ScrollBehavior } | null = null;
  private hostHeight = 0;
  private virtualizedNow = false;
  private gridBounds = { min: 0, max: 0, width: GRID_WIDTH };
  private descriptions = new Map<string, TaskDescription>();
  private tipTimer: number | null = null;
  private pointerFocus = false;
  /** Width of the scroll area's vertical scrollbar, measured after a render; `fit` leaves room for it. */
  private scrollbarWidth = 0;
  /** The pixels per day the last render used, for dragging. */
  private dayWidthNow = zoomPixels.week;
  private resizeObserver: ResizeObserver | null = null;
  private viewportHeight = 620;
  private renderedFirstRow = 0;
  private renderedLastRow = 0;
  private scrollFrame: number | null = null;
  private overridesVersion = 0;
  private taskCacheRaw: string | null = null;
  private taskCacheVersion = -1;
  private taskCacheAuto = false;
  private taskCacheCritical: string | null = null;
  private taskCache: GanttTask[] = [];
  private linkCacheRaw: string | null = null;
  private linkCache: GanttLink[] = [];
  private visibleCacheKey = '';
  private visibleCache: VisibleTask[] = [];

  override connectedCallback(): void {
    // A property set before the element was defined sits on the instance and would hide the accessor.
    for (const name of ['tasks', 'links', 'holidays'] as const) {
      if (Object.prototype.hasOwnProperty.call(this, name)) {
        const value = (this as unknown as Record<string, unknown>)[name];
        delete (this as unknown as Record<string, unknown>)[name];
        (this as unknown as Record<string, unknown>)[name] = value;
      }
    }
    super.connectedCallback();
    if (typeof ResizeObserver === 'undefined' || this.resizeObserver) return;
    this.resizeObserver = new ResizeObserver((entries) => {
      const box = entries[entries.length - 1]?.contentRect;
      const width = box?.width ?? 0;
      const height = box?.height ?? 0;
      // clientWidth is a whole number and the observer's width is not: a host 540.4px wide must not look resized.
      const widthChanged = Math.abs(width - this.hostWidth) >= 1;
      // A change of height only matters when the height is set from outside or the rows are windowed by it.
      const heightChanged = Math.abs(height - this.hostHeight) >= 1 && (this.hasAttribute('fill') || this.virtualizedNow);
      this.hostHeight = height;
      if (!widthChanged && !heightChanged) return;
      if (widthChanged) this.hostWidth = Math.round(width);
      this.captureViewport();
      this.requestRender();
    });
    this.resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.tipTimer != null) window.clearTimeout(this.tipTimer);
    this.tipTimer = null;
    super.disconnectedCallback();
  }

  private labelsRaw: string | null = null;
  private labelsCache: GanttLabels = DEFAULT_LABELS;

  /** The labels: the defaults with whatever the `labels` attribute (a JSON object) overrides. */
  private labelSet(): GanttLabels {
    const raw = this.getAttribute('labels');
    if (raw === this.labelsRaw) return this.labelsCache;
    this.labelsRaw = raw;
    this.labelsCache = DEFAULT_LABELS;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const merged: Record<string, string> = { ...DEFAULT_LABELS };
          for (const [key, value] of Object.entries(parsed)) {
            if (key in DEFAULT_LABELS && typeof value === 'string') merged[key] = value;
          }
          this.labelsCache = merged as GanttLabels;
        }
      } catch {
        // malformed JSON: keep the defaults
      }
    }
    return this.labelsCache;
  }

  protected override render(): void {
    // Replacing the tree may blur the rename field; that is not the user leaving it.
    this.suppressBlur = true;
    queueMicrotask(() => {
      this.suppressBlur = false;
    });
    activeLocale = this.getAttribute('locale') || undefined;
    const text = this.labelSet();
    const tasks = this.getTasks();
    const links = this.getLinks();
    const zoom = normalizeZoom(this.getAttribute('zoom'));
    const sort = normalizeSort(this.getAttribute('sort'));
    const barVariant = normalizeBarVariant(this.getAttribute('bar-variant'));
    const filterText = this.getAttribute('filter') ?? this.internalFilter;
    const visible = this.getVisibleTasks(tasks, filterText, sort);
    const readonly = this.hasAttribute('readonly');
    const creatable = this.hasAttribute('creatable') && !readonly;
    const cascade = this.hasAttribute('cascade');
    const linkable = this.hasAttribute('linkable') && !readonly;
    const showToolbar = this.getAttribute('show-toolbar') !== 'false';
    const showToday = this.getAttribute('show-today') !== 'false';

    if (!tasks.length) {
      this.setContent(`
        <style>${style}</style>
        <section class="frame" part="frame">
          <div class="empty" part="empty">${escapeHtml(text.empty)}</div>
        </section>
      `);
      return;
    }

    const allStarts = tasks.map((task) => parseDate(task.start)).filter((value): value is number => value != null);
    const allEnds = tasks.map((task) => parseDate(task.end)).filter((value): value is number => value != null);
    const min = addDays(Math.min(...allStarts), -2);
    const max = addDays(Math.max(...allEnds), 3);
    const totalDays = Math.max(7, Math.ceil((max - min) / DAY));
    // The host's width decides the compact layout, how far a wide host is filled (A5) and, for `fit`, the scale.
    this.hostWidth = this.clientWidth || this.hostWidth;
    const frameWidth = this.hostWidth - FRAME_BORDER;
    this.hostHeight = this.clientHeight || this.hostHeight;
    const maxHeight = parseCssLength(this.getAttribute('max-height'));
    const compact = this.hostWidth > 0 && frameWidth <= COMPACT_MAX_WIDTH;
    const columns = parseColumns(this.getAttribute('columns'));
    const layout = columnLayout(columns, parseUserGrid(this.getAttribute('grid-width')));
    const gridWidth = compact ? COMPACT_GRID_WIDTH : layout.width;
    this.gridBounds = { min: layout.min, max: Math.max(layout.min, this.hostWidth > 0 ? frameWidth - 240 : 1200), width: layout.width };
    const fitting = zoom === 'fit';
    const fitAvailable = this.hostWidth > 0 ? frameWidth - gridWidth - this.scrollbarWidth : FIT_FALLBACK_WIDTH;
    const dayWidth = fitting
      ? Math.max(FIT_MIN_DAY_WIDTH, Math.min(FIT_MAX_DAY_WIDTH, fitAvailable / totalDays))
      : zoomPixels[zoom];
    const unit: GanttUnit = fitting ? unitForDayWidth(dayWidth) : zoom;
    this.dayWidthNow = dayWidth;
    const timelineWidth = Math.max(fitting ? FIT_MIN_TRACK : 680, totalDays * dayWidth);
    const rowsHeight = Math.max(visible.length * ROW_HEIGHT, ROW_HEIGHT);
    const virtualized = this.getAttribute('virtualized') !== 'false' && visible.length > 240;
    this.virtualizedNow = virtualized;
    const viewportRows = Math.max(20, Math.ceil(Math.max(420, this.viewportHeight - HEADER_HEIGHT) / ROW_HEIGHT));
    const overscan = 160;
    // Fewer rows than before (a filter, new data): do not window against a scroll offset past the end.
    this.viewportTop = Math.min(this.viewportTop, Math.max(0, rowsHeight + HEADER_HEIGHT - this.viewportHeight));
    const rowScrollTop = Math.max(0, this.viewportTop - HEADER_HEIGHT);
    const firstVisibleRow = Math.max(0, Math.floor(rowScrollTop / ROW_HEIGHT));
    const windowStride = Math.max(180, viewportRows * 4);
    const firstRow = virtualized ? Math.max(0, Math.floor(firstVisibleRow / windowStride) * windowStride - overscan) : 0;
    const lastRow = virtualized ? Math.min(visible.length, firstRow + viewportRows + overscan * 2 + windowStride) : visible.length;
    const rendered = visible.slice(firstRow, lastRow);
    const topSpacer = firstRow * ROW_HEIGHT;
    const bottomSpacer = Math.max(0, (visible.length - lastRow) * ROW_HEIGHT);
    this.renderedFirstRow = firstRow;
    this.renderedLastRow = lastRow;

    const mediumDate = dateFormat({ dateStyle: 'medium' });
    const descriptions = new Map<string, TaskDescription>();
    const visibleById = new Map(visible.map((task, index) => [task.id, { task, index }]));
    const renderedIds = new Set(rendered.map((task) => task.id));
    // The one row and bar in the tab order: the selected task, or the first one on screen when it is not rendered.
    const tabStopId = this.selectedId != null && renderedIds.has(this.selectedId) ? this.selectedId : rendered[0]?.id;
    const xForDate = (value: number) => ((value - min) / DAY) * dayWidth;
    const gridRows = rendered.map((task, offset) => {
      const rowIndex = firstRow + offset;
      const selected = this.selectedId === task.id ? ' selected' : '';
      const kind = taskKind(task);
      const cell = (column: ColumnDef): string => {
        switch (column.key) {
          case 'label':
            return `<div class="grid-cell task-name" role="gridcell" style="padding-left:${10 + task.depth * 18}px">
            ${task.hasChildren ? `<button class="expander" data-action="toggle" data-task-id="${escapeHtml(task.id)}" aria-label="${escapeHtml(this.collapsed.has(task.id) ? text.expand : text.collapse)} ${escapeHtml(task.label)}">${this.collapsed.has(task.id) ? '›' : '⌄'}</button>` : '<span style="inline-size:22px"></span>'}
            ${this.editingId === task.id
              ? `<input class="rename" value="${escapeHtml(this.editingValue)}" aria-label="${escapeHtml(text.rename)}" />`
              : `<span class="name-text" title="${escapeHtml(task.label)}">${escapeHtml(task.label)}</span>`}
          </div>`;
          case 'assignee':
            return `<div class="grid-cell badge" role="gridcell">${escapeHtml(task.assignee || kind)}</div>`;
          case 'dates':
            return `<div class="grid-cell badge" role="gridcell">${escapeHtml(kind === 'milestone' ? formatShortDate(task.startMs) : `${formatShortDate(task.startMs)} - ${formatShortDate(task.endMs)}`)}</div>`;
          case 'start':
            return `<div class="grid-cell badge" role="gridcell">${escapeHtml(formatShortDate(task.startMs))}</div>`;
          case 'end':
            return `<div class="grid-cell badge" role="gridcell">${escapeHtml(kind === 'milestone' ? '-' : formatShortDate(task.endMs))}</div>`;
          case 'duration':
            return `<div class="grid-cell badge" role="gridcell">${kind === 'milestone' ? '-' : Math.max(0, Math.round((task.endMs - task.startMs) / DAY))}</div>`;
          default:
            return `<div class="grid-cell badge" role="gridcell">${task.progress == null ? '-' : `${Math.round(task.progress)}%`}</div>`;
        }
      };
      return `
        <div class="grid-row${selected}" part="grid-row" data-task-id="${escapeHtml(task.id)}" role="row" tabindex="${task.id === tabStopId ? 0 : -1}" aria-rowindex="${rowIndex + 2}" aria-level="${task.depth + 1}" ${selected ? 'aria-selected="true"' : ''} ${task.hasChildren ? `aria-expanded="${!this.collapsed.has(task.id)}"` : ''}>
          ${columns.map(cell).join('')}
        </div>
      `;
    }).join('');

    const timelineRows = rendered.map((task, offset) => {
      const rowIndex = firstRow + offset;
      const kind = taskKind(task);
      const description = describeTask(task, kind, mediumDate, text);
      descriptions.set(task.id, description);
      const selected = this.selectedId === task.id ? ' selected' : '';
      const focusable = task.id === tabStopId;
      // The tone is set inline, which beats `.bar.critical`: a critical bar has to ask for the danger tone itself.
      const tone = task.critical ? tones.danger : tones[task.tone || (kind === 'summary' ? 'info' : 'default')] || tones.default;
      const left = kind === 'milestone' ? xForDate(task.startMs) - MILESTONE_SIZE / 2 : xForDate(task.startMs);
      const right = xForDate(kind === 'milestone' ? task.startMs : task.endMs);
      const width = kind === 'milestone' ? MILESTONE_SIZE : Math.max(12, right - left);
      const progress = Math.max(0, Math.min(100, Number(task.progress ?? 0)));
      const canEdit = !readonly && !task.readonly && (kind !== 'summary' || cascade);
      const showHandles = canEdit && kind === 'task';
      const splitSegments = kind === 'task' && task.segments?.length
        ? renderSegments(task, progress)
        : '';
      return `
        <div class="timeline-row${selected}" part="timeline-row" data-task-id="${escapeHtml(task.id)}">
          ${task.baselineStart && task.baselineEnd ? `<span class="baseline" style="left:${xForDate(parseDate(task.baselineStart) || task.startMs).toFixed(2)}px;width:${Math.max(4, xForDate(parseDate(task.baselineEnd) || task.endMs) - xForDate(parseDate(task.baselineStart) || task.startMs)).toFixed(2)}px"></span>` : ''}
          <button
            class="bar ${kind}${task.critical ? ' critical' : ''}${splitSegments ? ' split' : ''}${progress >= 100 ? ' complete' : ''}"
            part="bar ${kind}"
            data-task-id="${escapeHtml(task.id)}"
            data-kind="${kind}"
            ${task.progress != null ? `data-progress="${Math.round(progress)}"` : ''}
            tabindex="${focusable ? '0' : '-1'}"
            ${this.selectedId === task.id ? 'aria-current="true"' : ''}
            style="left:${left.toFixed(2)}px;width:${width.toFixed(2)}px;--tone:${tone};--progress:${progress.toFixed(2)}%"
            aria-label="${escapeHtml(description.name)}"
            ${canEdit ? 'data-draggable="true"' : ''}
          >
            ${showHandles ? '<span class="handle start" data-mode="resize-start"></span>' : ''}
            <span class="progress"></span>
            ${splitSegments}
            ${kind === 'milestone' ? '<span class="milestone-shape"></span>' : ''}
            ${showHandles ? '<span class="handle end" data-mode="resize-end"></span>' : ''}
          </button>
          ${linkable ? `<span class="connector" data-task-id="${escapeHtml(task.id)}" data-side="start" style="left:${(left - 18).toFixed(2)}px"></span><span class="connector" data-task-id="${escapeHtml(task.id)}" data-side="end" style="left:${(left + width + 6).toFixed(2)}px"></span>` : ''}
        </div>
      `;
    }).join('');

    this.descriptions = descriptions;

    if (this.selectedLinkId && !links.some((link) => link.id === this.selectedLinkId)) this.selectedLinkId = null;
    const violated =
      normalizeSchedule(this.getAttribute('schedule')) === 'off'
        ? new Set<string>()
        : violatedLinks(tasks.map(toSched).filter((task): task is SchedTask => task != null), links.map(toSchedLink));
    const linkPaths = links.map((link) => {
      const source = visibleById.get(link.source);
      const target = visibleById.get(link.target);
      if (!source || !target) return '';
      if (virtualized && !renderedIds.has(link.source) && !renderedIds.has(link.target)) return '';
      const routed = routeDependencyPath(source.task, source.index, target.task, target.index, link.type, xForDate);
      const bad = violated.has(link.id);
      const chosen = this.selectedLinkId === link.id;
      const label = `${source.task.label} dependency to ${target.task.label}${bad ? `, ${text.linkViolated}` : ''}`;
      return `<path class="link-hit${bad ? ' violated' : ''}${chosen ? ' selected' : ''}" tabindex="-1" d="${routed}" data-link-id="${escapeHtml(link.id)}" data-source-id="${escapeHtml(link.source)}" data-target-id="${escapeHtml(link.target)}" data-link-type="${escapeHtml(link.type || 'e2s')}"${bad ? ' data-violated="true"' : ''} aria-label="${escapeHtml(label)}" /><path class="${[bad ? 'violated' : '', chosen ? 'selected' : ''].filter(Boolean).join(' ')}" d="${routed}" />`;
    }).join('');
    const arrowHead = (id: string) => `<marker id="${id}" markerWidth="9" markerHeight="9" refX="8.5" refY="4.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0.5 0.75 L 8.5 4.5 L 0.5 8.25 z" /></marker>`;
    const linkDefs = linkPaths ? `<defs>${arrowHead('ui-gantt-arrow')}${arrowHead('ui-gantt-arrow-bad')}</defs>` : '';

    const weekStart = normalizeWeekStart(this.getAttribute('week-start'));
    const nonWorking = parseNonWorking(this.getAttribute('non-working-days'), this.getAttribute('holidays'));
    // A host wider than the data fills the frame: the timeline track grows (1fr) and the header cells and
    // grid lines are drawn out to its edge, so there is no blank strip after the last task.
    const fillWidth = Math.max(timelineWidth, frameWidth - gridWidth);
    const rangeEnd = min + (fillWidth / dayWidth) * DAY;
    this.layoutInfo = { min, dayWidth, gridWidth, rangeEnd };
    this.renderedLeft = this.viewportLeft;
    this.visibleIds = visible.map((task) => task.id);
    const today = startOfDay(Date.now());
    const todayX = xForDate(today);
    // Today is drawn while it falls anywhere on the timeline, including the stretch added to fill a wide host.
    const todayInRange = today >= min && today <= rangeEnd;
    const showTodayMarker = showToday && todayInRange;
    const todayMarkup = showTodayMarker ? `<div class="today" part="today" style="left:${todayX.toFixed(2)}px"></div>` : '';
    // The label lives in the header, which stays put while the rows scroll, not on the line where it covered bars.
    // The day scale already highlights today's own column, and a pill there would cover its date.
    const todayPill = showTodayMarker && unit !== 'day' ? `<span class="today-pill" part="today-pill" style="left:clamp(22px, ${todayX.toFixed(2)}px, calc(100% - 22px))">${escapeHtml(text.today)}</span>` : '';

    const focusSnapshot = this.focusRequest ?? this.captureFocus();
    this.focusRequest = null;
    // setContent leaves the tree alone when the markup is identical, and then the listeners from the last render
    // are still on it: binding them again would run every handler twice.
    const previousFrame = this.root.querySelector('.frame');
    this.setContent(`
      <style>${style}</style>
      ${layout.width !== GRID_WIDTH || layout.template !== DEFAULT_TEMPLATE ? `<style>@container ui-gantt (min-width: 641px) { .surface { --gantt-grid-w: ${layout.width}px; --gantt-cols: ${layout.template}; } }</style>` : ''}
      <section class="frame" part="frame" data-bar-variant="${barVariant}"${maxHeight ? ` style="--ui-gantt-max-height:${maxHeight}"` : ''}>
        ${showToolbar ? `
          <header class="toolbar" part="toolbar">
            <div class="title">${escapeHtml(text.title)} <span class="meta">${escapeHtml(text.tasksCount.replace('{shown}', String(visible.length)).replace('{total}', String(tasks.length)))}</span></div>
            <div class="controls">
              <input class="control" value="${escapeHtml(filterText)}" placeholder="${escapeHtml(text.filterPlaceholder)}" aria-label="${escapeHtml(text.filterLabel)}" />
              <select class="select" aria-label="${escapeHtml(text.sortLabel)}">
                ${[
                  ['none', text.sortManual],
                  ['start', text.sortStart],
                  ['end', text.sortEnd],
                  ['label', text.sortName],
                  ['progress', text.sortProgress]
                ].map(([value, label]) => `<option value="${value}" ${sort === value ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('')}
              </select>
              ${creatable ? `<button class="add-button" data-action="add"><span aria-hidden="true">+</span> ${escapeHtml(text.addTask)}</button>` : ''}
              ${showToday ? `<button class="today-button" data-action="today" title="${escapeHtml(text.scrollToToday)}" aria-label="${escapeHtml(text.scrollToToday)}"${todayInRange ? '' : ' disabled'}>${escapeHtml(text.today)}</button>` : ''}
              ${(['day', 'week', 'month', 'quarter', 'year', 'fit'] as GanttZoom[]).map((item) => `<button class="zoom-button" data-zoom="${item}" aria-pressed="${zoom === item}"${item === 'fit' ? ` title="${escapeHtml(text.zoomFitTitle)}"` : ''}>${escapeHtml(zoomLabel(item, text))}</button>`).join('')}
            </div>
          </header>
        ` : ''}
        <div class="viewport" part="viewport">
          <div class="surface" part="surface" style="--day-width:${dayWidth}px;grid-template-columns:var(--gantt-grid-w) minmax(${timelineWidth.toFixed(2)}px, 1fr);inline-size:max(100%, calc(var(--gantt-grid-w) + ${timelineWidth.toFixed(2)}px))">
            <div class="grid-semantics" role="treegrid" aria-label="${escapeHtml(this.getAttribute('aria-label') || text.title)}" aria-rowcount="${visible.length + 1}" aria-colcount="${compact ? 1 : columns.length}">
              <div class="grid-head" part="grid-head" role="row">
                ${columns.map((column) => {
                  const title = escapeHtml(column.custom ?? text[column.title]);
                  if (!column.sort) return `<span role="columnheader">${title}</span>`;
                  const active = sort === column.sort;
                  const direction = column.sort === 'progress' ? 'descending' : 'ascending';
                  return `<div role="columnheader" aria-sort="${active ? direction : 'none'}" style="display:contents"><button class="head-button" data-sort="${column.sort}">${title}</button></div>`;
                }).join('')}
              </div>
              <div class="grid-body" part="grid-body" role="rowgroup">
                ${virtualized && topSpacer ? `<div style="height:${topSpacer}px"></div>` : ''}
                ${gridRows || `<div class="empty">${escapeHtml(text.noMatches)}</div>`}
                ${virtualized && bottomSpacer ? `<div style="height:${bottomSpacer}px"></div>` : ''}
              </div>
            </div>
            <div class="splitter-rail head"><div class="splitter" role="separator" aria-orientation="vertical" aria-label="${escapeHtml(text.splitter)}" aria-valuemin="${layout.min}" aria-valuemax="${this.gridBounds.max}" aria-valuenow="${layout.width}" tabindex="0"></div></div>
            <div class="splitter-rail body"><div class="splitter" aria-hidden="true"></div></div>
            <div class="timeline-head" part="timeline-head" aria-hidden="true">
              <div class="scale" data-zoom="${unit}" style="min-width:${timelineWidth.toFixed(2)}px">${createTimeHeader(min, rangeEnd, dayWidth, unit, weekStart, this.viewportLeft, this.viewportWidth, nonWorking)}${todayPill}</div>
            </div>
            <div class="timeline-body" part="timeline-body" role="group" aria-label="${escapeHtml(text.timeline)}" data-zoom="${unit}" style="min-width:${timelineWidth.toFixed(2)}px;min-height:${rowsHeight}px">
              ${createNonWorkingShading(min, rangeEnd, dayWidth, nonWorking, this.viewportLeft, this.viewportWidth)}
              ${createUnitLines(min, rangeEnd, dayWidth, unit, weekStart, this.viewportLeft, this.viewportWidth)}
              <svg class="links" width="${timelineWidth.toFixed(0)}" height="${rowsHeight}" viewBox="0 0 ${timelineWidth.toFixed(0)} ${rowsHeight}" aria-hidden="true">${linkDefs}${linkPaths}</svg>
              ${todayMarkup}
              ${virtualized && topSpacer ? `<div style="height:${topSpacer}px"></div>` : ''}
              ${timelineRows}
              ${virtualized && bottomSpacer ? `<div style="height:${bottomSpacer}px"></div>` : ''}
              <div class="bar-tip" part="tip" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </section>
    `);

    const viewport = this.root.querySelector<HTMLElement>('.viewport');
    if (viewport) {
      // Only a new scroll area needs its position put back. Assigning it to the one that is already there would cancel a
      // smooth scroll that is under way.
      if (this.root.querySelector('.frame') !== previousFrame) {
        viewport.scrollTop = this.viewportTop;
        viewport.scrollLeft = this.viewportLeft;
        if (this.smoothTarget && typeof viewport.scrollTo === 'function') viewport.scrollTo({ ...this.smoothTarget, behavior: 'smooth' });
      }
      this.viewportWidth = viewport.clientWidth || this.viewportWidth;
      this.viewportHeight = viewport.clientHeight || this.viewportHeight;
      // `fit` sizes the days to the width left after the scrollbar; the scrollbar is only known once laid out.
      const scrollbar = Math.max(0, viewport.offsetWidth - viewport.clientWidth);
      if (scrollbar !== this.scrollbarWidth) {
        this.scrollbarWidth = scrollbar;
        if (fitting) this.requestRender();
      }
    }
    if (this.root.querySelector('.frame') !== previousFrame) this.bindEvents();
    this.restoreFocus(focusSnapshot);
    if (viewport && viewport.clientWidth > 0 && this.initialScrollPending) {
      this.initialScrollPending = false;
      // Open on today when it is not on the first screen; `initial-scroll="start"` opens at the start instead.
      if (this.getAttribute('initial-scroll') !== 'start' && !fitting && showToday && todayInRange && todayX > viewport.clientWidth - gridWidth - 48) {
        this.scrollToDate('today', { behavior: 'auto' });
      }
    }
    if (this.pendingReveal) {
      const reveal = this.pendingReveal;
      this.pendingReveal = null;
      this.reveal(reveal.id, reveal.behavior);
    }
  }

  /**
   * Every render replaces the whole shadow tree, which drops focus. Remember which control had it so
   * the replacement can take it back (and the caret, for the filter box); without this the filter
   * accepts one character per click.
   */
  private captureFocus(): FocusSnapshot | null {
    const active = this.root.activeElement as HTMLElement | null;
    if (!active) return null;
    const selector = focusSelectorFor(active);
    if (!selector) return null;
    const snapshot: FocusSnapshot = { selector };
    if (active instanceof HTMLInputElement) {
      snapshot.selection = [active.selectionStart, active.selectionEnd, active.selectionDirection];
    }
    return snapshot;
  }

  private restoreFocus(snapshot: FocusSnapshot | null): void {
    if (!snapshot) return;
    const next = this.root.querySelector<HTMLElement>(snapshot.selector);
    if (!next && snapshot.reveal && (snapshot.retries ?? 0) < 5) {
      // The row is outside the rendered window: the scroll that is on its way renders the window it is in.
      this.focusRequest = { ...snapshot, retries: (snapshot.retries ?? 0) + 1 };
      return;
    }
    if (!next || this.root.activeElement === next) return;
    next.focus({ preventScroll: !snapshot.reveal });
    if (snapshot.selectAll && next instanceof HTMLInputElement) next.select();
    if (snapshot.selection && next instanceof HTMLInputElement) {
      try {
        next.setSelectionRange(snapshot.selection[0], snapshot.selection[1], snapshot.selection[2] ?? undefined);
      } catch {
        // an input type without a selection range
      }
    }
  }

  private bindEvents(): void {
    this.root.querySelectorAll<HTMLElement>('[data-task-id]').forEach((node) => {
      node.addEventListener('click', (event) => {
        const eventTarget = event.target as HTMLElement;
        const current = event.currentTarget as HTMLElement;
        if (!current.classList.contains('bar') && eventTarget.closest('.bar')) return;
        if (this.drag?.moved) {
          event.stopPropagation();
          return;
        }
        const target = event.currentTarget as HTMLElement;
        const id = target.dataset.taskId;
        if (!id) return;
        if (eventTarget.closest('[data-action="toggle"]')) return;
        if (current.classList.contains('bar')) event.stopPropagation();
        this.selectTask(id);
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>('[data-action="toggle"]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const id = button.dataset.taskId;
        if (id) this.toggleTask(id);
      });
    });

    this.root.querySelector<HTMLButtonElement>('.today-button')?.addEventListener('click', () => {
      this.scrollToDate('today', { behavior: 'smooth', align: 'center' });
    });

    this.root.querySelectorAll<HTMLButtonElement>('.zoom-button[data-zoom]').forEach((button) => {
      button.addEventListener('click', () => {
        const zoom = button.dataset.zoom || 'week';
        this.setAttribute('zoom', zoom);
        this.dispatchEvent(new CustomEvent('zoomchange', { detail: { zoom }, bubbles: true, composed: true }));
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>('.head-button[data-sort]').forEach((button) => {
      button.addEventListener('click', () => {
        const sort = normalizeSort(button.dataset.sort || null);
        if (sort === 'none') this.removeAttribute('sort');
        else this.setAttribute('sort', sort);
        this.dispatchEvent(new CustomEvent('sortchange', { detail: { sort }, bubbles: true, composed: true }));
      });
    });

    for (const type of ['wheel', 'pointerdown', 'touchstart', 'keydown']) {
      this.root.querySelector<HTMLElement>('.viewport')?.addEventListener(type, () => {
        this.smoothTarget = null; // the user took over the scroll
      }, { passive: true });
    }
    this.root.querySelector<HTMLElement>('.viewport')?.addEventListener('scroll', (event) => {
      const viewport = event.currentTarget as HTMLElement;
      const top = viewport.scrollTop;
      const left = viewport.scrollLeft;
      const viewportRows = Math.max(20, Math.ceil(Math.max(420, this.viewportHeight - HEADER_HEIGHT) / ROW_HEIGHT));
      const rowTop = Math.max(0, Math.floor(Math.max(0, top - HEADER_HEIGHT) / ROW_HEIGHT));
      // Rows only need a new window when they are windowed at all, and the header cells when the visible part has moved a good
      // way from where they were built (compared with that place, not with the previous scroll event).
      const shouldRenderRows = this.virtualizedNow && (rowTop < this.renderedFirstRow + 64 || rowTop + viewportRows > this.renderedLastRow - 64);
      const shouldRenderX = Math.abs(left - this.renderedLeft) >= 400;
      this.viewportTop = top;
      this.viewportLeft = left;
      const target = this.smoothTarget;
      if (target && (target.left == null || Math.abs(left - target.left) < 2) && (target.top == null || Math.abs(top - target.top) < 2)) this.smoothTarget = null;
      // A render would replace the bar that is being dragged, so it waits for the drop.
      if (this.drag || this.linking || (!shouldRenderRows && !shouldRenderX)) return;
      if (this.scrollFrame != null) return;
      this.scrollFrame = window.setTimeout(() => {
        this.scrollFrame = null;
        this.requestRender();
      }, 24);
    }, { passive: true });

    this.root.querySelector<HTMLInputElement>('.control')?.addEventListener('input', (event) => {
      this.internalFilter = (event.currentTarget as HTMLInputElement).value;
      this.dispatchEvent(new CustomEvent('filterchange', { detail: { filter: this.internalFilter }, bubbles: true, composed: true }));
      this.requestRender();
    });

    this.root.querySelector<HTMLSelectElement>('.select')?.addEventListener('change', (event) => {
      const sort = normalizeSort((event.currentTarget as HTMLSelectElement).value);
      if (sort === 'none') this.removeAttribute('sort');
      else this.setAttribute('sort', sort);
      this.dispatchEvent(new CustomEvent('sortchange', { detail: { sort }, bubbles: true, composed: true }));
    });

    this.bindLinks();

    this.root.querySelectorAll<HTMLElement>('.bar').forEach((bar) => {
      bar.addEventListener('keydown', (event) => this.handleBarKeydown(bar, event as KeyboardEvent));
    });
    this.bindTooltips();
    this.bindSplitters();
    this.bindRows();
    this.bindEditing();

    if (this.hasAttribute('readonly')) return;
    this.root.querySelectorAll<HTMLElement>('.bar[data-draggable="true"]').forEach((bar) => {
      bar.addEventListener('pointerdown', (event) => this.startDrag(bar, event));
      bar.addEventListener('pointermove', (event) => {
        if (!this.drag || this.drag.bar !== bar) return;
        event.preventDefault();
        this.drag.lastClientX = event.clientX;
        this.updateDrag();
      });
      bar.addEventListener('pointerup', () => this.endDrag(true));
      // A cancelled pointer (a touch taken over by scrolling, say) is not a drop: nothing changes.
      bar.addEventListener('pointercancel', () => this.endDrag(false));
    });
  }

  private snapUnit(): 'day' | 'week' | 'month' {
    const value = this.getAttribute('snap');
    return value === 'week' || value === 'month' ? value : 'day';
  }

  /** The nearest boundary of the snap unit (a week start, a 1st of the month), or the day itself. */
  private snapDate(ms: number): number {
    const unit = this.snapUnit();
    if (unit === 'day') return ms;
    const weekStart = normalizeWeekStart(this.getAttribute('week-start'));
    const before = unitStart(ms, unit, weekStart);
    const after = nextUnit(before, unit);
    return ms - before < after - ms ? before : after;
  }

  private startDrag(bar: HTMLElement, event: PointerEvent): void {
    if (event.button !== 0) return;
    const taskId = bar.dataset.taskId;
    if (!taskId) return;
    const task = this.getTasks().find((item) => item.id === taskId);
    const originalStart = parseDate(task?.start);
    const originalEnd = parseDate(task?.end);
    if (!task || originalStart == null || originalEnd == null) return;
    event.preventDefault();
    const kind = (bar.dataset.kind as GanttTaskType) || 'task';
    const requestedMode = ((event.target as HTMLElement).dataset.mode as DragState['mode']) || 'move';
    const mode = kind === 'milestone' ? 'move' : requestedMode;
    const selectedChanged = this.selectedId !== taskId;
    this.selectedId = taskId;
    this.dispatchEvent(new CustomEvent('taskselect', { detail: { id: taskId }, bubbles: true, composed: true }));
    const onKey = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key !== 'Escape') return;
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      this.endDrag(false);
    };
    this.drag = {
      taskId,
      mode,
      startX: event.clientX,
      startScroll: this.root.querySelector<HTMLElement>('.viewport')?.scrollLeft ?? 0,
      lastClientX: event.clientX,
      originalStart,
      originalEnd,
      kind,
      rangeMin: this.rangeMin(),
      dayWidth: this.dayWidthNow,
      latestStart: originalStart,
      latestEnd: originalEnd,
      frame: null,
      scrollFrame: null,
      bar,
      originalLeft: bar.style.left,
      originalWidth: bar.style.width,
      moved: false,
      selectedChanged,
      onKey
    };
    window.addEventListener('keydown', onKey, true);
    bar.classList.add('dragging');
    bar.setPointerCapture(event.pointerId);
    this.autoScrollLoop();
  }

  /** The dates the bar would take for the pointer's position, snapped, and a repaint of the bar and the tooltip. */
  private updateDrag(): void {
    const drag = this.drag;
    if (!drag) return;
    const viewport = this.root.querySelector<HTMLElement>('.viewport');
    const dx = drag.lastClientX - drag.startX + (viewport ? viewport.scrollLeft - drag.startScroll : 0);
    if (Math.abs(dx) > 2) drag.moved = true;
    const deltaDays = Math.round(dx / drag.dayWidth);
    let start = drag.originalStart;
    let end = drag.originalEnd;
    if (drag.mode === 'move') {
      const shift = Math.round((this.snapDate(addDays(drag.originalStart, deltaDays)) - drag.originalStart) / DAY);
      start = addDays(drag.originalStart, shift);
      end = drag.kind === 'milestone' ? start : addDays(drag.originalEnd, shift);
    } else if (drag.mode === 'resize-start') {
      start = Math.min(this.snapDate(addDays(drag.originalStart, deltaDays)), addDays(end, -1));
    } else {
      end = Math.max(this.snapDate(addDays(drag.originalEnd, deltaDays)), addDays(start, 1));
    }
    drag.latestStart = start;
    drag.latestEnd = end;
    if (drag.frame != null) return;
    drag.frame = requestAnimationFrame(() => {
      const current = this.drag;
      if (!current) return;
      current.frame = null;
      const left = ((current.latestStart - current.rangeMin) / DAY) * current.dayWidth - (current.kind === 'milestone' ? MILESTONE_SIZE / 2 : 0);
      const width = current.kind === 'milestone' ? MILESTONE_SIZE : Math.max(12, ((current.latestEnd - current.latestStart) / DAY) * current.dayWidth);
      current.bar.style.left = `${left.toFixed(2)}px`;
      current.bar.style.width = `${width.toFixed(2)}px`;
      // The dates move with the bar, in the shared tooltip: a tip inside the bar would be clipped by it.
      activeLocale = this.getAttribute('locale') || undefined;
      const format = dateFormat({ dateStyle: 'medium' });
      const text = this.labelSet();
      this.showTip(
        current.bar,
        current.kind === 'milestone'
          ? format.format(new Date(current.latestStart))
          : `${format.format(new Date(current.latestStart))} ${text.to} ${format.format(new Date(current.latestEnd))}`
      );
    });
  }

  /** While a drag is held near the left or right edge of the timeline the chart scrolls, faster the nearer the edge. */
  private autoScrollLoop(): void {
    const drag = this.drag;
    if (!drag) return;
    drag.scrollFrame = requestAnimationFrame(() => {
      const current = this.drag;
      if (!current) return;
      const viewport = this.root.querySelector<HTMLElement>('.viewport');
      if (viewport && viewport.clientWidth > 0 && current.moved) {
        const box = viewport.getBoundingClientRect();
        const zone = 56;
        const left = Math.max(box.left, this.root.querySelector('.grid-body')?.getBoundingClientRect().right ?? box.left);
        let speed = 0;
        if (current.lastClientX > box.right - zone) speed = (current.lastClientX - (box.right - zone)) / zone;
        else if (current.lastClientX < left + zone && viewport.scrollLeft > 0) speed = -(left + zone - current.lastClientX) / zone;
        if (speed) {
          viewport.scrollLeft += Math.max(-1.5, Math.min(1.5, speed)) * 16;
          this.updateDrag();
        }
      }
      this.autoScrollLoop();
    });
  }

  /** Finish a drag: drop it (commit the new dates), or cancel it (the bar goes back where it was). */
  private endDrag(commit: boolean): void {
    const drag = this.drag;
    if (!drag) return;
    if (drag.frame != null) cancelAnimationFrame(drag.frame);
    if (drag.scrollFrame != null) cancelAnimationFrame(drag.scrollFrame);
    window.removeEventListener('keydown', drag.onKey, true);
    drag.bar.classList.remove('dragging');
    this.drag = null;
    this.hideTip();
    const putBack = () => {
      drag.bar.style.left = drag.originalLeft;
      drag.bar.style.width = drag.originalWidth;
    };
    if (!drag.moved) {
      if (drag.selectedChanged) this.requestRender();
      return;
    }
    if (!commit) {
      putBack();
      this.requestRender(); // the scroll renders that were held back during the drag
      return;
    }
    if (drag.latestStart === drag.originalStart && drag.latestEnd === drag.originalEnd) {
      putBack(); // dropped where it was picked up (or snapped back there)
      return;
    }
    const changed = this.applyChanges(
      this.plan({ id: drag.taskId, start: drag.latestStart, end: drag.latestEnd, previousStart: drag.originalStart, previousEnd: drag.originalEnd }),
      drag.mode === 'move' ? 'drag' : 'resize'
    );
    if (!changed) putBack();
  }

  /**
   * With `cascade`, moving a parent moves everything under it by the same number of days (a read-only task stays
   * put). Anything else is the one change.
   */
  private plan(change: TaskChange): TaskChange[] {
    const changes = this.withCascade(change);
    if (normalizeSchedule(this.getAttribute('schedule')) !== 'auto') return changes;
    const links = this.getLinks();
    if (!links.length) return changes;
    const tasks = this.getTasks().map(toSched).filter((task): task is SchedTask => task != null);
    const byId = new Map(tasks.map((task) => [task.id, task]));
    const moved = new Map(changes.map((item) => [item.id, { start: item.start, end: item.end }]));
    const planned = [...changes];
    for (const push of pushSuccessors(tasks, links.map(toSchedLink), moved, this.hasAttribute('cascade'))) {
      const at = planned.findIndex((item) => item.id === push.id);
      if (at >= 0) {
        planned[at] = { ...planned[at], start: push.start, end: push.end };
      } else {
        const before = byId.get(push.id);
        if (before) planned.push({ id: push.id, start: push.start, end: push.end, previousStart: before.start, previousEnd: before.end });
      }
    }
    return planned;
  }

  private withCascade(change: TaskChange): TaskChange[] {
    if (!this.hasAttribute('cascade')) return [change];
    const delta = daysBetween(change.previousStart, change.start);
    if (delta === 0 || change.end - change.start !== change.previousEnd - change.previousStart) return [change];
    const tasks = this.getTasks();
    const below = descendantsOf(tasks.map(toSched).filter((task): task is SchedTask => task != null), change.id);
    if (!below.length) return [change];
    const moved = below
      .filter((task) => !task.readonly)
      .map((task) => ({ id: task.id, start: shiftDays(task.start, delta), end: shiftDays(task.end, delta), previousStart: task.start, previousEnd: task.end }));
    return [change, ...moved];
  }

  /**
   * Apply a change to dates. First a cancelable `beforetaskchange` (a host that rejects the change calls
   * preventDefault and nothing moves), then the new dates are kept and `taskchange` fires for each task.
   */
  private applyChanges(changes: TaskChange[], source: ChangeSource): boolean {
    const [primary, ...others] = changes;
    const describe = (change: TaskChange) => ({
      id: change.id,
      start: formatIso(change.start),
      end: formatIso(change.end),
      previousStart: formatIso(change.previousStart),
      previousEnd: formatIso(change.previousEnd)
    });
    const accepted = this.dispatchEvent(
      new CustomEvent('beforetaskchange', {
        detail: { ...describe(primary), source, affected: others.map(describe) },
        bubbles: true,
        composed: true,
        cancelable: true
      })
    );
    if (!accepted) {
      this.requestRender();
      return false;
    }
    for (const change of changes) this.overrides.set(change.id, { ...this.overrides.get(change.id), start: formatIso(change.start), end: formatIso(change.end) });
    this.bumpOverrides();
    for (const change of changes) {
      this.dispatchEvent(new CustomEvent('taskchange', { detail: { id: change.id, start: formatIso(change.start), end: formatIso(change.end) }, bubbles: true, composed: true }));
    }
    this.requestRender();
    return true;
  }

  /**
   * Keyboard on a bar. Moving between rows (and selecting) works on every bar, summaries and read-only
   * charts included; only the keys that change dates or delete need an editable bar.
   */
  private handleBarKeydown(bar: HTMLElement, event: KeyboardEvent): void {
    const taskId = bar.dataset.taskId;
    if (!taskId) return;
    const editable = bar.dataset.draggable === 'true' && !this.hasAttribute('readonly');
    if (event.key === 'Escape') {
      this.hideTip();
      return;
    }
    if (event.key === 'F2') {
      event.preventDefault();
      this.startRename(taskId);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectTask(taskId);
      return;
    }
    if (['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
      event.preventDefault();
      this.navigate(taskId, event.key, 'bar');
      return;
    }
    if (!editable) return;
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent('taskdelete', { detail: { id: taskId }, bubbles: true, composed: true }));
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const task = this.getTasks().find((item) => item.id === taskId);
    const start = parseDate(task?.start);
    const end = parseDate(task?.end);
    if (!task || start == null || end == null) return;
    event.preventDefault();
    const direction = event.key === 'ArrowLeft' ? -1 : 1;
    const isMilestone = bar.dataset.kind === 'milestone';
    const resizes = event.shiftKey && !isMilestone && bar.dataset.kind !== 'summary';
    const nextStart = resizes ? start : addDays(start, direction);
    const nextEnd = isMilestone
      ? nextStart
      : resizes
        ? Math.max(addDays(end, direction), addDays(start, 1))
        : addDays(end, direction);
    this.applyChanges(this.plan({ id: taskId, start: nextStart, end: nextEnd, previousStart: start, previousEnd: end }), 'keyboard');
  }

  /**
   * Show the tooltip for a bar: above its visible part, centred, kept inside the scroll area; below the bar when
   * there is no room under the sticky header.
   */
  private showTip(bar: HTMLElement, dates?: string): void {
    const tip = this.root.querySelector<HTMLElement>('.bar-tip');
    const body = this.root.querySelector<HTMLElement>('.timeline-body');
    const viewport = this.root.querySelector<HTMLElement>('.viewport');
    const gridBody = this.root.querySelector<HTMLElement>('.grid-body');
    const description = this.descriptions.get(bar.dataset.taskId || '');
    if (!tip || !body || !viewport || !description) return;
    tip.innerHTML =
      `<strong>${escapeHtml(description.title)}</strong>` +
      `<span>${escapeHtml(dates ? [description.kindWord, dates].filter(Boolean).join(' · ') : description.when)}</span>` +
      (description.more ? `<span>${escapeHtml(description.more)}</span>` : '');
    tip.setAttribute('data-open', '');

    const bodyBox = body.getBoundingClientRect();
    const barBox = bar.getBoundingClientRect();
    const viewBox = viewport.getBoundingClientRect();
    const leftEdge = Math.max(viewBox.left, gridBody ? gridBody.getBoundingClientRect().right : viewBox.left) + 4;
    const rightEdge = viewBox.right - 4;
    const tipWidth = tip.offsetWidth;
    const tipHeight = tip.offsetHeight;
    const visibleCentre = (Math.max(barBox.left, leftEdge) + Math.min(barBox.right, rightEdge)) / 2;
    const left = Math.max(leftEdge, Math.min(visibleCentre - tipWidth / 2, rightEdge - tipWidth));
    const roomAbove = barBox.top - (viewBox.top + HEADER_HEIGHT) >= tipHeight + 8;
    const top = roomAbove ? barBox.top - tipHeight - 6 : barBox.bottom + 6;
    tip.style.left = `${(left - bodyBox.left).toFixed(1)}px`;
    tip.style.top = `${(top - bodyBox.top).toFixed(1)}px`;
  }

  private hideTip(): void {
    if (this.tipTimer != null) {
      window.clearTimeout(this.tipTimer);
      this.tipTimer = null;
    }
    this.root.querySelector<HTMLElement>('.bar-tip')?.removeAttribute('data-open');
  }

  /** Links: select one by clicking it (then Delete asks to remove it), and with `linkable` draw new ones from the dots beside a bar. */
  private bindLinks(): void {
    const details = (path: SVGElement) => ({
      id: path.dataset.linkId || '',
      source: path.dataset.sourceId || '',
      target: path.dataset.targetId || '',
      type: path.dataset.linkType || 'e2s'
    });
    this.root.querySelectorAll<SVGPathElement>('.link-hit').forEach((path) => {
      path.addEventListener('click', (event) => {
        event.stopPropagation();
        this.selectedLinkId = path.dataset.linkId || null;
        this.focusRequest = { selector: `.link-hit[data-link-id="${cssEscape(path.dataset.linkId || '')}"]` };
        this.dispatchEvent(new CustomEvent('linkselect', { detail: details(path), bubbles: true, composed: true }));
        this.requestRender();
      });
      path.addEventListener('keydown', (event) => {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          if (this.hasAttribute('readonly')) return;
          event.preventDefault();
          this.dispatchEvent(new CustomEvent('linkdelete', { detail: details(path), bubbles: true, composed: true }));
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.dispatchEvent(new CustomEvent('linkselect', { detail: details(path), bubbles: true, composed: true }));
        } else if (event.key === 'Escape') {
          this.selectedLinkId = null;
          this.requestRender();
        }
      });
    });
    this.root.querySelectorAll<HTMLElement>('.connector').forEach((connector) => {
      connector.addEventListener('pointerdown', (event) => this.startLink(connector, event));
      connector.addEventListener('pointermove', (event) => this.updateLink(event));
      connector.addEventListener('pointerup', () => this.endLink(true));
      connector.addEventListener('pointercancel', () => this.endLink(false));
    });
  }

  private startLink(connector: HTMLElement, event: PointerEvent): void {
    if (event.button !== 0) return;
    const sourceId = connector.dataset.taskId;
    const side = connector.dataset.side === 'start' ? 'start' : 'end';
    const body = this.root.querySelector<HTMLElement>('.timeline-body');
    const svg = this.root.querySelector<SVGSVGElement>('svg.links');
    const bar = sourceId ? this.root.querySelector<HTMLElement>(barSelector(sourceId)) : null;
    if (!sourceId || !body || !svg || !bar) return;
    event.preventDefault();
    const bodyBox = body.getBoundingClientRect();
    const barBox = bar.getBoundingClientRect();
    const draft = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    draft.setAttribute('class', 'link-draft');
    svg.appendChild(draft);
    const onKey = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key !== 'Escape') return;
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      this.endLink(false);
    };
    this.linking = {
      sourceId,
      side,
      fromX: (side === 'start' ? barBox.left : barBox.right) - bodyBox.left,
      fromY: barBox.top + barBox.height / 2 - bodyBox.top,
      draft,
      targetId: null,
      targetSide: null,
      onKey
    };
    window.addEventListener('keydown', onKey, true);
    this.root.querySelector('.frame')?.setAttribute('data-linking', '');
    connector.setPointerCapture(event.pointerId);
    this.updateLink(event);
  }

  /** The rubber-band line follows the pointer; the bar (or dot) under it, and which end of it, is the target. */
  private updateLink(event: PointerEvent): void {
    const link = this.linking;
    const body = this.root.querySelector<HTMLElement>('.timeline-body');
    if (!link || !body) return;
    const bodyBox = body.getBoundingClientRect();
    link.draft.setAttribute('d', `M ${link.fromX.toFixed(1)} ${link.fromY.toFixed(1)} L ${(event.clientX - bodyBox.left).toFixed(1)} ${(event.clientY - bodyBox.top).toFixed(1)}`);
    this.root.querySelectorAll('.bar.link-target').forEach((el) => {
      el.classList.remove('link-target');
      el.removeAttribute('data-link-side');
    });
    link.targetId = null;
    link.targetSide = null;
    const under = this.root.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    const dot = under?.closest?.('.connector') as HTMLElement | null | undefined;
    const bar = (dot ? this.root.querySelector<HTMLElement>(barSelector(dot.dataset.taskId || '')) : under?.closest?.('.bar')) as HTMLElement | null | undefined;
    const targetId = bar?.dataset.taskId;
    if (!bar || !targetId || targetId === link.sourceId) return;
    const box = bar.getBoundingClientRect();
    link.targetId = targetId;
    link.targetSide = dot ? (dot.dataset.side === 'start' ? 'start' : 'end') : event.clientX < box.left + box.width / 2 ? 'start' : 'end';
    bar.classList.add('link-target');
    bar.setAttribute('data-link-side', link.targetSide);
  }

  /** Let go: a drop on another task asks the host for a link (`linkcreate`), anywhere else nothing happens. */
  private endLink(commit: boolean): void {
    const link = this.linking;
    if (!link) return;
    window.removeEventListener('keydown', link.onKey, true);
    this.linking = null;
    link.draft.remove();
    this.root.querySelector('.frame')?.removeAttribute('data-linking');
    this.root.querySelectorAll('.bar.link-target').forEach((el) => {
      el.classList.remove('link-target');
      el.removeAttribute('data-link-side');
    });
    if (!commit || !link.targetId || !link.targetSide) return;
    const type = `${link.side === 'start' ? 's' : 'e'}2${link.targetSide === 'start' ? 's' : 'e'}`;
    if (this.getLinks().some((existing) => existing.source === link.sourceId && existing.target === link.targetId && (existing.type || 'e2s') === type)) return;
    this.dispatchEvent(new CustomEvent('linkcreate', { detail: { source: link.sourceId, target: link.targetId, type }, bubbles: true, composed: true }));
  }

  /** Rename a task in place: the name becomes a text field. Does nothing in a read-only chart or for a read-only task. */
  private startRename(id: string): void {
    if (this.hasAttribute('readonly')) return;
    const task = this.getTasks().find((item) => item.id === id);
    if (!task || task.readonly) return;
    this.editingId = id;
    this.editingValue = task.label;
    this.focusRequest = { selector: '.rename', reveal: true, retries: 0, selectAll: true };
    this.reveal(id, 'auto');
    this.requestRender();
  }

  /** Leave the rename field: keep the new name (when `save` and it is not empty or unchanged and nobody refuses it) or drop it. */
  private finishRename(save: boolean): void {
    const id = this.editingId;
    if (!id) return;
    const label = this.editingValue.trim();
    const previous = this.getTasks().find((item) => item.id === id)?.label;
    this.editingId = null;
    if (save && label && previous != null && label !== previous) {
      const accepted = this.dispatchEvent(
        new CustomEvent('taskrename', { detail: { id, label, previousLabel: previous }, bubbles: true, composed: true, cancelable: true })
      );
      if (accepted) {
        this.overrides.set(id, { ...this.overrides.get(id), label });
        this.bumpOverrides();
      }
    }
    this.focusRequest = { selector: rowSelector(id) };
    this.requestRender();
  }

  /** Create a task: the host is told where (`taskcreate`) and adds it; nothing is added here. */
  private requestCreate(startMs: number, anchorId?: string): void {
    const anchor = anchorId ? this.getTasks().find((item) => item.id === anchorId) : undefined;
    this.dispatchEvent(
      new CustomEvent('taskcreate', {
        detail: { start: formatIso(startMs), end: formatIso(addDays(startMs, NEW_TASK_DAYS)), parent: anchor?.parent, after: anchor?.id },
        bubbles: true,
        composed: true
      })
    );
  }

  private bindEditing(): void {
    this.root.querySelectorAll<HTMLElement>('.grid-row .task-name').forEach((cell) => {
      cell.addEventListener('dblclick', (event) => {
        if ((event.target as HTMLElement).closest('.expander, .rename')) return;
        const id = (cell.closest('.grid-row') as HTMLElement | null)?.dataset.taskId;
        if (id) this.startRename(id);
      });
    });
    const input = this.root.querySelector<HTMLInputElement>('.rename');
    if (input) {
      input.addEventListener('input', () => {
        this.editingValue = input.value;
      });
      input.addEventListener('keydown', (event) => {
        event.stopPropagation();
        if (event.key === 'Enter') {
          event.preventDefault();
          this.finishRename(true);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          this.finishRename(false);
        }
      });
      input.addEventListener('blur', () => {
        if (!this.suppressBlur) this.finishRename(true);
      });
    }
    this.root.querySelector<HTMLButtonElement>('.add-button')?.addEventListener('click', () => {
      const { min, rangeEnd } = this.layoutInfo;
      const today = startOfDay(Date.now());
      this.requestCreate(today >= min && today <= rangeEnd ? today : min, this.selectedId ?? undefined);
    });
    if (this.hasAttribute('creatable') && !this.hasAttribute('readonly')) {
      this.root.querySelectorAll<HTMLElement>('.timeline-row').forEach((rowElement) => {
        rowElement.addEventListener('dblclick', (event) => {
          if (event.target !== rowElement) return; // a bar, a link or a baseline has its own meaning
          const body = this.root.querySelector<HTMLElement>('.timeline-body');
          if (!body) return;
          const { min, dayWidth } = this.layoutInfo;
          const days = Math.floor((event.clientX - body.getBoundingClientRect().left) / dayWidth);
          this.requestCreate(addDays(min, days), rowElement.dataset.taskId);
        });
      });
    }
  }

  /** The task list is a treegrid: a row takes focus and the arrow keys move around it. */
  private bindRows(): void {
    this.root.querySelectorAll<HTMLElement>('.grid-row').forEach((row) => {
      row.addEventListener('keydown', (event) => {
        // keys that land on a button or a field inside the row belong to it
        if (event.target !== row) return;
        const id = row.dataset.taskId;
        if (!id) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.selectTask(id);
          return;
        }
        if (event.key === 'F2') {
          event.preventDefault();
          this.startRename(id);
          return;
        }
        if (this.navigate(id, event.key, 'row')) event.preventDefault();
      });
    });
  }

  /** Drag the splitter (or use the arrow keys on it) to resize the task list; it is kept in `grid-width`. */
  private bindSplitters(): void {
    const surface = this.root.querySelector<HTMLElement>('.surface');
    const handles = this.root.querySelectorAll<HTMLElement>('.splitter');
    const commit = (width: number) => {
      const next = Math.round(Math.max(this.gridBounds.min, Math.min(this.gridBounds.max, width)));
      if (next === this.gridBounds.width) return;
      this.setAttribute('grid-width', String(next));
      this.dispatchEvent(new CustomEvent('gridresize', { detail: { width: next }, bubbles: true, composed: true }));
    };
    handles.forEach((handle) => {
      handle.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 || !surface) return;
        event.preventDefault();
        const startX = event.clientX;
        const { min, max, width: startWidth } = this.gridBounds;
        let width = startWidth;
        handle.setPointerCapture(event.pointerId);
        handles.forEach((item) => item.classList.add('dragging'));
        const move = (moveEvent: PointerEvent) => {
          width = Math.max(min, Math.min(max, startWidth + moveEvent.clientX - startX));
          surface.style.setProperty('--gantt-grid-w', `${width}px`);
        };
        const end = (endEvent: PointerEvent) => {
          handle.removeEventListener('pointermove', move);
          handle.removeEventListener('pointerup', end);
          handle.removeEventListener('pointercancel', end);
          handles.forEach((item) => item.classList.remove('dragging'));
          if (endEvent.type === 'pointercancel') {
            surface.style.removeProperty('--gantt-grid-w');
            return;
          }
          commit(width);
        };
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', end);
        handle.addEventListener('pointercancel', end);
      });
      handle.addEventListener('keydown', (event) => {
        if (handle.getAttribute('role') !== 'separator') return;
        const step = event.shiftKey ? 64 : 16;
        const { min, max, width } = this.gridBounds;
        const next =
          event.key === 'ArrowLeft' ? width - step : event.key === 'ArrowRight' ? width + step : event.key === 'Home' ? min : event.key === 'End' ? max : null;
        if (next == null) return;
        event.preventDefault();
        commit(next);
      });
    });
  }

  private bindTooltips(): void {
    this.root.querySelectorAll<HTMLElement>('.bar').forEach((bar) => {
      bar.addEventListener('pointerenter', (event) => {
        if ((event as PointerEvent).pointerType === 'touch') return;
        this.hideTip();
        this.tipTimer = window.setTimeout(() => {
          this.tipTimer = null;
          this.showTip(bar);
        }, 150);
      });
      bar.addEventListener('pointerleave', () => this.hideTip());
      bar.addEventListener('pointerdown', () => {
        // A press focuses the bar a moment later; that focus is not the keyboard's and gets no tooltip.
        this.pointerFocus = true;
        window.setTimeout(() => {
          this.pointerFocus = false;
        }, 0);
        this.hideTip();
      });
      bar.addEventListener('blur', () => this.hideTip());
      bar.addEventListener('focus', () => {
        if (!this.pointerFocus) this.showTip(bar);
      });
    });
  }

  /** The tasks as an array. Setting it writes the `tasks` attribute (dates may be `Date`s: they become `YYYY-MM-DD`). */
  get tasks(): Array<Record<string, unknown>> {
    return readJsonArray(this.getAttribute('tasks'));
  }

  set tasks(value: Array<Record<string, unknown>> | null | undefined) {
    writeJsonArray(this, 'tasks', value, true);
  }

  /** The holidays as an array of `YYYY-MM-DD` strings or `{ date, label }` objects. Setting it writes the attribute (a `Date` becomes its local day). */
  get holidays(): Array<unknown> {
    return readJsonArray(this.getAttribute('holidays'));
  }

  set holidays(value: Array<unknown> | null | undefined) {
    if (!Array.isArray(value)) {
      this.removeAttribute('holidays');
      return;
    }
    try {
      this.setAttribute(
        'holidays',
        JSON.stringify(value.map((item) => (item && typeof item === 'object' && !(item instanceof Date) ? { ...(item as Record<string, unknown>), date: toAttrDate((item as { date?: unknown }).date) } : toAttrDate(item))))
      );
    } catch {
      // not serialisable: leave the attribute as it is
    }
  }

  /** The links as an array. Setting it writes the `links` attribute. */
  get links(): Array<Record<string, unknown>> {
    return readJsonArray(this.getAttribute('links'));
  }

  set links(value: Array<Record<string, unknown>> | null | undefined) {
    writeJsonArray(this, 'links', value, false);
  }

  private resolveBehavior(behavior?: ScrollBehavior): ScrollBehavior {
    if (behavior === 'smooth' && typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return 'auto';
    return behavior ?? 'auto';
  }

  private scrollViewport(position: { left?: number; top?: number }, behavior?: ScrollBehavior): void {
    const viewport = this.root.querySelector<HTMLElement>('.viewport');
    if (!viewport) return;
    const resolved = this.resolveBehavior(behavior);
    this.smoothTarget = resolved === 'smooth' ? position : null;
    if (this.smoothTarget) {
      const started = this.smoothTarget;
      window.setTimeout(() => {
        if (this.smoothTarget === started) this.smoothTarget = null; // it stopped short (the user took over): do not resume it later
      }, 2000);
    }
    if (resolved !== 'smooth') {
      // A render can follow at once (focusing a row does) and it puts the scroll back from these, before any
      // scroll event has told it where the chart went.
      if (position.left != null) this.viewportLeft = position.left;
      if (position.top != null) this.viewportTop = position.top;
    }
    if (typeof viewport.scrollTo === 'function') {
      viewport.scrollTo({ ...position, behavior: resolved });
      return;
    }
    if (position.left != null) viewport.scrollLeft = position.left;
    if (position.top != null) viewport.scrollTop = position.top;
  }

  /**
   * Scroll the timeline to a date: a `YYYY-MM-DD` string, a `Date`, a timestamp, or `"today"`. `align` is `center`
   * (the default) or `start`, which leaves a little room before the date. Does nothing for a date that is not valid.
   */
  scrollToDate(date: string | number | Date, options: { behavior?: ScrollBehavior; align?: 'center' | 'start' } = {}): void {
    const ms = date === 'today' ? startOfDay(Date.now()) : typeof date === 'number' ? (Number.isFinite(date) ? startOfDay(date) : null) : parseDate(date);
    const viewport = this.root.querySelector<HTMLElement>('.viewport');
    if (ms == null || !viewport) return;
    this.scrollViewport({ left: this.leftFor(viewport, ms, options.align ?? 'center') }, options.behavior);
  }

  private leftFor(viewport: HTMLElement, ms: number, align: 'center' | 'start'): number {
    const { min, dayWidth, gridWidth } = this.layoutInfo;
    const x = ((ms - min) / DAY) * dayWidth;
    const target = align === 'start' ? x - 24 : x - Math.max(0, viewport.clientWidth - gridWidth) / 2;
    return Math.max(0, Math.min(target, Math.max(0, viewport.scrollWidth - viewport.clientWidth)));
  }

  /**
   * Bring a task into view: open the branches above it, then scroll its row (and its bar) on screen when they are
   * not. Returns false for an id that is not there or is filtered out.
   */
  scrollToTask(id: string, options: { behavior?: ScrollBehavior } = {}): boolean {
    const tasks = this.getTasks();
    const byId = new Map(tasks.map((task) => [task.id, task]));
    const task = byId.get(id);
    if (!task) return false;
    let opened = false;
    let parent = task.parent;
    for (let steps = 0; parent && steps < 1000; steps += 1) {
      if (this.collapsed.has(parent)) {
        this.collapsed.delete(parent);
        this.dispatchEvent(new CustomEvent('tasktoggle', { detail: { id: parent, open: true }, bubbles: true, composed: true }));
        opened = true;
      }
      parent = byId.get(parent)?.parent;
    }
    const filter = this.getAttribute('filter') ?? this.internalFilter;
    const shown = this.getVisibleTasks(tasks, filter, normalizeSort(this.getAttribute('sort'))).some((item) => item.id === id);
    if (!shown) return false;
    // A task that was just added (or a branch that was just opened) is not in the rendered rows yet: reveal it once it is.
    if (opened || !this.visibleIds.includes(id)) {
      this.pendingReveal = { id, behavior: options.behavior ?? 'auto' };
      this.requestRender();
      return true;
    }
    return this.reveal(id, options.behavior ?? 'auto');
  }

  private reveal(id: string, behavior: ScrollBehavior): boolean {
    const index = this.visibleIds.indexOf(id);
    const viewport = this.root.querySelector<HTMLElement>('.viewport');
    const task = this.getTasks().find((item) => item.id === id);
    if (index < 0 || !viewport || !task) return false;
    const position: { left?: number; top?: number } = {};
    const rowY = HEADER_HEIGHT + index * ROW_HEIGHT;
    const rowsVisible = rowY >= viewport.scrollTop + HEADER_HEIGHT && rowY + ROW_HEIGHT <= viewport.scrollTop + viewport.clientHeight;
    if (!rowsVisible) {
      const top = index * ROW_HEIGHT + ROW_HEIGHT / 2 - (viewport.clientHeight - HEADER_HEIGHT) / 2;
      position.top = Math.max(0, Math.min(top, Math.max(0, viewport.scrollHeight - viewport.clientHeight)));
    }
    const start = parseDate(task.start);
    const end = parseDate(task.end);
    if (start != null) {
      const { min, dayWidth, gridWidth } = this.layoutInfo;
      const from = ((start - min) / DAY) * dayWidth;
      const to = ((end ?? start) - min) / DAY * dayWidth;
      const left = viewport.scrollLeft;
      if (from < left || to > left + viewport.clientWidth - gridWidth) position.left = this.leftFor(viewport, start, 'start');
    }
    if (position.left != null || position.top != null) this.scrollViewport(position, behavior);
    return true;
  }

  /** Open or close a branch (`open` omitted toggles it) and fire `tasktoggle`. */
  toggleTask(id: string, open?: boolean): void {
    const isOpen = !this.collapsed.has(id);
    const next = open ?? !isOpen;
    if (next === isOpen) return;
    if (next) this.collapsed.delete(id);
    else this.collapsed.add(id);
    this.dispatchEvent(new CustomEvent('tasktoggle', { detail: { id, open: next }, bubbles: true, composed: true }));
    this.requestRender();
  }

  expandAll(): void {
    for (const id of [...this.collapsed]) this.toggleTask(id, true);
  }

  collapseAll(): void {
    const parents = new Set(this.getTasks().map((task) => task.parent).filter((id): id is string => !!id));
    for (const id of parents) this.toggleTask(id, false);
  }

  /**
   * The whole chart as a standalone SVG string (not just the part on screen): the time header, the task names, the bars with
   * their progress, baselines, parts, milestones and links, the today line and any non-working days. Rows follow the current
   * filter, sort and collapsed branches; the scale is the one on screen. Colours are the theme's resolved at this moment.
   * Returns an empty string when there is nothing to draw.
   */
  exportSvg(): string {
    activeLocale = this.getAttribute('locale') || undefined;
    const text = this.labelSet();
    const tasks = this.getTasks();
    const { min, dayWidth } = this.layoutInfo;
    if (!tasks.length || min === 0) return '';
    const visible = this.getVisibleTasks(tasks, this.getAttribute('filter') ?? this.internalFilter, normalizeSort(this.getAttribute('sort')));
    if (!visible.length) return '';
    const style = getComputedStyle(this);
    const colour = (token: string): string => {
      const match = /^var\((--[\w-]+),\s*([^)]+)\)$/.exec(token);
      return match ? style.getPropertyValue(match[1]).trim() || match[2].trim() : token;
    };
    const ink = colour('var(--ui-color-text, #0f172a)');
    const muted = colour('var(--ui-color-muted, #526175)');
    const line = colour('var(--ui-color-border, #cbd5e1)');
    const panel = colour('var(--ui-color-surface, #ffffff)');
    const accent = colour('var(--ui-color-primary, #2563eb)');
    const danger = colour('var(--ui-color-danger, #dc2626)');
    const unit = (this.root.querySelector('.scale')?.getAttribute('data-zoom') as GanttUnit | null) || 'week';
    const weekStart = normalizeWeekStart(this.getAttribute('week-start'));
    const off = parseNonWorking(this.getAttribute('non-working-days'), this.getAttribute('holidays'));
    const maxEnd = addDays(Math.max(...tasks.map((task) => parseDate(task.end) ?? 0)), 3);
    const timelineWidth = Math.max(320, ((maxEnd - min) / DAY) * dayWidth);
    const rangeEnd = min + (timelineWidth / dayWidth) * DAY;
    const nameWidth = 260;
    const width = nameWidth + timelineWidth;
    const height = HEADER_HEIGHT + visible.length * ROW_HEIGHT;
    const x = (ms: number) => ((ms - min) / DAY) * dayWidth;
    const medium = dateFormat({ dateStyle: 'medium' });
    const monthYear = dateFormat({ month: 'long', year: 'numeric' });
    const monthOnly = dateFormat({ month: 'short' });
    const label = (ms: number, u: GanttUnit): string => {
      const date = new Date(ms);
      return u === 'day' || u === 'week' ? String(date.getDate()) : u === 'month' ? monthOnly.format(date) : u === 'quarter' ? `Q${Math.floor(date.getMonth() / 3) + 1}` : String(date.getFullYear());
    };
    const parts: string[] = [];
    const rect = (px: number, py: number, w: number, h: number, extra: string) => `<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${Math.max(0, w).toFixed(1)}" height="${h}" ${extra}/>`;

    parts.push(rect(0, 0, width, height, `fill="${panel}"`));
    // header: the bands, then the labels
    const topUnit: GanttUnit | null = unit === 'year' ? null : unit === 'day' || unit === 'week' ? 'month' : 'year';
    if (topUnit) {
      for (const cell of headerCells(topUnit, weekStart, min, rangeEnd, dayWidth, 0, Number.POSITIVE_INFINITY)) {
        const full = topUnit === 'month' ? monthYear.format(new Date(cell.start)) : String(new Date(cell.start).getFullYear());
        parts.push(`<line x1="${(nameWidth + cell.left).toFixed(1)}" y1="0" x2="${(nameWidth + cell.left).toFixed(1)}" y2="26" stroke="${line}"/>`);
        if (cell.width >= MIN_LABEL_WIDTH) parts.push(`<text x="${(nameWidth + cell.left + 8).toFixed(1)}" y="17" font-size="11" font-weight="700" fill="${ink}">${escapeHtml(full)}</text>`);
      }
    }
    const bottomY = topUnit ? 26 : 0;
    for (const cell of headerCells(unit, weekStart, min, rangeEnd, dayWidth, 0, Number.POSITIVE_INFINITY)) {
      parts.push(`<line x1="${(nameWidth + cell.left).toFixed(1)}" y1="${bottomY}" x2="${(nameWidth + cell.left).toFixed(1)}" y2="${height}" stroke="${line}" stroke-opacity=".45"/>`);
      if (cell.width >= MIN_LABEL_WIDTH || unit === 'day') parts.push(`<text x="${(nameWidth + cell.left + 8).toFixed(1)}" y="${bottomY + 18}" font-size="11" font-weight="650" fill="${muted}">${escapeHtml(label(cell.start, unit))}</text>`);
    }
    parts.push(`<line x1="0" y1="${HEADER_HEIGHT}" x2="${width}" y2="${HEADER_HEIGHT}" stroke="${line}"/>`);
    parts.push(`<text x="10" y="${HEADER_HEIGHT / 2 + 4}" font-size="11" font-weight="700" fill="${muted}">${escapeHtml(text.columnTask.toUpperCase())}</text>`);
    // non-working days, then the rows
    if (dayWidth >= MIN_SHADE_DAY_WIDTH && (off.weekdays.size || off.holidays.size)) {
      for (let day = min; day < rangeEnd; day = addDays(day, 1)) {
        if (!isNonWorking(day, off)) continue;
        parts.push(rect(nameWidth + x(day), HEADER_HEIGHT, dayWidth, visible.length * ROW_HEIGHT, `fill="${off.holidays.has(day) ? '#d97706' : muted}" fill-opacity="${off.holidays.has(day) ? '.15' : '.1'}"`));
      }
    }
    visible.forEach((task, index) => {
      const top = HEADER_HEIGHT + index * ROW_HEIGHT;
      parts.push(`<line x1="0" y1="${top + ROW_HEIGHT}" x2="${width}" y2="${top + ROW_HEIGHT}" stroke="${line}" stroke-opacity=".5"/>`);
      parts.push(`<text x="${10 + task.depth * 18}" y="${top + ROW_HEIGHT / 2 + 4}" font-size="12" font-weight="650" fill="${ink}">${escapeHtml(task.label.length > 34 - task.depth * 2 ? `${task.label.slice(0, 33 - task.depth * 2)}…` : task.label)}</text>`);
    });
    parts.push(`<line x1="${nameWidth}" y1="0" x2="${nameWidth}" y2="${height}" stroke="${line}"/>`);

    const body: string[] = [];
    const byId = new Map(visible.map((task, index) => [task.id, { task, index }]));
    for (const link of this.getLinks()) {
      const source = byId.get(link.source);
      const target = byId.get(link.target);
      if (!source || !target) continue;
      body.push(`<path d="${routeDependencyPath(source.task, source.index, target.task, target.index, link.type, x)}" fill="none" stroke="${muted}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrow)"/>`);
    }
    visible.forEach((task, index) => {
      const top = index * ROW_HEIGHT;
      const kind = taskKind(task);
      const tone = task.critical ? danger : colour(tones[task.tone || (kind === 'summary' ? 'info' : 'default')] || tones.default);
      const left = x(task.startMs);
      const length = Math.max(12, x(task.endMs) - left);
      if (task.baselineStart && task.baselineEnd) {
        const from = parseDate(task.baselineStart) ?? task.startMs;
        const to = parseDate(task.baselineEnd) ?? task.endMs;
        body.push(rect(x(from), top + 33, Math.max(4, x(to) - x(from)), 4, `rx="2" fill="${muted}" fill-opacity=".5"`));
      }
      if (kind === 'milestone') {
        const cx = left;
        const cy = top + 21;
        body.push(`<polygon points="${cx},${cy - 10} ${cx + 10},${cy} ${cx},${cy + 10} ${cx - 10},${cy}" fill="${tone}"/>`);
        return;
      }
      const barTop = kind === 'summary' ? top + 17 : top + 12;
      const barHeight = kind === 'summary' ? 9 : 18;
      const progress = Math.max(0, Math.min(100, Number(task.progress ?? 0)));
      const drawPart = (px: number, w: number, done: number) => {
        body.push(rect(px, barTop, w, barHeight, `rx="4" fill="${tone}"`));
        if (kind === 'summary') body.push(rect(px, barTop, w, barHeight, `rx="3" fill="#000" fill-opacity=".2"`));
        if (done > 0) body.push(rect(px, barTop, (w * done) / 100, barHeight, `rx="4" fill="#000" fill-opacity=".28"`));
      };
      if (kind === 'task' && task.segments?.length) {
        for (const segment of task.segments) {
          const from = parseDate(segment.start);
          const to = parseDate(segment.end);
          if (from == null || to == null || to <= from) continue;
          drawPart(x(Math.max(task.startMs, from)), x(Math.min(task.endMs, to)) - x(Math.max(task.startMs, from)), segment.progress ?? progress);
        }
      } else {
        drawPart(left, length, progress);
      }
    });
    const today = startOfDay(Date.now());
    if (this.getAttribute('show-today') !== 'false' && today >= min && today <= rangeEnd) {
      body.push(`<line x1="${x(today).toFixed(1)}" y1="0" x2="${x(today).toFixed(1)}" y2="${visible.length * ROW_HEIGHT}" stroke="${danger}" stroke-width="2"/>`);
      parts.push(`<text x="${(nameWidth + x(today)).toFixed(1)}" y="${HEADER_HEIGHT - 6}" font-size="10" font-weight="700" text-anchor="middle" fill="${danger}">${escapeHtml(text.today)}</text>`);
    }
    parts.push(`<g transform="translate(${nameWidth} ${HEADER_HEIGHT})">${body.join('')}</g>`);
    parts.push(`<title>${escapeHtml(this.getAttribute('aria-label') || text.title)} (${escapeHtml(medium.format(new Date(min)))} – ${escapeHtml(medium.format(new Date(maxEnd)))})</title>`);
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(width)}" height="${height}" viewBox="0 0 ${Math.round(width)} ${height}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif">` +
      `<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="8.5" refY="4.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0.5 0.75 L 8.5 4.5 L 0.5 8.25 z" fill="${muted}"/></marker></defs>` +
      parts.join('') +
      `</svg>`
    );
  }

  private rangeMin(): number {
    const tasks = this.getTasks();
    const starts = tasks.map((task) => parseDate(task.start)).filter((value): value is number => value != null);
    return starts.length ? addDays(Math.min(...starts), -2) : startOfDay(Date.now());
  }

  private selectTask(id: string): void {
    this.captureViewport();
    this.selectedLinkId = null;
    if (this.selectedId === id) {
      this.dispatchEvent(new CustomEvent('taskselect', { detail: { id }, bubbles: true, composed: true }));
      return;
    }
    this.selectedId = id;
    this.dispatchEvent(new CustomEvent('taskselect', { detail: { id }, bubbles: true, composed: true }));
    this.requestRender();
  }

  /** Select a task and give focus to its row or its bar, scrolling it into view first. */
  private focusTask(id: string, zone: 'row' | 'bar'): void {
    if (this.selectedId !== id) {
      this.selectedId = id;
      this.dispatchEvent(new CustomEvent('taskselect', { detail: { id }, bubbles: true, composed: true }));
    }
    this.focusRequest = { selector: zone === 'row' ? rowSelector(id) : barSelector(id), reveal: true, retries: 0 };
    this.reveal(id, 'auto');
    this.requestRender();
  }

  /**
   * Keyboard movement between rows, the same from a row and from a bar: Up and Down, Home and End, PageUp and PageDown. From a row,
   * Right and Left also open, close and climb the tree. Returns whether the key was one of these.
   */
  private navigate(fromId: string, key: string, zone: 'row' | 'bar'): boolean {
    const ids = this.visibleIds;
    const index = ids.indexOf(fromId);
    if (index < 0) return false;
    let target: string | undefined;
    switch (key) {
      case 'ArrowUp':
        target = ids[index - 1];
        break;
      case 'ArrowDown':
        target = ids[index + 1];
        break;
      case 'Home':
        target = ids[0];
        break;
      case 'End':
        target = ids[ids.length - 1];
        break;
      case 'PageUp':
        target = ids[Math.max(0, index - 10)];
        break;
      case 'PageDown':
        target = ids[Math.min(ids.length - 1, index + 10)];
        break;
      case 'ArrowRight':
      case 'ArrowLeft': {
        if (zone !== 'row') return false;
        const tasks = this.getTasks();
        const parents = new Set(tasks.map((task) => task.parent).filter((id): id is string => !!id));
        const isParent = parents.has(fromId);
        if (key === 'ArrowRight') {
          if (!isParent) return true;
          if (this.collapsed.has(fromId)) this.toggleTask(fromId, true);
          else target = ids[index + 1];
        } else if (isParent && !this.collapsed.has(fromId)) {
          this.toggleTask(fromId, false);
        } else {
          const parent = tasks.find((task) => task.id === fromId)?.parent;
          if (parent && ids.includes(parent)) target = parent;
        }
        break;
      }
      default:
        return false;
    }
    if (target && target !== fromId) this.focusTask(target, zone);
    return true;
  }

  private captureViewport(): void {
    const viewport = this.root.querySelector<HTMLElement>('.viewport');
    if (!viewport) return;
    this.viewportTop = viewport.scrollTop;
    this.viewportLeft = viewport.scrollLeft;
    this.viewportWidth = viewport.clientWidth || this.viewportWidth;
    this.viewportHeight = viewport.clientHeight || this.viewportHeight;
  }

  private getTasks(): GanttTask[] {
    const raw = this.getAttribute('tasks');
    const auto = this.hasAttribute('auto-summary');
    // with critical-path the links are an input too, so their text is part of what the cache stands for
    const critical = this.hasAttribute('critical-path') ? this.getAttribute('links') ?? '' : null;
    if (raw === this.taskCacheRaw && this.taskCacheVersion === this.overridesVersion && auto === this.taskCacheAuto && critical === this.taskCacheCritical) return this.taskCache;
    this.taskCacheRaw = raw;
    this.taskCacheVersion = this.overridesVersion;
    this.taskCacheAuto = auto;
    this.taskCacheCritical = critical;
    this.taskCache = parseTasks(raw, this.overrides, auto);
    if (auto) this.taskCache = applyRollUp(this.taskCache);
    if (critical !== null) this.taskCache = applyCriticalPath(this.taskCache, parseLinks(critical));
    this.seedCollapsed(this.taskCache);
    this.visibleCacheKey = '';
    return this.taskCache;
  }

  private seedCollapsed(tasks: GanttTask[]): void {
    for (const task of tasks) {
      if (this.seededIds.has(task.id)) continue;
      this.seededIds.add(task.id);
      if (task.open === false) this.collapsed.add(task.id);
    }
  }

  private getLinks(): GanttLink[] {
    const raw = this.getAttribute('links');
    if (raw === this.linkCacheRaw) return this.linkCache;
    this.linkCacheRaw = raw;
    this.linkCache = parseLinks(raw);
    return this.linkCache;
  }

  private getVisibleTasks(tasks: GanttTask[], filterText: string, sort: GanttSort): VisibleTask[] {
    const collapsedKey = Array.from(this.collapsed).sort().join(',');
    const key = `${this.taskCacheRaw || ''}|${this.overridesVersion}|${filterText}|${sort}|${collapsedKey}`;
    if (key === this.visibleCacheKey) return this.visibleCache;
    this.visibleCacheKey = key;
    this.visibleCache = flattenTasks(tasks, this.collapsed, filterText, sort);
    return this.visibleCache;
  }

  private bumpOverrides(): void {
    this.overridesVersion += 1;
    this.taskCacheVersion = -1;
    this.visibleCacheKey = '';
  }

  protected override shouldRenderOnAttributeChange(name: string, oldValue: string | null, newValue: string | null): boolean {
    if (name === 'tasks') {
      this.overrides.clear();
      this.bumpOverrides();
      const nextIds = taskIds(newValue);
      // A host that keeps `tasks` in state writes the attribute after every edit. That is the same chart
      // with new dates, so it must not jump back to the top-left; only a different set of tasks resets it.
      if (!sharesAnId(taskIds(oldValue), nextIds)) {
        this.viewportTop = 0;
        this.viewportLeft = 0;
        this.initialScrollPending = true;
        this.collapsed.clear();
        this.seededIds.clear();
      }
      // A selection on a task that is gone would leave no bar in the tab order.
      if (this.selectedId != null && !nextIds.has(this.selectedId)) this.selectedId = null;
    }
    if (name === 'links') this.linkCacheRaw = null;
    if (name === 'auto-summary' || name === 'cascade') this.bumpOverrides();
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-gantt')) {
  customElements.define('ui-gantt', UIGantt);
}
