# Custom Server Upload Configuration

How to point the media-manager at your own upload server, and what that server has to answer.

## Overview

Where an inserted file goes is decided in this order:

1. **`provider`**: a complete provider object (upload, and optionally list, update and delete).
2. **`uploadHandler`**: one function, `(file, { onProgress, signal }) => url`. The shortest way to plug in any backend or SDK.
3. **`apiUrl`**: a REST backend that answers the format in [Response Format](#response-format).
4. **Nothing configured**: the file becomes a data URL and stays in the document (no server needed).

The upload dialog shows true progress for 1-3 (`onProgress` for a handler), has a Cancel button, and shows the failure message when it fails.

---

## Configuration

### Option 1: a REST server

```typescript
import { setMediaManagerConfig } from '@editora/media-manager';

setMediaManagerConfig({
  apiUrl: 'https://your-domain.com',
  apiEndpoints: { upload: '/api/upload' }, // only the keys you change; library and delete keep their defaults
  headers: { Authorization: 'Bearer YOUR_API_TOKEN' },
  withCredentials: false,       // true to send cookies on a cross-origin upload
  uploadFieldName: 'file',      // the multipart field that carries the file
  maxFileSize: 50 * 1024 * 1024,
  allowedTypes: ['image/*', 'video/mp4'],
});
```

### Option 2: an upload function

```typescript
setMediaManagerConfig({
  uploadHandler: async (file, { onProgress, signal }) => {
    const result = await myStorageSdk.upload(file, { onProgress: (p) => onProgress?.({ loaded: p, total: 1, fraction: p }), signal });
    return result.url; // or { url, width, height, thumbnailUrl }
  },
});
```

The same can be given to one plugin instance, and wins over the global settings: `MediaManagerPlugin({ uploadHandler })`.

### Option 3: no server

Configure nothing. Files are read in the browser and embedded as data URLs. The default limit is 10 MB, because a data URL is a third larger than the file and lives in your document.

### Falling back to a data URL

```typescript
setMediaManagerConfig({ apiUrl: 'https://your-domain.com', fallbackToBase64: true });
```

Off by default: when the server is unreachable the person sees the error and can try again. Turn it on only if inserting a very large document body is better for you than a failure message.

---

## Server-Side Implementation

### Node.js/Express Example

```typescript
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images allowed.'));
    }
  }
});

// Middleware to verify API token (optional)
const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (process.env.API_TOKEN && token !== process.env.API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Upload endpoint
app.post('/api/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Get file dimensions (optional but recommended)
    const dimensions = await getImageDimensions(req.file.path);

    const fileUrl = `${process.env.SERVER_URL || 'http://localhost:3000'}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      width: dimensions?.width || 0,
      height: dimensions?.height || 0,
      thumbnailUrl: fileUrl, // Use same URL or generate thumbnail
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Upload failed' });
  }
});

