import { describe, expect, it } from 'vitest';
import { getCleanEditorHTML, stripEditorUiArtifacts } from '../editorOutput';

const withHandles =
  '<div class="rte-table-wrapper"><table><tbody><tr>' +
  '<td style="position: relative;">a<div class="resize-handle" style="position: absolute; right: -4px;"></div></td>' +
  '<td>b</td></tr></tbody></table><div class="table-resize-handle"></div></div>';

describe('stripEditorUiArtifacts', () => {
  it('returns html without resize handles untouched', () => {
    const html = '<p>hello <strong>world</strong></p><table><tbody><tr><td>x</td></tr></tbody></table>';
    expect(stripEditorUiArtifacts(html)).toBe(html);
  });

  it('removes column and table resize handles', () => {
    const out = stripEditorUiArtifacts(withHandles);
    expect(out).not.toContain('resize-handle');
    expect(out).toContain('<td>a</td>');
    expect(out).toContain('<td>b</td>');
    expect(out).toContain('rte-table-wrapper');
  });

  it('drops the anchor style the plugin added, and an emptied style attribute', () => {
    const out = stripEditorUiArtifacts(withHandles);
    expect(out).not.toContain('position');
    expect(out).not.toContain('style=');
  });

  it('keeps other inline styles on the cell', () => {
    const html = '<table><tbody><tr><td style="position: relative; color: red;">a<div class="resize-handle"></div></td></tr></tbody></table>';
    const out = stripEditorUiArtifacts(html);
    expect(out).toContain('color: red');
    expect(out).not.toContain('position');
  });

  it('leaves position: relative alone on a cell that never held a handle', () => {
    const html = '<table><tbody><tr><td style="position: relative;">a</td><td>b<div class="resize-handle"></div></td></tr></tbody></table>';
    expect(stripEditorUiArtifacts(html)).toContain('<td style="position: relative;">a</td>');
  });

  it('is a no-op for empty input and does not execute markup while parsing', () => {
    expect(stripEditorUiArtifacts('')).toBe('');
    (window as any).__stripPwned = 0;
    stripEditorUiArtifacts('<img src="x" onerror="window.__stripPwned=1"><div class="resize-handle"></div>');
    expect((window as any).__stripPwned).toBe(0);
  });
});

describe('getCleanEditorHTML', () => {
  it('reads an element without the handles and tolerates null', () => {
    const el = document.createElement('div');
    el.innerHTML = withHandles;
    expect(getCleanEditorHTML(el)).not.toContain('resize-handle');
    expect(getCleanEditorHTML(null)).toBe('');
  });
});

describe('stripEditorUiArtifacts and the media manager', () => {
  it('drops an upload that has not finished', () => {
    const html = '<p>a</p><figure class="rte-media" data-rte-media-pending="upload-1"></figure><p>b</p>';
    expect(stripEditorUiArtifacts(html)).toBe('<p>a</p><p>b</p>');
  });

  it('removes the editing-only contenteditable from captioned media, keeping everything else', () => {
    const html =
      '<figure class="rte-media" contenteditable="false" data-align="center" style="display: table;"><img src="a.png" alt="A"><figcaption contenteditable="true">Caption</figcaption></figure>';
    expect(stripEditorUiArtifacts(html)).toBe(
      '<figure class="rte-media" data-align="center" style="display: table;"><img src="a.png" alt="A"><figcaption>Caption</figcaption></figure>',
    );
  });

  it('drops a caption that nobody wrote in', () => {
    const html = '<figure class="rte-media" contenteditable="false"><img src="a.png"><figcaption contenteditable="true"><br></figcaption></figure>';
    expect(stripEditorUiArtifacts(html)).toBe('<figure class="rte-media"><img src="a.png"></figure>');
  });

  it('leaves other figures alone', () => {
    const html = '<figure contenteditable="false"><img src="a.png"><figcaption></figcaption></figure>';
    expect(stripEditorUiArtifacts(html)).toBe(html);
  });
});
