export {
  computePosition,
  createPortalContainer,
  autoUpdatePosition,
  showPortalFor,
} from './portal';
export type { Placement, ComputeOptions, VirtualElement, ShowPortalOptions } from './portal';

export {
  applyTheme,
  defaultTokens,
  baselineLightTokens,
  baselineDarkTokens,
  createThemeTokens,
  withAccentPalette,
  registerThemeHost,
} from './theme';
export type { ThemeTokens, ThemeMode, AccentPaletteName } from './theme';

export {
  DialogManager,
  createDialogManager,
  showDialog,
  confirmDialog,
  dismissAllDialogs,
} from './dialog-manager';
export type {
  DialogManagerApi,
  DialogMode,
  DialogAction,
  DialogDismissSource,
  DialogResult,
  DialogSubmitContext,
  DialogOptions,
} from './dialog-manager';

export {
  AlertDialogManager,
  createAlertDialogManager,
  alert,
  confirm,
  prompt,
  dismissAllAlertDialogs,
} from './alert-dialog-manager';
export type {
  AlertDialogMode,
  AlertDialogAction,
  AlertDialogDismissSource,
  AlertResult,
  ConfirmResult,
  PromptResult,
  PromptInputOptions,
  AlertDialogCheckboxOptions,
  AlertDialogConfirmContext,
  AlertDialogCancelContext,
  AlertDialogDismissContext,
  AlertDialogCommonOptions,
  AlertDialogAlertOptions,
  AlertDialogConfirmOptions,
  AlertDialogPromptOptions,
} from './alert-dialog-manager';