// Get image dimensions helper
async function getImageDimensions(
  filePath: string
): Promise<{ width: number; height: number } | null> {
  try {
    // Install: npm install jimp
    const Jimp = require('jimp');
    const image = await Jimp.read(filePath);
    return {
      width: image.bitmap.width,
      height: image.bitmap.height
    };
  } catch (error) {
    console.warn('Could not get image dimensions:', error);
    return null;
  }
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Upload server running on port ${PORT}`);
});
```

### Python/Flask Example

```python
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from PIL import Image
from functools import wraps

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp', 'gif'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
API_TOKEN = os.getenv('API_TOKEN')

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def verify_token(f):
    """Decorator to verify API token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if API_TOKEN:
            token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if token != API_TOKEN:
                return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_image_dimensions(file_path):
    """Get image width and height"""
    try:
        img = Image.open(file_path)
        return {'width': img.width, 'height': img.height}
    except Exception as e:
        print(f'Could not get image dimensions: {e}')
        return None

@app.route('/api/upload', methods=['POST'])
@verify_token
def upload_file():
    """Handle file upload"""
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only images allowed.'}), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': f'File too large. Max {MAX_FILE_SIZE / 1024 / 1024}MB'}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d-%H%M%S-')
        unique_filename = timestamp + filename
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        file.save(file_path)
        
        # Get image dimensions
        dimensions = get_image_dimensions(file_path) or {'width': 0, 'height': 0}
        
        server_url = os.getenv('SERVER_URL', 'http://localhost:5000')
        file_url = f'{server_url}/uploads/{unique_filename}'
        
        return jsonify({
            'success': True,
            'url': file_url,
            'filename': unique_filename,
            'size': file_size,
            'width': dimensions['width'],
            'height': dimensions['height'],
            'thumbnailUrl': file_url,
            'mimeType': file.content_type,
            'uploadedAt': datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        print(f'Upload error: {e}')
        return jsonify({'error': str(e)}), 500

# Serve uploaded files
@app.route('/uploads/<filename>')
def serve_upload(filename):
    """Serve uploaded files"""
    return app.send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(
        debug=os.getenv('FLASK_ENV') == 'development',
        port=int(os.getenv('PORT', 5000))
    )
```

### PHP Example

```php
<?php
header('Content-Type: application/json');

// Configuration
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
define('API_TOKEN', getenv('API_TOKEN'));

// Create upload directory if it doesn't exist
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// Verify API token
function verify_token() {
    if (API_TOKEN) {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? '';
        $token = str_replace('Bearer ', '', $auth);
        
        if ($token !== API_TOKEN) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }
    }
}

// Get image dimensions
function get_image_dimensions($file_path) {
    try {
        $size = getimagesize($file_path);
        return $size ? ['width' => $size[0], 'height' => $size[1]] : null;
    } catch (Exception $e) {
        error_log("Could not get image dimensions: " . $e->getMessage());
        return null;
    }
}

// Handle upload
function handle_upload() {
    verify_token();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No file provided']);
        return;
    }
    
    $file = $_FILES['file'];
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Upload failed']);
        return;
    }
    
    // Check file type
    if (!in_array($file['type'], ALLOWED_TYPES)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Only images allowed.']);
        return;
    }
    
    // Check file size
    if ($file['size'] > MAX_FILE_SIZE) {
        http_response_code(413);
        echo json_encode(['error' => 'File too large']);
        return;
    }
    
    // Generate unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = date('YmdHis-') . uniqid() . '.' . strtolower($ext);
    $file_path = UPLOAD_DIR . $filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $file_path)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save file']);
        return;
    }
    
    // Get image dimensions
    $dimensions = get_image_dimensions($file_path) ?? ['width' => 0, 'height' => 0];
    
    // Generate file URL
    $server_url = getenv('SERVER_URL') ?: 'http://localhost';
    $file_url = $server_url . '/uploads/' . $filename;
    
    // Return response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'url' => $file_url,
        'filename' => $filename,
        'size' => $file['size'],
        'width' => $dimensions['width'],
        'height' => $dimensions['height'],
        'thumbnailUrl' => $file_url,
        'mimeType' => $file['type'],
        'uploadedAt' => date('c')
    ]);
}

handle_upload();
?>
```

---

## Configuration in React

The settings are global to the page, so set them once, before the editor renders:

```tsx
import { setMediaManagerConfig } from '@editora/media-manager';

setMediaManagerConfig({
  apiUrl: 'https://api.example.com',
  apiEndpoints: { upload: '/upload' },
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## Response Format

Your server MUST return JSON in this format:

```json
{
  "url": "https://your-domain.com/uploads/image-123.jpg",
  "filename": "image-123.jpg",
  "size": 102400,
  "width": 1920,
  "height": 1080,
  "thumbnailUrl": "https://your-domain.com/uploads/image-123.jpg",
  "mimeType": "image/jpeg",
  "uploadedAt": "2024-02-01T12:00:00Z"
}
```

### Required Fields
- `url` - Full URL to the uploaded file (`src` and `location` are accepted too)

### Optional Fields
- `id` - Your identifier for the file; used for the library, update and delete calls
- `width`, `height` - Pixel dimensions (a `0` means "not measured" and is ignored)
- `filename`, `size`, `mimeType`, `uploadedAt`
- `thumbnailUrl` - URL to a thumbnail (defaults to `url`)

An error is any non-2xx status; the plugin shows `error` or `message` from a JSON body, or a plain sentence for 401, 403 and 413.

---

## Fallback Behavior

By default a failed upload is reported and nothing is inserted. With `fallbackToBase64: true` the file is inserted as a data URL instead. A cancelled upload never falls back.

---

## Best Practices

### Security
- ✅ Always validate file type on server
- ✅ Sanitize filenames
- ✅ Limit file size
- ✅ Use API tokens/authentication
- ✅ Store files outside web root if possible
- ✅ Serve via HTTPS only

### Performance
- ✅ Generate thumbnails server-side
- ✅ Serve images via CDN
- ✅ Compress images automatically
- ✅ Use WEBP format when possible
- ✅ Set proper cache headers

### Reliability
- ✅ Decide whether a failed upload should fall back to a data URL (`fallbackToBase64`) or show the error
- ✅ Log all uploads
- ✅ Return image dimensions
- ✅ Handle large files gracefully
- ✅ Provide clear error messages

---

## Troubleshooting

### The dialog shows an error
- It carries the server's own message when the server sent one as JSON (`{ "error": "..." }`)
- Check the Network tab for the real status; 413 is usually a proxy body-size limit
- With `fallbackToBase64: true` the image is inserted as a data URL instead of showing the error

### Wrong dimensions returned
- Dimensions are optional; the browser measures the image when the server sends none

### CORS errors
- Add proper CORS headers to your upload endpoint
- Or use same-origin uploads

### Token not working
- Verify `Authorization` header is sent
- Check token format: `Bearer YOUR_TOKEN`
- Ensure server environment variable matches

---

## Migration from Base64 to Server

If images start as base64, you can later migrate them:

```javascript
// Server endpoint to migrate base64 to server storage
async function migrateBase64Images(contentHtml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentHtml, 'text/html');
  const base64Images = doc.querySelectorAll('img[src^="data:"]');
  
  for (const img of base64Images) {
    const base64 = img.src;
    const response = await fetch('/api/migrate-base64', {
      method: 'POST',
      body: JSON.stringify({ base64 }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    img.src = data.url;
  }
  
  return doc.body.innerHTML;
}
```

---

## Support

For issues or questions:
1. Check browser console for errors
2. Check server logs
3. Verify configuration matches examples
4. Test endpoint with curl: `curl -F "file=@image.jpg" http://localhost:3000/api/upload`

