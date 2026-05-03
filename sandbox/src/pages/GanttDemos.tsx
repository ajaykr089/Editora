import React, { useMemo, useState } from 'react';
import { Box, Button, Flex, Gantt, Grid } from '@editora/ui-react';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };
const field: React.CSSProperties = { minHeight: 34, border: '1px solid #dbe4ef', borderRadius: 8, padding: '0 9px', font: 'inherit', fontSize: 13 };

const portfolioTasks = [
  { id: 'foundation', label: 'Foundation Workstream', start: '2026-01-26', end: '2026-03-20', progress: 64, tone: 'info' as const, type: 'summary' as const, assignee: 'Platform' },
  { id: 'requirements', parent: 'foundation', label: 'Requirements mapping', start: '2026-01-26', end: '2026-02-09', progress: 100, tone: 'success' as const, assignee: 'Priya' },
  { id: 'schema', parent: 'foundation', label: 'Schema and permissions model', start: '2026-02-03', end: '2026-02-20', baselineStart: '2026-02-01', baselineEnd: '2026-02-17', progress: 76, tone: 'success' as const, assignee: 'Jon' },
  { id: 'api', parent: 'foundation', label: 'Public API contracts', start: '2026-02-14', end: '2026-03-03', baselineStart: '2026-02-11', baselineEnd: '2026-02-28', progress: 58, tone: 'default' as const, assignee: 'Lena' },
  { id: 'foundation-freeze', parent: 'foundation', label: 'Architecture freeze', start: '2026-03-06', end: '2026-03-06', type: 'milestone' as const, tone: 'info' as const, assignee: 'CAB' },
  { id: 'product', label: 'Product Experience', start: '2026-02-05', end: '2026-04-10', progress: 42, tone: 'default' as const, type: 'summary' as const, assignee: 'Product' },
  { id: 'gantt-ui', parent: 'product', label: 'Planning workspace UI', start: '2026-02-05', end: '2026-03-04', progress: 70, tone: 'success' as const, assignee: 'Ava' },
  { id: 'editorial', parent: 'product', label: 'Editorial review panel', start: '2026-02-18', end: '2026-03-18', progress: 36, tone: 'warning' as const, assignee: 'Maya' },
  { id: 'automation', parent: 'product', label: 'Automation rule builder', start: '2026-03-08', end: '2026-04-07', baselineStart: '2026-03-01', baselineEnd: '2026-03-26', progress: 18, tone: 'danger' as const, assignee: 'Noah', critical: true },
  { id: 'ux-review', parent: 'product', label: 'UX readiness review', start: '2026-04-10', end: '2026-04-10', type: 'milestone' as const, tone: 'warning' as const, assignee: 'Design' },
  { id: 'governance', label: 'Governance and Release', start: '2026-02-24', end: '2026-04-24', progress: 28, tone: 'warning' as const, type: 'summary' as const, assignee: 'PMO' },
  { id: 'security', parent: 'governance', label: 'Security signoff', start: '2026-02-24', end: '2026-03-18', progress: 40, tone: 'warning' as const, assignee: 'Iris' },
  { id: 'migration', parent: 'governance', label: 'Customer migration rehearsal', start: '2026-03-14', end: '2026-04-08', baselineStart: '2026-03-10', baselineEnd: '2026-04-02', progress: 18, tone: 'default' as const, assignee: 'Omar', critical: true },
  { id: 'docs', parent: 'governance', label: 'Developer docs and recipes', start: '2026-03-22', end: '2026-04-18', progress: 12, tone: 'default' as const, assignee: 'Nia', segments: [{ start: '2026-03-22', end: '2026-03-29', progress: 40 }, { start: '2026-04-07', end: '2026-04-18', progress: 5 }] },
  { id: 'launch-ready', parent: 'governance', label: 'Launch readiness', start: '2026-04-24', end: '2026-04-24', type: 'milestone' as const, tone: 'success' as const, assignee: 'PMO' }
];

