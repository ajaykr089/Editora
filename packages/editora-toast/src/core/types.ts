// Core types and interfaces for the advanced toast notification system

export type ToastLevel = 'info' | 'success' | 'error' | 'warning' | 'loading' | 'progress' | 'promise' | 'custom';

export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';

export type ToastTheme = 'light' | 'dark' | 'system' | 'custom' | 'colored' | 'minimal' | 'glass' | 'neon' | 'retro' | 'ocean' | 'forest' | 'sunset' | 'midnight';

export type QueueStrategy = 'fifo' | 'lifo';

// Spring physics configuration for advanced animations
export interface SpringConfig {
  stiffness?: number; // Spring stiffness (default: 100)
  damping?: number;   // Spring damping (default: 10)
  mass?: number;      // Spring mass (default: 1)
  precision?: number; // Animation precision (default: 0.01)
}

// Animation types
export type AnimationType = 'css' | 'spring' | 'bounce' | 'slide' | 'zoom' | 'flip' | 'fade' | 'elastic' | 'rotate' | 'custom';

export interface SpringAnimation {
  type: 'spring';
  config?: SpringConfig;
  duration?: number; // Fallback duration in ms
}

export interface BounceAnimation {
  type: 'bounce';
  direction?: 'up' | 'down' | 'left' | 'right'; // Direction for bounce (default: 'up' for bottom, 'down' for top)
  intensity?: 'gentle' | 'normal' | 'strong'; // Bounce intensity (default: 'normal')
  duration?: number; // Animation duration in ms (default: 800)
}

export interface SlideAnimation {
  type: 'slide';
  direction?: 'up' | 'down' | 'left' | 'right'; // Slide direction (default: 'up' for bottom, 'down' for top)
  distance?: number; // Slide distance in px (default: 100)
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'; // Easing function (default: 'ease-out')
  duration?: number; // Animation duration in ms (default: 400)
}

export interface ZoomAnimation {
  type: 'zoom';
  scale?: number; // Initial scale (default: 0.3)
  origin?: 'center' | 'top' | 'bottom' | 'left' | 'right'; // Transform origin (default: 'center')
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce'; // Easing function (default: 'ease-out')
  duration?: number; // Animation duration in ms (default: 500)
}

export interface FlipAnimation {
  type: 'flip';
  axis?: 'x' | 'y'; // Flip axis (default: 'y')
  perspective?: number; // Perspective distance in px (default: 1000)
  direction?: 'forward' | 'backward'; // Flip direction (default: 'forward')
  duration?: number; // Animation duration in ms (default: 600)
}

export interface FadeAnimation {
  type: 'fade';
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'; // Optional slide direction during fade (default: 'none')
  distance?: number; // Slide distance in px when direction is not 'none' (default: 20)
  duration?: number; // Animation duration in ms (default: 300)
}

export interface ElasticAnimation {
  type: 'elastic';
  direction?: 'up' | 'down' | 'left' | 'right'; // Elastic direction (default: 'up' for bottom, 'down' for top)
  intensity?: 'gentle' | 'normal' | 'strong'; // Elastic intensity (default: 'normal')
  duration?: number; // Animation duration in ms (default: 1000)
}

export interface RotateAnimation {
  type: 'rotate';
  degrees?: number; // Rotation degrees (default: 360)
  direction?: 'clockwise' | 'counterclockwise'; // Rotation direction (default: 'clockwise')
  origin?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; // Transform origin (default: 'center')
  duration?: number; // Animation duration in ms (default: 500)
}

export interface CustomAnimation {
  type: 'custom';
  show?: (element: HTMLElement, toast: ToastInstance) => Promise<void> | void;
  hide?: (element: HTMLElement, toast: ToastInstance) => Promise<void> | void;
  update?: (element: HTMLElement, toast: ToastInstance, updates: Partial<ToastOptions>) => Promise<void> | void;
}

export type AnimationConfig = 
  | SpringAnimation 
  | BounceAnimation 
  | SlideAnimation 
  | ZoomAnimation 
  | FlipAnimation 
  | FadeAnimation 
  | ElasticAnimation 
  | RotateAnimation 
  | CustomAnimation 
  | { type: 'css' };

export interface ToastAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface ToastProgress {
  value: number; // 0-100
  showPercentage?: boolean;
}

export interface ToastContent {
  message: string;
  icon?: string;
  actions?: ToastAction[];
  progress?: ToastProgress;
  html?: boolean; // if true, message is treated as HTML
  render?: () => HTMLElement; // custom render function
}

export interface ToastOptions extends Partial<ToastContent> {
  id?: string;
  level?: ToastLevel;
  duration?: number; // ms, 0 for persistent
  position?: ToastPosition;
  priority?: number; // higher = more important
  group?: string; // for grouping related toasts
  persistent?: boolean; // if true, no auto-dismiss
  closable?: boolean; // show close button
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  swipeDismiss?: boolean;
  swipeDirection?: 'any' | 'horizontal' | 'vertical' | 'left' | 'right' | 'up' | 'down'; // Swipe direction control
  dragDismiss?: boolean;
  rtl?: boolean; // RTL support
  theme?: ToastTheme;
  customClass?: string;
  animation?: AnimationConfig; // Animation configuration
  onShow?: () => void;
  onHide?: () => void;
  onUpdate?: (options: Partial<ToastOptions>) => void;
}

export interface ToastInstance {
  id: string;
  options: ToastOptions;
  element?: HTMLElement;
  timeoutId?: number;
  createdAt: number;
  dismiss: () => void;
  update: (options: Partial<ToastOptions>) => void;
}

export interface ToastPromiseOptions<T = any> {
  loading: string | ToastOptions;
  success: string | ((data: T) => string) | ToastOptions;
  error: string | ((error: any) => string) | ToastOptions;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

export interface ToastGroup {
  id: string;
  toasts: ToastInstance[];
  collapsed?: boolean;
  progress?: number;
}

export interface ToastConfig {
  position: ToastPosition;
  duration: number;
  maxVisible: number;
  queueStrategy: QueueStrategy;
  theme: ToastTheme;
  pauseOnHover: boolean;
  pauseOnFocus: boolean;
  pauseOnWindowBlur: boolean; // Pause toasts when window loses focus
  swipeDismiss: boolean;
  swipeDirection?: 'any' | 'horizontal' | 'vertical' | 'left' | 'right' | 'up' | 'down'; // Default swipe direction
  dragDismiss: boolean;
  rtl: boolean; // RTL support
  enableAccessibility: boolean;
  container?: HTMLElement;
  zIndex?: number;
  animation?: AnimationConfig; // Default animation configuration
}

export interface ToastPlugin {
  name: string;
  install: (manager: ToastManager) => void;
  uninstall?: (manager: ToastManager) => void;
}

export interface ToastManager {
  show(options: ToastOptions): ToastInstance;
  update(id: string, options: Partial<ToastOptions>): boolean;
  dismiss(id: string): boolean;
  clear(): void;
  configure(config: Partial<ToastConfig>): void;
  promise<T>(promise: Promise<T>, options: ToastPromiseOptions<T>): Promise<T>;
  group(id: string, options: ToastOptions): ToastInstance;
  use(plugin: ToastPlugin): void;
  getConfig(): ToastConfig;
  getToasts(): ToastInstance[];
  getGroups(): ToastGroup[];
}