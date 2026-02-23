import { ElementBase } from '../ElementBase';

type GanttTask = {
  id?: string;
  label: string;
  start: string;
  end: string;
  progress?: number;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

const style = `
  :host {
    --ui-gantt-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 95%, transparent);
    --ui-gantt-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-gantt-text: var(--ui-color-text, #0f172a);
    --ui-gantt-muted: var(--ui-color-muted, #64748b);
    --ui-gantt-accent: var(--ui-color-primary, #2563eb);

    display: block;
    min-inline-size: 0;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .frame {
    border: 1px solid var(--ui-gantt-border);
    border-radius: 14px;
    background: var(--ui-gantt-bg);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
    padding: 12px;
    display: grid;
    gap: 10px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    color: var(--ui-gantt-muted);
  }

  .rows {
    display: grid;
    gap: 8px;
  }

  .row {
    display: grid;
    grid-template-columns: minmax(110px, 0.4fr) minmax(0, 1fr);
    gap: 10px;
    align-items: center;
  }

  .label {
    font-size: 12px;
    color: var(--ui-gantt-text);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .track {
    position: relative;
    border: 1px solid color-mix(in srgb, var(--ui-gantt-border) 72%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-gantt-bg) 90%, transparent);
    min-block-size: 14px;
  }

  .bar {
    position: absolute;
    top: 1px;
    bottom: 1px;
    border-radius: 999px;
    background: var(--tone, var(--ui-gantt-accent));
    box-shadow: 0 6px 14px color-mix(in srgb, var(--tone, var(--ui-gantt-accent)) 26%, transparent);
    overflow: hidden;
  }

  .progress {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, color-mix(in srgb, #000 18%, transparent), transparent);
    opacity: 0.28;
    width: var(--progress, 0%);
  }

  :host([variant="contrast"]) {
    --ui-gantt-bg: #0f172a;
    --ui-gantt-border: #334155;
    --ui-gantt-text: #e2e8f0;
    --ui-gantt-muted: #93a4bd;
    --ui-gantt-accent: #93c5fd;
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

  @media (prefers-contrast: more) {
    .frame {
      box-shadow: none;
    }

    .track {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-gantt-bg: Canvas;
      --ui-gantt-border: CanvasText;
      --ui-gantt-text: CanvasText;
      --ui-gantt-muted: CanvasText;
      --ui-gantt-accent: Highlight;
    }

    .frame,
    .track,
    .bar,
    .progress {
      forced-color-adjust: none;
      box-shadow: none;
      border-color: CanvasText;
    }

    .frame,
    .track {
      background: Canvas;
      color: CanvasText;
    }

    .bar {
      background: Highlight;
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

function parseDate(value: string): number | null {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function parseTasks(raw: string | null): GanttTask[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== 'object') return null;
        const label = String((entry as any).label || '').trim();
        const start = String((entry as any).start || '').trim();
        const end = String((entry as any).end || '').trim();
        if (!label || !start || !end) return null;
        if (parseDate(start) == null || parseDate(end) == null) return null;
        return {
          id: (entry as any).id ? String((entry as any).id) : undefined,
          label,
          start,
          end,
          progress: Number.isFinite(Number((entry as any).progress)) ? Number((entry as any).progress) : undefined,
          tone: (entry as any).tone
        } as GanttTask;
      })
      .filter(Boolean) as GanttTask[];
  } catch {
    return [];
  }
}

export class UIGantt extends ElementBase {
  static get observedAttributes() {
    return ['tasks', 'variant', 'headless'];
  }

  protected override render(): void {
    const tasks = parseTasks(this.getAttribute('tasks'));
    if (!tasks.length) {
      this.setContent(`
        <style>${style}</style>
        <section class="frame" part="frame">
          <div class="header">No tasks in this range</div>
        </section>
      `);
      return;
    }

    const starts = tasks.map((task) => parseDate(task.start) || 0);
    const ends = tasks.map((task) => parseDate(task.end) || 0);
    const min = Math.min(...starts);
    const max = Math.max(...ends);
    const span = Math.max(1, max - min);

    const rows = tasks
      .map((task) => {
        const start = parseDate(task.start) || min;
        const end = parseDate(task.end) || start;
        const left = ((start - min) / span) * 100;
        const width = Math.max(2, ((Math.max(end, start) - start) / span) * 100);
        const progress = Math.max(0, Math.min(100, Number(task.progress ?? 0)));
        const tone = tones[task.tone || 'default'] || tones.default;

        return `
          <article class="row" part="row">
            <span class="label" title="${task.label}">${task.label}</span>
            <div class="track">
              <div class="bar" style="left:${left.toFixed(2)}%;width:${width.toFixed(2)}%;--tone:${tone}">
                <span class="progress" style="--progress:${progress.toFixed(2)}%"></span>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    const startLabel = new Date(min).toLocaleDateString();
    const endLabel = new Date(max).toLocaleDateString();

    this.setContent(`
      <style>${style}</style>
      <section class="frame" part="frame">
        <header class="header" part="header"><span>${startLabel}</span><span>${endLabel}</span></header>
        <div class="rows" part="rows">${rows}</div>
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-gantt')) {
  customElements.define('ui-gantt', UIGantt);
}
