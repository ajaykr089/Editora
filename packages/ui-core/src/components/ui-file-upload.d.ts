import { ElementBase } from '../ElementBase';
type FileRejectReason = 'accept' | 'max-size' | 'max-files';
export type UIFileUploadRejectedFile = {
    file: File;
    reason: FileRejectReason;
};
export type UIFileUploadUploadState = 'pending' | 'uploading' | 'success' | 'error' | 'canceled';
export type UIFileUploadUploadContext = {
    file: File;
    files: File[];
    signal: AbortSignal;
    setProgress: (progress: number) => void;
};
export type UIFileUploadUploadRequest = (context: UIFileUploadUploadContext) => Promise<unknown> | unknown;
export declare class UIFileUpload extends ElementBase {
    static get observedAttributes(): string[];
    protected _files: File[];
    uploadRequest: UIFileUploadUploadRequest | null;
    private _formUnregister;
    private _surfaceEl;
    private _inputEl;
    private _listEl;
    private _errorEl;
    private _actionsEl;
    private _dragging;
    private _dragDepth;
    private _previewUrls;
    private _uploadState;
    private _uploadControllers;
    private _uploadSequence;
    constructor();
    get files(): File[];
    get uploading(): boolean;
    setFiles(files: File[]): void;
    openPicker(): void;
    clearFiles(): void;
    removeFile(index: number): void;
    startUpload(): Promise<void>;
    cancelUploads(): void;
    cancelUpload(fileOrKey: string | File): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    protected shouldRenderOnAttributeChange(): boolean;
    protected render(): void;
    protected _disabled(): boolean;
    protected _maxFiles(): number | null;
    protected _maxSize(): number | null;
    protected _appendFiles(inputFiles: File[], source: string): void;
    private _applyFiles;
    private _emit;
    private _fileKey;
    private _setUploadEntry;
    private _runUpload;
    private _parseProgress;
    private _statusLabel;
    private _actionSummary;
    private _getPreviewUrl;
    private _revokePreviewUrls;
    private _syncUi;
    private _registerWithForm;
    private _onClick;
    private _onKeyDown;
    private _onInputChange;
    private _onDragEnter;
    private _onDragLeave;
    private _onDragOver;
    private _onDrop;
}
declare global {
    interface HTMLElementTagNameMap {
        'ui-file-upload': UIFileUpload;
    }
}
export {};
//# sourceMappingURL=ui-file-upload.d.ts.map