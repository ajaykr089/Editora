import { Plugin } from '@editora/core';

/**
 * Media Manager Plugin - Native Implementation
 * 
 * Features:
 * - Insert images and videos with full dialog UI
 * - Drag & drop file upload
 * - URL input with dimensions
 * - Inline resize handles (drag corners to resize)
 * - Floating toolbar on image selection
 * - Link images
 */

let savedSelection: Range | null = null;
let selectedMedia: HTMLImageElement | HTMLVideoElement | null = null;
let floatingToolbar: HTMLDivElement | null = null;
let resizeHandles: HTMLDivElement[] = [];
let isResizing = false;
let currentHandle: string | null = null;
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let aspectRatio = 1;
let editorElement: HTMLElement | null = null; // Editor instance context

declare global {
  interface Window {
    __mediaManagerInitialized?: boolean;
  }
}

const showMediaDialog = (type: 'image' | 'video') => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedSelection = selection.getRangeAt(0).cloneRange();
  }

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 99999;';

  const dialog = document.createElement('div');
  dialog.style.cssText = 'background: white; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);';

  let activeTab: 'upload' | 'url' = 'upload';
  let urlValue = '';
  let widthValue = '';
  let heightValue = '';
  let altValue = '';

  const renderDialog = () => {
    dialog.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e1e5e9; background: #f8f9fa;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Insert ${type === 'image' ? 'Image' : 'Video'}</h2>
        <button class="close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #6c757d; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
      </div>

      <div class="tabs" style="display: flex; border-bottom: 1px solid #e1e5e9;">
        <button class="tab-upload" style="flex: 1; padding: 12px; border: none; background: ${activeTab === 'upload' ? '#007bff' : '#f8f9fa'}; color: ${activeTab === 'upload' ? 'white' : '#495057'}; cursor: pointer; font-weight: 500;">📤 Upload</button>
        <button class="tab-url" style="flex: 1; padding: 12px; border: none; background: ${activeTab === 'url' ? '#007bff' : '#f8f9fa'}; color: ${activeTab === 'url' ? 'white' : '#495057'}; cursor: pointer; font-weight: 500;">🔗 URL</button>
      </div>

      <div style="padding: 20px; overflow-y: auto; flex: 1;">
        ${activeTab === 'upload' ? `
          <div id="upload-section">
            <div class="dropzone" style="border: 2px dashed #ced4da; border-radius: 8px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.3s;">
              <div style="font-size: 48px; margin-bottom: 10px;">📁</div>
              <p style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px;">Drag and drop your ${type} here</p>
              <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px;">or click to browse</p>
              <p style="margin: 0; color: #6c757d; font-size: 12px;">Max file size: 50MB</p>
            </div>
            <input type="file" id="file-input" accept="${type === 'image' ? 'image/*' : 'video/*'}" style="display: none;">
            <div id="upload-progress" style="display: none; margin-top: 20px;">
              <div style="background: #e9ecef; border-radius: 4px; height: 8px; overflow: hidden;">
                <div id="progress-bar" style="background: #007bff; height: 100%; width: 0%; transition: width 0.3s;"></div>
              </div>
              <p id="progress-text" style="margin-top: 8px; text-align: center; color: #6c757d; font-size: 14px;">Uploading...</p>
            </div>
          </div>
        ` : `
          <div id="url-section">
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">URL:</label>
              <input type="text" id="url-input" placeholder="https://example.com/${type}.${type === 'image' ? 'jpg' : 'mp4'}" value="${urlValue}" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
            </div>
            ${type === 'image' ? `
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Alt Text (for accessibility):</label>
                <input type="text" id="alt-input" placeholder="Describe the image" value="${altValue}" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
              </div>
            ` : ''}
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
              <div>
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Width (px):</label>
                <input type="number" id="width-input" placeholder="Auto" value="${widthValue}" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
              </div>
              <div>
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Height (px):</label>
                <input type="number" id="height-input" placeholder="Auto" value="${heightValue}" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
              </div>
            </div>
            ${urlValue ? `
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Preview:</label>
                <div style="border: 1px solid #dee2e6; border-radius: 4px; padding: 10px; background: #f8f9fa; text-align: center;">
                  ${type === 'image' ? `<img src="${urlValue}" alt="Preview" style="max-width: 100%; max-height: 200px;">` : `<video src="${urlValue}" controls style="max-width: 100%; max-height: 200px;"></video>`}
                </div>
              </div>
            ` : ''}
          </div>
        `}
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 1px solid #e1e5e9; background: #f8f9fa;">
        <button class="cancel-btn" style="padding: 10px 20px; background: #fff; border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; font-size: 14px;">Cancel</button>
        <button id="insert-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" ${!urlValue && activeTab === 'url' ? 'disabled' : ''}>Insert</button>
      </div>
    `;
  };

  renderDialog();
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const closeDialog = () => document.body.removeChild(overlay);

  const insertMedia = () => {
    if (!urlValue) return;

    const mediaEl = type === 'image' ? document.createElement('img') : document.createElement('video');
    mediaEl.src = urlValue;
    mediaEl.setAttribute('data-media-type', type);
    
    if (type === 'image' && altValue) {
      (mediaEl as HTMLImageElement).alt = altValue;
    }
    if (widthValue) {
      mediaEl.style.width = `${widthValue}px`;
      mediaEl.setAttribute('width', widthValue);
    }
    if (heightValue) {
      mediaEl.style.height = `${heightValue}px`;
      mediaEl.setAttribute('height', heightValue);
    }
    
    if (type === 'video') {
      (mediaEl as HTMLVideoElement).controls = true;
    }

    if (!widthValue && !heightValue) {
      mediaEl.style.cssText = 'max-width: 100%; height: auto; display: block; margin: 1em 0; cursor: pointer;';
    } else {
      mediaEl.style.cssText = `display: block; margin: 1em 0; cursor: pointer; ${widthValue ? `width: ${widthValue}px;` : 'max-width: 100%;'} ${heightValue ? `height: ${heightValue}px;` : 'height: auto;'}`;
    }
    
    if (savedSelection) {
      savedSelection.deleteContents();
      savedSelection.insertNode(mediaEl);
    }

    closeDialog();
  };

  const handleFileUpload = async (file: File) => {
    const progressDiv = dialog.querySelector('#upload-progress') as HTMLDivElement;
    const progressBar = dialog.querySelector('#progress-bar') as HTMLDivElement;
    const progressText = dialog.querySelector('#progress-text') as HTMLParagraphElement;

    if (progressDiv && progressBar && progressText) {
      progressDiv.style.display = 'block';

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;
        progressBar.style.width = `${progress}%`;
      }, 200);

      try {
        const reader = new FileReader();
        reader.onload = () => {
          clearInterval(interval);
          progressBar.style.width = '100%';
          progressText.textContent = '✅ Upload complete';
          
          setTimeout(() => {
            urlValue = reader.result as string;
            activeTab = 'url';
            renderDialog();
            attachEventHandlers();
          }, 500);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        clearInterval(interval);
        progressText.textContent = '❌ Upload failed';
      }
    }
  };

  const attachEventHandlers = () => {
    const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
    const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
    const insertBtn = dialog.querySelector('#insert-btn') as HTMLButtonElement;
    const tabUpload = dialog.querySelector('.tab-upload') as HTMLButtonElement;
    const tabUrl = dialog.querySelector('.tab-url') as HTMLButtonElement;

    closeBtn?.addEventListener('click', closeDialog);
    cancelBtn?.addEventListener('click', closeDialog);
    insertBtn?.addEventListener('click', insertMedia);

    tabUpload?.addEventListener('click', () => {
      activeTab = 'upload';
      renderDialog();
      attachEventHandlers();
    });

    tabUrl?.addEventListener('click', () => {
      activeTab = 'url';
      renderDialog();
      attachEventHandlers();
    });

    if (activeTab === 'upload') {
      const dropzone = dialog.querySelector('.dropzone') as HTMLDivElement;
      const fileInput = dialog.querySelector('#file-input') as HTMLInputElement;

      dropzone?.addEventListener('click', () => fileInput?.click());
      
      dropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#007bff';
        dropzone.style.background = '#f0f8ff';
      });

      dropzone?.addEventListener('dragleave', () => {
        dropzone.style.borderColor = '#ced4da';
        dropzone.style.background = 'transparent';
      });

      dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#ced4da';
        dropzone.style.background = 'transparent';
        const file = e.dataTransfer?.files[0];
        if (file) handleFileUpload(file);
      });

      fileInput?.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleFileUpload(file);
      });
    }

    if (activeTab === 'url') {
      const urlInput = dialog.querySelector('#url-input') as HTMLInputElement;
      const altInput = dialog.querySelector('#alt-input') as HTMLInputElement;
      const widthInput = dialog.querySelector('#width-input') as HTMLInputElement;
      const heightInput = dialog.querySelector('#height-input') as HTMLInputElement;

      urlInput?.addEventListener('input', () => {
        urlValue = urlInput.value;
        renderDialog();
        attachEventHandlers();
      });

      altInput?.addEventListener('input', () => {
        altValue = altInput.value;
      });

      widthInput?.addEventListener('input', () => {
        widthValue = widthInput.value;
      });

      heightInput?.addEventListener('input', () => {
        heightValue = heightInput.value;
      });
    }
  };

  attachEventHandlers();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
};

// Create resize handles
const createResizeHandles = () => {
  const positions = ['nw', 'ne', 'sw', 'se'];
  positions.forEach(pos => {
    const handle = document.createElement('div');
    handle.className = `media-resize-handle-${pos}`;
    handle.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: #007bff;
      border: 2px solid white;
      border-radius: 50%;
      cursor: ${pos}-resize;
      z-index: 10001;
      display: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    `;
    handle.setAttribute('data-position', pos);
    document.body.appendChild(handle);
    resizeHandles.push(handle);
  });
};

