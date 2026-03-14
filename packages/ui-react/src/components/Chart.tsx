import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { warnIfElementNotRegistered } from './_internals';

export type ChartPoint = { label: string; value: number; tone?: string };
export type ChartSeries = {
  name: string;
  data: ChartPoint[];
  tone?: string;
  fill?: boolean;
  dash?: string;
  strokeWidth?: number;
  opacity?: number;
};
export type ChartState = 'idle' | 'loading' | 'error' | 'success';
export type ChartSeriesValueDetail = {
  series: string;
  value: number | null;
  tone?: string;
};
export type ChartPointSelectDetail = {
  index: number;
  label: string;
  value: number;
  tone?: string;
  series?: string;
  seriesValues?: ChartSeriesValueDetail[];
  type: 'line' | 'area' | 'bar' | 'donut' | 'step' | 'scatter' | 'radial';
  total: number;
  min: number;
  max: number;
  source?: 'pointer' | 'keyboard' | 'api';
};

export type ChartProps = React.HTMLAttributes<HTMLElement> & {
  data?: ChartPoint[];
  series?: ChartSeries[];
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
  valuePrefix?: string;
  valueSuffix?: string;
  ariaLabel?: string;
  onPointSelect?: (detail: ChartPointSelectDetail) => void;
};

export interface ChartHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface ChartTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

export interface ChartSubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

type ChartRootComponent = React.ForwardRefExoticComponent<ChartProps & React.RefAttributes<HTMLElement>>;

type ChartCompoundComponent = ChartRootComponent & {
  Root: ChartRootComponent;
  Header: React.ForwardRefExoticComponent<ChartHeaderProps & React.RefAttributes<HTMLDivElement>>;
  Title: React.ForwardRefExoticComponent<ChartTitleProps & React.RefAttributes<HTMLHeadingElement>>;
  Subtitle: React.ForwardRefExoticComponent<ChartSubtitleProps & React.RefAttributes<HTMLParagraphElement>>;
};

const ChartRoot = React.forwardRef<HTMLElement, ChartProps>(function Chart(
  {
    data,
    series,
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
    valuePrefix,
    valueSuffix,
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

  useIsomorphicLayoutEffect(() => {
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

    if (series && series.length) {
      try {
        syncAttr('series', JSON.stringify(series));
      } catch {
        syncAttr('series', null);
      }
    } else {
      syncAttr('series', null);
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
    syncAttr('value-prefix', valuePrefix || null);
    syncAttr('value-suffix', valueSuffix || null);
    syncAttr('aria-label', ariaLabel || null);
    syncBool('disabled', disabled);
    syncBool('headless', headless);
  }, [
    data,
    series,
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
    valuePrefix,
    valueSuffix,
    ariaLabel
  ]);

  return React.createElement('ui-chart', { ref, ...rest }, children);
});

ChartRoot.displayName = 'Chart';

export const ChartHeader = React.forwardRef<HTMLDivElement, ChartHeaderProps>(function ChartHeader(
  { children, ...rest },
  forwardedRef
) {
  return (
    <div ref={forwardedRef} slot="header" {...rest}>
      {children}
    </div>
  );
});

ChartHeader.displayName = 'ChartHeader';

export const ChartTitle = React.forwardRef<HTMLHeadingElement, ChartTitleProps>(function ChartTitle(
  { children, ...rest },
  forwardedRef
) {
  return (
    <h3 ref={forwardedRef} slot="title" {...rest}>
      {children}
    </h3>
  );
});

ChartTitle.displayName = 'ChartTitle';

export const ChartSubtitle = React.forwardRef<HTMLParagraphElement, ChartSubtitleProps>(function ChartSubtitle(
  { children, ...rest },
  forwardedRef
) {
  return (
    <p ref={forwardedRef} slot="subtitle" {...rest}>
      {children}
    </p>
  );
});

ChartSubtitle.displayName = 'ChartSubtitle';

export const Chart = Object.assign(ChartRoot, {
  Root: ChartRoot,
  Header: ChartHeader,
  Title: ChartTitle,
  Subtitle: ChartSubtitle,
}) as ChartCompoundComponent;

export default Chart;
