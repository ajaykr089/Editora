import { ElementBase } from '../ElementBase';

type TimelineItem = {
  title: string;
  description?: string;
  time?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

const style = `
  :host {
    --ui-timeline-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 95%, transparent);
    --ui-timeline-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-timeline-text: var(--ui-color-text, #0f172a);
    --ui-timeline-muted: var(--ui-color-muted, #64748b);
    --ui-timeline-accent: var(--ui-color-primary, #2563eb);

    display: block;
    min-inline-size: 0;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .frame {
    border: 1px solid var(--ui-timeline-border);
    border-radius: 14px;
    background: var(--ui-timeline-bg);
    padding: 14px;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  }

  .list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 12px;
  }

  .item {
    display: grid;
    grid-template-columns: 20px minmax(0, 1fr);
    gap: 10px;
    min-inline-size: 0;
  }

  .rail {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .rail::before {
    content: "";
    position: absolute;
    top: 12px;
    bottom: -14px;
    inline-size: 2px;
    background: color-mix(in srgb, var(--ui-timeline-border) 84%, transparent);
  }

  .item:last-child .rail::before {
    display: none;
  }

  .dot {
    inline-size: 10px;
    block-size: 10px;
    margin-top: 3px;
    border-radius: 999px;
    background: var(--dot, var(--ui-timeline-accent));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--dot, var(--ui-timeline-accent)) 20%, transparent);
  }

  .content {
    min-inline-size: 0;
    display: grid;
    gap: 4px;
  }

  .title {
    font-size: 13px;
    font-weight: 600;
    color: var(--ui-timeline-text);
  }

  .time,
  .description {
    font-size: 12px;
    color: var(--ui-timeline-muted);
  }

  :host([headless]) .frame {
    display: none;
  }

  :host([variant="contrast"]) {
    --ui-timeline-bg: #0f172a;
    --ui-timeline-border: #334155;
    --ui-timeline-text: #e2e8f0;
    --ui-timeline-muted: #93a4bd;
    --ui-timeline-accent: #93c5fd;
  }

  @media (prefers-reduced-motion: reduce) {
    .dot {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .frame {
      box-shadow: none;
    }

    .rail::before {
      inline-size: 3px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-timeline-bg: Canvas;
      --ui-timeline-border: CanvasText;
      --ui-timeline-text: CanvasText;
      --ui-timeline-muted: CanvasText;
      --ui-timeline-accent: Highlight;
    }

    .frame,
    .rail::before,
    .dot {
      forced-color-adjust: none;
      box-shadow: none;
    }

    .frame {
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }

    .rail::before {
      background: CanvasText;
    }

    .dot {
      background: Highlight;
    }
  }
`;

const toneMap: Record<string, string> = {
  default: 'var(--ui-color-primary, #2563eb)',
  info: 'var(--ui-color-info, #0891b2)',
  success: 'var(--ui-color-success, #16a34a)',
  warning: 'var(--ui-color-warning, #d97706)',
  danger: 'var(--ui-color-danger, #dc2626)'
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseItems(raw: string | null): TimelineItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== 'object') return null;
        const title = String((entry as any).title || '').trim();
        if (!title) return null;
        return {
          title,
          description: (entry as any).description ? String((entry as any).description) : undefined,
          time: (entry as any).time ? String((entry as any).time) : undefined,
          tone: (entry as any).tone
        } as TimelineItem;
      })
      .filter(Boolean) as TimelineItem[];
  } catch {
    return [];
  }
}

export class UITimeline extends ElementBase {
  static get observedAttributes() {
    return ['items', 'variant', 'headless'];
  }

  protected override render(): void {
    const items = parseItems(this.getAttribute('items'));

    const content = items.length
      ? items
          .map((item) => {
            const tone = toneMap[item.tone || 'default'] || toneMap.default;
            return `
              <li class="item" part="item">
                <div class="rail"><span class="dot" style="--dot:${tone}"></span></div>
                <article class="content">
                  <span class="title">${escapeHtml(item.title)}</span>
                  ${item.time ? `<span class="time">${escapeHtml(item.time)}</span>` : ''}
                  ${item.description ? `<span class="description">${escapeHtml(item.description)}</span>` : ''}
                </article>
              </li>
            `;
          })
          .join('')
      : '<div class="description">No timeline entries</div>';

    this.setContent(`
      <style>${style}</style>
      <section class="frame" part="frame">
        <ol class="list" part="list">${content}</ol>
      </section>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-timeline')) {
  customElements.define('ui-timeline', UITimeline);
}
