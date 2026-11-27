import * as React from 'react';
import '@editora/ui-core/attachment';
import {
  createUIElement,
  getCustomEventDetail,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

export type AttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done';
export type AttachmentRemoveDetail = { name: string };

export type AttachmentProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
  /** File name; also picks the icon from its extension. */
  name?: string;
  /** Replaces the kind, size and state line. Put an error's reason here. */
  description?: string;
  /** MIME type, for the icon. */
  type?: string;
  /** File size in bytes, shown formatted. */
  bytes?: number;
  state?: AttachmentState;
  /** 0-100 while uploading; without it the bar is indeterminate. */
  progress?: number;
  size?: 'md' | 'sm' | 'xs';
  orientation?: 'horizontal' | 'vertical';
  mediaVariant?: 'icon' | 'image';
  /** The card opens this file. */
  href?: string;
  target?: string;
  /** Shows a remove button (named "Remove <name>" unless removeLabel is set). */
  removable?: boolean;
  removeLabel?: string;
  onRemove?: (detail: AttachmentRemoveDetail) => void;
};

export const Attachment = React.forwardRef<HTMLElement, AttachmentProps>(function Attachment(props, forwardedRef) {
  const { name, description, type, bytes, state, progress, size, orientation, mediaVariant, href, target, removable, removeLabel, onRemove, children, ...rest } = props;
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleRemove = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<AttachmentRemoveDetail>(event);
    if (detail) onRemove?.(detail);
  }, [onRemove]);
  useElementEventListeners(ref, [{ type: 'remove', listener: handleRemove }], [handleRemove], { hostOnly: true });

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'name', name ?? null);
    syncStringAttribute(el, 'description', description ?? null);
    syncStringAttribute(el, 'type', type ?? null);
    syncStringAttribute(el, 'bytes', bytes != null ? String(bytes) : null);
    syncStringAttribute(el, 'state', state ?? null);
    syncStringAttribute(el, 'progress', progress != null ? String(progress) : null);
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null);
    syncStringAttribute(el, 'orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncStringAttribute(el, 'media-variant', mediaVariant ?? null);
    syncStringAttribute(el, 'href', href ?? null);
    syncStringAttribute(el, 'target', target ?? null);
    syncBooleanAttribute(el, 'removable', removable);
    syncStringAttribute(el, 'remove-label', removeLabel ?? null);
  }, [name, description, type, bytes, state, progress, size, orientation, mediaVariant, href, target, removable, removeLabel]);

  return createUIElement('ui-attachment', { ref, ...rest }, children);
});
Attachment.displayName = 'Attachment';

export default Attachment;
