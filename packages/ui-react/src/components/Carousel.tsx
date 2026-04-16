import React from 'react';
import { Button } from './Button';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[contenteditable="true"]',
  '[tabindex]',
].join(', ');

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener?.(update);
    return () => mediaQuery.removeListener?.(update);
  }, []);

  return prefersReducedMotion;
}

export type CarouselItemProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
  children?: React.ReactNode;
};

export type CarouselControlsVariant = 'button' | 'arrow';
export type CarouselControlsPosition = 'top' | 'center' | 'bottom';
export type CarouselControlsAlign = 'space-between' | 'center';
export type CarouselControlsVisibility = 'always' | 'hover' | 'hidden';
export type CarouselIndicatorsVariant = 'dot' | 'pill' | 'line';
export type CarouselDirection = 'horizontal' | 'vertical';
export type CarouselTransition = 'slide' | 'fade' | 'none';

export type CarouselProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  children?: React.ReactNode;
  defaultIndex?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  controlsVariant?: CarouselControlsVariant;
  controlsPosition?: CarouselControlsPosition;
  controlsAlign?: CarouselControlsAlign;
  controlsVisibility?: CarouselControlsVisibility;
  indicatorsVariant?: CarouselIndicatorsVariant;
  direction?: CarouselDirection;
  transition?: CarouselTransition;
  previousLabel?: string;
  nextLabel?: string;
  label?: string;
};

function flattenSlides(children: React.ReactNode): React.ReactNode[] {
  const slides: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (child == null || typeof child === 'boolean') return;

    if (React.isValidElement(child) && child.type === React.Fragment) {
      slides.push(...flattenSlides(child.props.children));
      return;
    }

    slides.push(child);
  });

  return slides;
}

function clampIndex(index: number, slideCount: number) {
  if (slideCount <= 1) return 0;
  return Math.max(0, Math.min(slideCount - 1, index));
}

function wrapIndex(index: number, slideCount: number) {
  if (slideCount <= 1) return 0;
  return ((index % slideCount) + slideCount) % slideCount;
}

function resolveSlideLabel(child: React.ReactNode, index: number) {
  if (React.isValidElement(child) && typeof child.props === 'object' && child.props && 'label' in child.props) {
    const label = child.props.label;
    if (typeof label === 'string' && label.trim()) return label;
  }

  return `Slide ${index + 1}`;
}

