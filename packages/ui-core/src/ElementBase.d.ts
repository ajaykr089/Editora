export declare abstract class ElementBase extends HTMLElement {
    protected root: ShadowRoot;
    private _isRendering;
    private _renderRequested;
    private _renderScheduled;
    private _hasRendered;
    private _visibilityGuardApplied;
    private _lastRenderedContent;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void;
    protected shouldRenderOnAttributeChange(_name: string, _oldValue: string | null, _newValue: string | null): boolean;
    protected setContent(html: string, options?: {
        force?: boolean;
    }): void;
    protected invalidateContentCache(): void;
    protected requestRender(): void;
    private _scheduleRender;
    private _requestRender;
    protected abstract render(): void;
}
//# sourceMappingURL=ElementBase.d.ts.map