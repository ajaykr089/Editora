import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  useHeadlessAccordion,
  useHeadlessCheckbox,
  useHeadlessCombobox,
  useHeadlessContextMenu,
  useHeadlessNavigationMenu,
  useHeadlessScrollArea,
  useHeadlessSelect,
  useHeadlessToaster,
  useHeadlessRadioGroup,
  useHeadlessSlider,
  useHeadlessSwitch,
  useHeadlessCollapsible,
  useHeadlessDialog,
  useHeadlessHoverCard,
  useHeadlessListbox,
  useHeadlessMenu,
  useHeadlessTabs,
  useHeadlessToggleGroup,
  useHeadlessToolbar,
  useHeadlessTooltip,
} from '@editora/ui-react';

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
        <button ref={dialog.triggerRef} style={{ minHeight: 28 }}>Delete file</button>
        <div ref={dialog.contentRef} hidden style={{ ...panel, position: 'fixed', inset: 0, margin: 'auto', height: 'fit-content', width: 320 }}>
          <h2 style={{ marginTop: 0 }}>Delete file?</h2>
          <p data-dialog-description>This cannot be undone.</p>
          <button data-dialog-close style={{ minHeight: 28 }}>Cancel</button>
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
        <button ref={menu.triggerRef} style={{ minHeight: 28 }}>Actions</button>
        <div ref={menu.menuRef} hidden style={{ ...panel, padding: 4, display: 'grid' }}>
          <button data-menu-item style={{ minHeight: 28 }}>Edit</button>
          <button data-menu-item aria-disabled="true" style={{ minHeight: 28 }}>Duplicate</button>
          <button data-menu-item style={{ minHeight: 28 }}>Archive</button>
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
          {/* 24px minimum target size (WCAG 2.5.8): plain buttons are smaller. */}
          <button data-tab data-value="account" style={{ minHeight: 28, padding: '0 12px' }}>Account</button>
          <button data-tab data-value="billing" style={{ minHeight: 28, padding: '0 12px' }}>Billing</button>
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
          <div data-option data-value="bug" style={{ minHeight: 28 }}>Bug</div>
          <div data-option data-value="feature" style={{ minHeight: 28 }}>Feature</div>
          <div data-option data-value="docs" style={{ minHeight: 28 }}>Docs</div>
        </div>
        <p>Selected: {list.value.join(', ') || 'none'}</p>
      </div>
    );
  },
};

const btn: React.CSSProperties = { minHeight: 28, minWidth: 28 };

export const Collapsible: Story = {
  render: function Render() {
    const c = useHeadlessCollapsible();
    return (
      <div>
        <button ref={c.triggerRef} style={btn}>{c.open ? 'Hide' : 'Show'} details</button>
        <div ref={c.contentRef} style={{ ...panel, marginTop: 8 }}>Shipping takes 3–5 working days.</div>
      </div>
    );
  },
};

export const Accordion: Story = {
  render: function Render() {
    const acc = useHeadlessAccordion({ defaultValue: ['shipping'] });
    const items = [
      ['shipping', 'Shipping', 'Orders ship within two working days.'],
      ['returns', 'Returns', 'Return anything within 30 days.'],
      ['warranty', 'Warranty', 'Two years on every product.'],
    ];
    return (
      <div ref={acc.rootRef} style={{ ...panel, maxWidth: 420, padding: 8 }}>
        {items.map(([value, title, body]) => (
          <div key={value} data-accordion-item data-value={value}>
            <h3 style={{ margin: 0 }}>
              <button data-accordion-trigger style={{ ...btn, width: '100%', textAlign: 'start' }}>{title}</button>
            </h3>
            <div data-accordion-content style={{ padding: '4px 8px 12px' }}>{body}</div>
          </div>
        ))}
      </div>
    );
  },
};

export const Tooltip: Story = {
  render: function Render() {
    const tip = useHeadlessTooltip({ placement: 'top' });
    return (
      <div style={{ paddingTop: 48 }}>
        <button ref={tip.triggerRef} style={btn}>Save</button>
        <div ref={tip.contentRef} style={{ background: '#111', color: '#fff', borderRadius: 6, padding: '4px 8px', fontSize: 13 }}>Saves the draft (Ctrl+S)</div>
      </div>
    );
  },
};

export const HoverCard: Story = {
  render: function Render() {
    const card = useHeadlessHoverCard();
    return (
      <div>
        <p>Written by <a ref={card.triggerRef} href="#ada">@ada</a>.</p>
        <div ref={card.contentRef} style={{ ...panel, width: 240 }}><strong>Ada Lovelace</strong><br />Wrote the first program.</div>
      </div>
    );
  },
};

