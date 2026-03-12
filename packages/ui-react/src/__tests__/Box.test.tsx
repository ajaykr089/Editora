import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../../../ui-core/src/components/ui-box';
import { Box } from '../components/Box';

describe('Box wrapper', () => {
  it('forwards the public visual props to the host element', () => {
    const { container } = render(
      <Box variant="outline" tone="info" state="loading" elevation="high" radius={16} interactive>
        Content
      </Box>
    );

    const el = container.querySelector('ui-box') as HTMLElement | null;
    expect(el?.getAttribute('variant')).toBe('outline');
    expect(el?.getAttribute('tone')).toBe('info');
    expect(el?.getAttribute('state')).toBe('loading');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.getAttribute('radius')).toBe('16');
    expect(el?.hasAttribute('interactive')).toBe(true);
  });

  it('keeps the default surface props implicit', () => {
    const { container } = render(
      <Box variant="default" tone="default" state="idle" elevation="default" radius="default">
        Content
      </Box>
    );

    const el = container.querySelector('ui-box') as HTMLElement | null;
    expect(el?.hasAttribute('variant')).toBe(false);
    expect(el?.hasAttribute('tone')).toBe(false);
    expect(el?.hasAttribute('state')).toBe(false);
    expect(el?.hasAttribute('elevation')).toBe(false);
    expect(el?.hasAttribute('radius')).toBe(false);
  });

  it('serializes responsive layout props to host attributes', () => {
    const { container } = render(
      <Box p={{ initial: '12px', md: '16px' }} gap={{ initial: '8px', lg: '12px' }}>
        Content
      </Box>
    );

    const el = container.querySelector('ui-box') as HTMLElement | null;
    expect(el?.getAttribute('p')).toBe('{"initial":"12px","md":"16px"}');
    expect(el?.getAttribute('gap')).toBe('{"initial":"8px","lg":"12px"}');
  });
});
