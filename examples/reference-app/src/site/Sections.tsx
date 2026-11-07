import React from 'react';
import { Accordion } from '@editora/ui-react/Accordion';
import { Avatar } from '@editora/ui-react/Avatar';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { Form } from '@editora/ui-react/Form';
import { Icon } from '@editora/ui-react/Icon';
import { Input } from '@editora/ui-react/Input';
import { ToggleGroup } from '@editora/ui-react/ToggleGroup';

type Billing = 'monthly' | 'yearly';

const PLANS = [
  {
    name: 'Starter',
    blurb: 'For founders and small teams getting receipts out of inboxes.',
    price: { monthly: 0, yearly: 0 },
    unit: 'free for up to 3 people',
    cta: 'Start free',
    features: ['Receipt capture and reading', 'Card payment matching', 'One approval step', 'Export to CSV'],
  },
  {
    name: 'Team',
    blurb: 'For growing teams that want month-end to run itself.',
    price: { monthly: 8, yearly: 6 },
    unit: 'per person / month',
    cta: 'Start 14-day trial',
    popular: true,
    features: ['Everything in Starter', 'Approval rules by amount and team', 'Policy checks before submit', 'Reimbursements in 30 currencies', 'Accounting integrations'],
  },
  {
    name: 'Business',
    blurb: 'For finance teams with several entities and an audit to pass.',
    price: { monthly: 14, yearly: 11 },
    unit: 'per person / month',
    cta: 'Talk to us',
    features: ['Everything in Team', 'Several entities and currencies', 'Custom roles and audit log', 'Single sign-on', 'A named account manager'],
  },
] as const;

