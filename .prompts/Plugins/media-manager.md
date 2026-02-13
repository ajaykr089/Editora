# 🧠 MASTER AI PROMPT

## Build a Professional-Grade Media Manager (Local + API Hybrid, Free)

---

## 🎯 Objective

You are a **principal-level frontend + platform engineer** tasked with building a **Media Manager system** for a Rich Text Editor.

This Media Manager must:

* Match or exceed **professional-grade media management features**
* Work **with or without backend APIs**
* Be **fully optional**, configurable, and extensible
* Support **advanced media manipulation**
* Be safe, performant, and accessible

This feature is **FREE**, so the architecture must avoid paid dependencies.

---

## 🧩 Core Editor Integration

The Media Manager is implemented as a **plugin** and integrates with:

* Toolbar (Insert / Edit Media)
* Context menu (Edit / Replace / Caption / Alt)
* Drag & drop
* Paste events
* Media library modal

---

## 🧩 Required Configuration Interface

You MUST support this configuration shape:

```ts
interface MediaManagerConfig {
  mode?: 'local' | 'api' | 'hybrid';

  upload?: {
    enabled: boolean;
    maxFileSize?: number;
    allowedTypes?: string[];
    autoOptimize?: boolean;
    autoGenerateThumbnails?: boolean;
  };

  storage?: {
    type: 'memory' | 'indexeddb' | 'filesystem' | 'api';
    key?: string;
    apiUrl?: string;
    headers?: Record<string, string>;
  };

  library?: {
    enabled: boolean;
    searchable?: boolean;
    sortable?: boolean;
    pagination?: boolean;
  };

  manipulation?: {
    crop?: boolean;
    resize?: boolean;
    rotate?: boolean;
    flip?: boolean;
    compress?: boolean;
    formatConvert?: boolean;
    metadataEdit?: boolean;
  };

  metadata?: {
    altText?: boolean;
    title?: boolean;
    caption?: boolean;
    copyright?: boolean;
  };

  security?: {
    sanitizeFilenames?: boolean;
    validateMimeType?: boolean;
  };

  ui?: {
    gridSize?: 'sm' | 'md' | 'lg';
    previewOnHover?: boolean;
    darkMode?: boolean;
  };
}
```

---

## 🏗️ Architecture Requirements

### 1️⃣ Media Core Engine

* Abstract media storage layer
* Pluggable providers:

  * Local memory
  * IndexedDB
  * File System Access API
  * Backend API
* Unified media model

```ts
interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'file';
  src: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  mime: string;
  createdAt: number;
  metadata: Record<string, any>;
}
```

---

### 2️⃣ Local-Only Mode (NO API)

Must work when:

* User is offline
* No backend exists
* Editor embedded in static site

Use:

* `URL.createObjectURL`
* `IndexedDB`
* In-memory cache
* Optional File System Access API

Features:

* Drag & drop upload
* Local preview
* Image resizing via canvas
* Thumbnail generation
* Metadata editing
* Export media bundle (ZIP)

Edge cases:

* Page refresh = data loss (warn user)
* Memory cleanup (revokeObjectURL)
* File handle permissions revoked
* Browser compatibility fallback

---

### 3️⃣ API-Backed Mode

API responsibilities:

* Upload
* List
* Delete
* Replace
* Transform (optional)

Shared Api config URL:
    packages/plugins/src/shared-config.ts
Api server path
    api

Example endpoints:

```
POST   /media/upload
GET    /media/list
PUT    /media/:id
DELETE /media/:id
POST   /media/transform
```

Support:

* Chunked uploads
* Retry & resume
* Progress reporting
* Auth headers
* Signed URLs

Edge cases:

* Partial upload failure
* Network loss mid-upload
* Expired auth token
* Filename collision
* Race conditions

---

### 4️⃣ Hybrid Mode (REQUIRED)

Hybrid mode MUST:

* Upload locally first
* Insert media immediately
* Sync to API later
* Reconcile IDs after sync

Flow:

1. User inserts image
2. Local blob preview inserted
3. Background upload starts
4. Blob replaced with CDN URL
5. Editor content updated safely

Edge cases:

* Editor closed before sync
* Upload fails → fallback retained
* Duplicate sync attempts

---

## 🖼️ Advanced Media Manipulation (MANDATORY)

### Images

* Crop (aspect ratio lock)
* Resize (pixel + %)
* Rotate / Flip
* Compress (quality slider)
* Convert formats (PNG ↔ JPG ↔ WebP)
* Edit EXIF metadata
* Auto-generate responsive variants

### Video (basic)

* Poster frame selection
* Autoplay / loop
* Controls toggle

### Audio

* Controls toggle
* Waveform preview (optional)

---

## 🧠 Editor Interaction Rules

* Media must be:

  * Non-editable blocks
  * Selection-safe
  * Undo/redo friendly
* Captions editable
* Alt text required (accessibility)
* Drag repositioning allowed

---

## 🔐 Security & Validation

* MIME type validation
* Extension spoofing prevention
* Filename sanitization
* HTML attribute sanitization
* Prevent JS execution via SVG

---

## 🚀 Performance Requirements

* Lazy load thumbnails
* Virtualized media grid
* Debounced uploads
* Canvas off-main-thread (Worker)
* No blocking UI

---

## ♿ Accessibility

* Keyboard navigable modal
* Focus trapping
* ARIA roles
* Screen reader labels
* Required alt text enforcement

---

## ⚠️ Edge Cases You MUST Handle

* Pasting images from clipboard
* Dragging large files
* Upload cancel mid-way
* Undo after media delete
* Replacing media already in document
* RTL captions
* Multiple editors on same page
* SSR environments

---

## ❌ Forbidden

* Hard dependency on backend
* Blocking uploads
* Losing selection on insert
* Memory leaks
* Browser-specific hacks

---

## ✅ Deliverables

You MUST produce:

1. Media manager core
2. Storage abstraction
3. Local-only implementation
4. API-backed implementation
5. Hybrid sync logic
6. Media modal UI
7. Image manipulation engine
8. Security validation layer

---

## 🧠 Mental Model

Think:

* Professional media asset management
* Cloud-based document image handling
* Collaborative workspace asset systems
* Modern asset pipeline architectures

But:

* Lighter
* Open
* Free

---

### 🟢 Final Rule

If media insertion is not **instant**, you failed.
