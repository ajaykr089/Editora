import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = () => new Promise((resolve) => setTimeout(resolve, 30));

const mount = async () => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify([
    { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-13' },
    { id: 'm', label: 'Launch', start: '2026-03-20', type: 'milestone' },
  ]));
  document.body.appendChild(gantt);
  await flush();
  return gantt.shadowRoot as ShadowRoot;
};

/** The rules inside `@media (pointer: coarse)`, as text. */
const coarseRules = (root: ParentNode) => {
  const css = root.querySelector('style')!.textContent!;
  const start = css.indexOf('@media (pointer: coarse)');
  expect(start).toBeGreaterThan(-1);
  let depth = 0;
  for (let i = css.indexOf('{', start); i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    if (css[i] === '}') depth -= 1;
    if (depth === 0) return css.slice(start, i + 1);
  }
  throw new Error('unterminated media block');
};

afterEach(() => {
  document.body.innerHTML = '';
});

// jsdom has no pointer media features or layout; the sizes themselves are measured in a real touch browser.
describe('ui-gantt touch targets', () => {
  it('grows task bars and resize handles to the 24px target size on coarse pointers', async () => {
    const rules = coarseRules(await mount());

    expect(rules).toMatch(/\.bar\.task \{[^}]*block-size: 24px;[^}]*top: 9px;/);
    expect(rules).toMatch(/\.handle \{[^}]*inline-size: min\(24px, 35%\);/);
  });

  it('shows the handles without hover on coarse pointers, where there is no hover', async () => {
    const rules = coarseRules(await mount());

    expect(rules).toMatch(/\.handle \{[^}]*opacity: 1;/);
  });

  it('keeps the grips inside the wider handles', async () => {
    const rules = coarseRules(await mount());

    expect(rules).toMatch(/\.handle\.start::after \{[^}]*inset-inline-start: 8px;/);
    expect(rules).toMatch(/\.handle\.end::after \{[^}]*inset-inline-end: 8px;/);
  });

  it('leaves milestones and summaries alone: the new height is for task bars only', async () => {
    const rules = coarseRules(await mount());

    expect(rules).not.toMatch(/\.bar\.milestone/);
    expect(rules).not.toMatch(/\.bar\.summary/);
  });

  it('leaves fine pointers as they were (14px handles, shown on hover)', async () => {
    const root = await mount();
    const css = root.querySelector('style')!.textContent!;
    const base = css.slice(0, css.indexOf('@media (pointer: coarse)'));

    expect(base).toMatch(/\n {2}\.handle \{[^}]*inline-size: 14px;[^}]*opacity: 0;/);
  });
});
