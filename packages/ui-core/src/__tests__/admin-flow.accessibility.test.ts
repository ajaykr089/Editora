import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-stepper';
import '../components/ui-wizard';
import '../components/ui-quick-actions';

function styleText(el: Element): string {
  return (el.shadowRoot?.querySelector('style') as HTMLStyleElement | null)?.textContent || '';
}

describe('admin flow accessibility hardening', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('stepper, wizard, and quick-actions include contrast-safe style contracts', () => {
    const stepper = document.createElement('ui-stepper');
    const wizard = document.createElement('ui-wizard');
    const quick = document.createElement('ui-quick-actions');
    document.body.append(stepper, wizard, quick);

    expect(styleText(stepper)).toContain('color-scheme: light dark');
    expect(styleText(stepper)).toContain('prefers-contrast: more');
    expect(styleText(stepper)).toContain('forced-colors: active');

    expect(styleText(wizard)).toContain('color-scheme: light dark');
    expect(styleText(wizard)).toContain('prefers-contrast: more');
    expect(styleText(wizard)).toContain('forced-colors: active');

    expect(styleText(quick)).toContain('color-scheme: light dark');
    expect(styleText(quick)).toContain('prefers-contrast: more');
    expect(styleText(quick)).toContain('forced-colors: active');
  });

  it('stepper uses RTL-aware keyboard navigation and emits selection events', () => {
    const stepper = document.createElement('ui-stepper');
    stepper.setAttribute(
      'steps',
      JSON.stringify([
        { value: 'org', label: 'Organization' },
        { value: 'policy', label: 'Policy' },
        { value: 'review', label: 'Review' }
      ])
    );
    stepper.setAttribute('clickable', '');
    stepper.style.direction = 'rtl';
    document.body.appendChild(stepper);

    const triggers = Array.from(stepper.shadowRoot?.querySelectorAll('.trigger') || []) as HTMLButtonElement[];
    expect(triggers.length).toBe(3);

    triggers[0].focus();
    triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(stepper.shadowRoot?.activeElement).toBe(triggers[1]);

    let selected: any = null;
    stepper.addEventListener('change', (event: Event) => {
      selected = (event as CustomEvent).detail;
    });
    triggers[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(stepper.getAttribute('value')).toBe('policy');
    expect(selected?.value).toBe('policy');
  });

  it('wizard exposes tab/tabpanel semantics and supports RTL keyboard mapping', () => {
    const wizard = document.createElement('ui-wizard');
    wizard.innerHTML = `
      <div slot="step" data-value="1" data-title="One">Step one panel</div>
      <div slot="step" data-value="2" data-title="Two">Step two panel</div>
      <div slot="step" data-value="3" data-title="Three">Step three panel</div>
    `;
    wizard.style.direction = 'rtl';
    document.body.appendChild(wizard);

    const tabs = Array.from(wizard.shadowRoot?.querySelectorAll('.step') || []) as HTMLButtonElement[];
    const panels = Array.from(wizard.querySelectorAll('[slot="step"]')) as HTMLElement[];
    expect(tabs.length).toBe(3);
    expect(panels.length).toBe(3);

    tabs.forEach((tab, index) => {
      expect(tab.getAttribute('role')).toBe('tab');
      expect(tab.getAttribute('aria-controls')).toBe(panels[index].id);
    });

    panels.forEach((panel, index) => {
      expect(panel.getAttribute('role')).toBe('tabpanel');
      expect(panel.getAttribute('aria-labelledby')).toBe(tabs[index].id);
    });

    tabs[0].focus();
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(wizard.shadowRoot?.activeElement).toBe(tabs[1]);

    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', altKey: true, bubbles: true }));
    expect(wizard.getAttribute('value')).toBe('2');
  });

  it('quick-actions syncs action accessibility and mirrors horizontal arrows in RTL', () => {
    const quick = document.createElement('ui-quick-actions');
    quick.setAttribute('collapsible', '');
    quick.setAttribute('open', '');
    quick.style.direction = 'rtl';
    quick.innerHTML = `
      <button slot="action">Create</button>
      <button slot="action">Assign</button>
      <button slot="action">Export</button>
    `;
    document.body.appendChild(quick);

    const toggle = quick.shadowRoot?.querySelector('.toggle') as HTMLButtonElement | null;
    const actions = Array.from(quick.querySelectorAll('[slot="action"]')) as HTMLButtonElement[];
    expect(toggle).toBeTruthy();
    expect(toggle?.getAttribute('aria-controls')).toBeTruthy();
    expect(actions.length).toBe(3);
    expect(actions[0].getAttribute('role')).toBe('button');
    expect(actions[0].getAttribute('tabindex')).toBe('0');

    actions[0].focus();
    actions[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement).toBe(actions[1]);

    quick.removeAttribute('open');
    expect(actions[0].getAttribute('tabindex')).toBe('-1');
    expect(actions[0].getAttribute('aria-hidden')).toBe('true');
  });
});
