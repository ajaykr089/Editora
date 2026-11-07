import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Alert } from '../components/Alert';

describe('Card.Actions, EmptyState plain, Alert live', () => {
  it('Card.Actions renders inside the header with its marker', () => {
    const { container } = render(
      <Card>
        <Card.Header>
          <Card.Title>Expenses</Card.Title>
          <Card.Description>This month</Card.Description>
          <Card.Actions><button>Export</button></Card.Actions>
        </Card.Header>
      </Card>
    );
    const actions = container.querySelector('[data-ui-card-header] > [data-ui-card-actions]');
    expect(actions?.textContent).toBe('Export');
  });

  it('EmptyState variant="plain" sets the attribute', () => {
    const { container } = render(<EmptyState variant="plain" title="Nothing yet" />);
    expect(container.querySelector('ui-empty-state')!.getAttribute('variant')).toBe('plain');
  });

  it('Alert live={false} drops role and aria-live; default keeps them', () => {
    const { container } = render(
      <>
        <Alert id="static" live={false} tone="warning" title="Trial ends soon" />
        <Alert id="live" tone="warning" title="Saved" />
      </>
    );
    const base = (id: string) => container.querySelector(`#${id}`)!.shadowRoot!.querySelector('[part="base"]')!;
    expect(base('static').hasAttribute('role')).toBe(false);
    expect(base('static').hasAttribute('aria-live')).toBe(false);
    expect(base('live').getAttribute('role')).toBe('alert');
    expect(base('live').getAttribute('aria-live')).toBe('assertive');
  });
});
