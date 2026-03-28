import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

type BaseDateFieldProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
  value?: string;
  min?: string;
  max?: string;
  locale?: string;
  label?: string;
  description?: string;
  error?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (detail: { value: string | null; previousValue: string | null; source: string }) => void;
  onValueChange?: (value: string | null) => void;
};

function useFieldChangeBridge(
  ref: React.MutableRefObject<HTMLElement | null>,
  onChange: BaseDateFieldProps['onChange'],
  onValueChange: BaseDateFieldProps['onValueChange']
) {
  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ value: string | null; previousValue: string | null; source: string }>(event);
    if (!detail) return;
    onChange?.(detail);
    onValueChange?.(detail.value);
  }, [onChange, onValueChange]);

  useElementEventListeners(ref, [{ type: 'change', listener: handleChange }], [handleChange]);
}

export const DateField = React.forwardRef<HTMLElement, BaseDateFieldProps>(function DateField(
  { value, min, max, locale, label, description, error, name, required, disabled, readOnly, onChange, onValueChange, children, ...rest },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);
  useFieldChangeBridge(ref, onChange, onValueChange);

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'value', value ?? null);
    syncStringAttribute(el, 'min', min ?? null);
    syncStringAttribute(el, 'max', max ?? null);
    syncStringAttribute(el, 'locale', locale ?? null);
    syncStringAttribute(el, 'label', label ?? null);
    syncStringAttribute(el, 'description', description ?? null);
    syncStringAttribute(el, 'data-error', error ?? null);
    syncStringAttribute(el, 'name', name ?? null);
    syncBooleanAttribute(el, 'required', required);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'readonly', readOnly);
  }, [value, min, max, locale, label, description, error, name, required, disabled, readOnly]);

  return React.createElement('ui-date-field', { ref, ...rest }, children);
});

export const TimeField = React.forwardRef<HTMLElement, BaseDateFieldProps & { format?: '24h' | '12h'; seconds?: boolean }>(
  function TimeField(
    { value, min, max, locale, label, description, error, name, required, disabled, readOnly, format, seconds, onChange, onValueChange, children, ...rest },
    forwardedRef
  ) {
    const ref = useForwardedHostRef<HTMLElement>(forwardedRef);
    useFieldChangeBridge(ref, onChange, onValueChange);

    useElementAttributes(ref, (el) => {
      syncStringAttribute(el, 'value', value ?? null);
      syncStringAttribute(el, 'min', min ?? null);
      syncStringAttribute(el, 'max', max ?? null);
      syncStringAttribute(el, 'locale', locale ?? null);
      syncStringAttribute(el, 'label', label ?? null);
      syncStringAttribute(el, 'description', description ?? null);
      syncStringAttribute(el, 'data-error', error ?? null);
      syncStringAttribute(el, 'name', name ?? null);
      syncStringAttribute(el, 'format', format && format !== '24h' ? format : null);
      syncBooleanAttribute(el, 'seconds', seconds);
      syncBooleanAttribute(el, 'required', required);
      syncBooleanAttribute(el, 'disabled', disabled);
      syncBooleanAttribute(el, 'readonly', readOnly);
    }, [value, min, max, locale, label, description, error, name, required, disabled, readOnly, format, seconds]);

    return React.createElement('ui-time-field', { ref, ...rest }, children);
  }
);

DateField.displayName = 'DateField';
TimeField.displayName = 'TimeField';

export default DateField;
