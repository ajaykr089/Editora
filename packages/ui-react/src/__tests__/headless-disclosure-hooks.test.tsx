import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  useHeadlessAccordion,
  useHeadlessCollapsible,
  useHeadlessHoverCard,
  useHeadlessToggleGroup,
  useHeadlessToolbar,
  useHeadlessTooltip,
} from '../index';

function Collapsible(props: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const c = useHeadlessCollapsible(props);
  return (
    <>
      <button ref={c.triggerRef}>Details</button>
      <div ref={c.contentRef} data-testid="panel">More</div>
      <span data-testid="state">{String(c.open)}</span>
    </>
  );
}

function Accordion(props: { value?: string[]; onValueChange?: (v: string[]) => void; type?: 'single' | 'multiple' }) {
  const acc = useHeadlessAccordion(props);
  return (
    <div ref={acc.rootRef}>
      {['a', 'b'].map((v) => (
        <div key={v} data-accordion-item data-value={v}>
          <h3><button data-accordion-trigger>{v.toUpperCase()}</button></h3>
          <div data-accordion-content data-testid={`p-${v}`}>{v} body</div>
        </div>
      ))}
      <span data-testid="value">{acc.value.join(',')}</span>
    </div>
  );
}

function Tooltip() {
  const tip = useHeadlessTooltip({ delay: 100 });
  return (
    <>
      <button ref={tip.triggerRef}>Save</button>
      <div ref={tip.contentRef} data-testid="tip">Saves the draft</div>
      <button onClick={tip.show}>show tip</button>
      <span data-testid="state">{String(tip.open)}</span>
    </>
  );
}

function HoverCard() {
  const card = useHeadlessHoverCard();
  return (
    <>
      <a href="#ada" ref={card.triggerRef}>@ada</a>
      <div ref={card.contentRef} data-testid="card">Ada</div>
      <button onClick={card.show}>show</button>
      <span data-testid="state">{String(card.open)}</span>
    </>
  );
}

function ToggleGroup(props: { type?: 'single' | 'multiple'; defaultValue?: string[] }) {
  const g = useHeadlessToggleGroup(props);
  return (
    <div ref={g.rootRef} aria-label="Align">
      {['l', 'c', 'r'].map((v) => <button key={v} data-toggle-item data-value={v}>{`Align ${v}`}</button>)}
      <output data-testid="value">{g.value.join('+')}</output>
    </div>
  );
}

function Toolbar() {
  const tb = useHeadlessToolbar();
  return (
    <div ref={tb.rootRef} aria-label="Format">
      <button>Bold</button>
      <button>Italic</button>
    </div>
  );
}

describe('headless disclosure hooks', () => {
  it('useHeadlessCollapsible toggles and reports state; controlled stays put', async () => {
    const { getByText, getByTestId, unmount } = render(<Collapsible />);
    expect(getByTestId('panel').hidden).toBe(true);
    act(() => { getByText('Details').click(); });
    expect(getByTestId('panel').hidden).toBe(false);
    expect(getByTestId('state').textContent).toBe('true');
    unmount();

    const onOpenChange = vi.fn();
    const c = render(<Collapsible open={false} onOpenChange={onOpenChange} />);
    act(() => { c.getByText('Details').click(); });
    await act(async () => { await Promise.resolve(); });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(c.getByTestId('panel').hidden).toBe(true);
  });

  it('useHeadlessAccordion opens sections, controlled values win', async () => {
    const { getByText, getByTestId, unmount } = render(<Accordion type="multiple" />);
    act(() => { getByText('A').click(); });
    act(() => { getByText('B').click(); });
    expect(getByTestId('value').textContent).toBe('a,b');
    expect(getByTestId('p-a').getAttribute('role')).toBe('region');
    unmount();

    function Controlled() {
      const [value, setValue] = React.useState<string[]>(['b']);
      return <Accordion value={value} onValueChange={(v) => setValue(v.filter((x) => x !== 'a'))} />;
    }
    const c = render(<Controlled />);
    expect(c.getByTestId('p-b').hidden).toBe(false);
    act(() => { c.getByText('A').click(); });
    await act(async () => { await Promise.resolve(); });
    expect(c.getByTestId('p-a').hidden).toBe(true);
  });

  it('useHeadlessTooltip describes the trigger, shows, and hides on Escape', () => {
    const { getByText, getByTestId } = render(<Tooltip />);
    const tip = getByTestId('tip');
    expect(getByText('Save').getAttribute('aria-describedby')).toBe(tip.id);
    expect(tip.getAttribute('role')).toBe('tooltip');
    act(() => { fireEvent.click(getByText('show tip')); });
    expect(getByTestId('state').textContent).toBe('true');
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    expect(getByTestId('state').textContent).toBe('false');
  });

  it('useHeadlessHoverCard opens via show() and reports it', () => {
    const { getByText, getByTestId } = render(<HoverCard />);
    expect(getByTestId('card').getAttribute('aria-hidden')).toBe('true');
    act(() => { fireEvent.click(getByText('show')); });
    expect(getByTestId('state').textContent).toBe('true');
    expect(getByTestId('card').hidden).toBe(false);
  });

  it('useHeadlessToggleGroup tracks pressed items', () => {
    const { getByText, getByTestId } = render(<ToggleGroup type="multiple" defaultValue={['c']} />);
    expect(getByText('Align c').getAttribute('aria-pressed')).toBe('true');
    act(() => { getByText('Align l').click(); });
    expect(getByTestId('value').textContent!.split('+').sort()).toEqual(['c', 'l']);
  });

  it('useHeadlessToolbar gives one tab stop and arrow navigation', () => {
    const { getByText, getByLabelText } = render(<Toolbar />);
    expect(getByLabelText('Format').getAttribute('role')).toBe('toolbar');
    const bold = getByText('Bold');
    expect(bold.tabIndex).toBe(0);
    expect(getByText('Italic').tabIndex).toBe(-1);
    bold.focus();
    fireEvent.keyDown(bold, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(getByText('Italic'));
  });
});
