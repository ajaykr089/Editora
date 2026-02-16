// Animation utilities for advanced toast animations
import { SpringConfig, AnimationConfig, ToastInstance, ToastOptions, BounceAnimation, SlideAnimation, ZoomAnimation, FlipAnimation, FadeAnimation, ElasticAnimation, RotateAnimation } from './types';

// Spring physics animation utility
export class SpringAnimation {
  private config: Required<SpringConfig>;

  constructor(config: SpringConfig = {}) {
    this.config = {
      stiffness: config.stiffness ?? 100,
      damping: config.damping ?? 10,
      mass: config.mass ?? 1,
      precision: config.precision ?? 0.01
    };
  }

  // Spring animation function
  animate(
    element: HTMLElement,
    properties: Record<string, { from: number; to: number; unit?: string }>,
    onUpdate: (values: Record<string, string>) => void,
    onComplete?: () => void,
    config?: Partial<SpringConfig>
  ): () => void {
    // Merge provided config with defaults
    const animConfig = {
      ...this.config,
      ...config
    };
    const startTime = Date.now();
    let animationId: number;
    let isComplete = false;

    // Initial values
    const currentValues = Object.keys(properties).reduce((acc, key) => {
      acc[key] = properties[key].from;
      return acc;
    }, {} as Record<string, number>);

    // Velocities for each property
    const velocities = Object.keys(properties).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<string, number>);

