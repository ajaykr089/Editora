import * as React from 'react';
import '@editora/ui-core/questionnaire';
import {
  createUIElement,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useIsomorphicLayoutEffect,
} from './_internals';

// The shapes ui-core's ui-question reads (kept here: wrappers never import the whole ui-core catalog).
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
export type QuestionnaireValue = string | string[];
export type QuestionnaireValues = Record<string, QuestionnaireValue>;
export type QuestionnaireChangeDetail = { name: string; value: QuestionnaireValue | undefined; values: QuestionnaireValues };
export type QuestionnaireStepDetail = { name: string; index: number; total: number };

/** The element behind a Questionnaire ref. */
export type QuestionnaireElement = HTMLElement & {
  values: QuestionnaireValues;
  items: QuestionDefinition[];
  activeIndex: number;
  next(): void;
  previous(): void;
  skip(): void;
  goTo(name: string): void;
  reset(): void;
  toFormData(): FormData;
};

export type QuestionnaireProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onSubmit'> & {
  /** Questions as data. Or render Question children. */
  items?: QuestionDefinition[];
  /** Answers to start from (resume a saved questionnaire). Read live answers from onChange. */
  defaultValues?: QuestionnaireValues;
  /** 1-9 pick a choice and Enter goes on. */
  shortcuts?: boolean;
  /** Show the slot="complete" content instead of the questions. */
  completed?: boolean;
  backLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  submitLabel?: string;
  otherLabel?: string;
  requiredMessage?: string;
  /** "Question {current} of {total}" */
  progressLabel?: string;
  onChange?: (detail: QuestionnaireChangeDetail) => void;
  onStep?: (detail: QuestionnaireStepDetail) => void;
  /** The answers that apply. Call event.preventDefault() to keep it open (e.g. on a server error). */
  onSubmit?: (values: QuestionnaireValues, event: CustomEvent<{ values: QuestionnaireValues }>) => void;
};

export const Questionnaire = React.forwardRef<QuestionnaireElement, QuestionnaireProps>(function Questionnaire(props, forwardedRef) {
  const { items, defaultValues, shortcuts, completed, backLabel, nextLabel, skipLabel, submitLabel, otherLabel, requiredMessage, progressLabel, onChange, onStep, onSubmit, children, ...rest } = props;
  const ref = React.useRef<QuestionnaireElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as QuestionnaireElement);

  const handleChange = React.useCallback((event: Event) => {
    const detail = (event as CustomEvent<QuestionnaireChangeDetail>).detail;
    if (detail) onChange?.(detail);
  }, [onChange]);
  const handleStep = React.useCallback((event: Event) => {
    const detail = (event as CustomEvent<QuestionnaireStepDetail>).detail;
    if (detail) onStep?.(detail);
  }, [onStep]);
  const handleSubmit = React.useCallback((event: Event) => {
    const custom = event as CustomEvent<{ values: QuestionnaireValues }>;
    if (custom.detail) onSubmit?.(custom.detail.values, custom);
  }, [onSubmit]);
  useElementEventListeners(ref, [
    { type: 'change', listener: handleChange },
    { type: 'step', listener: handleStep },
    { type: 'submit', listener: handleSubmit },
  ], [handleChange, handleStep, handleSubmit], { hostOnly: true });

  useIsomorphicLayoutEffect(() => {
    if (ref.current && items) ref.current.items = items;
  }, [items]);

  const initialValues = React.useRef(defaultValues);
  useIsomorphicLayoutEffect(() => {
    if (ref.current && initialValues.current) ref.current.values = initialValues.current;
    initialValues.current = undefined;
  }, []);

  useElementAttributes(ref, (el) => {
    syncBooleanAttribute(el, 'shortcuts', shortcuts);
    if (completed !== undefined) syncBooleanAttribute(el, 'completed', completed);
    syncStringAttribute(el, 'back-label', backLabel ?? null);
    syncStringAttribute(el, 'next-label', nextLabel ?? null);
    syncStringAttribute(el, 'skip-label', skipLabel ?? null);
    syncStringAttribute(el, 'submit-label', submitLabel ?? null);
    syncStringAttribute(el, 'other-label', otherLabel ?? null);
    syncStringAttribute(el, 'required-message', requiredMessage ?? null);
    syncStringAttribute(el, 'progress-label', progressLabel ?? null);
  }, [shortcuts, completed, backLabel, nextLabel, skipLabel, submitLabel, otherLabel, requiredMessage, progressLabel]);

  return createUIElement('ui-questionnaire', { ref, ...rest }, children);
});
Questionnaire.displayName = 'Questionnaire';

export default Questionnaire;
