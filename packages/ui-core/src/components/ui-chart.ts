import { ElementBase } from '../ElementBase';

type ChartPoint = { label: string; value: number; tone?: string };
type ChartSeries = {
  name: string;
  data: ChartPoint[];
  tone?: string;
  fill?: boolean;
  dash?: string;
  strokeWidth?: number;
  opacity?: number;
};
type ChartKind = 'line' | 'area' | 'bar' | 'donut' | 'step' | 'scatter' | 'radial';
type ChartState = 'idle' | 'loading' | 'error' | 'success';
type SeriesValueDetail = {
  series: string;
  value: number | null;
  tone?: string;
};

type PointSelectDetail = {
  index: number;
  label: string;
  value: number;
  tone?: string;
  series?: string;
  seriesValues?: SeriesValueDetail[];
  type: ChartKind;
  total: number;
  min: number;
  max: number;
  source: 'pointer' | 'keyboard' | 'api';
};

type ChartStats = {
  total: number;
  average: number;
  min: number;
  max: number;
  delta: number;
  deltaPct: number | null;
};

type PlotRender = {
  svg: string;
  hits: string;
  anchors: Array<{ xPct: number; yPct: number }>;
  yTicks: string[];
};

type NormalizedSeries = {
  name: string;
  data: ChartPoint[];
  tone?: string;
  fill?: boolean;
  dash?: string;
  strokeWidth?: number;
  opacity?: number;
};

type NormalizedChartData = {
  labels: string[];
  series: NormalizedSeries[];
  truncated: number;
};

const MAX_POINTS = 180;

