import React from 'react';
import { Box, Button, Flex, Input, Select } from '@editora/ui-react';

type Option = { value: string; label: string };

type FiltersBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  status?: string;
  statusOptions?: Option[];
  onStatusChange?: (value: string) => void;
  extra?: React.ReactNode;
  onClear?: () => void;
};

export function FiltersBar({
  search,
  onSearchChange,
  searchPlaceholder,
  status,
  statusOptions,
  onStatusChange,
  extra,
  onClear
}: FiltersBarProps) {
  return (
    <Flex
      align="center"
      style={{
        gap: 8,
        flexWrap: 'wrap',
        padding: 10,
        border: '1px solid var(--ui-color-border, #cbd5e1)',
        borderRadius: 'var(--ui-radius, 12px)',
        background: 'var(--ui-color-surface, #ffffff)'
      }}
    >
      <Input
        value={search}
        onChange={(next) => onSearchChange(String((next as any)?.target?.value ?? next))}
        placeholder={searchPlaceholder || 'Search...'}
        clearable
        style={{ minInlineSize: 220, flex: '1 1 240px' }}
      />

      {statusOptions?.length && onStatusChange ? (
        <Select value={status || ''} onChange={onStatusChange} style={{ minInlineSize: 170 }}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : null}

      {extra ? <Box>{extra}</Box> : null}

      {onClear ? (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      ) : null}
    </Flex>
  );
}

export default FiltersBar;