// Update resize handle positions
const updateResizeHandles = () => {
  if (!selectedMedia) {
    resizeHandles.forEach(h => h.style.display = 'none');
    return;
  }

  const rect = selectedMedia.getBoundingClientRect();
  const positions = {
    nw: { x: rect.left - 5, y: rect.top - 5 },
    ne: { x: rect.right - 5, y: rect.top - 5 },
    sw: { x: rect.left - 5, y: rect.bottom - 5 },
    se: { x: rect.right - 5, y: rect.bottom - 5 }
  };

  resizeHandles.forEach(handle => {
    const pos = handle.getAttribute('data-position') as keyof typeof positions;
    const coord = positions[pos];
    handle.style.left = `${coord.x}px`;
    handle.style.top = `${coord.y}px`;
    handle.style.display = 'block';
  });
};

// Show Alt Text dialog
const showAltTextDialog = (img: HTMLImageElement) => {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 10001;';

  const dialog = document.createElement('div');
  dialog.style.cssText = 'background: white; border-radius: 8px; width: 90%; max-width: 500px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);';

  dialog.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e1e5e9; background: #f8f9fa;">
      <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Edit Alt Text</h2>
      <button class="close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #6c757d; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
    </div>
    <div style="padding: 20px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 500;">Alternative Text (for accessibility):</label>
      <textarea id="alt-text-input" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px; min-height: 80px; font-family: inherit; resize: vertical;" placeholder="Describe the image for screen readers...">${img.alt || ''}</textarea>
      <p style="margin-top: 8px; margin-bottom: 0; font-size: 12px; color: #6c757d;">Good alt text is descriptive and concise. It helps users with visual impairments understand your content.</p>
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 1px solid #e1e5e9; background: #f8f9fa;">
      <button class="cancel-btn" style="padding: 10px 20px; background: #fff; border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; font-size: 14px;">Cancel</button>
      <button class="save-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Save</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const input = dialog.querySelector('#alt-text-input') as HTMLTextAreaElement;
  const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
  const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
  const saveBtn = dialog.querySelector('.save-btn') as HTMLButtonElement;

  const closeDialog = () => document.body.removeChild(overlay);

  closeBtn.addEventListener('click', closeDialog);
  cancelBtn.addEventListener('click', closeDialog);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });

  saveBtn.addEventListener('click', () => {
    img.alt = input.value;
    closeDialog();
  });

  input.focus();
  input.select();
};

