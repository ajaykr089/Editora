import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-questionnaire';
import type { UIQuestionnaire } from '../components/ui-questionnaire';
import { parseWhen } from '../components/ui-question';

const flush = async () => {
  for (let i = 0; i < 4; i += 1) await Promise.resolve();
};

const MARKUP = `
  <ui-questionnaire shortcuts>
    <ui-question name="scope" label="What should I build?" required>
      <option value="web">A web app</option>
      <option value="api" data-description="REST">An API</option>
    </ui-question>
    <ui-question name="auth" label="Which sign-in?" type="multiple" when="scope:web">
      <option value="email">Email</option>
      <option value="google">Google</option>
    </ui-question>
    <ui-question name="notes" label="Anything else?" type="text" placeholder="Optional"></ui-question>
    <p slot="complete">Thanks</p>
  </ui-questionnaire>`;

function mount(html = MARKUP): UIQuestionnaire {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  return host.firstElementChild as UIQuestionnaire;
}

const q = (el: Element) => el.shadowRoot!;
const legend = (el: Element) => q(el).querySelector('legend')!.textContent!.replace(/\*.*$/, '').replace(' (required)', '').trim();
const click = (el: Element, action: string) => (q(el).querySelector(`button[data-action="${action}"]`) as HTMLButtonElement).click();
function pick(el: Element, value: string) {
  const input = q(el).querySelector(`input.choice-input[value="${value}"]`) as HTMLInputElement;
  input.checked = !input.checked || input.type === 'radio';
  input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-questionnaire', () => {
  it('parses conditions', () => {
    expect(parseWhen('scope:web')).toEqual({ name: 'scope', value: 'web' });
    expect(parseWhen(' a : b c ')).toEqual({ name: 'a', value: 'b c' });
    expect(parseWhen('nope')).toBeUndefined();
  });

  it('asks the first question as a fieldset with native radios and progress', async () => {
    const el = mount();
    await flush();
    expect(legend(el)).toBe('What should I build?');
    const radios = q(el).querySelectorAll('input[type="radio"]');
    expect(radios.length).toBe(2);
    const bar = q(el).querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute('aria-valuenow')).toBe('1');
    expect(bar.getAttribute('aria-valuemax')).toBe('2');
    expect(q(el).querySelector('#progress-text')!.textContent).toBe('Question 1 of 2');
    expect((q(el).querySelector('[data-action="back"]') as HTMLElement).hidden).toBe(true);
    expect((q(el).querySelector('[data-action="skip"]') as HTMLElement).hidden).toBe(true);
  });

  it('blocks a required question, marks the answers invalid and focuses one', async () => {
    const el = mount();
    await flush();
    click(el, 'next');
    await flush();
    const error = q(el).querySelector('.error') as HTMLElement;
    expect(error.hidden).toBe(false);
    const first = q(el).querySelector('input.choice-input') as HTMLInputElement;
    expect(first.getAttribute('aria-invalid')).toBe('true');
    expect(q(el).activeElement).toBe(first);
    pick(el, 'api');
    expect(error.hidden).toBe(true);
    expect(first.hasAttribute('aria-invalid')).toBe(false);
  });

  it('only asks a conditional question when its condition holds', async () => {
    const el = mount();
    await flush();
    pick(el, 'api');
    click(el, 'next');
    await flush();
    expect(legend(el)).toBe('Anything else?');
    click(el, 'back');
    await flush();
    pick(el, 'web');
    click(el, 'next');
    await flush();
    expect(legend(el)).toBe('Which sign-in?');
    expect(q(el).querySelector('#progress-text')!.textContent).toBe('Question 2 of 3');
  });

  it('moves focus to the new question and fires step', async () => {
    const el = mount();
    await flush();
    const onStep = vi.fn();
    el.addEventListener('step', onStep);
    pick(el, 'web');
    click(el, 'next');
    await flush();
    expect(q(el).activeElement).toBe(q(el).querySelector('fieldset'));
    expect(onStep.mock.calls[0][0].detail).toEqual({ name: 'auth', index: 1, total: 3 });
  });

  it('collects several answers for multiple choice and keeps them when going back', async () => {
    const el = mount();
    await flush();
    pick(el, 'web');
    click(el, 'next');
    await flush();
    pick(el, 'email');
    pick(el, 'google');
    expect(el.values.auth).toEqual(['email', 'google']);
    click(el, 'back');
    await flush();
    click(el, 'next');
    await flush();
    expect((q(el).querySelector('input[value="google"]') as HTMLInputElement).checked).toBe(true);
  });

  it('skips optional questions and submits only answers that still apply', async () => {
    const el = mount();
    await flush();
    const onSubmit = vi.fn();
    el.addEventListener('submit', onSubmit);
    pick(el, 'web');
    click(el, 'next');
    await flush();
    pick(el, 'email');
    click(el, 'back');
    await flush();
    pick(el, 'api');
    click(el, 'next');
    await flush();
    expect(legend(el)).toBe('Anything else?');
    click(el, 'skip');
    await flush();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].detail.values).toEqual({ scope: 'api' });
    expect(el.hasAttribute('completed')).toBe(true);
    expect((q(el).querySelector('.complete') as HTMLElement).hidden).toBe(false);
  });

  it('stays open when submit is cancelled', async () => {
    const el = mount();
    await flush();
    el.addEventListener('submit', (event) => event.preventDefault());
    pick(el, 'api');
    click(el, 'next');
    await flush();
    click(el, 'next');
    await flush();
    expect(el.hasAttribute('completed')).toBe(false);
  });

  it('does not bubble submit to a surrounding form', async () => {
    const form = document.createElement('form');
    const onFormSubmit = vi.fn();
    form.addEventListener('submit', onFormSubmit);
    document.body.appendChild(form);
    form.innerHTML = '<ui-questionnaire><ui-question name="n" label="Name" type="text"></ui-question></ui-questionnaire>';
    const el = form.firstElementChild as UIQuestionnaire;
    await flush();
    click(el, 'next');
    expect(onFormSubmit).not.toHaveBeenCalled();
  });

  it('picks choices with number keys and goes on with Enter', async () => {
    const el = mount();
    await flush();
    const fieldset = q(el).querySelector('fieldset')!;
    fieldset.dispatchEvent(new KeyboardEvent('keydown', { key: '2', bubbles: true, composed: true }));
    expect(el.values.scope).toBe('api');
    fieldset.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await flush();
    expect(legend(el)).toBe('Anything else?');
    expect(q(el).querySelectorAll('.key').length).toBe(0);
  });

  it('leaves typing in a text answer alone', async () => {
    const el = mount('<ui-questionnaire shortcuts><ui-question name="n" label="Notes" type="text"></ui-question></ui-questionnaire>');
    await flush();
    const area = q(el).querySelector('textarea')!;
    area.value = '12';
    area.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    area.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true, composed: true }));
    area.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    expect(el.values.n).toBe('12');
    expect(el.hasAttribute('completed')).toBe(false);
  });

  it('takes an "other" answer typed beside the choices', async () => {
    const el = mount(`<ui-questionnaire><ui-question name="lang" label="Language" allow-other required>
      <option value="ts">TypeScript</option></ui-question></ui-questionnaire>`);
    await flush();
    const text = q(el).querySelector('input.other-text') as HTMLInputElement;
    text.value = 'Elixir';
    text.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(el.values.lang).toBe('Elixir');
    expect((q(el).querySelector('input[value="__other__"]') as HTMLInputElement).checked).toBe(true);
  });

  it('accepts items, restores values and exports FormData', async () => {
    const el = mount('<ui-questionnaire></ui-questionnaire>');
    el.items = [
      { name: 'a', label: 'A?', options: [{ value: 'x', label: 'X' }, { value: 'y', label: 'Y' }], type: 'multiple' },
      { name: 'b', label: 'B?', type: 'text' },
    ];
    el.values = { a: ['x', 'y'], b: 'hi' };
    await flush();
    expect(legend(el)).toBe('A?');
    expect((q(el).querySelector('input[value="y"]') as HTMLInputElement).checked).toBe(true);
    el.activeIndex = 1;
    await flush();
    expect((q(el).querySelector('textarea') as HTMLTextAreaElement).value).toBe('hi');
    expect(el.toFormData().getAll('a')).toEqual(['x', 'y']);
    el.reset();
    await flush();
    expect(el.values).toEqual({});
    expect(legend(el)).toBe('A?');
  });

  it('escapes labels and options', async () => {
    const el = mount('<ui-questionnaire></ui-questionnaire>');
    el.items = [{ name: 'a', label: '<img src=x onerror=1>', options: [{ value: '"><b>', label: '<b>bold</b>' }] }];
    await flush();
    expect(q(el).querySelector('img, b')).toBeNull();
  });

  it('follows question markup that changes', async () => {
    const el = mount();
    await flush();
    el.querySelector('ui-question')!.setAttribute('label', 'Changed?');
    await flush();
    await flush();
    expect(legend(el)).toBe('Changed?');
  });
});