export const ToggleGroup: Story = {
  render: function Render() {
    const align = useHeadlessToggleGroup({ defaultValue: ['left'] });
    const marks = useHeadlessToggleGroup({ type: 'multiple' });
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <div ref={align.rootRef} aria-label="Text alignment" style={{ display: 'flex', gap: 4 }}>
          {['left', 'center', 'right'].map((v) => <button key={v} data-toggle-item data-value={v} style={btn}>{v}</button>)}
        </div>
        <div ref={marks.rootRef} aria-label="Formatting" style={{ display: 'flex', gap: 4 }}>
          {['bold', 'italic', 'underline'].map((v) => <button key={v} data-toggle-item data-value={v} style={btn}>{v}</button>)}
        </div>
        <p>Alignment: {align.value.join(', ') || 'none'}; formatting: {marks.value.join(', ') || 'none'}</p>
      </div>
    );
  },
};

export const Toolbar: Story = {
  render: function Render() {
    const tb = useHeadlessToolbar();
    return (
      <div ref={tb.rootRef} aria-label="Formatting" style={{ ...panel, display: 'flex', gap: 4, padding: 4, width: 'fit-content' }}>
        <button style={btn}>Bold</button>
        <button style={btn}>Italic</button>
        <input aria-label="Font size" defaultValue="14" style={{ width: 48, minHeight: 28 }} />
        <button style={btn}>Link</button>
      </div>
    );
  },
};

export const FormControls: Story = {
  render: function Render() {
    const terms = useHeadlessCheckbox({ name: 'terms', required: true });
    const wifi = useHeadlessSwitch({ name: 'wifi', defaultChecked: true });
    const plan = useHeadlessRadioGroup({ name: 'plan', defaultValue: 'free' });
    const price = useHeadlessSlider({ name: 'price', defaultValue: [20, 80], minStepsBetweenThumbs: 5 });
    const [sent, setSent] = React.useState('');
    const box: React.CSSProperties = { ...btn, display: 'inline-flex', alignItems: 'center', gap: 6 };
    const thumb: React.CSSProperties = { position: 'absolute', top: '50%', marginTop: -10, width: 20, height: 20, borderRadius: '50%', background: '#2563eb', border: '2px solid #fff', boxShadow: '0 0 0 1px #2563eb' };
    return (
      <form
        style={{ display: 'grid', gap: 16, maxWidth: 360 }}
        onSubmit={(event) => {
          event.preventDefault();
          setSent(new URLSearchParams(new FormData(event.currentTarget) as unknown as Record<string, string>).toString());
        }}
      >
        <button ref={terms.ref} style={box}>{terms.checked === true ? '☑' : '☐'} Accept the terms</button>
        <button ref={wifi.ref} style={box}>Wi-Fi: {wifi.checked ? 'on' : 'off'}</button>
        <div ref={plan.rootRef} aria-label="Plan" style={{ display: 'flex', gap: 4 }}>
          {['free', 'pro', 'team'].map((v) => <button key={v} data-radio-item data-value={v} style={btn}>{plan.value === v ? '●' : '○'} {v}</button>)}
        </div>
        <div ref={price.rootRef} style={{ position: 'relative', height: 28, margin: '0 10px' }}>
          <span style={{ position: 'absolute', inset: '12px 0', background: '#ddd', borderRadius: 2 }} />
          <span data-slider-range style={{ position: 'absolute', top: 12, bottom: 12, background: '#2563eb' }} />
          <span data-slider-thumb aria-label="Minimum price" style={thumb} />
          <span data-slider-thumb aria-label="Maximum price" style={thumb} />
        </div>
        <p>Price {price.value.join(' to ')}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={btn}>Submit</button>
          <button type="reset" style={btn}>Reset</button>
        </div>
        <output>{sent}</output>
      </form>
    );
  },
};

const option: React.CSSProperties = { padding: '6px 10px', borderRadius: 6, cursor: 'default', minHeight: 24 };
const popup: React.CSSProperties = { ...panel, padding: 4, minWidth: 160 };

export const Select: Story = {
  render: function Render() {
    const select = useHeadlessSelect({ placeholder: 'Choose a fruit' });
    return (
      <div>
        <button ref={select.triggerRef} style={{ ...btn, minWidth: 180, textAlign: 'start' }}><span data-select-value /> ▾</button>
        <div ref={select.listboxRef} hidden aria-label="Fruit" style={popup}>
          {['Apple', 'Banana', 'Cherry', 'Grape'].map((f) => <div key={f} data-option data-value={f.toLowerCase()} style={option}>{f}</div>)}
        </div>
        <p>Value: {select.value || 'none'}</p>
      </div>
    );
  },
};