// Show Link dialog for media
const showLinkDialogForMedia = (media: HTMLImageElement | HTMLVideoElement) => {
  const existingLink = (media as HTMLElement).closest('a');
  const currentHref = existingLink?.getAttribute('href') || '';
  const currentTarget = existingLink?.getAttribute('target') || '_self';
  const currentTitle = existingLink?.getAttribute('title') || '';

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 10001;';

  const dialog = document.createElement('div');
  dialog.style.cssText = 'background: white; border-radius: 8px; width: 90%; max-width: 500px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);';

  dialog.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e1e5e9; background: #f8f9fa;">
      <h2 style="margin: 0; font-size: 18px; font-weight: 600;">${existingLink ? 'Edit Link' : 'Add Link'}</h2>
      <button class="close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #6c757d; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
    </div>
    <div style="padding: 20px;">
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 6px; font-weight: 500;">URL:</label>
        <input id="link-url" type="url" value="${currentHref}" placeholder="https://example.com" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;" />
      </div>
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 6px; font-weight: 500;">Title (tooltip):</label>
        <input id="link-title" type="text" value="${currentTitle}" placeholder="Optional tooltip text" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;" />
      </div>
      <div>
        <label style="display: flex; align-items: center; cursor: pointer;">
          <input id="link-target" type="checkbox" ${currentTarget === '_blank' ? 'checked' : ''} style="margin-right: 8px;" />
          Open in new window/tab
        </label>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 16px 20px; border-top: 1px solid #e1e5e9; background: #f8f9fa;">
      ${existingLink ? '<button class="remove-link-btn" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Remove Link</button>' : '<span></span>'}
      <div style="display: flex; gap: 10px;">
        <button class="cancel-btn" style="padding: 10px 20px; background: #fff; border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; font-size: 14px;">Cancel</button>
        <button class="save-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Save</button>
      </div>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const urlInput = dialog.querySelector('#link-url') as HTMLInputElement;
  const titleInput = dialog.querySelector('#link-title') as HTMLInputElement;
  const targetCheckbox = dialog.querySelector('#link-target') as HTMLInputElement;
  const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
  const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
  const saveBtn = dialog.querySelector('.save-btn') as HTMLButtonElement;
  const removeLinkBtn = dialog.querySelector('.remove-link-btn') as HTMLButtonElement;

  const closeDialog = () => document.body.removeChild(overlay);

  closeBtn.addEventListener('click', closeDialog);
  cancelBtn.addEventListener('click', closeDialog);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });

  saveBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) {
      const normalized = url.startsWith('http') ? url : `https://${url}`;
      
      if (existingLink) {
        existingLink.setAttribute('href', normalized);
        existingLink.setAttribute('target', targetCheckbox.checked ? '_blank' : '_self');
        if (targetCheckbox.checked) {
          existingLink.setAttribute('rel', 'noopener noreferrer');
        } else {
          existingLink.removeAttribute('rel');
        }
        if (titleInput.value.trim()) {
          existingLink.setAttribute('title', titleInput.value.trim());
        } else {
          existingLink.removeAttribute('title');
        }
      } else {
        const link = document.createElement('a');
        link.href = normalized;
        link.target = targetCheckbox.checked ? '_blank' : '_self';
        if (targetCheckbox.checked) {
          link.rel = 'noopener noreferrer';
        }
        if (titleInput.value.trim()) {
          link.title = titleInput.value.trim();
        }
        media.replaceWith(link);
        link.appendChild(media);
      }
      
      closeDialog();
      
      // Update toolbar to reflect link state
      if (floatingToolbar && selectedMedia) {
        showFloatingToolbar(selectedMedia);
      }
    }
  });

  removeLinkBtn?.addEventListener('click', () => {
    if (existingLink && confirm('Remove link from this media?')) {
      existingLink.replaceWith(media);
      closeDialog();
      
      // Update toolbar
      if (floatingToolbar && selectedMedia) {
        showFloatingToolbar(selectedMedia);
      }
    }
  });

  urlInput.focus();
};

