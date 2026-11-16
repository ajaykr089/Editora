import React from 'react';
import { Avatar } from '@editora/ui-react/Avatar';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Progress } from '@editora/ui-react/Progress';
import { Timeline } from '@editora/ui-react/Timeline';
import { ACCOUNT, initials, TEAM } from '../../../shared/data';
import { navigate, useTitle } from '../lib/router';

export function Profile() {
  useTitle('Profile');
  return (
    <div className="lk-screen">
      <PageHeader title="Profile" subtitle="How your team sees you." actions={<Button variant="secondary" icon="pencil" onClick={() => navigate('/settings')}>Edit profile</Button>} />
      <div className="lk-aside-layout lk-aside-left">
        <div className="lk-stack">
          <Card className="lk-profile-card">
            <Avatar initials={initials(ACCOUNT.name)} size="96px" alt="" variant="soft" status="online" />
            <h2 className="lk-h1">{ACCOUNT.name}</h2>
            <p className="lk-muted">{ACCOUNT.role} · {ACCOUNT.company}</p>
            <div className="lk-tags"><Badge tone="brand" variant="soft">Owner</Badge><Badge tone="neutral" variant="outline">Lisbon</Badge></div>
            <dl className="lk-dl">
              <dt>Email</dt><dd>{ACCOUNT.email}</dd>
              <dt>Time zone</dt><dd>{ACCOUNT.timezone}</dd>
              <dt>Member since</dt><dd>March 2021</dd>
            </dl>
          </Card>
          <Card>
            <Card.Header><Card.Title as="h2">Profile strength</Card.Title><Card.Description>Add a photo and a phone number to finish.</Card.Description></Card.Header>
            <Progress value={70} showLabel aria-label="Profile 70% complete" />
          </Card>
        </div>
        <div className="lk-stack">
          <Card>
            <Card.Header><Card.Title as="h2">About</Card.Title></Card.Header>
            <div className="lk-rich" dangerouslySetInnerHTML={{ __html: ACCOUNT.bio }} />
          </Card>
          <Card>
            <Card.Header><Card.Title as="h2">Team</Card.Title><Card.Description>{TEAM.length} people</Card.Description></Card.Header>
            <ul className="lk-team">
              {TEAM.map((person) => (
                <li key={person.name} className="lk-person">
                  <Avatar initials={initials(person.name)} size="md" alt="" variant="soft" tone="neutral" status={person.status} />
                  <span><span className="cell-title">{person.name}</span><span className="cell-sub">{person.role}</span></span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <Card.Header><Card.Title as="h2">Recent activity</Card.Title></Card.Header>
            <Timeline
              items={[
                { title: 'Published "Caring for stoneware"', time: 'Today, 09:12', tone: 'success', active: true },
                { title: 'Refunded order #48344', description: 'Item arrived damaged', time: 'Yesterday', tone: 'danger' },
                { title: 'Invited Zara Okafor', time: 'June 10', tone: 'info' },
                { title: 'Changed the shipping rates', time: 'June 2' },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
