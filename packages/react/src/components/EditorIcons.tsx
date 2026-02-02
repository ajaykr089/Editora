import React from 'react';

/**
 * Editor Toolbar Icons
 * 
 * A collection of SVG icons used in the Rich Text Editor toolbar.
 * All icons are based on TinyMCE editor icons for consistency.
 */

// Common icon props
interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

// Undo Icon
export const UndoIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M6.4 8H12c3.7 0 6.2 2 6.8 5.1.6 2.7-.4 5.6-2.3 6.8a1 1 0 0 1-1-1.8c1.1-.6 1.8-2.7 1.4-4.6-.5-2.1-2.1-3.5-4.9-3.5H6.4l3.3 3.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 1.4L6.4 8Z" fillRule="nonzero"></path>
  </svg>
);

// Redo Icon
export const RedoIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M17.6 10H12c-2.8 0-4.4 1.4-4.9 3.5-.4 2 .3 4 1.4 4.6a1 1 0 1 1-1 1.8c-2-1.2-2.9-4.1-2.3-6.8.6-3 3-5.1 6.8-5.1h5.6l-3.3-3.3a1 1 0 1 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3Z" fillRule="nonzero"></path>
  </svg>
);

// Bold Icon
export const BoldIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M7.8 19c-.3 0-.5 0-.6-.2l-.2-.5V5.7c0-.2 0-.4.2-.5l.6-.2h5c1.5 0 2.7.3 3.5 1 .7.6 1.1 1.4 1.1 2.5a3 3 0 0 1-.6 1.9c-.4.6-1 1-1.6 1.2.4.1.9.3 1.3.6s.8.7 1 1.2c.4.4.5 1 .5 1.6 0 1.3-.4 2.3-1.3 3-.8.7-2.1 1-3.8 1H7.8Zm5-8.3c.6 0 1.2-.1 1.6-.5.4-.3.6-.7.6-1.3 0-1.1-.8-1.7-2.3-1.7H9.3v3.5h3.4Zm.5 6c.7 0 1.3-.1 1.7-.4.4-.4.6-.9.6-1.5s-.2-1-.7-1.4c-.4-.3-1-.4-2-.4H9.4v3.8h4Z" fillRule="evenodd"></path>
  </svg>
);

// Italic Icon
export const ItalicIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="m16.7 4.7-.1.9h-.3c-.6 0-1 0-1.4.3-.3.3-.4.6-.5 1.1l-2.1 9.8v.6c0 .5.4.8 1.4.8h.2l-.2.8H8l.2-.8h.2c1.1 0 1.8-.5 2-1.5l2-9.8.1-.5c0-.6-.4-.8-1.4-.8h-.3l.2-.9h5.8Z" fillRule="evenodd"></path>
  </svg>
);

// Underline Icon
export const UnderlineIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M16 5c.6 0 1 .4 1 1v7c0 2.8-2.2 5-5 5s-5-2.2-5-5V6c0-.6.4-1 1-1s1 .4 1 1v7c0 1.7 1.3 3 3 3s3-1.3 3-3V6c0-.6.4-1 1-1ZM4 17h16c.6 0 1 .4 1 1s-.4 1-1 1H4a1 1 0 1 1 0-2Z" fillRule="evenodd"></path>
  </svg>
);

// Strikethrough Icon
export const StrikethroughIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <g fillRule="evenodd">
      <path d="M15.6 8.5c-.5-.7-1-1.1-1.3-1.3-.6-.4-1.3-.6-2-.6-2.7 0-2.8 1.7-2.8 2.1 0 1.6 1.8 2 3.2 2.3 4.4.9 4.6 2.8 4.6 3.9 0 1.4-.7 4.1-5 4.1A6.2 6.2 0 0 1 7 16.4l1.5-1.1c.4.6 1.6 2 3.7 2 1.6 0 2.5-.4 3-1.2.4-.8.3-2-.8-2.6-.7-.4-1.6-.7-2.9-1-1-.2-3.9-.8-3.9-3.6C7.6 6 10.3 5 12.4 5c2.9 0 4.2 1.6 4.7 2.4l-1.5 1.1Z"></path>
      <path d="M5 11h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" fillRule="nonzero"></path>
    </g>
  </svg>
);

