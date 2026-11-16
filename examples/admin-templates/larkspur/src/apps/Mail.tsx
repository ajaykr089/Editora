import React from 'react';
import { Avatar } from '@editora/ui-react/Avatar';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { Drawer } from '@editora/ui-react/Drawer';
import { EmptyState } from '@editora/ui-react/EmptyState';
import { Form } from '@editora/ui-react/Form';
import { Input } from '@editora/ui-react/Input';
import { Skeleton } from '@editora/ui-react/Skeleton';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { Tooltip } from '@editora/ui-react/Tooltip';
import { initials, listMail, mailCounts, sendMail, shortDate, TODAY, updateMail, type Mail as MailItem, type MailFolder } from '../../../shared/data';
import { navigate, useTitle } from '../lib/router';
import { RichText } from '../lib/RichText';

const FOLDERS: Array<{ value: MailFolder; label: string; icon: string }> = [
  { value: 'inbox', label: 'Inbox', icon: 'inbox' },
  { value: 'starred', label: 'Starred', icon: 'star' },
  { value: 'sent', label: 'Sent', icon: 'send' },
  { value: 'drafts', label: 'Drafts', icon: 'file-text' },
  { value: 'archive', label: 'Archive', icon: 'archive' },
  { value: 'trash', label: 'Trash', icon: 'trash' },
];
const LABEL_TONE = { Orders: 'info', Suppliers: 'warning', Team: 'brand', Press: 'success' } as const;

function query() {
  return new URLSearchParams(window.location.hash.split('?')[1] || '');
}

