import { ElementBase } from '../ElementBase';

type ChartPoint = { label: string; value: number; tone?: string };
type ChartKind = 'line' | 'area' | 'bar' | 'donut';

const style = `
  :host {
    --ui-chart-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 95%, transparent);
    --ui-chart-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-chart-radius: 14px;
    --ui-chart-text: var(--ui-color-text, #0f172a);
    --ui-chart-muted: var(--ui-color-muted, #64748b);
    --ui-chart-grid: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 46%, transparent);
    --ui-chart-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
    --ui-chart-accent: var(--ui-color-primary, #2563eb);

    color-scheme: light dark;
    display: block;
    min-inline-size: 0;
    box-sizing: border-box;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .frame {
    border: 1px solid var(--ui-chart-border);
    border-radius: var(--ui-chart-radius);
    background: var(--ui-chart-bg);
    color: var(--ui-chart-text);
    box-shadow: var(--ui-chart-shadow);
    padding: 12px;
    display: grid;
    gap: 10px;
  }

  :host([variant="minimal"]) .frame {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }

  :host([variant="contrast"]) {
    --ui-chart-bg: #0f172a;
    --ui-chart-border: #334155;
    --ui-chart-text: #e2e8f0;
    --ui-chart-muted: #93a4bd;
    --ui-chart-grid: #334155;
    --ui-chart-shadow: 0 22px 46px rgba(2, 6, 23, 0.34);
    --ui-chart-accent: #93c5fd;
  }

  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
  }

  .title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  .subtitle {
    font-size: 12px;
    color: var(--ui-chart-muted);
  }

  .plot {
    inline-size: 100%;
    min-block-size: 140px;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    font-size: 12px;
    color: var(--ui-chart-muted);
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .legend-dot {
    inline-size: 8px;
    block-size: 8px;
    border-radius: 999px;
    background: var(--dot, var(--ui-chart-accent));
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--dot, var(--ui-chart-accent)) 35%, transparent);
  }

  .empty {
    color: var(--ui-chart-muted);
    font-size: 12px;
    text-align: center;
    padding: 20px 10px;
  }

  :host([headless]) .frame {
    display: none;
  }

  @media (prefers-contrast: more) {
    .frame {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .frame,
    .legend-dot {
      transition: none !important;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-chart-bg: Canvas;
      --ui-chart-border: CanvasText;
      --ui-chart-text: CanvasText;
      --ui-chart-muted: CanvasText;
      --ui-chart-grid: CanvasText;
      --ui-chart-accent: Highlight;
      --ui-chart-shadow: none;
    }

    .frame,
    .legend-dot {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
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

function parsePoints(rawData: string | null, rawValues: string | null, rawLabels: string | null): ChartPoint[] {
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed
          .map((entry, index) => {
            if (typeof entry === 'number') {
              return { label: String(index + 1), value: Number(entry) };
            }
            if (entry && typeof entry === 'object') {
              const value = Number((entry as any).value);
              if (!Number.isFinite(value)) return null;
              return {
                label: String((entry as any).label ?? index + 1),
                value,
                tone: typeof (entry as any).tone === 'string' ? (entry as any).tone : undefined
              } as ChartPoint;
            }
            return null;
          })
          .filter(Boolean) as ChartPoint[];
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

  return values.map((value, index) => ({ label: labels[index] || String(index + 1), value }));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export class UIChart extends ElementBase {
  static get observedAttributes() {
    return ['data', 'values', 'labels', 'type', 'variant', 'title', 'subtitle', 'headless'];
  }

  private _points(): ChartPoint[] {
    return parsePoints(this.getAttribute('data'), this.getAttribute('values'), this.getAttribute('labels'));
  }

  private _type(): ChartKind {
    const raw = this.getAttribute('type');
    if (raw === 'line' || raw === 'area' || raw === 'bar' || raw === 'donut') return raw;
    return 'line';
  }

  private _lineLike(points: ChartPoint[], fillArea: boolean): string {
    const w = 100;
    const h = 56;
    const padX = 6;
    const padY = 6;
    const min = Math.min(...points.map((point) => point.value));
    const max = Math.max(...points.map((point) => point.value));
    const span = Math.max(1, max - min);
    const step = points.length > 1 ? (w - padX * 2) / (points.length - 1) : 0;

    const mapped = points.map((point, index) => {
      const x = padX + index * step;
      const normalized = (point.value - min) / span;
      const y = h - padY - normalized * (h - padY * 2);
      return { x, y, point };
    });

    const path = mapped.map((entry, index) => `${index === 0 ? 'M' : 'L'}${entry.x.toFixed(2)} ${entry.y.toFixed(2)}`).join(' ');

    const area = fillArea
      ? `<path d="${path} L ${(w - padX).toFixed(2)} ${(h - padY).toFixed(2)} L ${padX.toFixed(2)} ${(h - padY).toFixed(2)} Z" fill="color-mix(in srgb, var(--ui-chart-accent) 20%, transparent)" />`
      : '';

    const circles = mapped
      .map((entry, index) => `<circle cx="${entry.x.toFixed(2)}" cy="${entry.y.toFixed(2)}" r="1.6" fill="${entry.point.tone || palette[index % palette.length] || 'var(--ui-chart-accent)'}"></circle>`)
      .join('');

    const grid = [14, 28, 42]
      .map((line) => `<line x1="${padX}" y1="${line}" x2="${w - padX}" y2="${line}" stroke="var(--ui-chart-grid)" stroke-width="0.35"></line>`)
      .join('');

    return `
      <svg class="plot" part="plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHtml(this.getAttribute('title') || 'Chart')}" preserveAspectRatio="none">
        ${grid}
        ${area}
        <path d="${path}" fill="none" stroke="var(--ui-chart-accent)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>
        ${circles}
      </svg>
    `;
  }

  private _bars(points: ChartPoint[]): string {
    const w = 100;
    const h = 56;
    const padX = 6;
    const padY = 6;
    const max = Math.max(1, ...points.map((point) => point.value));
    const band = (w - padX * 2) / points.length;
    const barWidth = Math.max(2.6, band * 0.64);

    const bars = points
      .map((point, index) => {
        const height = clamp((point.value / max) * (h - padY * 2), 1, h - padY * 2);
        const x = padX + index * band + (band - barWidth) / 2;
        const y = h - padY - height;
        return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${height.toFixed(2)}" rx="1.5" fill="${point.tone || palette[index % palette.length] || 'var(--ui-chart-accent)'}"></rect>`;
      })
      .join('');

    return `
      <svg class="plot" part="plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHtml(this.getAttribute('title') || 'Chart')}" preserveAspectRatio="none">
        <line x1="${padX}" y1="${h - padY}" x2="${w - padX}" y2="${h - padY}" stroke="var(--ui-chart-grid)" stroke-width="0.4"></line>
        ${bars}
      </svg>
    `;
  }

  private _donut(points: ChartPoint[]): string {
    const total = Math.max(1, points.reduce((sum, point) => sum + Math.max(0, point.value), 0));
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    const slices = points
      .map((point, index) => {
        const pct = Math.max(0, point.value) / total;
        const length = pct * circumference;
        const tone = point.tone || palette[index % palette.length] || 'var(--ui-chart-accent)';
        const fragment = `
          <circle
            cx="26"
            cy="26"
            r="${radius}"
            fill="none"
            stroke="${tone}"
            stroke-width="8"
            stroke-dasharray="${length.toFixed(3)} ${(circumference - length).toFixed(3)}"
            stroke-dashoffset="${(-offset).toFixed(3)}"
            transform="rotate(-90 26 26)"
            stroke-linecap="round"
          />
        `;
        offset += length;
        return fragment;
      })
      .join('');

    return `
      <svg class="plot" part="plot" viewBox="0 0 52 52" role="img" aria-label="${escapeHtml(this.getAttribute('title') || 'Chart')}" preserveAspectRatio="xMidYMid meet">
        <circle cx="26" cy="26" r="${radius}" fill="none" stroke="var(--ui-chart-grid)" stroke-width="8"></circle>
        ${slices}
        <text x="26" y="25" text-anchor="middle" font-size="5" fill="var(--ui-chart-muted)">Total</text>
        <text x="26" y="30.5" text-anchor="middle" font-size="6" font-weight="700" fill="var(--ui-chart-text)">${total.toFixed(0)}</text>
      </svg>
    `;
  }

  protected override render(): void {
    const points = this._points();
    const type = this._type();
    const title = this.getAttribute('title') || 'Chart';
    const subtitle = this.getAttribute('subtitle') || '';

    if (!points.length) {
      this.setContent(`
        <style>${style}</style>
        <section class="frame" part="frame">
          <div class="header"><span class="title">${escapeHtml(title)}</span></div>
          <div class="empty" part="empty">No series data</div>
        </section>
      `);
      return;
    }

    let plot = '';
    if (type === 'bar') plot = this._bars(points);
    else if (type === 'area') plot = this._lineLike(points, true);
    else if (type === 'donut') plot = this._donut(points);
    else plot = this._lineLike(points, false);

    const legend = points
      .map((point, index) => {
        const tone = point.tone || palette[index % palette.length] || 'var(--ui-chart-accent)';
        return `<span class="legend-item"><span class="legend-dot" style="--dot:${tone}"></span>${escapeHtml(point.label)}</span>`;
      })
      .join('');

    this.setContent(`
      <style>${style}</style>
      <section class="frame" part="frame">
        <header class="header" part="header">
          <span class="title" part="title">${escapeHtml(title)}</span>
          ${subtitle ? `<span class="subtitle" part="subtitle">${escapeHtml(subtitle)}</span>` : ''}
        </header>
        ${plot}
        <div class="legend" part="legend">${legend}</div>
      </section>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-chart')) {
  customElements.define('ui-chart', UIChart);
}
