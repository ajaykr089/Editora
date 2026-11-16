import React from 'react';
import { Accordion } from '@editora/ui-react/Accordion';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { Icon } from '@editora/ui-react/Icon';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { ToggleGroup } from '@editora/ui-react/ToggleGroup';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { useTitle } from '../lib/router';

const PLANS = [
  { name: 'Starter', monthly: 0, blurb: 'For a shop just getting going.', features: ['1 seat', '100 products', 'Orders and customers', 'Email support'] },
  { name: 'Pro', monthly: 49, blurb: 'For a growing team.', features: ['10 seats', 'Unlimited products', 'Wholesale invoices', 'Journal with the full editor', 'Priority support'], current: true },
  { name: 'Business', monthly: 129, blurb: 'For several shops and warehouses.', features: ['Unlimited seats', 'Several stores', 'Roles and approvals', 'Audit log', 'A named contact'] },
];

export function Pricing() {
  useTitle('Pricing');
  const [period, setPeriod] = React.useState<'monthly' | 'yearly'>('monthly');
  const price = (monthly: number) => (period === 'yearly' ? Math.round(monthly * 10) : monthly);
  return (
    <div className="lk-screen">
      <PageHeader title="Plans" subtitle="Change or cancel at any time. Yearly billing gets you two months free." />
      <ToggleGroup className="lk-center" value={period} aria-label="Billing period" onValueChange={(detail) => { if (detail.value) setPeriod(detail.value as 'monthly' | 'yearly'); }}>
        <ToggleGroup.Item value="monthly">Monthly</ToggleGroup.Item>
        <ToggleGroup.Item value="yearly">Yearly</ToggleGroup.Item>
      </ToggleGroup>
      <div className="lk-grid-3 lk-plans">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={plan.current ? 'lk-plan-card is-current' : 'lk-plan-card'}>
            <div className="lk-row"><h2 className="lk-section-title">{plan.name}</h2>{plan.current ? <Badge tone="brand" variant="soft" size="sm">Your plan</Badge> : null}</div>
            <p className="lk-muted">{plan.blurb}</p>
            <p className="lk-price-big"><strong>${price(plan.monthly)}</strong> <span className="lk-muted">/ {period === 'yearly' ? 'year' : 'month'}</span></p>
            <ul className="lk-features">
              {plan.features.map((feature) => <li key={feature}><Icon name="check" decorative /> {feature}</li>)}
            </ul>
            <Button variant={plan.current ? 'secondary' : 'primary'} disabled={plan.current} onClick={() => toastApi.success(`Switched to ${plan.name}`)}>{plan.current ? 'Current plan' : `Choose ${plan.name}`}</Button>
          </Card>
        ))}
      </div>
      <Card>
        <Card.Header><Card.Title as="h2">Questions</Card.Title></Card.Header>
        <Accordion>
          <Accordion.Item>
            <Accordion.Trigger>Can I change plans later?</Accordion.Trigger>
            <Accordion.Panel>Yes. Upgrades apply at once; downgrades at the end of the billing period.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Trigger>What counts as a seat?</Accordion.Trigger>
            <Accordion.Panel>Anyone who can sign in. Customers and wholesale buyers are free.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Trigger>Do you take bank transfers?</Accordion.Trigger>
            <Accordion.Panel>On yearly Business plans, yes.</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card>
    </div>
  );
}
