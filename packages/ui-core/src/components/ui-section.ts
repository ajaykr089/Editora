import { ElementBase } from '../ElementBase';

type SectionSize = 'small' | 'medium' | 'large';
type SectionVariant = 'default' | 'surface' | 'muted' | 'outline' | 'elevated' | 'contrast' | 'gradient';
type SectionTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
type SectionRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type SectionDensity = 'compact' | 'comfortable';

const style = `
  :host {
    display: block;
    width: 100%;
    color-scheme: light dark;

    --ui-section-pad-y: 14px;
    --ui-section-pad-x: 0px;
    --ui-section-radius: 14px;
    --ui-section-bg: transparent;
    --ui-section-text: inherit;
    --ui-section-border: transparent;
    --ui-section-shadow: none;
    --ui-section-accent: var(--ui-color-primary, #2563eb);
  }

  .section {
    width: 100%;
    box-sizing: border-box;
    padding: var(--ui-section-pad-y) var(--ui-section-pad-x);
    border-radius: var(--ui-section-radius);
    background: var(--ui-section-bg);
    color: var(--ui-section-text);
    border: 1px solid var(--ui-section-border);
    box-shadow: var(--ui-section-shadow);
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  :host([size="small"]) {
    --ui-section-pad-y: 8px;
  }

  :host([size="medium"]) {
    --ui-section-pad-y: 14px;
  }

  :host([size="large"]) {
    --ui-section-pad-y: 22px;
  }

  :host([density="compact"]) {
    --ui-section-pad-x: 2px;
  }

  :host([density="comfortable"]) {
    --ui-section-pad-x: 8px;
  }

  :host([radius="none"]) {
    --ui-section-radius: 0px;
  }

  :host([radius="sm"]) {
    --ui-section-radius: 8px;
  }

  :host([radius="md"]) {
    --ui-section-radius: 12px;
  }

  :host([radius="lg"]) {
    --ui-section-radius: 16px;
  }

  :host([radius="xl"]) {
    --ui-section-radius: 24px;
  }

  :host([variant="surface"]) {
    --ui-section-bg: var(--ui-color-surface, #ffffff);
    --ui-section-text: var(--ui-color-text, #0f172a);
    --ui-section-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-section-shadow: 0 1px 2px rgba(2, 6, 23, 0.05);
  }

  :host([variant="muted"]) {
    --ui-section-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 88%, #f8fafc 12%);
    --ui-section-text: var(--ui-color-text, #0f172a);
    --ui-section-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 62%, transparent);
  }

  :host([variant="outline"]) {
    --ui-section-bg: transparent;
    --ui-section-border: color-mix(in srgb, var(--ui-section-accent) 36%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="elevated"]) {
    --ui-section-bg: var(--ui-color-surface, #ffffff);
    --ui-section-text: var(--ui-color-text, #0f172a);
    --ui-section-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 58%, transparent);
    --ui-section-shadow:
      0 1px 3px rgba(2, 6, 23, 0.08),
      0 18px 40px rgba(2, 6, 23, 0.12);
  }

  :host([variant="gradient"]) {
    --ui-section-bg:
      linear-gradient(
        140deg,
        color-mix(in srgb, var(--ui-section-accent) 12%, var(--ui-color-surface, #ffffff)),
        color-mix(in srgb, var(--ui-section-accent) 4%, var(--ui-color-surface, #ffffff))
      );
    --ui-section-text: var(--ui-color-text, #0f172a);
    --ui-section-border: color-mix(in srgb, var(--ui-section-accent) 26%, transparent);
  }

  :host([variant="contrast"]) {
    --ui-section-bg: #0f172a;
    --ui-section-text: #e2e8f0;
    --ui-section-border: #334155;
    --ui-section-shadow: none;
  }

  :host([tone="brand"]) { --ui-section-accent: #2563eb; }
  :host([tone="success"]) { --ui-section-accent: #16a34a; }
  :host([tone="warning"]) { --ui-section-accent: #d97706; }
  :host([tone="danger"]) { --ui-section-accent: #dc2626; }
  :host([tone="info"]) { --ui-section-accent: #0ea5e9; }
  :host([tone="neutral"]) { --ui-section-accent: #64748b; }

  :host([inset]) .section {
    margin-inline: 8px;
  }

  :host([headless]) .section {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .section {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .section {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .section {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

function normalizeSize(raw: string | null): SectionSize {
  if (raw === 'small' || raw === 'large') return raw;
  return 'medium';
}

function normalizeVariant(raw: string | null): SectionVariant {
  if (raw === 'surface' || raw === 'muted' || raw === 'outline' || raw === 'elevated' || raw === 'contrast' || raw === 'gradient') {
    return raw;
  }
  return 'default';
}

function normalizeTone(raw: string | null): SectionTone {
  if (raw === 'brand' || raw === 'success' || raw === 'warning' || raw === 'danger' || raw === 'info') return raw;
  return 'neutral';
}

function normalizeRadius(raw: string | null): SectionRadius {
  if (raw === 'none' || raw === 'sm' || raw === 'lg' || raw === 'xl') return raw;
  return 'md';
}

function normalizeDensity(raw: string | null): SectionDensity {
  return raw === 'compact' ? 'compact' : 'comfortable';
}

export class UISection extends ElementBase {
  static get observedAttributes() {
    return ['size', 'variant', 'tone', 'radius', 'density', 'inset', 'headless'];
  }

  constructor() {
    super();
  }

  protected render(): void {
    const size = normalizeSize(this.getAttribute('size'));
    const variant = normalizeVariant(this.getAttribute('variant'));
    const tone = normalizeTone(this.getAttribute('tone'));
    const radius = normalizeRadius(this.getAttribute('radius'));
    const density = normalizeDensity(this.getAttribute('density'));

    this.setContent(`
      <style>${style}</style>
      <section
        class="section"
        part="section"
        data-size="${size}"
        data-variant="${variant}"
        data-tone="${tone}"
        data-radius="${radius}"
        data-density="${density}"
      >
        <slot></slot>
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-section')) {
  customElements.define('ui-section', UISection);
}
