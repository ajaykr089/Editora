export type MediaUploadErrorCode =
  | 'too-large'
  | 'type-not-allowed'
  | 'aborted'
  | 'network'
  | 'server'
  | 'invalid-response';

/** An upload that did not complete, with a code to act on and a message fit to show a person. */
export class MediaUploadError extends Error {
  readonly code: MediaUploadErrorCode;
  readonly status?: number;

  constructor(code: MediaUploadErrorCode, message: string, status?: number) {
    super(message);
    this.name = code === 'aborted' ? 'AbortError' : 'MediaUploadError';
    this.code = code;
    this.status = status;
  }
}

export const isAbort = (error: unknown): boolean =>
  error instanceof Error && (error.name === 'AbortError' || (error as MediaUploadError).code === 'aborted');
