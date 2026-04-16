import React from 'react';
import {
  PageHeader as EditoraPageHeader,
  type PageHeaderAction as EditoraPageHeaderAction,
  type PageHeaderProps as EditoraPageHeaderProps,
} from '@editora/ui-react';
import { Icon } from '@editora/react-icons';

export type PageHeaderAction = Omit<EditoraPageHeaderAction, 'icon'> & {
  icon?: string;
};

export type PageHeaderProps = Omit<EditoraPageHeaderProps, 'actions'> & {
  actions?: PageHeaderAction[];
};

export function PageHeader({ actions = [], ...rest }: PageHeaderProps) {
  const mappedActions = actions.map((action) => ({
    ...action,
    icon: action.icon ? <Icon name={action.icon as any} size={14} aria-hidden="true" /> : undefined,
  }));

  return (
    <EditoraPageHeader {...rest} actions={mappedActions} />
  );
}

export default PageHeader;