// Import from Word Icon
export const ImportWordIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M7 3h7.4L19 7.6V15h-2V9h-4V5H5c0-1.1.9-2 2-2Z"></path>
    <path d="M9.5 7A1.5 1.5 0 0 1 11 8.4v7.1A1.5 1.5 0 0 1 9.6 17H2.5A1.5 1.5 0 0 1 1 15.6V8.5A1.5 1.5 0 0 1 2.4 7h7.1Zm-1 2.8-1 2.6-1-2.5v-.1a.6.6 0 0 0-1 0l-.1.1-.9 2.5-1-2.5v-.1a.6.6 0 0 0-1 .4v.1l1.5 4v.1a.6.6 0 0 0 1 0v-.1l1-2.5.9 2.5v.1a.6.6 0 0 0 1 0H8l1.6-4v-.2a.6.6 0 0 0-1.1-.4Z"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M11.4 18.2a1 1 0 0 0 1.2 1.6l1.4-1V22a1 1 0 1 0 2 0v-3.1l1.4 1a1 1 0 0 0 1.2-1.7L15 15.8l-3.6 2.4Z"></path>
  </svg>
);

// Export to Word Icon
export const ExportWordIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M9.5 7A1.5 1.5 0 0 1 11 8.4v7.1A1.5 1.5 0 0 1 9.6 17H2.5A1.5 1.5 0 0 1 1 15.6V8.5A1.5 1.5 0 0 1 2.4 7h7.1Zm-1 2.8-1 2.6-1-2.5v-.1a.6.6 0 0 0-1 0l-.1.1-.9 2.5-1-2.5v-.1a.6.6 0 0 0-1 .4v.1l1.5 4v.1a.6.6 0 0 0 1 0v-.1l1-2.5.9 2.5v.1a.6.6 0 0 0 1 0H8l1.6-4v-.2a.6.6 0 0 0-1.1-.4Z"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M7 3h7.4L19 7.6V17h-2V9h-4V5H7v3H5V5c0-1.1.9-2 2-2ZM15 17a1 1 0 1 0-2 0v3.1l-1.4-1a1 1 0 1 0-1.2 1.7l3.6 2.4 3.6-2.4a1 1 0 0 0-1.2-1.6l-1.4 1V17Z"></path>
  </svg>
);

// Export to PDF Icon
export const ExportPdfIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M7 3h7.4L19 7.6V17h-2V9h-4V5H7v3H5V5c0-1.1.9-2 2-2Z"></path>
    <path d="M2.6 15.2v-1.9h1c.6 0 1-.2 1.4-.5.3-.3.5-.7.5-1.2s-.2-.9-.5-1.2a2 2 0 0 0-1.3-.4H1v5.2h1.6Zm.4-3h-.4v-1.1h.5l.6.1.2.5c0 .1 0 .3-.2.4l-.7.1Zm5.7 3 1-.1c.3 0 .5-.2.7-.4l.5-.8c.2-.3.2-.7.2-1.3v-1l-.5-.8c-.2-.3-.4-.5-.7-.6L8.7 10H6.3v5.2h2.4Zm-.4-1.1H8v-3h.4c.5 0 .8.2 1 .4l.2 1.1-.1 1-.3.3-.8.2Zm5.3 1.2V13h2v-1h-2v-1H16V10h-4v5.2h1.6Z"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M15 17a1 1 0 1 0-2 0v3.1l-1.4-1a1 1 0 1 0-1.2 1.7l3.6 2.4 3.6-2.4a1 1 0 0 0-1.2-1.6l-1.4 1V17Z"></path>
  </svg>
);