    const animate = () => {
      if (isComplete) return;

      const elapsed = Date.now() - startTime;
      let allComplete = true;

      // Update each property using spring physics
      Object.keys(properties).forEach(key => {
        const target = properties[key].to;
        const current = currentValues[key];
        const velocity = velocities[key];

        // Spring force: F = -k * (x - target)
        const force = -animConfig.stiffness * (current - target);

        // Damping force: F_damping = -c * v
        const dampingForce = -animConfig.damping * velocity;

        // Total force
        const totalForce = force + dampingForce;

        // Acceleration: a = F / m
        const acceleration = totalForce / animConfig.mass;

        // Update velocity and position
        velocities[key] += acceleration * 0.016; // Assume 60fps (16ms per frame)
        currentValues[key] += velocities[key] * 0.016;

        // Check if animation is complete for this property
        if (Math.abs(current - target) > animConfig.precision || Math.abs(velocity) > animConfig.precision) {
          allComplete = false;
        }
      });

      // Update the element
      const cssValues = Object.keys(currentValues).reduce((acc, key) => {
        const unit = properties[key].unit || 'px';
        acc[key] = `${currentValues[key]}${unit}`;
        return acc;
      }, {} as Record<string, string>);

      onUpdate(cssValues);

      if (allComplete) {
        isComplete = true;
        onComplete?.();
      } else {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    // Return cancel function
    return () => {
      isComplete = true;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }
}

// Animation manager for handling different animation types
export class AnimationManager {
  private springAnimation: SpringAnimation;

  constructor() {
    this.springAnimation = new SpringAnimation();
  }

  // Show toast with specified animation
  async showToast(element: HTMLElement, toast: ToastInstance, animation: AnimationConfig): Promise<void> {
    switch (animation.type) {
      case 'spring':
        await this.animateSpringShow(element, animation);
        break;
      case 'bounce':
        await this.animateBounceShow(element, animation);
        break;
      case 'slide':
        await this.animateSlideShow(element, animation);
        break;
      case 'zoom':
        await this.animateZoomShow(element, animation);
        break;
      case 'flip':
        await this.animateFlipShow(element, animation);
        break;
      case 'fade':
        await this.animateFadeShow(element, animation);
        break;
      case 'elastic':
        await this.animateElasticShow(element, animation);
        break;
      case 'rotate':
        await this.animateRotateShow(element, animation);
        break;
      case 'custom':
        if (animation.show) {
          await Promise.resolve(animation.show(element, toast));
        } else {
          // Fallback to CSS animation
          this.animateCssShow(element);
        }
        break;
      case 'css':
      default:
        this.animateCssShow(element);
        break;
    }
  }

  // Hide toast with specified animation
  async hideToast(element: HTMLElement, toast: ToastInstance, animation: AnimationConfig): Promise<void> {
    switch (animation.type) {
      case 'spring':
        await this.animateSpringHide(element, animation);
        break;
      case 'bounce':
        await this.animateBounceHide(element, animation);
        break;
      case 'slide':
        await this.animateSlideHide(element, animation);
        break;
      case 'zoom':
        await this.animateZoomHide(element, animation);
        break;
      case 'flip':
        await this.animateFlipHide(element, animation);
        break;
      case 'fade':
        await this.animateFadeHide(element, animation);
        break;
      case 'elastic':
        await this.animateElasticHide(element, animation);
        break;
      case 'rotate':
        await this.animateRotateHide(element, animation);
        break;
      case 'custom':
        if (animation.hide) {
          await Promise.resolve(animation.hide(element, toast));
        } else {
          // Fallback to CSS animation
          this.animateCssHide(element);
        }
        break;
      case 'css':
      default:
        this.animateCssHide(element);
        break;
    }
  }

  // Update toast with specified animation
  async updateToast(
    element: HTMLElement,
    toast: ToastInstance,
    updates: Partial<ToastOptions>,
    animation: AnimationConfig
  ): Promise<void> {
    if (animation.type === 'custom' && animation.update) {
      await Promise.resolve(animation.update(element, toast, updates));
    }
    // For spring and css animations, updates are handled by the renderer
  }

  // CSS-based show animation (existing behavior)
  private animateCssShow(element: HTMLElement): void {
    requestAnimationFrame(() => {
      element.classList.add('show');
    });
  }

  // CSS-based hide animation (existing behavior)
  private animateCssHide(element: HTMLElement): void {
    element.classList.remove('show');
    element.classList.add('hiding');
  }

  // Spring-based show animation
  private async animateSpringShow(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'spring' }>): Promise<void> {
    return new Promise((resolve) => {
      // Add spring animation class to disable CSS transitions
      element.classList.add('spring-animation');
      
      // Force disable transitions with maximum priority
      element.style.setProperty('transition', 'none', 'important');
      element.style.setProperty('-webkit-transition', 'none', 'important');

      // Determine initial position
      const isBottom = element.parentElement?.classList.contains('editora-toast-bottom-right') || 
                      element.parentElement?.classList.contains('editora-toast-bottom-left') ||
                      element.parentElement?.classList.contains('editora-toast-bottom-center');
      
      const initialTranslateY = isBottom ? 20 : -20;
      
      // Set initial state immediately
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('transform', `translateY(${initialTranslateY}px) scale(0.95)`, 'important');
      
      // Force reflow to ensure styles are applied
      void element.offsetHeight;
      
      // Small delay to ensure initial state is set, then start animation
      setTimeout(() => {
        // Apply spring transition with !important
        element.style.setProperty('transition', 'opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)', 'important');
        
        // Set final state
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('transform', 'translateY(0) scale(1)', 'important');
        
        // Wait for animation to complete
        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          resolve();
        }, 800);
      }, 16); // One frame delay
    });
  }

  // Spring-based hide animation
  private async animateSpringHide(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'spring' }>): Promise<void> {
    return new Promise((resolve) => {
      // Add spring animation class to disable CSS transitions
      element.classList.add('spring-animation');
      
      // Force disable transitions
      element.style.setProperty('transition', 'none', 'important');
      element.style.setProperty('-webkit-transition', 'none', 'important');

      // Start hide animation immediately
      setTimeout(() => {
        element.style.setProperty('transition', 'opacity 0.4s ease, transform 0.4s ease', 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('transform', 'translateY(-10px) scale(0.95)', 'important');
        
        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          resolve();
        }, 400);
      }, 16);
    });
  }

  // Bounce-based show animation
  private async animateBounceShow(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'bounce' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const isBottom = element.parentElement?.classList.contains('editora-toast-bottom-right') || 
                      element.parentElement?.classList.contains('editora-toast-bottom-left') ||
                      element.parentElement?.classList.contains('editora-toast-bottom-center');
      
      const direction = animation.direction || (isBottom ? 'up' : 'down');
      const intensity = animation.intensity || 'normal';
      const duration = animation.duration || 800;

      // Set bounce intensity
      const bounceScale = intensity === 'gentle' ? 0.05 : intensity === 'strong' ? 0.15 : 0.1;
      const initialOffset = direction === 'up' ? 30 : direction === 'down' ? -30 : 
                           direction === 'left' ? 30 : -30;

      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('transform', 
        direction === 'left' || direction === 'right' 
          ? `translateX(${initialOffset}px) scale(${1 - bounceScale})`
          : `translateY(${initialOffset}px) scale(${1 - bounceScale})`, 
        'important');

      void element.offsetHeight;

      setTimeout(() => {
        element.style.setProperty('transition', 
          `opacity ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55), transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`, 
          'important');
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('transform', 'translateY(0) scale(1)', 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }

  // Bounce-based hide animation
  private async animateBounceHide(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'bounce' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const intensity = animation.intensity || 'normal';
      const bounceScale = intensity === 'gentle' ? 0.05 : intensity === 'strong' ? 0.15 : 0.1;

      setTimeout(() => {
        element.style.setProperty('transition', 'opacity 0.4s ease, transform 0.4s ease', 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('transform', `scale(${1 - bounceScale})`, 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          resolve();
        }, 400);
      }, 16);
    });
  }

  // Slide-based show animation
  private async animateSlideShow(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'slide' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const isBottom = element.parentElement?.classList.contains('editora-toast-bottom-right') || 
                      element.parentElement?.classList.contains('editora-toast-bottom-left') ||
                      element.parentElement?.classList.contains('editora-toast-bottom-center');
      
      const direction = animation.direction || (isBottom ? 'up' : 'down');
      const distance = animation.distance || 100;
      const easing = animation.easing || 'ease-out';
      const duration = animation.duration || 400;

      const initialTransform = 
        direction === 'up' ? `translateY(${distance}px)` :
        direction === 'down' ? `translateY(-${distance}px)` :
        direction === 'left' ? `translateX(${distance}px)` :
        `translateX(-${distance}px)`;

      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('transform', initialTransform, 'important');

      void element.offsetHeight;

      setTimeout(() => {
        element.style.setProperty('transition', `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`, 'important');
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('transform', 'translateY(0) translateX(0)', 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }

  // Slide-based hide animation
  private async animateSlideHide(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'slide' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const direction = animation.direction || 'down';
      const distance = animation.distance || 100;
      const easing = animation.easing || 'ease-in';
      const duration = animation.duration || 300;

      const finalTransform = 
        direction === 'up' ? `translateY(-${distance}px)` :
        direction === 'down' ? `translateY(${distance}px)` :
        direction === 'left' ? `translateX(-${distance}px)` :
        `translateX(${distance}px)`;

      setTimeout(() => {
        element.style.setProperty('transition', `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`, 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('transform', finalTransform, 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }

  // Zoom-based show animation
  private async animateZoomShow(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'zoom' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const scale = animation.scale || 0.3;
      const origin = animation.origin || 'center';
      const easing = animation.easing || 'ease-out';
      const duration = animation.duration || 500;

      element.style.setProperty('transform-origin', origin, 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('transform', `scale(${scale})`, 'important');

      void element.offsetHeight;

      setTimeout(() => {
        element.style.setProperty('transition', `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`, 'important');
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('transform', 'scale(1)', 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          element.style.setProperty('transform-origin', '', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }

  // Zoom-based hide animation
  private async animateZoomHide(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'zoom' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const scale = animation.scale || 0.3;
      const origin = animation.origin || 'center';
      const easing = animation.easing || 'ease-in';
      const duration = animation.duration || 300;

      element.style.setProperty('transform-origin', origin, 'important');

      setTimeout(() => {
        element.style.setProperty('transition', `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`, 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('transform', `scale(${scale})`, 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          element.style.setProperty('transform-origin', '', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }

  // Flip-based show animation
  private async animateFlipShow(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'flip' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const axis = animation.axis || 'y';
      const perspective = animation.perspective || 1000;
      const direction = animation.direction || 'forward';
      const duration = animation.duration || 600;

      element.style.setProperty('transform-style', 'preserve-3d', 'important');
      element.parentElement!.style.setProperty('perspective', `${perspective}px`, 'important');

      const initialRotation = direction === 'forward' ? (axis === 'x' ? -90 : 90) : (axis === 'x' ? 90 : -90);
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('transform', `rotate${axis.toUpperCase()}(${initialRotation}deg)`, 'important');

      void element.offsetHeight;

      setTimeout(() => {
        element.style.setProperty('transition', `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`, 'important');
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('transform', 'rotateX(0deg) rotateY(0deg)', 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          element.style.setProperty('transform-style', '', 'important');
          element.parentElement!.style.setProperty('perspective', '', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }

  // Flip-based hide animation
  private async animateFlipHide(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'flip' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const axis = animation.axis || 'y';
      const perspective = animation.perspective || 1000;
      const direction = animation.direction || 'backward';
      const duration = animation.duration || 400;

      element.style.setProperty('transform-style', 'preserve-3d', 'important');
      element.parentElement!.style.setProperty('perspective', `${perspective}px`, 'important');

      const finalRotation = direction === 'backward' ? (axis === 'x' ? -90 : 90) : (axis === 'x' ? 90 : -90);

      setTimeout(() => {
        element.style.setProperty('transition', `opacity ${duration}ms ease, transform ${duration}ms ease-in`, 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('transform', `rotate${axis.toUpperCase()}(${finalRotation}deg)`, 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          element.style.setProperty('transform-style', '', 'important');
          element.parentElement!.style.setProperty('perspective', '', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }

  // Fade-based show animation
  private async animateFadeShow(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'fade' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const direction = animation.direction || 'none';
      const distance = animation.distance || 20;
      const duration = animation.duration || 300;

      let initialTransform = 'translateY(0) translateX(0)';
      if (direction !== 'none') {
        initialTransform = 
          direction === 'up' ? `translateY(${distance}px)` :
          direction === 'down' ? `translateY(-${distance}px)` :
          direction === 'left' ? `translateX(${distance}px)` :
          `translateX(-${distance}px)`;
      }

      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('transform', initialTransform, 'important');

      void element.offsetHeight;

      setTimeout(() => {
        element.style.setProperty('transition', `opacity ${duration}ms ease, transform ${duration}ms ease`, 'important');
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('transform', 'translateY(0) translateX(0)', 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }

  // Fade-based hide animation
  private async animateFadeHide(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'fade' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const direction = animation.direction || 'none';
      const distance = animation.distance || 20;
      const duration = animation.duration || 200;

      let finalTransform = 'translateY(0) translateX(0)';
      if (direction !== 'none') {
        finalTransform = 
          direction === 'up' ? `translateY(-${distance}px)` :
          direction === 'down' ? `translateY(${distance}px)` :
          direction === 'left' ? `translateX(-${distance}px)` :
          `translateX(${distance}px)`;
      }

      setTimeout(() => {
        element.style.setProperty('transition', `opacity ${duration}ms ease, transform ${duration}ms ease`, 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('transform', finalTransform, 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }

  // Elastic-based show animation
  private async animateElasticShow(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'elastic' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const isBottom = element.parentElement?.classList.contains('editora-toast-bottom-right') || 
                      element.parentElement?.classList.contains('editora-toast-bottom-left') ||
                      element.parentElement?.classList.contains('editora-toast-bottom-center');
      
      const direction = animation.direction || (isBottom ? 'up' : 'down');
      const intensity = animation.intensity || 'normal';
      const duration = animation.duration || 1000;

      const elasticScale = intensity === 'gentle' ? 0.1 : intensity === 'strong' ? 0.3 : 0.2;
      const initialOffset = direction === 'up' ? 40 : direction === 'down' ? -40 : 
                           direction === 'left' ? 40 : -40;

      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('transform', 
        direction === 'left' || direction === 'right' 
          ? `translateX(${initialOffset}px) scale(${1 + elasticScale})`
          : `translateY(${initialOffset}px) scale(${1 + elasticScale})`, 
        'important');

      void element.offsetHeight;

      setTimeout(() => {
        element.style.setProperty('transition', 
          `opacity ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55), transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`, 
          'important');
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('transform', 'translateY(0) scale(1)', 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }

  // Elastic-based hide animation
  private async animateElasticHide(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'elastic' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const intensity = animation.intensity || 'normal';
      const elasticScale = intensity === 'gentle' ? 0.1 : intensity === 'strong' ? 0.3 : 0.2;
      const duration = animation.duration || 600;

      setTimeout(() => {
        element.style.setProperty('transition', 'opacity 0.4s ease, transform 0.4s ease', 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('transform', `scale(${1 + elasticScale})`, 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          resolve();
        }, 400);
      }, 16);
    });
  }

  // Rotate-based show animation
  private async animateRotateShow(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'rotate' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const degrees = animation.degrees || 360;
      const direction = animation.direction || 'clockwise';
      const origin = animation.origin || 'center';
      const duration = animation.duration || 500;

      const rotation = direction === 'clockwise' ? degrees : -degrees;

      element.style.setProperty('transform-origin', origin, 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('transform', `rotate(${rotation}deg) scale(0.8)`, 'important');

      void element.offsetHeight;

      setTimeout(() => {
        element.style.setProperty('transition', `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`, 'important');
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('transform', 'rotate(0deg) scale(1)', 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          element.style.setProperty('transform-origin', '', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }

  // Rotate-based hide animation
  private async animateRotateHide(element: HTMLElement, animation: Extract<AnimationConfig, { type: 'rotate' }>): Promise<void> {
    return new Promise((resolve) => {
      element.classList.add('spring-animation');
      element.style.setProperty('transition', 'none', 'important');

      const degrees = animation.degrees || 180;
      const direction = animation.direction || 'counterclockwise';
      const origin = animation.origin || 'center';
      const duration = animation.duration || 300;

      const rotation = direction === 'clockwise' ? degrees : -degrees;

      element.style.setProperty('transform-origin', origin, 'important');

      setTimeout(() => {
        element.style.setProperty('transition', `opacity ${duration}ms ease, transform ${duration}ms ease-in`, 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('transform', `rotate(${rotation}deg) scale(0.8)`, 'important');

        setTimeout(() => {
          element.style.setProperty('transition', 'none', 'important');
          element.style.setProperty('transform-origin', '', 'important');
          resolve();
        }, duration);
      }, 16);
    });
  }
}

// Export singleton instance
export const animationManager = new AnimationManager();