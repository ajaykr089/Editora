import React from 'react';
import { Stat, type StatProps } from './Stat';

export type MetricCardProps = Omit<StatProps, 'variant'>;

export const MetricCard = React.forwardRef<HTMLElement, MetricCardProps>(function MetricCard(props, forwardedRef) {
  return <Stat ref={forwardedRef} variant="card" {...props} />;
});

MetricCard.displayName = 'MetricCard';

export default MetricCard;
