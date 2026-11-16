import React from 'react';
import { Avatar } from '@editora/ui-react/Avatar';
import { Badge } from '@editora/ui-react/Badge';
import { Card } from '@editora/ui-react/Card';
import { Chart } from '@editora/ui-react/Chart';
import { Gantt } from '@editora/ui-react/Gantt';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Progress } from '@editora/ui-react/Progress';
import { Stat } from '@editora/ui-react/Stat';
import { initials, projectSummary, shortDate, wholeMoney, type Project } from '../../../shared/data';
import { useLoad } from '../lib/ui';
import { useTitle } from '../lib/router';

const STATUS: Record<Project['status'], { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  'on-track': { label: 'On track', tone: 'success' },
  'at-risk': { label: 'At risk', tone: 'warning' },
  late: { label: 'Late', tone: 'danger' },
  done: { label: 'Done', tone: 'neutral' },
};

export function Projects() {
  useTitle('Projects');
  const { data } = useLoad(projectSummary, []);
  const active = data ? data.projects.filter((p) => p.status !== 'done') : [];

  return (
    <div className="lk-screen">
      <PageHeader title="Projects" subtitle="Everything the team is shipping, and how the hours are going." />

      <div className="lk-stats">
        <Stat variant="card" label="Active projects" value={data ? String(active.length) : '…'} trend={data ? `${active.filter((p) => p.status !== 'on-track').length} need attention` : ''} tone="warning" icon="briefcase" />
        <Stat variant="card" label="Budget used" value={data ? wholeMoney(active.reduce((s, p) => s + p.spent, 0)) : '…'} trend={data ? `of ${wholeMoney(active.reduce((s, p) => s + p.budget, 0))}` : ''} tone="brand" icon="wallet" />
        <Stat variant="card" label="Hours this week" value={data ? String(data.hours.reduce((s, h) => s + h.value, 0)) : '…'} trend="Across 14 people" tone="info" icon="clock" />
        <Stat variant="card" label="Next milestone" value="Store relaunch" trend="June 24" tone="success" icon="rocket" />
      </div>

      <Card>
        <Card.Header>
          <Card.Title as="h2">Timeline</Card.Title>
          <Card.Description>Drag a bar to move it; dependent tasks follow.</Card.Description>
        </Card.Header>
        {data ? (
          <Gantt
            aria-label="Project timeline"
            tasks={data.gantt}
            links={data.links}
            zoom="week"
            showToday
            maxHeight={420}
            schedule="auto"
            cascade
            nonWorkingDays="weekend"
          />
        ) : null}
      </Card>

      <div className="lk-grid-3">
        <Card className="lk-span-2">
          <Card.Header>
            <Card.Title as="h2">Projects</Card.Title>
          </Card.Header>
          <ul className="lk-list">
            {(data?.projects || []).map((project) => (
              <li key={project.id} className="lk-row lk-project">
                <span className="lk-row-main">
                  <span className="cell-title">{project.name}</span>
                  <span className="cell-sub">{project.client} · due {shortDate(project.due)}</span>
                </span>
                <span className="lk-avatars" aria-label={`Team: ${project.members.join(', ')}`}>
                  {project.members.slice(0, 3).map((member) => (
                    <Avatar key={member} initials={initials(member)} size="sm" alt="" variant="soft" tone="neutral" />
                  ))}
                  {project.members.length > 3 ? <span className="lk-more">+{project.members.length - 3}</span> : null}
                </span>
                <span className="lk-row-progress">
                  <Progress value={project.progress} size="sm" tone={STATUS[project.status].tone === 'neutral' ? 'neutral' : STATUS[project.status].tone} aria-label={`${project.name} progress`} />
                  <span className="num">{project.progress}%</span>
                </span>
                <Badge tone={STATUS[project.status].tone} variant="soft" size="sm">{STATUS[project.status].label}</Badge>
              </li>
            ))}
          </ul>
        </Card>
        <Chart type="bar" headingLevel={2} title="Hours logged" subtitle="This week" data={data?.hours || []} valueSuffix=" h" showLegend={false} showSummary={false} state={data ? 'idle' : 'loading'} />
      </div>
    </div>
  );
}
