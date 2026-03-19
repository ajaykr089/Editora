import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { warnIfElementNotRegistered } from './_internals';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type TransferListVariant = 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
export type TransferListTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type TransferListSize = 'sm' | 'md' | 'lg' | '1' | '2' | '3';
export type TransferListElevation = 'none' | 'low' | 'high';
export type TransferListSelectionIndicator = 'checkbox' | 'tick' | 'none';

export type TransferListOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type TransferListChangeDetail = {
  value: string[];
  previousValue: string[];
  selectedItems: TransferListOption[];
  source: string;
};

export type TransferListElement = HTMLElement & {
  value: string[];
};

export type TransferListProps = Omit<React.HTMLAttributes<TransferListElement>, 'onChange'> & {
  options: TransferListOption[];
  value?: string[];
  label?: string;
  description?: string;
  error?: string;
  name?: string;
  disabled?: boolean;
  variant?: TransferListVariant;
  tone?: TransferListTone;
  size?: TransferListSize;
  radius?: number | string;
  elevation?: TransferListElevation;
  selectionIndicator?: TransferListSelectionIndicator;
  addActionLabel?: string;
  removeActionLabel?: string;
  showActionLabels?: boolean;
  showActionCounts?: boolean;
  showPanelCounts?: boolean;
  availableLabel?: string;
  selectedLabel?: string;
  availableEmptyLabel?: string;
  selectedEmptyLabel?: string;
  onChange?: (detail: TransferListChangeDetail) => void;
  onValueChange?: (value: string[]) => void;
};

export const TransferList = React.forwardRef<TransferListElement, TransferListProps>(function TransferList(
  {
    options,
    value,
    label,
    description,
    error,
    name,
    disabled,
    variant,
    tone,
    size,
    radius,
    elevation,
    selectionIndicator,
    addActionLabel,
    removeActionLabel,
    showActionLabels,
    showActionCounts,
    showPanelCounts,
    availableLabel,
    selectedLabel,
    availableEmptyLabel,
    selectedEmptyLabel,
    onChange,
    onValueChange,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<TransferListElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as TransferListElement);

  useEffect(() => {
    warnIfElementNotRegistered('ui-transfer-list', 'TransferList');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<TransferListChangeDetail>).detail;
      onChange?.(detail);
      onValueChange?.(detail.value);
    };
    el.addEventListener('change', handleChange as EventListener);
    return () => el.removeEventListener('change', handleChange as EventListener);
  }, [onChange, onValueChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (attr: string, next: string | null) => {
      if (next == null || next === '') el.removeAttribute(attr);
      else el.setAttribute(attr, next);
    };

    syncAttr('options', JSON.stringify(options || []));
    syncAttr('value', value?.length ? JSON.stringify(value) : null);
    syncAttr('label', label ?? null);
    syncAttr('description', description ?? null);
    syncAttr('error', error ?? null);
    syncAttr('name', name ?? null);
    syncAttr('variant', variant && variant !== 'surface' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('radius', radius == null || radius === '' ? null : String(radius));
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
    syncAttr('selection-indicator', selectionIndicator && selectionIndicator !== 'checkbox' ? selectionIndicator : null);
    syncAttr('add-action-label', addActionLabel ?? null);
    syncAttr('remove-action-label', removeActionLabel ?? null);
    syncAttr('show-action-labels', showActionLabels == null || showActionLabels ? null : 'false');
    syncAttr('show-action-counts', showActionCounts == null || showActionCounts ? null : 'false');
    syncAttr('show-panel-counts', showPanelCounts == null || showPanelCounts ? null : 'false');
    syncAttr('available-label', availableLabel ?? null);
    syncAttr('selected-label', selectedLabel ?? null);
    syncAttr('available-empty-label', availableEmptyLabel ?? null);
    syncAttr('selected-empty-label', selectedEmptyLabel ?? null);
    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
  }, [
    options,
    value,
    label,
    description,
    error,
    name,
    disabled,
    variant,
    tone,
    size,
    radius,
    elevation,
    selectionIndicator,
    addActionLabel,
    removeActionLabel,
    showActionLabels,
    showActionCounts,
    showPanelCounts,
    availableLabel,
    selectedLabel,
    availableEmptyLabel,
    selectedEmptyLabel
  ]);

  return React.createElement('ui-transfer-list', { ref, ...rest }, children);
});

TransferList.displayName = 'TransferList';

export default TransferList;
