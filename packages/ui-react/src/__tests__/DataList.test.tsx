import React from 'react';
import { renderToString } from 'react-dom/server';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataList } from '../index';
import { DataList as ServerDataList } from '../server';

describe('DataList', () => {
  it('renders a native description list with its parts', () => {
    const { container } = render(
      <DataList divided labelWidth={120} className="mine">
        <DataList.Item>
          <DataList.Label>Status</DataList.Label>
          <DataList.Value>Active</DataList.Value>
        </DataList.Item>
      </DataList>
    );
    const host = container.querySelector('ui-data-list')!;
    expect(host.getAttribute('divided')).toBe('');
    expect(host.getAttribute('label-width')).toBe('120');
    expect(host.classList.contains('mine')).toBe(true);
    expect(host.querySelector('dl > div > dt')!.textContent).toBe('Status');
    expect(host.querySelector('dl > div > dd')!.textContent).toBe('Active');
  });

  it('renders items, and on the server', () => {
    const html = renderToString(<ServerDataList orientation="vertical" items={[{ label: 'Plan', value: 'Pro' }]} />);
    expect(html).toContain('<ui-data-list orientation="vertical"><dl><div><dt>Plan</dt><dd>Pro</dd></div></dl></ui-data-list>');
  });
});
