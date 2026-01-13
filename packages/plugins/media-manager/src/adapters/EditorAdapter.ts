import { ImageAttrs, VideoAttrs } from '../types/media';

export interface EditorAdapter {
  insertImage(attrs: ImageAttrs): void;
  insertVideo(attrs: VideoAttrs): void;
  getSelection(): { from: number; to: number } | null;
  focus(): void;
  canInsert(nodeType: 'image' | 'video'): boolean;
}

export class RichTextEditorAdapter implements EditorAdapter {
  private contentElement: HTMLElement;

  constructor(contentElement: HTMLElement) {
    this.contentElement = contentElement;
  }

  insertImage(attrs: ImageAttrs): void {
    this.focus();
    const img = document.createElement('img');
    img.src = attrs.src;
    if (attrs.alt) img.alt = attrs.alt;
    if (attrs.title) img.title = attrs.title;
    if (attrs.width) img.width = attrs.width;
    if (attrs.height) img.height = attrs.height;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
      range.collapse(false);
    }
  }

  insertVideo(attrs: VideoAttrs): void {
    this.focus();
    const video = document.createElement('video');
    video.src = attrs.src;
    if (attrs.poster) video.poster = attrs.poster;
    if (attrs.width) video.width = attrs.width;
    if (attrs.height) video.height = attrs.height;
    video.controls = attrs.controls !== false;
    if (attrs.autoplay) video.autoplay = true;
    if (attrs.loop) video.loop = true;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(video);
      range.collapse(false);
    }
  }

  getSelection(): { from: number; to: number } | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    return {
      from: range.startOffset,
      to: range.endOffset
    };
  }

  focus(): void {
    this.contentElement.focus();
  }

  canInsert(nodeType: 'image' | 'video'): boolean {
    return true;
  }
}
