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

    const toolbarString = this.config.items || this.getDefaultToolbarString();
    const buttonGroups = this.parseToolbarString(toolbarString);
    buttonGroups.forEach((group, groupIndex) => {
      const groupEl = document.createElement("div");
      groupEl.className = "editora-toolbar-group";
      group.forEach((button) => {
        this.appendToolbarButton(groupEl, button);
      });
      container.appendChild(groupEl);
      // Add separator between groups (except last)
      if (groupIndex < buttonGroups.length - 1) {
        const separator = document.createElement("div");
        separator.className = "editora-toolbar-separator";
        container.appendChild(separator);
      }
    });
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
    el.className = "editora-toolbar-group-button";
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
      itemsContainer.className = "editora-toolbar-group-items";
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
      const isOpen = menu.style.display === "block";
      menu.style.display = isOpen ? "none" : "block";
    });

    // Close dropdown when clicking outside
    const closeDropdown = (e: Event) => {
      if (!container.contains(e.target as Node)) {
        menu.style.display = "none";
      }
    };

    document.addEventListener("click", closeDropdown);

    // Store the cleanup function for later removal
    (container as any)._cleanupDropdown = () => {
      document.removeEventListener("click", closeDropdown);
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
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target as Node)) {
        menu.style.display = "none";
      }
    });

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
    this.commandHandler = undefined;
  }
}
