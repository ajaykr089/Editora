import React from 'react';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { Chart } from '@editora/ui-react/Chart';
import { DataTable } from '@editora/ui-react/DataTable';
import { Icon } from '@editora/ui-react/Icon';
import { Stat } from '@editora/ui-react/Stat';
import { Faq, Footer, Pricing, Signup, Testimonials } from './Sections';

type Props = { mode: 'light' | 'dark'; onToggleMode: () => void };

/** Tallyhawk's mark: a stylised tally stroke inside a rounded square. Original artwork. */
function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--ui-color-primary)" />
      <path d="M9 21.5 14.5 9M15 21.5 20.5 9M21 21.5 24 15" stroke="var(--th-on-primary)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M7.5 17.5h17" stroke="var(--th-amber)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function Nav({ mode, onToggleMode }: Props) {
  return (
    <header className="nav">
      <div className="shell nav-row">
        <a className="brand" href="#top" aria-label="Tallyhawk home">
          <Mark />
          <span>Tallyhawk</span>
        </a>
        <nav aria-label="Main" className="nav-links">
          <a href="#product">Product</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#customers">Customers</a>
        </nav>
        <div className="nav-actions">
          <Button variant="ghost" size="sm" aria-label={mode === 'dark' ? 'Use light theme' : 'Use dark theme'} onClick={onToggleMode}>
            <Icon name={mode === 'dark' ? 'sun' : 'moon'} decorative />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { window.location.hash = '#/app'; }}>Sign in</Button>
          <Button size="sm" onClick={() => { window.location.hash = '#/app'; }}>Start free</Button>
        </div>
      </div>
    </header>
  );
}

const RECENT = [
  { who: 'Maya Chen', what: 'Client dinner, Lisbon', amount: '€186.40', status: ['Approved', 'success'] },
  { who: 'Omar Haddad', what: 'Train to Leeds', amount: '£74.20', status: ['Needs receipt', 'warning'] },
  { who: 'Ines Duarte', what: 'Design tool, annual', amount: '$480.00', status: ['In review', 'info'] },
  { who: 'Theo Brandt', what: 'Hotel, two nights', amount: '€312.00', status: ['Approved', 'success'] },
  { who: 'Priya Nair', what: 'Team lunch', amount: '$142.75', status: ['Over policy', 'danger'] },
] as const;

/** A preview of the product, made of the same Editora components as the app. */
function ProductPreview() {
  return (
    <div className="preview" role="img" aria-label="Tallyhawk dashboard: spend this month, approvals waiting and recent expenses">
      <div className="preview-bar" aria-hidden="true">
        <span /><span /><span />
        <div className="preview-url">app.tallyhawk.example/spend</div>
      </div>
      <div className="preview-body" aria-hidden="true">
        <div className="preview-stats">
          <Stat variant="card" size="sm" label="Spend this month" value="$48,210" trend="−6% vs May" tone="success" />
          <Stat variant="card" size="sm" label="Waiting for you" value="12" trend="3 over policy" tone="warning" />
          <Stat variant="card" size="sm" label="Reimbursed" value="$31,980" trend="Paid Friday" tone="brand" />
        </div>
        <div className="preview-grid">
          <div className="preview-panel">
            <Chart type="bar" title="Spend by week" values={[8200, 11400, 9600, 12800, 6210]} labels={['W1', 'W2', 'W3', 'W4', 'W5']} valuePrefix="$" showLegend={false} showSummary={false} interactive={false} />
          </div>
          <div className="preview-panel">
            <DataTable hideSummary compact>
              <table>
                <thead>
                  <tr><th>Expense</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {RECENT.map((row) => (
                    <tr key={row.who}>
                      <td>
                        <span className="cell-title">{row.what}</span>
                        <span className="cell-sub">{row.who}</span>
                      </td>
                      <td className="num">{row.amount}</td>
                      <td><Badge tone={row.status[1]} variant="soft" size="sm">{row.status[0]}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="shell hero-copy">
        <Badge tone="brand" variant="soft" pill>New: approval rules by amount, team and category</Badge>
        <h1>
          Expenses that <span className="highlight">close themselves.</span>
        </h1>
        <p className="lede">
          Snap a receipt, and Tallyhawk fills in the rest: it matches the card payment, checks your policy and routes it to the
          right approver. Month-end goes from days to an afternoon.
        </p>
        <div className="hero-actions">
          <Button size="lg" onClick={() => { window.location.hash = '#/app'; }}>Start free</Button>
          <Button size="lg" variant="secondary" endIcon={<Icon name="arrow-right" decorative />}>See how it works</Button>
        </div>
        <p className="fineprint">14-day trial · No card needed · Cancel any time</p>
      </div>
      <div className="shell" id="product">
        <ProductPreview />
      </div>
    </section>
  );
}

// Invented customer names for the reference site.
const CUSTOMERS = ['Northfield Studio', 'Brightwater', 'Kestrel Labs', 'Oakline Health', 'Marlow & Finch', 'Quayside'];

function Customers() {
  return (
    <section className="customers" id="customers" aria-labelledby="customers-title">
      <div className="shell">
        <h2 id="customers-title" className="eyebrow">Finance teams at 2,400 companies close faster with Tallyhawk</h2>
        <ul className="customer-list">
          {CUSTOMERS.map((name) => <li key={name}>{name}</li>)}
        </ul>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: 'camera', title: 'Receipts in seconds', text: 'Photograph or forward a receipt. Amount, date, merchant and tax are read for you, in 38 currencies.' },
  { icon: 'credit-card', title: 'Card payments matched', text: 'Every card payment finds its receipt automatically, and missing ones are chased for you.' },
  { icon: 'workflow', title: 'Approvals that route themselves', text: 'Rules by amount, team or category send each expense to the right person, with reminders.' },
  { icon: 'shield-check', title: 'Policy checked up front', text: 'Out-of-policy spend is flagged before it is submitted, with the rule it breaks.' },
  { icon: 'wallet', title: 'Reimbursed on schedule', text: 'Approved expenses are paid in one batch on the day you choose, in each person\'s currency.' },
  { icon: 'chart-pie', title: 'Spend you can explain', text: 'Live reports by team, project and category, ready to export to your accounting system.' },
];

function Features() {
  return (
    <section className="features" id="features" aria-labelledby="features-title">
      <div className="shell">
        <p className="eyebrow">Everything between the purchase and the books</p>
        <h2 id="features-title">One place for receipts, approvals and payouts</h2>
        <ul className="feature-grid">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="feature">
              <span className="feature-icon"><Icon name={feature.icon} size={20} decorative /></span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Landing(props: Props) {
  return (
    <>
      <Nav {...props} />
      <main>
        <Hero />
        <Customers />
        <Features />
        <Pricing />
        <Testimonials />
        <Faq />
        <Signup />
      </main>
      <Footer />
    </>
  );
}
