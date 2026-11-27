import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-message';
import '../components/ui-bubble';
import '../components/ui-bubble-group';
import '../components/ui-marker';
import '../components/ui-attachment';
import '../components/ui-attachment-group';
import '../components/ui-trace';
import '../components/ui-trace-item';
import { attachmentKind, formatBytes } from '../components/ui-attachment';

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function mount<T extends HTMLElement>(html: string): T {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  return host.firstElementChild as T;
}

const slotChange = (el: Element, name?: string) => {
  const slot = el.shadowRoot!.querySelector(name ? `slot[name="${name}"]` : 'slot:not([name])');
  slot?.dispatchEvent(new Event('slotchange', { bubbles: true }));
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-message', () => {
  it('is an article named by sender and time', async () => {
    const el = mount('<ui-message name="Ada" time="10:42" datetime="2026-11-27T10:42">Hi</ui-message>');
    await flush();
    expect(el.getAttribute('role')).toBe('article');
    expect(el.getAttribute('aria-label')).toBe('Ada, 10:42');
    expect(el.shadowRoot!.querySelector('time')?.getAttribute('datetime')).toBe('2026-11-27T10:42');
  });

  it('keeps an app label and role', async () => {
    const el = mount('<ui-message role="listitem" aria-labelledby="x" name="Ada">Hi</ui-message>');
    await flush();
    expect(el.getAttribute('role')).toBe('listitem');
    expect(el.hasAttribute('aria-label')).toBe(false);
  });

  it('drops its label when name and time are removed', async () => {
    const el = mount('<ui-message name="Ada">Hi</ui-message>');
    await flush();
    el.removeAttribute('name');
    expect(el.hasAttribute('aria-label')).toBe(false);
  });

  it('escapes the name', async () => {
    const el = mount('<ui-message></ui-message>');
    el.setAttribute('name', '<img src=x onerror=alert(1)>');
    await flush();
    expect(el.shadowRoot!.querySelector('img')).toBeNull();
  });

  it('lines bubbles up on its side, also when the side changes', async () => {
    const el = mount('<ui-message align="end"><ui-bubble>Hi</ui-bubble></ui-message>');
    await flush();
    const bubble = el.querySelector('ui-bubble')!;
    expect(bubble.getAttribute('data-align')).toBe('end');
    el.setAttribute('align', 'start');
    expect(bubble.getAttribute('data-align')).toBe('start');
  });
});

