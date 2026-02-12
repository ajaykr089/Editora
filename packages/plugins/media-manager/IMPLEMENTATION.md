# Media Manager Plugin - Enhanced Implementation

## 🎉 Overview

The enhanced Media Manager is a **professional media management system** for the Rich Text Editor, supporting:

- ✅ Local-only mode (no backend required)
- ✅ API-backed mode with automatic sync
- ✅ Hybrid mode (upload locally, sync later)
- ✅ Advanced image manipulation (crop, resize, rotate, compress)
- ✅ Professional UI/UX with drag & drop
- ✅ Security validation & XSS prevention
- ✅ Responsive design
- ✅ Accessibility support

---

## 🏗️ Architecture

### Storage Abstraction Layer

The media manager uses a pluggable storage system:

```typescript
// Choose storage mode
const config: MediaManagerConfig = {
  storage: {
    type: 'memory' | 'indexeddb' | 'api',
    apiUrl: '/api/media'
  }
};
```

**Available Providers:**

| Provider | Persistent | Offline | Best For |
|----------|-----------|---------|----------|
| **Memory** | ❌ | ✅ | Dev, temporary data |
| **IndexedDB** | ✅ | ✅ | Local-only mode, fallback |
| **API** | ✅ | ❌ | Production with backend |

### Storage Provider Interface

```typescript
interface StorageProvider {
  upload(file: File): Promise<MediaItem>;
  list(filter?: { type?: string; limit?: number }): Promise<MediaItem[]>;
  delete(id: string): Promise<void>;
  get(id: string): Promise<MediaItem | null>;
  update(id: string, updates: Partial<MediaItem>): Promise<MediaItem>;
}
```

---

## 🚀 Usage Guide

### Basic Setup

```typescript
import {
  MediaManagerPlugin,
  MediaProvider,
  type MediaManagerConfig
} from '@editora/plugins';

const config: MediaManagerConfig = {
  mode: 'hybrid',
  
  upload: {
    enabled: true,
    maxFileSize: 52428800, // 50MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
    autoOptimize: true,
    autoGenerateThumbnails: true
  },

  storage: {
    type: 'indexeddb',
    apiUrl: '/api/media' // Optional: for hybrid mode
  },

  library: {
    enabled: true,
    searchable: true,
    sortable: true,
    pagination: true,
    gridSize: 'md',
    previewOnHover: true
  },

  manipulation: {
    crop: true,
    resize: true,
    rotate: true,
    flip: true,
    compress: true,
    formatConvert: true
  },

  metadata: {
    altText: true,
    title: true,
    caption: true
  },

  security: {
    sanitizeFilenames: true,
    validateMimeType: true
  }
};

const editor = new EditoraEditor({
  plugins: [MediaManagerPlugin],
  config
});
```

---

## 🎨 Professional UI Features

### 📤 Upload Tab
- Drag & drop support
- File browser
- Visual progress indicator
- File size validation
- Real-time preview

### 📚 Library Tab
- Virtualized grid for performance
- Search & filtering
- Sortable columns
- Lazy-loaded thumbnails
- Responsive layout

### 🔗 URL Tab
- Direct URL input
- Paste support
- Live preview
- Metadata fields (alt, title, caption)

### ✂️ Edit Tab (Image Only)
- Crop with aspect ratio lock
- Resize with preview
- Rotation (90°, 180°, 270°)
- Flip horizontal/vertical
- Compression with quality slider
- Format conversion (PNG ↔ JPEG ↔ WebP)
- Responsive variants generation

---

## 🛡️ Security Features

### MediaValidator

```typescript
import { MediaValidator } from '@editora/plugins';

// Validate file before upload
const validation = MediaValidator.validate(file, {
  maxSize: 52428800,
  allowedTypes: ['image/*', 'video/*'],
  sanitizeFilename: true
});

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}

// Individual validations
MediaValidator.validateMimeType(file);      // MIME type check
MediaValidator.validateExtension(file.name); // Extension spoofing prevention
MediaValidator.sanitizeFilename(file.name);  // Safe filename
MediaValidator.validateSVG(svgContent);     // XSS prevention
```