function arrowIcon(direction: 'previous' | 'next', axis: CarouselDirection) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
      width="16"
    >
      {axis === 'vertical'
        ? direction === 'previous'
          ? <path d="M18 15l-6-6-6 6" />
          : <path d="M6 9l6 6 6-6" />
        : direction === 'previous'
          ? <path d="M15 18l-6-6 6-6" />
          : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

function getIndicatorMetrics(variant: CarouselIndicatorsVariant, active: boolean, direction: CarouselDirection) {
  if (variant === 'line') {
    if (direction === 'vertical') {
      return {
        borderRadius: 999,
        blockSize: active ? 36 : 24,
        inlineSize: 4,
      };
    }

    return {
      borderRadius: 999,
      blockSize: 4,
      inlineSize: active ? 36 : 24,
    };
  }

  if (variant === 'pill') {
    if (direction === 'vertical') {
      return {
        borderRadius: 999,
        blockSize: active ? 28 : 18,
        inlineSize: 10,
      };
    }

    return {
      borderRadius: 999,
      blockSize: 10,
      inlineSize: active ? 28 : 18,
    };
  }

  return {
    borderRadius: 999,
    blockSize: 10,
    inlineSize: active ? 28 : 10,
  };
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(function CarouselItem(
  { label: _label, children, ...rest },
  forwardedRef
) {
  return (
    <div {...rest} ref={forwardedRef}>
      {children}
    </div>
  );
});

CarouselItem.displayName = 'Carousel.Item';

const CarouselRoot = React.forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  {
    children,
    defaultIndex = 0,
    index,
    onIndexChange,
    loop = true,
    autoPlay = false,
    interval = 5000,
    pauseOnHover = true,
    showControls = true,
    showIndicators = true,
    controlsVariant = 'button',
    controlsPosition = 'top',
    controlsAlign = 'space-between',
    controlsVisibility = 'always',
    indicatorsVariant = 'dot',
    direction = 'horizontal',
    transition = 'slide',
    previousLabel = 'Previous',
    nextLabel = 'Next',
    label = 'Carousel',
    className,
    style,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    ...rest
  },
  forwardedRef
) {
  const slides = flattenSlides(children);
  const slideCount = slides.length;
  const isControlled = typeof index === 'number';
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(() => clampIndex(defaultIndex, slideCount));
  const [isHovering, setIsHovering] = React.useState(false);
  const [isFocusWithin, setIsFocusWithin] = React.useState(false);
  const [viewportBlockSize, setViewportBlockSize] = React.useState<number | null>(null);
  const [verticalSlideOffset, setVerticalSlideOffset] = React.useState(0);
  const activeIndex = clampIndex(isControlled ? index ?? 0 : uncontrolledIndex, slideCount);
  const activeIndexRef = React.useRef(activeIndex);
  const slideRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const swipeStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const baseId = React.useId();
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  React.useEffect(() => {
    if (isControlled || slideCount <= 0) return;
    setUncontrolledIndex((current) => clampIndex(current, slideCount));
  }, [isControlled, slideCount]);

  React.useEffect(() => {
    if (direction !== 'vertical' || transition !== 'slide') {
      setViewportBlockSize(null);
      setVerticalSlideOffset(0);
      return;
    }

    const activeSlide = slideRefs.current[activeIndex];
    if (!activeSlide) return;

    const updateMetrics = () => {
      const nextSize = activeSlide.offsetHeight;
      const nextOffset = activeSlide.offsetTop;
      if (nextSize > 0) setViewportBlockSize(nextSize);
      setVerticalSlideOffset(nextOffset);
    };

    updateMetrics();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      updateMetrics();
    });

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, [activeIndex, direction, slideCount, transition]);

  const setActiveIndex = React.useCallback((nextIndex: number) => {
    const normalizedIndex = loop ? wrapIndex(nextIndex, slideCount) : clampIndex(nextIndex, slideCount);
    const currentIndex = activeIndexRef.current;

    if (normalizedIndex === currentIndex) {
      return;
    }

    if (!isControlled) {
      setUncontrolledIndex(normalizedIndex);
    }

    onIndexChange?.(normalizedIndex);
  }, [isControlled, loop, onIndexChange, slideCount]);

  const goToPrevious = React.useCallback(() => {
    setActiveIndex(activeIndexRef.current - 1);
  }, [setActiveIndex]);

  const goToNext = React.useCallback(() => {
    setActiveIndex(activeIndexRef.current + 1);
  }, [setActiveIndex]);

  React.useEffect(() => {
    if (!autoPlay || slideCount <= 1 || prefersReducedMotion) return;
    if ((pauseOnHover && isHovering) || isFocusWithin) return;
    if (typeof window === 'undefined') return;

    const timer = window.setInterval(() => {
      setActiveIndex(activeIndexRef.current + 1);
    }, Math.max(interval, 1200));

    return () => window.clearInterval(timer);
  }, [autoPlay, interval, isFocusWithin, isHovering, pauseOnHover, prefersReducedMotion, setActiveIndex, slideCount]);

  React.useEffect(() => {
    slideRefs.current.forEach((slide, slideIndex) => {
      if (!slide) return;

      const isActive = slideIndex === activeIndex;
      const focusableChildren = slide.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

      if (isActive) {
        slide.removeAttribute('inert');
        focusableChildren.forEach((node) => {
          if (!node.hasAttribute('data-carousel-tabindex')) return;
          const previousTabIndex = node.getAttribute('data-carousel-tabindex');
          if (previousTabIndex) node.setAttribute('tabindex', previousTabIndex);
          else node.removeAttribute('tabindex');
          node.removeAttribute('data-carousel-tabindex');
        });
        return;
      }

      slide.setAttribute('inert', '');
      focusableChildren.forEach((node) => {
        if (!node.hasAttribute('data-carousel-tabindex')) {
          node.setAttribute('data-carousel-tabindex', node.getAttribute('tabindex') ?? '');
        }
        node.setAttribute('tabindex', '-1');
      });
    });
  }, [activeIndex, slideCount]);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (direction === 'vertical' && event.key === 'ArrowUp') {
      event.preventDefault();
      goToPrevious();
      return;
    }

    if (direction === 'vertical' && event.key === 'ArrowDown') {
      event.preventDefault();
      goToNext();
      return;
    }

    if (direction === 'horizontal' && event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrevious();
      return;
    }

    if (direction === 'horizontal' && event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    }
  }, [direction, goToNext, goToPrevious, onKeyDown]);

  const handleMouseEnter = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    onMouseEnter?.(event);
    if (pauseOnHover) setIsHovering(true);
  }, [onMouseEnter, pauseOnHover]);

  const handleMouseLeave = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(event);
    if (pauseOnHover) setIsHovering(false);
  }, [onMouseLeave, pauseOnHover]);

  const handleFocusCapture = React.useCallback(() => {
    setIsFocusWithin(true);
  }, []);

  const handleBlurCapture = React.useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
    setIsFocusWithin(false);
  }, []);

  const handleTouchStart = React.useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = React.useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    const touch = event.changedTouches[0];
    swipeStartRef.current = null;
    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (direction === 'vertical') {
      if (Math.abs(deltaY) < 40 || Math.abs(deltaY) <= Math.abs(deltaX)) {
        return;
      }

      if (deltaY < 0) {
        goToNext();
        return;
      }

      goToPrevious();
      return;
    }

    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      goToNext();
      return;
    }

    goToPrevious();
  }, [direction, goToNext, goToPrevious]);

  const controlsDisabled = slideCount <= 1;
  const resolvedControlsVisibility = showControls ? controlsVisibility : 'hidden';
  const controlsVisible = resolvedControlsVisibility !== 'hidden' && slideCount > 1;
  const previousDisabled = controlsDisabled || (!loop && activeIndex <= 0);
  const nextDisabled = controlsDisabled || (!loop && activeIndex >= slideCount - 1);
  const verticalControlsRail = controlsVisible && direction === 'vertical';
  const slidePaddingTop = controlsVisible && controlsPosition === 'top' && direction === 'horizontal' ? 68 : 20;
  const slidePaddingBottom = controlsVisible && controlsPosition === 'bottom' && direction === 'horizontal' ? 68 : 20;
  const slidePaddingInlineStart = controlsVisible && controlsPosition === 'center' && direction === 'horizontal' ? 68 : 20;
  const slidePaddingInlineEnd = verticalControlsRail ? 84 : controlsVisible && controlsPosition === 'center' && direction === 'horizontal' ? 68 : 20;
  const isFadeTransition = transition === 'fade';
  const isSlideTransition = transition === 'slide';
  const controlChromeVisible = resolvedControlsVisibility === 'always' || isHovering || isFocusWithin;

  const controlsContainerStyle: React.CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    gap: 8,
    opacity: controlChromeVisible ? 1 : 0,
    pointerEvents: 'none',
    position: 'absolute',
    transition: 'opacity 180ms ease',
    zIndex: 1,
  };

  if (direction === 'vertical') {
    controlsContainerStyle.right = 12;

    if (controlsPosition === 'center') {
      controlsContainerStyle.bottom = 12;
      controlsContainerStyle.justifyContent = 'space-between';
      controlsContainerStyle.top = 12;
    } else {
      controlsContainerStyle.justifyContent = 'center';
      controlsContainerStyle[controlsPosition === 'bottom' ? 'bottom' : 'top'] = 12;
    }
  } else if (controlsPosition === 'center') {
    controlsContainerStyle.justifyContent = 'space-between';
    controlsContainerStyle.left = 12;
    controlsContainerStyle.right = 12;
    controlsContainerStyle.top = '50%';
    controlsContainerStyle.transform = 'translateY(-50%)';
  } else {
    controlsContainerStyle.justifyContent = controlsAlign === 'center' ? 'center' : 'space-between';
    controlsContainerStyle.left = 12;
    controlsContainerStyle.right = 12;
    controlsContainerStyle[controlsPosition === 'bottom' ? 'bottom' : 'top'] = 12;
  }

  const sharedControlStyle: React.CSSProperties = {
    pointerEvents: controlChromeVisible ? 'auto' : 'none',
  };

  const iconControlStyle: React.CSSProperties = {
    alignItems: 'center',
    blockSize: 36,
    borderRadius: 999,
    inlineSize: 36,
    justifyContent: 'center',
    minInlineSize: 36,
    padding: 0,
  };

  const previousControl = (
    <Button
      ariaLabel="Previous slide"
      disabled={previousDisabled}
      recipe="outline"
      size="sm"
      style={{
        ...sharedControlStyle,
        ...(controlsVariant === 'arrow' ? iconControlStyle : null),
      }}
      variant="secondary"
      onClick={goToPrevious}
    >
      {controlsVariant === 'arrow' ? arrowIcon('previous', direction) : previousLabel}
    </Button>
  );

  const nextControl = (
    <Button
      ariaLabel="Next slide"
      disabled={nextDisabled}
      recipe="outline"
      size="sm"
      style={{
        ...sharedControlStyle,
        ...(controlsVariant === 'arrow' ? iconControlStyle : null),
      }}
      variant="secondary"
      onClick={goToNext}
    >
      {controlsVariant === 'arrow' ? arrowIcon('next', direction) : nextLabel}
    </Button>
  );

  return (
    <div
      {...rest}
      ref={forwardedRef}
      aria-label={label}
      aria-roledescription="carousel"
      className={className}
      role="region"
      style={{
        display: 'grid',
        gap: 12,
        gridTemplateColumns: direction === 'vertical' && showIndicators && slideCount > 1 ? 'minmax(0, 1fr) auto' : undefined,
        alignItems: direction === 'vertical' ? 'start' : undefined,
        minWidth: 0,
        ...style,
      }}
      tabIndex={0}
      onBlurCapture={handleBlurCapture}
      onFocusCapture={handleFocusCapture}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.94) 100%)',
          border: '1px solid rgba(148, 163, 184, 0.28)',
          borderRadius: 20,
          gridColumn: direction === 'vertical' ? '1 / 2' : undefined,
          minWidth: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            blockSize: direction === 'vertical' && viewportBlockSize != null ? viewportBlockSize : undefined,
            overflow: 'hidden',
          }}
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
        >
          <div
            style={{
              display: isFadeTransition ? 'grid' : 'flex',
              flexDirection: direction === 'vertical' ? 'column' : 'row',
              minWidth: 0,
              transform: isFadeTransition
                ? undefined
                : direction === 'vertical'
                  ? `translateY(-${verticalSlideOffset}px)`
                  : `translateX(-${activeIndex * 100}%)`,
              transition: prefersReducedMotion || transition === 'none'
                ? 'none'
                : isSlideTransition
                  ? 'transform 320ms ease'
                  : undefined,
              width: direction === 'horizontal' && !isFadeTransition ? `${Math.max(slideCount, 1) * 100}%` : '100%',
            }}
          >
            {slides.map((child, slideIndex) => {
              const slideLabel = resolveSlideLabel(child, slideIndex);
              return (
                <div
                  key={slideIndex}
                  aria-hidden={slideIndex !== activeIndex}
                  aria-label={`${slideIndex + 1} of ${slideCount}: ${slideLabel}`}
                  aria-roledescription="slide"
                  data-active={slideIndex === activeIndex ? '' : undefined}
                  id={`${baseId}-slide-${slideIndex}`}
                  ref={(node) => {
                    slideRefs.current[slideIndex] = node;
                  }}
                  role="group"
                  style={{
                    display: 'grid',
                    flex: isFadeTransition ? undefined : direction === 'vertical' ? '0 0 auto' : '0 0 100%',
                    gridArea: isFadeTransition ? '1 / 1' : undefined,
                    minHeight: 220,
                    minWidth: 0,
                    opacity: slideIndex === activeIndex ? 1 : isFadeTransition ? 0 : 0.56,
                    paddingBlockEnd: slidePaddingBottom,
                    paddingBlockStart: slidePaddingTop,
                    paddingInlineEnd: slidePaddingInlineEnd,
                    paddingInlineStart: slidePaddingInlineStart,
                    pointerEvents: slideIndex === activeIndex ? 'auto' : 'none',
                    transition: prefersReducedMotion || transition === 'none' ? 'none' : 'opacity 240ms ease',
                    width: '100%',
                  }}
                >
                  {child}
                </div>
              );
            })}
          </div>
        </div>

        {controlsVisible ? (
          <div style={controlsContainerStyle}>
            {previousControl}
            {nextControl}
          </div>
        ) : null}
      </div>

      {showIndicators && slideCount > 1 ? (
        <div
          aria-label={`${label} slides`}
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: direction === 'vertical' ? 'column' : 'row',
            flexWrap: direction === 'vertical' ? 'nowrap' : 'wrap',
            gap: 8,
            gridColumn: direction === 'vertical' ? '2 / 3' : undefined,
            justifyContent: 'center',
            justifySelf: direction === 'vertical' ? 'start' : undefined,
          }}
        >
          {slides.map((child, slideIndex) => {
            const slideLabel = resolveSlideLabel(child, slideIndex);
            const indicatorMetrics = getIndicatorMetrics(indicatorsVariant, slideIndex === activeIndex, direction);
            return (
              <button
                key={slideIndex}
                aria-controls={`${baseId}-slide-${slideIndex}`}
                aria-current={slideIndex === activeIndex ? 'true' : undefined}
                aria-label={`Go to ${slideLabel}`}
                disabled={controlsDisabled}
                style={{
                  background: slideIndex === activeIndex ? 'var(--ui-color-info, #2563eb)' : 'rgba(148, 163, 184, 0.4)',
                  border: 'none',
                  borderRadius: indicatorMetrics.borderRadius,
                  cursor: controlsDisabled ? 'default' : 'pointer',
                  height: indicatorMetrics.blockSize,
                  inlineSize: indicatorMetrics.inlineSize,
                  padding: 0,
                  transition: 'all 180ms ease',
                  width: indicatorMetrics.inlineSize,
                }}
                type="button"
                onClick={() => setActiveIndex(slideIndex)}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
});

CarouselRoot.displayName = 'Carousel';

export const Carousel = Object.assign(CarouselRoot, {
  Item: CarouselItem,
});

export default Carousel;
