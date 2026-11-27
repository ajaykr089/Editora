import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';
import { UIQuestion, type QuestionDefinition } from './ui-question';

/**
 * Asks a few questions one at a time: single or multiple choice, free text, or choices plus an
 * "other" answer; required or skippable; conditional on earlier answers. Built for an agent that
 * clarifies a task before starting, and for short onboarding flows.
 *
 *   <ui-questionnaire shortcuts>
 *     <ui-question name="scope" label="What should I build?" required>
 *       <option value="web">A web app</option>
 *       <option value="api">An API</option>
 *     </ui-question>
 *     <ui-question name="auth" label="Which sign-in?" type="multiple" when="scope:web">…</ui-question>
 *     <ui-question name="notes" label="Anything else?" type="text"></ui-question>
 *     <p slot="complete">Thanks, starting now.</p>
 *   </ui-questionnaire>
 *
 * Questions come from question children (see ui-question.ts) or the `items` property. Each
 * question is a fieldset whose legend is its label, so screen readers read the question with its
 * choices; choices are native radios or checkboxes. After moving on, focus goes to the new
 * question; after a failed check it goes to the first answer, which is marked aria-invalid and
 * described by the error. `shortcuts` lets 1-9 pick a choice and Enter go on, outside text fields.
 *
 * Properties: `values` (answers by name: a string, or an array for multiple choice; settable to
 * resume), `items`, `activeIndex`. Methods: next(), previous(), skip(), goTo(name), reset(),
 * toFormData(). Events: `change` (detail: { name, value, values }), `step` (detail: { name,
 * index, total }), `submit` (detail: { values }; on the element only, it does not bubble;
 * cancelable: preventDefault keeps it open).
 * Attributes: `shortcuts`, `completed` (shows the `complete` slot), and the texts `back-label`,
 * `next-label`, `skip-label`, `submit-label`, `other-label`, `required-message`, `progress-label`
 * ("Question {current} of {total}").
 */