export function Pricing() {
  const [billing, setBilling] = React.useState<Billing>('yearly');
  return (
    <section className="pricing" id="pricing" aria-labelledby="pricing-title">
      <div className="shell">
        <p className="eyebrow">Pricing</p>
        <h2 id="pricing-title" className="section-title">Simple per-person pricing</h2>
        <div className="billing-toggle">
          <ToggleGroup
            value={billing}
            onValueChange={(detail) => setBilling((Array.isArray(detail.value) ? detail.value[0] : detail.value) === 'monthly' ? 'monthly' : 'yearly')}
            aria-label="Billing period"
            variant="soft"
            shape="pill"
          >
            <ToggleGroup.Item value="monthly">Monthly</ToggleGroup.Item>
            <ToggleGroup.Item value="yearly">Yearly · save 25%</ToggleGroup.Item>
          </ToggleGroup>
        </div>
        <ul className="plans">
          {PLANS.map((plan) => {
            const popular = 'popular' in plan && plan.popular;
            const price = plan.price[billing];
            return (
              <li key={plan.name} className={`plan${popular ? ' plan-popular' : ''}`}>
                <div className="plan-head">
                  <h3>{plan.name}</h3>
                  {popular ? <Badge tone="brand" variant="solid" size="sm" pill>Most popular</Badge> : null}
                </div>
                <p className="plan-blurb">{plan.blurb}</p>
                <p className="plan-price">
                  <span className="amount">${price}</span>
                  <span className="unit">{plan.unit}</span>
                </p>
                <p className="plan-billing">{price === 0 ? 'No card needed' : billing === 'yearly' ? 'Billed yearly' : 'Billed monthly'}</p>
                <Button block variant={popular ? 'primary' : 'secondary'}>{plan.cta}</Button>
                <ul className="plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}><Icon name="check" size={16} decorative />{feature}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// Invented people and companies for the reference site.
const QUOTES = [
  { quote: 'We used to lose the last three days of every month to receipts. Now the close is done by lunch on the first.', name: 'Hannah Okafor', role: 'Head of Finance, Brightwater', initials: 'HO' },
  { quote: 'The approval rules were the reason we switched. Managers see only what needs them, and nobody chases anyone.', name: 'Daniel Ruiz', role: 'Operations Lead, Kestrel Labs', initials: 'DR' },
  { quote: 'Our people get reimbursed on Friday, every Friday, in their own currency. That alone changed how the team feels about expenses.', name: 'Sofia Lindqvist', role: 'COO, Quayside', initials: 'SL' },
];

export function Testimonials() {
  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <div className="shell">
        <p className="eyebrow">Customers</p>
        <h2 id="testimonials-title" className="section-title">Finance teams that stopped chasing receipts</h2>
        <ul className="quotes">
          {QUOTES.map((item) => (
            <li key={item.name} className="quote">
              <blockquote>“{item.quote}”</blockquote>
              <div className="quote-person">
                <Avatar initials={item.initials} size="md" tone="neutral" variant="soft" alt="" />
                <div>
                  <div className="quote-name">{item.name}</div>
                  <div className="quote-role">{item.role}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const QUESTIONS = [
  ['How long does it take to set up?', 'Most teams are submitting expenses the same day: connect your company cards, invite people, and pick an approval rule. Policies and integrations can follow.'],
  ['Which cards and banks do you support?', 'Corporate cards from the major networks and most business bank accounts. Card payments arrive within minutes of the purchase.'],
  ['Can approvals follow our org chart?', 'Yes. Rules can route by amount, team, project or category, with a second approver above a limit and a fallback when someone is away.'],
  ['How do reimbursements work?', 'Approved expenses are paid in one batch on the day you choose, in each person\'s currency, from the account you connect.'],
  ['Is our data safe?', 'Data is encrypted in transit and at rest, access is logged, and Business plans add single sign-on and custom roles.'],
];

export function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="shell faq-grid">
        <div>
          <p className="eyebrow eyebrow-start">Questions</p>
          <h2 id="faq-title" className="section-title section-title-start">Answers before you ask</h2>
          <p className="muted">Something else? Our team answers within a working day.</p>
        </div>
        <Accordion collapsible variant="outline" radius="var(--base-card-radius)">
          {QUESTIONS.map(([question, answer]) => (
            <Accordion.Item key={question}>
              <Accordion.Trigger>{question}</Accordion.Trigger>
              <Accordion.Panel><p className="faq-answer">{answer}</p></Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/**
 * The signup form talks to a pretend server: an address containing "taken" comes back as already
 * registered, shown on the field with Form's `errors` prop, as a real API's 422 response would be.
 */
export function Signup() {
  const [errors, setErrors] = React.useState<Record<string, string> | null>(null);
  const [done, setDone] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const submit = async (values: Record<string, unknown>) => {
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setBusy(false);
    const email = String(values.email || '');
    if (/taken/i.test(email)) {
      setErrors({ email: 'This address already has an account. Sign in instead?' });
      return;
    }
    setDone(email);
  };

  return (
    <section className="signup" id="signup" aria-labelledby="signup-title">
      <div className="shell">
      <div className="signup-card">
        <div>
          <h2 id="signup-title">Close this month faster</h2>
          <p>Start free in two minutes. No card needed, and your data comes with you if you leave.</p>
        </div>
        {done ? (
          <p className="signup-done" role="status"><Icon name="check-circle" size={20} decorative /> Check {done} for your sign-in link.</p>
        ) : (
          <Form className="signup-form" errors={errors} onSubmit={submit} loading={busy} aria-label="Start free">
            <Input name="email" type="email" label="Work email" placeholder="you@company.com" size="lg" required />
            <Button type="submit" size="lg" variant="secondary" loading={busy}>Start free</Button>
          </Form>
        )}
      </div>
      </div>
    </section>
  );
}

const FOOTER = [
  ['Product', ['Receipts', 'Approvals', 'Reimbursements', 'Reports', 'Pricing']],
  ['Company', ['About', 'Customers', 'Careers', 'Contact']],
  ['Resources', ['Help centre', 'Guides', 'API', 'Status']],
] as const;

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <span className="brand-name">Tallyhawk</span>
          <p>Expenses that close themselves.</p>
        </div>
        {FOOTER.map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <h3>{title}</h3>
            <ul>
              {links.map((link) => <li key={link}><a href="#top">{link}</a></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="shell">
        <p className="footer-bottom">© 2026 Tallyhawk. A fictional product, built with Editora UI as a design reference.</p>
      </div>
    </footer>
  );
}
