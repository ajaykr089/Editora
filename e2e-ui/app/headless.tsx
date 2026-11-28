import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  useHeadlessAccordion,
  useHeadlessCheckbox,
  useHeadlessCombobox,
  useHeadlessContextMenu,
  useHeadlessDialog,
  useHeadlessMenu,
  useHeadlessNavigationMenu,
  useHeadlessRadioGroup,
  useHeadlessSelect,
  useHeadlessSlider,
  useHeadlessSwitch,
  useHeadlessTabs,
  useHeadlessToaster,
  useHeadlessToggleGroup,
  useHeadlessToolbar,
  useHeadlessTooltip,
} from '@editora/ui-react/Headless';

// One demo per headless hook, on plain markup: the browser tests drive their keyboard and pointer contracts.

function DialogDemo() {
  const dialog = useHeadlessDialog();
  return (
    <section>
      <button ref={dialog.triggerRef}>Open dialog</button>
      <div ref={dialog.contentRef} hidden className="pop" style={{ position: 'fixed', inset: 0, margin: 'auto', width: 260, height: 'fit-content' }}>
        <h2>Delete file?</h2>
        <button>Delete</button>
        <button data-dialog-close>Cancel</button>
      </div>
    </section>
  );
}

function MenuDemo() {
  const [chose, setChose] = React.useState('');
  const menu = useHeadlessMenu({ onSelect: (item) => setChose(item.textContent || '') });
  return (
    <section>
      <button ref={menu.triggerRef}>Actions</button>
      <div ref={menu.menuRef} hidden className="pop">
        <button data-menu-item>Edit</button>
        <button data-menu-item aria-disabled="true">Duplicate</button>
        <button data-menu-item>Archive</button>
      </div>
      <output id="menu-out">{chose}</output>
    </section>
  );
}

function TabsDemo() {
  const tabs = useHeadlessTabs({ defaultValue: 'a' });
  return (
    <section>
      <div ref={tabs.tablistRef} aria-label="Settings">
        <button data-tab data-value="a">Account</button>
        <button data-tab data-value="b">Billing</button>
        <button data-tab data-value="c">Team</button>
      </div>
      <div data-panel data-value="a">Account panel</div>
      <div data-panel data-value="b">Billing panel</div>
      <div data-panel data-value="c">Team panel</div>
    </section>
  );
}

function AccordionDemo() {
  const acc = useHeadlessAccordion();
  return (
    <section ref={acc.rootRef}>
      {['Shipping', 'Returns'].map((title) => (
        <div key={title} data-accordion-item data-value={title.toLowerCase()}>
          <h3><button data-accordion-trigger>{title}</button></h3>
          <div data-accordion-content>{title} details</div>
        </div>
      ))}
    </section>
  );
}

function TooltipDemo() {
  const tip = useHeadlessTooltip({ delay: 100 });
  return (
    <section>
      <button ref={tip.triggerRef}>Save</button>
      <div ref={tip.contentRef} style={{ background: '#111', color: '#fff', padding: 4 }}>Saves the draft</div>
    </section>
  );
}

function ToggleToolbarDemo() {
  const align = useHeadlessToggleGroup({ defaultValue: ['left'] });
  const toolbar = useHeadlessToolbar();
  return (
    <section style={{ display: 'grid', gap: 8 }}>
      <div ref={align.rootRef} aria-label="Alignment">
        <button data-toggle-item data-value="left">Left</button>
        <button data-toggle-item data-value="center">Center</button>
        <button data-toggle-item data-value="right">Right</button>
      </div>
      <div ref={toolbar.rootRef} aria-label="Formatting">
        <button>Bold</button>
        <button>Italic</button>
        <input aria-label="Font size" defaultValue="14" />
        <button>Link</button>
      </div>
    </section>
  );
}

