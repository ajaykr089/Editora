import { Schema, NodeSpec } from '../schema/Node';
import { EditorState } from '../EditorState';

export interface ToolbarItem {
  label: string;
  command: string;
  icon?: string;
  type?: 'button' | 'dropdown' | 'input' | 'inline-menu';
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export interface Plugin {
  name: string;
  nodes?: Record<string, NodeSpec>;
  marks?: Record<string, NodeSpec>;
  commands?: Record<string, (state: EditorState) => EditorState | null>;
  toolbar?: ToolbarItem[];
}

export class PluginManager {
  plugins: Plugin[] = [];

  register(plugin: Plugin): void {
    this.plugins.push(plugin);
  }

  buildSchema(): Schema {
    const nodes: Record<string, NodeSpec> = {};
    const marks: Record<string, NodeSpec> = {};

    this.plugins.forEach(plugin => {
      if (plugin.nodes) Object.assign(nodes, plugin.nodes);
      if (plugin.marks) Object.assign(marks, plugin.marks);
    });

    return new Schema(nodes, marks);
  }

  getCommands(): Record<string, (state: EditorState) => EditorState | null> {
    const commands: Record<string, (state: EditorState) => EditorState | null> = {};
    this.plugins.forEach(plugin => {
      if (plugin.commands) Object.assign(commands, plugin.commands);
    });
    return commands;
  }

  getToolbarItems(): ToolbarItem[] {
    return this.plugins.flatMap(p => p.toolbar || []);
  }
}
