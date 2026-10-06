/**
 * ToolbarRenderer - Framework-agnostic toolbar rendering
 */

import { Plugin, ToolbarItem } from '../plugins/Plugin';

export interface ToolbarConfig {
  items?: string; // "undo redo | bold italic | media table"
  sticky?: boolean;
  position?: 'top' | 'bottom';
  floating?: boolean;
}

export interface ToolbarButton {
  id?: string;
  label: string;
  command?: string;
  icon?: string;
  placeholder?: string;
  type?: 'button' | 'dropdown' | 'input' | 'separator' | 'inline-menu' | 'group';
  options?: Array<{ label: string; value: string }>;
  active?: boolean;
  disabled?: boolean;
  items?: ToolbarButton[]; // For groups
}

export class ToolbarRenderer {
  private config: ToolbarConfig;
  private plugins: Plugin[];
  private container?: HTMLElement;
  private commandHandler?: (command: string, value?: any) => void;
  private pluginLoader?: any; // PluginLoader instance to get all registered plugins

  // Overflow ("more options") state. @editora/react's Toolbar.tsx has had
  // this for a while (ResizeObserver-driven visibleCount + a "more" button
  // that reveals the rest in an expanded row); the web component toolbar
  // had no counterpart at all - items that didn't fit just wrapped or got
  // silently clipped with no way to reach them. This ports the same
  // algorithm (measure each top-level item, accumulate widths until the
  // available space runs out) onto plain DOM: hidden items are *moved*
  // (not cloned) into the expanded row, which keeps their existing click
  // handlers intact rather than needing to re-bind a duplicate.
  private itemsContainer?: HTMLElement;
  private overflowUnits: HTMLElement[] = [];
  /** Each unit's original `|`-section group div, so un-hiding restores it there (not just anywhere in itemsContainer) and compound type:"group" wrappers don't end up visually split across two rows. */
  private overflowUnitHomes = new WeakMap<HTMLElement, HTMLElement>();
  private moreButton?: HTMLButtonElement;
  private expandedRow?: HTMLElement;
  private resizeObserver?: ResizeObserver;
  private overflowRafId?: number;
  private expandedOpen = false;
  private readonly onDocumentPointerDownForOverflow = (event: MouseEvent) => {
    if (!this.expandedOpen) return;
    const target = event.target as Node | null;
    if (target && (this.moreButton?.contains(target) || this.expandedRow?.contains(target))) return;
    this.setExpandedOpen(false);
  };

  private setLastCommandTrigger(el: HTMLElement | null, command?: string): void {
    if (typeof window === 'undefined' || !el) return;
    const resolvedCommand = command || el.getAttribute('data-command') || undefined;
    if (!resolvedCommand) return;
    (window as any).__editoraLastCommandButton = el;
    (window as any).__editoraLastCommand = resolvedCommand;
  }

  constructor(config: ToolbarConfig, plugins: Plugin[], pluginLoader?: any) {
    this.config = config;
    this.plugins = plugins;
    this.pluginLoader = pluginLoader;
  }

  /**
   * Set command handler for toolbar buttons
   */
  setCommandHandler(handler: (command: string, value?: any) => void): void {
    this.commandHandler = handler;
  }

