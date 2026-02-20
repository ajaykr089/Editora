import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-data-table';
import '../components/ui-alert';
import '../components/ui-empty-state';
import '../components/ui-skeleton';
import '../components/ui-badge';
import '../components/ui-sidebar';
import '../components/ui-breadcrumb';
import '../components/ui-drawer';
import '../components/ui-app-header';
import '../components/ui-select';
import '../components/ui-combobox';
import '../components/ui-textarea';
import '../components/ui-field';

function styleText(el: Element): string {
  return (el.shadowRoot?.querySelector('style') as HTMLStyleElement | null)?.textContent || '';
}

describe('admin primitive theming + high contrast hardening', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    const globalStyle = document.getElementById('ui-data-table-light-dom-style');
    if (globalStyle?.parentElement) globalStyle.parentElement.removeChild(globalStyle);
  });

  it('ui-alert, ui-empty-state, ui-skeleton and ui-badge expose forced-colors rules', () => {
    const alert = document.createElement('ui-alert');
    const empty = document.createElement('ui-empty-state');
    const skeleton = document.createElement('ui-skeleton');
    const badge = document.createElement('ui-badge');
    document.body.append(alert, empty, skeleton, badge);

    expect(styleText(alert)).toContain('forced-colors: active');
    expect(styleText(empty)).toContain('forced-colors: active');
    expect(styleText(skeleton)).toContain('forced-colors: active');
    expect(styleText(badge)).toContain('forced-colors: active');
  });

  it('admin shell + form primitives expose contrast-safe styles', () => {
    const sidebar = document.createElement('ui-sidebar');
    const breadcrumb = document.createElement('ui-breadcrumb');
    const drawer = document.createElement('ui-drawer');
    const appHeader = document.createElement('ui-app-header');
    const select = document.createElement('ui-select');
    const combobox = document.createElement('ui-combobox');
    const textarea = document.createElement('ui-textarea');
    const field = document.createElement('ui-field');
    document.body.append(sidebar, breadcrumb, drawer, appHeader, select, combobox, textarea, field);

    expect(styleText(sidebar)).toContain('color-scheme: light dark');
    expect(styleText(sidebar)).toContain('forced-colors: active');

    expect(styleText(breadcrumb)).toContain('color-scheme: light dark');
    expect(styleText(breadcrumb)).toContain('forced-colors: active');

    expect(styleText(drawer)).toContain('color-scheme: light dark');
    expect(styleText(drawer)).toContain('forced-colors: active');

    expect(styleText(appHeader)).toContain('color-scheme: light dark');
    expect(styleText(appHeader)).toContain('forced-colors: active');

    expect(styleText(select)).toContain('color-scheme: light dark');
    expect(styleText(select)).toContain('forced-colors: active');

    expect(styleText(combobox)).toContain('color-scheme: light dark');
    expect(styleText(combobox)).toContain('forced-colors: active');

    expect(styleText(textarea)).toContain('color-scheme: light dark');
    expect(styleText(textarea)).toContain('forced-colors: active');

    expect(styleText(field)).toContain('color-scheme: light dark');
    expect(styleText(field)).toContain('forced-colors: active');
  });

  it('ui-data-table injects tokenized light-dom style with contrast media rules', () => {
    const table = document.createElement('ui-data-table');
    table.innerHTML = `
      <table>
        <thead><tr><th data-key="name">Name</th></tr></thead>
        <tbody><tr><td>Ava</td></tr></tbody>
      </table>
    `;
    document.body.appendChild(table);

    const globalStyle = document.getElementById('ui-data-table-light-dom-style');
    expect(globalStyle).toBeTruthy();
    const css = globalStyle?.textContent || '';
    expect(css).toContain('var(--ui-data-table-text');
    expect(css).toContain('prefers-contrast: more');
    expect(css).toContain('forced-colors: active');
  });
});
