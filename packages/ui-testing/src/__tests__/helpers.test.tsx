import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { screen } from 'shadow-dom-testing-library';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Checkbox, Dropdown, Form, Input, Select, Switch, Tabs, Textarea } from '@editora/ui-react';
import { chooseMenuItem, fillField, getFieldError, openDropdown, selectOption, selectTab, setupEditoraTests, toggleField } from '../index';

afterEach(() => { document.body.innerHTML = ''; });

describe('@editora/ui-testing with Testing Library (jsdom)', () => {
  it('setupEditoraTests stubs what jsdom lacks and loads the icons', async () => {
    await setupEditoraTests();
    expect(typeof ResizeObserver).toBe('function');
    expect(window.matchMedia('(min-width: 1px)').matches).toBe(false);
    const { iconsLoaded } = await import('@editora/ui-core');
    expect(iconsLoaded()).toBe(true);
  });

  it('selectOption picks an option from a Select by label', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select label="Role" onChange={onChange}>
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
      </Select>
    );
    await selectOption(user, 'Role', 'Staff');
    expect(onChange).toHaveBeenCalledWith('staff');
  });

  it('openDropdown and chooseMenuItem act on a Dropdown by its trigger', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown onSelect={onSelect}>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item value="export">Export</Dropdown.Item>
          <Dropdown.Item value="archive">Archive</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    );
    const menu = await openDropdown(user, 'Actions');
    expect(menu.getAttribute('role')).toBe('menu');
    await user.keyboard('{Escape}');
    await chooseMenuItem(user, 'Actions', 'Export');
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'export' }));
  });

  it('selectTab switches Tabs by name', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Tabs onChange={onChange}>
        <Tabs.Tab>Profile</Tabs.Tab>
        <Tabs.Tab>Billing</Tabs.Tab>
        <Tabs.Panel>p</Tabs.Panel>
        <Tabs.Panel>b</Tabs.Panel>
      </Tabs>
    );
    await selectTab(user, 'Billing');
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('fillField replaces, appends and commits text in Input and Textarea', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onCommit = vi.fn();
    render(
      <>
        <Input label="Email" defaultValue="old@x.io" onChange={onChange} onCommit={onCommit} />
        <Textarea label="Notes" />
      </>
    );
    await fillField(user, 'Email', 'ann@acme.test');
    expect(onChange).toHaveBeenLastCalledWith('ann@acme.test');
    await fillField(user, 'Email', '.uk', { append: true, commit: true });
    expect(onCommit).toHaveBeenLastCalledWith('ann@acme.test.uk');
    const notes = await fillField(user, 'Notes', 'Line one');
    expect((notes as HTMLTextAreaElement).value).toBe('Line one');
  });

  it('toggleField clicks a Checkbox or a Switch by label', async () => {
    const user = userEvent.setup();
    const onBillable = vi.fn();
    const onActive = vi.fn();
    render(
      <>
        <Checkbox onChange={onBillable}>Billable</Checkbox>
        <Switch onChange={onActive}>Active</Switch>
      </>
    );
    await toggleField(user, 'Billable');
    await toggleField(user, 'Active');
    expect(onBillable).toHaveBeenCalled();
    expect(onActive).toHaveBeenCalled();
  });

  it('getFieldError reads a validation error on an Editora field and a marked native input', async () => {
    const formRef = React.createRef<HTMLElement & { validate(): Promise<unknown> }>();
    render(
      <Form ref={formRef as React.Ref<HTMLElement>}>
        <Input name="email" label="Email" required />
        <input name="phone" aria-label="Phone" />
        <Input name="company" label="Company" />
      </Form>
    );
    await screen.findByShadowRole('textbox', { name: 'Email' });
    await formRef.current!.validate();
    const phone = document.querySelector('input[name="phone"]') as HTMLInputElement;
    phone.setCustomValidity('Not a phone number');
    phone.setAttribute('aria-invalid', 'true');

    expect(await getFieldError('Email')).not.toBe('');
    expect(await getFieldError('Phone')).toBe('Not a phone number');
    expect(await getFieldError('Company')).toBe('');
  });
});