export const Combobox: Story = {
  render: function Render() {
    const combo = useHeadlessCombobox();
    return (
      <div>
        <label htmlFor="country">Country</label>{' '}
        <input id="country" ref={combo.inputRef} style={{ minHeight: 28 }} />
        <div ref={combo.listboxRef} hidden style={popup}>
          {['France', 'Germany', 'Greece', 'India', 'Italy', 'Japan'].map((c) => <div key={c} data-option data-value={c.toLowerCase()} style={option}>{c}</div>)}
          <div data-combobox-empty style={option}>No matches</div>
        </div>
        <p>Value: {combo.value || 'none'}</p>
      </div>
    );
  },
};

export const ContextMenu: Story = {
  render: function Render() {
    const [last, setLast] = React.useState('');
    const ctx = useHeadlessContextMenu({ onSelect: (item) => setLast(item.textContent || '') });
    return (
      <div>
        <div ref={ctx.targetRef} tabIndex={0} style={{ ...panel, height: 120, display: 'grid', placeItems: 'center', borderStyle: 'dashed' }}>
          Right click, long press, or focus and press Shift+F10
        </div>
        <div ref={ctx.menuRef} hidden style={{ ...popup, display: 'grid' }}>
          <button data-menu-item style={btn}>Copy</button>
          <button data-menu-item style={btn}>Paste</button>
          <button data-menu-item aria-disabled="true" style={btn}>Delete</button>
        </div>
        <p>{last ? `Chose ${last}` : 'Nothing chosen'}</p>
      </div>
    );
  },
};

export const NavigationMenu: Story = {
  render: function Render() {
    const nav = useHeadlessNavigationMenu();
    const link: React.CSSProperties = { display: 'block', padding: '6px 8px', minHeight: 24 };
    return (
      <nav ref={nav.rootRef} aria-label="Main">
        <ul style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
          <li data-nav-item data-value="products" style={{ position: 'relative' }}>
            <button data-nav-trigger style={btn}>Products ▾</button>
            <div data-nav-content style={{ ...popup, position: 'absolute', top: '100%', marginTop: 4, zIndex: 1 }}>
              <a href="#editor" style={link}>Editor</a>
              <a href="#charts" style={link}>Charts</a>
            </div>
          </li>
          <li data-nav-item data-value="docs" style={{ position: 'relative' }}>
            <button data-nav-trigger style={btn}>Docs ▾</button>
            <div data-nav-content style={{ ...popup, position: 'absolute', top: '100%', marginTop: 4, zIndex: 1 }}>
              <a href="#guide" style={link}>Guide</a>
              <a href="#api" style={link}>API</a>
            </div>
          </li>
          <li data-nav-item><a href="#blog" style={{ ...link, lineHeight: '16px' }}>Blog</a></li>
        </ul>
      </nav>
    );
  },
};

export const ScrollArea: Story = {
  render: function Render() {
    const area = useHeadlessScrollArea();
    return (
      <div ref={area.rootRef} style={{ position: 'relative', width: 280, height: 180, ...panel, padding: 0, overflow: 'hidden' }}>
        <div data-scroll-viewport aria-label="Release notes" style={{ height: '100%', padding: 12, boxSizing: 'border-box' }}>
          {Array.from({ length: 20 }, (_, i) => <p key={i} style={{ margin: '0 0 8px' }}>Release note {i + 1}</p>)}
        </div>
        <div data-scrollbar="vertical" style={{ position: 'absolute', top: 2, right: 2, bottom: 2, width: 8 }}>
          <div data-scroll-thumb style={{ width: 8, borderRadius: 4, background: 'rgba(0,0,0,.35)' }} />
        </div>
      </div>
    );
  },
};

export const Toaster: Story = {
  render: function Render() {
    const toaster = useHeadlessToaster<{ title: string }>();
    return (
      <div>
        <button style={btn} onClick={() => toaster.toast({ title: `Saved at ${new Date().toLocaleTimeString()}` })}>Save</button>
        <ol ref={toaster.regionRef} style={{ position: 'fixed', right: 16, bottom: 16, display: 'grid', gap: 8, listStyle: 'none', margin: 0, padding: 0, width: 280 }}>
          {toaster.toasts.map((t) => (
            <li key={t.id} ref={toaster.toastRef(t.id)} style={{ ...panel, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateX(var(--toast-swipe, 0))' }}>
              {t.title}
              <button data-toast-close aria-label="Close" style={btn}>×</button>
            </li>
          ))}
        </ol>
      </div>
    );
  },
};
