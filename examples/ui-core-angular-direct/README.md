# ui-core Direct in Angular

This example shows the recommended pattern for using `@editora/ui-core` directly in Angular without `@editora/ui-angular`.

It is a real application-shaped example, but it is not runnable in this workspace because the repo currently does not have the Angular runtime/compiler packages required to bootstrap an Angular app. The files are intended as copy-ready integration guidance for a standard Angular project.

## What It Demonstrates

- `CUSTOM_ELEMENTS_SCHEMA` for `ui-core` custom elements
- direct event handling from custom elements
- setting complex `ui-sortable` properties (`lists` and `items`) through `@ViewChild`
- syncing Angular component state back from `CustomEvent.detail`

## Required Angular Packages

In a normal Angular app, make sure these are installed:

```bash
npm install @editora/ui-core @angular/common @angular/core @angular/platform-browser @angular/platform-browser-dynamic rxjs zone.js
```

## Files

- `src/main.ts`
- `src/app/app.module.ts`
- `src/app/app.component.ts`
- `src/styles.css`

## Integration Notes

- Import only the `ui-core` components you need, for example `@editora/ui-core/button` and `@editora/ui-core/sortable`.
- Use Angular template bindings for primitive attributes and host events.
- Use `@ViewChild` plus `nativeElement` when a component expects object or array properties.
- Keep Angular state authoritative by writing back changes received from `CustomEvent.detail`.
