import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-data-table';
import '../components/ui-form';
import '../components/ui-sidebar';
import '../components/ui-stepper';
import '../components/ui-wizard';
import '../components/ui-quick-actions';

function styleText(el: Element): string {
  return (el.shadowRoot?.querySelector('style') as HTMLStyleElement | null)?.textContent || '';
}

function rootPath(): string {
  return process.cwd().includes('/packages/ui-core') ? resolve(process.cwd(), '../..') : process.cwd();
}

describe('design-system governance hardening', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('admin primitives are token-first and high-contrast ready', () => {
    const elements = [
      document.createElement('ui-data-table'),
      document.createElement('ui-form'),
      document.createElement('ui-sidebar'),
      document.createElement('ui-stepper'),
      document.createElement('ui-wizard'),
      document.createElement('ui-quick-actions')
    ];
    document.body.append(...elements);

    elements.forEach((element) => {
      const css = styleText(element);
      expect(css).toContain('var(--ui-color-');
      expect(css).toContain('color-scheme: light dark');
      expect(css).toContain('forced-colors: active');
    });
  });

  it('critical admin stories avoid raw color literals in runtime styles', () => {
    const root = rootPath();
    const files = [
      '.storybook/stories/DataTable.stories.tsx',
      '.storybook/stories/Form.stories.tsx',
      '.storybook/stories/Sidebar.stories.tsx',
      '.storybook/stories/Reporting.stories.tsx',
      '.storybook/stories/QuickActions.stories.tsx',
      '.storybook/stories/Stepper.stories.tsx',
      '.storybook/stories/Wizard.stories.tsx'
    ];

    files.forEach((relativePath) => {
      const source = readFileSync(resolve(root, relativePath), 'utf8');
      expect(source).toContain('var(--ui-color-');
      expect(source).toContain('var(--ui-font-size-');
      expect(source).not.toMatch(/color:\s*['"]#[0-9a-fA-F]{3,6}['"]/);
      expect(source).not.toMatch(/background:\s*['"]#[0-9a-fA-F]{3,6}['"]/);
      expect(source).not.toMatch(/border:\s*['"]1px solid #[0-9a-fA-F]{3,6}['"]/);
      expect(source).not.toMatch(/fontSize:\s*(12|13|14|18)\b/);
    });
  });
});
