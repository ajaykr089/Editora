import { describe, expect, it } from 'vitest';
import '../components/ui-rating';

const press = (el: HTMLElement, key: string) => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
};

describe('ui-rating keyboard', () => {
  it('changes the value with the arrow keys, Home and End while the host (the slider) has focus', () => {
    document.body.innerHTML = '<ui-rating value="2" max="5" aria-label="Score"></ui-rating>';
    const el = document.querySelector('ui-rating') as HTMLElement;

    expect(el.getAttribute('role')).toBe('slider');
    press(el, 'ArrowRight');
    expect(el.getAttribute('value')).toBe('3');
    press(el, 'ArrowUp');
    expect(el.getAttribute('value')).toBe('4');
    press(el, 'ArrowLeft');
    expect(el.getAttribute('value')).toBe('3');
    press(el, 'End');
    expect(el.getAttribute('value')).toBe('5');
    press(el, 'Home');
    expect(el.getAttribute('value')).toBe('0');
  });

  it('does not change a read-only or disabled rating, and handles a star key press once', () => {
    document.body.innerHTML = '<ui-rating value="2" readonly></ui-rating><ui-rating value="2" disabled></ui-rating><ui-rating value="2"></ui-rating>';
    const [readonly, disabled, live] = Array.from(document.querySelectorAll('ui-rating')) as HTMLElement[];
    press(readonly, 'ArrowRight');
    press(disabled, 'ArrowRight');
    expect(readonly.getAttribute('value')).toBe('2');
    expect(disabled.getAttribute('value')).toBe('2');

    // a key that starts on a star inside the shadow root is not counted twice by the host listener
    const star = live.shadowRoot!.querySelector('.star') as HTMLElement;
    star.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, composed: true, cancelable: true }));
    expect(live.getAttribute('value')).toBe('3');
  });
});
