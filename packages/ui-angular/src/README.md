# @editora/ui-angular

[![Version](https://img.shields.io/npm/v/@editora/ui-angular)](https://www.npmjs.com/package/@editora/ui-angular)
[![License](https://img.shields.io/npm/l/@editora/ui-angular)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/ui-angular)](https://bundlephobia.com/package/@editora/ui-angular)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


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