describe('ui-bubble', () => {
  it('starts on the start side, its own align wins over the message', async () => {
    const el = mount('<ui-message align="end"><ui-bubble align="start">Hi</ui-bubble></ui-message>');
    await flush();
    expect(el.querySelector('ui-bubble')!.getAttribute('data-align')).toBe('start');
  });

  it('becomes a link with href, safe for new tabs', async () => {
    const el = mount('<ui-bubble href="/suggest" target="_blank">Try this</ui-bubble>');
    await flush();
    const link = el.shadowRoot!.querySelector('a.bubble')!;
    expect(link.getAttribute('href')).toBe('/suggest');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('flags reactions so the bubble leaves room for them', async () => {
    const el = mount('<ui-bubble>Hi<span slot="reactions" role="img" aria-label="1 thumbs up">👍</span></ui-bubble>');
    await flush();
    slotChange(el, 'reactions');
    expect(el.hasAttribute('data-has-reactions')).toBe(true);
    expect(el.shadowRoot!.querySelector('.reactions')!.hasAttribute('data-empty')).toBe(false);
  });

  it('groups bubbles in a group', async () => {
    const el = mount('<ui-bubble-group><ui-bubble>a</ui-bubble><ui-bubble>b</ui-bubble></ui-bubble-group>');
    await flush();
    expect(el.getAttribute('role')).toBe('group');
  });
});

describe('ui-marker', () => {
  it('is presentational until live, then a status', async () => {
    const el = mount('<ui-marker>Thinking…</ui-marker>');
    await flush();
    expect(el.hasAttribute('role')).toBe(false);
    el.setAttribute('live', '');
    expect(el.getAttribute('role')).toBe('status');
    el.removeAttribute('live');
    expect(el.hasAttribute('role')).toBe(false);
  });

  it('hides its icon from assistive technology', async () => {
    const el = mount('<ui-marker><svg slot="icon"></svg>Renamed</ui-marker>');
    await flush();
    slotChange(el, 'icon');
    expect(el.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('ui-attachment', () => {
  it('tells file kinds from MIME types and extensions', () => {
    expect(attachmentKind('a.png', '')).toBe('image');
    expect(attachmentKind('x', 'application/pdf')).toBe('pdf');
    expect(attachmentKind('report.XLSX', '')).toBe('sheet');
    expect(attachmentKind('main.ts', '')).toBe('code');
    expect(attachmentKind('mystery', '')).toBe('file');
  });

  it('formats sizes', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(482133)).toBe('471 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5 MB');
    expect(formatBytes(-1)).toBe('');
  });

  it('describes a finished file by kind and size', async () => {
    const el = mount('<ui-attachment name="report.pdf" bytes="482133"></ui-attachment>');
    await flush();
    expect(el.shadowRoot!.querySelector('.description')!.textContent).toBe('PDF · 471 KB');
    expect(el.getAttribute('role')).toBe('group');
    expect(el.getAttribute('aria-label')).toBe('report.pdf');
  });

  it('shows upload progress in the bar, the text and the name', async () => {
    const el = mount('<ui-attachment name="a.zip" state="uploading" progress="40"></ui-attachment>');
    await flush();
    const bar = el.shadowRoot!.querySelector('.progress')!;
    expect(bar.hasAttribute('hidden')).toBe(false);
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
    expect(el.shadowRoot!.querySelector('.description')!.textContent).toBe('Uploading 40%');
    expect(el.getAttribute('aria-busy')).toBe('true');
    el.setAttribute('progress', '75');
    expect(bar.getAttribute('aria-valuenow')).toBe('75');
    expect(el.shadowRoot!.querySelector('.description')!.textContent).toBe('Uploading 75%');
    el.removeAttribute('progress');
    expect(bar.hasAttribute('data-indeterminate')).toBe(true);
  });

  it('fires remove from its remove button, named after the file', async () => {
    const el = mount('<ui-attachment name="a.txt" removable></ui-attachment>');
    await flush();
    const onRemove = vi.fn();
    el.addEventListener('remove', onRemove);
    const button = el.shadowRoot!.querySelector('.remove') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Remove a.txt');
    button.click();
    expect(onRemove.mock.calls[0][0].detail).toEqual({ name: 'a.txt' });
  });

  it('opens the file through a named link with href', async () => {
    const el = mount('<ui-attachment name="photo.jpg" href="/f/photo.jpg" target="_blank"></ui-attachment>');
    await flush();
    const link = el.shadowRoot!.querySelector('a.trigger')!;
    expect(link.textContent).toBe('Open photo.jpg (opens in a new tab)');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('keeps the error reason in text', async () => {
    const el = mount('<ui-attachment name="a.txt" state="error" description="File too large"></ui-attachment>');
    await flush();
    expect(el.shadowRoot!.querySelector('.description')!.textContent).toBe('File too large');
    expect(el.getAttribute('aria-label')).toBe('a.txt, Upload failed');
  });

  it('is a named group in a group', async () => {
    const el = mount('<ui-attachment-group aria-label="Files"><ui-attachment name="a"></ui-attachment></ui-attachment-group>');
    await flush();
    expect(el.getAttribute('role')).toBe('group');
  });
});

describe('ui-trace', () => {
  it('is a list of listitems, including steps appended later', async () => {
    const el = mount('<ui-trace label="Agent activity"><ui-trace-item label="Read a file"></ui-trace-item></ui-trace>');
    await flush();
    expect(el.getAttribute('role')).toBe('list');
    expect(el.getAttribute('aria-label')).toBe('Agent activity');
    expect(el.firstElementChild!.getAttribute('role')).toBe('listitem');
    const added = document.createElement('ui-trace-item');
    el.appendChild(added);
    await flush();
    expect(added.getAttribute('role')).toBe('listitem');
  });

  it('is plain text without details and speaks its status', async () => {
    const el = mount('<ui-trace-item label="Running tests" status="running"></ui-trace-item>');
    await flush();
    expect(el.shadowRoot!.querySelector('button')).toBeNull();
    expect(el.shadowRoot!.querySelector('.sr')!.textContent).toBe(', in progress');
  });

  it('expands its details with a button', async () => {
    const el = mount('<ui-trace-item label="Searched the web"><p>6 sources</p></ui-trace-item>');
    await flush();
    const button = el.shadowRoot!.querySelector('button.line') as HTMLButtonElement;
    const details = el.shadowRoot!.querySelector('.details') as HTMLElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe(details.id);
    expect(details.hidden).toBe(true);
    const onToggle = vi.fn();
    el.addEventListener('toggle', onToggle);
    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(details.hidden).toBe(false);
    expect(onToggle.mock.calls[0][0].detail).toEqual({ open: true });
  });

  it('becomes expandable when details arrive later', async () => {
    const el = mount('<ui-trace-item label="Thinking"></ui-trace-item>');
    await flush();
    el.appendChild(document.createElement('p'));
    await flush();
    await flush();
    expect(el.shadowRoot!.querySelector('button.line')).not.toBeNull();
  });

  it('is a link with href and says when it opens a new tab', async () => {
    const el = mount('<ui-trace-item label="Opened the PR" href="https://example.com" target="_blank"></ui-trace-item>');
    await flush();
    const link = el.shadowRoot!.querySelector('a.line')!;
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(el.shadowRoot!.querySelector('.sr')!.textContent).toContain('opens in a new tab');
  });
});
