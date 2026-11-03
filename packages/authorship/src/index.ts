// Headless core: plain text and logs, in the browser or on a server.
export { AuthorshipEngine } from './core/engine.js';
export type { EngineOptions, UpdateOptions, ChangeRecord, Fragment, Piece } from './core/engine.js';
export { diffText, applyEdits } from './core/diff.js';
export type { TextEdit } from './core/diff.js';
export { runsLength, sliceRuns, spliceRuns, normalizeRuns, originIdAt, scaleRuns } from './core/runs.js';
export { buildReport, sessionsFromEvents } from './core/report.js';
export type { AuthorshipReport, ReportOptions, KindTotal, OriginTotal, WritingSession } from './core/report.js';
export { createReplay } from './core/replay.js';
export type { Replay, ReplayFrame } from './core/replay.js';
export { sealBatch, verifyAuthorship, baseHash, batchHash } from './core/chain.js';
export type { VerifyOptions, VerifyResult } from './core/chain.js';
export { textHash, canonicalJson } from './core/hash.js';
export { ORIGIN_KINDS } from './core/types.js';
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
} from './core/types.js';

// Any contenteditable element.
export { attachAuthorship, announceProvenance, PROVENANCE_ATTR, EXPECT_EVENT } from './dom/attach.js';
export type { AttachAuthorshipOptions, AuthorshipController, AuthorshipChange, ExpectOptions, WitnessOptions } from './dom/attach.js';
export { buildDocMap, createDocMapper, rangeFor, offsetOfPoint, offsetsOfRange } from './dom/text.js';
export type { DocMap, DocMapper, TextSegment } from './dom/text.js';
export { detectPasteSource } from './dom/detect.js';
export type { PasteSource, PasteInfo } from './dom/detect.js';

// UI: highlights, summary panel, replay dialog.
export { createHighlighter } from './dom/highlight.js';
export type { Highlighter, HighlighterOptions } from './dom/highlight.js';
export { createAuthorshipPanel } from './dom/panel.js';
export type { AuthorshipPanel, PanelOptions } from './dom/panel.js';
export { openReplayView } from './dom/replay-view.js';
export type { ReplayView, ReplayViewOptions } from './dom/replay-view.js';
export { DEFAULT_LABELS, describeOrigin, mergeLabels } from './dom/labels.js';
export type { AuthorshipLabels } from './dom/labels.js';

// Export: annotated HTML, embedded JSON, IPTC terms.
export { toAnnotatedHtml, embedState, readEmbeddedState, digitalSourceType, documentSourceType, IPTC_DIGITAL_SOURCE_TYPE, EMBED_TYPE } from './dom/export.js';
export type { AnnotateOptions } from './dom/export.js';