function FormDemo() {
  const terms = useHeadlessCheckbox({ name: 'terms', required: true });
  const wifi = useHeadlessSwitch({ name: 'wifi' });
  const plan = useHeadlessRadioGroup({ name: 'plan', defaultValue: 'free' });
  const price = useHeadlessSlider({ name: 'price', defaultValue: [20, 80] });
  const fruit = useHeadlessSelect({ name: 'fruit', placeholder: 'Pick a fruit' });
  const [sent, setSent] = React.useState('');
  return (
    <form
      id="form"
      style={{ display: 'grid', gap: 8 }}
      onSubmit={(e) => {
        e.preventDefault();
        setSent([...new FormData(e.currentTarget)].map(([k, v]) => `${k}=${v}`).join('&'));
      }}
    >
      <button ref={terms.ref}>Accept terms</button>
      <button ref={wifi.ref}>Wi-Fi</button>
      <div ref={plan.rootRef} aria-label="Plan">
        <button data-radio-item data-value="free">Free</button>
        <button data-radio-item data-value="pro">Pro</button>
        <button data-radio-item data-value="team">Team</button>
      </div>
      <div ref={price.rootRef} id="track">
        <span data-slider-range />
        <span data-slider-thumb aria-label="Minimum price" />
        <span data-slider-thumb aria-label="Maximum price" />
      </div>
      <label htmlFor="fruit">Fruit</label>
      <button id="fruit" ref={fruit.triggerRef}><span data-select-value /></button>
      <div ref={fruit.listboxRef} hidden className="pop">
        <div data-option data-value="apple">Apple</div>
        <div data-option data-value="banana">Banana</div>
        <div data-option data-value="cherry">Cherry</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
      <output id="form-out">{sent}</output>
    </form>
  );
}

function ComboboxDemo() {
  const combo = useHeadlessCombobox();
  return (
    <section>
      <label htmlFor="country">Country</label>
      <input id="country" ref={combo.inputRef} />
      <div ref={combo.listboxRef} hidden className="pop">
        <div data-option data-value="fr">France</div>
        <div data-option data-value="de">Germany</div>
        <div data-option data-value="gr">Greece</div>
        <div data-combobox-empty>No matches</div>
      </div>
      <output id="combo-out">{combo.value}</output>
    </section>
  );
}

function ContextMenuDemo() {
  const [chose, setChose] = React.useState('');
  const ctx = useHeadlessContextMenu({ onSelect: (item) => setChose(item.textContent || '') });
  return (
    <section>
      <div ref={ctx.targetRef} tabIndex={0} id="area" style={{ height: 60, border: '2px dashed #999' }}>Right-click area</div>
      <div ref={ctx.menuRef} hidden className="pop" aria-label="Area actions">
        <button data-menu-item>Copy</button>
        <button data-menu-item>Paste</button>
      </div>
      <output id="ctx-out">{chose}</output>
    </section>
  );
}

function NavDemo() {
  const nav = useHeadlessNavigationMenu({ openDelay: 100 });
  return (
    <nav ref={nav.rootRef} aria-label="Main">
      <ul style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0 }}>
        <li data-nav-item data-value="products" style={{ position: 'relative' }}>
          <button data-nav-trigger>Products</button>
          <div data-nav-content className="pop" style={{ position: 'absolute' }}><a href="#editor">Editor</a><a href="#charts">Charts</a></div>
        </li>
        <li data-nav-item><a href="#blog">Blog</a></li>
      </ul>
    </nav>
  );
}

function ToasterDemo() {
  const toaster = useHeadlessToaster<{ title: string }>({ duration: 1500 });
  return (
    <section>
      <button onClick={() => toaster.toast({ title: 'Saved' })}>Show toast</button>
      <section ref={toaster.regionRef} id="toasts">
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {toaster.toasts.map((t) => (
            <li key={t.id} ref={toaster.toastRef(t.id)} style={{ background: '#222', color: '#fff', padding: 8 }}>
              {t.title} <button data-toast-close aria-label="Close">×</button>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}

function App() {
  return (
    <>
      <DialogDemo />
      <MenuDemo />
      <TabsDemo />
      <AccordionDemo />
      <TooltipDemo />
      <ToggleToolbarDemo />
      <FormDemo />
      <ComboboxDemo />
      <ContextMenuDemo />
      <NavDemo />
      <ToasterDemo />
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
(window as any).__ready = true;