const portfolioLinks = [
  { id: 'p1', source: 'requirements', target: 'schema', type: 'e2s' as const },
  { id: 'p2', source: 'schema', target: 'api', type: 'e2s' as const },
  { id: 'p3', source: 'api', target: 'foundation-freeze', type: 'e2s' as const },
  { id: 'p4', source: 'foundation-freeze', target: 'gantt-ui', type: 'e2s' as const },
  { id: 'p5', source: 'gantt-ui', target: 'editorial', type: 'e2s' as const },
  { id: 'p6', source: 'editorial', target: 'automation', type: 'e2s' as const },
  { id: 'p7', source: 'security', target: 'migration', type: 'e2s' as const },
  { id: 'p8', source: 'migration', target: 'launch-ready', type: 'e2s' as const },
  { id: 'p9', source: 'docs', target: 'launch-ready', type: 'e2s' as const }
];

const connectorTasks = [
  { id: 'source', label: 'Source task', start: '2026-02-01', end: '2026-02-12', progress: 70, tone: 'success' as const },
  { id: 'target', label: 'Target task', start: '2026-02-18', end: '2026-03-03', progress: 25, tone: 'info' as const },
  { id: 'parallel', label: 'Parallel review', start: '2026-02-01', end: '2026-02-20', progress: 45, tone: 'warning' as const },
  { id: 'checkpoint', label: 'Checkpoint milestone', start: '2026-03-07', end: '2026-03-07', type: 'milestone' as const, tone: 'success' as const }
];

const barTasks = [
  { id: 'summary', label: 'Summary bar', start: '2026-02-01', end: '2026-03-20', type: 'summary' as const, progress: 52, tone: 'info' as const },
  { id: 'normal', label: 'Task bar', start: '2026-02-05', end: '2026-02-24', progress: 64, tone: 'success' as const },
  { id: 'baseline', label: 'Baseline + progress', start: '2026-02-17', end: '2026-03-08', baselineStart: '2026-02-12', baselineEnd: '2026-03-02', progress: 38, tone: 'warning' as const },
  { id: 'split', label: 'Split task', start: '2026-03-03', end: '2026-03-28', progress: 42, tone: 'default' as const, segments: [{ start: '2026-03-03', end: '2026-03-10', progress: 80 }, { start: '2026-03-19', end: '2026-03-28', progress: 18 }] },
  { id: 'critical', label: 'Critical task', start: '2026-03-10', end: '2026-03-24', progress: 12, tone: 'danger' as const, critical: true },
  { id: 'milestone', label: 'Milestone diamond', start: '2026-03-29', end: '2026-03-29', type: 'milestone' as const, tone: 'success' as const }
];

function formatLocalDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createLargeTasks(count: number) {
  const groups = Array.from({ length: Math.ceil(count / 100) }, (_, index) => ({
    id: `group-${index + 1}`,
    label: `Program ${index + 1}`,
    start: '2026-01-01',
    end: '2026-12-31',
    type: 'summary' as const,
    progress: Math.round((index * 7) % 100),
    tone: 'info' as const,
    assignee: 'PMO'
  }));
  const tasks = Array.from({ length: count }, (_, index) => {
    const start = new Date(2026, 0, 1 + (index % 260));
    const end = new Date(2026, 0, 1 + (index % 260) + 4 + (index % 18));
    return {
      id: `task-${index + 1}`,
      parent: `group-${Math.floor(index / 100) + 1}`,
      label: `Implementation task ${index + 1}`,
      start: formatLocalDate(start),
      end: formatLocalDate(end),
      progress: index % 100,
      tone: (index % 11 === 0 ? 'warning' : index % 17 === 0 ? 'danger' : 'default') as const,
      critical: index % 97 === 0,
      assignee: ['Ava', 'Noah', 'Maya', 'Omar', 'Priya'][index % 5]
    };
  });
  return [...groups, ...tasks];
}

function addWorkingDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  let remaining = days;
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    if (![0, 6].includes(date.getDay())) remaining -= 1;
  }
  return formatLocalDate(date);
}

function durationDays(start: string, end?: string) {
  return Math.max(1, Math.round((new Date(`${end || start}T00:00:00`).getTime() - new Date(`${start}T00:00:00`).getTime()) / 86400000));
}

