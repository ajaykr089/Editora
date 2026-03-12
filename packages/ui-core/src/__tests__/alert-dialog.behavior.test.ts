import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-alert-dialog';

function tick() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe('ui-alert-dialog', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('normalizes radius values onto the host style token', () => {
    const el = document.createElement('ui-alert-dialog') as HTMLElement;
    el.setAttribute('radius', 'full');
    document.body.appendChild(el);

    expect(el.style.getPropertyValue('--ui-alert-radius')).toBe('999px');

    el.setAttribute('radius', '12');
    expect(el.style.getPropertyValue('--ui-alert-radius')).toBe('12px');
  });

  it('accepts baseline visual attrs and size aliases without reopening', () => {
    const el = document.createElement('ui-alert-dialog') as any;
    el.setAttribute('open', '');
    el.setAttribute('variant', 'outline');
    el.setAttribute('tone', 'success');
    el.setAttribute('size', '3');
    el.setAttribute('elevation', 'high');
    el.setAttribute('indicator', 'none');
    document.body.appendChild(el);

    expect(el.variant).toBe('outline');
    expect(el.tone).toBe('success');
    expect(el.size).toBe('lg');
    expect(el.elevation).toBe('high');
    expect(el.indicator).toBe('none');
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('applies structured slots and config-driven visual props together', async () => {
    const el = document.createElement('ui-alert-dialog') as any;
    el.config = {
      title: 'Delete environment',
      description: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      tone: 'danger',
      variant: 'soft',
      size: 'lg',
      elevation: 'high',
      indicator: 'none',
      radius: 12
    };
    el.setAttribute('open', '');

    const icon = document.createElement('span');
    icon.slot = 'icon';
    icon.textContent = '!';
    el.appendChild(icon);
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute('tone')).toBe('danger');
    expect(el.getAttribute('variant')).toBe('soft');
    expect(el.getAttribute('size')).toBe('lg');
    expect(el.getAttribute('elevation')).toBe('high');
    expect(el.getAttribute('indicator')).toBe('none');
    expect(el.style.getPropertyValue('--ui-alert-radius')).toBe('12px');
    expect(el.shadowRoot?.querySelector('.btn-confirm')?.textContent).toContain('Delete');
    expect(el.shadowRoot?.querySelector('slot[name="icon"]')).toBeTruthy();
  });
});
