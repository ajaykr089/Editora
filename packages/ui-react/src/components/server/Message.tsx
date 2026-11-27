import * as React from 'react';

import { createUIElement } from '../_createElement';
import { toHostProps, type AttrSpec } from './_attrs';

export type MessageProps = React.HTMLAttributes<HTMLElement> & {
  /** Sender, shown and used to name the message. */
  name?: string;
  /** Shown as given. */
  time?: string;
  /** Machine-readable time. */
  datetime?: string;
  /** end for the current user. */
  align?: 'start' | 'end';
  /** A follow-up from the same sender: no repeated avatar or header. */
  grouped?: boolean;
  footerVisibility?: 'always' | 'hover';
};

const ATTRS: AttrSpec = { name: ['name', 'string'], time: ['time', 'string'], datetime: ['datetime', 'string'], align: ['align', 'string'], grouped: ['grouped', 'bool'], footerVisibility: ['footer-visibility', 'string'] };

/** Renders the `ui-message` element (see @editora/ui-core). */
export const Message = React.forwardRef<HTMLElement, MessageProps>(({ children, ...props }, ref) =>
  createUIElement('ui-message', { ref, ...toHostProps(props as Record<string, unknown>, ATTRS) }, children)
);
Message.displayName = 'Message';
