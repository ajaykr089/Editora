// @vitest-environment node
import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Badge, Button, Combobox, Input, MultiSelect, Pagination, Select, Tabs, Textarea } from '../index';

// Wrappers write their attributes in layout effects, which never run on the server. The server
// markup must still carry them: the preload styles (`ui-input[label]:not(:defined)`, ...) and the
// element's first render before hydration depend on them.
describe('server-rendered wrapper attributes', () => {
  it('has no window here', () => {
    expect(typeof window).toBe('undefined');
  });

  it('writes the attributes the wrapper sets on its host into the server HTML', () => {
    const html = renderToString(
      <>
        <Input label="Email" description="Work address" size="lg" required />
        <Textarea label="Notes" />
        <Select label="Country" value="in"><option value="in">India</option></Select>
        <MultiSelect label="Tags" />
        <Combobox label="City" />
        <Tabs selected={1} variant="soft">
          <Tabs.Tab>One</Tabs.Tab>
          <Tabs.Tab>Two</Tabs.Tab>
          <Tabs.Panel>1</Tabs.Panel>
          <Tabs.Panel>2</Tabs.Panel>
        </Tabs>
        <Button variant="secondary" size="sm" disabled>Save</Button>
        <Pagination page={2} count={5} />
        <Badge tone="success" pill className="mine">New</Badge>
      </>
    );
    const tag = (name: string) => html.match(new RegExp(`<${name}\\b[^>]*>`))?.[0] ?? '';

    expect(tag('ui-input')).toMatch(/ label="Email"/);
    expect(tag('ui-input')).toMatch(/ description="Work address"/);
    expect(tag('ui-input')).toMatch(/ size="lg"/);
    expect(tag('ui-input')).toMatch(/ required=""/);
    expect(tag('ui-textarea')).toMatch(/ label="Notes"/);
    expect(tag('ui-select')).toMatch(/ label="Country"/);
    expect(tag('ui-multi-select')).toMatch(/ label="Tags"/);
    expect(tag('ui-combobox')).toMatch(/ label="City"/);
    expect(tag('ui-tabs')).toMatch(/ selected="1"/);
    expect(tag('ui-tabs')).toMatch(/ variant="soft"/);
    expect(tag('ui-button')).toMatch(/ variant="secondary"/);
    expect(tag('ui-button')).toMatch(/ disabled=""/);
    expect(tag('ui-pagination')).toMatch(/ page="2"/);
    expect(tag('ui-pagination')).toMatch(/ count="5"/);
    expect(tag('ui-badge')).toMatch(/ tone="success"/);
    expect(tag('ui-badge')).toMatch(/ class="mine"/);
  });

  it('leaves out defaults the wrapper would not set', () => {
    const html = renderToString(<Input />);
    expect(html).not.toMatch(/ label=/);
    expect(html).not.toMatch(/ size=/);
  });
});