// Show Replace Image dialog
const showReplaceImageDialog = (img: HTMLImageElement) => {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 10001;';

  const dialog = document.createElement('div');
  dialog.style.cssText = 'background: white; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);';

  let activeTab: 'upload' | 'url' = 'url';
  let urlValue = img.src;

  const renderDialog = () => {
    dialog.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e1e5e9; background: #f8f9fa;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Replace Image</h2>
        <button class="close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #6c757d; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
      </div>

      <div class="tabs" style="display: flex; border-bottom: 1px solid #e1e5e9;">
        <button class="tab-upload" style="flex: 1; padding: 12px; border: none; background: ${activeTab === 'upload' ? '#007bff' : '#f8f9fa'}; color: ${activeTab === 'upload' ? 'white' : '#495057'}; cursor: pointer; font-weight: 500;">📤 Upload</button>
        <button class="tab-url" style="flex: 1; padding: 12px; border: none; background: ${activeTab === 'url' ? '#007bff' : '#f8f9fa'}; color: ${activeTab === 'url' ? 'white' : '#495057'}; cursor: pointer; font-weight: 500;">🔗 URL</button>
      </div>

      <div style="padding: 20px; overflow-y: auto; flex: 1;">
        ${activeTab === 'upload' ? `
          <div id="upload-section">
            <div class="dropzone" style="border: 2px dashed #ced4da; border-radius: 8px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.3s;">
              <div style="font-size: 48px; margin-bottom: 10px;">📁</div>
              <p style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px;">Drag and drop your image here</p>
              <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px;">or click to browse</p>
            </div>
            <input type="file" id="file-input" accept="image/*" style="display: none;">
            <div id="upload-progress" style="display: none; margin-top: 20px;">
              <div style="background: #e9ecef; border-radius: 4px; height: 8px; overflow: hidden;">
                <div id="progress-bar" style="background: #007bff; height: 100%; width: 0%; transition: width 0.3s;"></div>
              </div>
              <p id="progress-text" style="margin-top: 8px; text-align: center; color: #6c757d; font-size: 14px;">Uploading...</p>
            </div>
          </div>
        ` : `
          <div id="url-section">
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Image URL:</label>
              <input type="text" id="url-input" placeholder="https://example.com/image.jpg" value="${urlValue}" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
            </div>
            ${urlValue ? `
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Preview:</label>
                <div style="border: 1px solid #dee2e6; border-radius: 4px; padding: 10px; background: #f8f9fa; text-align: center;">
                  <img src="${urlValue}" alt="Preview" style="max-width: 100%; max-height: 300px;" onerror="this.parentElement.innerHTML='<p style=&quot;color: #dc3545;&quot;>Failed to load image</p>'">
                </div>
              </div>
            ` : ''}
          </div>
        `}
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 1px solid #e1e5e9; background: #f8f9fa;">
        <button class="cancel-btn" style="padding: 10px 20px; background: #fff; border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; font-size: 14px;">Cancel</button>
        <button id="replace-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" ${!urlValue && activeTab === 'url' ? 'disabled' : ''}>Replace</button>
      </div>
    `;
  };

  renderDialog();
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const closeDialog = () => document.body.removeChild(overlay);

  const replaceImage = () => {
    if (urlValue) {
      img.src = urlValue;
      closeDialog();
    }
  };

  const handleFileUpload = async (file: File) => {
    const progressDiv = dialog.querySelector('#upload-progress') as HTMLDivElement;
    const progressBar = dialog.querySelector('#progress-bar') as HTMLDivElement;
    const progressText = dialog.querySelector('#progress-text') as HTMLParagraphElement;

    if (progressDiv && progressBar && progressText) {
      progressDiv.style.display = 'block';

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;
        progressBar.style.width = `${progress}%`;
      }, 200);

      try {
        const reader = new FileReader();
        reader.onload = () => {
          clearInterval(interval);
          progressBar.style.width = '100%';
          progressText.textContent = '✅ Upload complete';
          
          setTimeout(() => {
            urlValue = reader.result as string;
            activeTab = 'url';
            renderDialog();
            attachEventHandlers();
          }, 500);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        clearInterval(interval);
        progressText.textContent = '❌ Upload failed';
      }
    }
  };

  const attachEventHandlers = () => {
    const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
    const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
    const replaceBtn = dialog.querySelector('#replace-btn') as HTMLButtonElement;
    const tabUpload = dialog.querySelector('.tab-upload') as HTMLButtonElement;
    const tabUrl = dialog.querySelector('.tab-url') as HTMLButtonElement;

    closeBtn?.addEventListener('click', closeDialog);
    cancelBtn?.addEventListener('click', closeDialog);
    replaceBtn?.addEventListener('click', replaceImage);

    tabUpload?.addEventListener('click', () => {
      activeTab = 'upload';
      renderDialog();
      attachEventHandlers();
    });

    tabUrl?.addEventListener('click', () => {
      activeTab = 'url';
      renderDialog();
      attachEventHandlers();
    });

    if (activeTab === 'upload') {
      const dropzone = dialog.querySelector('.dropzone') as HTMLDivElement;
      const fileInput = dialog.querySelector('#file-input') as HTMLInputElement;

      dropzone?.addEventListener('click', () => fileInput?.click());
      
      dropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#007bff';
        dropzone.style.background = '#f0f8ff';
      });

      dropzone?.addEventListener('dragleave', () => {
        dropzone.style.borderColor = '#ced4da';
        dropzone.style.background = 'transparent';
      });

      dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#ced4da';
        dropzone.style.background = 'transparent';
        const file = e.dataTransfer?.files[0];
        if (file) handleFileUpload(file);
      });

      fileInput?.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleFileUpload(file);
      });
    }

    if (activeTab === 'url') {
      const urlInput = dialog.querySelector('#url-input') as HTMLInputElement;

      urlInput?.addEventListener('input', () => {
        urlValue = urlInput.value;
        renderDialog();
        attachEventHandlers();
      });
    }
  };

  attachEventHandlers();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
};

const updatePosition = () => {
  if (!floatingToolbar || !selectedMedia) return;

  const toolbarHeight = floatingToolbar.offsetHeight || 40;
  const mediaTop = selectedMedia.offsetTop;
  const mediaLeft = selectedMedia.offsetLeft;
  const mediaWidth = selectedMedia.offsetWidth;

  // Position above the image, centered
  const top = mediaTop - toolbarHeight - 8;
  const left = mediaLeft + (mediaWidth / 2) - ((floatingToolbar.offsetWidth || 120) / 2);

  floatingToolbar.style.top = `${top}px`;
  floatingToolbar.style.left = `${left}px`;
  setTimeout(() => {  
    if (floatingToolbar) floatingToolbar.style.display = "flex";
  },100);
};

// Show floating toolbar
const showFloatingToolbar = (media: HTMLImageElement | HTMLVideoElement) => {
  // Clean up existing toolbar
  if (floatingToolbar) {
    if ((floatingToolbar as any)._cleanup) {
      (floatingToolbar as any)._cleanup();
    }
    floatingToolbar.remove();
  }

  // Ensure parent has relative positioning
  const mediaParent = media.parentElement;
  if (mediaParent) {
    const originalPosition = mediaParent.style.position;
    if (!originalPosition || originalPosition === 'static') {
      mediaParent.style.position = 'relative';
      (mediaParent as any)._originalPosition = originalPosition; // Store for cleanup
    }

    floatingToolbar = document.createElement('div');
    floatingToolbar.className = 'media-floating-toolbar';
    floatingToolbar.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #ced4da;
      border-radius: 6px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.15);
      gap: 2px;
      padding: 4px;
      z-index: 10000;
      pointer-events: auto;
      display: none;
    `;

    // Insert toolbar as first child of parent
    mediaParent.insertBefore(floatingToolbar, mediaParent.firstChild);

    // Position the toolbar
    updatePosition();
  }

  const buttonStyle = 'padding: 6px 8px; border: none; background: white; cursor: pointer; border-radius: 4px; transition: background 0.2s; display: flex; align-items: center; justify-content: center;';
  
  const isImage = media.tagName === 'IMG';
  const existingLink = (media as HTMLElement).closest('a');

  floatingToolbar.innerHTML = `
    <button class="btn-align-left" title="Align Left" style="${buttonStyle}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
    </button>
    <button class="btn-align-center" title="Align Center" style="${buttonStyle}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>
    </button>
    <button class="btn-align-right" title="Align Right" style="${buttonStyle}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
    </button>
    <div style="width: 1px; height: 20px; background: #dee2e6; margin: 0 2px;"></div>
    ${isImage ? `
    <button class="btn-alt" title="Edit Alt Text" style="${buttonStyle}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
    </button>` : ''}
    <button class="btn-link" title="${existingLink ? 'Edit/Remove Link' : 'Add Link'}" style="${buttonStyle}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
    </button>
    ${isImage ? `
    <button class="btn-replace" title="Replace Image" style="${buttonStyle}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
    </button>` : ''}
    <div style="width: 1px; height: 20px; background: #dee2e6; margin: 0 2px;"></div>
    <button class="btn-remove" title="Remove" style="${buttonStyle}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
    </button>
  `;



  // Position the toolbar after it's rendered
  setTimeout(() => {
    updatePosition();
  }, 0);

  // Add event listeners for repositioning
  const handleReposition = () => updatePosition();
  
  // Listen for scroll events on parent elements and window
  let currentElement: Element | null = selectedMedia.parentElement;
  while (currentElement) {
    currentElement.addEventListener('scroll', handleReposition);
    currentElement = currentElement.parentElement;
  }
  
  window.addEventListener('scroll', handleReposition);
  window.addEventListener('resize', handleReposition);
  
  // Store cleanup function
  (floatingToolbar as any)._cleanup = () => {
    let element: Element | null = selectedMedia?.parentElement;
    while (element) {
      element.removeEventListener('scroll', handleReposition);
      element = element.parentElement;
    }
    window.removeEventListener('scroll', handleReposition);
    window.removeEventListener('resize', handleReposition);
  };

  floatingToolbar.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      (btn as HTMLElement).style.background = '#f8f9fa';
    });
    btn.addEventListener('mouseleave', () => {
      (btn as HTMLElement).style.background = 'white';
    });
  });

  // Align Left
  floatingToolbar.querySelector('.btn-align-left')?.addEventListener('click', () => {
    media.style.display = 'block';
    media.style.marginLeft = '0';
    media.style.marginRight = 'auto';
    updatePosition();
  });

  // Align Center
  floatingToolbar.querySelector('.btn-align-center')?.addEventListener('click', () => {
    media.style.display = 'block';
    media.style.marginLeft = 'auto';
    media.style.marginRight = 'auto';
    updatePosition();
  });

  // Align Right
  floatingToolbar.querySelector('.btn-align-right')?.addEventListener('click', () => {
    media.style.display = 'block';
    media.style.marginLeft = 'auto';
    media.style.marginRight = '0';
    updatePosition();
  });

  // Edit Alt Text (Images only)
  floatingToolbar.querySelector('.btn-alt')?.addEventListener('click', () => {
    if (media.tagName === 'IMG') {
      showAltTextDialog(media as HTMLImageElement);
    }
  });

  // Add/Edit Link
  floatingToolbar.querySelector('.btn-link')?.addEventListener('click', () => {
    showLinkDialogForMedia(media);
  });

  // Replace Image
  floatingToolbar.querySelector('.btn-replace')?.addEventListener('click', () => {
    if (media.tagName === 'IMG') {
      showReplaceImageDialog(media as HTMLImageElement);
    }
  });

  floatingToolbar.querySelector('.btn-resize')?.addEventListener('click', () => {
    const width = prompt('Enter width in pixels:', String(media.width || media.offsetWidth));
    if (width && !isNaN(parseInt(width))) {
      const w = parseInt(width);
      media.style.width = `${w}px`;
      media.setAttribute('width', String(w));
      updateResizeHandles();
      updatePosition();
    }
  });

  floatingToolbar.querySelector('.btn-remove')?.addEventListener('click', () => {
    if (confirm('Remove this media?')) {
      media.remove();
      if (floatingToolbar) {
        if ((floatingToolbar as any)._cleanup) {
          (floatingToolbar as any)._cleanup();
        }
        floatingToolbar.remove();
        floatingToolbar = null;
      }
      selectedMedia = null;
      updateResizeHandles();
    }
  });

  // Add scroll and resize event listeners (matching resize handles approach)
  // Store cleanup function for later removal
  (floatingToolbar as any)._cleanup = () => {
    window.removeEventListener('scroll', updatePosition);
    window.removeEventListener('resize', updatePosition);
  };
};

