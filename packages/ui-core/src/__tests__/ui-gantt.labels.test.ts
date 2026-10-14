import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const TASKS = [
  { id: 'p', label: 'Phase', start: '2026-03-02', end: '2026-03-20', type: 'summary', progress: 60 },
  { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-06', parent: 'p', progress: 40, assignee: 'Ava', critical: true },
  { id: 'm', label: 'Launch', start: '2026-03-20', type: 'milestone', parent: 'p' },
];

const FRENCH = {
  title: 'Planning du projet',
  tasksCount: '{shown} sur {total} tâches',
  filterPlaceholder: 'Filtrer les tâches',
  filterLabel: 'Filtrer',
  sortLabel: 'Trier',
  sortManual: 'Manuel',
  sortStart: 'Début',
  sortEnd: 'Fin',
  sortName: 'Nom',
  sortProgress: 'Avancement',
  zoomDay: 'jour',
  zoomWeek: 'semaine',
  zoomMonth: 'mois',
  zoomQuarter: 'trimestre',
  zoomYear: 'année',
  zoomFit: 'ajuster',
  zoomFitTitle: 'Ajuster tout le projet à la largeur',
  columnTask: 'Tâche',
  columnOwner: 'Responsable',
  columnDates: 'Dates',
  columnProgress: '%',
  empty: 'Aucune tâche',
  noMatches: 'Aucune tâche correspondante',
  expand: 'Développer',
  collapse: 'Réduire',
  timeline: 'Chronologie',
  today: "Aujourd'hui",
  summary: 'récapitulatif',
  milestone: 'jalon',
  to: 'au',
  complete: 'terminé',
  assigned: 'confié à',
  critical: 'critique',
};

const mount = async (attrs: Record<string, string> = {}, tasks: unknown[] = TASKS) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};