const style = `
  :host {
    --ui-questionnaire-accent: var(--ui-color-primary, #2563eb);
    --ui-questionnaire-border: var(--ui-color-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 14%, transparent));
    color-scheme: light dark;
    display: block;
    min-inline-size: 0;
    color: var(--ui-color-text, #0f172a);
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
    font-size: var(--ui-font-size-md, 0.875rem);
    line-height: 1.5;
  }
  :host([hidden]) { display: none; }

  .root { display: grid; gap: 14px; }

  .progress { display: grid; gap: 6px; color: var(--ui-color-muted, #526175); font-size: 0.75rem; }
  .track { block-size: 4px; border-radius: 999px; background: color-mix(in srgb, var(--ui-questionnaire-accent) 14%, transparent); overflow: hidden; }
  .fill { block-size: 100%; inline-size: var(--ui-questionnaire-progress, 0%); background: var(--ui-questionnaire-accent); border-radius: inherit; transition: inline-size 200ms ease; }

  fieldset {
    display: grid;
    gap: 10px;
    min-inline-size: 0;
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
  }
  fieldset:focus-visible legend { text-decoration: underline; text-underline-offset: 3px; }
  legend {
    padding: 0;
    color: var(--ui-color-text-strong, var(--ui-color-text, #0f172a));
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
  }
  .required { color: var(--ui-color-danger-text, var(--ui-color-danger, #b91c1c)); margin-inline-start: 2px; }
  .description { margin: 0; color: var(--ui-color-muted, #526175); font-size: var(--ui-font-size-sm, 0.8125rem); }

  .choices { display: grid; gap: 6px; }
  .choice {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 9px 12px;
    border: 1px solid var(--ui-questionnaire-border);
    border-radius: var(--ui-radius, 8px);
    background: var(--ui-color-surface, #ffffff);
    cursor: pointer;
    transition: border-color 120ms ease, background-color 120ms ease;
  }
  .choice:hover { border-color: var(--ui-color-line-strong, color-mix(in srgb, var(--ui-color-text, #0f172a) 28%, transparent)); }
  .choice:has(input:checked) {
    border-color: var(--ui-questionnaire-accent);
    background: color-mix(in srgb, var(--ui-questionnaire-accent) 7%, var(--ui-color-surface, #ffffff));
  }
  .choice:has(input:disabled) { opacity: 0.55; cursor: not-allowed; }
  .choice:has(input:focus-visible) {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: 1px;
  }
  .choice input { margin: 3px 0 0; accent-color: var(--ui-questionnaire-accent); flex: none; }
  .choice-text { display: grid; gap: 1px; flex: 1 1 auto; min-inline-size: 0; }
  .choice-description { color: var(--ui-color-muted, #526175); font-size: 0.75rem; }
  .key {
    flex: none;
    min-inline-size: 18px;
    padding: 0 4px;
    border: 1px solid var(--ui-questionnaire-border);
    border-radius: 4px;
    color: var(--ui-color-muted, #526175);
    font: 500 0.6875rem/18px var(--ui-font-family-mono, ui-monospace, Menlo, monospace);
    text-align: center;
  }

  .text-field { display: grid; gap: 4px; }
  .text-field label { color: var(--ui-color-muted, #526175); font-size: 0.75rem; }
  textarea, input[type="text"] {
    box-sizing: border-box;
    inline-size: 100%;
    padding: 8px 10px;
    border: 1px solid var(--ui-color-field-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 40%, var(--ui-color-surface, #ffffff)));
    border-radius: var(--ui-control-radius-2, 6px);
    background: var(--ui-color-surface, #ffffff);
    color: inherit;
    font: inherit;
  }
  textarea { min-block-size: 76px; resize: vertical; }
  textarea:focus-visible, input[type="text"]:focus-visible {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: -1px;
    border-color: transparent;
  }
  [aria-invalid="true"] { border-color: var(--ui-color-danger, #dc2626) !important; }

  .error {
    margin: 0;
    color: var(--ui-color-danger-text, var(--ui-color-danger, #b91c1c));
    font-size: var(--ui-font-size-sm, 0.8125rem);
  }
  .error[hidden] { display: none; }

  .actions { display: flex; align-items: center; gap: 8px; }
  .spacer { flex: 1 1 auto; }
  .actions button {
    min-block-size: var(--ui-control-height-2, 32px);
    padding: 0 14px;
    border: 1px solid var(--ui-questionnaire-border);
    border-radius: var(--ui-control-radius-2, 6px);
    background: var(--ui-color-surface, #ffffff);
    color: var(--ui-color-text, #0f172a);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
  }
  .actions button.primary {
    border-color: transparent;
    background: var(--ui-questionnaire-accent);
    color: var(--ui-color-foreground-on-primary, #ffffff);
  }
  .actions button.quiet { border-color: transparent; background: transparent; color: var(--ui-color-muted, #526175); }
  .actions button:hover { filter: brightness(0.97); }
  .actions button:focus-visible {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: 2px;
  }
  .actions button[hidden] { display: none; }

  .complete[hidden], .main[hidden] { display: none; }
  .sr { position: absolute; inline-size: 1px; block-size: 1px; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  slot[hidden] { display: none; }

  @media (prefers-reduced-motion: reduce) { .fill, .choice { transition: none; } }
  @media (forced-colors: active) {
    .choice:has(input:checked) { border-color: Highlight; }
    .fill { background: Highlight; }
  }
`;

export type QuestionnaireValue = string | string[];
export type QuestionnaireValues = Record<string, QuestionnaireValue>;

function isEmpty(value: QuestionnaireValue | undefined): boolean {
  if (value == null) return true;
  if (Array.isArray(value)) return value.filter((item) => item.trim() !== '').length === 0;
  return value.trim() === '';
}

const OTHER = '__other__';

export class UIQuestionnaire extends ElementBase {
  static get observedAttributes() {
    return ['shortcuts', 'completed', 'back-label', 'next-label', 'skip-label', 'submit-label', 'other-label', 'required-message', 'progress-label'];
  }

  private _items: QuestionDefinition[] | null = null;
  private _values: QuestionnaireValues = {};
  /** "Other" text per question, kept apart so switching back to it restores what was typed. */
  private otherText: Record<string, string> = {};
  private activeName: string | null = null;
  private errorName: string | null = null;
  private focusAfterRender: 'question' | 'answer' | null = null;

  constructor() {
    super();
    this.root.addEventListener('click', (event) => this.onClick(event));
    this.root.addEventListener('input', (event) => this.onInput(event));
    this.root.addEventListener('change', (event) => this.onInput(event));
    this.addEventListener('keydown', (event) => this.onKeyDown(event));
    this.addEventListener('question-change', () => this.requestRender());
  }

  /** The questions: from the `items` property when set, else from question children. */
  get items(): QuestionDefinition[] {
    if (this._items) return this._items;
    return Array.from(this.children)
      .filter((child): child is UIQuestion => child instanceof UIQuestion)
      .map((child) => child.toDefinition())
      .filter((item) => item.name);
  }

