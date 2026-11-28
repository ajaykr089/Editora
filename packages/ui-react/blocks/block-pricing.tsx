// block: A pricing section: three plans, a monthly/yearly switch, feature lists and a highlighted plan.
import * as React from 'react';
import { Badge, Box, Button, Card, Flex, Heading, Switch, Text } from '@editora/ui-react';

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  features: string[];
  highlighted?: boolean;
  cta?: string;
};

export type PricingBlockProps = {
  plans?: PricingPlan[];
  currency?: string;
  onChoose?: (plan: PricingPlan, billing: 'monthly' | 'yearly') => void;
};

const DEFAULT_PLANS: PricingPlan[] = [
  { id: 'free', name: 'Free', description: 'For trying it out.', monthly: 0, yearly: 0, features: ['1 project', 'Community support', 'Basic components'], cta: 'Start free' },
  { id: 'pro', name: 'Pro', description: 'For small teams shipping fast.', monthly: 19, yearly: 190, features: ['Unlimited projects', 'Email support', 'All components', 'Copy-source blocks'], highlighted: true, cta: 'Start trial' },
  { id: 'team', name: 'Team', description: 'For organisations.', monthly: 49, yearly: 490, features: ['Everything in Pro', 'SSO and audit log', 'Priority support', 'Custom themes'], cta: 'Contact sales' },
];

/** A three-plan pricing section with a billing switch. */
export function PricingBlock({ plans = DEFAULT_PLANS, currency = 'USD', onChoose }: PricingBlockProps) {
  const [yearly, setYearly] = React.useState(false);
  const format = (amount: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  return (
    <section aria-labelledby="pricing-title" style={{ padding: 24, display: 'grid', gap: 24 }}>
      <div style={{ textAlign: 'center', display: 'grid', gap: 8, justifyItems: 'center' }}>
        <Heading level={2} size="2xl" id="pricing-title">Simple pricing</Heading>
        <Text variant="muted">Pick a plan. Change or cancel at any time.</Text>
        <Switch checked={yearly} onChange={(detail) => setYearly(detail.checked)} label="Bill yearly (2 months free)" />
      </div>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', alignItems: 'stretch' }}>
        {plans.map((plan) => (
          <Card key={plan.id} style={{ display: 'grid', gap: 16, alignContent: 'start', outline: plan.highlighted ? '2px solid var(--ui-color-primary, #2563eb)' : undefined }}>
            <Card.Header>
              <Flex style={{ justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <Heading level={3} size="lg">{plan.name}</Heading>
                {plan.highlighted ? <Badge tone="brand">Most popular</Badge> : null}
              </Flex>
              <Text variant="muted">{plan.description}</Text>
            </Card.Header>
            <div>
              <Text inline size="xl" weight="bold">{format(yearly ? plan.yearly : plan.monthly)}</Text>{' '}
              <Text inline variant="muted">{yearly ? '/ year' : '/ month'}</Text>
            </div>
            <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 6 }}>
              {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <Button block variant={plan.highlighted ? 'primary' : 'secondary'} onClick={() => onChoose?.(plan, yearly ? 'yearly' : 'monthly')}>
              {plan.cta || `Choose ${plan.name}`}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default PricingBlock;
