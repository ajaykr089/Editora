/**
 * Language Service Adapter Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import {
  CompletionProvider,
  EditorExtension,
  Formatter,
  LanguageServiceCodeActionsProvider,
  LanguageServiceDiagnosticsContext,
  LanguageServiceDiagnosticsProvider,
  LanguageServiceDocumentSnapshot,
  LanguageServiceHighlightContext,
  LanguageServiceHighlighter,
  LanguageServiceHoverProvider,
} from '../types';
import {
  CompletionExtension,
  CompletionExtensionConfig,
} from './CompletionExtension';
import {
  DiagnosticsExtension,
  DiagnosticsExtensionConfig,
} from './DiagnosticsExtension';
import {
  FormattingExtension,
  FormattingExtensionConfig,
} from './FormattingExtension';
import {
  HoverTooltipAndCodeActionsExtension,
  HoverTooltipAndCodeActionsExtensionConfig,
} from './HoverTooltipAndCodeActionsExtension';
import { SyntaxHighlightingExtension } from './SyntaxHighlightingExtension';
import { EditorAPI } from '../types';

export interface LanguageServiceAdapterConfig {
  languageId: string;
  highlight?: LanguageServiceHighlighter;
  diagnostics?: LanguageServiceDiagnosticsProvider;
  hover?: LanguageServiceHoverProvider;
  codeActions?: LanguageServiceCodeActionsProvider;
  completionProviders?: CompletionProvider[];
  formatter?: Formatter;
  diagnosticsDebounceMs?: number;
  diagnosticsConfig?: Omit<DiagnosticsExtensionConfig, 'diagnostics' | 'clearOnChange'>;
  completionConfig?: Omit<CompletionExtensionConfig, 'providers'>;
  formattingConfig?: Omit<FormattingExtensionConfig, 'formatter'>;
  hoverCodeActionsConfig?: Omit<
    HoverTooltipAndCodeActionsExtensionConfig,
    'languageId' | 'hoverProvider' | 'codeActionsProvider' | 'diagnostics'
  >;
}

export interface LanguageServiceExtensionBundle {
  extensions: EditorExtension[];
  languageServiceExtension: LanguageServiceExtension;
  syntaxHighlightingExtension?: SyntaxHighlightingExtension;
  diagnosticsExtension?: DiagnosticsExtension;
  completionExtension?: CompletionExtension;
  formattingExtension?: FormattingExtension;
  hoverCodeActionsExtension?: HoverTooltipAndCodeActionsExtension;
}

type LanguageServiceExtensionDependencies = {
  syntaxHighlightingExtension?: SyntaxHighlightingExtension;
  diagnosticsExtension?: DiagnosticsExtension;
};

type RequiredLanguageServiceAdapterConfig = {
  languageId: string;
  highlight?: LanguageServiceHighlighter;
  diagnostics?: LanguageServiceDiagnosticsProvider;
  hover?: LanguageServiceHoverProvider;
  codeActions?: LanguageServiceCodeActionsProvider;
  completionProviders: CompletionProvider[];
  formatter?: Formatter;
  diagnosticsDebounceMs: number;
  diagnosticsConfig?: Omit<DiagnosticsExtensionConfig, 'diagnostics' | 'clearOnChange'>;
  completionConfig?: Omit<CompletionExtensionConfig, 'providers'>;
  formattingConfig?: Omit<FormattingExtensionConfig, 'formatter'>;
  hoverCodeActionsConfig?: Omit<
    HoverTooltipAndCodeActionsExtensionConfig,
    'languageId' | 'hoverProvider' | 'codeActionsProvider' | 'diagnostics'
  >;
};

export class LanguageServiceExtension implements EditorExtension {
  public readonly name = 'language-service';

  private editor: EditorAPI | null = null;
  private documentVersion = 0;
  private diagnosticsRefreshTimer: ReturnType<typeof setTimeout> | null = null;
  private diagnosticsRequestSequence = 0;
  private activeDiagnosticsAbortController: AbortController | null = null;
  private changeHandler: (() => void) | null = null;
  private readonly config: RequiredLanguageServiceAdapterConfig;
  private readonly dependencies: LanguageServiceExtensionDependencies;

  constructor(
    config: LanguageServiceAdapterConfig,
    dependencies: LanguageServiceExtensionDependencies = {},
  ) {
    this.config = {
      languageId: config.languageId.trim() || 'text',
      highlight: config.highlight,
      diagnostics: config.diagnostics,
      hover: config.hover,
      codeActions: config.codeActions,
      completionProviders: config.completionProviders || [],
      formatter: config.formatter,
      diagnosticsDebounceMs: Math.max(
        0,
        Math.floor(config.diagnosticsDebounceMs ?? 180),
      ),
      diagnosticsConfig: config.diagnosticsConfig,
      completionConfig: config.completionConfig,
      formattingConfig: config.formattingConfig,
      hoverCodeActionsConfig: config.hoverCodeActionsConfig,
    };
    this.dependencies = dependencies;
  }

  setup(editor: EditorAPI): void {
    this.editor = editor;

    editor.registerCommand('refreshLanguageDiagnostics', () => {
      void this.refreshDiagnosticsNow();
    });

    if (
      this.dependencies.syntaxHighlightingExtension &&
      this.config.highlight
    ) {
      const syntaxExtension = this.dependencies.syntaxHighlightingExtension;
      syntaxExtension.registerMode(this.config.languageId, {
        name: this.config.languageId,
        highlight: (src, colors) =>
          this.config.highlight?.({
            ...this.buildSnapshot(src),
            theme: editor.getState().theme,
            colors,
          }) || src,
      });
      syntaxExtension.setLanguage(this.config.languageId);
    }

    if (this.dependencies.diagnosticsExtension && this.config.diagnostics) {
      this.changeHandler = () => {
        this.documentVersion += 1;
        this.scheduleDiagnosticsRefresh();
      };
      editor.on('change', this.changeHandler);
      void this.refreshDiagnosticsNow();
    }
  }

  private scheduleDiagnosticsRefresh(): void {
    if (!this.config.diagnostics || !this.dependencies.diagnosticsExtension) {
      return;
    }

    if (this.diagnosticsRefreshTimer) {
      clearTimeout(this.diagnosticsRefreshTimer);
    }

    this.diagnosticsRefreshTimer = setTimeout(() => {
      this.diagnosticsRefreshTimer = null;
      void this.refreshDiagnosticsNow();
    }, this.config.diagnosticsDebounceMs);
  }

  private async refreshDiagnosticsNow(): Promise<void> {
    const editor = this.editor;
    const diagnosticsProvider = this.config.diagnostics;
    const diagnosticsExtension = this.dependencies.diagnosticsExtension;
    if (!editor || !diagnosticsProvider || !diagnosticsExtension) {
      return;
    }

    const requestId = ++this.diagnosticsRequestSequence;
    if (this.activeDiagnosticsAbortController) {
      this.activeDiagnosticsAbortController.abort();
    }

    const controller = new AbortController();
    this.activeDiagnosticsAbortController = controller;

    try {
      const diagnostics = await diagnosticsProvider({
        ...this.buildSnapshot(),
        abortSignal: controller.signal,
      });

      if (
        requestId !== this.diagnosticsRequestSequence ||
        this.activeDiagnosticsAbortController !== controller
      ) {
        return;
      }

      diagnosticsExtension.setDiagnostics(
        Array.isArray(diagnostics) ? diagnostics : [],
      );
    } catch (error) {
      if (
        requestId !== this.diagnosticsRequestSequence ||
        controller.signal.aborted
      ) {
        return;
      }

      diagnosticsExtension.clearDiagnostics();
      console.warn('Language service diagnostics refresh failed', error);
    } finally {
      if (this.activeDiagnosticsAbortController === controller) {
        this.activeDiagnosticsAbortController = null;
      }
    }
  }

  private buildSnapshot(textOverride?: string): LanguageServiceDocumentSnapshot {
    const editor = this.editor;
    if (!editor) {
      throw new Error('LanguageServiceExtension requires an editor instance.');
    }

    return {
      editor,
      languageId: this.config.languageId,
      version: this.documentVersion,
      text: typeof textOverride === 'string' ? textOverride : editor.getValue(),
      cursor: editor.getCursor(),
      selection: editor.getSelection(),
    };
  }

  destroy(): void {
    if (this.diagnosticsRefreshTimer) {
      clearTimeout(this.diagnosticsRefreshTimer);
      this.diagnosticsRefreshTimer = null;
    }

    if (this.activeDiagnosticsAbortController) {
      this.activeDiagnosticsAbortController.abort();
      this.activeDiagnosticsAbortController = null;
    }

    if (this.editor && this.changeHandler) {
      this.editor.off('change', this.changeHandler);
    }

    this.changeHandler = null;
    this.editor = null;
  }
}

export function createLanguageServiceExtensions(
  config: LanguageServiceAdapterConfig,
): LanguageServiceExtensionBundle {
  const extensions: EditorExtension[] = [];

  const syntaxHighlightingExtension = config.highlight
    ? new SyntaxHighlightingExtension()
    : undefined;
  if (syntaxHighlightingExtension) {
    extensions.push(syntaxHighlightingExtension);
  }

  const diagnosticsExtension = config.diagnostics
    ? new DiagnosticsExtension({
      diagnostics: [],
      clearOnChange: false,
      showStatusBar: true,
      ...(config.diagnosticsConfig || {}),
    })
    : undefined;
  if (diagnosticsExtension) {
    extensions.push(diagnosticsExtension);
  }

  const completionExtension =
    config.completionProviders && config.completionProviders.length > 0
      ? new CompletionExtension({
        providers: config.completionProviders,
        ...(config.completionConfig || {}),
      })
      : undefined;
  if (completionExtension) {
    extensions.push(completionExtension);
  }

  const formattingExtension = config.formatter
    ? new FormattingExtension({
      formatter: config.formatter,
      ...(config.formattingConfig || {}),
    })
    : undefined;
  if (formattingExtension) {
    extensions.push(formattingExtension);
  }

  const hoverCodeActionsExtension =
    config.hover || config.codeActions
      ? new HoverTooltipAndCodeActionsExtension({
        languageId: config.languageId,
        hoverProvider: config.hover,
        codeActionsProvider: config.codeActions,
        diagnostics: () => diagnosticsExtension?.getDiagnostics() || [],
        ...(config.hoverCodeActionsConfig || {}),
      })
      : undefined;
  if (hoverCodeActionsExtension) {
    extensions.push(hoverCodeActionsExtension);
  }

  const languageServiceExtension = new LanguageServiceExtension(config, {
    syntaxHighlightingExtension,
    diagnosticsExtension,
  });
  extensions.push(languageServiceExtension);

  return {
    extensions,
    languageServiceExtension,
    syntaxHighlightingExtension,
    diagnosticsExtension,
    completionExtension,
    formattingExtension,
    hoverCodeActionsExtension,
  };
}
