import React from 'react';
import { Alert } from '@editora/ui-react/Alert';
import { Avatar } from '@editora/ui-react/Avatar';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { Checkbox } from '@editora/ui-react/Checkbox';
import { ColorPicker } from '@editora/ui-react/ColorPicker';
import { DataTable } from '@editora/ui-react/DataTable';
import { FileUpload } from '@editora/ui-react/FileUpload';
import { Form } from '@editora/ui-react/Form';
import { Input } from '@editora/ui-react/Input';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { PasswordField } from '@editora/ui-react/PasswordField';
import { RadioGroup } from '@editora/ui-react/RadioGroup';
import { Select } from '@editora/ui-react/Select';
import { Slider } from '@editora/ui-react/Slider';
import { Switch } from '@editora/ui-react/Switch';
import { Tabs } from '@editora/ui-react/Tabs';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { useAlertDialog } from '@editora/ui-react/AlertDialogProvider';
import { ACCOUNT, changePassword, initials, saveAccount, TEAM } from '../../../shared/data';
import { navigate, useTitle } from '../lib/router';
import { RichText } from '../lib/RichText';

const TABS = ['general', 'notifications', 'security', 'billing', 'team'] as const;
const TAB_LABEL = { general: 'General', notifications: 'Notifications', security: 'Security', billing: 'Billing', team: 'Team' } as const;

/** Settings: one tab per area, each a different kind of form. Tabs are links (#/settings/security). */
export function Settings({ tab }: { tab?: string }) {
  useTitle('Settings');
  const current = (TABS as readonly string[]).includes(tab || '') ? (tab as typeof TABS[number]) : 'general';
  return (
    <div className="lk-screen lk-screen-narrow">
      <PageHeader title="Settings" subtitle="Your account, notifications, security, billing and team." />
      <Tabs variant="underline" aria-label="Settings sections" value={current}>
        {TABS.map((value) => (
          <React.Fragment key={value}>
            <Tabs.Tab value={value} href={`#/settings/${value}`}>{TAB_LABEL[value]}</Tabs.Tab>
            <Tabs.Panel>{value === current ? <Section tab={value} /> : null}</Tabs.Panel>
          </React.Fragment>
        ))}
      </Tabs>
    </div>
  );
}

function Section({ tab }: { tab: typeof TABS[number] }) {
  if (tab === 'notifications') return <Notifications />;
  if (tab === 'security') return <Security />;
  if (tab === 'billing') return <Billing />;
  if (tab === 'team') return <Team />;
  return <General />;
}

function General() {
  const [errors, setErrors] = React.useState<Record<string, string> | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [bio, setBio] = React.useState(ACCOUNT.bio);
  const save = async (values: Record<string, unknown>) => {
    setSaving(true);
    const result = await saveAccount({ name: String(values.name ?? ''), email: String(values.email ?? ''), timezone: String(values.timezone ?? ''), bio });
    setSaving(false);
    if (!result.ok) { setErrors(result.errors); return; }
    setErrors(null);
    toastApi.success('Profile saved');
  };
  return (
    <Card>
      <Form errors={errors} onSubmit={save} loading={saving} aria-label="Profile" guardUnsaved>
        <div className="lk-stack">
          <div className="lk-person">
            <Avatar initials={initials(ACCOUNT.name)} size="64px" alt="" variant="soft" />
            <FileUpload name="photo" label="Photo" accept="image/*" description="A square image, at least 256 px." />
          </div>
          <div className="lk-form-grid">
            <Input name="name" label="Full name" defaultValue={ACCOUNT.name} required />
            <Input name="email" label="Email" type="email" defaultValue={ACCOUNT.email} required />
            <Select name="timezone" label="Time zone" defaultValue={ACCOUNT.timezone}>
              {['Europe/Lisbon', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'Asia/Kolkata', 'Asia/Tokyo'].map((zone) => <option key={zone} value={zone}>{zone.replace('_', ' ')}</option>)}
            </Select>
            <Select name="language" label="Language" defaultValue="en">
              <option value="en">English</option><option value="pt">Português</option><option value="de">Deutsch</option>
            </Select>
          </div>
          <div className="lk-field">
            <span className="lk-field-label" id="bio-label">Bio</span>
            <RichText className="lk-editor" labelledBy="bio-label" value={bio} onChange={setBio} minHeight={120} placeholder="A line or two about you" />
          </div>
          <div className="lk-actions"><Button type="submit" loading={saving}>Save changes</Button></div>
        </div>
      </Form>
    </Card>
  );
}

function Notifications() {
  const [digest, setDigest] = React.useState('daily');
  return (
    <Card>
      <div className="lk-stack">
        <h2 className="lk-section-title">Email me about</h2>
        <Switch label="New orders" description="One email per order, as it comes in." checked onChange={() => {}} />
        <Switch label="Low stock" description="When a published product has fewer than 8 left." checked onChange={() => {}} />
        <Switch label="Comments on journal posts" description="Only on posts you wrote." onChange={() => {}} />
        <h2 className="lk-section-title">Summary</h2>
        <RadioGroup
          aria-label="Summary email"
          value={digest}
          onValueChange={(detail) => setDigest(detail.value)}
          options={[
            { value: 'off', label: 'Off' },
            { value: 'daily', label: 'Every morning', description: 'Sales, orders and stock at 8:00.' },
            { value: 'weekly', label: 'Every Monday', description: 'The week in one email.' },
          ]}
        />
        <h2 className="lk-section-title">Low stock threshold</h2>
        <Slider label="Warn me below" min={0} max={50} step={1} value={8} showValue marks={[0, 10, 20, 30, 40, 50]} />
        <div className="lk-actions"><Button onClick={() => toastApi.success('Notification settings saved')}>Save</Button></div>
      </div>
    </Card>
  );
}

