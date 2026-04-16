import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Carousel } from '../components/Carousel';

describe('Carousel', () => {
  it('renders slide indicators and advances with the control buttons', () => {
    render(
      <Carousel>
        <Carousel.Item label="Overview"><div>Overview slide</div></Carousel.Item>
        <Carousel.Item label="Metrics"><div>Metrics slide</div></Carousel.Item>
        <Carousel.Item label="Launch"><div>Launch slide</div></Carousel.Item>
      </Carousel>
    );

    const nextButton = screen.getByText('Next').closest('ui-button') as HTMLElement | null;
    fireEvent.click(nextButton as HTMLElement);

    expect(screen.getByLabelText('Go to Metrics').getAttribute('aria-current')).toBe('true');
    expect(screen.getByRole('group', { name: '2 of 3: Metrics' }).hasAttribute('data-active')).toBe(true);
  });

  it('prevents redundant change events when loop is disabled at the edge', () => {
    const onIndexChange = vi.fn();

    render(
      <Carousel index={0} loop={false} onIndexChange={onIndexChange}>
        <Carousel.Item label="Intro"><div>Intro slide</div></Carousel.Item>
        <Carousel.Item label="Checklist"><div>Checklist slide</div></Carousel.Item>
      </Carousel>
    );

    fireEvent.click(screen.getByText('Previous').closest('ui-button') as HTMLElement);

    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it('supports keyboard navigation and makes inactive slide content inert', () => {
    render(
      <Carousel>
        <Carousel.Item label="First">
          <button type="button">Primary action</button>
        </Carousel.Item>
        <Carousel.Item label="Second">
          <button type="button">Secondary action</button>
        </Carousel.Item>
      </Carousel>
    );

    const region = screen.getByRole('region', { name: 'Carousel' });
    const inactiveButton = screen.getByText('Secondary action');
    const inactiveSlide = inactiveButton.closest('[role="group"]') as HTMLElement | null;

    expect(inactiveSlide?.hasAttribute('inert')).toBe(true);
    expect(inactiveButton.getAttribute('tabindex')).toBe('-1');

    fireEvent.keyDown(region, { key: 'ArrowRight' });

    expect(screen.getByLabelText('Go to Second').getAttribute('aria-current')).toBe('true');
    expect(screen.getByText('Primary action').getAttribute('tabindex')).toBe('-1');
  });

  it('supports swipe gestures on touch devices', () => {
    render(
      <Carousel>
        <Carousel.Item label="First"><div>First slide</div></Carousel.Item>
        <Carousel.Item label="Second"><div>Second slide</div></Carousel.Item>
      </Carousel>
    );

    const viewport = screen.getByRole('group', { name: '1 of 2: First' }).parentElement?.parentElement as HTMLElement;

    fireEvent.touchStart(viewport, { touches: [{ clientX: 180, clientY: 24 }] });
    fireEvent.touchEnd(viewport, { changedTouches: [{ clientX: 80, clientY: 28 }] });

    expect(screen.getByLabelText('Go to Second').getAttribute('aria-current')).toBe('true');
  });

  it('supports controlled index changes through indicator buttons', () => {
    const onIndexChange = vi.fn();

    render(
      <Carousel index={0} onIndexChange={onIndexChange}>
        <Carousel.Item label="Intro"><div>Intro slide</div></Carousel.Item>
        <Carousel.Item label="Checklist"><div>Checklist slide</div></Carousel.Item>
      </Carousel>
    );

    fireEvent.click(screen.getByLabelText('Go to Checklist'));

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('renders multiple slides when items are wrapped in a fragment', () => {
    render(
      <Carousel>
        <>
          <Carousel.Item label="First"><div>First slide</div></Carousel.Item>
          <Carousel.Item label="Second"><div>Second slide</div></Carousel.Item>
        </>
      </Carousel>
    );

    expect(screen.getByLabelText('Go to First')).toBeTruthy();
    expect(screen.getByLabelText('Go to Second')).toBeTruthy();
  });

  it('reveals hover controls only when the carousel is hovered', () => {
    render(
      <Carousel controlsPosition="center" controlsVariant="arrow" controlsVisibility="hover">
        <Carousel.Item label="Intro"><div>Intro slide</div></Carousel.Item>
        <Carousel.Item label="Gallery"><div>Gallery slide</div></Carousel.Item>
      </Carousel>
    );

    const region = screen.getByRole('region', { name: 'Carousel' });
    const nextButton = screen.getByLabelText('Next slide').closest('ui-button') as HTMLElement | null;
    const controls = nextButton?.parentElement as HTMLElement | null;

    expect(controls?.style.opacity).toBe('0');

    fireEvent.mouseEnter(region);

    expect(controls?.style.opacity).toBe('1');
  });

  it('supports vertical direction with line indicators and arrow key navigation', () => {
    const { container } = render(
      <Carousel direction="vertical" indicatorsVariant="line">
        <Carousel.Item label="Plan"><div>Plan slide</div></Carousel.Item>
        <Carousel.Item label="Build"><div>Build slide</div></Carousel.Item>
      </Carousel>
    );

    const region = screen.getByRole('region', { name: 'Carousel' });
    const activeIndicator = screen.getByLabelText('Go to Plan');
    const nextButton = container.querySelector('ui-button[aria-label="Next slide"]') as HTMLElement | null;
    const controls = nextButton?.parentElement as HTMLElement | null;
    const activeSlide = screen.getByRole('group', { name: '1 of 2: Plan' });
    const track = activeSlide.parentElement as HTMLElement | null;

    expect(activeIndicator.style.height).toBe('36px');
    expect(activeIndicator.style.width).toBe('4px');
    expect(region.style.gridTemplateColumns).toBe('minmax(0, 1fr) auto');
    expect(controls?.style.flexDirection).toBe('column');

    fireEvent.keyDown(region, { key: 'ArrowDown' });

    expect(screen.getByLabelText('Go to Build').getAttribute('aria-current')).toBe('true');
    expect(track?.style.transform).toContain('translateY(');
    expect(track?.style.transform).not.toContain('translateX(');
  });

  it('supports centered arrow controls without rendering text labels', () => {
    const { container } = render(
      <Carousel controlsPosition="center" controlsVariant="arrow">
        <Carousel.Item label="Intro"><div>Intro slide</div></Carousel.Item>
        <Carousel.Item label="Gallery"><div>Gallery slide</div></Carousel.Item>
      </Carousel>
    );

    const nextButton = container.querySelector('ui-button[aria-label="Next slide"]') as HTMLElement | null;
    const controls = nextButton?.parentElement as HTMLElement | null;

    expect(screen.queryByText('Next')).toBeNull();
    expect(controls?.style.top).toBe('50%');
    expect(controls?.style.transform).toBe('translateY(-50%)');

    fireEvent.click(nextButton as HTMLElement);

    expect(screen.getByLabelText('Go to Gallery').getAttribute('aria-current')).toBe('true');
  });

  it('supports fade transitions without applying a sliding transform', () => {
    render(
      <Carousel transition="fade">
        <Carousel.Item label="Alpha"><div>Alpha slide</div></Carousel.Item>
        <Carousel.Item label="Beta"><div>Beta slide</div></Carousel.Item>
      </Carousel>
    );

    const activeSlide = screen.getByRole('group', { name: '1 of 2: Alpha' });
    const inactiveSlide = screen.getByText('Beta slide').closest('[role="group"]') as HTMLElement | null;
    const track = activeSlide.parentElement as HTMLElement | null;

    expect(track?.style.display).toBe('grid');
    expect(track?.style.transform).toBe('');
    expect((activeSlide as HTMLElement).style.opacity).toBe('1');
    expect(inactiveSlide?.style.opacity).toBe('0');
  });

  it('advances automatically when autoplay is enabled', () => {
    vi.useFakeTimers();

    render(
      <Carousel autoPlay defaultIndex={0} interval={1500}>
        <Carousel.Item label="First"><div>First slide</div></Carousel.Item>
        <Carousel.Item label="Second"><div>Second slide</div></Carousel.Item>
      </Carousel>
    );

    act(() => {
      vi.advanceTimersByTime(1600);
    });

    expect(screen.getByLabelText('Go to Second').getAttribute('aria-current')).toBe('true');

    vi.useRealTimers();
  });

  it('pauses autoplay while hovered when pauseOnHover is enabled', () => {
    vi.useFakeTimers();
    const onIndexChange = vi.fn();

    render(
      <Carousel autoPlay index={0} interval={1500} onIndexChange={onIndexChange} pauseOnHover>
        <Carousel.Item label="First"><div>First slide</div></Carousel.Item>
        <Carousel.Item label="Second"><div>Second slide</div></Carousel.Item>
      </Carousel>
    );

    const region = screen.getByRole('region', { name: 'Carousel' });

    fireEvent.mouseEnter(region);
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onIndexChange).not.toHaveBeenCalled();

    fireEvent.mouseLeave(region);
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onIndexChange).toHaveBeenCalledWith(1);

    vi.useRealTimers();
  });

  it('disables autoplay when reduced motion is preferred', () => {
    vi.useFakeTimers();
    const originalMatchMedia = window.matchMedia;
    const onIndexChange = vi.fn();

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <Carousel autoPlay index={0} onIndexChange={onIndexChange}>
        <Carousel.Item label="First"><div>First slide</div></Carousel.Item>
        <Carousel.Item label="Second"><div>Second slide</div></Carousel.Item>
      </Carousel>
    );

    vi.advanceTimersByTime(6000);

    expect(onIndexChange).not.toHaveBeenCalled();

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: originalMatchMedia,
    });
    vi.useRealTimers();
  });
});
