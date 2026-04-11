import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MetricCard } from '../components/MetricCard';
import { Stat } from '../components/Stat';

describe('Stat surfaces', () => {
  it('renders label, value, trend, and description content', () => {
    render(
      <Stat
        description="Updated in the last 24 hours"
        label="Active users"
        meta="vs yesterday"
        tone="success"
        trend="+12%"
        value="1,284"
      />
    );

    expect(screen.getByText('Active users')).toBeTruthy();
    expect(screen.getByText('1,284')).toBeTruthy();
    expect(screen.getByText('vs yesterday')).toBeTruthy();
    expect(screen.getByText('+12%')).toBeTruthy();
    expect(screen.getByText('Updated in the last 24 hours')).toBeTruthy();
  });

  it('supports the MetricCard wrapper as the card-styled alias', () => {
    const { container } = render(
      <MetricCard
        icon={<span>R</span>}
        label="Revenue"
        meta="Monthly recurring"
        value="$42,300"
      />
    );

    expect(screen.getByText('Revenue')).toBeTruthy();
    expect(screen.getByText('$42,300')).toBeTruthy();
    expect(screen.getByText('Monthly recurring')).toBeTruthy();
    expect(container.firstElementChild?.getAttribute('style')).toContain('padding: 14px');
  });
});