// Link Icon
export const LinkIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M6.2 12.3a1 1 0 0 1 1.4 1.4l-2 2a2 2 0 1 0 2.6 2.8l4.8-4.8a1 1 0 0 0 0-1.4 1 1 0 1 1 1.4-1.3 2.9 2.9 0 0 1 0 4L9.6 20a3.9 3.9 0 0 1-5.5-5.5l2-2Zm11.6-.6a1 1 0 0 1-1.4-1.4l2-2a2 2 0 1 0-2.6-2.8L11 10.3a1 1 0 0 0 0 1.4A1 1 0 1 1 9.6 13a2.9 2.9 0 0 1 0-4L14.4 4a3.9 3.9 0 0 1 5.5 5.5l-2 2Z" fillRule="nonzero"></path>
  </svg>
);

// Image/Video Icon (Media)
export const MediaIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fillRule="nonzero"></path>
  </svg>
);

// Video Icon (specific)
export const VideoIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fillRule="nonzero"></path>
  </svg>
);

// Table Icon
export const TableIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path fillRule="nonzero" d="M19 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h14ZM5 14v4h6v-4H5Zm14 0h-6v4h6v-4Zm0-6h-6v4h6V8ZM5 12h6V8H5v4Z"></path>
  </svg>
);

// Math Icon
export const MathIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M9 4.8c.1-.5.5-.8 1-.8h10a1 1 0 1 1 0 2h-9.2L8.3 19.2a1 1 0 0 1-1.7.4l-3.4-4.2a1 1 0 0 1 1.6-1.2l2 2.5L9 4.8Zm9.7 5.5c.4.4.4 1 0 1.4L17 13.5l1.8 1.8a1 1 0 0 1-1.4 1.4L15.5 15l-1.8 1.8a1 1 0 0 1-1.4-1.4l1.8-1.8-1.8-1.8a1 1 0 0 1 1.4-1.4l1.8 1.8 1.8-1.8a1 1 0 0 1 1.4 0Z"></path>
  </svg>
);

// List Icons
export const NumberedListIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M10 17h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8a1 1 0 0 1 0 2h-8a1 1 0 0 1 0-2ZM6 4v3.5c0 .3-.2.5-.5.5a.5.5 0 0 1-.5-.5V5h-.5a.5.5 0 0 1 0-1H6Zm-1 8.8.2.2h1.3c.3 0 .5.2.5.5s-.2.5-.5.5H4.9a1 1 0 0 1-.9-1V13c0-.4.3-.8.6-1l1.2-.4.2-.3a.2.2 0 0 0-.2-.2H4.5a.5.5 0 0 1-.5-.5c0-.3.2-.5.5-.5h1.6c.5 0 .9.4.9 1v.1c0 .4-.3.8-.6 1l-1.2.4-.2.3ZM7 17v2c0 .6-.4 1-1 1H4.5a.5.5 0 0 1 0-1h1.2c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H4.4a.4.4 0 1 1 0-.8h1.3c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H4.5a.5.5 0 1 1 0-1H6c.6 0 1 .4 1 1Z" fillRule="evenodd"></path>
  </svg>
);

export const BulletListIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M11 5h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2ZM4.5 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1Zm0 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1Zm0 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1Z" fillRule="evenodd"></path>
  </svg>
);

// Alignment Icons
export const AlignLeftIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path>
  </svg>
);

export const AlignCenterIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path>
  </svg>
);

export const AlignRightIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path>
  </svg>
);

export const AlignJustifyIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path>
  </svg>
);

// Heading Icon
export const HeadingIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M6 4h12c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V5c0-.6.4-1 1-1Zm1 2v12h10V6H7Zm1 2h3v8H8V8Zm5 0h3v8h-3V8Z" fillRule="evenodd"></path>
  </svg>
);

// Code Block Icon
export const CodeBlockIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <g fillRule="nonzero">
      <path d="M9.8 15.7c.3.3.3.8 0 1-.3.4-.9.4-1.2 0l-4.4-4.1a.8.8 0 0 1 0-1.2l4.4-4.2c.3-.3.9-.3 1.2 0 .3.3.3.8 0 1.1L6 12l3.8 3.7ZM14.2 15.7c-.3.3-.3.8 0 1 .4.4.9.4 1.2 0l4.4-4.1c.3-.3.3-.9 0-1.2l-4.4-4.2a.8.8 0 0 0-1.2 0c-.3.3-.3.8 0 1.1L18 12l-3.8 3.7Z"></path>
    </g>
  </svg>
);

