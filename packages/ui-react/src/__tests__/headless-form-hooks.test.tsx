import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useHeadlessCheckbox, useHeadlessRadioGroup, useHeadlessSlider, useHeadlessSwitch } from '../index';

function Checkbox(props: Parameters<typeof useHeadlessCheckbox>[0]) {
  const box = useHeadlessCheckbox(props);
  return (
    <form data-testid="form">
      <button ref={box.ref}>Accept terms</button>
      <output data-testid="state">{String(box.checked)}</output>
    </form>
  );
}

function Switch(props: { disabled?: boolean }) {
  const sw = useHeadlessSwitch(props);
  return <button ref={sw.ref}>Wi-Fi {sw.checked ? 'on' : 'off'}</button>;
}

function Radio(props: Parameters<typeof useHeadlessRadioGroup>[0]) {
  const group = useHeadlessRadioGroup(props);
  return (
    <form data-testid="form">
      <div ref={group.rootRef} aria-label="Plan">
        <button data-radio-item data-value="free">Free</button>
        <button data-radio-item data-value="team">Team</button>
      </div>
      <output data-testid="value">{group.value}</output>
    </form>
  );
}

function Slider(props: Parameters<typeof useHeadlessSlider>[0]) {
  const slider = useHeadlessSlider(props);
  return (
    <div ref={slider.rootRef}>
      <span data-slider-range />
      {slider.value.map((_, i) => <span key={i} data-slider-thumb aria-label={`Thumb ${i}`} />)}
      <output data-testid="value">{slider.value.join('-')}</output>
    </div>
  );
}

describe('headless form hooks', () => {
  it('useHeadlessCheckbox toggles, submits, and controlled stays put', async () => {
    const { getByText, getByTestId, unmount } = render(<Checkbox name="terms" />);
    const button = getByText('Accept terms');
    expect(button.getAttribute('role')).toBe('checkbox');
    act(() => { button.click(); });
    expect(getByTestId('state').textContent).toBe('true');
    expect(new FormData(getByTestId('form') as HTMLFormElement).get('terms')).toBe('on');
    unmount();

    const onCheckedChange = vi.fn();
    const c = render(<Checkbox checked="indeterminate" onCheckedChange={onCheckedChange} />);
    expect(c.getByText('Accept terms').getAttribute('aria-checked')).toBe('mixed');
    act(() => { c.getByText('Accept terms').click(); });
    await act(async () => { await Promise.resolve(); });
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(c.getByText('Accept terms').getAttribute('aria-checked')).toBe('mixed');
  });

  it('useHeadlessSwitch toggles and follows disabled without remounting', () => {
    const { getByRole, rerender } = render(<Switch />);
    const sw = getByRole('switch');
    act(() => { sw.click(); });
    expect(sw.textContent).toBe('Wi-Fi on');
    rerender(<Switch disabled />);
    act(() => { sw.click(); });
    expect(sw.textContent).toBe('Wi-Fi on');
    expect(sw.getAttribute('aria-disabled')).toBe('true');
  });

  it('useHeadlessRadioGroup checks with arrows and submits', () => {
    const { getByText, getByTestId } = render(<Radio name="plan" defaultValue="free" />);
    const free = getByText('Free');
    free.focus();
    fireEvent.keyDown(free, { key: 'ArrowDown' });
    expect(getByTestId('value').textContent).toBe('team');
    expect(document.activeElement).toBe(getByText('Team'));
    expect(new FormData(getByTestId('form') as HTMLFormElement).get('plan')).toBe('team');
  });

  it('useHeadlessSlider moves by keys and reports commit', () => {
    const onValueCommit = vi.fn();
    const { getByLabelText, getByTestId } = render(<Slider defaultValue={[10, 60]} step={10} onValueCommit={onValueCommit} />);
    const hi = getByLabelText('Thumb 1');
    expect(hi.getAttribute('role')).toBe('slider');
    fireEvent.keyDown(hi, { key: 'ArrowRight' });
    expect(getByTestId('value').textContent).toBe('10-70');
    expect(onValueCommit).toHaveBeenCalledWith([10, 70]);
  });
});
