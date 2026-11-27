import { ElementBase } from '../ElementBase';

/**
 * One question of a questionnaire, declared in markup. It shows nothing itself: the questionnaire
 * reads it and renders the active question.
 *
 *   <ui-question name="scope" label="What should I build?" required>
 *     <option value="web">A web app</option>
 *     <option value="api" data-description="REST or GraphQL">An API</option>
 *   </ui-question>
 *   <ui-question name="notes" label="Anything else?" type="text" placeholder="Optional"></ui-question>
 *
 * Attributes: `name` (the answer's key), `label`, `description`, `type` (single | multiple |
 * text; default single, or text when there are no options), `required`, `allow-other` (a free
 * text answer beside the options), `other-label`, `placeholder`, `when` ("name:value": only
 * asked when that earlier answer is, or includes, value).
 */
export type QuestionOption = { value: string; label: string; description?: string; disabled?: boolean };

export type QuestionDefinition = {
  name: string;
  label: string;
  description?: string;
  type?: 'single' | 'multiple' | 'text';
  required?: boolean;
  options?: QuestionOption[];
  allowOther?: boolean;
  otherLabel?: string;
  placeholder?: string;
  /** Only ask when the answer to `name` is, or includes, `value`. */
  when?: { name: string; value: string };
};

export function parseWhen(value: string | null): QuestionDefinition['when'] {
  const match = /^\s*([^:]+?)\s*:\s*(.+?)\s*$/.exec(value || '');
  return match ? { name: match[1], value: match[2] } : undefined;
}

export class UIQuestion extends ElementBase {
  static get observedAttributes() {
    return ['name', 'label', 'description', 'type', 'required', 'allow-other', 'other-label', 'placeholder', 'when'];
  }

  private observer: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.observer && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.notify());
      this.observer.observe(this, { childList: true, subtree: true, characterData: true, attributes: true });
    }
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = null;
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    this.notify();
    return false;
  }

  private notify(): void {
    this.dispatchEvent(new CustomEvent('question-change', { bubbles: true }));
  }

  /** The question as data. */
  toDefinition(): QuestionDefinition {
    const options: QuestionOption[] = Array.from(this.querySelectorAll('option')).map((option) => ({
      value: option.value,
      label: (option.textContent || option.value).trim(),
      description: option.getAttribute('data-description') || undefined,
      disabled: option.disabled || undefined,
    }));
    const type = this.getAttribute('type');
    return {
      name: this.getAttribute('name') || '',
      label: this.getAttribute('label') || '',
      description: this.getAttribute('description') || undefined,
      type: type === 'multiple' || type === 'text' || type === 'single' ? type : options.length ? 'single' : 'text',
      required: this.hasAttribute('required'),
      options,
      allowOther: this.hasAttribute('allow-other'),
      otherLabel: this.getAttribute('other-label') || undefined,
      placeholder: this.getAttribute('placeholder') || undefined,
      when: parseWhen(this.getAttribute('when')),
    };
  }

  protected override render(): void {
    this.setContent('<style>:host{display:none !important}</style>');
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-question')) {
  customElements.define('ui-question', UIQuestion);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-question': UIQuestion;
  }
}