const style = `
  :host {
    --ui-chart-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, transparent);
    --ui-chart-surface: color-mix(in srgb, var(--ui-color-surface, #ffffff) 97%, #ffffff 3%);
    --ui-chart-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-chart-text: var(--ui-color-text, #0f172a);
    --ui-chart-muted: var(--ui-color-muted, #64748b);
    --ui-chart-grid: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 45%, transparent);
    --ui-chart-accent: var(--ui-color-primary, #2563eb);
    --ui-chart-success: var(--ui-color-success, #16a34a);
    --ui-chart-warning: var(--ui-color-warning, #d97706);
    --ui-chart-danger: var(--ui-color-danger, #dc2626);
    --ui-chart-radius: 16px;
    --ui-chart-shadow: none;
    --ui-chart-plot-height: 220px;
    --ui-chart-plot-min-height: 188px;
    --ui-chart-plot-min-width: 420px;

    display: block;
    min-inline-size: 0;
    box-sizing: border-box;
    color-scheme: light dark;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }

  .frame {
    position: relative;
    border: 1px solid var(--ui-chart-border);
    border-radius: var(--ui-chart-radius);
    background: linear-gradient(160deg, var(--ui-chart-surface), var(--ui-chart-bg));
    color: var(--ui-chart-text);
    box-shadow: var(--ui-chart-shadow);
    padding: 16px;
    display: grid;
    gap: 12px;
    overflow: clip;
  }

  :host([variant="minimal"]) .frame {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }

  :host([variant="contrast"]) {
    --ui-chart-bg: #0b1220;
    --ui-chart-surface: #0f172a;
    --ui-chart-border: #334155;
    --ui-chart-text: #e2e8f0;
    --ui-chart-muted: #94a3b8;
    --ui-chart-grid: color-mix(in srgb, #475569 74%, transparent);
    --ui-chart-accent: #93c5fd;
    --ui-chart-success: #34d399;
    --ui-chart-warning: #fbbf24;
    --ui-chart-danger: #f87171;
    --ui-chart-shadow: none;
  }

  .frame[data-state="loading"] {
    cursor: progress;
  }

  .frame[data-disabled="true"] {
    opacity: 0.68;
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .toolbar {
    display: grid;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid color-mix(in srgb, var(--ui-chart-border) 82%, transparent);
    border-radius: 12px;
    background: color-mix(in srgb, var(--ui-chart-surface) 96%, transparent);
  }

  .toolbar[hidden] {
    display: none;
  }

  .toolbar ::slotted(*) {
    display: block;
  }

  .meta {
    min-inline-size: 0;
    display: grid;
    gap: 4px;
  }

  .title {
    font-size: 15px;
    line-height: 1.35;
    font-weight: 700;
    letter-spacing: 0.01em;
    margin: 0;
  }

  .subtitle {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    color: var(--ui-chart-muted);
  }

  .title-slot,
  .subtitle-slot {
    display: contents;
  }

  .title-slot::slotted(*) {
    margin: 0;
    font-size: 15px;
    line-height: 1.35;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: var(--ui-chart-text);
  }

  .subtitle-slot::slotted(*) {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    color: var(--ui-chart-muted);
  }

  .status-pill {
    align-self: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-block-size: 24px;
    padding: 0 10px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--ui-chart-border) 88%, transparent);
    background: color-mix(in srgb, var(--ui-chart-surface) 92%, transparent);
    font-size: 11px;
    line-height: 1;
    font-weight: 600;
    color: var(--ui-chart-muted);
    white-space: nowrap;
  }

  .status-pill[data-state="success"] {
    color: var(--ui-chart-success);
    border-color: color-mix(in srgb, var(--ui-chart-success) 35%, var(--ui-chart-border));
    background: color-mix(in srgb, var(--ui-chart-success) 13%, transparent);
  }

  .status-pill[data-state="error"] {
    color: var(--ui-chart-danger);
    border-color: color-mix(in srgb, var(--ui-chart-danger) 35%, var(--ui-chart-border));
    background: color-mix(in srgb, var(--ui-chart-danger) 12%, transparent);
  }

  .status-pill[data-state="loading"] {
    color: var(--ui-chart-warning);
    border-color: color-mix(in srgb, var(--ui-chart-warning) 32%, var(--ui-chart-border));
    background: color-mix(in srgb, var(--ui-chart-warning) 10%, transparent);
  }

  .summary {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }

  .metric {
    border: 1px solid color-mix(in srgb, var(--ui-chart-border) 82%, transparent);
    border-radius: 10px;
    padding: 8px 10px;
    background: color-mix(in srgb, var(--ui-chart-surface) 95%, transparent);
    min-inline-size: 0;
    display: grid;
    gap: 4px;
  }

  .metric-label {
    font-size: 11px;
    line-height: 1;
    color: var(--ui-chart-muted);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .metric-value {
    font-size: 14px;
    line-height: 1.2;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .metric-value[data-tone="up"] {
    color: var(--ui-chart-success);
  }

  .metric-value[data-tone="down"] {
    color: var(--ui-chart-danger);
  }

  .plot-shell {
    position: relative;
    inline-size: 100%;
    min-inline-size: 0;
    border: 1px solid color-mix(in srgb, var(--ui-chart-border) 80%, transparent);
    border-radius: 12px;
    background: color-mix(in srgb, var(--ui-chart-surface) 97%, transparent);
    min-block-size: var(--ui-chart-plot-min-height);
    block-size: var(--ui-chart-plot-height);
    overflow: auto hidden;
  }

  .plot-body {
    display: grid;
    grid-template-columns: minmax(32px, auto) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) auto;
    inline-size: 100%;
    min-inline-size: calc(var(--ui-chart-plot-min-width) + 38px);
    block-size: 100%;
    min-block-size: 0;
  }

  .plot {
    inline-size: 100%;
    block-size: 100%;
    display: block;
  }

  .axis-y {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    padding: 8px 6px 24px 0;
    color: var(--ui-chart-muted);
    font-size: 11px;
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  .axis-x {
    grid-column: 2;
    grid-row: 2;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    align-items: start;
    gap: 0;
    padding: 6px 10px 8px;
    color: var(--ui-chart-muted);
    font-size: 11px;
    line-height: 1.2;
    pointer-events: none;
    user-select: none;
  }

  .axis-x-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }

  .axis-x-label[data-hidden="true"] {
    visibility: hidden;
  }

  .plot-stage {
    position: relative;
    grid-column: 2;
    grid-row: 1;
    min-inline-size: var(--ui-chart-plot-min-width);
    min-block-size: 0;
  }

  .plot-grid line,
  .plot-grid path {
    transition: stroke 140ms ease;
  }

  .plot-hit-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .plot-hit {
    position: absolute;
    inset-inline-start: calc(var(--x, 50) * 1%);
    inset-block-start: calc(var(--y, 50) * 1%);
    transform: translate(-50%, -50%);
    inline-size: 22px;
    block-size: 22px;
    border: none;
    border-radius: 999px;
    padding: 0;
    margin: 0;
    cursor: pointer;
    background: transparent;
    pointer-events: auto;
    color: inherit;
  }

  .plot-hit::after {
    content: '';
    position: absolute;
    inset: 7px;
    border-radius: inherit;
    border: 1px solid color-mix(in srgb, var(--ui-chart-accent) 30%, transparent);
    background: color-mix(in srgb, var(--ui-chart-surface) 70%, transparent);
    transform: scale(0.85);
    opacity: 0;
    transition: opacity 140ms ease, transform 140ms ease;
  }

  .plot-hit:hover::after,
  .plot-hit:focus-visible::after,
  .plot-hit[data-active="true"]::after {
    opacity: 1;
    transform: scale(1);
  }

  .plot-hit:focus-visible {
    outline: 2px solid var(--ui-chart-accent);
    outline-offset: 2px;
  }

  .axis-labels {
    position: absolute;
    inset-inline: 10px;
    inset-block-end: 6px;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
    color: var(--ui-chart-muted);
    font-size: 11px;
    line-height: 1;
  }

  .tooltip {
    position: absolute;
    inset-inline-start: clamp(72px, calc(var(--x, 50) * 1%), calc(100% - 72px));
    inset-block-start: clamp(10px, calc(var(--y, 20) * 1%), calc(100% - 72px));
    transform: translate(-50%, calc(-100% - 10px));
    min-inline-size: 132px;
    max-inline-size: min(220px, calc(100% - 16px));
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid color-mix(in srgb, var(--ui-chart-border) 86%, transparent);
    background: color-mix(in srgb, var(--ui-chart-surface) 98%, transparent);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
    color: var(--ui-chart-text);
    display: grid;
    gap: 8px;
    pointer-events: none;
    z-index: 2;
  }

  .tooltip-title {
    font-size: 12px;
    line-height: 1.2;
    font-weight: 700;
  }

  .tooltip-list {
    display: grid;
    gap: 6px;
  }

  .tooltip-row {
    display: grid;
    grid-template-columns: 8px minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    line-height: 1.2;
  }

  .tooltip-dot {
    inline-size: 8px;
    block-size: 8px;
    border-radius: 999px;
    background: var(--dot, var(--ui-chart-accent));
  }

  .tooltip-series {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--ui-chart-muted);
  }

  .tooltip-value {
    font-weight: 700;
    color: var(--ui-chart-text);
    white-space: nowrap;
  }

  .insight {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border: 1px solid color-mix(in srgb, var(--ui-chart-border) 78%, transparent);
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 12px;
    line-height: 1.35;
    color: var(--ui-chart-muted);
    background: color-mix(in srgb, var(--ui-chart-surface) 95%, transparent);
  }

  .insight strong {
    color: var(--ui-chart-text);
    font-weight: 700;
  }

  .legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
  }

  .legend-item {
    border: 1px solid color-mix(in srgb, var(--ui-chart-border) 78%, transparent);
    background: color-mix(in srgb, var(--ui-chart-surface) 94%, transparent);
    border-radius: 10px;
    min-block-size: 30px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 10px;
    font-size: 12px;
    line-height: 1;
    color: var(--ui-chart-muted);
    cursor: pointer;
    transition: border-color 140ms ease, background-color 140ms ease, color 140ms ease;
  }

  .legend-item[data-active="true"],
  .legend-item:hover {
    border-color: color-mix(in srgb, var(--ui-chart-accent) 35%, var(--ui-chart-border));
    background: color-mix(in srgb, var(--ui-chart-accent) 12%, transparent);
    color: var(--ui-chart-text);
  }

  .legend-item:focus-visible {
    outline: 2px solid var(--ui-chart-accent);
    outline-offset: 2px;
  }

  .legend-item[disabled],
  .plot-hit[disabled] {
    cursor: default;
    pointer-events: none;
  }

  .legend-dot {
    inline-size: 8px;
    block-size: 8px;
    border-radius: 999px;
    flex: 0 0 auto;
    background: var(--dot, var(--ui-chart-accent));
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--dot, var(--ui-chart-accent)) 35%, transparent);
  }

  .empty,
  .message {
    border: 1px dashed color-mix(in srgb, var(--ui-chart-border) 78%, transparent);
    border-radius: 10px;
    padding: 14px;
    text-align: center;
    font-size: 12px;
    color: var(--ui-chart-muted);
    background: color-mix(in srgb, var(--ui-chart-surface) 95%, transparent);
  }

  .message[data-tone="error"] {
    color: var(--ui-chart-danger);
    border-color: color-mix(in srgb, var(--ui-chart-danger) 30%, var(--ui-chart-border));
    background: color-mix(in srgb, var(--ui-chart-danger) 10%, transparent);
  }

  .message[data-tone="success"] {
    color: var(--ui-chart-success);
    border-color: color-mix(in srgb, var(--ui-chart-success) 30%, var(--ui-chart-border));
    background: color-mix(in srgb, var(--ui-chart-success) 10%, transparent);
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg,
        color-mix(in srgb, var(--ui-chart-surface) 88%, transparent) 0%,
        color-mix(in srgb, var(--ui-chart-surface) 68%, transparent) 50%,
        color-mix(in srgb, var(--ui-chart-surface) 88%, transparent) 100%);
    background-size: 220% 100%;
    animation: ui-chart-shimmer 1.1s linear infinite;
  }

  .sr-only {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    white-space: nowrap;
    clip-path: inset(100%);
    clip: rect(0 0 0 0);
    overflow: hidden;
  }

  :host([headless]) .frame {
    display: none !important;
  }

  @media (max-width: 720px) {
    :host {
      --ui-chart-plot-height: 188px;
      --ui-chart-plot-min-height: 168px;
      --ui-chart-plot-min-width: 320px;
    }

    .frame {
      padding: 12px;
      gap: 10px;
    }

    .summary {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .legend-item,
    .plot-hit::after,
    .loading-overlay {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .frame,
    .metric,
    .plot-shell,
    .legend-item,
    .insight,
    .empty,
    .message {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-chart-bg: Canvas;
      --ui-chart-surface: Canvas;
      --ui-chart-border: CanvasText;
      --ui-chart-text: CanvasText;
      --ui-chart-muted: CanvasText;
      --ui-chart-grid: CanvasText;
      --ui-chart-accent: Highlight;
      --ui-chart-success: Highlight;
      --ui-chart-warning: Highlight;
      --ui-chart-danger: Highlight;
      --ui-chart-shadow: none;
    }

    .frame,
    .metric,
    .plot-shell,
    .legend-item,
    .insight,
    .empty,
    .message,
    .status-pill {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }

    .legend-dot {
      background: Highlight;
      box-shadow: none;
    }
  }

  @keyframes ui-chart-shimmer {
    from {
      background-position: 220% 0;
    }
    to {
      background-position: -220% 0;
    }
  }
`;

