import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

// axe over every story in the Storybook build, unthemed and with the real light and dark themes injected
// (Storybook applies no theme, so the unthemed pass only sees fallback colours).
const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const sbDir = path.resolve(process.env.SB_DIR || 'storybook-static');
const index = JSON.parse(readFileSync(path.join(sbDir, 'index.json'), 'utf8')) as { entries: Record<string, { id: string; type: string }> };
const stories = Object.values(index.entries).filter((entry) => entry.type === 'story').map((entry) => entry.id);
const allowlist = JSON.parse(readFileSync(path.resolve('a11y-allowlist.json'), 'utf8')).rules as Record<string, Record<string, string>>;
const appPort = Number(process.env.E2E_UI_PORT || 5199);

// Page-level rules that do not apply to a component rendered alone in a story iframe.
const DISABLED_RULES = ['region', 'landmark-one-main', 'landmark-unique', 'landmark-no-duplicate-banner', 'landmark-no-duplicate-contentinfo', 'landmark-no-duplicate-main', 'landmark-complementary-is-top-level', 'landmark-banner-is-top-level', 'landmark-contentinfo-is-top-level', 'landmark-main-is-top-level', 'page-has-heading-one', 'document-title', 'html-has-lang', 'bypass', 'meta-viewport'];

let themeStyle = '';

test.beforeAll(async ({ browser }, info) => {
  const theme = info.project.metadata?.theme as 'light' | 'dark' | undefined;
  if (!theme) return;
  // The dump page applies the system theme, which follows the colour scheme it is opened with.
  const page = await browser.newPage({ colorScheme: theme });
  await page.goto(`http://127.0.0.1:${appPort}/theme-dump.html`);
  await page.waitForFunction(() => (window as any).themeStyle !== undefined);
  themeStyle = await page.evaluate(() => (window as any).themeStyle);
  await page.close();
  expect(themeStyle).toContain('--ui-color-primary');
});

// The rich-text editor has its own themes (data-theme on the editor, @editora/themes): in the UI kit's
// dark mode its stories still render the light editor theme, so the dark pass does not apply to them.
const themedSeparately = (id: string) => /^editor-/.test(id);

for (const id of stories) {
  test(id, async ({ page }, info) => {
    test.skip(info.project.name === 'dark' && themedSeparately(id), 'the editor themes itself (data-theme)');
    const mode = (info.project.metadata?.theme as string | undefined) || 'light';
    // Stories that render thousands of rows or animate on load need more than the default time.
    if (/large-dataset|10000|virtualized|animated/.test(id)) test.slow();
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(String(error)));
    if (themeStyle) {
      await page.addInitScript(([style, uiMode]) => {
        document.addEventListener('DOMContentLoaded', () => {
          document.documentElement.setAttribute('style', style);
          document.documentElement.setAttribute('data-ui-mode', uiMode);
          document.body.style.background = 'var(--ui-color-background)';
          document.body.style.color = 'var(--ui-color-text)';
        });
      }, [themeStyle, mode] as const);
    }
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    await page.waitForSelector('body.sb-show-main', { timeout: info.timeout / 2 });
    // Let entrance animations finish: axe samples colours, and text mid fade-in reads as low contrast.
    await page.waitForTimeout(/animated|marquee|number-ticker|odometer|spinning/.test(id) ? 1800 : 400);
    await page.evaluate(axeSource);
    const violations = await page.evaluate(async (disabled) => {
      const axe = (window as any).axe;
      const result = await axe.run(document.querySelector('#storybook-root') || document.body, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] },
        rules: Object.fromEntries(disabled.map((rule: string) => [rule, { enabled: false }])),
      });
      return result.violations.map((v: any) => ({ id: v.id, impact: v.impact, nodes: v.nodes.slice(0, 3).map((n: any) => n.target.join(' ')) }));
    }, DISABLED_RULES);
    const allowed = allowlist[id] || {};
    const unexpected = violations.filter((v: { id: string }) => !allowed[v.id]);
    expect(errors, 'page errors').toEqual([]);
    expect(unexpected, `axe (${info.project.name})`).toEqual([]);
  });
}
