import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '../components/Rating';
import '../../../ui-core/src/components/ui-rating';

import { Rating } from '../components/Rating';

describe('Rating Component', () => {
  it('should render Rating with default props', () => {
    const { container } = render(<Rating />);
    
    // Check that the rating element exists
    const ratingElement = container.querySelector('ui-rating');
    expect(ratingElement).toBeTruthy();
    
    // Check default attributes
    expect(ratingElement?.getAttribute('value')).toBe('0');
    expect(ratingElement?.getAttribute('max')).toBe('5');
    expect(ratingElement?.getAttribute('disabled')).toBeNull();
    expect(ratingElement?.getAttribute('readonly')).toBeNull();
  });

  it('should render Rating with custom props', () => {
    const { container } = render(
      <Rating 
        value={3}
        max={10}
        disabled={true}
        readonly={false}
        variant="glass"
        size="lg"
        theme="dark"
        tone="warning"
        animation="scale"
        shape="square"
        label="Customer Rating"
        showValue={true}
      />
    );

    const ratingElement = container.querySelector('ui-rating');
    expect(ratingElement).toBeTruthy();
    
    // Check custom attributes
    expect(ratingElement?.getAttribute('value')).toBe('3');
    expect(ratingElement?.getAttribute('max')).toBe('10');
    expect(ratingElement?.getAttribute('disabled')).toBe('');
    expect(ratingElement?.getAttribute('readonly')).toBeNull();
    expect(ratingElement?.getAttribute('variant')).toBe('glass');
    expect(ratingElement?.getAttribute('size')).toBe('lg');
    expect(ratingElement?.getAttribute('theme')).toBe('dark');
    expect(ratingElement?.getAttribute('tone')).toBe('warning');
    expect(ratingElement?.getAttribute('animation')).toBe('scale');
    expect(ratingElement?.getAttribute('shape')).toBe('square');
    expect(ratingElement?.getAttribute('label')).toBe('Customer Rating');
    expect(ratingElement?.getAttribute('show-value')).toBe('');
  });

  it('should handle onChange event', () => {
    const handleChange = vi.fn();
    const { container } = render(<Rating onChange={handleChange} />);
    
    const ratingElement = container.querySelector('ui-rating');
    expect(ratingElement).toBeTruthy();
    
    // Simulate change event
    const changeEvent = new CustomEvent('change', {
      detail: {
        value: 4,
        max: 5,
        disabled: false,
        readonly: false
      }
    });
    
    ratingElement?.dispatchEvent(changeEvent);
    
    expect(handleChange).toHaveBeenCalledWith({
      value: 4,
      max: 5,
      disabled: false,
      readonly: false
    });
  });

  it('should support different variants', () => {
    const variants = ['default', 'soft', 'glass', 'contrast', 'minimal'];
    
    variants.forEach(variant => {
      const { container } = render(<Rating variant={variant as any} />);
      const ratingElement = container.querySelector('ui-rating');
      expect(ratingElement?.getAttribute('variant')).toBe(variant);
    });
  });

  it('should support different sizes', () => {
    const sizes = ['sm', 'md', 'lg'];
    
    sizes.forEach(size => {
      const { container } = render(<Rating size={size as any} />);
      const ratingElement = container.querySelector('ui-rating');
      expect(ratingElement?.getAttribute('size')).toBe(size);
    });
  });

  it('should support different tones', () => {
    const tones = ['neutral', 'info', 'success', 'warning', 'danger'];
    
    tones.forEach(tone => {
      const { container } = render(<Rating tone={tone as any} />);
      const ratingElement = container.querySelector('ui-rating');
      expect(ratingElement?.getAttribute('tone')).toBe(tone);
    });
  });

  it('should support different animations', () => {
    const animations = ['scale', 'pulse', 'none'];
    
    animations.forEach(animation => {
      const { container } = render(<Rating animation={animation as any} />);
      const ratingElement = container.querySelector('ui-rating');
      expect(ratingElement?.getAttribute('animation')).toBe(animation);
    });
  });

  it('should support different shapes', () => {
    const shapes = ['rounded', 'square', 'pill'];
    
    shapes.forEach(shape => {
      const { container } = render(<Rating shape={shape as any} />);
      const ratingElement = container.querySelector('ui-rating');
      expect(ratingElement?.getAttribute('shape')).toBe(shape);
    });
  });

  it('should handle ARIA attributes', () => {
    const { container } = render(
      <Rating 
        ariaLabel="Product rating"
        ariaLabelledBy="rating-label"
        ariaDescribedBy="rating-description"
      />
    );

    const ratingElement = container.querySelector('ui-rating');
    expect(ratingElement?.getAttribute('aria-label')).toBe('Product rating');
    expect(ratingElement?.getAttribute('aria-labelledby')).toBe('rating-label');
    expect(ratingElement?.getAttribute('aria-describedby')).toBe('rating-description');
  });

  it('should apply custom radius style', () => {
    const { container } = render(<Rating radius="12px" />);
    
    const ratingElement = container.querySelector('ui-rating');
    expect(ratingElement).toBeTruthy();
    expect(ratingElement?.style.getPropertyValue('--ui-rating-radius')).toBe('12px');
  });
});