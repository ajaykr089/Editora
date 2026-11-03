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
