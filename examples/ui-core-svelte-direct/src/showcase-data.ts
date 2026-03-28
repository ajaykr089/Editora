export type DemoCard = {
  title: string;
  components: string[];
  description: string;
  markup: string;
};

export type RouteDefinition = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  cards: DemoCard[];
};

export const routeDefinitions: RouteDefinition[] = [
  {
    id: 'overview',
    label: 'Overview',
    eyebrow: 'Showcase shell',
    title: 'ui-core Direct in Svelte',
    description:
      'A routed showcase app proving that ui-core can be used directly from Svelte without adapter wrappers.',
    cards: [
      {
        title: 'Status Pulse',
        components: ['ui-alert', 'ui-badge', 'ui-avatar', 'ui-icon'],
        description: 'A compact summary strip using display primitives directly in markup.',
        markup: `
          <div class="inline-stack">
            <ui-badge tone="success">72 live demos</ui-badge>
            <ui-badge tone="info">Hash-routed</ui-badge>
          </div>
          <ui-alert
            tone="info"
            title="Direct custom elements"
            description="Every route uses ui-core web components directly from Svelte."
          ></ui-alert>
          <div class="inline-stack">
            <ui-avatar initials="EC"></ui-avatar>
            <ui-icon name="sparkles"></ui-icon>
            <ui-icon name="calendar"></ui-icon>
          </div>
        `,
      },
      {
        title: 'Launch Controls',
        components: ['ui-button', 'ui-split-button', 'ui-progress', 'ui-meter'],
        description: 'Action primitives and small feedback components for release tooling.',
        markup: `
          <div class="inline-stack">
            <ui-button variant="primary">Ship update</ui-button>
            <ui-button variant="secondary">Schedule dry run</ui-button>
            <ui-split-button
              label="Publish"
              menu-label="Open publish options"
              menu-heading="Publishing options"
              menu-description="Choose how the release update should go out."
            >
              <button slot="menuitem" type="button" data-value="quiet">
                <span>
                  <span data-menu-label>Publish quietly</span>
                  <span data-menu-description>Skip the broader stakeholder digest for now.</span>
                </span>
                <span data-menu-shortcut>Q</span>
              </button>
              <button slot="menuitem" type="button" data-value="notes">
                <span>
                  <span data-menu-label>Publish with notes</span>
                  <span data-menu-description>Include the launch summary and handoff context.</span>
                </span>
                <span data-menu-shortcut>N</span>
              </button>
            </ui-split-button>
          </div>
          <ui-progress value="72" max="100"></ui-progress>
          <ui-meter
            value="68"
            min="0"
            max="100"
            low="30"
            high="80"
            optimum="90"
            label="Release confidence"
            show-label
            format="percent"
          ></ui-meter>
        `,
      },
      {
        title: 'Layout Snapshot',
        components: ['ui-container', 'ui-section', 'ui-box', 'ui-flex', 'ui-grid'],
        description: 'A small shell preview for layout primitives that can be composed directly.',
        markup: `
          <ui-container>
            <ui-section>
              <ui-box class="mini-surface">Container / section shell</ui-box>
              <ui-flex class="mini-flex">
                <ui-box class="mini-tile">Left rail</ui-box>
                <ui-box class="mini-tile">Content</ui-box>
              </ui-flex>
              <ui-grid class="mini-grid">
                <ui-box class="mini-tile">A</ui-box>
                <ui-box class="mini-tile">B</ui-box>
                <ui-box class="mini-tile">C</ui-box>
              </ui-grid>
            </ui-section>
          </ui-container>
        `,
      },
    ],
  },
  {
    id: 'forms',
    label: 'Forms',
    eyebrow: 'Primitives and forms',
    title: 'Input and Form Surfaces',
    description:
      'Core form controls, validation surfaces, upload flows, and selection controls rendered directly as web components.',
    cards: [
      {
        title: 'Core Form Shell',
        components: ['ui-form', 'ui-field', 'ui-input', 'ui-password-field', 'ui-textarea'],
        description: 'The standard input stack most apps need first.',
        markup: `
          <ui-form>
            <ui-field label="Workspace name" hint="Visible to your whole team.">
              <ui-input value="North Star Launch"></ui-input>
            </ui-field>
            <ui-field label="API token">
              <ui-password-field value="editora-demo-token"></ui-password-field>
            </ui-field>
            <ui-field label="Launch notes">
              <ui-textarea>Prepare rollout checklist, approval log, and release summary.</ui-textarea>
            </ui-field>
          </ui-form>
        `,
      },
      {
        title: 'Field Helpers',
        components: ['ui-label', 'ui-description', 'ui-field-error', 'ui-control-group', 'ui-fieldset'],
        description: 'Textual guidance and grouping components for polished forms.',
        markup: `
          <ui-fieldset legend="Approval settings">
            <ui-label for="approval-target">Approval flow</ui-label>
            <ui-description>Choose the channel that receives final release confirmations.</ui-description>
            <ui-control-group>
              <ui-input id="approval-target" value="ops-release@company.com"></ui-input>
              <ui-button variant="secondary">Verify</ui-button>
            </ui-control-group>
            <ui-field-error>Fallback contact missing for one workflow.</ui-field-error>
          </ui-fieldset>
        `,
      },
      {
        title: 'Choice Inputs',
        components: ['ui-checkbox', 'ui-radio-group', 'ui-switch', 'ui-slider'],
        description: 'Classic boolean and range controls for settings pages.',
        markup: `
          <div class="stack-gap">
            <ui-checkbox checked>Enable stakeholder digest</ui-checkbox>
            <ui-radio-group value="staging">
              <label><input type="radio" name="env" value="staging" checked /> Staging</label>
              <label><input type="radio" name="env" value="production" /> Production</label>
            </ui-radio-group>
            <ui-switch checked>Gate release behind QA sign-off</ui-switch>
            <ui-slider value="68" min="0" max="100"></ui-slider>
          </div>
        `,
      },
      {
        title: 'Select and Search',
        components: ['ui-select', 'ui-combobox', 'ui-multi-select', 'ui-toggle', 'ui-toggle-group'],
        description: 'Selection widgets for single, multi, and quick mode switching.',
        markup: `
          <div class="stack-gap">
            <ui-select value="launch">
              <option value="launch">Launch</option>
              <option value="maintenance">Maintenance</option>
              <option value="incident">Incident</option>
            </ui-select>
            <ui-combobox value="Brand campaign"></ui-combobox>
            <ui-multi-select value='["design","ops"]'></ui-multi-select>
            <div class="inline-stack">
              <ui-toggle pressed>Board mode</ui-toggle>
              <ui-toggle-group value="team">
                <ui-toggle value="team">Team</ui-toggle>
                <ui-toggle value="exec">Exec</ui-toggle>
              </ui-toggle-group>
            </div>
          </div>
        `,
      },
      {
        title: 'Structured Entry',
        components: ['ui-number-field', 'ui-tags-input', 'ui-pin-input', 'ui-otp-input', 'ui-inline-edit', 'ui-rating'],
        description: 'Inputs for denser operational workflows.',
        markup: `
          <div class="stack-gap">
            <ui-number-field value="48" min="0" max="100"></ui-number-field>
            <ui-tags-input value='["launch","q3","priority"]'></ui-tags-input>
            <ui-pin-input value="1384"></ui-pin-input>
            <ui-otp-input value="472901"></ui-otp-input>
            <ui-inline-edit value="Release note headline"></ui-inline-edit>
            <ui-rating value="4" max="5"></ui-rating>
          </div>
        `,
      },
      {
        title: 'Uploads and Color',
        components: ['ui-file-upload', 'ui-dropzone', 'ui-color-picker'],
        description: 'Asset collection and theme selection surfaces.',
        markup: `
          <div class="stack-gap">
            <ui-file-upload label="Upload launch deck"></ui-file-upload>
            <ui-dropzone>Drop final campaign assets here</ui-dropzone>
            <ui-color-picker value="#c2410c"></ui-color-picker>
          </div>
        `,
      },
    ],
  },
  {
    id: 'pickers',
    label: 'Pickers',
    eyebrow: 'Date and time',
    title: 'Scheduling Components',
    description:
      'The date, time, and calendar family shown together for release planning and operational scheduling use cases.',
    cards: [
      {
        title: 'Calendar Inputs',
        components: ['ui-date-picker', 'ui-date-range-picker', 'ui-time-picker'],
        description: 'Simple scheduling fields for public launch windows.',
        markup: `
          <div class="stack-gap">
            <ui-date-picker value="2026-08-18" clearable></ui-date-picker>
            <ui-date-range-picker value='{"start":"2026-08-18","end":"2026-08-21"}'></ui-date-range-picker>
            <ui-time-picker value="14:30"></ui-time-picker>
          </div>
        `,
      },
      {
        title: 'Field Variants',
        components: ['ui-date-field', 'ui-time-field', 'ui-date-time-picker'],
        description: 'Dense field-oriented scheduling inputs.',
        markup: `
          <div class="stack-gap">
            <ui-date-field value="2026-08-18"></ui-date-field>
            <ui-time-field value="09:45"></ui-time-field>
            <ui-date-time-picker value="2026-08-18T14:30"></ui-date-time-picker>
          </div>
        `,
      },
      {
        title: 'Range Planning',
        components: ['ui-date-range-time-picker', 'ui-calendar'],
        description: 'A broader planning view for multi-day releases and freeze windows.',
        markup: `
          <div class="stack-gap">
            <ui-date-range-time-picker value='{"start":"2026-08-18T09:00","end":"2026-08-21T18:00"}'></ui-date-range-time-picker>
            <ui-calendar value="2026-08-18"></ui-calendar>
          </div>
        `,
      },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    eyebrow: 'Navigation and layout',
    title: 'Shells, Menus, and Layout',
    description:
      'App-shell components and structural primitives for dashboards, settings surfaces, and editor-adjacent interfaces.',
    cards: [
      {
        title: 'Shell Primitives',
        components: ['ui-layout', 'ui-sidebar', 'ui-app-header', 'ui-breadcrumb'],
        description: 'A minimal dashboard shell using the layout-oriented components.',
        markup: `
          <ui-layout mode="dashboard" sidebar-width="248px">
            <div slot="header">
              <ui-app-header bordered variant="soft">
                <div slot="start" data-ui-app-header-start>
                  <button class="demo-button" type="button">Menu</button>
                </div>
                <div slot="title" data-ui-app-header-title>Release Control Center</div>
                <div slot="subtitle" data-ui-app-header-subtitle>Launch operations · Monday review</div>
                <div slot="end" data-ui-app-header-end>
                  <ui-badge tone="success">Ready</ui-badge>
                  <button class="demo-button" type="button">Share</button>
                </div>
              </ui-app-header>
            </div>
            <div slot="sidebar">
              <ui-sidebar
                value="overview"
                items='[
                  {"value":"overview","label":"Overview","section":"Planning","active":true},
                  {"value":"calendar","label":"Calendar","section":"Planning"},
                  {"value":"assets","label":"Assets","section":"Delivery","badge":"12"},
                  {"value":"risks","label":"Risks","section":"Delivery","tone":"warning"}
                ]'
              ></ui-sidebar>
            </div>
            <div slot="content" class="stack-gap">
              <ui-breadcrumb current-index="2">
                <span slot="item">Workspace</span>
                <span slot="item">Launch</span>
                <span slot="item">Readiness</span>
              </ui-breadcrumb>
              <div class="mini-surface">The content slot stays fully usable alongside header and sidebar slots.</div>
            </div>
            <div slot="aside" class="mini-surface">Aside: owner coverage, risk radar, and timeline notes.</div>
          </ui-layout>
        `,
      },
      {
        title: 'Menus and Tabs',
        components: ['ui-navigation-menu', 'ui-menubar', 'ui-tabs'],
        description: 'Top-level navigation surfaces for workspace movement.',
        markup: `
          <div class="stack-gap">
            <ui-navigation-menu variant="soft">
              <button slot="item" type="button" data-nav-key="overview">Overview</button>
              <button slot="item" type="button" data-nav-key="resources">Resources</button>
              <a slot="item" href="#/data" data-nav-key="data-link">Data route</a>

              <section slot="panel" data-nav-panel-for="overview" class="mini-surface">
                Board health, owner status, and checkpoint summaries live here.
              </section>
              <section slot="panel" data-nav-panel-for="resources" class="mini-grid">
                <div class="mini-tile">Release brief</div>
                <div class="mini-tile">QA notes</div>
                <div class="mini-tile">Enablement deck</div>
              </section>
            </ui-navigation-menu>

            <div class="inline-stack">
              <button class="demo-button" type="button" data-demo-open="showcase-menubar" data-demo-selected="0">Open File menu</button>
              <button class="demo-button" type="button" data-demo-open="showcase-menubar" data-demo-selected="1">Open Edit menu</button>
              <button class="demo-button" type="button" data-demo-open="showcase-menubar" data-demo-selected="2">Open View menu</button>
              <button class="demo-button" type="button" data-demo-close="showcase-menubar">Close menu</button>
            </div>

            <ui-menubar id="showcase-menubar" variant="soft" placement="bottom" close-on-select>
              <button slot="item" type="button">File</button>
              <button slot="item" type="button">Edit</button>
              <button slot="item" type="button">View</button>

              <div slot="content">
                <div class="item" role="menuitem" tabindex="0">New brief</div>
                <div class="item" role="menuitem" tabindex="-1">Open runbook</div>
                <div class="item" role="menuitem" tabindex="-1">Export summary</div>
              </div>
              <div slot="content">
                <div class="item" role="menuitem" tabindex="0">Undo update</div>
                <div class="item" role="menuitem" tabindex="-1">Redo update</div>
                <div class="item" role="menuitem" tabindex="-1">Find owner</div>
              </div>
              <div slot="content">
                <div class="item" role="menuitem" tabindex="0">Zoom board</div>
                <div class="item" role="menuitem" tabindex="-1">Inspect layout</div>
                <div class="item" role="menuitem" tabindex="-1">Toggle guides</div>
              </div>
            </ui-menubar>

            <ui-tabs value="board" variant="indicator">
              <button slot="tab" data-value="board">Board</button>
              <button slot="tab" data-value="calendar">Calendar</button>
              <button slot="tab" data-value="owners">Owners</button>

              <div slot="panel">
                <div class="mini-surface">Board view keeps active tasks and blockers in one surface.</div>
              </div>
              <div slot="panel">
                <div class="mini-surface">Calendar view tracks launch milestones across the week.</div>
              </div>
              <div slot="panel">
                <div class="mini-surface">Owners view keeps accountability visible for each stream.</div>
              </div>
            </ui-tabs>
          </div>
        `,
      },
      {
        title: 'Spacing Tools',
        components: ['ui-box', 'ui-flex', 'ui-grid', 'ui-section', 'ui-container'],
        description: 'Core composition primitives for any Svelte page structure.',
        markup: `
          <ui-container>
            <ui-section>
              <ui-box class="mini-surface">Box</ui-box>
              <ui-flex class="mini-flex">
                <ui-box class="mini-tile">Flex A</ui-box>
                <ui-box class="mini-tile">Flex B</ui-box>
              </ui-flex>
              <ui-grid class="mini-grid">
                <ui-box class="mini-tile">Grid 1</ui-box>
                <ui-box class="mini-tile">Grid 2</ui-box>
                <ui-box class="mini-tile">Grid 3</ui-box>
              </ui-grid>
            </ui-section>
          </ui-container>
        `,
      },
      {
        title: 'Advanced Layout',
        components: ['ui-placement-grid', 'ui-masonry-grid', 'ui-panel-group', 'ui-panel', 'ui-splitter', 'ui-drawer', 'ui-card', 'ui-dock'],
        description: 'Higher-level layout helpers and secondary containers.',
        markup: `
          <div class="stack-gap">
            <ui-placement-grid class="mini-grid">
              <ui-card class="mini-tile">Metric</ui-card>
              <ui-card class="mini-tile">Checklist</ui-card>
              <ui-card class="mini-tile">Owners</ui-card>
            </ui-placement-grid>
            <ui-masonry-grid class="mini-grid">
              <ui-card class="mini-tile">Campaign</ui-card>
              <ui-card class="mini-tile">QA</ui-card>
              <ui-card class="mini-tile">Support</ui-card>
            </ui-masonry-grid>
            <ui-panel-group>
              <ui-panel class="mini-tile">Timeline panel</ui-panel>
              <ui-splitter></ui-splitter>
              <ui-panel class="mini-tile">Checklist panel</ui-panel>
            </ui-panel-group>
            <div class="mini-surface">Drawer shell</div>
            <ui-drawer>Drawer content</ui-drawer>
            <ui-dock class="mini-surface">Dock</ui-dock>
          </div>
        `,
      },
    ],
  },
  {
    id: 'overlays',
    label: 'Overlays',
    eyebrow: 'Overlays and interactions',
    title: 'Transient and Command Surfaces',
    description:
      'Dialogs, menus, popovers, and command surfaces used directly from Svelte without framework-specific wrappers.',
    cards: [
      {
        title: 'Dialogs',
        components: ['ui-dialog', 'ui-alert-dialog', 'ui-drawer'],
        description: 'Modal and panel-style overlays opened from regular page buttons.',
        markup: `
          <div class="stack-gap">
            <div class="inline-stack">
              <button class="demo-button" type="button" data-demo-open="showcase-dialog">Open dialog</button>
              <button class="demo-button" type="button" data-demo-open="showcase-alert-dialog">Open alert dialog</button>
              <button class="demo-button" type="button" data-demo-open="showcase-drawer">Open drawer</button>
            </div>

            <ui-dialog id="showcase-dialog" title="Launch checklist" submit-text="Save" cancel-text="Cancel">
              <div slot="content" class="stack-gap">
                <div class="mini-surface">Review final approvals, rollout notes, and publishing windows.</div>
                <button class="demo-button" type="button" data-demo-close="showcase-dialog">Close dialog</button>
              </div>
            </ui-dialog>

            <ui-alert-dialog
              id="showcase-alert-dialog"
              title="Publish the launch note?"
              description="This will notify the go-to-market teams immediately."
              confirm-text="Publish"
              cancel-text="Not yet"
            >
              <div slot="content" class="mini-surface">A lightweight confirm surface for higher-stakes actions.</div>
            </ui-alert-dialog>

            <ui-drawer id="showcase-drawer">
              <div class="stack-gap">
                <div class="mini-surface">Drawer content works well for side-task detail and notes.</div>
                <button class="demo-button" type="button" data-demo-close="showcase-drawer">Close drawer</button>
              </div>
            </ui-drawer>
          </div>
        `,
      },
      {
        title: 'Menus',
        components: ['ui-popover', 'ui-dropdown', 'ui-menu', 'ui-context-menu'],
        description: 'Contextual surfaces for actions and overflow content.',
        markup: `
          <div class="stack-gap">
            <div class="inline-stack">
              <ui-popover>
                <button slot="trigger" class="demo-button" type="button">Open popover</button>
                <div slot="content" class="stack-gap">
                  <strong>Launch note</strong>
                  <div>Use popovers for lightweight supporting detail without leaving the page.</div>
                </div>
              </ui-popover>

              <ui-dropdown>
                <button slot="trigger" class="demo-button" type="button">Open dropdown</button>
                <div slot="content">
                  <div class="item" role="menuitem" tabindex="0">Create snapshot</div>
                  <div class="item" role="menuitem" tabindex="-1">Export handoff</div>
                  <div class="item" role="menuitem" tabindex="-1">Archive plan</div>
                </div>
              </ui-dropdown>
            </div>

            <div class="inline-stack">
              <ui-menu>
                <button slot="trigger" class="demo-button" type="button">Open menu</button>
                <div slot="content">
                  <div class="item" role="menuitem" tabindex="0">Inspect owners</div>
                  <div class="item" role="menuitem" tabindex="-1">Review blockers</div>
                  <div class="item" role="menuitem" tabindex="-1">Notify channel</div>
                </div>
              </ui-menu>

              <button
                id="showcase-context-anchor"
                class="demo-button"
                type="button"
                data-demo-open="showcase-context-menu"
                data-demo-anchor="showcase-context-anchor"
              >
                Open context menu
              </button>
            </div>

            <div class="mini-surface" data-demo-context-target="showcase-point-context-menu">
              Right-click this card to open the point-positioned context menu.
            </div>

            <ui-context-menu id="showcase-context-menu">
              <div slot="menu">
                <div class="menuitem" role="menuitem" tabindex="0">Inspect signal</div>
                <div class="menuitem" role="menuitem" tabindex="-1">Replay workflow</div>
                <div class="separator" role="separator"></div>
                <div class="menuitem" role="menuitem" tabindex="-1">Archive incident</div>
              </div>
            </ui-context-menu>

            <ui-context-menu id="showcase-point-context-menu">
              <div slot="menu">
                <div class="menuitem" role="menuitem" tabindex="0">Copy task link</div>
                <div class="menuitem" role="menuitem" tabindex="-1">Assign reviewer</div>
                <div class="menuitem" role="menuitem" tabindex="-1">Mark blocked</div>
              </div>
            </ui-context-menu>
          </div>
        `,
      },
      {
        title: 'Hints and Hover',
        components: ['ui-tooltip', 'ui-hover-card', 'ui-selection-popup'],
        description: 'Small supporting overlays for discovery and inline actions.',
        markup: `
          <div class="stack-gap">
            <div class="inline-stack">
              <ui-tooltip text="Send the launch digest to the full stakeholder list." placement="top">
                <button class="demo-button" type="button">Hover for tooltip</button>
              </ui-tooltip>

              <ui-hover-card>
                <button slot="trigger" class="demo-button" type="button">Hover for hover-card</button>
                <div slot="card" class="stack-gap">
                  <strong>Release squad</strong>
                  <div>QA is green, support is briefed, and launch copy is approved.</div>
                </div>
              </ui-hover-card>
            </div>

            <div class="inline-stack">
              <button id="showcase-selection-anchor" class="demo-button" type="button">Selection anchor</button>
              <button
                class="demo-button"
                type="button"
                data-demo-open="showcase-selection-popup"
                data-demo-anchor="showcase-selection-anchor"
              >
                Show selection popup
              </button>
            </div>

            <ui-selection-popup id="showcase-selection-popup" placement="top" variant="surface">
              <div class="inline-stack">
                <button class="demo-button" type="button" data-demo-close="showcase-selection-popup">Comment</button>
                <button class="demo-button" type="button" data-demo-close="showcase-selection-popup">Assign</button>
              </div>
            </ui-selection-popup>
          </div>
        `,
      },
      {
        title: 'Command Surfaces',
        components: ['ui-command', 'ui-command-palette', 'ui-quick-actions', 'ui-plugin-panel', 'ui-floating-toolbar', 'ui-toolbar'],
        description: 'Editor-adjacent action surfaces and command entry points.',
        markup: `
          <div class="stack-gap">
            <ui-command placeholder="Filter actions">
              <button slot="command" data-value="assign-owner" data-keywords="owner assignee review">Assign owner</button>
              <button slot="command" data-value="request-qa" data-keywords="qa verify checklist">Request QA</button>
              <button slot="command" data-value="share-notes" data-keywords="share stakeholders notes">Share launch notes</button>
            </ui-command>

            <div class="inline-stack">
              <button class="demo-button" type="button" data-demo-open="showcase-command-palette">Open command palette</button>
              <button class="demo-button" type="button" data-demo-open="showcase-plugin-panel">Open plugin panel</button>
              <button id="showcase-toolbar-anchor" class="demo-button" type="button">Selection anchor</button>
              <button
                class="demo-button"
                type="button"
                data-demo-open="showcase-floating-toolbar"
                data-demo-anchor="showcase-toolbar-anchor"
              >
                Show floating toolbar
              </button>
            </div>

            <ui-command-palette id="showcase-command-palette" placeholder="Search commands" empty-text="No launch commands found.">
              <button slot="command" data-value="open-checklist" data-keywords="checklist launch">Open checklist</button>
              <button slot="command" data-value="preview-note" data-keywords="preview note">Preview launch note</button>
              <button slot="command" data-value="publish" data-keywords="publish go live">Publish update</button>
            </ui-command-palette>

            <ui-quick-actions open collapsible label="Quick release actions">
              <button slot="action" type="button">Assign owner</button>
              <button slot="action" type="button">Request QA</button>
              <button slot="action" type="button">Share plan</button>
            </ui-quick-actions>

            <ui-plugin-panel
              id="showcase-plugin-panel"
              title="Launch assistants"
              description="A side utility for reminders, owners, and reusable snippets."
              dismissible
            >
              <div class="stack-gap">
                <div class="mini-surface">Plugin panel content can stay focused on one supporting workflow.</div>
                <button class="demo-button" type="button" data-demo-close="showcase-plugin-panel">Close panel</button>
              </div>
            </ui-plugin-panel>

            <ui-floating-toolbar id="showcase-floating-toolbar" anchor-id="showcase-toolbar-anchor">
              <div slot="toolbar" class="inline-stack">
                <button class="demo-button" type="button">Bold</button>
                <button class="demo-button" type="button">Comment</button>
                <button class="demo-button" type="button" data-demo-close="showcase-floating-toolbar">Hide</button>
              </div>
            </ui-floating-toolbar>

            <ui-toolbar>
              <button class="demo-button" type="button">Preview</button>
              <button class="demo-button" type="button">Publish</button>
            </ui-toolbar>
          </div>
        `,
      },
      {
        title: 'Presence and Accessibility',
        components: ['ui-presence', 'ui-slot', 'ui-visually-hidden'],
        description: 'Smaller supporting primitives that are easier to show in-page than as full overlays.',
        markup: `
          <div class="stack-gap">
            <ui-presence present>
              <div class="mini-surface">Presence keeps this surface mounted while still using the primitive contract.</div>
            </ui-presence>
            <ui-slot>
              <span class="mini-surface">Slot bridge content</span>
            </ui-slot>
            <button class="demo-button" type="button">
              Publish
              <ui-visually-hidden> launch update</ui-visually-hidden>
            </button>
          </div>
        `,
      },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    eyebrow: 'Data and display',
    title: 'Data, Feedback, and Workflows',
    description:
      'Display components, data surfaces, and operational workflow elements for richer app screens.',
    cards: [
      {
        title: 'Status Surfaces',
        components: ['ui-alert', 'ui-badge', 'ui-empty-state', 'ui-skeleton', 'ui-progress', 'ui-scroll-area', 'ui-separator'],
        description: 'Feedback and placeholder elements that round out app UX.',
        markup: `
          <div class="stack-gap">
            <div class="inline-stack">
              <ui-badge tone="warning">Needs review</ui-badge>
              <ui-badge tone="success">Ready</ui-badge>
            </div>
            <ui-alert
              tone="warning"
              title="Approval still pending"
              description="One dependency is still waiting on approval."
            ></ui-alert>
            <ui-empty-state title="No blockers">You are clear to start rollout rehearsal.</ui-empty-state>
            <ui-skeleton style="height: 72px;"></ui-skeleton>
            <ui-progress value="84" max="100"></ui-progress>
            <ui-scroll-area style="max-height: 110px;">
              <div class="scroll-copy">Stakeholder note one</div>
              <div class="scroll-copy">Stakeholder note two</div>
              <div class="scroll-copy">Stakeholder note three</div>
              <div class="scroll-copy">Stakeholder note four</div>
            </ui-scroll-area>
            <ui-separator></ui-separator>
          </div>
        `,
      },
      {
        title: 'Tables and Lists',
        components: ['ui-table', 'ui-data-table', 'ui-pagination', 'ui-transfer-list'],
        description: 'Tabular data plus dual-list selection for team operations.',
        markup: `
          <div class="stack-gap">
            <ui-table>
              <table>
                <thead><tr><th>Area</th><th>Owner</th></tr></thead>
                <tbody><tr><td>Campaign</td><td>Maya</td></tr><tr><td>QA</td><td>Imran</td></tr></tbody>
              </table>
            </ui-table>
            <ui-data-table selectable sortable>
              <table>
                <thead><tr><th data-key="task">Task</th><th data-key="status">Status</th></tr></thead>
                <tbody><tr><td>Approve copy</td><td>Ready</td></tr><tr><td>Verify analytics</td><td>In review</td></tr></tbody>
              </table>
            </ui-data-table>
            <ui-pagination page="2" total-pages="5"></ui-pagination>
            <ui-transfer-list options='[{"value":"ops","label":"Ops"},{"value":"design","label":"Design"},{"value":"qa","label":"QA"}]' value='["ops","qa"]'></ui-transfer-list>
          </div>
        `,
      },
      {
        title: 'Disclosure Patterns',
        components: ['ui-accordion', 'ui-collapsible', 'ui-stepper', 'ui-wizard'],
        description: 'Expandable and multi-step surfaces for guided flows.',
        markup: `
          <div class="stack-gap">
            <ui-accordion>
              <details open><summary>Launch readiness</summary><p>All sign-offs are nearly complete.</p></details>
            </ui-accordion>
            <ui-collapsible open>Risk review panel</ui-collapsible>
            <ui-stepper value="2" steps='[{"id":"brief","label":"Brief"},{"id":"qa","label":"QA"},{"id":"live","label":"Go live"}]'></ui-stepper>
            <ui-wizard value="1" steps='[{"id":"details","label":"Details"},{"id":"review","label":"Review"},{"id":"publish","label":"Publish"}]'></ui-wizard>
          </div>
        `,
      },
      {
        title: 'Visual Display',
        components: ['ui-avatar', 'ui-aspect-ratio', 'ui-block-controls', 'ui-icon', 'ui-chart', 'ui-timeline', 'ui-gantt'],
        description: 'Visual presentation primitives for dashboards and editorial tooling.',
        markup: `
          <div class="stack-gap">
            <div class="inline-stack">
              <ui-avatar initials="SL"></ui-avatar>
              <ui-icon name="chart"></ui-icon>
              <ui-icon name="clock"></ui-icon>
            </div>
            <ui-aspect-ratio ratio="16/9">
              <div class="media-placeholder">Hero preview</div>
            </ui-aspect-ratio>
            <ui-block-controls>Block controls</ui-block-controls>
            <ui-chart aria-label="Launch chart"></ui-chart>
            <ui-timeline></ui-timeline>
            <ui-gantt></ui-gantt>
          </div>
        `,
      },
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    eyebrow: 'Expressive extras',
    title: 'Animated and Branded Surfaces',
    description:
      'The more expressive side of ui-core, useful for landing pages, launch hubs, and richer storytelling moments.',
    cards: [
      {
        title: 'Animated Text',
        components: ['ui-marquee', 'ui-animated-text', 'ui-spinning-text'],
        description: 'Typography-centric motion surfaces.',
        markup: `
          <div class="stack-gap">
            <ui-marquee>Launch update • Campaign approved • QA passed • Docs ready</ui-marquee>
            <ui-animated-text>Release confidence climbing</ui-animated-text>
            <ui-spinning-text>Ship • Measure • Learn</ui-spinning-text>
          </div>
        `,
      },
      {
        title: 'Metric Motion',
        components: ['ui-number-ticker', 'ui-odometer', 'ui-meter'],
        description: 'Animated value surfaces for dashboards and metrics.',
        markup: `
          <div class="mini-grid">
            <div class="mini-surface">
              <p class="eyebrow">Projected ARR</p>
              <ui-number-ticker
                value="12842"
                from="12000"
                duration="1400ms"
                animation="odometer"
                format-style="currency"
                currency="USD"
                notation="compact"
                compact-display="short"
                fraction-digits="1"
                tone="success"
                size="lg"
              ></ui-number-ticker>
            </div>
            <div class="mini-surface">
              <p class="eyebrow">Qualified accounts</p>
              <ui-odometer
                value="42015"
                variant="digital"
                tone="success"
                size="lg"
                animate-on-mount
                label="Qualified accounts"
              ></ui-odometer>
            </div>
            <div class="mini-surface">
              <p class="eyebrow">Launch readiness</p>
              <ui-meter
                value="77"
                min="0"
                max="100"
                low="45"
                high="75"
                optimum="90"
                label="Launch readiness"
                show-label
                format="percent"
                size="lg"
                tone="success"
              ></ui-meter>
            </div>
          </div>
        `,
      },
      {
        title: 'Graphic Motion',
        components: ['ui-animated-list', 'ui-animated-beam', 'ui-icon-cloud', 'ui-orbiter'],
        description: 'Visual wrappers for richer launch pages and playful interfaces.',
        markup: `
          <div class="stack-gap">
            <ui-animated-list>Checklist animation</ui-animated-list>
            <ui-animated-beam
              variant="soft"
              tone="info"
              size="sm"
              columns="3"
              rows="3"
              min-height="240px"
              node-effect="glow"
            >
              <button data-ui-animated-beam-node node-id="brief" column="1" row="2" type="button">Brief</button>
              <div slot="hub" data-ui-animated-beam-hub node-id="review" column="2" row="2">Review</div>
              <button data-ui-animated-beam-node node-id="ship" column="3" row="1" type="button">Ship</button>
              <button data-ui-animated-beam-node node-id="measure" column="3" row="3" type="button">Measure</button>
              <div slot="connections" data-ui-animated-beam-connection from="brief" to="review"></div>
              <div slot="connections" data-ui-animated-beam-connection from="review" to="ship" curve="arc"></div>
              <div slot="connections" data-ui-animated-beam-connection from="review" to="measure" curve="soft"></div>
            </ui-animated-beam>
            <div class="inline-stack">
              <ui-icon-cloud variant="glass" tone="info" size="sm" pause-on-hover>
                <div slot="center" data-ui-icon-cloud-center>Launch</div>
                <button data-ui-icon-cloud-item type="button" aria-label="Docs">Docs</button>
                <button data-ui-icon-cloud-item type="button" aria-label="QA">QA</button>
                <button data-ui-icon-cloud-item type="button" aria-label="Ops">Ops</button>
                <button data-ui-icon-cloud-item type="button" aria-label="Sales">Sales</button>
              </ui-icon-cloud>
              <ui-orbiter variant="glass" tone="success" size="sm" rings="2" pause-on-hover>
                <div slot="center" data-ui-orbiter-center>Core</div>
                <button data-ui-orbiter-item type="button" aria-label="Signals">Signal</button>
                <button data-ui-orbiter-item type="button" aria-label="Alerts">Alert</button>
                <button data-ui-orbiter-item type="button" aria-label="Metrics">Metric</button>
                <button data-ui-orbiter-item type="button" aria-label="Trust">Trust</button>
              </ui-orbiter>
            </div>
          </div>
        `,
      },
    ],
  },
];

export const catalogGroups = [
  {
    title: 'Forms and Entry',
    tags: [
      'ui-button',
      'ui-split-button',
      'ui-input',
      'ui-password-field',
      'ui-textarea',
      'ui-label',
      'ui-description',
      'ui-field-error',
      'ui-control-group',
      'ui-fieldset',
      'ui-field',
      'ui-form',
      'ui-pin-input',
      'ui-otp-input',
      'ui-inline-edit',
      'ui-checkbox',
      'ui-radio-group',
      'ui-switch',
      'ui-slider',
      'ui-select',
      'ui-combobox',
      'ui-multi-select',
      'ui-toggle',
      'ui-toggle-group',
      'ui-number-field',
      'ui-tags-input',
      'ui-file-upload',
      'ui-dropzone',
      'ui-rating',
      'ui-color-picker',
    ],
  },
  {
    title: 'Dates and Planning',
    tags: [
      'ui-date-picker',
      'ui-date-range-picker',
      'ui-time-picker',
      'ui-date-field',
      'ui-time-field',
      'ui-date-time-picker',
      'ui-date-range-time-picker',
      'ui-calendar',
      'ui-stepper',
      'ui-wizard',
      'ui-sortable',
    ],
  },
  {
    title: 'Navigation and Layout',
    tags: [
      'ui-layout',
      'ui-sidebar',
      'ui-app-header',
      'ui-breadcrumb',
      'ui-navigation-menu',
      'ui-menubar',
      'ui-tabs',
      'ui-box',
      'ui-flex',
      'ui-grid',
      'ui-section',
      'ui-container',
      'ui-placement-grid',
      'ui-masonry-grid',
      'ui-panel-group',
      'ui-panel',
      'ui-splitter',
      'ui-drawer',
      'ui-card',
      'ui-dock',
    ],
  },
  {
    title: 'Overlays and Commands',
    tags: [
      'ui-dialog',
      'ui-alert-dialog',
      'ui-popover',
      'ui-dropdown',
      'ui-menu',
      'ui-context-menu',
      'ui-tooltip',
      'ui-hover-card',
      'ui-command',
      'ui-command-palette',
      'ui-quick-actions',
      'ui-selection-popup',
      'ui-plugin-panel',
      'ui-floating-toolbar',
      'ui-toolbar',
      'ui-portal',
      'ui-presence',
      'ui-slot',
      'ui-visually-hidden',
    ],
  },
  {
    title: 'Data, Display, and Motion',
    tags: [
      'ui-table',
      'ui-data-table',
      'ui-pagination',
      'ui-empty-state',
      'ui-skeleton',
      'ui-alert',
      'ui-badge',
      'ui-transfer-list',
      'ui-chart',
      'ui-timeline',
      'ui-gantt',
      'ui-progress',
      'ui-meter',
      'ui-scroll-area',
      'ui-separator',
      'ui-accordion',
      'ui-collapsible',
      'ui-avatar',
      'ui-aspect-ratio',
      'ui-block-controls',
      'ui-icon',
      'ui-marquee',
      'ui-animated-text',
      'ui-spinning-text',
      'ui-number-ticker',
      'ui-animated-list',
      'ui-animated-beam',
      'ui-icon-cloud',
      'ui-odometer',
      'ui-orbiter',
    ],
  },
];

const registryMarkupMap: Record<string, string> = {
  'ui-button': '<ui-button variant="primary">Button</ui-button>',
  'ui-split-button':
    '<ui-split-button label="Publish"><button slot="menuitem" type="button" data-value="quiet"><span><span data-menu-label>Publish quietly</span><span data-menu-description>Hold the digest for later.</span></span><span data-menu-shortcut>Q</span></button><button slot="menuitem" type="button" data-value="notes"><span><span data-menu-label>Publish with notes</span><span data-menu-description>Send the update with context.</span></span><span data-menu-shortcut>N</span></button></ui-split-button>',
  'ui-input': '<ui-input value="Demo value"></ui-input>',
  'ui-password-field': '<ui-password-field value="secret-demo"></ui-password-field>',
  'ui-textarea': '<ui-textarea>Multiline release note</ui-textarea>',
  'ui-label': '<ui-label>Label</ui-label>',
  'ui-description': '<ui-description>Supporting description copy.</ui-description>',
  'ui-field-error': '<ui-field-error>Validation message</ui-field-error>',
  'ui-control-group': '<ui-control-group><ui-input value="Grouped"></ui-input><ui-button>Go</ui-button></ui-control-group>',
  'ui-fieldset': '<ui-fieldset legend="Fieldset"><ui-input value="Inside fieldset"></ui-input></ui-fieldset>',
  'ui-field': '<ui-field label="Field label"><ui-input value="Field input"></ui-input></ui-field>',
  'ui-form': '<ui-form><ui-field label="Demo"><ui-input value="Form field"></ui-input></ui-field></ui-form>',
  'ui-pin-input': '<ui-pin-input value="1234"></ui-pin-input>',
  'ui-otp-input': '<ui-otp-input value="123456"></ui-otp-input>',
  'ui-inline-edit': '<ui-inline-edit value="Inline title"></ui-inline-edit>',
  'ui-checkbox': '<ui-checkbox checked>Checkbox</ui-checkbox>',
  'ui-radio-group':
    '<ui-radio-group value="a"><label><input type="radio" name="demo-radio" value="a" checked /> A</label><label><input type="radio" name="demo-radio" value="b" /> B</label></ui-radio-group>',
  'ui-switch': '<ui-switch checked>Switch</ui-switch>',
  'ui-slider': '<ui-slider value="60" min="0" max="100"></ui-slider>',
  'ui-select': '<ui-select value="one"><option value="one">One</option><option value="two">Two</option></ui-select>',
  'ui-combobox': '<ui-combobox value="Search item"></ui-combobox>',
  'ui-multi-select': '<ui-multi-select value=\'["one","two"]\'></ui-multi-select>',
  'ui-toggle': '<ui-toggle pressed>Toggle</ui-toggle>',
  'ui-toggle-group': '<ui-toggle-group value="left"><ui-toggle value="left">Left</ui-toggle><ui-toggle value="right">Right</ui-toggle></ui-toggle-group>',
  'ui-number-field': '<ui-number-field value="42"></ui-number-field>',
  'ui-tags-input': '<ui-tags-input value=\'["launch","priority"]\'></ui-tags-input>',
  'ui-file-upload': '<ui-file-upload label="Upload file"></ui-file-upload>',
  'ui-dropzone': '<ui-dropzone>Drop files here</ui-dropzone>',
  'ui-rating': '<ui-rating value="4" max="5"></ui-rating>',
  'ui-color-picker': '<ui-color-picker value="#c2410c"></ui-color-picker>',
  'ui-date-picker': '<ui-date-picker value="2026-08-18"></ui-date-picker>',
  'ui-date-range-picker': '<ui-date-range-picker value=\'{"start":"2026-08-18","end":"2026-08-21"}\'></ui-date-range-picker>',
  'ui-time-picker': '<ui-time-picker value="09:30"></ui-time-picker>',
  'ui-date-field': '<ui-date-field value="2026-08-18"></ui-date-field>',
  'ui-time-field': '<ui-time-field value="09:30"></ui-time-field>',
  'ui-date-time-picker': '<ui-date-time-picker value="2026-08-18T09:30"></ui-date-time-picker>',
  'ui-date-range-time-picker':
    '<ui-date-range-time-picker value=\'{"start":"2026-08-18T09:00","end":"2026-08-21T17:00"}\'></ui-date-range-time-picker>',
  'ui-calendar': '<ui-calendar value="2026-08-18"></ui-calendar>',
  'ui-stepper': '<ui-stepper value="1" steps=\'[{"id":"one","label":"One"},{"id":"two","label":"Two"},{"id":"three","label":"Three"}]\'></ui-stepper>',
  'ui-wizard': '<ui-wizard value="1" steps=\'[{"id":"one","label":"One"},{"id":"two","label":"Two"},{"id":"three","label":"Three"}]\'></ui-wizard>',
  'ui-sortable': '<ui-sortable class="registry-sortable"></ui-sortable>',
  'ui-layout': '<ui-layout class="showcase-layout"><ui-sidebar class="mini-surface">Sidebar</ui-sidebar><ui-box class="mini-surface">Layout body</ui-box></ui-layout>',
  'ui-sidebar': '<ui-sidebar class="mini-surface">Sidebar</ui-sidebar>',
  'ui-app-header': '<ui-app-header class="mini-surface">Header</ui-app-header>',
  'ui-breadcrumb': '<ui-breadcrumb>Home / Section / Page</ui-breadcrumb>',
  'ui-navigation-menu': '<ui-navigation-menu class="mini-surface">Overview · Docs · Assets</ui-navigation-menu>',
  'ui-menubar': '<ui-menubar class="mini-surface">File · Edit · View</ui-menubar>',
  'ui-tabs': '<ui-tabs value="demo"></ui-tabs>',
  'ui-box': '<ui-box class="mini-surface">Box</ui-box>',
  'ui-flex': '<ui-flex class="mini-flex"><ui-box class="mini-tile">A</ui-box><ui-box class="mini-tile">B</ui-box></ui-flex>',
  'ui-grid': '<ui-grid class="mini-grid"><ui-box class="mini-tile">1</ui-box><ui-box class="mini-tile">2</ui-box><ui-box class="mini-tile">3</ui-box></ui-grid>',
  'ui-section': '<ui-section><ui-box class="mini-surface">Section</ui-box></ui-section>',
  'ui-container': '<ui-container><ui-box class="mini-surface">Container</ui-box></ui-container>',
  'ui-placement-grid': '<ui-placement-grid class="mini-grid"><ui-card class="mini-tile">A</ui-card><ui-card class="mini-tile">B</ui-card></ui-placement-grid>',
  'ui-masonry-grid': '<ui-masonry-grid class="mini-grid"><ui-card class="mini-tile">A</ui-card><ui-card class="mini-tile">B</ui-card><ui-card class="mini-tile">C</ui-card></ui-masonry-grid>',
  'ui-panel-group': '<ui-panel-group><ui-panel class="mini-tile">Left</ui-panel><ui-splitter></ui-splitter><ui-panel class="mini-tile">Right</ui-panel></ui-panel-group>',
  'ui-panel': '<ui-panel class="mini-tile">Panel</ui-panel>',
  'ui-splitter': '<ui-splitter></ui-splitter>',
  'ui-drawer': '<div class="mini-surface">Drawer shell</div><ui-drawer>Drawer</ui-drawer>',
  'ui-card': '<ui-card class="mini-tile">Card</ui-card>',
  'ui-dock': '<ui-dock class="mini-surface">Dock</ui-dock>',
  'ui-dialog': '<div class="mini-surface">Dialog shell</div><ui-dialog>Dialog</ui-dialog>',
  'ui-alert-dialog': '<div class="mini-surface">Alert dialog shell</div><ui-alert-dialog>Alert dialog</ui-alert-dialog>',
  'ui-popover': '<div class="mini-surface">Popover shell</div><ui-popover>Popover</ui-popover>',
  'ui-dropdown': '<div class="mini-surface">Dropdown shell</div><ui-dropdown>Dropdown</ui-dropdown>',
  'ui-menu': '<div class="mini-surface">Menu shell</div><ui-menu>Menu</ui-menu>',
  'ui-context-menu': '<div class="mini-surface">Context menu shell</div><ui-context-menu>Context menu</ui-context-menu>',
  'ui-tooltip': '<div class="mini-surface">Tooltip shell</div><ui-tooltip>Tooltip</ui-tooltip>',
  'ui-hover-card': '<div class="mini-surface">Hover-card shell</div><ui-hover-card>Hover card</ui-hover-card>',
  'ui-command': '<ui-command placeholder="Search"></ui-command>',
  'ui-command-palette': '<div class="mini-surface">Command palette shell</div><ui-command-palette placeholder="Search commands"></ui-command-palette>',
  'ui-quick-actions': '<ui-quick-actions><ui-button size="sm">Action</ui-button></ui-quick-actions>',
  'ui-selection-popup': '<div class="mini-surface">Selection popup shell</div><ui-selection-popup>Popup</ui-selection-popup>',
  'ui-plugin-panel': '<div class="mini-surface">Plugin panel shell</div><ui-plugin-panel>Plugin panel</ui-plugin-panel>',
  'ui-floating-toolbar': '<ui-floating-toolbar><ui-button size="sm">Edit</ui-button></ui-floating-toolbar>',
  'ui-toolbar': '<ui-toolbar><ui-button size="sm">Primary</ui-button></ui-toolbar>',
  'ui-portal': '<ui-portal>Portal</ui-portal>',
  'ui-presence': '<ui-presence present>Presence</ui-presence>',
  'ui-slot': '<ui-slot>Slot</ui-slot>',
  'ui-visually-hidden': '<ui-visually-hidden>Hidden</ui-visually-hidden>',
  'ui-table': '<ui-table><table><thead><tr><th>Col</th><th>Value</th></tr></thead><tbody><tr><td>A</td><td>1</td></tr></tbody></table></ui-table>',
  'ui-data-table':
    '<ui-data-table selectable><table><thead><tr><th data-key="name">Name</th><th data-key="status">Status</th></tr></thead><tbody><tr><td>Campaign</td><td>Ready</td></tr></tbody></table></ui-data-table>',
  'ui-pagination': '<ui-pagination page="1" total-pages="5"></ui-pagination>',
  'ui-empty-state': '<ui-empty-state title="Nothing here">Add your first item.</ui-empty-state>',
  'ui-skeleton': '<ui-skeleton style="height: 64px;"></ui-skeleton>',
  'ui-alert': '<ui-alert tone="info" title="Release note" description="Stakeholders will receive the next digest at 4 PM."></ui-alert>',
  'ui-badge': '<ui-badge tone="info">Badge</ui-badge>',
  'ui-transfer-list': '<ui-transfer-list options=\'[{"value":"ops","label":"Ops"},{"value":"qa","label":"QA"}]\' value=\'["ops"]\'></ui-transfer-list>',
  'ui-chart': '<ui-chart aria-label="Chart"></ui-chart>',
  'ui-timeline': '<ui-timeline></ui-timeline>',
  'ui-gantt': '<ui-gantt></ui-gantt>',
  'ui-progress': '<ui-progress value="60" max="100"></ui-progress>',
  'ui-meter': '<ui-meter value="75" min="0" max="100" label="Readiness" show-label format="percent"></ui-meter>',
  'ui-scroll-area': '<ui-scroll-area style="max-height: 96px;"><div class="scroll-copy">One</div><div class="scroll-copy">Two</div><div class="scroll-copy">Three</div></ui-scroll-area>',
  'ui-separator': '<ui-separator></ui-separator>',
  'ui-accordion': '<ui-accordion><details open><summary>Summary</summary><p>Body</p></details></ui-accordion>',
  'ui-collapsible': '<ui-collapsible open>Collapsible</ui-collapsible>',
  'ui-avatar': '<ui-avatar initials="EC"></ui-avatar>',
  'ui-aspect-ratio': '<ui-aspect-ratio ratio="16/9"><div class="media-placeholder">Media</div></ui-aspect-ratio>',
  'ui-block-controls': '<ui-block-controls>Block controls</ui-block-controls>',
  'ui-icon': '<ui-icon name="sparkles"></ui-icon>',
  'ui-marquee': '<ui-marquee>Launch • Measure • Improve</ui-marquee>',
  'ui-animated-text': '<ui-animated-text>Animated text</ui-animated-text>',
  'ui-spinning-text': '<ui-spinning-text>Ship • Learn</ui-spinning-text>',
  'ui-number-ticker':
    '<ui-number-ticker value="12842" from="12000" animation="odometer" format-style="currency" currency="USD" notation="compact" compact-display="short"></ui-number-ticker>',
  'ui-animated-list': '<ui-animated-list>Animated list</ui-animated-list>',
  'ui-animated-beam':
    '<ui-animated-beam variant="soft" tone="info" size="sm" columns="3" rows="3" min-height="220px"><button data-ui-animated-beam-node node-id="source" column="1" row="2" type="button">Source</button><div slot="hub" data-ui-animated-beam-hub node-id="hub" column="2" row="2">Hub</div><button data-ui-animated-beam-node node-id="target" column="3" row="2" type="button">Target</button><div slot="connections" data-ui-animated-beam-connection from="source" to="hub"></div><div slot="connections" data-ui-animated-beam-connection from="hub" to="target"></div></ui-animated-beam>',
  'ui-icon-cloud':
    '<ui-icon-cloud variant="glass" tone="info" size="sm"><div slot="center" data-ui-icon-cloud-center>Core</div><button data-ui-icon-cloud-item type="button">Docs</button><button data-ui-icon-cloud-item type="button">QA</button><button data-ui-icon-cloud-item type="button">Ops</button></ui-icon-cloud>',
  'ui-odometer': '<ui-odometer value="4210" variant="digital" animate-on-mount></ui-odometer>',
  'ui-orbiter':
    '<ui-orbiter variant="glass" tone="success" size="sm"><div slot="center" data-ui-orbiter-center>Core</div><button data-ui-orbiter-item type="button">QA</button><button data-ui-orbiter-item type="button">Ops</button><button data-ui-orbiter-item type="button">Ship</button></ui-orbiter>',
};

export function registryMarkup(tag: string): string {
  return registryMarkupMap[tag] ?? `<${tag}></${tag}>`;
}