// Initialize media manager function (moved outside conditional for plugin access)
const initMediaManager = (editorEl?: HTMLElement) => {
  // Store the editor element for scoping
  editorElement = editorEl || null;

  createResizeHandles();

  // Add click listener - global but scoped to this editor instance
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
      const media = target as HTMLImageElement | HTMLVideoElement;

      // Check if media is within this editor's contenteditable area
      let isInThisEditor = false;
      if (editorElement) {
        // For web component, check if media is within this editor element
        isInThisEditor = editorElement.contains(media);
      } else {
        // Fallback to global behavior
        isInThisEditor = !!media.closest('[contenteditable="true"]');
      }

      if (isInThisEditor) {
        e.preventDefault();
        e.stopPropagation();
        selectedMedia = media;
        selectedMedia.style.display = 'block'; // Ensure block display for alignment
        showFloatingToolbar(media);
        updateResizeHandles();
        return;
      }
    }

    if (!target.closest('.btn-link, .btn-resize, .btn-remove')) {
      if (floatingToolbar && !target.closest('button')) {
        if ((floatingToolbar as any)._cleanup) {
          (floatingToolbar as any)._cleanup();
        }
        floatingToolbar.remove();
        floatingToolbar = null;
        
        // Restore parent position
        if (selectedMedia && selectedMedia.parentElement) {
          const parent = selectedMedia.parentElement;
          if ((parent as any)._originalPosition !== undefined) {
            parent.style.position = (parent as any)._originalPosition;
            delete (parent as any)._originalPosition;
          }
        }
        
        selectedMedia = null;
        updateResizeHandles();
      }
    }
  });

  resizeHandles.forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      if (!selectedMedia) return;
      e.preventDefault();
      e.stopPropagation();

      isResizing = true;
      currentHandle = handle.getAttribute('data-position');
      startX = e.clientX;
      startY = e.clientY;

      const rect = selectedMedia.getBoundingClientRect();
      startWidth = rect.width;
      startHeight = rect.height;
      aspectRatio = startWidth / startHeight;

      document.body.style.userSelect = 'none';
      document.body.style.cursor = `${currentHandle}-resize`;
    });
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing || !selectedMedia || !currentHandle) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;

    switch (currentHandle) {
      case 'se':
        newWidth = startWidth + deltaX;
        newHeight = startHeight + deltaY;
        break;
      case 'sw':
        newWidth = startWidth - deltaX;
        newHeight = startHeight + deltaY;
        break;
      case 'ne':
        newWidth = startWidth + deltaX;
        newHeight = startHeight - deltaY;
        break;
      case 'nw':
        newWidth = startWidth - deltaX;
        newHeight = startHeight - deltaY;
        break;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      newHeight = newWidth / aspectRatio;
    } else {
      newWidth = newHeight * aspectRatio;
    }

    newWidth = Math.max(50, newWidth);
    newHeight = Math.max(50, newHeight);

    selectedMedia.style.width = `${newWidth}px`;
    selectedMedia.style.height = `${newHeight}px`;
    selectedMedia.setAttribute('width', String(Math.round(newWidth)));
    selectedMedia.setAttribute('height', String(Math.round(newHeight)));

    updateResizeHandles();
    updatePosition();
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      currentHandle = null;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  });

  window.addEventListener('scroll', updateResizeHandles);
  window.addEventListener('resize', updateResizeHandles);
};

