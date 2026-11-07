/**
 * Styles for the moment between server-rendered HTML and the custom elements being defined.
 *
 * Before `customElements.define()` runs, a ui-tabs element is an unknown inline element: every panel
 * shows, a closed dialog's content sits in the page, a select lists its raw `<option>` text and
 * inputs take no space, then everything jumps when the script loads. These rules (all scoped to
 * `:not(:defined)`, so they stop applying the moment an element upgrades) give each element the
 * display it will have, hide what it will hide, and reserve the height of form controls.
 *
 * Shipped as `@editora/ui-core/preload.css` and as this string (`PRELOAD_CSS`) for frameworks that
 * inline styles; `@editora/ui-react` renders it with `<EditoraPreloadStyle />`.
 *
 * The display block is generated from each component's `:host` rule; preload-styles.test.ts fails
 * when a component's display changes or a new element is missing here.
 */
export const PRELOAD_CSS = `@layer editora-preload {
  ui-alert:not(:defined),
  ui-alert-dialog:not(:defined),
  ui-app-header:not(:defined),
  ui-aspect-ratio:not(:defined),
  ui-box:not(:defined),
  ui-breadcrumb:not(:defined),
  ui-calendar:not(:defined),
  ui-card:not(:defined),
  ui-chart:not(:defined),
  ui-collapsible:not(:defined),
  ui-container:not(:defined),
  ui-context-menu:not(:defined),
  ui-control-group:not(:defined),
  ui-data-table:not(:defined),
  ui-date-field:not(:defined),
  ui-description:not(:defined),
  ui-dialog:not(:defined),
  ui-drawer:not(:defined),
  ui-empty-state:not(:defined),
  ui-field:not(:defined),
  ui-field-error:not(:defined),
  ui-fieldset:not(:defined),
  ui-file-upload:not(:defined),
  ui-form:not(:defined),
  ui-gantt:not(:defined),
  ui-inline-edit:not(:defined),
  ui-input:not(:defined),
  ui-layout:not(:defined),
  ui-masonry-grid:not(:defined),
  ui-meter:not(:defined),
  ui-multi-select:not(:defined),
  ui-navigation-menu:not(:defined),
  ui-number-field:not(:defined),
  ui-otp-input:not(:defined),
  ui-panel:not(:defined),
  ui-panel-group:not(:defined),
  ui-password-field:not(:defined),
  ui-pin-input:not(:defined),
  ui-plugin-panel:not(:defined),
  ui-progress:not(:defined),
  ui-quick-actions:not(:defined),
  ui-radio-group:not(:defined),
  ui-scroll-area:not(:defined),
  ui-section:not(:defined),
  ui-separator:not(:defined),
  ui-sidebar:not(:defined),
  ui-skeleton:not(:defined),
  ui-sortable:not(:defined),
  ui-splitter:not(:defined),
  ui-stepper:not(:defined),
  ui-table:not(:defined),
  ui-tabs:not(:defined),
  ui-tags-input:not(:defined),
  ui-time-field:not(:defined),
  ui-timeline:not(:defined),
  ui-toast:not(:defined),
  ui-toolbar:not(:defined),
  ui-transfer-list:not(:defined),
  ui-tree:not(:defined),
  ui-tree-item:not(:defined) {
    display: block;
  }

  ui-flex:not(:defined) {
    display: flex;
  }

  ui-command:not(:defined),
  ui-grid:not(:defined),
  ui-placement-grid:not(:defined) {
    display: grid;
  }

  ui-avatar:not(:defined),
  ui-color-picker:not(:defined),
  ui-combobox:not(:defined),
  ui-menu:not(:defined),
  ui-menubar:not(:defined) {
    display: inline-block;
  }

  ui-anchor:not(:defined),
  ui-badge:not(:defined),
  ui-block-controls:not(:defined),
  ui-button:not(:defined),
  ui-checkbox:not(:defined),
  ui-hover-card:not(:defined),
  ui-label:not(:defined),
  ui-odometer:not(:defined),
  ui-pagination:not(:defined),
  ui-radio:not(:defined),
  ui-rating:not(:defined),
  ui-slot:not(:defined),
  ui-switch:not(:defined),
  ui-toggle:not(:defined),
  ui-toggle-group:not(:defined) {
    display: inline-flex;
  }

  ui-date-picker:not(:defined),
  ui-date-range-picker:not(:defined),
  ui-date-range-time-picker:not(:defined),
  ui-date-time-picker:not(:defined),
  ui-dropdown:not(:defined),
  ui-icon:not(:defined),
  ui-select:not(:defined),
  ui-slider:not(:defined),
  ui-textarea:not(:defined),
  ui-time-picker:not(:defined) {
    display: inline-grid;
  }

  ui-direction-provider:not(:defined),
  ui-dismissable-layer:not(:defined),
  ui-focus-scope:not(:defined),
  ui-portal:not(:defined),
  ui-positioner:not(:defined),
  ui-presence:not(:defined),
  ui-visually-hidden:not(:defined) {
    display: contents;
  }

  ui-command-palette:not(:defined),
  ui-floating-toolbar:not(:defined),
  ui-selection-popup:not(:defined) {
    display: none;
  }

  /* Spacing the elements draw around slotted content (default size; approximate for others). */
  ui-tabs:not(:defined) > [slot="panel"] {
    display: block;
    margin-block-start: 12px;
    padding-block: 8px;
  }

  ui-card:not(:defined) {
    display: grid;
    gap: var(--ui-card-gap, 8px);
    padding: var(--ui-card-padding, 16px) var(--ui-card-padding, 16px) 0;
    border: 1px solid transparent;
  }

  /* Content the element renders itself, or only shows on demand. */
  ui-dialog:not(:defined),
  ui-alert-dialog:not(:defined),
  ui-drawer:not(:defined),
  ui-toast:not(:defined) {
    display: none;
  }

  ui-dropdown:not(:defined) > [slot="content"],
  ui-menu:not(:defined) > [slot="content"],
  ui-menu:not(:defined) > [slot="item"],
  ui-menubar:not(:defined) > [slot="content"],
  ui-context-menu:not(:defined) > [slot="content"],
  ui-popover:not(:defined) > [slot="content"],
  ui-hover-card:not(:defined) > [slot="card"],
  ui-navigation-menu:not(:defined) > [slot="panel"],
  ui-split-button:not(:defined) > [slot="menuitem"],
  ui-select:not(:defined) > :is(option, optgroup),
  ui-multi-select:not(:defined) > :is(option, optgroup),
  ui-combobox:not(:defined) > :is(option, optgroup),
  ui-tabs:not(:defined) > [slot="panel"] ~ [slot="panel"] {
    display: none;
  }

  /* Form controls draw their field in the shadow root, so they take no space until defined: reserve
     the height they will have (measured: 32px control, about 26px more with a label and another
     24px with a description). */
  :is(ui-input, ui-password-field, ui-number-field, ui-select, ui-multi-select, ui-combobox, ui-tags-input, ui-date-field, ui-time-field, ui-date-picker, ui-time-picker, ui-date-time-picker, ui-date-range-picker, ui-date-range-time-picker):not(:defined),
  ui-button:not(:defined),
  ui-pagination:not(:defined) {
    min-block-size: var(--ui-control-height-2, 32px);
  }

  :is(ui-input, ui-password-field, ui-number-field, ui-select, ui-multi-select, ui-combobox, ui-tags-input, ui-date-field, ui-time-field, ui-date-picker, ui-time-picker, ui-date-time-picker, ui-date-range-picker, ui-date-range-time-picker)[label]:not(:defined) {
    min-block-size: calc(var(--ui-control-height-2, 32px) + 26px);
  }

  :is(ui-input, ui-password-field, ui-number-field, ui-select, ui-multi-select, ui-combobox, ui-tags-input, ui-date-field, ui-time-field, ui-date-picker, ui-time-picker, ui-date-time-picker, ui-date-range-picker, ui-date-range-time-picker)[label][description]:not(:defined) {
    min-block-size: calc(var(--ui-control-height-2, 32px) + 50px);
  }

  ui-textarea:not(:defined) {
    min-block-size: 122px;
  }

  ui-textarea[label]:not(:defined) {
    min-block-size: 148px;
  }

  /* The selected panel (a server-rendered selected attribute), not the first. Browsers without
     :nth-child(… of S) drop these rules and keep showing the first panel. */
  ui-tabs[selected="1"]:not(:defined) > [slot="panel"]:not(:nth-child(2 of [slot="panel"])) { display: none; }
  ui-tabs[selected="1"]:not(:defined) > :nth-child(2 of [slot="panel"]) { display: block; }
  ui-tabs[selected="2"]:not(:defined) > [slot="panel"]:not(:nth-child(3 of [slot="panel"])) { display: none; }
  ui-tabs[selected="2"]:not(:defined) > :nth-child(3 of [slot="panel"]) { display: block; }
  ui-tabs[selected="3"]:not(:defined) > [slot="panel"]:not(:nth-child(4 of [slot="panel"])) { display: none; }
  ui-tabs[selected="3"]:not(:defined) > :nth-child(4 of [slot="panel"]) { display: block; }
  ui-tabs[selected="4"]:not(:defined) > [slot="panel"]:not(:nth-child(5 of [slot="panel"])) { display: none; }
  ui-tabs[selected="4"]:not(:defined) > :nth-child(5 of [slot="panel"]) { display: block; }
  ui-tabs[selected="5"]:not(:defined) > [slot="panel"]:not(:nth-child(6 of [slot="panel"])) { display: none; }
  ui-tabs[selected="5"]:not(:defined) > :nth-child(6 of [slot="panel"]) { display: block; }
  ui-tabs[selected="6"]:not(:defined) > [slot="panel"]:not(:nth-child(7 of [slot="panel"])) { display: none; }
  ui-tabs[selected="6"]:not(:defined) > :nth-child(7 of [slot="panel"]) { display: block; }
  ui-tabs[selected="7"]:not(:defined) > [slot="panel"]:not(:nth-child(8 of [slot="panel"])) { display: none; }
  ui-tabs[selected="7"]:not(:defined) > :nth-child(8 of [slot="panel"]) { display: block; }
  ui-tabs[selected="8"]:not(:defined) > [slot="panel"]:not(:nth-child(9 of [slot="panel"])) { display: none; }
  ui-tabs[selected="8"]:not(:defined) > :nth-child(9 of [slot="panel"]) { display: block; }
  ui-tabs[selected="9"]:not(:defined) > [slot="panel"]:not(:nth-child(10 of [slot="panel"])) { display: none; }
  ui-tabs[selected="9"]:not(:defined) > :nth-child(10 of [slot="panel"]) { display: block; }

  /* Tab labels in a row of about the strip's height, instead of stacked blocks. */
  ui-tabs:not(:defined) > [slot="tab"] {
    display: inline-block;
    padding: 8px 12px;
    line-height: 20px;
  }
}
`;
