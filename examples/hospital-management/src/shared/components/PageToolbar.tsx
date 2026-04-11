import React from 'react';
import {
  PageToolbar as EditoraPageToolbar,
  type PageHeaderAction as EditoraPageHeaderAction,
  type PageToolbarProps as EditoraPageToolbarProps,
} from '@editora/ui-react';
import { Icon } from '@editora/react-icons';

export type PageToolbarAction = Omit<EditoraPageHeaderAction, 'icon'> & {
  icon?: string;
};

export type PageToolbarProps = Omit<EditoraPageToolbarProps, 'actions'> & {
  actions?: PageToolbarAction[];
};

export function PageToolbar({ actions = [], ...rest }: PageToolbarProps) {
  const mappedActions = actions.map((action) => ({
    ...action,
    icon: action.icon ? <Icon name={action.icon as any} size={14} aria-hidden="true" /> : undefined,
  }));

  return (
    <EditoraPageToolbar {...rest} actions={mappedActions} />
  );
}

export default PageToolbar;
