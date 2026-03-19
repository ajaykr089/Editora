import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../components/Card';
import '../../../ui-core/src/components/ui-card';

import { Card } from '../components/Card';

describe('Card wrapper', () => {
  it('forwards public props to the host element', () => {
    const { container } = render(
      <Card variant="soft" size="lg" radius={12} tone="info" elevation="high" interactive>
        Content
      </Card>
    );

    const el = container.querySelector('ui-card') as HTMLElement | null;
    expect(el?.getAttribute('variant')).toBe('soft');
    expect(el?.getAttribute('size')).toBe('lg');
    expect(el?.getAttribute('radius')).toBe('12');
    expect(el?.getAttribute('tone')).toBe('info');
    expect(el?.getAttribute('elevation')).toBe('high');
    expect(el?.hasAttribute('interactive')).toBe(true);
  });

  it('maps convenience subcomponents to the card slot contract', () => {
    const { container } = render(
      <Card>
        <Card.Media>Media</Card.Media>
        <Card.Inset>Inset</Card.Inset>
        <Card.Header>
          <Card.Title>Quick start</Card.Title>
          <Card.Description>Start building your next project in minutes.</Card.Description>
        </Card.Header>
        <div>Body</div>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    );

    expect(container.querySelector('[slot="media"]')?.textContent).toBe('Media');
    expect(container.querySelector('[slot="inset"]')?.textContent).toBe('Inset');
    expect(container.querySelector('[slot="header"]')?.textContent).toContain('Quick start');
    expect(container.querySelector('[slot="footer"]')?.textContent).toBe('Footer');
    expect(container.querySelector('h3')?.textContent).toBe('Quick start');
    expect(container.querySelector('p')?.textContent).toBe('Start building your next project in minutes.');
  });

  it('applies interactive and disabled semantics through the wrapper', () => {
    const { container } = render(
      <Card interactive disabled>
        Content
      </Card>
    );

    const el = container.querySelector('ui-card') as HTMLElement | null;
    expect(el?.hasAttribute('interactive')).toBe(true);
    expect(el?.hasAttribute('disabled')).toBe(true);
  });

  it('gives title and description usable default styles', () => {
    const { container } = render(
      <Card>
        <Card.Header>
          <Card.Title>Title</Card.Title>
          <Card.Description>Description</Card.Description>
        </Card.Header>
      </Card>
    );

    const title = container.querySelector('h3') as HTMLElement | null;
    const description = container.querySelector('p') as HTMLElement | null;
    expect(title?.hasAttribute('data-ui-card-title')).toBe(true);
    expect(description?.hasAttribute('data-ui-card-description')).toBe(true);
    expect(document.getElementById('editora-ui-react-card-runtime-styles')?.textContent).toContain(
      'font-size: var(--ui-card-title-size, 18px)'
    );
    expect(document.getElementById('editora-ui-react-card-runtime-styles')?.textContent).toContain(
      'line-height: var(--ui-card-description-line-height, 20px)'
    );
  });
});