// Initialize media manager
if (typeof window !== 'undefined' && !window.__mediaManagerInitialized) {
  window.__mediaManagerInitialized = true;

  // Call initMediaManager without parameters for global initialization
  initMediaManager();
}

export const MediaManagerPlugin = (): Plugin => ({
  name: 'image',
  
  initialize: (config?: any) => {
    // Get the editor element from config (passed by web component)
    const editorEl = config?.editorElement;
    initMediaManager(editorEl);
  },
  
  toolbar: [
    {
      label: 'Image',
      command: 'insertImage',
      icon: '<svg width="24px" height="24px" viewBox="0 0 32 32" enable-background="new 0 0 32 32"><g><rect fill="none" height="22" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" width="30" x="1" y="5"></rect><polygon fill="none" points="31,27 21,17 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><polygon fill="none" points="18,20 9,11 1,19 1,27 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><circle cx="19" cy="11" fill="none" r="2" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></circle></g></svg>'
    },
    {
      label: 'Video',
      command: 'insertVideo',
      icon: '<svg width="24" height="24" focusable="false"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fill-rule="nonzero"></path></svg>'
    }
  ],
  
  commands: {
    insertImage: () => {
      showMediaDialog('image');
      return true;
    },
    
    insertVideo: () => {
      showMediaDialog('video');
      return true;
    }
  },
  
  keymap: {
    'Mod-Shift-i': 'insertImage'
  }
});
