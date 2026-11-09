import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';

// axe on every screen of the reference app, light and dark: WCAG 2.2 AA plus best practices.
const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

/**
 * Known false positives, by rule and target. Each has a reason and a positive check elsewhere.
 * - region on Layout's sidebar panel: axe does not follow content through ui-layout's slot into
 *   ui-sidebar's shadow root, so it misses the sidebar's <aside> and <nav>. Chrome exposes them
 *   as complementary and navigation landmarks (checked below from the accessibility tree).
 */
const ALLOWED: Array<{ id: string; target: string }> = [{ id: 'region', target: 'ui-layout > .sidebar-panel' }];

const SCREENS = [
  ['website', '/'],
  ['dashboard', '/#/app'],
  ['expenses', '/#/app/expenses'],
  ['expense', '/#/app/expenses/EX-4203'],
  ['new expense', '/#/app/expenses/new'],
] as const;

for (const theme of ['light', 'dark'] as const) {
  for (const [name, path] of SCREENS) {
    test(`${name} (${theme})`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const join = path.includes('#') ? path.replace('/#', `/?theme=${theme}#`) : `/?theme=${theme}`;
      await page.goto(join);
      await page.waitForLoadState('networkidle');
      // the pretend API answers after ~300ms; let entrance transitions settle before sampling colours
      await page.waitForTimeout(800);
      await page.evaluate(axeSource);
      const violations = await page.evaluate(async () => {
        const result = await (window as any).axe.run(document.body, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] },
        });
        return result.violations.map((v: any) => ({ id: v.id, impact: v.impact, nodes: v.nodes.slice(0, 4).map((n: any) => n.target.flat().join(' > ')) }));
      });
      const unexpected = violations
        .map((v: { id: string; impact: string; nodes: string[] }) => ({ ...v, nodes: v.nodes.filter((target) => !ALLOWED.some((a) => a.id === v.id && a.target === target)) }))
        .filter((v: { nodes: string[] }) => v.nodes.length);
      expect(errors, 'page errors').toEqual([]);
      expect(unexpected, `axe: ${name} (${theme})`).toEqual([]);
    });
  }
}

test('the app exposes one banner, the sidebar navigation and the main content as landmarks', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'reads the accessibility tree through the Chrome DevTools Protocol');
  await page.goto('/?theme=light#/app');
  await page.waitForLoadState('networkidle');
  const cdp = await page.context().newCDPSession(page);
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  const landmarks = (nodes as Array<{ ignored?: boolean; role?: { value: string }; name?: { value: string } }>)
    .filter((node) => !node.ignored && ['banner', 'navigation', 'complementary', 'main', 'contentinfo'].includes(node.role?.value || ''))
    .map((node) => `${node.role!.value}${node.name?.value ? ` "${node.name.value}"` : ''}`);
  expect(landmarks.filter((landmark) => landmark === 'banner')).toHaveLength(1);
  expect(landmarks).toEqual(expect.arrayContaining(['complementary', 'main', 'navigation "Main navigation"']));
});
