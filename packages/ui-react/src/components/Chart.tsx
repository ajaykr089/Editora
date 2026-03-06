import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type ChartPoint = { label: string; value: number; tone?: string };
export type ChartState = 'idle' | 'loading' | 'error' | 'success';
export type ChartPointSelectDetail = {
  index: number;
  label: string;
  value: number;
  tone?: string;
  type: 'line' | 'area' | 'bar' | 'donut' | 'step' | 'scatter' | 'radial';
  total: number;
  min: number;
  max: number;
  source?: 'pointer' | 'keyboard' | 'api';
};

export type ChartProps = React.HTMLAttributes<HTMLElement> & {
  data?: ChartPoint[];
  values?: number[];
  labels?: string[];
  type?: 'line' | 'area' | 'bar' | 'donut' | 'step' | 'scatter' | 'radial';
  variant?: 'default' | 'contrast' | 'minimal';
  title?: string;
  subtitle?: string;
  state?: ChartState;
  disabled?: boolean;
  interactive?: boolean;
  showLegend?: boolean;
  showSummary?: boolean;
  headless?: boolean;
  ariaLabel?: string;
  onPointSelect?: (detail: ChartPointSelectDetail) => void;
};

export const Chart = React.forwardRef<HTMLElement, ChartProps>(function Chart(
  {
    data,
    values,
    labels,
    type,
    variant,
    title,
    subtitle,
    state,
    disabled,
    interactive,
    showLegend,
    showSummary,
    headless,
    ariaLabel,
    onPointSelect,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    warnIfElementNotRegistered('ui-chart', 'Chart');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onPointSelect) return;

    const handlePointSelect = (event: Event) => {
      const detail = (event as CustomEvent<ChartPointSelectDetail>).detail;
      if (!detail) return;
      onPointSelect(detail);
    };

    el.addEventListener('ui-point-select', handlePointSelect as EventListener);
    return () => {
      el.removeEventListener('ui-point-select', handlePointSelect as EventListener);
    };
  }, [onPointSelect]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };

    if (data && data.length) {
      try {
        syncAttr('data', JSON.stringify(data));
      } catch {
        syncAttr('data', null);
      }
    } else {
      syncAttr('data', null);
    }

    if (values && values.length) syncAttr('values', values.join(','));
    else syncAttr('values', null);

    if (labels && labels.length) syncAttr('labels', labels.join(','));
    else syncAttr('labels', null);

    syncAttr('type', type && type !== 'line' ? type : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('title', title || null);
    syncAttr('subtitle', subtitle || null);
    syncAttr('state', state && state !== 'idle' ? state : null);
    syncAttr('interactive', interactive === false ? 'false' : null);
    syncAttr('show-legend', typeof showLegend === 'boolean' ? (showLegend ? 'true' : 'false') : null);
    syncAttr('show-summary', typeof showSummary === 'boolean' ? (showSummary ? 'true' : 'false') : null);
    syncAttr('aria-label', ariaLabel || null);
    syncBool('disabled', disabled);
    syncBool('headless', headless);
  }, [
    data,
    values,
    labels,
    type,
    variant,
    title,
    subtitle,
    state,
    disabled,
    interactive,
    showLegend,
    showSummary,
    headless,
    ariaLabel
  ]);

  return React.createElement('ui-chart', { ref, ...rest }, children);
});

Chart.displayName = 'Chart';

export default Chart;