  set items(value: QuestionDefinition[] | null) {
    this._items = Array.isArray(value) ? value.filter((item) => item && item.name) : null;
    this.requestRender();
  }

  get values(): QuestionnaireValues {
    return JSON.parse(JSON.stringify(this._values));
  }

  set values(value: QuestionnaireValues) {
    this._values = value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : {};
    this.requestRender();
  }

  /** The questions that apply, given the answers so far. */
  private visible(): QuestionDefinition[] {
    return this.items.filter((item) => {
      if (!item.when) return true;
      const answer = this._values[item.when.name];
      return Array.isArray(answer) ? answer.includes(item.when.value) : answer === item.when.value;
    });
  }

  get activeIndex(): number {
    const visible = this.visible();
    const index = visible.findIndex((item) => item.name === this.activeName);
    return index < 0 ? 0 : index;
  }

  set activeIndex(index: number) {
    const visible = this.visible();
    const item = visible[Math.max(0, Math.min(visible.length - 1, Math.trunc(Number(index) || 0)))];
    if (item) this.goTo(item.name);
  }

  private active(): QuestionDefinition | undefined {
    return this.visible()[this.activeIndex];
  }

  goTo(name: string): void {
    if (!this.visible().some((item) => item.name === name)) return;
    this.activeName = name;
    this.errorName = null;
    this.focusAfterRender = 'question';
    this.requestRender();
    const visible = this.visible();
    this.dispatchEvent(new CustomEvent('step', { detail: { name, index: this.activeIndex, total: visible.length }, bubbles: true }));
  }

  private validate(item: QuestionDefinition): boolean {
    if (!item.required) return true;
    return !isEmpty(this._values[item.name]);
  }

  next(): void {
    const item = this.active();
    if (!item) return;
    if (!this.validate(item)) {
      this.errorName = item.name;
      this.focusAfterRender = 'answer';
      this.requestRender();
      return;
    }
    const visible = this.visible();
    const index = visible.findIndex((entry) => entry.name === item.name);
    if (index >= visible.length - 1) {
      this.submit();
      return;
    }
    this.goTo(visible[index + 1].name);
  }

  previous(): void {
    const visible = this.visible();
    const index = this.activeIndex;
    if (index > 0) this.goTo(visible[index - 1].name);
  }

  /** Leaves an optional question unanswered and moves on. */
  skip(): void {
    const item = this.active();
    if (!item || item.required) return;
    delete this._values[item.name];
    this.emitChange(item.name);
    const visible = this.visible();
    const index = visible.findIndex((entry) => entry.name === item.name);
    if (index >= visible.length - 1) this.submit();
    else this.goTo(visible[index + 1].name);
  }

  reset(): void {
    this._values = {};
    this.otherText = {};
    this.errorName = null;
    this.activeName = this.visible()[0]?.name || null;
    this.removeAttribute('completed');
    this.focusAfterRender = null;
    this.requestRender();
  }

  /** The answers as FormData: one entry per answer, several for a multiple choice. */
  toFormData(): FormData {
    const data = new FormData();
    for (const [name, value] of Object.entries(this._values)) {
      for (const entry of Array.isArray(value) ? value : [value]) data.append(name, entry);
    }
    return data;
  }

  private submit(): void {
    // Answers to questions that no longer apply are not submitted.
    const visibleNames = new Set(this.visible().map((item) => item.name));
    const values: QuestionnaireValues = {};
    for (const [name, value] of Object.entries(this._values)) if (visibleNames.has(name)) values[name] = value;
    // Not bubbling: a surrounding <form> (and framework onSubmit handlers on it) must not take
    // this for its own submit event.
    const event = new CustomEvent('submit', { detail: { values }, bubbles: false, cancelable: true });
    if (this.dispatchEvent(event)) this.setAttribute('completed', '');
  }

  private emitChange(name: string): void {
    this.dispatchEvent(new CustomEvent('change', { detail: { name, value: this._values[name], values: this.values }, bubbles: true }));
  }

