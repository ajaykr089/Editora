#!/usr/bin/env node

/**
 * Simple Media Upload Server for Rich Text Editor
 * Usage: node upload-server.js
 * 
 * Environment variables:
 * - PORT: Server port (default: 3001)
 * - UPLOAD_DIR: Directory to store uploads (default: ./uploads)
 * - API_TOKEN: Optional API token for authentication
 * - SERVER_URL: Base URL for file access (default: http://localhost:3001)
 * - ALLOWED_TYPES: Comma-separated MIME types (default: image/jpeg,image/png,image/webp,image/gif)
 * - MAX_FILE_SIZE: Max file size in MB (default: 50)
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration from environment
const PORT = process.env.PORT || 3001;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
const API_TOKEN = process.env.API_TOKEN;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
const ALLOWED_TYPES = (process.env.ALLOWED_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(',');
const MAX_FILE_SIZE = (process.env.MAX_FILE_SIZE || 50) * 1024 * 1024;

// Create upload directory
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const sanitized = name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    cb(null, `${sanitized}-${timestamp}-${random}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`));
    }
  }
});

/**
 * Verify API token if configured
 */
function verifyToken(req, res, next) {
  if (!API_TOKEN) return next();
  
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  
  if (token !== API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}

/**
 * Get image dimensions and create thumbnail
 */
async function processImage(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    
    // Generate thumbnail (max 200px)
    const thumbnailPath = filePath.replace(/(\.[^.]+)$/, '-thumb$1');
    await sharp(filePath)
      .resize(200, 200, { fit: 'inside', withoutEnlargement: true })
      .toFile(thumbnailPath);
    
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format,
      thumbnail: `${SERVER_URL}/uploads/${path.basename(thumbnailPath)}`
    };
  } catch (error) {
    console.error('Image processing error:', error);
    return { width: 0, height: 0 };
  }
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uploadDir: UPLOAD_DIR,
    maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    allowedTypes: ALLOWED_TYPES
  });
});

/**
 * Upload endpoint
 */
app.post('/api/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Process image (dimensions and thumbnail)
    const imageInfo = await processImage(req.file.path);

    const fileUrl = `${SERVER_URL}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      width: imageInfo.width,
      height: imageInfo.height,
      format: imageInfo.format,
      thumbnailUrl: imageInfo.thumbnail || fileUrl,
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up partial file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Cleanup error:', err);
      });
    }

    res.status(500).json({
      error: error instanceof Error ? error.message : 'Upload failed',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * Bulk upload endpoint (multiple files)
 */
app.post('/api/upload-multiple', verifyToken, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const results = await Promise.all(
      req.files.map(async (file) => {
        const imageInfo = await processImage(file.path);
        return {
          success: true,
          url: `${SERVER_URL}/uploads/${file.filename}`,
          filename: file.filename,
          size: file.size,
          width: imageInfo.width,
          height: imageInfo.height,
          thumbnailUrl: imageInfo.thumbnail || `${SERVER_URL}/uploads/${file.filename}`,
          mimeType: file.mimetype
        };
      })
    );

    res.json({
      success: true,
      files: results,
      count: results.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Bulk upload failed' });
  }
});

/**
 * List uploaded files
 */
app.get('/api/files', verifyToken, (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR)
      .filter(f => !f.includes('-thumb'))
      .map(filename => {
        const filePath = path.join(UPLOAD_DIR, filename);
        const stats = fs.statSync(filePath);
        
        return {
          filename,
          url: `${SERVER_URL}/uploads/${filename}`,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json({
      success: true,
      files,
      count: files.length
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

/**
 * Delete file endpoint
 */
app.delete('/api/files/:filename', verifyToken, (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(UPLOAD_DIR, filename);
    const thumbPath = filePath.replace(/(\.[^.]+)$/, '-thumb$1');

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file and thumbnail
    fs.unlinkSync(filePath);
    if (fs.existsSync(thumbPath)) {
      fs.unlinkSync(thumbPath);
    }

    res.json({
      success: true,
      message: 'File deleted successfully',
      filename
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

/**
 * Serve uploaded files
 */
app.use('/uploads', express.static(UPLOAD_DIR, {
  maxAge: '1d',
  etag: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

/**
 * Error handling
 */
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
      });
    }
    return res.status(400).json({ error: error.message });
  }

  if (error) {
    return res.status(500).json({
      error: error.message || 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }

  next();
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('📸 Media Upload Server');
  console.log('='.repeat(60));
  console.log(`\n✓ Server running at: ${SERVER_URL}`);
  console.log(`✓ Upload directory: ${UPLOAD_DIR}`);
  console.log(`✓ Max file size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  console.log(`✓ Allowed types: ${ALLOWED_TYPES.join(', ')}`);
  console.log(`✓ API Token: ${API_TOKEN ? 'Required' : 'Disabled'}`);
  
  console.log('\n📝 Endpoints:');
  console.log(`  POST   ${SERVER_URL}/api/upload - Upload single file`);
  console.log(`  POST   ${SERVER_URL}/api/upload-multiple - Upload multiple files`);
  console.log(`  GET    ${SERVER_URL}/api/files - List files`);
  console.log(`  DELETE ${SERVER_URL}/api/files/:filename - Delete file`);
  console.log(`  GET    ${SERVER_URL}/health - Health check`);
  
  console.log('\n🔧 Configuration:');
  console.log('  Environment variables:');
  console.log('    PORT=3001');
  console.log('    UPLOAD_DIR=./uploads');
  console.log('    API_TOKEN=your-secret-token (optional)');
  console.log('    SERVER_URL=http://localhost:3001');
  console.log('    MAX_FILE_SIZE=50 (MB)');
  console.log('    NODE_ENV=production (for cleaner errors)');
  
  console.log('\n📄 Usage in Rich Text Editor:');
  console.log(`\nconst config = {`);
  console.log(`  offline: {`);
  console.log(`    customUploadUrl: '${SERVER_URL}/api/upload',`);
  console.log(`    customUploadHeaders: {`);
  console.log(`      'Authorization': 'Bearer YOUR_TOKEN'`);
  console.log(`    },`);
  console.log(`    fallbackToBase64: true`);
  console.log(`  }`);
  console.log(`};\n`);
  
  console.log('='.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});