const texts = (root: ParentNode, selector: string) => [...root.querySelectorAll(selector)].map((el) => el.textContent!.trim());

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt labels', () => {
  it('keeps the English wording without a labels attribute', async () => {
    const { root } = await mount();

    expect(root.querySelector('.title')!.textContent).toContain('Project schedule');
    expect(root.querySelector('.meta')!.textContent).toBe('3/3 tasks');
    expect(root.querySelector('.control')!.getAttribute('placeholder')).toBe('Filter tasks');
    expect(texts(root, '.select option')).toEqual(['Manual', 'Start date', 'End date', 'Name', 'Progress']);
    expect(texts(root, '.zoom-button')).toEqual(['day', 'week', 'month', 'quarter', 'year', 'fit']);
    expect(texts(root, '.head-button')).toEqual(['Task', 'Dates', '%']);
    expect(root.querySelector('.timeline-body')!.getAttribute('aria-label')).toBe('Timeline');
  });

  it('translates the toolbar, the headers and the timeline', async () => {
    const { root } = await mount({ labels: JSON.stringify(FRENCH), zoom: 'week' });

    expect(root.querySelector('.title')!.textContent).toContain('Planning du projet');
    expect(root.querySelector('.meta')!.textContent).toBe('3 sur 3 tâches');
    expect(root.querySelector('.control')!.getAttribute('placeholder')).toBe('Filtrer les tâches');
    expect(root.querySelector('.control')!.getAttribute('aria-label')).toBe('Filtrer');
    expect(root.querySelector('.select')!.getAttribute('aria-label')).toBe('Trier');
    expect(texts(root, '.select option')).toEqual(['Manuel', 'Début', 'Fin', 'Nom', 'Avancement']);
    expect(texts(root, '.zoom-button')).toEqual(['jour', 'semaine', 'mois', 'trimestre', 'année', 'ajuster']);
    expect(root.querySelector('.zoom-button[data-zoom="fit"]')!.getAttribute('title')).toBe('Ajuster tout le projet à la largeur');
    expect(texts(root, '[role="columnheader"]')).toContain('Responsable');
    expect(texts(root, '.head-button')[0]).toBe('Tâche');
    expect(root.querySelector('[role="treegrid"]')!.getAttribute('aria-label')).toBe('Planning du projet');
    expect(root.querySelector('.timeline-body')!.getAttribute('aria-label')).toBe('Chronologie');
  });

  it('translates the expand button, the bar names and the tooltip', async () => {
    const { root } = await mount({ labels: JSON.stringify(FRENCH) });
    const medium = (y: number, m: number, d: number) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(y, m - 1, d));

    expect(root.querySelector('.expander')!.getAttribute('aria-label')).toBe('Réduire Phase');
    expect(root.querySelector('.bar[data-task-id="a"]')!.getAttribute('aria-label')).toBe(
      `Design, ${medium(2026, 3, 2)} au ${medium(2026, 3, 6)}, 40% terminé, confié à Ava, critique`
    );
    expect(root.querySelector('.bar[data-task-id="p"]')!.getAttribute('aria-label')).toContain('récapitulatif');
    expect(root.querySelector('.bar[data-task-id="m"]')!.getAttribute('aria-label')).toBe(`Launch, jalon, ${medium(2026, 3, 20)}`);

    root.querySelector<HTMLElement>('.expander')!.click();
    await flush();
    expect(root.querySelector('.expander')!.getAttribute('aria-label')).toBe('Développer Phase');
  });

  it('translates the empty and no-match messages and the today pill', async () => {
    const empty = await mount({ labels: JSON.stringify(FRENCH) }, []);
    expect(empty.root.querySelector('.empty')!.textContent).toBe('Aucune tâche');

    document.body.innerHTML = '';
    const none = await mount({ labels: JSON.stringify(FRENCH), filter: 'zzz-nothing' });
    expect(none.root.querySelector('.grid-body .empty')!.textContent).toBe('Aucune tâche correspondante');

    document.body.innerHTML = '';
    const now = new Date();
    const pad = (v: number) => String(v).padStart(2, '0');
    const day = (o: number) => { const x = new Date(now.getFullYear(), now.getMonth(), now.getDate() + o); return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`; };
    const around = await mount({ labels: JSON.stringify(FRENCH), zoom: 'week' }, [{ id: 'a', label: 'Now', start: day(-4), end: day(8) }]);
    expect(around.root.querySelector('.today-pill')!.textContent).toBe("Aujourd'hui");
  });

  it('overrides only what is given and ignores unknown keys and non-strings', async () => {
    const { root } = await mount({ labels: JSON.stringify({ title: 'Roadmap', bogus: 'x', filterPlaceholder: 42 }) });

    expect(root.querySelector('.title')!.textContent).toContain('Roadmap');
    expect(root.querySelector('.control')!.getAttribute('placeholder')).toBe('Filter tasks');
    expect(root.querySelector('.meta')!.textContent).toBe('3/3 tasks');
  });

  it('falls back to English for malformed or non-object labels', async () => {
    for (const bad of ['{nope', '"a string"', '[1,2]', 'null']) {
      document.body.innerHTML = '';
      const { root } = await mount({ labels: bad });
      expect(root.querySelector('.title')!.textContent).toContain('Project schedule');
    }
  });

  it('escapes translated text', async () => {
    const { root } = await mount({ labels: JSON.stringify({ title: '<img src=x onerror=alert(1)>', zoomDay: '<b>d</b>' }) });

    expect(root.querySelector('.title img')).toBeNull();
    expect(root.querySelector('.zoom-button b')).toBeNull();
    expect(root.querySelector('.title')!.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('re-renders when the labels attribute changes', async () => {
    const { gantt, root } = await mount();
    gantt.setAttribute('labels', JSON.stringify({ title: 'Cronograma', zoomWeek: 'semana' }));
    await flush();

    expect(root.querySelector('.title')!.textContent).toContain('Cronograma');
    expect(texts(root, '.zoom-button')[1]).toBe('semana');
  });

  it('lets an aria-label on the host win over the title for the grid name', async () => {
    const { root } = await mount({ labels: JSON.stringify({ title: 'Roadmap' }), 'aria-label': 'Release plan' });

    expect(root.querySelector('[role="treegrid"]')!.getAttribute('aria-label')).toBe('Release plan');
  });
});

describe('ui-gantt locale', () => {
  const monthYear = (locale: string, y: number, m: number) => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1));

  it('formats the header, the grid dates and the tooltip in the given locale', async () => {
    const { root } = await mount({ locale: 'de-DE', zoom: 'week', 'week-start': '1' });
    const month = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(new Date(2026, 2, 1));

    expect(texts(root, '.band.top .band-cell')).toContain(month);
    expect(month).toMatch(/März/);
    const short = new Intl.DateTimeFormat('de-DE', { month: 'short', day: 'numeric' });
    expect(root.querySelector('.grid-row[data-task-id="a"] .grid-cell:nth-child(3)')!.textContent).toBe(
      `${short.format(new Date(2026, 2, 2))} - ${short.format(new Date(2026, 2, 6))}`
    );
    const medium = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' });
    expect(root.querySelector('.bar[data-task-id="a"]')!.getAttribute('aria-label')).toContain(medium.format(new Date(2026, 2, 2)));
  });

  it('starts the week on the locale first day unless week-start says otherwise', async () => {
    const info = (locale: string) => {
      const l = new Intl.Locale(locale) as Intl.Locale & { getWeekInfo?: () => { firstDay: number }; weekInfo?: { firstDay: number } };
      return (typeof l.getWeekInfo === 'function' ? l.getWeekInfo() : l.weekInfo)?.firstDay;
    };
    if (info('en-US') === undefined || info('de-DE') === undefined) return; // no week data in this runtime
    const weekdayOfFirstTick = async (locale: string) => {
      document.body.innerHTML = '';
      const { root } = await mount({ locale, zoom: 'week' });
      const ticks = [...root.querySelectorAll<HTMLElement>('.band.bottom .tick')];
      // the second tick is a full week: its date number is the day the week starts on
      const dayOfMonth = Number(ticks[1].querySelector('.num')!.textContent);
      const start = new Date(2026, 2, 1); // March 2026: the 1st is a Sunday
      return new Date(start.getFullYear(), start.getMonth(), dayOfMonth).getDay();
    };

    expect(await weekdayOfFirstTick('en-US')).toBe(0); // Sunday
    expect(await weekdayOfFirstTick('de-DE')).toBe(1); // Monday
  });

  it('survives an invalid locale', async () => {
    const { root } = await mount({ locale: 'not_a_locale!!', zoom: 'week' });

    expect(root.querySelectorAll('.bar').length).toBe(3);
    expect(root.querySelector('.band.top .band-cell')).not.toBeNull();
  });

  it('re-renders when the locale changes', async () => {
    const { gantt, root } = await mount({ locale: 'en-US', zoom: 'month' });
    expect(texts(root, '.band.bottom .tick')).toContain(new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(2026, 2, 1)));

    gantt.setAttribute('locale', 'fr-FR');
    await flush();
    expect(texts(root, '.band.bottom .tick')).toContain(new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(new Date(2026, 2, 1)));
    expect(monthYear('fr-FR', 2026, 3)).toMatch(/mars/);
  });
});
