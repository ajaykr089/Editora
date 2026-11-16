import React from 'react';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { Calendar } from '@editora/ui-react/Calendar';
import { Card } from '@editora/ui-react/Card';
import { Dialog } from '@editora/ui-react/Dialog';
import { EmptyState } from '@editora/ui-react/EmptyState';
import { Form } from '@editora/ui-react/Form';
import { Input } from '@editora/ui-react/Input';
import { DatePicker } from '@editora/ui-react/DatePicker';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Select } from '@editora/ui-react/Select';
import { TimePicker } from '@editora/ui-react/TimePicker';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { addEvent, deleteEvent, listEvents, longDate, TODAY, type CalendarEntry } from '../../../shared/data';
import { useTitle } from '../lib/router';

const KINDS: CalendarEntry['kind'][] = ['Meeting', 'Delivery', 'Launch', 'Deadline', 'Personal'];
const KIND_TONE: Record<CalendarEntry['kind'], CalendarEntry['tone']> = { Meeting: 'info', Delivery: 'warning', Launch: 'success', Deadline: 'danger', Personal: 'neutral' };

/** A month calendar with events, the selected day's agenda, and an "add event" dialog. */
export function CalendarApp() {
  useTitle('Calendar');
  const [events, setEvents] = React.useState<CalendarEntry[]>([]);
  const [day, setDay] = React.useState(TODAY);
  const [adding, setAdding] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string> | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => { listEvents().then(setEvents); }, []);

  const ofDay = events.filter((e) => e.date === day).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const upcoming = events.filter((e) => e.date > TODAY).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  const save = async (values: Record<string, unknown>) => {
    setSaving(true);
    const kind = (values.kind as CalendarEntry['kind']) || 'Meeting';
    const result = await addEvent({ title: String(values.title || ''), date: String(values.date || ''), time: String(values.time || '') || undefined, kind, tone: KIND_TONE[kind] });
    setSaving(false);
    if (!result.ok) { setErrors(result.errors); return; }
    setEvents((all) => [...all, result.event]);
    setDay(result.event.date);
    setAdding(false);
    setErrors(null);
    toastApi.success(`${result.event.title} added`);
  };

  const remove = async (event: CalendarEntry) => {
    await deleteEvent(event.id);
    setEvents((all) => all.filter((e) => e.id !== event.id));
    toastApi.success(`${event.title} removed`);
  };

  return (
    <div className="lk-screen">
      <PageHeader title="Calendar" subtitle="Deliveries, launches and meetings for the whole team." actions={<Button icon="plus" onClick={() => setAdding(true)}>Add event</Button>} />
      <div className="lk-aside-layout lk-calendar-layout">
        <Card>
          <Calendar
            aria-label="Team calendar"
            year={Number(TODAY.slice(0, 4))}
            month={Number(TODAY.slice(5, 7))}
            value={day}
            events={events.map((e) => ({ date: e.date, title: e.title, tone: e.tone === 'neutral' ? 'default' : e.tone }))}
            eventsDisplay="badges"
            eventsMax={2}
            weekStart={1}
            size="lg"
            onValueChange={(value) => value && setDay(value)}
          />
        </Card>
        <div className="lk-stack">
          <Card>
            <Card.Header>
              <Card.Title as="h2">{day === TODAY ? 'Today' : longDate(day)}</Card.Title>
              <Card.Description>{ofDay.length ? `${ofDay.length} event${ofDay.length === 1 ? '' : 's'}` : 'Nothing planned'}</Card.Description>
            </Card.Header>
            {ofDay.length === 0 ? (
              <EmptyState variant="plain" compact title="A free day" actionLabel="Add an event" onAction={() => setAdding(true)} />
            ) : (
              <ul className="lk-list">
                {ofDay.map((event) => (
                  <li key={event.id} className="lk-row">
                    <span className={`lk-tone-bar tone-${event.tone}`} aria-hidden="true" />
                    <span className="lk-row-main">
                      <span className="cell-title">{event.title}</span>
                      <span className="cell-sub">{event.time || 'All day'} · {event.kind}</span>
                    </span>
                    <Button variant="ghost" size="sm" icon="trash" aria-label={`Remove ${event.title}`} onClick={() => remove(event)} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <Card.Header>
              <Card.Title as="h2">Coming up</Card.Title>
            </Card.Header>
            <ul className="lk-list">
              {upcoming.map((event) => (
                <li key={event.id} className="lk-row">
                  <span className="lk-row-main">
                    <button type="button" className="lk-link-button cell-title" onClick={() => setDay(event.date)}>{event.title}</button>
                    <span className="cell-sub">{longDate(event.date)}{event.time ? `, ${event.time}` : ''}</span>
                  </span>
                  <Badge tone={event.tone === 'neutral' ? 'neutral' : event.tone} variant="soft" size="sm">{event.kind}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Dialog open={adding} title="Add event" size="md" onDialogClose={() => { setAdding(false); setErrors(null); }} submitText="" cancelText="">
        <Form errors={errors} onSubmit={save} loading={saving} aria-label="Add event" key={String(adding)}>
          <div className="lk-stack">
            <Input name="title" label="Title" placeholder="Supplier call" required />
            <div className="lk-form-grid">
              <DatePicker name="date" label="Date" value={day} />
              <TimePicker name="time" label="Time" description="Leave empty for all day." />
            </div>
            <Select name="kind" label="Type" defaultValue="Meeting">
              {KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
            </Select>
            <div className="lk-actions">
              <Button variant="secondary" type="button" onClick={() => setAdding(false)}>Cancel</Button>
              <Button type="submit" loading={saving}>Add event</Button>
            </div>
          </div>
        </Form>
      </Dialog>
    </div>
  );
}