  /**
   * Parse toolbar string into button groups
   */
  private parseToolbarString(toolbarString: string): ToolbarButton[][] {
    const groups: ToolbarButton[][] = [];
    const sections = toolbarString.split("|").map((s) => s.trim());

    const allToolbarItems = this.getAvailableToolbarItems();
    // Index items by command and by label (for group types with no command)
    const itemMap = new Map<string, ToolbarItem>();
    allToolbarItems.forEach((item) => {
      if (item.command) itemMap.set(item.command, item);
      if (item.type === "group" && item.label) itemMap.set(item.label, item);
    });

    // Common command aliases for backward compatibility
    const aliases: Record<string, string> = {
      bold: "toggleBold",
      italic: "toggleItalic",
      underline: "toggleUnderline",
      strikethrough: "toggleStrikethrough",
      bullist: "toggleBulletList",
      numlist: "toggleOrderedList",
      checklist: "toggleChecklist",
      link: "openLinkDialog",
      image: "openImageDialog",
      table: "insertTable",
      trackChanges: "toggleTrackChanges",
      acceptTrackChanges: "acceptAllTrackChanges",
      rejectTrackChanges: "rejectAllTrackChanges",
      anchor: "insertAnchor",
      code: "toggleSourceView",
      blockquote: "toggleBlockquote",
      undo: "undo",
      redo: "redo",
      textColor: "openTextColorPicker",
      backgroundColor: "openBackgroundColorPicker",
      fontSize: "fontSize",
      fontFamily: "setFontFamily",
      lineHeight: "setLineHeight",
      heading: "setBlockType",
      paragraph: "setParagraph",
      textAlignment: "setTextAlignment",
      direction: "setDirectionLTR",
      indent: "increaseIndent",
      outdent: "decreaseIndent",
      capitalization: "setCapitalization",
      math: "insertMath",
      specialCharacters: "insertSpecialCharacter",
      emojis: "openEmojiDialog",
      embedIframe: "openEmbedIframeDialog",
      fullscreen: "toggleFullscreen",
      preview: "togglePreview",
      print: "print",
      a11yChecker: "toggleA11yChecker",
      spellCheck: "toggleSpellCheck",
      comments: "addComment",
      showHideComments: "toggleComments",
      toggleComments: "toggleComments",
      footnote: "insertFootnote",
      mergeTags: "insertMergeTag",
      dataBinding: "openDataBindingDialog",
      dataBindingPreview: "openDataBindingDialog",
      contentRules: "toggleContentRulesPanel",
      contentRulesAudit: "runContentRulesAudit",
      contentRulesRealtime: "toggleContentRulesRealtime",
      mention: "insertMention",
      slash: "openSlashCommands",
      slashCommands: "openSlashCommands",
      pageBreak: "insertPageBreak",
      template: "insertTemplate",
      importWord: "importWord",
      exportWord: "exportWord",
      exportPdf: "exportPdf",
      insertImage: "insertImage",
      insertVideo: "insertVideo",
      codeBlock: "insertCodeBlock",
    };

    sections.forEach((section) => {
      const buttons: ToolbarButton[] = [];
      const commands = section.split(/\s+/).filter(Boolean);

      commands.forEach((cmd) => {
        // Special handling for multi-button shortcuts
        if (cmd === "direction") {
          // Direction has two buttons: LTR and RTL
          const ltrItem = itemMap.get("setDirectionLTR");
          const rtlItem = itemMap.get("setDirectionRTL");
          if (ltrItem) {
            buttons.push({
              id: "directionLTR",
              label: ltrItem.label,
              command: ltrItem.command,
              icon: ltrItem.icon,
              type: ltrItem.type || "button",
              options: ltrItem.options,
            });
          }
          if (rtlItem) {
            buttons.push({
              id: "directionRTL",
              label: rtlItem.label,
              command: rtlItem.command,
              icon: rtlItem.icon,
              type: rtlItem.type || "button",
              options: rtlItem.options,
            });
          }
          return;
        }

        if (cmd === "comments") {
          // Comments has two buttons: Add Comment and Toggle Comments
          const addCommentItem = itemMap.get("addComment");
          const toggleCommentsItem = itemMap.get("toggleComments");
          if (addCommentItem) {
            buttons.push({
              id: "addComment",
              label: addCommentItem.label,
              command: addCommentItem.command,
              icon: addCommentItem.icon,
              type: addCommentItem.type || "button",
              options: addCommentItem.options,
            });
          }
          if (toggleCommentsItem) {
            buttons.push({
              id: "toggleComments",
              label: toggleCommentsItem.label,
              command: toggleCommentsItem.command,
              icon: toggleCommentsItem.icon,
              type: toggleCommentsItem.type || "button",
              options: toggleCommentsItem.options,
            });
          }
          return;
        }

        // Try direct command first, then alias
        const actualCommand = aliases[cmd] || cmd;
        let item = itemMap.get(actualCommand);
        // If not found by command, try by label (for group type)
        if (!item) item = itemMap.get(cmd);
        if (item) {
          buttons.push({
            id: cmd,
            label: item.label,
            command: item.command,
            icon: item.icon,
            type:
              item.type === "separator" ? "separator" : item.type || "button",
            options: item.options,
            items: item.items as unknown as ToolbarButton[] | undefined,
          });
        }
      });

      if (buttons.length > 0) {
        groups.push(buttons);
      }
    });

    return groups;
  }