const palette = [
  'var(--ui-color-primary, #2563eb)',
  'var(--ui-color-success, #16a34a)',
  'var(--ui-color-warning, #d97706)',
  'var(--ui-color-danger, #dc2626)',
  'var(--ui-color-info, #0891b2)',
  'var(--ui-color-accent, #7c3aed)'
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function parsePoints(rawData: string | null, rawValues: string | null, rawLabels: string | null): ChartPoint[] {
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed
          .map((entry, index) => {
            if (typeof entry === 'number') {
              if (!Number.isFinite(entry)) return null;
              return { label: String(index + 1), value: entry };
            }
            if (entry && typeof entry === 'object') {
              const value = Number((entry as { value?: unknown }).value);
              if (!Number.isFinite(value)) return null;
              const labelRaw = (entry as { label?: unknown }).label;
              const toneRaw = (entry as { tone?: unknown }).tone;
              return {
                label: typeof labelRaw === 'string' && labelRaw.trim() ? labelRaw.trim() : String(index + 1),
                value,
                tone: typeof toneRaw === 'string' && toneRaw.trim() ? toneRaw.trim() : undefined
              } satisfies ChartPoint;
            }
            return null;
          })
          .filter((entry): entry is ChartPoint => !!entry);
      }
    } catch {
      return [];
    }
  }

  const values = (rawValues || '')
    .split(',')
    .map((entry) => Number(entry.trim()))
    .filter((entry) => Number.isFinite(entry));

  const labels = (rawLabels || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return values.map((value, index) => ({
    label: labels[index] || String(index + 1),
    value
  }));
}

function parsePointArray(input: unknown): ChartPoint[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((entry, index) => {
      if (typeof entry === 'number') {
        if (!Number.isFinite(entry)) return null;
        return { label: String(index + 1), value: entry } satisfies ChartPoint;
      }
      if (entry && typeof entry === 'object') {
        const value = Number((entry as { value?: unknown }).value);
        if (!Number.isFinite(value)) return null;
        const labelRaw = (entry as { label?: unknown }).label;
        const toneRaw = (entry as { tone?: unknown }).tone;
        return {
          label: typeof labelRaw === 'string' && labelRaw.trim() ? labelRaw.trim() : String(index + 1),
          value,
          tone: typeof toneRaw === 'string' && toneRaw.trim() ? toneRaw.trim() : undefined
        } satisfies ChartPoint;
      }
      return null;
    })
    .filter((entry): entry is ChartPoint => !!entry);
}

function parseSeries(rawSeries: string | null): ChartSeries[] {
  if (!rawSeries) return [];
  try {
    const parsed = JSON.parse(rawSeries);
    if (!Array.isArray(parsed)) return [];
    const series = parsed
      .map((entry, index) => {
        if (!entry || typeof entry !== 'object') return null;
        const nameRaw = (entry as { name?: unknown }).name;
        const data = parsePointArray((entry as { data?: unknown }).data);
        if (!data.length) return null;
        const toneRaw = (entry as { tone?: unknown }).tone;
        const dashRaw = (entry as { dash?: unknown }).dash;
        const strokeWidthRaw = Number((entry as { strokeWidth?: unknown }).strokeWidth);
        const opacityRaw = Number((entry as { opacity?: unknown }).opacity);
        const fillRaw = (entry as { fill?: unknown }).fill;
        return {
          name: typeof nameRaw === 'string' && nameRaw.trim() ? nameRaw.trim() : `Series ${index + 1}`,
          data,
          tone: typeof toneRaw === 'string' && toneRaw.trim() ? toneRaw.trim() : undefined,
          dash: typeof dashRaw === 'string' && dashRaw.trim() ? dashRaw.trim() : undefined,
          strokeWidth: Number.isFinite(strokeWidthRaw) && strokeWidthRaw > 0 ? strokeWidthRaw : undefined,
          opacity: Number.isFinite(opacityRaw) && opacityRaw > 0 ? opacityRaw : undefined,
          fill: typeof fillRaw === 'boolean' ? fillRaw : undefined
        } satisfies ChartSeries;
      })
      .filter((entry): entry is NonNullable<typeof entry> => !!entry);
    return series;
  } catch {
    return [];
  }
}

function normalizePoints(points: ChartPoint[]): { points: ChartPoint[]; truncated: number } {
  const sanitized = points
    .map((point, index) => ({
      label: point.label?.trim() || String(index + 1),
      value: Number(point.value),
      tone: typeof point.tone === 'string' && point.tone.trim() ? point.tone.trim() : undefined
    }))
    .filter((point) => Number.isFinite(point.value));

  if (sanitized.length <= MAX_POINTS) return { points: sanitized, truncated: 0 };

  const truncated = sanitized.length - MAX_POINTS;
  return { points: sanitized.slice(sanitized.length - MAX_POINTS), truncated };
}

function normalizeSeries(
  rawSeries: ChartSeries[],
  fallbackPoints: ChartPoint[]
): NormalizedChartData {
  const sourceSeries: ChartSeries[] = rawSeries.length
    ? rawSeries
    : fallbackPoints.length
      ? [{ name: 'Series 1', data: fallbackPoints }]
      : [];

  const normalizedSeries = sourceSeries
    .map((series) => {
      const normalized = normalizePoints(series.data);
      return {
        name: series.name,
        data: normalized.points,
        tone: series.tone,
        fill: series.fill,
        dash: series.dash,
        strokeWidth: series.strokeWidth,
        opacity: series.opacity,
        truncated: normalized.truncated
      };
    })
    .filter((series) => series.data.length > 0);

  const labelSet = new Set<string>();
  normalizedSeries.forEach((series) => {
    series.data.forEach((point) => labelSet.add(point.label));
  });
  let labels = Array.from(labelSet);
  let truncated = normalizedSeries.reduce((sum, series) => Math.max(sum, series.truncated), 0);

  if (labels.length > MAX_POINTS) {
    truncated += labels.length - MAX_POINTS;
    labels = labels.slice(labels.length - MAX_POINTS);
  }

  const trimmedSeries: NormalizedSeries[] = normalizedSeries.map((series) => {
    const allowed = new Set(labels);
    return {
      name: series.name,
      data: series.data.filter((point) => allowed.has(point.label)),
      tone: series.tone,
      fill: series.fill,
      dash: series.dash,
      strokeWidth: series.strokeWidth,
      opacity: series.opacity
    };
  });

  return { labels, series: trimmedSeries, truncated };
}

