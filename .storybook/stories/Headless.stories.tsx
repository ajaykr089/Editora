import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useHeadlessDialog, useHeadlessListbox, useHeadlessMenu, useHeadlessTabs } from '@editora/ui-react';

const meta: Meta = { title: 'UI/Headless hooks' };
export default meta;
type Story = StoryObj;

// Plain markup and inline styles: the hooks add behaviour only.
const panel: React.CSSProperties = { background: 'var(--ui-color-surface, #fff)', color: 'var(--ui-color-text, #111)', border: '1px solid var(--ui-color-border, #ddd)', borderRadius: 10, padding: 16 };

export const Dialog: Story = {
  render: function Render() {
    const dialog = useHeadlessDialog();
    return (
      <div>
        <button ref={dialog.triggerRef}>Delete file</button>
        <div ref={dialog.contentRef} hidden style={{ ...panel, position: 'fixed', inset: 0, margin: 'auto', height: 'fit-content', width: 320 }}>
          <h2 style={{ marginTop: 0 }}>Delete file?</h2>
          <p data-dialog-description>This cannot be undone.</p>
          <button data-dialog-close>Cancel</button>
        </div>
      </div>
    );
  },
};

export const Menu: Story = {
  render: function Render() {
    const [last, setLast] = React.useState('');
    const menu = useHeadlessMenu({ onSelect: (item) => setLast(item.textContent || '') });
    return (
      <div>
        <button ref={menu.triggerRef}>Actions</button>
        <div ref={menu.menuRef} hidden style={{ ...panel, padding: 4, display: 'grid' }}>
          <button data-menu-item>Edit</button>
          <button data-menu-item aria-disabled="true">Duplicate</button>
          <button data-menu-item>Archive</button>
        </div>
        <p>{last ? `Chose ${last}` : 'Nothing chosen'}</p>
      </div>
    );
  },
};

export const Tabs: Story = {
  render: function Render() {
    const tabs = useHeadlessTabs({ defaultValue: 'account' });
    return (
      <div>
        <div ref={tabs.tablistRef} aria-label="Settings" style={{ display: 'flex', gap: 8 }}>
          <button data-tab data-value="account">Account</button>
          <button data-tab data-value="billing">Billing</button>
        </div>
        <div data-panel data-value="account" style={panel}>Account settings</div>
        <div data-panel data-value="billing" style={panel}>Billing settings</div>
      </div>
    );
  },
};

export const Listbox: Story = {
  render: function Render() {
    const list = useHeadlessListbox({ multiple: true, defaultValue: ['bug'] });
    return (
      <div>
        <div ref={list.listboxRef} aria-label="Labels" style={{ ...panel, padding: 4, width: 200 }}>
          <div data-option data-value="bug">Bug</div>
          <div data-option data-value="feature">Feature</div>
          <div data-option data-value="docs">Docs</div>
        </div>
        <p>Selected: {list.value.join(', ') || 'none'}</p>
      </div>
    );
  },
};