function findCriticalTaskIds(items: typeof portfolioTasks, dependencyLinks: typeof portfolioLinks) {
  const byId = new Map(items.map((task) => [task.id, task]));
  const successors = new Map<string, string[]>();
  dependencyLinks.forEach((link) => {
    const list = successors.get(link.source) || [];
    list.push(link.target);
    successors.set(link.source, list);
  });
  const score = new Map<string, number>();
  const visit = (id: string): number => {
    if (score.has(id)) return score.get(id) || 0;
    const task = byId.get(id);
    if (!task) return 0;
    const own = task.type === 'milestone' ? 0 : durationDays(task.start, task.end);
    const downstream = Math.max(0, ...(successors.get(id) || []).map(visit));
    const total = own + downstream;
    score.set(id, total);
    return total;
  };
  items.forEach((task) => visit(task.id));
  const root = items.reduce((best, task) => (visit(task.id) > visit(best.id) ? task : best), items[0]);
  const critical = new Set<string>();
  let cursor: typeof portfolioTasks[number] | undefined = root;
  while (cursor) {
    critical.add(cursor.id);
    const nextId = (successors.get(cursor.id) || []).sort((a, b) => visit(b) - visit(a))[0];
    cursor = nextId ? byId.get(nextId) : undefined;
  }
  return critical;
}

