import { ElementBase } from '../ElementBase';

export interface RatingChangeEvent {
  value: number;
  max: number;
  disabled: boolean;
  readonly: boolean;
}

export interface UIRating extends HTMLElement {
  value: number;
  max: number;
  disabled: boolean;
  readonly: boolean;

  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: UIRating, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-rating': UIRating;
  }
}