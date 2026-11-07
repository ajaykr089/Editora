import { describe, expect, it } from 'vitest';
import '../components/ui-slider';

describe('ui-slider without min/max', () => {
  it('uses 0..100 instead of clamping to max=0', async () => {
    document.body.innerHTML = '<ui-slider value="40"></ui-slider>';
    await new Promise((resolve) => setTimeout(resolve, 0));
    const slider = document.querySelector('ui-slider') as HTMLElement & { value: number };
    expect(slider.value).toBe(40);
    expect(slider.getAttribute('aria-valuemax')).toBe('100');
    expect(slider.getAttribute('aria-valuenow')).toBe('40');
  });
});