  /**
   * Get all available toolbar items from plugins
   */
  private getAvailableToolbarItems(): ToolbarItem[] {
    // Use the plugins that were passed to the constructor - they should be loaded
    const items = this.plugins.flatMap((p) => p.toolbar || []);
    return items;
  }

  /**
   * Render toolbar to DOM element
   */
  render(container: HTMLElement): void {
    this.container = container;
    container.innerHTML = "";
    container.className = "editora-toolbar";

    if (this.config.sticky) {
      container.classList.add("editora-toolbar-sticky");
    }

    if (this.config.position) {
      container.classList.add(`editora-toolbar-${this.config.position}`);
    }

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "editora-toolbar-items-container";
    this.itemsContainer = itemsContainer;
    // Overflow moves individual buttons, not whole `|`-delimited group divs
    // - the default (no explicit config.items string) toolbar puts every
    // plugin's button in one single group with no separators at all, so
    // treating each *group div* as the atomic hide/show unit (as a first
    // attempt at this did) meant there was only ever one giant unit to
    // measure, and it neither fit nor had anywhere to go - it just
    // overflowed the container's `overflow: hidden` and silently clipped,
    // the exact bug this was supposed to fix. Each button (or compound
    // type:"group" control, kept intact as one unit) is tracked here as
    // it's created, regardless of which `|`-section div it lives in.
    this.overflowUnits = [];

    const toolbarString = this.config.items || this.getDefaultToolbarString();
    const buttonGroups = this.parseToolbarString(toolbarString);
    buttonGroups.forEach((group, groupIndex) => {
      const groupEl = document.createElement("div");
      groupEl.className = "editora-toolbar-group";
      group.forEach((button) => {
        this.appendToolbarButton(groupEl, button);
        const unit = groupEl.lastElementChild;
        if (unit instanceof HTMLElement) {
          this.overflowUnits.push(unit);
          this.overflowUnitHomes.set(unit, groupEl);
        }
      });
      itemsContainer.appendChild(groupEl);
      // Add separator between groups (except last)
      if (groupIndex < buttonGroups.length - 1) {
        const separator = document.createElement("div");
        separator.className = "editora-toolbar-separator";
        itemsContainer.appendChild(separator);
      }
    });

    container.appendChild(itemsContainer);
    this.setupOverflow(container);
  }