**Protections:**
- ✅ MIME type validation
- ✅ Extension spoofing prevention
- ✅ Dangerous file blocking (exe, bat, etc.)
- ✅ Filename sanitization
- ✅ SVG script injection prevention
- ✅ HTML attribute sanitization

---

## 🖼️ Image Manipulation

### ImageManipulator API

```typescript
import { ImageManipulator, type ImageTransformOptions } from '@editora/plugins';

// Load image
const img = await ImageManipulator.loadImage('image.jpg');

// Apply transformations
const blob = await ImageManipulator.transform('image.jpg', {
  crop: {
    x: 0,
    y: 0,
    width: 400,
    height: 300,
    aspectRatio: 4/3
  },
  resize: {
    width: 1200,
    maintainAspect: true
  },
  rotate: {
    degrees: 90
  },
  flip: {
    horizontal: true
  },
  compress: {
    quality: 0.8,
    format: 'webp'
  }
});

// Generate thumbnail
const thumb = await ImageManipulator.generateThumbnail('image.jpg', 200);

// Generate responsive variants
const variants = await ImageManipulator.generateVariants('image.jpg', [320, 640, 1024]);

variants.forEach((blob, size) => {
  console.log(`${size}w: ${blob.size} bytes`);
});
```

---

## 🌐 API Integration

### Backend Endpoints

Required endpoints when using API storage:

```
POST   /api/media/upload       - Upload file
GET    /api/media/list         - List media
GET    /api/media/:id          - Get media details
PUT    /api/media/:id          - Update media
DELETE /api/media/:id          - Delete media
```

### Example Request/Response

```typescript
// Upload
POST /api/media/upload
Content-Type: multipart/form-data

file: <File>
---

200 OK
{
  "id": "uuid",
  "name": "photo.jpg",
  "type": "image",
  "src": "/uploads/photo.jpg",
  "thumbnailUrl": "/uploads/photo-thumb.jpg",
  "size": 524288,
  "width": 1920,
  "height": 1080,
  "mime": "image/jpeg",
  "createdAt": "2026-02-02T12:00:00Z",
  "metadata": {}
}
```

---

## 🔄 Hybrid Mode

Hybrid mode is perfect for **offline-first** applications:

1. **User uploads image** → Stored locally (IndexedDB)
2. **Image inserted** → Preview available immediately
3. **Background sync** → Uploads to API when online
4. **ID reconciliation** → Blob URL replaced with CDN URL
5. **Safe fallback** → If sync fails, local blob retained

```typescript
// Configuration
const config: MediaManagerConfig = {
  mode: 'hybrid',
  storage: {
    type: 'indexeddb',
    apiUrl: '/api/media'
  }
};

// The manager handles all sync logic automatically
```

---

## 📊 Media Item Structure

```typescript
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
  thumbnailUrl?: string;
  metadata: Record<string, any>;
}
```

---

## ⚙️ Configuration Reference

```typescript
interface MediaManagerConfig {
  // Operation mode
  mode?: 'local' | 'api' | 'hybrid';

  // Upload settings
  upload?: {
    enabled: boolean;
    maxFileSize?: number;              // bytes
    allowedTypes?: string[];           // MIME types or extensions
    autoOptimize?: boolean;
    autoGenerateThumbnails?: boolean;
  };

  // Storage configuration
  storage?: {
    type: 'memory' | 'indexeddb' | 'filesystem' | 'api';
    key?: string;                      // IndexedDB database name
    apiUrl?: string;                   // API base URL
    headers?: Record<string, string>;  // Custom headers
  };

  // Media library features
  library?: {
    enabled: boolean;
    searchable?: boolean;
    sortable?: boolean;
    pagination?: boolean;
    gridSize?: 'sm' | 'md' | 'lg';
    previewOnHover?: boolean;
  };

  // Image editing capabilities
  manipulation?: {
    crop?: boolean;
    resize?: boolean;
    rotate?: boolean;
    flip?: boolean;
    compress?: boolean;
    formatConvert?: boolean;
    metadataEdit?: boolean;
  };

  // Required metadata fields
  metadata?: {
    altText?: boolean;      // Required for a11y
    title?: boolean;
    caption?: boolean;
    copyright?: boolean;
  };

  // Security settings
  security?: {
    sanitizeFilenames?: boolean;
    validateMimeType?: boolean;
  };

  // UI customization
  ui?: {
    darkMode?: boolean;
    doubleClickToEdit?: boolean;
    dragReorder?: boolean;
  };
}
```