  private readAnswer(item: QuestionDefinition): void {
    const fieldset = this.root.querySelector('fieldset');
    if (!fieldset) return;
    let value: QuestionnaireValue | undefined;
    const other = fieldset.querySelector('input.other-text') as HTMLInputElement | null;
    if (other) this.otherText[item.name] = other.value;
    if (item.type === 'text' || !item.options?.length) {
      value = (fieldset.querySelector('textarea') as HTMLTextAreaElement | null)?.value ?? '';
    } else {
      const checked = Array.from(fieldset.querySelectorAll<HTMLInputElement>('input.choice-input:checked')).map((input) => input.value);
      // "Other" stands for what was typed beside it; checked but empty, it is no answer.
      const resolved = checked.map((entry) => (entry === OTHER ? (other?.value || '').trim() : entry)).filter((entry) => entry !== '');
      value = item.type === 'multiple' ? resolved : resolved[0] ?? '';
    }
    if (isEmpty(value)) delete this._values[item.name];
    else this._values[item.name] = value as QuestionnaireValue;
    if (this.errorName === item.name && this.validate(item)) {
      this.errorName = null;
      this.syncError(item);
    }
    this.emitChange(item.name);
  }

  private onInput(event: Event): void {
    const item = this.active();
    const target = event.target as HTMLElement | null;
    if (!item || !target || !target.closest('fieldset')) return;
    // Typing in "other" selects it, as a user expects.
    if (target.classList.contains('other-text')) {
      const otherChoice = this.root.querySelector(`input.choice-input[value="${OTHER}"]`) as HTMLInputElement | null;
      if (otherChoice && !otherChoice.checked && (target as HTMLInputElement).value) otherChoice.checked = true;
    }
    if (event.type === 'change' && target.matches('textarea, input[type="text"]')) return;
    this.readAnswer(item);
  }

