import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import pool from './db';
import { RowDataPacket } from 'mysql2';

const app = express();
const PORT = 3001;

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use('/uploads', express.static(uploadDir));

app.post('/api/media/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const id = uuidv4();
  const url = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  const type = req.file.mimetype.startsWith('image') ? 'image' : 'video';
  const storagePath = `/uploads/${req.file.filename}`;

  try {
    await pool.execute(
      `INSERT INTO media (id, filename, original_filename, mime_type, file_size, url, thumbnail_url, storage_path, type, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ready')`,
      [id, req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, url, url, storagePath, type]
    );

    res.json({
      id,
      url,
      thumbnailUrl: url,
      width: 0,
      height: 0,
      size: req.file.size,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to save media' });
  }
});

app.get('/api/media/library', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, filename, original_filename AS name, url, thumbnail_url AS thumbnailUrl, type, file_size AS size, width, height, created_at AS createdAt 
       FROM media 
       WHERE deleted_at IS NULL AND status = 'ready' 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM media WHERE deleted_at IS NULL AND status = \'ready\''
    );

    res.json({
      items: rows,
      total: countResult[0].total
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

app.patch('/api/media/library/:id', async (req, res) => {
  const { id } = req.params;
  const { alt_text, title, description } = req.body;

  try {
    await pool.execute(
      'UPDATE media SET alt_text = ?, title = ?, description = ? WHERE id = ?',
      [alt_text, title, description, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to update media' });
  }
});

app.delete('/api/media/library/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT storage_path FROM media WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const filePath = path.join(__dirname, '../..', rows[0].storage_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await pool.execute(
      'UPDATE media SET deleted_at = NOW() WHERE id = ?',
      [id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

app.listen(PORT, () => {
  console.log(`Media API server running on http://localhost:${PORT}`);
});