/** Mail: folders, a message list, a reading pane, and a compose drawer with the Editora editor. */
export function Mail({ folder: folderParam }: { folder?: string }) {
  const folder = (FOLDERS.some((f) => f.value === folderParam) ? folderParam : 'inbox') as MailFolder;
  useTitle(FOLDERS.find((f) => f.value === folder)!.label);
  const [items, setItems] = React.useState<MailItem[] | null>(null);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [composing, setComposing] = React.useState(query().get('compose') === '1');
  const [draft, setDraft] = React.useState({ to: query().get('to') || '', subject: '', html: '' });
  const [errors, setErrors] = React.useState<Record<string, string> | null>(null);
  const [sending, setSending] = React.useState(false);
  const counts = mailCounts();

  const load = React.useCallback(() => listMail(folder, search).then(setItems), [folder, search]);
  React.useEffect(() => { setItems(null); void load(); }, [load]);

  const open = items?.find((m) => m.id === openId) || null;

  const select = async (item: MailItem) => {
    setOpenId(item.id);
    if (item.unread) {
      await updateMail(item.id, { unread: false });
      setItems((all) => all && all.map((m) => (m.id === item.id ? { ...m, unread: false } : m)));
    }
  };

  const move = async (item: MailItem, to: MailFolder, message: string) => {
    await updateMail(item.id, { folder: to });
    setOpenId(null);
    toastApi.success(message);
    void load();
  };

  const toggleStar = async (item: MailItem) => {
    await updateMail(item.id, { starred: !item.starred });
    setItems((all) => all && all.map((m) => (m.id === item.id ? { ...m, starred: !m.starred } : m)));
  };

  const closeCompose = () => {
    setComposing(false);
    setErrors(null);
    if (query().get('compose')) navigate(`/mail${folder === 'inbox' ? '' : `/${folder}`}`);
  };

  const send = async (asDraft: boolean) => {
    setSending(true);
    const result = await sendMail({ ...draft, draft: asDraft });
    setSending(false);
    if (!result.ok) { setErrors(result.errors); return; }
    toastApi.success(asDraft ? 'Draft saved' : `Sent to ${draft.to}`);
    setDraft({ to: '', subject: '', html: '' });
    closeCompose();
    void load();
  };

  const reply = (item: MailItem) => {
    setDraft({
      to: item.email,
      subject: item.subject.startsWith('Re:') ? item.subject : `Re: ${item.subject}`,
      html: `<p></p><blockquote><p>On ${shortDate(item.date)}, ${item.from} wrote:</p>${item.html}</blockquote>`,
    });
    setComposing(true);
  };

  return (
    <div className="lk-screen lk-mail">
      <h1 className="sr-only">{FOLDERS.find((f) => f.value === folder)!.label}</h1>
      <aside className="lk-mail-folders" aria-label="Mail folders">
        <Button icon="pencil" onClick={() => { setDraft({ to: '', subject: '', html: '' }); setComposing(true); }} className="lk-compose">Compose</Button>
        <nav>
          <ul className="lk-folder-list">
            {FOLDERS.map((f) => (
              <li key={f.value}>
                <a href={f.value === 'inbox' ? '#/mail' : `#/mail/${f.value}`} aria-current={f.value === folder ? 'page' : undefined}>
                  <span>{f.label}</span>
                  {f.value === 'inbox' && counts.inbox ? <Badge size="sm" tone="brand" variant="soft">{String(counts.inbox)}</Badge> : null}
                  {f.value === 'drafts' && counts.drafts ? <span className="cell-sub">{counts.drafts}</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <Card className="lk-mail-list">
        <Input clearable value={search} onChange={setSearch} debounce={200} placeholder="Search mail" aria-label="Search mail" />
        {!items ? (
          <div className="lk-stack">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} height="56px" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState variant="plain" compact title={search ? 'Nothing matches' : 'Nothing here'} description={search ? 'Try other words.' : 'Messages you move here show up in this list.'} />
        ) : (
          <ul className="lk-messages" aria-label="Messages">
            {items.map((item) => (
              <li key={item.id}>
                <button type="button" className={`lk-message${item.unread ? ' is-unread' : ''}${item.id === openId ? ' is-open' : ''}`} onClick={() => select(item)} aria-current={item.id === openId ? 'true' : undefined}>
                  <Avatar initials={initials(item.from)} size="sm" alt="" variant="soft" tone="neutral" />
                  <span className="lk-row-main">
                    <span className="lk-message-top">
                      <span className="cell-title">{folder === 'sent' || folder === 'drafts' ? `To: ${item.to}` : item.from}</span>
                      <span className="cell-sub">{item.date === TODAY ? item.time : shortDate(item.date)}</span>
                    </span>
                    <span className="lk-message-subject">{item.subject}</span>
                    <span className="cell-sub">{item.preview}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="lk-mail-read">
        {open ? (
          <article aria-label={open.subject}>
            <header className="lk-read-head">
              <div className="lk-row-main">
                <h1 className="lk-h1">{open.subject}</h1>
                <span className="lk-person">
                  <Avatar initials={initials(open.from)} size="sm" alt="" variant="soft" />
                  <span><span className="cell-title">{open.from}</span><span className="cell-sub">{open.email} · {shortDate(open.date)}, {open.time}</span></span>
                </span>
              </div>
              <div className="lk-actions">
                {open.label ? <Badge tone={LABEL_TONE[open.label]} variant="soft" size="sm">{open.label}</Badge> : null}
                <Tooltip text={open.starred ? 'Unstar' : 'Star'}><Button variant="ghost" size="sm" icon="star" aria-label={open.starred ? 'Unstar' : 'Star'} aria-pressed={open.starred ? 'true' : 'false'} onClick={() => toggleStar(open)} /></Tooltip>
                <Tooltip text="Archive"><Button variant="ghost" size="sm" icon="archive" aria-label="Archive" onClick={() => move(open, 'archive', 'Archived')} /></Tooltip>
                <Tooltip text="Delete"><Button variant="ghost" size="sm" icon="trash" aria-label="Delete" onClick={() => move(open, 'trash', 'Moved to trash')} /></Tooltip>
              </div>
            </header>
            {/* The message body comes from the pretend server, written by the app's own editor. Sanitize
                HTML from anywhere else before rendering it. */}
            <div className="lk-rich" dangerouslySetInnerHTML={{ __html: open.html }} />
            <div className="lk-actions lk-read-actions">
              <Button variant="secondary" icon="reply" onClick={() => reply(open)}>Reply</Button>
            </div>
          </article>
        ) : (
          <EmptyState variant="plain" title="No message selected" description="Pick a message on the left to read it here." />
        )}
      </Card>

      <Drawer open={composing} side="right" size="lg" title="New message" onChange={(next) => { if (!next) closeCompose(); }}>
        <Form errors={errors} onSubmit={() => send(false)} loading={sending} aria-label="New message">
          <div className="lk-stack">
            <Input name="to" label="To" value={draft.to} onChange={(to) => setDraft((d) => ({ ...d, to }))} placeholder="name@example.com, another@example.com" />
            <Input name="subject" label="Subject" value={draft.subject} onChange={(subject) => setDraft((d) => ({ ...d, subject }))} />
            <div className="lk-field">
              <span className="lk-field-label" id="compose-body-label">Message</span>
              <RichText
                className="lk-editor" labelledBy="compose-body-label"
                value={draft.html}
                onChange={(html) => setDraft((d) => ({ ...d, html }))}
                placeholder="Write your message…"
                minHeight={240}
              />
              {errors?.body ? <span className="lk-field-error" role="alert">{errors.body}</span> : null}
            </div>
            <div className="lk-actions">
              <Button variant="ghost" type="button" onClick={closeCompose}>Discard</Button>
              <Button variant="secondary" type="button" disabled={sending} onClick={() => send(true)}>Save draft</Button>
              <Button type="submit" icon="send" loading={sending}>Send</Button>
            </div>
          </div>
        </Form>
      </Drawer>
    </div>
  );
}
