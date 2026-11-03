// Headless core: plain text and logs, in the browser or on a server.
export { AuthorshipEngine } from './core/engine';
export type { EngineOptions, UpdateOptions, ChangeRecord, Fragment, Piece } from './core/engine';
export { diffText, applyEdits } from './core/diff';
export type { TextEdit } from './core/diff';
export { runsLength, sliceRuns, spliceRuns, normalizeRuns, originIdAt, scaleRuns } from './core/runs';
export { buildReport, sessionsFromEvents } from './core/report';
export type { AuthorshipReport, ReportOptions, KindTotal, OriginTotal, WritingSession } from './core/report';
export { createReplay } from './core/replay';
export type { Replay, ReplayFrame } from './core/replay';
export { sealBatch, verifyAuthorship, baseHash, batchHash } from './core/chain';
export type { VerifyOptions, VerifyResult } from './core/chain';
export { textHash, canonicalJson } from './core/hash';
export { ORIGIN_KINDS } from './core/types';
export type {
  OriginKind,
  Origin,
  OriginSpec,
  Run,
  ChangeCause,
  LogEvent,
  LogBase,
  LogBatch,
  AuthorshipLog,
  AuthorshipState,
  WitnessReceipt,
} from './core/types';

// Any contenteditable element.
export { attachAuthorship, announceProvenance, PROVENANCE_ATTR, EXPECT_EVENT } from './dom/attach';
export type { AttachAuthorshipOptions, AuthorshipController, AuthorshipChange, ExpectOptions, WitnessOptions } from './dom/attach';
export { buildDocMap, rangeFor, offsetOfPoint, offsetsOfRange } from './dom/text';
export type { DocMap, TextSegment } from './dom/text';
export { detectPasteSource } from './dom/detect';
export type { PasteSource, PasteInfo } from './dom/detect';

// UI: highlights, summary panel, replay dialog.
export { createHighlighter } from './dom/highlight';
export type { Highlighter, HighlighterOptions } from './dom/highlight';
export { createAuthorshipPanel } from './dom/panel';
export type { AuthorshipPanel, PanelOptions } from './dom/panel';
export { openReplayView } from './dom/replay-view';
export type { ReplayView, ReplayViewOptions } from './dom/replay-view';
export { DEFAULT_LABELS, describeOrigin, mergeLabels } from './dom/labels';
export type { AuthorshipLabels } from './dom/labels';

// Export: annotated HTML, embedded JSON, IPTC terms.
export { toAnnotatedHtml, embedState, readEmbeddedState, digitalSourceType, documentSourceType, IPTC_DIGITAL_SOURCE_TYPE, EMBED_TYPE } from './dom/export';
export type { AnnotateOptions } from './dom/export';