// Blockquote Icon
export const BlockquoteIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M7 5h2v4c0 1.1-.9 2-2 2H5a1 1 0 0 1 0-2h2V5Zm8 0h2v4c0 1.1-.9 2-2 2h-2a1 1 0 0 1 0-2h2V5Z" fillRule="evenodd"></path>
  </svg>
);

// Clear Formatting Icon
export const ClearFormattingIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M13.2 6a1 1 0 0 1 0 .2l-2.6 10a1 1 0 0 1-1 .8h-.2a.8.8 0 0 1-.8-1l2.6-10H8a1 1 0 1 1 0-2h9a1 1 0 0 1 0 2h-3.8ZM5 18h7a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Zm13 1.5L16.5 18 15 19.5a.7.7 0 0 1-1-1l1.5-1.5-1.5-1.5a.7.7 0 0 1 1-1l1.5 1.5 1.5-1.5a.7.7 0 0 1 1 1L17.5 17l1.5 1.5a.7.7 0 0 1-1 1Z" fillRule="evenodd"></path>
  </svg>
);

// Text Color Icon
export const TextColorIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <g fillRule="evenodd">
      <path className="tox-icon-text-color__color" d="M3 18h18v3H3z" fill="#000000"></path>
      <path d="M8.7 16h-.8a.5.5 0 0 1-.5-.6l2.7-9c.1-.3.3-.4.5-.4h2.8c.2 0 .4.1.5.4l2.7 9a.5.5 0 0 1-.5.6h-.8a.5.5 0 0 1-.4-.4l-.7-2.2c0-.3-.3-.4-.5-.4h-3.4c-.2 0-.4.1-.5.4l-.7 2.2c0 .3-.2.4-.4.4Zm2.6-7.6-.6 2a.5.5 0 0 0 .5.6h1.6a.5.5 0 0 0 .5-.6l-.6-2c0-.3-.3-.4-.5-.4h-.4c-.2 0-.4.1-.5.4Z"></path>
    </g>
  </svg>
);

// Background Color Icon
export const BackgroundColorIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <g fillRule="evenodd">
      <path className="tox-icon-highlight-bg-color__color" d="M3 18h18v3H3z" fill="#000000"></path>
      <path fillRule="nonzero" d="M7.7 16.7H3l3.3-3.3-.7-.8L10.2 8l4 4.1-4 4.2c-.2.2-.6.2-.8 0l-.6-.7-1.1 1.1zm5-7.5L11 7.4l3-2.9a2 2 0 0 1 2.6 0L18 6c.7.7.7 2 0 2.7l-2.9 2.9-1.8-1.8-.5-.6"></path>
    </g>
  </svg>
);

// Special Characters Icon
export const SpecialCharactersIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M15 18h4l1-2v4h-6v-3.3l1.4-1a6 6 0 0 0 1.8-2.9 6.3 6.3 0 0 0-.1-4.1 5.8 5.8 0 0 0-3-3.2c-.6-.3-1.3-.5-2.1-.5a5.1 5.1 0 0 0-3.9 1.8 6.3 6.3 0 0 0-1.3 6 6.2 6.2 0 0 0 1.8 3l1.4.9V20H4v-4l1 2h4v-.5l-2-1L5.4 15A6.5 6.5 0 0 1 4 11c0-1 .2-1.9.6-2.7A7 7 0 0 1 6.3 6C7.1 5.4 8 5 9 4.5c1-.3 2-.5 3.1-.5a8.8 8.8 0 0 1 5.7 2 7 7 0 0 1 1.7 2.3 6 6 0 0 1 .2 4.8c-.2.7-.6 1.3-1 1.9a7.6 7.6 0 0 1-3.6 2.5v.5Z" fillRule="evenodd"></path>
  </svg>
);

