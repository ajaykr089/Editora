import React from 'react';
import { Badge } from '@editora/ui-react/Badge';
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, type OrderStatus } from '../../../shared/data';

/** A percentage change, signed, for Stat trends. */
export function change(value: number) {
  const pct = Math.round(value * 1000) / 10;
  return `${pct > 0 ? '+' : pct < 0 ? '−' : ''}${Math.abs(pct)}%`;
}

export function OrderBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={ORDER_STATUS_TONE[status]} variant="soft" size="sm">{ORDER_STATUS_LABEL[status]}</Badge>;
}

/** Loads data with the latest arguments, ignoring answers that arrive after a newer request. */
export function useLoad<T>(load: () => Promise<T>, deps: React.DependencyList): { data: T | null; loading: boolean; reload: () => void } {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    let current = true;
    setLoading(true);
    load().then((next) => {
      if (!current) return;
      setData(next);
      setLoading(false);
    });
    return () => { current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  return { data, loading, reload: () => setTick((t) => t + 1) };
}

/** A product swatch: a coloured tile standing in for a product photo. */
export function Swatch({ colour, label, size = 36 }: { colour: string; label: string; size?: number }) {
  return (
    <span className="lk-swatch" style={{ background: colour, width: size, height: size }} aria-hidden="true">
      {label.slice(0, 1)}
    </span>
  );
}