function statusText(state: ChartState): string {
  if (state === 'loading') return 'Updating';
  if (state === 'error') return 'Issue';
  if (state === 'success') return 'Stable';
  return 'Live';
}

function normalizeState(raw: string | null): ChartState {
  if (raw === 'loading' || raw === 'error' || raw === 'success') return raw;
  return 'idle';
}

export class UIChart extends ElementBase {
  static get observedAttributes() {
    return [
      'data',
      'series',
      'values',
      'labels',
      'type',
      'variant',
      'title',
      'subtitle',
      'headless',
      'state',
      'disabled',
      'interactive',
      'show-legend',
      'show-summary',
      'value-prefix',
      'value-suffix',
      'aria-label'
    ];
  }

  private _activeIndex: number | null = null;
  private _activePinned = false;

  private _onClickBound = (event: MouseEvent) => this._onClick(event);
  private _onKeyDownBound = (event: KeyboardEvent) => this._onKeyDown(event);
  private _onPointerOverBound = (event: PointerEvent) => this._onPointerOver(event);
  private _onPointerLeaveBound = () => this._onPointerLeave();
  private _onFocusInBound = (event: FocusEvent) => this._onFocusIn(event);

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClickBound as EventListener);
    this.root.addEventListener('keydown', this._onKeyDownBound as EventListener);
    this.root.addEventListener('pointerover', this._onPointerOverBound as EventListener);
    this.root.addEventListener('pointerleave', this._onPointerLeaveBound as EventListener);
    this.root.addEventListener('focusin', this._onFocusInBound as EventListener);
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClickBound as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDownBound as EventListener);
    this.root.removeEventListener('pointerover', this._onPointerOverBound as EventListener);
    this.root.removeEventListener('pointerleave', this._onPointerLeaveBound as EventListener);
    this.root.removeEventListener('focusin', this._onFocusInBound as EventListener);
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'disabled' || name === 'state' || name === 'interactive') {
      if (!this._isInteractive()) {
        this._activeIndex = null;
        this._activePinned = false;
      }
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private _data(): NormalizedChartData {
    const points = parsePoints(this.getAttribute('data'), this.getAttribute('values'), this.getAttribute('labels'));
    const series = parseSeries(this.getAttribute('series'));
    return normalizeSeries(series, points);
  }

  private _type(): ChartKind {
    const raw = this.getAttribute('type');
    if (
      raw === 'line' ||
      raw === 'area' ||
      raw === 'bar' ||
      raw === 'donut' ||
      raw === 'step' ||
      raw === 'scatter' ||
      raw === 'radial'
    ) return raw;
    return 'line';
  }

  private _state(): ChartState {
    return normalizeState(this.getAttribute('state'));
  }

  private _isDisabled(): boolean {
    return this.hasAttribute('disabled') || this._state() === 'loading';
  }

  private _isInteractive(): boolean {
    const raw = (this.getAttribute('interactive') || '').trim().toLowerCase();
    if (raw === 'false' || raw === '0' || raw === 'off') return false;
    return !this._isDisabled();
  }

  private _showLegend(): boolean {
    const raw = (this.getAttribute('show-legend') || '').trim().toLowerCase();
    if (!raw) return true;
    return raw !== 'false' && raw !== '0' && raw !== 'off';
  }

  private _showSummary(): boolean {
    const raw = (this.getAttribute('show-summary') || '').trim().toLowerCase();
    if (!raw) return true;
    return raw !== 'false' && raw !== '0' && raw !== 'off';
  }

  private _primarySeries(data: NormalizedChartData): NormalizedSeries | null {
    return data.series[0] || null;
  }

  private _valuePrefix(): string {
    return this.getAttribute('value-prefix') || '';
  }

  private _valueSuffix(): string {
    return this.getAttribute('value-suffix') || '';
  }

  private _resolveStats(points: ChartPoint[]): ChartStats {
    const values = points.map((point) => point.value);
    const total = values.reduce((sum, value) => sum + value, 0);
    const average = values.length ? total / values.length : 0;
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;
    const delta = values.length > 1 ? values[values.length - 1] - values[0] : 0;
    const first = values[0] || 0;
    const deltaPct = first !== 0 ? (delta / Math.abs(first)) * 100 : null;
    return { total, average, min, max, delta, deltaPct };
  }

  private _valueDomain(
    points: ChartPoint[],
    options?: { includeZero?: boolean; fitPadding?: number }
  ): { min: number; max: number; span: number; zeroInDomain: boolean } {
    const includeZero = !!options?.includeZero;
    const fitPadding = options?.fitPadding ?? 0.14;

    const values = points.map((point) => point.value);
    let min = Math.min(...values);
    let max = Math.max(...values);

    if (includeZero) {
      min = Math.min(0, min);
      max = Math.max(0, max);
    }

    let span = max - min;
    if (span <= 0) {
      const pad = Math.max(Math.abs(max) * 0.12, 1);
      min -= pad;
      max += pad;
      span = max - min;
    } else {
      const pad = span * fitPadding;
      if (includeZero) {
        min -= pad * 0.25;
        max += pad;
      } else {
        min -= pad;
        max += pad;
      }
      span = max - min;
    }

    const zeroInDomain = min <= 0 && max >= 0;
    return { min, max, span, zeroInDomain };
  }

  private _formatValue(value: number, options?: Intl.NumberFormatOptions): string {
    const prefix = this._valuePrefix();
    const suffix = this._valueSuffix();
    try {
      const formatted = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 1,
        ...options
      }).format(value);
      return `${prefix}${formatted}${suffix}`;
    } catch {
      return `${prefix}${value.toFixed(Math.abs(value) >= 100 ? 0 : 1)}${suffix}`;
    }
  }

  private _seriesTone(series: NormalizedSeries, seriesIndex: number): string {
    return series.tone || palette[seriesIndex % palette.length] || 'var(--ui-chart-accent)';
  }

  private _pointTone(point: ChartPoint, index: number, fallback?: string): string {
    return point.tone || fallback || palette[index % palette.length] || 'var(--ui-chart-accent)';
  }

  private _seriesValueDetails(labels: string[], series: NormalizedSeries[], index: number): SeriesValueDetail[] {
    const label = labels[index];
    return series.map((entry, seriesIndex) => {
      const point = entry.data.find((item) => item.label === label) || null;
      return {
        series: entry.name,
        value: point?.value ?? null,
        tone: point?.tone || this._seriesTone(entry, seriesIndex)
      };
    });
  }

  private _pointDetail(index: number, data: NormalizedChartData, type: ChartKind, source: PointSelectDetail['source']): PointSelectDetail | null {
    const primary = this._primarySeries(data);
    if (!primary) return null;
    const label = data.labels[index];
    if (!label) return null;
    const point = primary.data.find((entry) => entry.label === label) || primary.data[index];
    if (!point) return null;
    const stats = this._resolveStats(primary.data);
    const seriesValues = this._seriesValueDetails(data.labels, data.series, index);
    return {
      index,
      label,
      value: point.value,
      tone: point.tone || this._seriesTone(primary, 0),
      series: primary.name,
      seriesValues,
      type,
      total: stats.total,
      min: stats.min,
      max: stats.max,
      source
    };
  }

  private _emitPointSelect(index: number, data: NormalizedChartData, source: PointSelectDetail['source']): void {
    const detail = this._pointDetail(index, data, this._type(), source);
    if (!detail) return;

    this.dispatchEvent(
      new CustomEvent('point-select', {
        detail,
        bubbles: true,
        composed: true
      })
    );

    this.dispatchEvent(
      new CustomEvent('ui-point-select', {
        detail,
        bubbles: true,
        composed: true
      })
    );
  }

  private _indexFromTarget(target: EventTarget | null): number | null {
    const el = target instanceof Element ? (target.closest('[data-point-index]') as HTMLElement | null) : null;
    if (!el) return null;
    const index = Number(el.getAttribute('data-point-index'));
    if (!Number.isInteger(index) || index < 0) return null;
    return index;
  }

  private _setActiveIndex(index: number | null, pinned: boolean): void {
    this._activeIndex = index;
    this._activePinned = pinned;
    this.requestRender();
  }

  private _focusIndex(index: number): void {
    const target = this.root.querySelector(
      `.legend-item[data-point-index="${index}"]`
    ) as HTMLButtonElement | null;
    if (!target) return;
    try {
      target.focus({ preventScroll: true });
    } catch {
      target.focus();
    }
  }

  private _onPointerOver(event: PointerEvent): void {
    if (!this._isInteractive() || this._activePinned) return;
    const idx = this._indexFromTarget(event.target);
    if (idx == null || this._activeIndex === idx) return;
    this._activeIndex = idx;
    this.requestRender();
  }

  private _onPointerLeave(): void {
    if (!this._isInteractive() || this._activePinned || this._activeIndex == null) return;
    this._activeIndex = null;
    this.requestRender();
  }

  private _onFocusIn(event: FocusEvent): void {
    if (!this._isInteractive()) return;
    const idx = this._indexFromTarget(event.target);
    if (idx == null || this._activeIndex === idx) return;
    this._activeIndex = idx;
    this.requestRender();
  }

  private _onClick(event: MouseEvent): void {
    if (!this._isInteractive()) return;

    const data = this._data();
    if (!data.labels.length || !data.series.length) return;

    const idx = this._indexFromTarget(event.target);
    if (idx == null || idx >= data.labels.length) return;

    const nextPinned = !(this._activePinned && this._activeIndex === idx);
    this._activeIndex = idx;
    this._activePinned = nextPinned;
    this.requestRender();
    this._emitPointSelect(idx, data, 'pointer');
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (!this._isInteractive()) return;

    const data = this._data();
    if (!data.labels.length || !data.series.length) return;

    const targetIndex = this._indexFromTarget(event.target);
    const current = targetIndex ?? this._activeIndex ?? 0;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = clamp(current + 1, 0, data.labels.length - 1);
      this._setActiveIndex(next, true);
      this._focusIndex(next);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = clamp(current - 1, 0, data.labels.length - 1);
      this._setActiveIndex(next, true);
      this._focusIndex(next);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this._setActiveIndex(0, true);
      this._focusIndex(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      const last = data.labels.length - 1;
      this._setActiveIndex(last, true);
      this._focusIndex(last);
      return;
    }

    if (event.key === 'Escape') {
      if (!this._activePinned && this._activeIndex == null) return;
      event.preventDefault();
      this._setActiveIndex(null, false);
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    const idx = clamp(current, 0, data.labels.length - 1);
    this._setActiveIndex(idx, true);
    this._emitPointSelect(idx, data, 'keyboard');
  }

  private _axisXLabels(labels: string[]): string[] {
    if (labels.length <= 8) return labels.map(() => 'visible');
    const interval = Math.max(1, Math.ceil(labels.length / 6));
    return labels.map((_label, index) => {
      if (index === 0 || index === labels.length - 1 || index % interval === 0) return 'visible';
      return 'hidden';
    });
  }

  private _buildCartesianTicks(min: number, max: number): string[] {
    return [1, 0.75, 0.5, 0.25, 0].map((ratio) => this._formatValue(min + (max - min) * ratio));
  }

  private _plotCartesian(
    data: NormalizedChartData,
    type: 'line' | 'area' | 'step' | 'scatter' | 'bar',
    activeIndex: number | null
  ): PlotRender {
    const width = 220;
    const height = 64;
    const padL = 8;
    const padR = 4;
    const padT = 6;
    const padB = 10;
    const axisW = width - padL - padR;
    const axisH = height - padT - padB;
    const labels = data.labels;
    const series = data.series;
    const includeZero = type === 'bar';
    const values = series.flatMap((entry) => entry.data.map((point) => point.value));
    const domain = this._valueDomain(values.map((value, index) => ({ label: String(index), value })), { includeZero });
    const min = domain.min;
    const max = domain.max;
    const span = domain.span;
    const step = labels.length > 1 ? axisW / (labels.length - 1) : 0;

    const baselineValue = domain.zeroInDomain ? 0 : min;
    const baselineY = padT + ((max - baselineValue) / span) * axisH;
    const gridLines = [0, 0.25, 0.5, 0.75, 1]
      .map((stepValue) => {
        const y = padT + axisH * stepValue;
        const strong = domain.zeroInDomain && Math.abs(y - baselineY) < 0.5;
        return `<line x1="${padL}" y1="${y.toFixed(2)}" x2="${(padL + axisW).toFixed(2)}" y2="${y.toFixed(2)}" stroke="var(--ui-chart-grid)" stroke-width="${strong ? '0.75' : '0.45'}" />`;
      })
      .join('');
    const lookup = series.map((entry) => new Map(entry.data.map((point) => [point.label, point])));
    const anchors = labels.map((label, index) => {
      const x = padL + step * index;
      const yValues = lookup
        .map((map) => map.get(label))
        .filter((point): point is ChartPoint => !!point)
        .map((point) => padT + ((max - point.value) / span) * axisH);
      const y = yValues.length ? Math.min(...yValues) : padT + axisH / 2;
      return {
        xPct: clamp((x / width) * 100, 0, 100),
        yPct: clamp((y / height) * 100, 0, 100)
      };
    });

    const hits = labels
      .map((label, index) => {
        const anchor = anchors[index];
        const active = activeIndex === index;
        return `<button type="button" class="plot-hit" data-role="plot-hit" data-point-index="${index}" data-active="${active ? 'true' : 'false'}" style="--x:${anchor.xPct.toFixed(3)};--y:${anchor.yPct.toFixed(3)};" aria-label="${escapeHtml(label)}" ${this._isInteractive() ? '' : 'disabled'}></button>`;
      })
      .join('');

    if (type === 'bar') {
      const band = axisW / Math.max(1, labels.length);
      const slotWidth = clamp(band * 0.82, 6, 22);
      const groupWidth = slotWidth / Math.max(1, series.length);
      const bars = series
        .map((entry, seriesIndex) => {
          const seriesTone = this._seriesTone(entry, seriesIndex);
          return labels
            .map((label, index) => {
              const point = lookup[seriesIndex].get(label);
              if (!point) return '';
              const x = padL + index * band + (band - slotWidth) / 2 + groupWidth * seriesIndex;
              const yValue = padT + ((max - point.value) / span) * axisH;
              const y = Math.min(yValue, baselineY);
              const heightValue = Math.max(1, Math.abs(baselineY - yValue));
              const active = activeIndex === index;
              const opacity = activeIndex == null || active ? entry.opacity ?? 1 : 0.72;
              return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${Math.max(2, groupWidth - 1).toFixed(2)}" height="${heightValue.toFixed(2)}" rx="1.4" fill="${seriesTone}" opacity="${opacity}" />`;
            })
            .join('');
        })
        .join('');

      return {
        svg: `
          <svg class="plot" part="plot" viewBox="0 0 ${width} ${height}" width="100%" height="100%" role="img" aria-label="${escapeHtml(this._ariaLabel())}" preserveAspectRatio="none">
            <g class="plot-grid">${gridLines}</g>
            ${bars}
          </svg>
        `,
        hits,
        anchors,
        yTicks: this._buildCartesianTicks(min, max)
      };
    }

    const renderSeries = series
      .map((entry, seriesIndex) => {
        const seriesTone = this._seriesTone(entry, seriesIndex);
        const mapped = labels.map((label, index) => {
          const point = lookup[seriesIndex].get(label) || null;
          const x = padL + step * index;
          const y = point ? padT + ((max - point.value) / span) * axisH : null;
          return { x, y, point, index };
        });

        const segments: Array<Array<{ x: number; y: number; point: ChartPoint; index: number }>> = [];
        let current: Array<{ x: number; y: number; point: ChartPoint; index: number }> = [];
        mapped.forEach((item) => {
          if (!item.point || item.y == null) {
            if (current.length) segments.push(current);
            current = [];
            return;
          }
          current.push({ x: item.x, y: item.y, point: item.point, index: item.index });
        });
        if (current.length) segments.push(current);

        const pathForSegment = (segment: Array<{ x: number; y: number }>) =>
          segment
            .map((item, index) => {
              if (index === 0) return `M${item.x.toFixed(2)} ${item.y.toFixed(2)}`;
              if (type === 'step') return `H${item.x.toFixed(2)} V${item.y.toFixed(2)}`;
              return `L${item.x.toFixed(2)} ${item.y.toFixed(2)}`;
            })
            .join(' ');

        const fills = type === 'area'
          ? segments
              .map((segment) => {
                const fillEnabled = typeof entry.fill === 'boolean' ? entry.fill : seriesIndex === 0;
                if (!fillEnabled) return '';
                const path = pathForSegment(segment);
                const first = segment[0];
                const last = segment[segment.length - 1];
                return `<path d="${path} L ${last.x.toFixed(2)} ${baselineY.toFixed(2)} L ${first.x.toFixed(2)} ${baselineY.toFixed(2)} Z" fill="color-mix(in srgb, ${seriesTone} 18%, transparent)" opacity="${entry.opacity ?? (seriesIndex === 0 ? 1 : 0.65)}" />`;
              })
              .join('')
          : '';

        const strokePaths = type === 'scatter'
          ? ''
          : segments
              .map((segment) => {
                const path = pathForSegment(segment);
                return `<path d="${path}" fill="none" stroke="${seriesTone}" stroke-width="${(entry.strokeWidth || (seriesIndex === 0 ? 1.9 : 1.55)).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" ${entry.dash ? `stroke-dasharray="${escapeHtml(entry.dash)}"` : ''} opacity="${entry.opacity ?? 1}" />`;
              })
              .join('');

        const circles = mapped
          .map((item) => {
            if (!item.point || item.y == null) return '';
            const active = activeIndex === item.index;
            const radius = active ? 2.35 : 1.6;
            const opacity = activeIndex == null || active ? entry.opacity ?? 1 : 0.72;
            return `<circle cx="${item.x.toFixed(2)}" cy="${item.y.toFixed(2)}" r="${radius.toFixed(2)}" fill="${this._pointTone(item.point, item.index, seriesTone)}" opacity="${opacity}" />`;
          })
          .join('');

        return `${fills}${strokePaths}${circles}`;
      })
      .join('');

    return {
      svg: `
        <svg class="plot" part="plot" viewBox="0 0 ${width} ${height}" width="100%" height="100%" role="img" aria-label="${escapeHtml(this._ariaLabel())}" preserveAspectRatio="none">
          <g class="plot-grid">${gridLines}</g>
          ${renderSeries}
        </svg>
      `,
      hits,
      anchors,
      yTicks: this._buildCartesianTicks(min, max)
    };
  }

  private _plotRadial(points: ChartPoint[], activeIndex: number | null): PlotRender {
    const size = 64;
    const cx = 32;
    const cy = 32;
    const inner = 10;
    const outer = 28;
    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(1, max - min);

    const mapped = points.map((point, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / points.length;
      const normalized = (point.value - min) / span;
      const radius = inner + normalized * (outer - inner);
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      return { x, y, point, index, angle };
    });

    const polygonPath = mapped
      .map((item, index) => `${index === 0 ? 'M' : 'L'}${item.x.toFixed(2)} ${item.y.toFixed(2)}`)
      .join(' ') + ' Z';

    const gridRings = [0.25, 0.5, 0.75, 1]
      .map((ratio) => `<circle cx="${cx}" cy="${cy}" r="${(inner + ratio * (outer - inner)).toFixed(2)}" fill="none" stroke="var(--ui-chart-grid)" stroke-width="0.45" />`)
      .join('');

    const spokes = mapped
      .map((item) => `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(item.angle) * outer).toFixed(2)}" y2="${(cy + Math.sin(item.angle) * outer).toFixed(2)}" stroke="var(--ui-chart-grid)" stroke-width="0.45" />`)
      .join('');

    const pointsMarkup = mapped
      .map((item) => {
        const tone = this._pointTone(item.point, item.index);
        const active = activeIndex === item.index;
        return `<circle cx="${item.x.toFixed(2)}" cy="${item.y.toFixed(2)}" r="${active ? '2.35' : '1.85'}" fill="${tone}" opacity="${activeIndex == null || active ? '1' : '0.74'}" />`;
      })
      .join('');

    const hits = mapped
      .map((item) => {
        const xPct = clamp((item.x / size) * 100, 0, 100).toFixed(3);
        const yPct = clamp((item.y / size) * 100, 0, 100).toFixed(3);
        const active = activeIndex === item.index;
        const label = `${item.point.label}: ${this._formatValue(item.point.value)}`;
        return `<button type="button" class="plot-hit" data-role="plot-hit" data-point-index="${item.index}" data-active="${active ? 'true' : 'false'}" style="--x:${xPct};--y:${yPct};" aria-label="${escapeHtml(label)}" ${this._isInteractive() ? '' : 'disabled'}></button>`;
      })
      .join('');

    return {
      svg: `
        <svg class="plot" part="plot" viewBox="0 0 ${size} ${size}" width="100%" height="100%" role="img" aria-label="${escapeHtml(this._ariaLabel())}" preserveAspectRatio="xMidYMid meet">
          ${gridRings}
          ${spokes}
          <path d="${polygonPath}" fill="color-mix(in srgb, var(--ui-chart-accent) 16%, transparent)" stroke="var(--ui-chart-accent)" stroke-width="1.2" />
          ${pointsMarkup}
        </svg>
      `,
      hits,
      anchors: mapped.map((item) => ({
        xPct: clamp((item.x / size) * 100, 0, 100),
        yPct: clamp((item.y / size) * 100, 0, 100)
      })),
      yTicks: []
    };
  }

  private _plotDonut(points: ChartPoint[], activeIndex: number | null): PlotRender {
    const positiveTotal = points.reduce((sum, point) => sum + Math.max(0, point.value), 0);
    const total = Math.max(1, positiveTotal);

    const radius = 18;
    const stroke = 7;
    const centerX = 32;
    const centerY = 32;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;

    const slices = points
      .map((point, index) => {
        const normalized = Math.max(0, point.value);
        const ratio = normalized / total;
        const length = ratio * circumference;
        const tone = this._pointTone(point, index);
        const active = activeIndex === index;
        const opacity = activeIndex == null || active ? '1' : '0.7';

        const fragment = `
          <circle
            cx="${centerX}"
            cy="${centerY}"
            r="${radius}"
            fill="none"
            stroke="${tone}"
            stroke-width="${active ? stroke + 0.8 : stroke}"
            stroke-dasharray="${length.toFixed(3)} ${(circumference - length).toFixed(3)}"
            stroke-dashoffset="${(-offset).toFixed(3)}"
            transform="rotate(-90 ${centerX} ${centerY})"
            stroke-linecap="round"
            opacity="${opacity}"
          />
        `;

        offset += length;
        return fragment;
      })
      .join('');

    let running = 0;
    const hits = points
      .map((point, index) => {
        const normalized = Math.max(0, point.value);
        const ratio = normalized / total;
        const sweep = ratio * Math.PI * 2;
        const mid = -Math.PI / 2 + running + sweep / 2;
        const x = centerX + Math.cos(mid) * (radius + 6);
        const y = centerY + Math.sin(mid) * (radius + 6);
        running += sweep;

        const xPct = clamp((x / 64) * 100, 0, 100).toFixed(3);
        const yPct = clamp((y / 64) * 100, 0, 100).toFixed(3);
        const active = activeIndex === index;
        const pct = total > 0 ? (normalized / total) * 100 : 0;
        const label = `${point.label}: ${this._formatValue(point.value)} (${this._formatValue(pct, { maximumFractionDigits: 1 })}%)`;
        return `<button type="button" class="plot-hit" data-role="plot-hit" data-point-index="${index}" data-active="${active ? 'true' : 'false'}" style="--x:${xPct};--y:${yPct};" aria-label="${escapeHtml(label)}" ${this._isInteractive() ? '' : 'disabled'}></button>`;
      })
      .join('');

    return {
      svg: `
        <svg class="plot" part="plot" viewBox="0 0 64 64" width="100%" height="100%" role="img" aria-label="${escapeHtml(this._ariaLabel())}" preserveAspectRatio="xMidYMid meet">
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="var(--ui-chart-grid)" stroke-width="${stroke}" />
          ${slices}
          <text x="${centerX}" y="30" text-anchor="middle" font-size="4.5" fill="var(--ui-chart-muted)">Total</text>
          <text x="${centerX}" y="36" text-anchor="middle" font-size="6" font-weight="700" fill="var(--ui-chart-text)">${escapeHtml(this._formatValue(positiveTotal))}</text>
        </svg>
      `,
      hits,
      anchors: points.map((_point, index) => {
        let runningSweep = 0;
        for (let cursor = 0; cursor <= index; cursor += 1) {
          const normalized = Math.max(0, points[cursor].value);
          const ratio = normalized / total;
          const sweep = ratio * Math.PI * 2;
          if (cursor === index) {
            const mid = -Math.PI / 2 + runningSweep + sweep / 2;
            const x = centerX + Math.cos(mid) * (radius + 6);
            const y = centerY + Math.sin(mid) * (radius + 6);
            return {
              xPct: clamp((x / 64) * 100, 0, 100),
              yPct: clamp((y / 64) * 100, 0, 100)
            };
          }
          runningSweep += sweep;
        }
        return { xPct: 50, yPct: 50 };
      }),
      yTicks: []
    };
  }

  private _plot(data: NormalizedChartData, type: ChartKind, activeIndex: number | null): PlotRender {
    const primary = this._primarySeries(data);
    if (!primary) return { svg: '', hits: '', anchors: [], yTicks: [] };
    if (type === 'donut') return this._plotDonut(primary.data, activeIndex);
    if (type === 'radial') return this._plotRadial(primary.data, activeIndex);
    return this._plotCartesian(data, type, activeIndex);
  }

  private _ariaLabel(): string {
    const title = this.getAttribute('title') || 'Chart';
    return this.getAttribute('aria-label') || title;
  }

  private _hasToolbarSlot(): boolean {
    return !!this.querySelector('[slot="header"]');
  }

  private _hasSlot(name: string): boolean {
    return !!this.querySelector(`[slot="${name}"]`);
  }

  private _tooltipMarkup(data: NormalizedChartData, plot: PlotRender): string {
    const idx = this._activeIndex;
    if (idx == null || !plot.anchors[idx]) return '';
    const label = data.labels[idx];
    if (!label) return '';
    const values = this._seriesValueDetails(data.labels, data.series, idx).filter((entry) => entry.value != null);
    if (!values.length) return '';
    const anchor = plot.anchors[idx];
    return `
      <div class="tooltip" part="tooltip" style="--x:${anchor.xPct.toFixed(3)};--y:${anchor.yPct.toFixed(3)};">
        <div class="tooltip-title">${escapeHtml(label)}</div>
        <div class="tooltip-list">
          ${values
            .map(
              (entry) => `
                <div class="tooltip-row">
                  <span class="tooltip-dot" style="--dot:${entry.tone || 'var(--ui-chart-accent)'};"></span>
                  <span class="tooltip-series">${escapeHtml(entry.series)}</span>
                  <span class="tooltip-value">${escapeHtml(this._formatValue(entry.value || 0))}</span>
                </div>
              `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  private _activeInsight(data: NormalizedChartData): string {
    const primary = this._primarySeries(data);
    if (!primary) return '';
    const idx = this._activeIndex;
    if (idx == null || !data.labels[idx]) {
      const stats = this._resolveStats(primary.data);
      const trendTone = stats.delta > 0 ? 'up' : stats.delta < 0 ? 'down' : 'flat';
      const trend = `${stats.delta >= 0 ? '+' : ''}${this._formatValue(stats.delta)}${
        stats.deltaPct == null ? '' : ` (${stats.deltaPct >= 0 ? '+' : ''}${this._formatValue(stats.deltaPct, { maximumFractionDigits: 1 })}%)`
      }`;
      return `
        <div class="insight" part="insight">
          <span>Range <strong>${this._formatValue(stats.min)}</strong> to <strong>${this._formatValue(stats.max)}</strong></span>
          <strong data-tone="${trendTone}">${escapeHtml(trend)}</strong>
        </div>
      `;
    }

    const label = data.labels[idx];
    const values = this._seriesValueDetails(data.labels, data.series, idx).filter((entry) => entry.value != null);
    const total = values.reduce((sum, entry) => sum + (entry.value || 0), 0);
    return `
      <div class="insight" part="insight">
        <span>Selected <strong>${escapeHtml(label)}</strong></span>
        <strong>${escapeHtml(this._formatValue(data.series.length > 1 ? total : values[0]?.value || 0))}</strong>
      </div>
    `;
  }

  protected override render(): void {
    const data = this._data();
    const primary = this._primarySeries(data);
    const type = this._type();
    const state = this._state();
    const disabled = this._isDisabled();
    const interactive = this._isInteractive();
    const title = (this.getAttribute('title') || '').trim();
    const subtitle = (this.getAttribute('subtitle') || '').trim();
    const showLegend = this._showLegend();
    const showSummary = this._showSummary();
    const hasToolbar = this._hasToolbarSlot();
    const hasTitleSlot = this._hasSlot('title');
    const hasSubtitleSlot = this._hasSlot('subtitle');
    const headerVisible = hasTitleSlot || hasSubtitleSlot || !!title || !!subtitle || state !== 'idle';

    if (!primary || !data.labels.length) {
      const message = state === 'error' ? 'Chart data failed to load' : 'No series data available';
      this.setContent(`
        <style>${style}</style>
        <section class="frame" part="frame" data-state="${state}" data-disabled="${disabled ? 'true' : 'false'}" aria-disabled="${disabled ? 'true' : 'false'}">
          <div class="toolbar" part="toolbar" ${hasToolbar ? '' : 'hidden'}>
            <slot name="header"></slot>
          </div>
          <header class="header" part="header" ${headerVisible ? '' : 'hidden'}>
            <div class="meta">
              ${hasTitleSlot ? '<slot class="title-slot" name="title"></slot>' : title ? `<h3 class="title" part="title">${escapeHtml(title)}</h3>` : ''}
              ${hasSubtitleSlot ? '<slot class="subtitle-slot" name="subtitle"></slot>' : subtitle ? `<p class="subtitle" part="subtitle">${escapeHtml(subtitle)}</p>` : ''}
            </div>
            <span class="status-pill" data-state="${state}">${statusText(state)}</span>
          </header>
          <div class="empty" part="empty">${escapeHtml(message)}</div>
        </section>
      `);
      return;
    }

    if (this._activeIndex != null && (this._activeIndex < 0 || this._activeIndex >= data.labels.length)) {
      this._activeIndex = null;
      this._activePinned = false;
    }

    const stats = this._resolveStats(primary.data);
    const plot = this._plot(data, type, this._activeIndex);
    const xVisibility = this._axisXLabels(data.labels);

    const legend = data.series.length > 1
      ? data.series
          .map(
            (entry, index) => `
              <div class="legend-item" aria-label="${escapeHtml(entry.name)}">
                <span class="legend-dot" style="--dot:${this._seriesTone(entry, index)};"></span>
                <span>${escapeHtml(entry.name)}</span>
              </div>
            `
          )
          .join('')
      : primary.data
          .map((point, index) => {
            const active = this._activeIndex === index;
            const tone = this._pointTone(point, index);
            const label = `${point.label}: ${this._formatValue(point.value)}`;
            return `
              <button
                type="button"
                class="legend-item"
                data-role="legend-item"
                data-point-index="${index}"
                data-active="${active ? 'true' : 'false'}"
                aria-label="${escapeHtml(label)}"
                ${interactive ? '' : 'disabled'}
              >
                <span class="legend-dot" style="--dot:${tone};"></span>
                <span>${escapeHtml(point.label)}</span>
              </button>
            `;
          })
          .join('');

    const deltaTone = stats.delta > 0 ? 'up' : stats.delta < 0 ? 'down' : 'flat';
    const deltaText = `${stats.delta >= 0 ? '+' : ''}${this._formatValue(stats.delta)}`;

    const stateMessage =
      state === 'error'
        ? '<div class="message" part="message" data-tone="error">Data source returned partial metrics. Review upstream mapping.</div>'
        : state === 'success'
          ? '<div class="message" part="message" data-tone="success">Data pipeline healthy. All metrics are up to date.</div>'
          : '';

    this.setContent(`
      <style>${style}</style>
      <section
        class="frame"
        part="frame"
        data-state="${state}"
        data-disabled="${disabled ? 'true' : 'false'}"
        aria-disabled="${disabled ? 'true' : 'false'}"
      >
        <div class="sr-only" aria-live="polite">${escapeHtml(title)} ${escapeHtml(statusText(state))}</div>

        <div class="toolbar" part="toolbar" ${hasToolbar ? '' : 'hidden'}>
          <slot name="header"></slot>
        </div>

        <header class="header" part="header" ${headerVisible ? '' : 'hidden'}>
          <div class="meta">
            ${hasTitleSlot ? '<slot class="title-slot" name="title"></slot>' : title ? `<h3 class="title" part="title">${escapeHtml(title)}</h3>` : ''}
            ${hasSubtitleSlot ? '<slot class="subtitle-slot" name="subtitle"></slot>' : subtitle ? `<p class="subtitle" part="subtitle">${escapeHtml(subtitle)}</p>` : ''}
          </div>
          <span class="status-pill" data-state="${state}">${statusText(state)}</span>
        </header>

        ${showSummary ? `
          <section class="summary" part="summary">
            <div class="metric" part="metric">
              <span class="metric-label">Total</span>
              <span class="metric-value">${escapeHtml(this._formatValue(stats.total))}</span>
            </div>
            <div class="metric" part="metric">
              <span class="metric-label">Average</span>
              <span class="metric-value">${escapeHtml(this._formatValue(stats.average))}</span>
            </div>
            <div class="metric" part="metric">
              <span class="metric-label">Peak</span>
              <span class="metric-value">${escapeHtml(this._formatValue(stats.max))}</span>
            </div>
            <div class="metric" part="metric">
              <span class="metric-label">Delta</span>
              <span class="metric-value" data-tone="${deltaTone}">${escapeHtml(deltaText)}</span>
            </div>
          </section>
        ` : ''}

        <section class="plot-shell" part="plot-shell">
          <div class="plot-body">
            ${type === 'donut' || type === 'radial' ? '' : `
              <div class="axis-y" part="axis-y">
                ${plot.yTicks.map((tick) => `<span>${escapeHtml(tick)}</span>`).join('')}
              </div>
            `}
            <div class="plot-stage">
              ${plot.svg}
              <div class="plot-hit-layer" part="plot-hits">${plot.hits}</div>
              ${this._tooltipMarkup(data, plot)}
              ${state === 'loading' ? '<div class="loading-overlay" part="loading-overlay" aria-hidden="true"></div>' : ''}
            </div>
            ${type === 'donut' || type === 'radial' ? '' : `
              <div class="axis-x" part="axis-x">
                ${data.labels
                  .map(
                    (label, index) => `<span class="axis-x-label" data-hidden="${xVisibility[index] === 'hidden' ? 'true' : 'false'}">${escapeHtml(label)}</span>`
                  )
                  .join('')}
              </div>
            `}
          </div>
        </section>

        ${this._activeInsight(data)}

        ${showLegend ? `<section class="legend" part="legend">${legend}</section>` : ''}

        ${data.truncated > 0 ? `<div class="message" part="message">Showing last ${data.truncated + data.labels.length} records (truncated to ${MAX_POINTS}).</div>` : ''}

        ${stateMessage}
      </section>
    `);
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-chart')) {
  customElements.define('ui-chart', UIChart);
}