  /** Measures top-level items in `itemsContainer` and moves whatever doesn't
   * fit into a collapsible "more options" row, re-measuring on resize. */
  private setupOverflow(container: HTMLElement): void {
    const itemsContainer = this.itemsContainer;
    if (!itemsContainer || typeof ResizeObserver === "undefined") return;

    const moreButton = document.createElement("button");
    moreButton.type = "button";
    moreButton.className = "editora-toolbar-more-button";
    moreButton.title = "Show more options";
    moreButton.setAttribute("aria-label", "More toolbar options");
    moreButton.textContent = "☰"; // ☰
    moreButton.style.display = "none";
    moreButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.setExpandedOpen(!this.expandedOpen);
    });
    this.moreButton = moreButton;
    container.appendChild(moreButton);

    const expandedRow = document.createElement("div");
    expandedRow.className = "editora-toolbar-expanded-row";
    this.expandedRow = expandedRow;
    container.appendChild(expandedRow);

    document.addEventListener("mousedown", this.onDocumentPointerDownForOverflow, true);

    const recalculate = () => {
      const units = this.overflowUnits;
      if (units.length === 0) return;

      // Every hidden unit currently lives in expandedRow - restore each to
      // its original `|`-section home first (in original order, so shared
      // homes with multiple units end up correctly ordered again), or
      // measuring a still-moved node would give a wrong/zero width.
      units.forEach((unit) => {
        if (unit.parentElement === expandedRow) {
          this.overflowUnitHomes.get(unit)?.appendChild(unit);
        }
      });

      const toolbarWidth = container.clientWidth;
      const padding = 16;
      const moreButtonWidth = 40;
      const gap = 4;
      const availableWidth = Math.max(0, toolbarWidth - padding - moreButtonWidth - gap);

      let accumulated = 0;
      let visibleCount = 0;
      for (const unit of units) {
        const width = unit.getBoundingClientRect().width + gap;
        if (accumulated + width <= availableWidth) {
          accumulated += width;
          visibleCount++;
        } else {
          break;
        }
      }
      visibleCount = Math.max(1, Math.min(visibleCount, units.length));

      const hasOverflow = visibleCount < units.length;
      moreButton.style.display = hasOverflow ? "" : "none";
      moreButton.classList.toggle("active", hasOverflow && this.expandedOpen);
      if (!hasOverflow && this.expandedOpen) this.setExpandedOpen(false);

      units.forEach((unit, index) => {
        if (index >= visibleCount) expandedRow.appendChild(unit);
      });
    };

    const scheduleRecalculate = () => {
      if (this.overflowRafId !== undefined) cancelAnimationFrame(this.overflowRafId);
      this.overflowRafId = requestAnimationFrame(recalculate);
    };

    this.resizeObserver = new ResizeObserver(() => scheduleRecalculate());
    this.resizeObserver.observe(container);
    scheduleRecalculate();
  }

  private setExpandedOpen(open: boolean): void {
    this.expandedOpen = open;
    this.expandedRow?.classList.toggle("show", open);
    this.moreButton?.classList.toggle("active", open);
  }

  /**
   * Append a toolbar button or group to a parent element
   */
  private appendToolbarButton(
    parent: HTMLElement,
    button: ToolbarButton,
  ): void {
    if (button.type === "separator") {
      const separator = document.createElement("div");
      separator.className = "editora-toolbar-separator";
      parent.appendChild(separator);
    } else if (button.type === "dropdown") {
      const dropdownEl = this.createDropdown(button);
      parent.appendChild(dropdownEl);
    } else if (button.type === "inline-menu") {
      const inlineMenuEl = this.createInlineMenu(button);
      parent.appendChild(inlineMenuEl);
    } else if (button.type === "group" && button.items && button.items.length) {
      const groupButtonEl = this.createGroupButton(button);
      parent.appendChild(groupButtonEl);
    } else if (button.type === "input") {
      const inputEl = this.createInput(button);
      parent.appendChild(inputEl);
    } else {
      const buttonEl = this.createButton(button);
      parent.appendChild(buttonEl);
    }
  }

  /**
   * Create a toolbar button element
   */
  private createGroupButton(button: ToolbarButton): HTMLElement {
    const el = document.createElement("div");
    const groupClass = button.label.toLowerCase().replace(/\s+/g, "-");
    el.className = `editora-toolbar-group-button ${groupClass}`;
    el.title = button.label;
    // Optionally add a label or icon for the group itself
    if (button.icon) {
      if (button.icon.startsWith("<svg") && button.icon.endsWith("</svg>")) {
        const iconWrapper = document.createElement("span");
        iconWrapper.className = "editora-toolbar-icon";
        iconWrapper.innerHTML = button.icon;
        el.appendChild(iconWrapper);
      } else {
        el.innerHTML = button.icon;
      }
    }
    // Recursively render group items
    if (button.items && button.items.length) {
      const itemsContainer = document.createElement("div");
      itemsContainer.className = `editora-toolbar-group-items ${groupClass}`;
      button.items.forEach((child) => {
        this.appendToolbarButton(itemsContainer, child);
      });
      el.appendChild(itemsContainer);
    }
    return el;
  }

  /**
   * Create a toolbar button element
   */
  private createInput(button: ToolbarButton): HTMLElement {
    const el = document.createElement("input");
    el.className = `editora-toolbar-input ${button.label.toLowerCase().replace(/\s+/g, "-")}`;
    el.type = "text";
    el.title = button.label;
    // A title alone is not a reliable accessible name (it is only a fallback).
    el.setAttribute("aria-label", button.label);
    el.placeholder = button.placeholder || "";
    if (button.command) {
      el.setAttribute("data-command", button.command);
    }

    if (button.active) {
      el.classList.add("active");
    }

    if (button.disabled) {
      el.disabled = true;
    }

    el.addEventListener("click", (e) => {
      e.preventDefault();
      this.setLastCommandTrigger(el, button.command);
      if (this.commandHandler && button.command) {
        this.commandHandler(button.command);
      }
    });

    return el;
  }

  /**
   * Create a toolbar button element
   */
  private createButton(button: ToolbarButton): HTMLElement {
    const el = document.createElement("button");
    el.className = "editora-toolbar-button";
    el.type = "button";
    el.title = button.label;
    if (button.command) {
      el.setAttribute("data-command", button.command);
    }

    if (button.icon) {
      // Check if it's an SVG icon
      if (button.icon.startsWith("<svg") && button.icon.endsWith("</svg>")) {
        // Create a wrapper span for the SVG with proper styling
        const iconWrapper = document.createElement("span");
        iconWrapper.className = "editora-toolbar-icon";
        iconWrapper.innerHTML = button.icon;
        el.appendChild(iconWrapper);
      } else {
        // Plain text icon or HTML
        el.innerHTML = button.icon;
      }
    } else {
      el.textContent = button.label;
    }

    if (button.active) {
      el.classList.add("active");
    }

    if (button.disabled) {
      el.disabled = true;
    }

    el.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.commandHandler && button.command) {
        this.commandHandler(button.command);
      }
    });

    return el;
  }

  /**
   * Create a dropdown element
   */
  private createDropdown(button: ToolbarButton): HTMLElement {
    const container = document.createElement("div");
    container.className = "editora-toolbar-dropdown";

    const trigger = document.createElement("button");
    trigger.className =
      "editora-toolbar-button editora-toolbar-dropdown-trigger";
    trigger.type = "button";
    trigger.textContent = button.label;

    const menu = document.createElement("div");
    menu.className = "editora-toolbar-dropdown-menu";
    menu.style.display = "none";

    if (button.options) {
      button.options.forEach((option) => {
        const item = document.createElement("button");
        item.className = "editora-toolbar-dropdown-item";
        item.type = "button";
        item.textContent = option.label;
        item.setAttribute("data-value", option.value);

        item.addEventListener("click", (e) => {
          e.preventDefault();
          this.setLastCommandTrigger(trigger, button.command);
          if (this.commandHandler && button.command) {
            this.commandHandler(button.command, option.value);
          }
          menu.style.display = "none";
        });

        menu.appendChild(item);
      });
    }

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setLastCommandTrigger(trigger, button.command);
      const isOpen = menu.style.display === "block";
      menu.style.display = isOpen ? "none" : "block";
    });

    // Close dropdown when clicking outside
    const closeDropdown = (e: Event) => {
      if (!container.contains(e.target as Node)) {
        menu.style.display = "none";
      }
    };

    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        menu.style.display = "none";
      }
    };

    document.addEventListener("mousedown", closeDropdown, true);
    document.addEventListener("keydown", closeOnEscape);

    // Store the cleanup function for later removal
    (container as any)._cleanupDropdown = () => {
      document.removeEventListener("mousedown", closeDropdown, true);
      document.removeEventListener("keydown", closeOnEscape);
    };

    container.appendChild(trigger);
    container.appendChild(menu);

    return container;
  }

  /**
   * Create an inline menu element (like dropdown but triggered by button click)
   */
  private createInlineMenu(button: ToolbarButton): HTMLElement {
    const container = document.createElement("div");
    container.className =
      "editora-toolbar-dropdown editora-toolbar-inline-menu";

    const trigger = document.createElement("button");
    trigger.className = "editora-toolbar-button";
    trigger.type = "button";
    trigger.title = button.label;

    // Add icon if available
    if (button.icon) {
      if (button.icon.startsWith("<svg") && button.icon.endsWith("</svg>")) {
        const iconWrapper = document.createElement("span");
        iconWrapper.className = "editora-toolbar-icon";
        iconWrapper.innerHTML = button.icon;
        trigger.appendChild(iconWrapper);
      } else {
        trigger.innerHTML = button.icon;
      }
    } else {
      trigger.textContent = button.label;
    }

    const menu = document.createElement("div");
    menu.className = "editora-toolbar-dropdown-menu";
    menu.style.display = "none";

    if (button.options) {
      button.options.forEach((option) => {
        const item = document.createElement("button");
        item.className = "editora-toolbar-dropdown-item";
        item.type = "button";
        item.textContent = option.label;
        item.setAttribute("data-value", option.value);

        item.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.setLastCommandTrigger(trigger, button.command);
          if (this.commandHandler && button.command) {
            this.commandHandler(button.command, option.value);
          }
          menu.style.display = "none";
        });

        menu.appendChild(item);
      });
    }

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setLastCommandTrigger(trigger, button.command);

      // Close all other menus
      const allMenus = this.container?.querySelectorAll(
        ".editora-toolbar-dropdown-menu",
      );
      allMenus?.forEach((m) => {
        if (m !== menu) {
          (m as HTMLElement).style.display = "none";
        }
      });

      // Toggle this menu
      menu.style.display = menu.style.display === "none" ? "block" : "none";
    });

    // Close menu when clicking outside
    const closeMenuOutside = (e: Event) => {
      if (!container.contains(e.target as Node)) {
        menu.style.display = "none";
      }
    };

    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        menu.style.display = "none";
      }
    };

    document.addEventListener("mousedown", closeMenuOutside, true);
    document.addEventListener("keydown", closeOnEscape);

    // Store cleanup so destroy() removes document listeners.
    (container as any)._cleanupDropdown = () => {
      document.removeEventListener("mousedown", closeMenuOutside, true);
      document.removeEventListener("keydown", closeOnEscape);
    };

    container.appendChild(trigger);
    container.appendChild(menu);

    return container;
  }

  /**
   * Get default toolbar string if none provided
   */
  private getDefaultToolbarString(): string {
    const items = this.getAvailableToolbarItems();
    return items.map((item) => item.command).join(" ");
  }

  /**
   * Update button state
   */
  updateButtonState(
    command: string,
    state: { active?: boolean; disabled?: boolean },
  ): void {
    if (!this.container) return;

    const button = this.container.querySelector(
      `[data-command="${command}"]`,
    ) as HTMLButtonElement;
    if (button) {
      if (state.active !== undefined) {
        button.classList.toggle("active", state.active);
      }
      if (state.disabled !== undefined) {
        button.disabled = state.disabled;
      }
    }
  }

  /**
   * Destroy toolbar
   */
  destroy(): void {
    if (this.container) {
      // Clean up dropdown event listeners
      const dropdowns = this.container.querySelectorAll('.editora-toolbar-dropdown');
      dropdowns.forEach(dropdown => {
        const cleanup = (dropdown as any)._cleanupDropdown;
        if (cleanup) {
          cleanup();
        }
      });
      this.container.innerHTML = "";
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    if (this.overflowRafId !== undefined) cancelAnimationFrame(this.overflowRafId);
    document.removeEventListener("mousedown", this.onDocumentPointerDownForOverflow, true);
    this.itemsContainer = undefined;
    this.moreButton = undefined;
    this.expandedRow = undefined;
    this.commandHandler = undefined;
  }
}