// Emojis Icon
export const EmojisIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M9 11c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm6 0c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm-3 5.5c2.1 0 4-1.5 4.4-3.5H7.6c.5 2 2.3 3.5 4.4 3.5ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" fillRule="nonzero"></path>
  </svg>
);

// Line Height Icon
export const LineHeightIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M21 5a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zM7 3.6l3.7 3.7a1 1 0 0 1-1.3 1.5h-.1L8 7.3v9.2l1.3-1.3a1 1 0 0 1 1.3 0h.1c.4.4.4 1 0 1.3v.1L7 20.4l-3.7-3.7a1 1 0 0 1 1.3-1.5h.1L6 16.7V7.4L4.7 8.7a1 1 0 0 1-1.3 0h-.1a1 1 0 0 1 0-1.3v-.1L7 3.6z"></path>
  </svg>
);

// Decrease Indent Icon
export const DecreaseIndentIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M7 5h12c.6 0 1 .4 1 1s-.4 1-1 1H7a1 1 0 1 1 0-2Zm5 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm0 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm-5 4h12a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2Zm1.6-3.8a1 1 0 0 1-1.2 1.6l-3-2a1 1 0 0 1 0-1.6l3-2a1 1 0 0 1 1.2 1.6L6.8 12l1.8 1.2Z" fillRule="evenodd"></path>
  </svg>
);

// Increase Indent Icon
export const IncreaseIndentIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M7 5h12c.6 0 1 .4 1 1s-.4 1-1 1H7a1 1 0 1 1 0-2Zm5 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm0 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm-5 4h12a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2Zm-2.6-3.8L6.2 12l-1.8-1.2a1 1 0 0 1 1.2-1.6l3 2a1 1 0 0 1 0 1.6l-3 2a1 1 0 1 1-1.2-1.6Z" fillRule="evenodd"></path>
  </svg>
);

// Embed Iframe Icon
export const EmbedIframeIcon: React.FC<IconProps> = ({ width = 24, height = 24, className }) => (
  <svg width={width} height={height} focusable="false" className={className}>
    <path d="M19 6V5H5v14h2A13 13 0 0 1 19 6Zm0 1.4c-.8.8-1.6 2.4-2.2 4.6H19V7.4Zm0 5.6h-2.4c-.4 1.8-.6 3.8-.6 6h3v-6Zm-4 6c0-2.2.2-4.2.6-6H13c-.7 1.8-1.1 3.8-1.1 6h3Zm-4 0c0-2.2.4-4.2 1-6H9.6A12 12 0 0 0 8 19h3ZM4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm11.8 9c.4-1.9 1-3.4 1.8-4.5a9.2 9.2 0 0 0-4 4.5h2.2Zm-3.4 0a12 12 0 0 1 2.8-4 12 12 0 0 0-5 4h2.2Z" fillRule="nonzero"></path>
  </svg>
);

// Export all icons as a map for easy access
export const EditorIcons = {
  undo: UndoIcon,
  redo: RedoIcon,
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strikethrough: StrikethroughIcon,
  importWord: ImportWordIcon,
  exportWord: ExportWordIcon,
  exportPdf: ExportPdfIcon,
  link: LinkIcon,
  media: MediaIcon,
  video: VideoIcon,
  table: TableIcon,
  math: MathIcon,
  numberedList: NumberedListIcon,
  bulletList: BulletListIcon,
  alignLeft: AlignLeftIcon,
  alignCenter: AlignCenterIcon,
  alignRight: AlignRightIcon,
  alignJustify: AlignJustifyIcon,
  heading: HeadingIcon,
  codeBlock: CodeBlockIcon,
  blockquote: BlockquoteIcon,
  clearFormatting: ClearFormattingIcon,
  textColor: TextColorIcon,
  backgroundColor: BackgroundColorIcon,
  specialCharacters: SpecialCharactersIcon,
  emojis: EmojisIcon,
  lineHeight: LineHeightIcon,
  decreaseIndent: DecreaseIndentIcon,
  increaseIndent: IncreaseIndentIcon,
  embedIframe: EmbedIframeIcon,
} as const;

export type EditorIconName = keyof typeof EditorIcons;
