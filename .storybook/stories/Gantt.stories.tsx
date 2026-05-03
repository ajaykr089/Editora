import React from 'react';
import { Box, Gantt } from '@editora/ui-react';

export default {
  title: 'UI/Gantt',
  component: Gantt
};

const tasks = [
  { id: 'launch', label: 'Launch Program', start: '2026-02-01', end: '2026-03-14', progress: 58, tone: 'info' as const, type: 'summary' as const },
  { id: '1', parent: 'launch', label: 'Admissions Module', start: '2026-02-01', end: '2026-02-14', progress: 88, tone: 'success' as const, assignee: 'Maya' },
  { id: '2', parent: 'launch', label: 'Billing Integrations', start: '2026-02-05', end: '2026-02-22', progress: 54, tone: 'warning' as const, assignee: 'Noah' },
  { id: '3', parent: 'launch', label: 'Staff Scheduling', start: '2026-02-11', end: '2026-02-27', progress: 32, tone: 'default' as const, assignee: 'Ava' },
  { id: '4', parent: 'launch', label: 'Audit + Compliance', start: '2026-02-15', end: '2026-03-01', progress: 22, tone: 'danger' as const, assignee: 'Omar' },
  { id: '5', label: 'Partner Handoff', start: '2026-03-06', end: '2026-03-06', type: 'milestone' as const, tone: 'success' as const, assignee: 'PMO' }
];

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

const links = [
  { id: 'l1', source: '1', target: '2', type: 'e2s' as const },
  { id: 'l2', source: '2', target: '4', type: 'e2s' as const },
  { id: 'l3', source: '3', target: '5', type: 'e2s' as const }
];

const barVariants = ['solid', 'soft', 'striped', 'outline', 'glass'] as const;
const linkTypes = ['e2s', 's2s', 'e2e', 's2e'] as const;

const shellButtonStyle: React.CSSProperties = {
  border: '1px solid var(--ui-color-border, #dbe4ef)',
  borderRadius: 8,
  background: '#ffffff',
  color: '#0f172a',
  fontSize: 12,
  fontWeight: 700,
  padding: '8px 10px'
};

const metricStyle: React.CSSProperties = {
  border: '1px solid #dbe4ef',
  borderRadius: 8,
  background: '#ffffff',
  padding: 12,
  minHeight: 74
};

const panelStyle: React.CSSProperties = {
  border: '1px solid #dbe4ef',
  borderRadius: 8,
  background: '#ffffff'
};

const fieldStyle: React.CSSProperties = {
  minHeight: 34,
  border: '1px solid #dbe4ef',
  borderRadius: 8,
  padding: '0 9px',
  font: 'inherit',
  fontSize: 13
};

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
  const items = Array.from({ length: count }, (_, index) => {
    const startOffset = index % 260;
    const duration = 4 + (index % 18);
    const start = new Date(2026, 0, 1 + startOffset);
    const end = new Date(2026, 0, 1 + startOffset + duration);
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
  return [...groups, ...items];
}

function reorder<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function addWorkingDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  let remaining = days;
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return formatLocalDate(date);
}

function durationDays(start: string, end: string) {
  return Math.max(1, Math.round((new Date(`${end}T00:00:00`).getTime() - new Date(`${start}T00:00:00`).getTime()) / 86400000));
}

