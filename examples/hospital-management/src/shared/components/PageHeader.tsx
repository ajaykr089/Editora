import React from 'react';
import { Badge, Box, Button, Flex } from '@editora/ui-react';
import { Icon } from '@editora/react-icons';

type PageHeaderAction = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: string;
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  statusChip?: { label: string; tone: 'info' | 'success' | 'warning' | 'danger' };
  actions?: PageHeaderAction[];
};

export function PageHeader({ title, subtitle, statusChip, actions = [] }: PageHeaderProps) {
  return (
    <Flex align="start" justify="space-between" style={{ gap: 14, flexWrap: 'wrap' }}>
      <Box>
        <Flex align="center" style={{ gap: 8 }}>
          <Box style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {title}
          </Box>
          {statusChip ? (
            <Badge tone={statusChip.tone} variant="soft" size="sm">
              {statusChip.label}
            </Badge>
          ) : null}
        </Flex>
        {subtitle ? (
          <Box style={{ marginTop: 4, color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>{subtitle}</Box>
        ) : null}
      </Box>

      {actions.length ? (
        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          {actions.map((action) => (
            <Button key={action.label} variant={action.variant || 'secondary'} size="sm" onClick={action.onClick}>
              {action.icon ? <Icon name={action.icon as any} size={14} aria-hidden="true" /> : null}
              {action.label}
            </Button>
          ))}
        </Flex>
      ) : null}
    </Flex>
  );
}

export default PageHeader;
