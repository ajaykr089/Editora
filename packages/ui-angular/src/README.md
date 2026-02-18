# @editora/ui-angular

This package contains guidance and minimal shims to integrate @editora Web Components with Angular.

Angular integration patterns:

- Use `CUSTOM_ELEMENTS_SCHEMA` in your module to allow custom elements.
- Optionally create Angular wrapper components that forward inputs/outputs to the underlying web components.

Example wrapper (manual):

```ts
// MyButton.component.ts
import { Component, ElementRef, EventEmitter, Input, Output, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'editora-button',
  template: `<ui-button><ng-content></ng-content></ui-button>`
})
export class EditoraButton implements AfterViewInit, OnDestroy {
  @Input() disabled?: boolean;
  @Output() click = new EventEmitter<Event>();
  constructor(private el: ElementRef) {}
  private handler = (e: Event) => this.click.emit(e);
  ngAfterViewInit() { (this.el.nativeElement.querySelector('ui-button') as HTMLElement).addEventListener('click', this.handler); }
  ngOnDestroy() { (this.el.nativeElement.querySelector('ui-button') as HTMLElement).removeEventListener('click', this.handler); }
}
```

This README intentionally provides a lightweight pattern rather than a full Angular library to keep the adapter small.
