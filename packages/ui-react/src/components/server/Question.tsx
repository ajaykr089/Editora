import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type QuestionProps = React.HTMLAttributes<HTMLElement> & {
  /** The answer key. */
  name?: string;
  label?: string;
  description?: string;
  type?: 'single' | 'multiple' | 'text';
  required?: boolean;
  /** A free text answer beside the options. */
  allowOther?: boolean;
  otherLabel?: string;
  placeholder?: string;
  /** "name:value": only asked when that earlier answer is or includes value. */
  when?: string;
};

const ATTRS: AttrSpec = { name: ['name', 'string'], label: ['label', 'string'], description: ['description', 'string'], type: ['type', 'string'], required: ['required', 'bool'], allowOther: ['allow-other', 'bool'], otherLabel: ['other-label', 'string'], placeholder: ['placeholder', 'string'], when: ['when', 'string'] };

/** Renders the `ui-question` element (see @editora/ui-core). */
export const Question = React.forwardRef<HTMLElement, QuestionProps>(({ children, ...props }, ref) =>
  createUIElement('ui-question', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
Question.displayName = 'Question';
