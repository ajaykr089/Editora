import { ElementBase } from '../ElementBase';
import { announce, type AnnouncePoliteness } from '../announce';

/**
 * Announces its text to screen readers whenever the text changes, without showing anything.
 *
 *   <ui-announcer>{{ resultCount }} results</ui-announcer>
 *   <ui-announcer politeness="assertive">Upload failed</ui-announcer>
 *
 * Declarative form of `announce()`: the text is sent to the page's shared live regions (see
 * announce.ts), which every screen reader picks up, rather than making this element a live region
 * inside a shadow root. The text present when the element connects is announced too; set `quiet`
 * to only announce later changes. Inside an open modal <dialog> the message stays inside it.
 * `politeness`: polite (default) | assertive | off.
 */
export class UIAnnouncer extends ElementBase {
  static get observedAttributes() {
    return ['politeness'];
  }

  private observer: MutationObserver | null = null;
  private lastText = '';

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.observer && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.announceText());
      this.observer.observe(this, { childList: true, characterData: true, subtree: true });
    }
    if (this.hasAttribute('quiet')) this.lastText = this.currentText();
    else this.announceText();
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.lastText = '';
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  private currentText(): string {
    return (this.textContent || '').replace(/\s+/g, ' ').trim();
  }

  private announceText(): void {
    const text = this.currentText();
    if (!text || text === this.lastText) {
      this.lastText = text;
      return;
    }
    this.lastText = text;
    const politeness = this.getAttribute('politeness');
    if (politeness === 'off') return;
    announce(text, {
      politeness: (politeness === 'assertive' ? 'assertive' : 'polite') as AnnouncePoliteness,
      within: this.closest('dialog[open]'),
    });
  }

  protected override render(): void {
    // Nothing visible: the text is spoken, not shown.
    this.setContent('<style>:host{display:none !important}</style>');
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-announcer')) {
  customElements.define('ui-announcer', UIAnnouncer);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-announcer': UIAnnouncer;
  }
}