function Security() {
  const [errors, setErrors] = React.useState<Record<string, string> | null>(null);
  const [saving, setSaving] = React.useState(false);
  const dialogs = useAlertDialog();
  const submit = async (values: Record<string, unknown>) => {
    setSaving(true);
    const result = await changePassword(String(values.current || ''), String(values.next || ''));
    setSaving(false);
    if (!result.ok) { setErrors(result.errors); return; }
    setErrors(null);
    toastApi.success('Password changed');
  };
  const signOutAll = async () => {
    const answer = await dialogs.confirm({ title: 'Sign out everywhere?', description: 'Every other browser and phone signed in to Larkspur is signed out.', confirmText: 'Sign out', cancelText: 'Cancel' });
    if (answer.action === 'confirm') toastApi.success('Signed out of 3 other sessions');
  };
  return (
    <div className="lk-stack">
      <Card>
        <Card.Header><Card.Title as="h2">Password</Card.Title><Card.Description>In this demo the current password is larkspur-demo.</Card.Description></Card.Header>
        <Form errors={errors} onSubmit={submit} loading={saving} aria-label="Change password">
          <div className="lk-stack">
            <PasswordField name="current" label="Current password" autoComplete="current-password" required />
            <PasswordField name="next" label="New password" autoComplete="new-password" description="At least 12 characters." required />
            <div className="lk-actions"><Button type="submit" loading={saving}>Change password</Button></div>
          </div>
        </Form>
      </Card>
      <Card>
        <Card.Header><Card.Title as="h2">Two-step sign-in</Card.Title></Card.Header>
        <Alert tone="warning" title="Not set up yet" description="Owners should use an authenticator app. It takes two minutes." />
        <div className="lk-actions"><Button variant="secondary" icon="shield-check">Set up</Button></div>
      </Card>
      <Card>
        <Card.Header><Card.Title as="h2">Sessions</Card.Title></Card.Header>
        <ul className="lk-list">
          <li className="lk-row"><span className="lk-row-main"><span className="cell-title">Chrome on macOS · Lisbon</span><span className="cell-sub">This browser</span></span><Badge tone="success" variant="soft" size="sm">Active now</Badge></li>
          <li className="lk-row"><span className="lk-row-main"><span className="cell-title">Safari on iPhone · Lisbon</span><span className="cell-sub">2 hours ago</span></span></li>
          <li className="lk-row"><span className="lk-row-main"><span className="cell-title">Firefox on Windows · Porto</span><span className="cell-sub">June 9</span></span></li>
        </ul>
        <div className="lk-actions"><Button variant="secondary" tone="danger" onClick={signOutAll}>Sign out everywhere else</Button></div>
      </Card>
    </div>
  );
}

function Billing() {
  return (
    <div className="lk-stack">
      <Card>
        <Card.Header><Card.Title as="h2">Plan</Card.Title></Card.Header>
        <div className="lk-row">
          <span className="lk-row-main"><span className="cell-title">Pro · $49 a month</span><span className="cell-sub">Renews July 1 · 8 of 10 seats</span></span>
          <Button variant="secondary" onClick={() => navigate('/pricing')}>Change plan</Button>
        </div>
      </Card>
      <Card>
        <Card.Header><Card.Title as="h2">Brand colour</Card.Title><Card.Description>Used on invoices and emails.</Card.Description></Card.Header>
        <ColorPicker value="#5b21b6" aria-label="Brand colour" />
      </Card>
      <Card>
        <Card.Header><Card.Title as="h2">Payment method</Card.Title></Card.Header>
        <div className="lk-row"><span className="lk-row-main"><span className="cell-title">Visa ending 4242</span><span className="cell-sub">Expires 08/2028</span></span><Button variant="ghost">Replace</Button></div>
        <Checkbox defaultChecked>Email invoices to accounts@larkspur.example</Checkbox>
      </Card>
    </div>
  );
}

function Team() {
  return (
    <Card>
      <Card.Header><Card.Title as="h2">Team members</Card.Title><Card.Description>8 of 10 seats used.</Card.Description></Card.Header>
      <DataTable aria-label="Team members" hideSummary>
        <table>
          <thead><tr><th style={{ width: '45%' }}>Name</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            {TEAM.map((person) => (
              <tr key={person.email}>
                <td><span className="lk-person"><Avatar initials={initials(person.name)} size="sm" alt="" variant="soft" tone="neutral" /><span><span className="cell-title">{person.name}</span><span className="cell-sub">{person.email}</span></span></span></td>
                <td>{person.role}</td>
                <td><Badge tone={person.status === 'online' ? 'success' : person.status === 'busy' ? 'warning' : 'neutral'} variant="soft" size="sm">{person.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
      <div className="lk-actions"><Button icon="user-plus" onClick={() => toastApi.info('Invitation sent')}>Invite someone</Button></div>
    </Card>
  );
}
