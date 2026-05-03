import { ElementBase } from '../ElementBase';

type GanttTone = 'default' | 'success' | 'warning' | 'danger' | 'info';
type GanttTaskType = 'task' | 'summary' | 'milestone';
type GanttZoom = 'day' | 'week' | 'month' | 'quarter' | 'year';
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
  segments?: Array<{ start: string; end: string; progress?: number }>;
};

type GanttLink = {
  id: string;
  source: string;
  target: string;
  type?: LinkType;
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
  originalStart: number;
  originalEnd: number;
  kind: GanttTaskType;
  rangeMin: number;
  dayWidth: number;
  latestStart: number;
  latestEnd: number;
  frame: number | null;
  bar: HTMLElement;
  moved: boolean;
  selectedChanged: boolean;
};

const DAY = 24 * 60 * 60 * 1000;
const ROW_HEIGHT = 42;
const HEADER_HEIGHT = 62;
const GRID_WIDTH = 376;
const MILESTONE_SIZE = 28;
const MILESTONE_SHAPE_SIZE = 15;
const MILESTONE_DIAMOND_HALF = (MILESTONE_SHAPE_SIZE * Math.SQRT2) / 2;

const zoomPixels: Record<GanttZoom, number> = {
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
    --ui-gantt-muted: var(--ui-color-muted, #64748b);
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
    border: 1px solid var(--ui-gantt-border);
    border-radius: 12px;
    background: var(--ui-gantt-bg);
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
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
  .zoom-button {
    border: 1px solid var(--ui-gantt-border);
    background: var(--ui-gantt-panel);
    color: var(--ui-gantt-text);
    border-radius: 7px;
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

  .zoom-button {
    padding: 0 9px;
    cursor: pointer;
  }

  .zoom-button[aria-pressed="true"] {
    border-color: color-mix(in srgb, var(--ui-gantt-accent) 46%, var(--ui-gantt-border));
    background: color-mix(in srgb, var(--ui-gantt-accent) 10%, var(--ui-gantt-panel));
    color: var(--ui-gantt-accent);
  }

  .viewport {
    overflow: auto;
    max-block-size: var(--ui-gantt-max-height, 620px);
  }

  .surface {
    display: grid;
    grid-template-columns: ${GRID_WIDTH}px minmax(640px, 1fr);
    min-inline-size: 100%;
  }

  .grid-head,
  .timeline-head {
    position: sticky;
    top: 0;
    z-index: 4;
    min-block-size: 62px;
    background: color-mix(in srgb, var(--ui-gantt-panel) 96%, transparent);
    border-bottom: 1px solid var(--ui-gantt-border);
  }

  .grid-head {
    left: 0;
    z-index: 5;
    display: grid;
    grid-template-columns: minmax(170px, 1fr) 82px 80px 44px;
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

  .tick {
    position: absolute;
    inset-block: 0;
    border-left: 1px solid var(--ui-gantt-grid);
    padding: 9px 8px;
    color: var(--ui-gantt-muted);
    font-size: 11px;
    font-weight: 650;
    white-space: nowrap;
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
    background:
      linear-gradient(to right, var(--ui-gantt-grid) 1px, transparent 1px) 0 0 / var(--day-width) 100%,
      color-mix(in srgb, var(--ui-gantt-panel) 98%, transparent);
  }

  .grid-row,
  .timeline-row {
    block-size: ${ROW_HEIGHT}px;
    border-bottom: 1px solid color-mix(in srgb, var(--ui-gantt-border) 56%, transparent);
  }

  .grid-row {
    display: grid;
    grid-template-columns: minmax(170px, 1fr) 82px 80px 44px;
    color: var(--ui-gantt-text);
    font-size: 12px;
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

  .bar.split .progress {
    display: none;
  }

  .split-segment {
    position: absolute;
    inset-block: 0;
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

  .progress {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    background: linear-gradient(90deg, color-mix(in srgb, #000 22%, transparent), transparent);
    opacity: 0.3;
    inline-size: var(--progress, 0%);
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

  .drag-tip {
    position: absolute;
    z-index: 6;
    inset-block-start: -28px;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    padding: 4px 7px;
    border-radius: 6px;
    background: #0f172a;
    color: #f8fafc;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
  }

  .bar.dragging .drag-tip {
    opacity: 1;
  }

  :host([bar-variant="soft"]) .bar.task {
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

  :host([bar-variant="striped"]) .bar.task {
    background:
      repeating-linear-gradient(135deg, color-mix(in srgb, #ffffff 24%, transparent) 0 7px, transparent 7px 14px),
      var(--tone, var(--ui-gantt-accent));
  }

  :host([bar-variant="striped"]) .milestone-shape {
    background:
      repeating-linear-gradient(135deg, color-mix(in srgb, #ffffff 28%, transparent) 0 5px, transparent 5px 10px),
      var(--tone, var(--ui-gantt-accent));
  }

  :host([bar-variant="outline"]) .bar.task {
    background: color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 8%, var(--ui-gantt-panel));
    box-shadow:
      inset 0 0 0 1.5px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 72%, transparent),
      0 6px 15px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 10%, transparent);
  }

  :host([bar-variant="outline"]) .bar.task .progress {
    background: color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 28%, transparent);
    opacity: 1;
  }

  :host([bar-variant="outline"]) .milestone-shape {
    background: color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 10%, var(--ui-gantt-panel));
    box-shadow:
      inset 0 0 0 2px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 72%, transparent),
      0 7px 16px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 10%, transparent);
  }

  :host([bar-variant="glass"]) .bar.task {
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

  .today {
    position: absolute;
    inset-block: 0;
    inline-size: 2px;
    background: var(--ui-color-danger, #dc2626);
    z-index: 2;
    pointer-events: none;
  }

  .today::before {
    content: "Today";
    position: absolute;
    inset-block-start: 4px;
    inset-inline-start: 6px;
    color: var(--ui-color-danger, #dc2626);
    font-size: 11px;
    font-weight: 750;
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

  @media (max-width: 760px) {
    .surface {
      grid-template-columns: 270px minmax(560px, 1fr);
    }

    .grid-head,
    .grid-row {
      grid-template-columns: minmax(150px, 1fr) 64px 56px;
    }

    .grid-head span:nth-child(3),
    .grid-cell:nth-child(3) {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .bar,
    .progress {
      transition: none !important;
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
    .zoom-button {
      forced-color-adjust: none;
      box-shadow: none;
    }
  }
`;

const tones: Record<string, string> = {
  default: 'var(--ui-color-primary, #2563eb)',
  info: 'var(--ui-color-info, #0891b2)',
  success: 'var(--ui-color-success, #16a34a)',
  warning: 'var(--ui-color-warning, #d97706)',
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
  const isoDay = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
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
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value));
}

function normalizeZoom(value: string | null): GanttZoom {
  return value === 'day' || value === 'month' || value === 'quarter' || value === 'year' ? value : 'week';
}

function normalizeSort(value: string | null): GanttSort {
  return value === 'start' || value === 'end' || value === 'label' || value === 'progress' ? value : 'none';
}

function normalizeBarVariant(value: string | null): GanttBarVariant {
  return value === 'soft' || value === 'striped' || value === 'outline' || value === 'glass' ? value : 'solid';
}

function parseTasks(raw: string | null, overrides: Map<string, Partial<GanttTask>>): GanttTask[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry, index) => {
        if (!entry || typeof entry !== 'object') return null;
        const item = entry as Record<string, unknown>;
        const label = String(item.label || item.text || '').trim();
        const startMs = parseDate(item.start);
        const duration = Number(item.duration);
        let endMs = parseDate(item.end);
        if (endMs == null && startMs != null && Number.isFinite(duration)) endMs = addDays(startMs, Math.max(0, duration));
        if (!label || startMs == null) return null;
        const type = item.type === 'summary' || item.type === 'milestone' ? item.type : 'task';
        const safeEnd = type === 'milestone' ? startMs : Math.max(endMs ?? addDays(startMs, 1), addDays(startMs, 1));
        const id = String(item.id || `task-${index + 1}`);
        const override = overrides.get(id) || {};
        return {
          id,
          label,
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
        return { id: String(item.id || `link-${index + 1}`), source, target, type };
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

function createTicks(min: number, max: number, dayWidth: number, zoom: GanttZoom, viewportLeft = 0, viewportWidth = Number.POSITIVE_INFINITY): string {
  const days = Math.max(1, Math.ceil((max - min) / DAY));
  const step = zoom === 'day' ? 1 : zoom === 'week' ? 7 : zoom === 'month' ? 30 : zoom === 'quarter' ? 91 : 365;
  const firstDay = Math.max(0, Math.floor(Math.max(0, viewportLeft - 480) / dayWidth / step) * step);
  const lastDay = Math.min(days, Math.ceil((viewportLeft + viewportWidth + 960) / dayWidth / step) * step);
  const parts: string[] = [];
  for (let day = firstDay; day <= lastDay; day += step) {
    const x = day * dayWidth;
    const date = addDays(min, day);
    const label = zoom === 'day'
      ? formatShortDate(date)
      : new Intl.DateTimeFormat(undefined, { month: 'short', year: zoom === 'week' || zoom === 'month' ? undefined : 'numeric' }).format(new Date(date));
    parts.push(`<span class="tick" style="left:${x.toFixed(2)}px">${escapeHtml(label)}</span>`);
  }
  return parts.join('');
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
    return ['tasks', 'links', 'zoom', 'filter', 'sort', 'bar-variant', 'variant', 'readonly', 'show-toolbar', 'show-today', 'headless'];
  }

  private collapsed = new Set<string>();
  private overrides = new Map<string, Partial<GanttTask>>();
  private drag: DragState | null = null;
  private selectedId: string | null = null;
  private internalFilter = '';
  private viewportTop = 0;
  private viewportLeft = 0;
  private viewportWidth = 1800;
  private viewportHeight = 620;
  private renderedFirstRow = 0;
  private renderedLastRow = 0;
  private scrollFrame: number | null = null;
  private overridesVersion = 0;
  private taskCacheRaw: string | null = null;
  private taskCacheVersion = -1;
  private taskCache: GanttTask[] = [];
  private linkCacheRaw: string | null = null;
  private linkCache: GanttLink[] = [];
  private visibleCacheKey = '';
  private visibleCache: VisibleTask[] = [];

  protected override render(): void {
    const tasks = this.getTasks();
    const links = this.getLinks();
    const zoom = normalizeZoom(this.getAttribute('zoom'));
    const sort = normalizeSort(this.getAttribute('sort'));
    const barVariant = normalizeBarVariant(this.getAttribute('bar-variant'));
    const filterText = this.getAttribute('filter') ?? this.internalFilter;
    const visible = this.getVisibleTasks(tasks, filterText, sort);
    const readonly = this.hasAttribute('readonly');
    const showToolbar = this.getAttribute('show-toolbar') !== 'false';
    const showToday = this.getAttribute('show-today') !== 'false';

    if (!tasks.length) {
      this.setContent(`
        <style>${style}</style>
        <section class="frame" part="frame">
          <div class="empty" part="empty">No tasks in this range</div>
        </section>
      `);
      return;
    }

    const allStarts = tasks.map((task) => parseDate(task.start)).filter((value): value is number => value != null);
    const allEnds = tasks.map((task) => parseDate(task.end)).filter((value): value is number => value != null);
    const min = addDays(Math.min(...allStarts), -2);
    const max = addDays(Math.max(...allEnds), 3);
    const totalDays = Math.max(7, Math.ceil((max - min) / DAY));
    const dayWidth = zoomPixels[zoom];
    const timelineWidth = Math.max(680, totalDays * dayWidth);
    const rowsHeight = Math.max(visible.length * ROW_HEIGHT, ROW_HEIGHT);
    const virtualized = this.getAttribute('virtualized') !== 'false' && visible.length > 240;
    const viewportRows = Math.max(20, Math.ceil(Math.max(420, this.viewportHeight - HEADER_HEIGHT) / ROW_HEIGHT));
    const overscan = 160;
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

    const visibleById = new Map(visible.map((task, index) => [task.id, { task, index }]));
    const renderedIds = new Set(rendered.map((task) => task.id));
    const xForDate = (value: number) => ((value - min) / DAY) * dayWidth;
    const gridRows = rendered.map((task, offset) => {
      const rowIndex = firstRow + offset;
      const selected = this.selectedId === task.id ? ' selected' : '';
      const kind = taskKind(task);
      const progress = task.progress == null ? '-' : `${Math.round(task.progress)}%`;
      const dates = kind === 'milestone' ? formatShortDate(task.startMs) : `${formatShortDate(task.startMs)} - ${formatShortDate(task.endMs)}`;
      return `
        <article class="grid-row${selected}" part="grid-row" data-task-id="${escapeHtml(task.id)}" role="row" aria-rowindex="${rowIndex + 2}" aria-level="${task.depth + 1}" ${task.hasChildren ? `aria-expanded="${!this.collapsed.has(task.id)}"` : ''}>
          <div class="grid-cell task-name" role="gridcell" style="padding-left:${10 + task.depth * 18}px">
            ${task.hasChildren ? `<button class="expander" data-action="toggle" data-task-id="${escapeHtml(task.id)}" aria-label="${this.collapsed.has(task.id) ? 'Expand' : 'Collapse'} ${escapeHtml(task.label)}">${this.collapsed.has(task.id) ? '›' : '⌄'}</button>` : '<span style="inline-size:22px"></span>'}
            <span class="name-text" title="${escapeHtml(task.label)}">${escapeHtml(task.label)}</span>
          </div>
          <div class="grid-cell badge" role="gridcell">${escapeHtml(task.assignee || kind)}</div>
          <div class="grid-cell badge" role="gridcell">${escapeHtml(dates)}</div>
          <div class="grid-cell badge" role="gridcell">${escapeHtml(progress)}</div>
        </article>
      `;
    }).join('');

    const timelineRows = rendered.map((task, offset) => {
      const rowIndex = firstRow + offset;
      const kind = taskKind(task);
      const selected = this.selectedId === task.id ? ' selected' : '';
      const focusable = this.selectedId === task.id || (!this.selectedId && rowIndex === 0);
      const tone = tones[task.tone || (kind === 'summary' ? 'info' : 'default')] || tones.default;
      const left = kind === 'milestone' ? xForDate(task.startMs) - MILESTONE_SIZE / 2 : xForDate(task.startMs);
      const right = xForDate(kind === 'milestone' ? task.startMs : task.endMs);
      const width = kind === 'milestone' ? MILESTONE_SIZE : Math.max(12, right - left);
      const progress = Math.max(0, Math.min(100, Number(task.progress ?? 0)));
      const canEdit = !readonly && !task.readonly && kind !== 'summary';
      const showHandles = canEdit && kind === 'task';
      const splitSegments = kind === 'task' && task.segments?.length
        ? task.segments.map((segment) => {
          const segmentStart = parseDate(segment.start);
          const segmentEnd = parseDate(segment.end);
          if (segmentStart == null || segmentEnd == null) return '';
          const range = Math.max(DAY, task.endMs - task.startMs);
          const clippedStart = Math.max(task.startMs, segmentStart);
          const clippedEnd = Math.min(task.endMs, segmentEnd);
          if (clippedEnd <= clippedStart) return '';
          const segmentLeft = Math.max(0, Math.min(100, ((clippedStart - task.startMs) / range) * 100));
          const rawWidth = ((clippedEnd - clippedStart) / range) * 100;
          const segmentWidth = Math.min(100 - segmentLeft, Math.max(1, rawWidth));
          if (segmentWidth <= 0) return '';
          return `<span class="split-segment" style="left:${segmentLeft.toFixed(2)}%;width:${segmentWidth.toFixed(2)}%"></span>`;
        }).join('')
        : '';
      return `
        <article class="timeline-row${selected}" part="timeline-row" data-task-id="${escapeHtml(task.id)}" role="row" aria-rowindex="${rowIndex + 2}">
          ${task.baselineStart && task.baselineEnd ? `<span class="baseline" style="left:${xForDate(parseDate(task.baselineStart) || task.startMs).toFixed(2)}px;width:${Math.max(4, xForDate(parseDate(task.baselineEnd) || task.endMs) - xForDate(parseDate(task.baselineStart) || task.startMs)).toFixed(2)}px"></span>` : ''}
          <button
            class="bar ${kind}${task.critical ? ' critical' : ''}${splitSegments ? ' split' : ''}"
            part="bar ${kind}"
            data-task-id="${escapeHtml(task.id)}"
            data-kind="${kind}"
            role="gridcell"
            tabindex="${focusable ? '0' : '-1'}"
            aria-selected="${this.selectedId === task.id}"
            aria-colindex="5"
            style="left:${left.toFixed(2)}px;width:${width.toFixed(2)}px;--tone:${tone};--progress:${progress.toFixed(2)}%"
            aria-label="${escapeHtml(task.label)}"
            ${canEdit ? 'data-draggable="true"' : ''}
          >
            ${showHandles ? '<span class="handle start" data-mode="resize-start"></span>' : ''}
            <span class="progress"></span>
            ${splitSegments}
            ${kind === 'milestone' ? '<span class="milestone-shape"></span>' : ''}
            <span class="drag-tip"></span>
            ${showHandles ? '<span class="handle end" data-mode="resize-end"></span>' : ''}
          </button>
        </article>
      `;
    }).join('');

    const linkPaths = links.map((link) => {
      const source = visibleById.get(link.source);
      const target = visibleById.get(link.target);
      if (!source || !target) return '';
      if (virtualized && !renderedIds.has(link.source) && !renderedIds.has(link.target)) return '';
      const routed = routeDependencyPath(source.task, source.index, target.task, target.index, link.type, xForDate);
      const label = `${source.task.label} dependency to ${target.task.label}`;
      return `<path class="link-hit" d="${routed}" data-link-id="${escapeHtml(link.id)}" data-source-id="${escapeHtml(link.source)}" data-target-id="${escapeHtml(link.target)}" data-link-type="${escapeHtml(link.type || 'e2s')}" aria-label="${escapeHtml(label)}" /><path d="${routed}" />`;
    }).join('');
    const linkDefs = linkPaths ? '<defs><marker id="ui-gantt-arrow" markerWidth="9" markerHeight="9" refX="8.5" refY="4.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0.5 0.75 L 8.5 4.5 L 0.5 8.25 z" /></marker></defs>' : '';

    const today = startOfDay(Date.now());
    const todayX = xForDate(today);
    const todayMarkup = showToday && today >= min && today <= max ? `<div class="today" part="today" style="left:${todayX.toFixed(2)}px"></div>` : '';

    this.setContent(`
      <style>${style}</style>
      <section class="frame" part="frame" data-bar-variant="${barVariant}">
        ${showToolbar ? `
          <header class="toolbar" part="toolbar">
            <div class="title">Project schedule <span class="meta">${visible.length}/${tasks.length} tasks</span></div>
            <div class="controls">
              <input class="control" value="${escapeHtml(filterText)}" placeholder="Filter tasks" aria-label="Filter tasks" />
              <select class="select" aria-label="Sort tasks">
                ${[
                  ['none', 'Manual'],
                  ['start', 'Start date'],
                  ['end', 'End date'],
                  ['label', 'Name'],
                  ['progress', 'Progress']
                ].map(([value, label]) => `<option value="${value}" ${sort === value ? 'selected' : ''}>${label}</option>`).join('')}
              </select>
              ${(['day', 'week', 'month', 'quarter', 'year'] as GanttZoom[]).map((item) => `<button class="zoom-button" data-zoom="${item}" aria-pressed="${zoom === item}">${item}</button>`).join('')}
            </div>
          </header>
        ` : ''}
        <div class="viewport" part="viewport">
          <div class="surface" part="surface" style="--day-width:${dayWidth}px;grid-template-columns:${GRID_WIDTH}px ${timelineWidth.toFixed(2)}px;inline-size:max(100%, ${(GRID_WIDTH + timelineWidth).toFixed(2)}px)">
            <header class="grid-head" part="grid-head" role="row">
              <button class="head-button" data-sort="label" role="columnheader" aria-sort="${sort === 'label' ? 'ascending' : 'none'}">Task</button>
              <span role="columnheader">Owner</span>
              <button class="head-button" data-sort="start" role="columnheader" aria-sort="${sort === 'start' ? 'ascending' : 'none'}">Dates</button>
              <button class="head-button" data-sort="progress" role="columnheader" aria-sort="${sort === 'progress' ? 'descending' : 'none'}">%</button>
            </header>
            <header class="timeline-head" part="timeline-head">
              <div class="scale" style="width:${timelineWidth.toFixed(2)}px">${createTicks(min, max, dayWidth, zoom, this.viewportLeft, this.viewportWidth)}</div>
            </header>
            <div class="grid-body" part="grid-body" role="treegrid" aria-rowcount="${visible.length + 1}" aria-colcount="4">
              ${virtualized && topSpacer ? `<div style="height:${topSpacer}px"></div>` : ''}
              ${gridRows || '<div class="empty">No matching tasks</div>'}
              ${virtualized && bottomSpacer ? `<div style="height:${bottomSpacer}px"></div>` : ''}
            </div>
            <div class="timeline-body" part="timeline-body" style="width:${timelineWidth.toFixed(2)}px;min-height:${rowsHeight}px">
              <svg class="links" width="${timelineWidth.toFixed(0)}" height="${rowsHeight}" viewBox="0 0 ${timelineWidth.toFixed(0)} ${rowsHeight}" aria-hidden="true">${linkDefs}${linkPaths}</svg>
              ${todayMarkup}
              ${virtualized && topSpacer ? `<div style="height:${topSpacer}px"></div>` : ''}
              ${timelineRows}
              ${virtualized && bottomSpacer ? `<div style="height:${bottomSpacer}px"></div>` : ''}
            </div>
          </div>
        </div>
      </section>
    `);

    const viewport = this.root.querySelector<HTMLElement>('.viewport');
    if (viewport) {
      viewport.scrollTop = this.viewportTop;
      viewport.scrollLeft = this.viewportLeft;
      this.viewportWidth = viewport.clientWidth || this.viewportWidth;
      this.viewportHeight = viewport.clientHeight || this.viewportHeight;
    }
    this.bindEvents();
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
        if (!id) return;
        if (this.collapsed.has(id)) this.collapsed.delete(id);
        else this.collapsed.add(id);
        this.requestRender();
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((button) => {
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

    this.root.querySelector<HTMLElement>('.viewport')?.addEventListener('scroll', (event) => {
      const viewport = event.currentTarget as HTMLElement;
      const top = viewport.scrollTop;
      const left = viewport.scrollLeft;
      const viewportRows = Math.max(20, Math.ceil(Math.max(420, this.viewportHeight - HEADER_HEIGHT) / ROW_HEIGHT));
      const rowTop = Math.max(0, Math.floor(Math.max(0, top - HEADER_HEIGHT) / ROW_HEIGHT));
      const shouldRenderRows = rowTop < this.renderedFirstRow + 64 || rowTop + viewportRows > this.renderedLastRow - 64;
      const shouldRenderX = Math.abs(left - this.viewportLeft) >= Math.max(480, this.viewportWidth * 0.6);
      this.viewportTop = top;
      this.viewportLeft = left;
      if (!shouldRenderRows && !shouldRenderX) return;
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

    this.root.querySelectorAll<SVGPathElement>('.link-hit').forEach((path) => {
      path.addEventListener('click', (event) => {
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('linkselect', {
          detail: {
            id: path.dataset.linkId || '',
            source: path.dataset.sourceId || '',
            target: path.dataset.targetId || '',
            type: path.dataset.linkType || 'e2s'
          },
          bubbles: true,
          composed: true
        }));
      });
    });

    if (this.hasAttribute('readonly')) return;
    this.root.querySelectorAll<HTMLElement>('.bar[data-draggable="true"]').forEach((bar) => {
      bar.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        const taskId = bar.dataset.taskId;
        if (!taskId) return;
        const tasks = this.getTasks();
        const task = tasks.find((item) => item.id === taskId);
        const originalStart = parseDate(task?.start);
        const originalEnd = parseDate(task?.end);
        if (!task || originalStart == null || originalEnd == null) return;
        event.preventDefault();
        const kind = (bar.dataset.kind as GanttTaskType) || 'task';
        const requestedMode = ((event.target as HTMLElement).dataset.mode as DragState['mode']) || 'move';
        const mode = kind === 'milestone' ? 'move' : requestedMode;
        const zoom = normalizeZoom(this.getAttribute('zoom'));
        const selectedChanged = this.selectedId !== taskId;
        this.selectedId = taskId;
        this.dispatchEvent(new CustomEvent('taskselect', { detail: { id: taskId }, bubbles: true, composed: true }));
        this.drag = {
          taskId,
          mode,
          startX: event.clientX,
          originalStart,
          originalEnd,
          kind,
          rangeMin: this.rangeMin(),
          dayWidth: zoomPixels[zoom],
          latestStart: originalStart,
          latestEnd: originalEnd,
          frame: null,
          bar,
          moved: false,
          selectedChanged
        };
        bar.classList.add('dragging');
        bar.setPointerCapture(event.pointerId);
      });

      bar.addEventListener('pointermove', (event) => {
        if (!this.drag || this.drag.taskId !== bar.dataset.taskId) return;
        event.preventDefault();
        const dx = event.clientX - this.drag.startX;
        if (Math.abs(dx) > 2) this.drag.moved = true;
        let start = this.drag.originalStart;
        let end = this.drag.originalEnd;
        if (this.drag.mode === 'move') {
          const deltaDays = Math.round(dx / this.drag.dayWidth);
          start = addDays(this.drag.originalStart, deltaDays);
          end = this.drag.kind === 'milestone' ? start : addDays(this.drag.originalEnd, deltaDays);
        } else if (this.drag.mode === 'resize-start') {
          const deltaDays = Math.round(dx / this.drag.dayWidth);
          start = Math.min(addDays(this.drag.originalStart, deltaDays), addDays(end, -1));
        } else {
          const deltaDays = Math.round(dx / this.drag.dayWidth);
          end = Math.max(addDays(this.drag.originalEnd, deltaDays), addDays(start, 1));
        }
        this.drag.latestStart = start;
        this.drag.latestEnd = end;
        if (this.drag.frame == null) {
          this.drag.frame = requestAnimationFrame(() => {
            if (!this.drag) return;
            this.drag.frame = null;
            const left = ((this.drag.latestStart - this.drag.rangeMin) / DAY) * this.drag.dayWidth - (this.drag.kind === 'milestone' ? MILESTONE_SIZE / 2 : 0);
            const width = this.drag.kind === 'milestone' ? MILESTONE_SIZE : Math.max(12, ((this.drag.latestEnd - this.drag.latestStart) / DAY) * this.drag.dayWidth);
            this.drag.bar.style.left = `${left.toFixed(2)}px`;
            this.drag.bar.style.width = `${width.toFixed(2)}px`;
            const tip = this.drag.bar.querySelector<HTMLElement>('.drag-tip');
            if (tip) {
              tip.textContent = this.drag.kind === 'milestone'
                ? formatIso(this.drag.latestStart)
                : `${formatIso(this.drag.latestStart)} - ${formatIso(this.drag.latestEnd)}`;
            }
          });
        }
      });

      const finishDrag = () => {
        if (!this.drag) return;
        if (this.drag.frame != null) cancelAnimationFrame(this.drag.frame);
        const drag = this.drag;
        drag.bar.classList.remove('dragging');
        this.drag = null;
        if (!drag.moved) {
          if (drag.selectedChanged) this.requestRender();
          return;
        }
        const detail = {
          id: drag.taskId,
          start: formatIso(drag.latestStart),
          end: formatIso(drag.latestEnd)
        };
        this.overrides.set(drag.taskId, { start: detail.start, end: detail.end });
        this.bumpOverrides();
        this.dispatchEvent(new CustomEvent('taskchange', {
          detail,
          bubbles: true,
          composed: true
        }));
        this.requestRender();
      };

      bar.addEventListener('pointerup', finishDrag);
      bar.addEventListener('pointercancel', finishDrag);
      bar.addEventListener('keydown', (event) => {
        const taskId = bar.dataset.taskId;
        if (!taskId) return;
        if (event.key === 'Delete' || event.key === 'Backspace') {
          event.preventDefault();
          this.dispatchEvent(new CustomEvent('taskdelete', { detail: { id: taskId }, bubbles: true, composed: true }));
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.selectTask(taskId);
          return;
        }
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          this.selectAdjacentTask(taskId, event.key === 'ArrowDown' ? 1 : -1);
          return;
        }
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        const tasks = this.getTasks();
        const task = tasks.find((item) => item.id === taskId);
        const start = parseDate(task?.start);
        const end = parseDate(task?.end);
        if (!task || start == null || end == null) return;
        event.preventDefault();
        const direction = event.key === 'ArrowLeft' ? -1 : 1;
        const isMilestone = bar.dataset.kind === 'milestone';
        const nextStart = event.shiftKey && !isMilestone ? start : addDays(start, direction);
        const nextEnd = isMilestone
          ? nextStart
          : event.shiftKey
            ? Math.max(addDays(end, direction), addDays(start, 1))
            : addDays(end, direction);
        const detail = { id: taskId, start: formatIso(nextStart), end: formatIso(nextEnd) };
        this.overrides.set(taskId, { start: detail.start, end: detail.end });
        this.bumpOverrides();
        this.dispatchEvent(new CustomEvent('taskchange', { detail, bubbles: true, composed: true }));
        this.requestRender();
      });
    });
  }

  private rangeMin(): number {
    const tasks = this.getTasks();
    const starts = tasks.map((task) => parseDate(task.start)).filter((value): value is number => value != null);
    return starts.length ? addDays(Math.min(...starts), -2) : startOfDay(Date.now());
  }

  private selectTask(id: string): void {
    this.captureViewport();
    if (this.selectedId === id) {
      this.dispatchEvent(new CustomEvent('taskselect', { detail: { id }, bubbles: true, composed: true }));
      return;
    }
    this.selectedId = id;
    this.dispatchEvent(new CustomEvent('taskselect', { detail: { id }, bubbles: true, composed: true }));
    this.requestRender();
  }

  private selectAdjacentTask(id: string, direction: 1 | -1): void {
    const visible = this.getVisibleTasks(
      this.getTasks(),
      this.getAttribute('filter') ?? this.internalFilter,
      normalizeSort(this.getAttribute('sort'))
    );
    const index = visible.findIndex((task) => task.id === id);
    const next = visible[Math.max(0, Math.min(visible.length - 1, index + direction))];
    if (!next || next.id === id) return;
    this.selectedId = next.id;
    this.dispatchEvent(new CustomEvent('taskselect', { detail: { id: next.id }, bubbles: true, composed: true }));
    this.requestRender();
    window.requestAnimationFrame(() => {
      this.root.querySelector<HTMLElement>(`.bar[data-task-id="${CSS.escape(next.id)}"]`)?.focus();
    });
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
    if (raw === this.taskCacheRaw && this.taskCacheVersion === this.overridesVersion) return this.taskCache;
    this.taskCacheRaw = raw;
    this.taskCacheVersion = this.overridesVersion;
    this.taskCache = parseTasks(raw, this.overrides);
    this.visibleCacheKey = '';
    return this.taskCache;
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

  protected override shouldRenderOnAttributeChange(name: string, _oldValue: string | null, _newValue: string | null): boolean {
    if (name === 'tasks') {
      this.overrides.clear();
      this.bumpOverrides();
      this.viewportTop = 0;
      this.viewportLeft = 0;
    }
    if (name === 'links') this.linkCacheRaw = null;
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-gantt')) {
  customElements.define('ui-gantt', UIGantt);
}
