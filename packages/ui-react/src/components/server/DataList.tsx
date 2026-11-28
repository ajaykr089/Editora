import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type DataListProps = React.HTMLAttributes<HTMLElement> & {
  /** horizontal: label beside value (stacks under 30rem wide); vertical: label above. */
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  /** Width of the label column (a CSS length; a number is px). Default 10rem. */
  labelWidth?: string | number;
  /** A rule between rows. */
  divided?: boolean;
  /** How the label lines up with a tall value. */
  align?: 'start' | 'center' | 'baseline';
  /** Plain-text rows instead of children. */
  items?: Array<{ label: React.ReactNode; value: React.ReactNode }>;
};

const ATTRS: AttrSpec = {
  orientation: ['orientation', 'string'],
  size: ['size', 'string'],
  labelWidth: ['label-width', 'string'],
  divided: ['divided', 'bool'],
  align: ['align', 'string'],
};

export type DataListItemProps = React.HTMLAttributes<HTMLDivElement>;
export type DataListLabelProps = React.HTMLAttributes<HTMLElement>;
export type DataListValueProps = React.HTMLAttributes<HTMLElement>;

/** One row: a Label and a Value. */
const Item = React.forwardRef<HTMLDivElement, DataListItemProps>((props, ref) => <div ref={ref} {...props} />);
Item.displayName = 'DataList.Item';

/** The term (a native dt). */
const Label = React.forwardRef<HTMLElement, DataListLabelProps>((props, ref) => <dt ref={ref as React.Ref<HTMLElement>} {...props} />);
Label.displayName = 'DataList.Label';

/** Its value (a native dd): text, links, badges, buttons. */
const Value = React.forwardRef<HTMLElement, DataListValueProps>((props, ref) => <dd ref={ref as React.Ref<HTMLElement>} {...props} />);
Value.displayName = 'DataList.Value';

/**
 * Label and value pairs, as a native description list (dl / dt / dd) inside `ui-data-list`.
 *
 *   <DataList>
 *     <DataList.Item><DataList.Label>Status</DataList.Label><DataList.Value>Active</DataList.Value></DataList.Item>
 *   </DataList>
 */
const Root = React.forwardRef<HTMLElement, DataListProps>(({ children, items, ...props }, ref) => {
  const rows = items
    ? items.map((item, index) => (
      <div key={index}>
        <dt>{item.label}</dt>
        <dd>{item.value}</dd>
      </div>
    ))
    : children;
  return createUIElement('ui-data-list', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, <dl>{rows}</dl>);
});
Root.displayName = 'DataList';

export const DataList = Object.assign(Root, { Item, Label, Value });