  private onClick(event: Event): void {
    const button = (event.target as Element | null)?.closest?.('button[data-action]');
    if (!button) return;
    const action = button.getAttribute('data-action');
    if (action === 'next') this.next();
    else if (action === 'back') this.previous();
    else if (action === 'skip') this.skip();
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this.hasAttribute('shortcuts') || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || this.hasAttribute('completed')) return;
    const origin = event.composedPath()[0] as HTMLElement | undefined;
    if (origin && origin.matches && origin.matches('textarea, input[type="text"]')) return;
    const item = this.active();
    if (!item) return;
    if (event.key === 'Enter' && !(origin && origin.matches && origin.matches('button'))) {
      event.preventDefault();
      this.next();
      return;
    }
    if (/^[1-9]$/.test(event.key)) {
      const inputs = Array.from(this.root.querySelectorAll<HTMLInputElement>('input.choice-input'));
      const input = inputs[Number(event.key) - 1];
      if (!input || input.disabled) return;
      event.preventDefault();
      input.checked = item.type === 'multiple' ? !input.checked : true;
      input.focus();
      this.readAnswer(item);
    }
  }

  private syncError(item: QuestionDefinition): void {
    const error = this.root.querySelector('.error') as HTMLElement | null;
    const invalid = this.errorName === item.name;
    if (error) error.hidden = !invalid;
    for (const control of Array.from(this.root.querySelectorAll('fieldset input, fieldset textarea'))) {
      if (invalid) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
    }
  }

  private renderQuestion(item: QuestionDefinition, index: number): string {
    const id = `q-${index}`;
    const value = this._values[item.name];
    const selected = new Set(Array.isArray(value) ? value : value != null ? [value] : []);
    const describedby = [item.description ? `${id}-description` : '', `${id}-error`].filter(Boolean).join(' ');
    const shortcuts = this.hasAttribute('shortcuts');
    const otherLabel = item.otherLabel || this.getAttribute('other-label') || 'Other';
    // A single choice is a radio group, which can carry aria-required; other fieldsets say
    // "(required)" in their legend instead (aria-required is not allowed on a plain group).
    const singleChoice = item.type !== 'multiple' && item.type !== 'text' && !!item.options?.length;
    let body: string;

    if (item.type === 'text' || !item.options?.length) {
      body = `<div class="text-field"><textarea id="${id}-text" aria-label="${escapeHtml(item.label)}" aria-describedby="${describedby}"${item.placeholder ? ` placeholder="${escapeHtml(item.placeholder)}"` : ''}${item.required ? ' aria-required="true"' : ''}>${escapeHtml(typeof value === 'string' ? value : '')}</textarea></div>`;
    } else {
      const inputType = item.type === 'multiple' ? 'checkbox' : 'radio';
      const known = new Set(item.options.map((option) => option.value));
      const otherValue = [...selected].find((entry) => !known.has(entry)) ?? '';
      const otherText = this.otherText[item.name] ?? otherValue;
      const otherChecked = otherValue !== '';
      const choices = item.options.map((option, i) => `
        <label class="choice" part="choice">
          <input class="choice-input" type="${inputType}" name="${escapeHtml(`${item.name}-${index}`)}" value="${escapeHtml(option.value)}"${selected.has(option.value) ? ' checked' : ''}${option.disabled ? ' disabled' : ''} aria-describedby="${describedby}" />
          <span class="choice-text"><span>${escapeHtml(option.label)}</span>${option.description ? `<span class="choice-description">${escapeHtml(option.description)}</span>` : ''}</span>
          ${shortcuts && i < 9 ? `<span class="key" aria-hidden="true">${i + 1}</span>` : ''}
        </label>`).join('');
      const other = item.allowOther
        ? `<label class="choice" part="choice">
            <input class="choice-input" type="${inputType}" name="${escapeHtml(`${item.name}-${index}`)}" value="${OTHER}"${otherChecked ? ' checked' : ''} aria-label="${escapeHtml(otherLabel)}" />
            <span class="choice-text"><input class="other-text" type="text" aria-label="${escapeHtml(`${otherLabel}: ${item.label}`)}" placeholder="${escapeHtml(item.placeholder || otherLabel)}" value="${escapeHtml(otherText)}" /></span>
          </label>`
        : '';
      body = `<div class="choices" part="choices">${choices}${other}</div>`;
    }

    return `
      <fieldset part="question" tabindex="-1" aria-describedby="${describedby}"${singleChoice ? ` role="radiogroup"${item.required ? ' aria-required="true"' : ''}` : ''}>
        <legend part="title">${escapeHtml(item.label)}${item.required ? '<span class="required" aria-hidden="true">*</span><span class="sr"> (required)</span>' : ''}</legend>
        ${item.description ? `<p class="description" part="description" id="${id}-description">${escapeHtml(item.description)}</p>` : ''}
        ${body}
        <p class="error" part="error" id="${id}-error" role="alert"${this.errorName === item.name ? '' : ' hidden'}>${escapeHtml(this.getAttribute('required-message') || 'Choose or type an answer to continue.')}</p>
      </fieldset>`;
  }

  protected override render(): void {
    const visible = this.visible();
    if (!visible.some((item) => item.name === this.activeName)) this.activeName = visible[0]?.name || null;
    const index = this.activeIndex;
    const item = visible[index];
    const total = visible.length;
    const completed = this.hasAttribute('completed');
    const last = index >= total - 1;
    const progressText = (this.getAttribute('progress-label') || 'Question {current} of {total}')
      .replace('{current}', String(index + 1))
      .replace('{total}', String(total));
    this.style.setProperty('--ui-questionnaire-progress', `${total ? ((completed ? total : index) / total) * 100 : 0}%`);

    const main = item
      ? `
        <div class="progress" part="progress">
          <span id="progress-text">${escapeHtml(progressText)}</span>
          <div class="track" role="progressbar" aria-labelledby="progress-text" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${index + 1}"><div class="fill"></div></div>
        </div>
        ${this.renderQuestion(item, index)}
        <div class="actions" part="actions">
          <button type="button" data-action="back" part="back-button"${index === 0 ? ' hidden' : ''}>${escapeHtml(this.getAttribute('back-label') || 'Back')}</button>
          <span class="spacer"></span>
          <button type="button" class="quiet" data-action="skip" part="skip-button"${item.required ? ' hidden' : ''}>${escapeHtml(this.getAttribute('skip-label') || 'Skip')}</button>
          <button type="button" class="primary" data-action="next" part="${last ? 'submit-button' : 'next-button'}">${escapeHtml(last ? this.getAttribute('submit-label') || 'Submit' : this.getAttribute('next-label') || 'Next')}</button>
        </div>`
      : '';

    // The content is rebuilt per step; force it so the active question's DOM is always current.
    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="main"${completed ? ' hidden' : ''}>${main}</div>
        <div class="complete" part="complete"${completed ? '' : ' hidden'}><slot name="complete"></slot></div>
        <slot hidden></slot>
      </div>
    `, { force: true });

    if (item) this.syncError(item);
    const focus = this.focusAfterRender;
    this.focusAfterRender = null;
    if (focus === 'question') (this.root.querySelector('fieldset') as HTMLElement | null)?.focus();
    else if (focus === 'answer') (this.root.querySelector('fieldset input:not([disabled]), fieldset textarea') as HTMLElement | null)?.focus();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-questionnaire')) {
  customElements.define('ui-questionnaire', UIQuestionnaire);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-questionnaire': UIQuestionnaire;
  }
}