function reorder<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function GanttDemo() {
  const [tasks, setTasks] = useState(portfolioTasks);
  const [links, setLinks] = useState(portfolioLinks);
  const [selectedId, setSelectedId] = useState('gantt-ui');
  const [selectedLinkId, setSelectedLinkId] = useState('');
  const [query, setQuery] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [barVariant, setBarVariant] = useState<'solid' | 'soft' | 'striped' | 'outline' | 'glass'>('soft');
  const [linkDraft, setLinkDraft] = useState({ source: 'gantt-ui', target: 'editorial', type: 'e2s' as const });
  const [lastAction, setLastAction] = useState('Drag/resize bars, select connectors, or edit a task');
  const largeTasks = useMemo(() => createLargeTasks(10000), []);
  const owners = Array.from(new Set(tasks.map((task) => task.assignee).filter(Boolean))) as string[];
  const selected = tasks.find((task) => task.id === selectedId) || tasks[0];
  const selectedLink = links.find((link) => link.id === selectedLinkId);
  const criticalTaskIds = useMemo(() => findCriticalTaskIds(tasks, links), [tasks, links]);
  const visibleTasks = tasks.filter((task) => {
    if (ownerFilter !== 'all' && task.assignee !== ownerFilter) return false;
    if (query && !`${task.label} ${task.assignee || ''}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }).map((task) => ({ ...task, critical: task.critical || criticalTaskIds.has(task.id) }));

  const updateSelected = (patch: Record<string, unknown>) => {
    setTasks((items) => items.map((task) => task.id === selected.id ? { ...task, ...patch } : task));
  };

  const createTask = () => {
    const id = `task-${Date.now()}`;
    setTasks((items) => [...items, { id, label: 'New planning task', start: selected.start, end: selected.end, progress: 0, tone: 'default' as const, assignee: selected.assignee || 'PMO' }]);
    setSelectedId(id);
    setLastAction(`Created ${id}`);
  };

  const deleteTask = (id: string) => {
    setTasks((items) => items.filter((task) => task.id !== id && task.parent !== id));
    setLinks((items) => items.filter((link) => link.source !== id && link.target !== id));
    setSelectedId(tasks.find((task) => task.id !== id)?.id || '');
    setLastAction(`Deleted ${id}`);
  };

  const addDependency = () => {
    if (!linkDraft.source || !linkDraft.target || linkDraft.source === linkDraft.target) return;
    const id = `link-${Date.now()}`;
    setLinks((items) => [...items, { ...linkDraft, id }]);
    setSelectedLinkId(id);
    setLastAction(`Created ${linkDraft.type} dependency ${linkDraft.source} to ${linkDraft.target}`);
  };

  const autoSchedule = () => {
    setTasks((items) => {
      const next = items.map((task) => ({ ...task }));
      const byId = new Map(next.map((task) => [task.id, task]));
      links.forEach((link) => {
        const source = byId.get(link.source);
        const target = byId.get(link.target);
        if (!source || !target || target.type === 'summary') return;
        const earliest = addWorkingDays(source.end || source.start, 1);
        if (new Date(`${target.start}T00:00:00`) < new Date(`${earliest}T00:00:00`)) {
          const length = durationDays(target.start, target.end);
          target.start = earliest;
          target.end = target.type === 'milestone' ? earliest : addWorkingDays(earliest, length);
        }
      });
      return next;
    });
    setLastAction('Auto-scheduled dependent tasks using working days');
  };

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', display: 'grid', gap: 16 }}>
      <h2 style={h2}>Gantt</h2>

      <div style={{ ...panel, display: 'grid', gap: 14 }}>
        <Flex style={{ alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ ...h3, marginBottom: 4 }}>Full planning workspace</h3>
            <div style={{ color: '#64748b', fontSize: 13 }}>Storybook-style task grid + timeline with editing, links, bars, connectors, and scheduling controls.</div>
          </div>
          <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button size="sm" variant="secondary" onClick={() => setLastAction(`Export ready: ${JSON.stringify({ tasks, links }).length} characters`)}>Export</Button>
            <Button size="sm" variant="secondary" onClick={() => { setTasks(portfolioTasks); setLinks(portfolioLinks); setLastAction('Imported sample portfolio'); }}>Import sample</Button>
            <Button size="sm" variant="secondary" onClick={autoSchedule}>Auto schedule</Button>
            <Button size="sm" onClick={createTask}>New task</Button>
          </Flex>
        </Flex>

        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
          <Box style={{ border: '1px solid #dbe4ef', borderRadius: 10, padding: 12 }}><div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Tracked tasks</div><strong style={{ display: 'block', fontSize: 22, marginTop: 6 }}>{tasks.length}</strong></Box>
          <Box style={{ border: '1px solid #dbe4ef', borderRadius: 10, padding: 12 }}><div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Dependencies</div><strong style={{ display: 'block', fontSize: 22, marginTop: 6 }}>{links.length}</strong></Box>
          <Box style={{ border: '1px solid #dbe4ef', borderRadius: 10, padding: 12 }}><div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Milestones</div><strong style={{ display: 'block', fontSize: 22, marginTop: 6 }}>{tasks.filter((task) => task.type === 'milestone').length}</strong></Box>
          <Box style={{ border: '1px solid #dbe4ef', borderRadius: 10, padding: 12 }}><div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Split tasks</div><strong style={{ display: 'block', fontSize: 22, marginTop: 6 }}>{tasks.filter((task) => task.segments?.length).length}</strong></Box>
        </Grid>

        <Grid style={{ gap: 14, gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 340px)', alignItems: 'start' }}>
          <Box style={{ border: '1px solid #dbe4ef', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
            <Flex style={{ padding: 12, gap: 8, borderBottom: '1px solid #dbe4ef', flexWrap: 'wrap' }}>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by task or owner" style={{ ...field, flex: '1 1 240px' }} />
              <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} style={field}>
                <option value="all">All owners</option>
                {owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
              </select>
              <select value={barVariant} onChange={(event) => setBarVariant(event.target.value as typeof barVariant)} style={field}>
                <option value="solid">Solid bars</option>
                <option value="soft">Soft bars</option>
                <option value="striped">Striped bars</option>
                <option value="outline">Outline bars</option>
                <option value="glass">Glass bars</option>
              </select>
            </Flex>
            <Gantt
              tasks={visibleTasks}
              links={links}
              zoom="week"
              sort="start"
              barVariant={barVariant}
              showToday
              onTaskChange={(detail) => {
                setTasks((items) => items.map((task) => task.id === detail.id ? { ...task, start: detail.start || task.start, end: detail.end || task.end } : task));
                setLastAction(`Updated ${detail.id}: ${detail.start || ''} ${detail.end || ''}`.trim());
              }}
              onTaskSelect={(detail) => {
                setSelectedId(detail.id);
                setLastAction(`Selected task ${detail.id}`);
              }}
              onTaskDelete={(detail) => deleteTask(detail.id)}
              onLinkSelect={(detail) => {
                setSelectedLinkId(detail.id);
                setLastAction(`Selected ${detail.type} connector ${detail.source} to ${detail.target}`);
              }}
            />
          </Box>

          <Box style={{ display: 'grid', gap: 12 }}>
            <Box style={{ border: '1px solid #dbe4ef', borderRadius: 12, padding: 14 }}>
              <div style={{ color: '#64748b', fontSize: 12, fontWeight: 750, textTransform: 'uppercase' }}>Selected task</div>
              <input value={selected.label} onChange={(event) => updateSelected({ label: event.target.value })} style={{ ...field, width: '100%', marginTop: 8, fontWeight: 700 }} />
              <input value={selected.assignee || ''} onChange={(event) => updateSelected({ assignee: event.target.value })} placeholder="Owner" style={{ ...field, width: '100%', marginTop: 8 }} />
              <Grid style={{ gap: 8, marginTop: 12 }}>
                <label style={{ display: 'grid', gap: 4, fontSize: 12, color: '#64748b' }}>Start<input type="date" value={selected.start} onChange={(event) => updateSelected({ start: event.target.value })} style={field} /></label>
                <label style={{ display: 'grid', gap: 4, fontSize: 12, color: '#64748b' }}>End<input type="date" value={selected.end || selected.start} onChange={(event) => updateSelected({ end: event.target.value })} style={field} /></label>
                <label style={{ display: 'grid', gap: 4, fontSize: 12, color: '#64748b' }}>Progress<input type="number" min={0} max={100} value={selected.progress ?? 0} onChange={(event) => updateSelected({ progress: Number(event.target.value) })} style={field} /></label>
              </Grid>
              <Grid style={{ gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                <Button size="sm" variant="secondary" onClick={() => setTasks((items) => reorder(items, Math.max(0, items.findIndex((task) => task.id === selected.id)), Math.max(0, items.findIndex((task) => task.id === selected.id) - 1)))}>Move up</Button>
                <Button size="sm" variant="secondary" onClick={() => setTasks((items) => reorder(items, items.findIndex((task) => task.id === selected.id), Math.min(items.length - 1, items.findIndex((task) => task.id === selected.id) + 1)))}>Move down</Button>
                <Button size="sm" variant="danger" style={{ gridColumn: '1 / -1' }} onClick={() => deleteTask(selected.id)}>Delete task</Button>
              </Grid>
            </Box>

            <Box style={{ border: '1px solid #dbe4ef', borderRadius: 12, padding: 14 }}>
              <strong style={{ fontSize: 14 }}>Link and connector editor</strong>
              <Grid style={{ gap: 8, marginTop: 10 }}>
                <select value={linkDraft.source} onChange={(event) => setLinkDraft((draft) => ({ ...draft, source: event.target.value }))} style={field}>{tasks.map((task) => <option key={task.id} value={task.id}>{task.label}</option>)}</select>
                <select value={linkDraft.target} onChange={(event) => setLinkDraft((draft) => ({ ...draft, target: event.target.value }))} style={field}>{tasks.map((task) => <option key={task.id} value={task.id}>{task.label}</option>)}</select>
                <select value={linkDraft.type} onChange={(event) => setLinkDraft((draft) => ({ ...draft, type: event.target.value as typeof linkDraft.type }))} style={field}>
                  <option value="e2s">Finish to start</option>
                  <option value="s2s">Start to start</option>
                  <option value="e2e">Finish to finish</option>
                  <option value="s2e">Start to finish</option>
                </select>
                <Button size="sm" variant="secondary" onClick={addDependency}>Add dependency link</Button>
              </Grid>
              {selectedLink ? <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: '#eff6ff', color: '#1d4ed8', fontSize: 12 }}>Selected {selectedLink.type || 'e2s'} connector: {selectedLink.source} to {selectedLink.target}</div> : null}
              {links.slice(-5).map((link) => (
                <Flex key={link.id} style={{ justifyContent: 'space-between', gap: 8, padding: '8px 0', borderTop: '1px solid #edf2f7', fontSize: 12 }}>
                  <button style={{ border: 0, background: 'transparent', padding: 0, textAlign: 'left', color: selectedLinkId === link.id ? '#1d4ed8' : '#0f172a', cursor: 'pointer' }} onClick={() => setSelectedLinkId(link.id)}>{link.source} to {link.target} <span style={{ color: '#64748b' }}>({link.type || 'e2s'})</span></button>
                  <button style={{ border: 0, background: 'transparent', color: '#b91c1c', cursor: 'pointer' }} onClick={() => setLinks((items) => items.filter((item) => item.id !== link.id))}>Delete</button>
                </Flex>
              ))}
            </Box>
          </Box>
        </Grid>
        <div style={{ border: '1px solid #dbe4ef', borderRadius: 10, padding: '10px 12px', color: '#475569', fontSize: 13, background: '#f8fafc' }}>{lastAction}</div>
      </div>

      <div style={panel}>
        <h3 style={h3}>Focused examples</h3>
        <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))' }}>
          <Box>
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Calendar view - day scale</div>
            <Gantt tasks={portfolioTasks.slice(0, 6)} links={portfolioLinks.slice(0, 3)} zoom="day" showToday sort="start" barVariant="soft" />
          </Box>
          <Box>
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Links and connectors</div>
            <Gantt
              tasks={connectorTasks}
              links={[
                { id: 'focused-e2s', source: 'source', target: 'target', type: 'e2s' },
                { id: 'focused-s2e', source: 'parallel', target: 'checkpoint', type: 's2e' }
              ]}
              zoom="week"
              barVariant="outline"
              showToolbar={false}
              onLinkSelect={(detail) => setLastAction(`Selected ${detail.type} connector ${detail.source} to ${detail.target}`)}
            />
          </Box>
          <Box>
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Bar types - summary, task, milestone, split, baseline</div>
            <Gantt tasks={barTasks} links={[{ id: 'focused-bar-link', source: 'normal', target: 'baseline', type: 'e2s' }]} zoom="week" barVariant="striped" showToolbar={false} />
          </Box>
          <Box>
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Calendar view - month scale</div>
            <Gantt tasks={portfolioTasks} links={portfolioLinks} zoom="month" sort="start" barVariant="glass" />
          </Box>
        </Grid>
      </div>

      <div style={panel}>
        <h3 style={h3}>Calendar view / time scale examples</h3>
        <Grid style={{ gap: 16 }}>
          {(['day', 'week', 'month', 'quarter', 'year'] as const).map((zoom) => (
            <div key={zoom}>
              <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'capitalize' }}>{zoom} calendar view</div>
              <Gantt tasks={portfolioTasks.slice(0, 8)} links={portfolioLinks.slice(0, 4)} zoom={zoom} showToday sort="start" barVariant="soft" />
            </div>
          ))}
        </Grid>
      </div>

      <div style={panel}>
        <h3 style={h3}>Bar examples: task, summary, milestone, baseline, split, critical</h3>
        <Grid style={{ gap: 16 }}>
          {(['solid', 'soft', 'striped', 'outline', 'glass'] as const).map((variant) => (
            <div key={variant}>
              <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'capitalize' }}>{variant} bar design</div>
              <Gantt tasks={barTasks} links={[{ id: `${variant}-1`, source: 'normal', target: 'baseline', type: 'e2s' }, { id: `${variant}-2`, source: 'critical', target: 'milestone', type: 'e2s' }]} zoom="week" barVariant={variant} showToolbar={false} />
            </div>
          ))}
        </Grid>
      </div>

      <div style={panel}>
        <h3 style={h3}>Connector and arrowhead examples</h3>
        <Grid style={{ gap: 16 }}>
          {(['e2s', 's2s', 'e2e', 's2e'] as const).map((type) => (
            <div key={type}>
              <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{type.toUpperCase()} connector routing</div>
              <Gantt
                tasks={connectorTasks}
                links={[
                  { id: `${type}-source-target`, source: 'source', target: 'target', type },
                  { id: `${type}-parallel-checkpoint`, source: 'parallel', target: 'checkpoint', type }
                ]}
                zoom="week"
                barVariant="outline"
                showToolbar={false}
                onLinkSelect={(detail) => setLastAction(`Selected ${detail.type} connector ${detail.source} to ${detail.target}`)}
              />
            </div>
          ))}
        </Grid>
      </div>

      <div style={panel}>
        <h3 style={h3}>Storybook portfolio variants</h3>
        <Grid style={{ gap: 16 }}>
          <Box variant="contrast" p="12px" radius="lg"><Gantt tasks={portfolioTasks.slice(0, 6)} links={portfolioLinks.slice(0, 3)} variant="contrast" zoom="week" /></Box>
          <Gantt tasks={portfolioTasks.slice(0, 8)} links={portfolioLinks.slice(0, 4)} readonly zoom="month" />
          <Gantt tasks={portfolioTasks} links={portfolioLinks} zoom="month" sort="start" barVariant="outline" />
          <Gantt tasks={portfolioTasks.filter((task) => task.type === 'milestone' || !task.parent)} zoom="month" sort="start" barVariant="glass" readonly />
        </Grid>
      </div>

      <div style={panel}>
        <h3 style={h3}>Large dataset - 10,000 tasks</h3>
        <Gantt tasks={largeTasks} zoom="month" sort="start" barVariant="outline" />
      </div>
    </div>
  );
}