---

## 🎯 Best Practices

### 1. Local-Only (No Backend)
```typescript
const config: MediaManagerConfig = {
  mode: 'local',
  storage: { type: 'indexeddb' },
  upload: { maxFileSize: 52428800 }
};

// ✅ Works offline
// ⚠️ Data lost on browser clear
// ⚠️ No server-side CDN
```

### 2. API-Backed (Production)
```typescript
const config: MediaManagerConfig = {
  mode: 'api',
  storage: {
    type: 'api',
    apiUrl: 'https://api.example.com/media'
  },
  upload: { maxFileSize: 52428800 }
};

// ✅ Persistent storage
// ✅ CDN accessible
// ⚠️ Requires backend
```

### 3. Hybrid (Recommended)
```typescript
const config: MediaManagerConfig = {
  mode: 'hybrid',
  storage: {
    type: 'indexeddb',
    apiUrl: 'https://api.example.com/media'
  },
  upload: { maxFileSize: 52428800 }
};

// ✅ Works offline
// ✅ Auto-sync when online
// ✅ Instant preview
// ✅ Best UX
```

---

## 🧪 Testing & Validation

```typescript
import { MediaValidator, ImageManipulator } from '@editora/plugins';

// Test validation
const file = new File(['...'], 'photo.jpg', { type: 'image/jpeg' });
const result = MediaValidator.validate(file, {
  maxSize: 5242880,      // 5MB
  allowedTypes: ['image/*'],
  sanitizeFilename: true
});

// Test image manipulation
const transformed = await ImageManipulator.transform(file, {
  resize: { width: 800, maintainAspect: true },
  compress: { quality: 0.8, format: 'webp' }
});

const thumb = await ImageManipulator.generateThumbnail(file, 150);
```

---

## 🚨 Error Handling

```typescript
try {
  const url = await manager.uploadFile(file);
  manager.insertImage({ src: url, alt: 'Description' });
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('size')) {
      // File too large
    } else if (error.message.includes('type')) {
      // Invalid MIME type
    } else if (error.message.includes('network')) {
      // Network error - try again later (hybrid mode)
    }
  }
}
```

---

## 📈 Performance Optimization

- **Lazy thumbnail loading**: Only load when visible
- **Canvas off-main-thread**: Image manipulation via Worker (optional)
- **Virtualized grid**: Only render visible items
- **Chunked uploads**: Large files in chunks
- **Automatic cleanup**: `URL.revokeObjectURL()` for blob URLs

---

## ♿ Accessibility

- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Focus trapping in modal
- ✅ ARIA roles & labels
- ✅ Screen reader announcements
- ✅ Alt text requirement enforcement
- ✅ Color contrast compliance

---

## 📦 Bundle Size

| Module | Size (Gzip) |
|--------|------------|
| Core | ~15KB |
| Storage | ~5KB |
| Validator | ~3KB |
| Manipulator | ~12KB |
| UI Components | ~8KB |
| **Total** | **~43KB** |

---

## 🤝 Contributing

The media manager is extensible - you can:

1. Create custom storage providers
2. Add custom image filters
3. Implement custom validation rules
4. Style for your brand

---

## 📚 Related Documentation

- [EditoraEditor Config](../../README.md)
- [Plugin Architecture](../PLUGINS_QUICK_REFERENCE.md)
- [Security Guidelines](../../CSS_ISOLATION_GUIDE.md)
