import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

export type TagsInputProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
  value?: string[] | string;
  name?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  counter?: boolean;
  maxTags?: number;
  allowDuplicates?: boolean;
  addOnBlur?: boolean;
  onChange?: (value: string[]) => void;
  onTagAdd?: (detail: { tag: string; value: string[] }) => void;
  onTagRemove?: (detail: { tag: string; index: number; value: string[] }) => void;
};

function serializeValue(value: string[] | string | undefined): string | null {
  if (value == null) return null;
  if (Array.isArray(value)) return JSON.stringify(value);
  return value;
}

export const TagsInput = React.forwardRef<HTMLElement, TagsInputProps>(function TagsInput(
  {
    value,
    name,
    label,
    description,
    placeholder,
    required,
    disabled,
    readOnly,
    counter,
    maxTags,
    allowDuplicates,
    addOnBlur,
    onChange,
    onTagAdd,
    onTagRemove,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ value?: string[] }>(event);
    if (Array.isArray(detail?.value)) onChange?.(detail.value);
  }, [onChange]);

  const handleAdd = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ tag: string; value: string[] }>(event);
    if (detail) onTagAdd?.(detail);
  }, [onTagAdd]);

  const handleRemove = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ tag: string; index: number; value: string[] }>(event);
    if (detail) onTagRemove?.(detail);
  }, [onTagRemove]);

  useElementEventListeners(
    ref,
    [
      { type: 'change', listener: handleChange },
      { type: 'tag-add', listener: handleAdd },
      { type: 'tag-remove', listener: handleRemove },
    ],
    [handleChange, handleAdd, handleRemove]
  );

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'value', serializeValue(value));
    syncStringAttribute(el, 'name', name ?? null);
    syncStringAttribute(el, 'label', label ?? null);
    syncStringAttribute(el, 'description', description ?? null);
    syncStringAttribute(el, 'placeholder', placeholder ?? null);
    syncBooleanAttribute(el, 'required', required);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'readonly', readOnly);
    syncBooleanAttribute(el, 'counter', counter);
    syncBooleanAttribute(el, 'allow-duplicates', allowDuplicates);
    syncBooleanAttribute(el, 'add-on-blur', addOnBlur);
    syncNumberAttribute(el, 'max-tags', maxTags);
  }, [value, name, label, description, placeholder, required, disabled, readOnly, counter, allowDuplicates, addOnBlur, maxTags]);

  return React.createElement('ui-tags-input', { ref, ...rest }, children);
});

TagsInput.displayName = 'TagsInput';

export default TagsInput;
