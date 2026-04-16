import React from 'react';
import {
  RecordHeader as EditoraRecordHeader,
  type PageHeaderAction as EditoraPageHeaderAction,
  type RecordHeaderProps as EditoraRecordHeaderProps,
} from '@editora/ui-react';
import { Icon } from '@editora/react-icons';

export type RecordHeaderAction = Omit<EditoraPageHeaderAction, 'icon'> & {
  icon?: string;
};

export type RecordHeaderProps = Omit<EditoraRecordHeaderProps, 'actions'> & {
  actions?: RecordHeaderAction[];
};

export function RecordHeader({ actions = [], ...rest }: RecordHeaderProps) {
  const mappedActions = actions.map((action) => ({
    ...action,
    icon: action.icon ? <Icon name={action.icon as any} size={14} aria-hidden="true" /> : undefined,
  }));

  return (
    <EditoraRecordHeader {...rest} actions={mappedActions} />
  );
}

export default RecordHeader;
