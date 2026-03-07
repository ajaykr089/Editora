import { createDefaultItems } from './SlashCommandsDefaultItems';
import type { SlashCommandItem, SlashCommandsPluginOptions } from './SlashCommands.types';

function normalizeItems(items: SlashCommandItem[]): SlashCommandItem[] {
  const normalized: SlashCommandItem[] = [];
  const seen = new Set<string>();

  items.forEach((item) => {
    const id = String(item.id || '').trim();
    const label = String(item.label || '').trim();
    if (!id || !label || seen.has(id)) return;
    seen.add(id);
    normalized.push({
      ...item,
      id,
      label,
      description: item.description ? String(item.description) : undefined,
      keywords: Array.isArray(item.keywords) ? item.keywords.map((k) => String(k)).filter(Boolean) : undefined,
    });
  });

  return normalized;
}

export function normalizeOptions(options: SlashCommandsPluginOptions): Required<SlashCommandsPluginOptions> {
  const trigger = (options.triggerChar || '/')[0] || '/';
  const includeDefaultItems = options.includeDefaultItems !== false;
  const sourceItems = includeDefaultItems
    ? [...(options.items || []), ...createDefaultItems()]
    : options.items || [];

  return {
    triggerChar: trigger,
    minChars: Math.max(0, options.minChars ?? 0),
    maxQueryLength: Math.max(1, options.maxQueryLength ?? 48),
    maxSuggestions: Math.max(1, options.maxSuggestions ?? 10),
    requireBoundary: options.requireBoundary !== false,
    includeDefaultItems,
    items: normalizeItems(sourceItems),
    itemRenderer: options.itemRenderer || ((item) => item.label),
    emptyStateText: options.emptyStateText || 'No commands found',
    panelLabel: options.panelLabel || 'Slash commands',
  };
}