function findCriticalTaskIds(items: typeof portfolioTasks, links: typeof portfolioLinks) {
  const byId = new Map(items.map((task) => [task.id, task]));
  const successors = new Map<string, string[]>();
  links.forEach((link) => {
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

export const Default = () => (
  <Box style={{ maxWidth: 1040 }}>
    <Gantt tasks={tasks} links={links} />
  </Box>
);

export const InteractivePlanning = () => {
  const [items, setItems] = React.useState(tasks);
  const [lastChange, setLastChange] = React.useState('Drag or resize a task bar');

  return (
    <Box style={{ maxWidth: 1120 }}>
      <Gantt
        tasks={items}
        links={links}
        zoom="week"
        sort="start"
        onTaskChange={(detail) => {
          setLastChange(`${detail.id}: ${detail.start} to ${detail.end}`);
          setItems((current) => current.map((task) => task.id === detail.id ? { ...task, start: detail.start || task.start, end: detail.end || task.end } : task));
        }}
      />
      <p style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, margin: '10px 0 0' }}>{lastChange}</p>
    </Box>
  );
};

export const FullPageWorkspace = () => {
  const [items, setItems] = React.useState(portfolioTasks);
  const [dependencyLinks, setDependencyLinks] = React.useState(portfolioLinks);
  const [selectedId, setSelectedId] = React.useState('gantt-ui');
  const [ownerFilter, setOwnerFilter] = React.useState('all');
  const [toneFilter, setToneFilter] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [linkDraft, setLinkDraft] = React.useState({ source: 'gantt-ui', target: 'editorial', type: 'e2s' as const });
  const [selectedLinkId, setSelectedLinkId] = React.useState('');
  const [lastChange, setLastChange] = React.useState('No schedule changes yet');
  const selected = items.find((task) => task.id === selectedId) || items[0];
  const selectedLink = dependencyLinks.find((link) => link.id === selectedLinkId);
  const owners = Array.from(new Set(items.map((task) => task.assignee).filter(Boolean))) as string[];
  const criticalTaskIds = React.useMemo(() => findCriticalTaskIds(items, dependencyLinks), [items, dependencyLinks]);
  const visibleItems = items.filter((task) => {
    if (ownerFilter !== 'all' && task.assignee !== ownerFilter) return false;
    if (toneFilter !== 'all' && task.tone !== toneFilter) return false;
    if (query && !`${task.label} ${task.assignee || ''}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }).map((task) => ({ ...task, critical: task.critical || criticalTaskIds.has(task.id) }));
  const complete = Math.round(items.reduce((total, task) => total + Number(task.progress || 0), 0) / items.filter((task) => task.type !== 'milestone').length);
  const milestones = items.filter((task) => task.type === 'milestone').length;
  const delayed = items.filter((task) => task.tone === 'danger' || task.tone === 'warning').length;
  const updateSelected = (patch: Record<string, unknown>) => {
    setItems((current) => current.map((task) => task.id === selected.id ? { ...task, ...patch } : task));
  };
  const createTask = () => {
    const id = `task-${Date.now()}`;
    const next = { id, label: 'New planning task', start: selected.start, end: selected.end, progress: 0, tone: 'default' as const, assignee: selected.assignee || 'PMO' };
    setItems((current) => [...current, next]);
    setSelectedId(id);
    setLastChange(`Created ${id}`);
  };
  const deleteTask = (id: string) => {
    setItems((current) => current.filter((task) => task.id !== id && task.parent !== id));
    setDependencyLinks((current) => current.filter((link) => link.source !== id && link.target !== id));
    setSelectedId(items.find((task) => task.id !== id)?.id || '');
    setLastChange(`Deleted ${id}`);
  };
  const deleteSelected = () => deleteTask(selected.id);
  const exportJson = () => {
    const payload = JSON.stringify({ tasks: items, links: dependencyLinks }, null, 2);
    setLastChange(`Export ready: ${payload.length} characters`);
  };
  const importSample = () => {
    setItems(portfolioTasks);
    setDependencyLinks(portfolioLinks);
    setSelectedId('gantt-ui');
    setLastChange('Imported sample portfolio');
  };
  const addDependency = () => {
    if (!linkDraft.source || !linkDraft.target || linkDraft.source === linkDraft.target) return;
    const id = `link-${Date.now()}`;
    setDependencyLinks((current) => [...current, { ...linkDraft, id }]);
    setSelectedLinkId(id);
    setLastChange(`Created dependency ${linkDraft.source} to ${linkDraft.target}`);
  };
  const autoSchedule = () => {
    setItems((current) => {
      const byId = new Map(current.map((task) => [task.id, task]));
      const next = current.map((task) => ({ ...task }));
      const nextById = new Map(next.map((task) => [task.id, task]));
      dependencyLinks.forEach((link) => {
        const source = nextById.get(link.source) || byId.get(link.source);
        const target = nextById.get(link.target);
        if (!source || !target || target.type === 'summary') return;
        const targetDuration = durationDays(target.start, target.end);
        const earliest = addWorkingDays(source.end, 1);
        if (new Date(`${target.start}T00:00:00`) < new Date(`${earliest}T00:00:00`)) {
          target.start = earliest;
          target.end = target.type === 'milestone' ? earliest : addWorkingDays(earliest, targetDuration);
        }
      });
      return next;
    });
    setLastChange('Auto-scheduled dependent tasks using working days');
  };

  return (
    <div style={{ minHeight: 760, background: '#f6f8fb', color: '#0f172a', padding: 20, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'grid', gap: 16 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 750, textTransform: 'uppercase', letterSpacing: 0 }}>Program control</div>
            <h1 style={{ margin: '4px 0 0', fontSize: 30, lineHeight: 1.12 }}>Release Planning Workspace</h1>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button style={shellButtonStyle} onClick={exportJson}>Export</button>
            <button style={shellButtonStyle} onClick={importSample}>Import sample</button>
            <button style={shellButtonStyle} onClick={autoSchedule}>Auto schedule</button>
            <button style={{ ...shellButtonStyle, background: '#2563eb', color: '#ffffff', borderColor: '#2563eb' }} onClick={createTask}>New task</button>
          </div>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
          <div style={metricStyle}><div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Completion</div><strong style={{ display: 'block', marginTop: 8, fontSize: 26 }}>{complete}%</strong></div>
          <div style={metricStyle}><div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Tracked tasks</div><strong style={{ display: 'block', marginTop: 8, fontSize: 26 }}>{items.length}</strong></div>
          <div style={metricStyle}><div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Milestones</div><strong style={{ display: 'block', marginTop: 8, fontSize: 26 }}>{milestones}</strong></div>
          <div style={metricStyle}><div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>Critical path</div><strong style={{ display: 'block', marginTop: 8, fontSize: 26 }}>{criticalTaskIds.size}</strong><span style={{ color: '#64748b', fontSize: 12 }}>{delayed} risks</span></div>
        </section>

        <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 14, alignItems: 'start' }}>
          <section style={panelStyle}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #dbe4ef', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <strong style={{ fontSize: 14 }}>Cross-functional plan</strong>
                <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>Drag task bars to reschedule, drag milestone diamonds to move checkpoints.</div>
              </div>
              <span style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>{lastChange}</span>
            </div>
            <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 150px 150px', gap: 8, borderBottom: '1px solid #dbe4ef' }}>
              <input style={fieldStyle} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by task or owner" />
              <select style={fieldStyle} value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
                <option value="all">All owners</option>
                {owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
              </select>
              <select style={fieldStyle} value={toneFilter} onChange={(event) => setToneFilter(event.target.value)}>
                <option value="all">All statuses</option>
                <option value="success">Success</option>
                <option value="default">Default</option>
                <option value="warning">Warning</option>
                <option value="danger">Danger</option>
              </select>
            </div>
            <Gantt
              tasks={visibleItems}
              links={dependencyLinks}
              zoom="week"
              sort="start"
              barVariant="soft"
              onTaskSelect={(detail) => setSelectedId(detail.id)}
              onTaskDelete={(detail) => {
                deleteTask(detail.id);
              }}
              onLinkSelect={(detail) => {
                setSelectedLinkId(detail.id);
                setLastChange(`Selected ${detail.type} dependency ${detail.source} to ${detail.target}`);
              }}
              onTaskChange={(detail) => {
                setLastChange(`${detail.id}: ${detail.start} to ${detail.end}`);
                setItems((current) => current.map((task) => task.id === detail.id ? { ...task, start: detail.start || task.start, end: detail.end || task.end } : task));
              }}
            />
          </section>

          <aside style={{ display: 'grid', gap: 12 }}>
            <section style={{ ...panelStyle, padding: 14 }}>
              <div style={{ color: '#64748b', fontSize: 12, fontWeight: 750, textTransform: 'uppercase', letterSpacing: 0 }}>Selected task</div>
              <input style={{ ...fieldStyle, width: '100%', marginTop: 8, fontWeight: 700 }} value={selected.label} onChange={(event) => updateSelected({ label: event.target.value })} />
              <input style={{ ...fieldStyle, width: '100%', marginTop: 8 }} value={selected.assignee || ''} onChange={(event) => updateSelected({ assignee: event.target.value })} placeholder="Owner" />
              <div style={{ display: 'grid', gap: 8, marginTop: 16 }}>
                <label style={{ display: 'grid', gap: 4, fontSize: 12, color: '#64748b' }}>Start<input style={fieldStyle} type="date" value={selected.start} onChange={(event) => updateSelected({ start: event.target.value })} /></label>
                <label style={{ display: 'grid', gap: 4, fontSize: 12, color: '#64748b' }}>End<input style={fieldStyle} type="date" value={selected.end} onChange={(event) => updateSelected({ end: event.target.value })} /></label>
                <label style={{ display: 'grid', gap: 4, fontSize: 12, color: '#64748b' }}>Progress<input style={fieldStyle} type="number" min={0} max={100} value={selected.progress ?? 0} onChange={(event) => updateSelected({ progress: Number(event.target.value) })} /></label>
                <label style={{ display: 'grid', gap: 4, fontSize: 12, color: '#64748b' }}>Status<select style={fieldStyle} value={selected.tone || 'default'} onChange={(event) => updateSelected({ tone: event.target.value })}><option value="default">Default</option><option value="success">Success</option><option value="warning">Warning</option><option value="danger">Danger</option><option value="info">Info</option></select></label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                <button style={shellButtonStyle} onClick={() => setItems((current) => reorder(current, Math.max(0, current.findIndex((task) => task.id === selected.id)), Math.max(0, current.findIndex((task) => task.id === selected.id) - 1)))}>Move up</button>
                <button style={shellButtonStyle} onClick={() => setItems((current) => reorder(current, current.findIndex((task) => task.id === selected.id), Math.min(current.length - 1, current.findIndex((task) => task.id === selected.id) + 1)))}>Move down</button>
                <button style={{ ...shellButtonStyle, gridColumn: '1 / -1', color: '#b91c1c' }} onClick={deleteSelected}>Delete task</button>
              </div>
            </section>
            <section style={{ ...panelStyle, padding: 14 }}>
              <strong style={{ fontSize: 14 }}>Dependencies</strong>
              <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
                <select style={fieldStyle} value={linkDraft.source} onChange={(event) => setLinkDraft((draft) => ({ ...draft, source: event.target.value }))}>{items.map((task) => <option key={task.id} value={task.id}>{task.label}</option>)}</select>
                <select style={fieldStyle} value={linkDraft.target} onChange={(event) => setLinkDraft((draft) => ({ ...draft, target: event.target.value }))}>{items.map((task) => <option key={task.id} value={task.id}>{task.label}</option>)}</select>
                <select style={fieldStyle} value={linkDraft.type} onChange={(event) => setLinkDraft((draft) => ({ ...draft, type: event.target.value as typeof linkTypes[number] }))}>
                  <option value="e2s">Finish to start</option>
                  <option value="s2s">Start to start</option>
                  <option value="e2e">Finish to finish</option>
                  <option value="s2e">Start to finish</option>
                </select>
                <button style={shellButtonStyle} onClick={addDependency}>Add dependency</button>
              </div>
              {selectedLink ? (
                <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: '#eff6ff', color: '#1d4ed8', fontSize: 12 }}>
                  Selected {selectedLink.type || 'e2s'} link: {selectedLink.source} to {selectedLink.target}
                </div>
              ) : null}
              {dependencyLinks.slice(-5).map((link) => (
                <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '8px 0', borderTop: '1px solid #edf2f7', fontSize: 12 }}>
                  <button style={{ border: 0, background: 'transparent', padding: 0, textAlign: 'left', color: selectedLinkId === link.id ? '#1d4ed8' : '#0f172a', cursor: 'pointer' }} onClick={() => setSelectedLinkId(link.id)}>{link.source} to {link.target} <span style={{ color: '#64748b' }}>({link.type || 'e2s'})</span></button>
                  <button style={{ border: 0, background: 'transparent', color: '#b91c1c', cursor: 'pointer' }} onClick={() => setDependencyLinks((current) => current.filter((item) => item.id !== link.id))}>Delete</button>
                </div>
              ))}
            </section>
            <section style={{ ...panelStyle, padding: 14 }}>
              <strong style={{ fontSize: 14 }}>Risk queue</strong>
              {items.filter((task) => task.tone === 'warning' || task.tone === 'danger').slice(0, 5).map((task) => (
                <button key={task.id} onClick={() => setSelectedId(task.id)} style={{ display: 'block', width: '100%', textAlign: 'left', border: 0, borderBottom: '1px solid #edf2f7', background: 'transparent', padding: '10px 0', color: '#0f172a' }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>{task.label}</span>
                  <span style={{ color: '#64748b', fontSize: 12 }}>{task.assignee || 'PMO'} - {task.progress ?? 0}%</span>
                </button>
              ))}
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
};

export const Contrast = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 1040 }}>
    <Gantt tasks={tasks} links={links} variant="contrast" />
  </Box>
);

export const ReadonlyPortfolio = () => (
  <Box style={{ maxWidth: 1040 }}>
    <Gantt tasks={tasks} links={links} readonly zoom="month" />
  </Box>
);

export const DensePortfolio = () => (
  <Box style={{ maxWidth: 1180 }}>
    <Gantt tasks={portfolioTasks} links={portfolioLinks} zoom="month" sort="start" barVariant="outline" />
  </Box>
);

export const MilestoneRoadmap = () => (
  <Box style={{ maxWidth: 1180 }}>
    <Gantt
      tasks={portfolioTasks.filter((task) => task.type === 'milestone' || !task.parent)}
      zoom="month"
      sort="start"
      barVariant="glass"
      readonly
    />
  </Box>
);

export const LargeDataset10000 = () => {
  const largeTasks = React.useMemo(() => createLargeTasks(10000), []);

  return (
    <Box style={{ maxWidth: 1280 }}>
      <Gantt tasks={largeTasks} zoom="month" sort="start" barVariant="outline" />
    </Box>
  );
};

export const BarDesigns = () => (
  <Box style={{ display: 'grid', gap: 16, maxWidth: 1120 }}>
    {barVariants.map((barVariant) => (
      <Box key={barVariant}>
        <p style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, fontWeight: 700, margin: '0 0 6px', textTransform: 'capitalize' }}>{barVariant}</p>
        <Gantt tasks={tasks} links={links} barVariant={barVariant} showToolbar={false} zoom="week" />
      </Box>
    ))}
  </Box>
);

export const DependencyTypes = () => (
  <Box style={{ display: 'grid', gap: 16, maxWidth: 1180 }}>
    {linkTypes.map((type) => (
      <Box key={type}>
        <p style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, fontWeight: 700, margin: '0 0 6px' }}>{type.toUpperCase()} dependency routing</p>
        <Gantt
          tasks={portfolioTasks.slice(0, 10)}
          links={[
            { id: `${type}-1`, source: 'requirements', target: 'schema', type },
            { id: `${type}-2`, source: 'schema', target: 'api', type },
            { id: `${type}-3`, source: 'api', target: 'foundation-freeze', type }
          ]}
          barVariant="soft"
          showToolbar={false}
          zoom="week"
        />
      </Box>
    ))}
  </Box>
);
