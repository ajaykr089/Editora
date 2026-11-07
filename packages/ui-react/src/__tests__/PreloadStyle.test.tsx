import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EditoraPreloadStyle } from '../server';
import { PRELOAD_CSS } from '@editora/ui-core/preload';

describe('EditoraPreloadStyle', () => {
  it('server-renders the pre-definition stylesheet with an optional nonce', () => {
    const html = renderToString(<EditoraPreloadStyle nonce="abc" />);
    expect(html).toContain('<style');
    expect(html).toContain('nonce="abc"');
    expect(html).toContain('data-editora-preload');
    expect(html).toContain('ui-tabs:not(:defined) &gt; [slot=&quot;panel&quot;]'.replace(/&gt;/g, '>').replace(/&quot;/g, '"'));
    expect(html.length).toBeGreaterThan(PRELOAD_CSS.length);
  });
});
