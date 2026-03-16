import { ElementBase } from '../ElementBase';
export declare class UIWizard extends ElementBase {
    static get observedAttributes(): string[];
    private _observer;
    private readonly _instanceId;
    private _isSyncingValueAttribute;
    private _stepButtons;
    private _progressEl;
    private _progressRow;
    private _statusStepEl;
    private _statusValueEl;
    private _prevBtn;
    private _nextBtn;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    get value(): string;
    set value(next: string);
    private _isBusy;
    private _steps;
    private _tabId;
    private _panelId;
    private _activeIndex;
    private _visualStatus;
    private _syncPanels;
    private _attemptChange;
    goTo(step: number | string): boolean;
    next(): boolean;
    prev(): boolean;
    private _onClick;
    private _onKeyDown;
    private _syncValueUi;
    protected render(): void;
}
//# sourceMappingURL=ui-wizard.d.ts.map