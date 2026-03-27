import { Layout } from '@editora/ui-react';
import {
  LayoutCollapsedShell,
  LayoutLegacyPrimitives,
  LayoutOperationalModes,
  LayoutVisualModes,
  LayoutWorkspaceExample
} from './layout.shared';

export default {
  title: 'UI/Layout Showcase',
  component: Layout
};

export const VisualModes = () => <LayoutVisualModes />;

export const OperationalModes = () => <LayoutOperationalModes />;

export const CollapsedShell = () => <LayoutCollapsedShell />;

export const WorkspaceExample = () => <LayoutWorkspaceExample />;

export const LegacyPrimitives = () => <LayoutLegacyPrimitives />;
