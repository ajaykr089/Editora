import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, HeadingLevel } from 'docx';
import pool from './db/db';
import { RowDataPacket } from 'mysql2';

const app = express();
const PORT = 3001;

const uploadDir = path.join(__dirname, "./media/uploads");
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
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20)); // clamp for safety
  const offset = (page - 1) * limit;

  try {
    const sql = `
      SELECT id, filename, original_filename AS name, url, thumbnail_url AS thumbnailUrl, type, file_size AS size, width, height, folder_id, created_at AS createdAt 
      FROM media 
      WHERE deleted_at IS NULL AND status = 'ready' 
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    const [rows] = await pool.execute<RowDataPacket[]>(sql);

    const [countResult] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM media WHERE deleted_at IS NULL AND status = 'ready'"
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

app.get('/api/media/folders', async (req, res) => {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, name, parent_id FROM media_folders WHERE user_id IS NULL OR user_id = ?',
      ['default-user']
    );
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

app.post('/api/media/folders', async (req, res) => {
  const { name, parent_id } = req.body;
  const id = uuidv4();

  try {
    await pool.execute(
      'INSERT INTO media_folders (id, name, parent_id, user_id) VALUES (?, ?, ?, ?)',
      [id, name, parent_id || null, 'default-user']
    );
    res.json({ id, name, parent_id });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

app.patch('/api/media/library/:id', async (req, res) => {
  const { id } = req.params;
  const { alt_text, title, description, folder_id } = req.body;

  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (alt_text !== undefined) {
      updates.push('alt_text = ?');
      values.push(alt_text);
    }
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (folder_id !== undefined) {
      updates.push('folder_id = ?');
      values.push(folder_id || null);
    }

    if (updates.length === 0) {
      return res.json({ success: true });
    }

    values.push(id);
    await pool.execute(
      `UPDATE media SET ${updates.join(', ')} WHERE id = ?`,
      values
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

// Document Export Endpoint
app.post('/api/documents/export-word', async (req, res) => {
  try {
    const { htmlContent, filename = 'document.docx' } = req.body;

    if (!htmlContent) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Convert HTML to DOCX
    const doc = await htmlToDocx(htmlContent);

    // Generate the buffer
    const buffer = await Packer.toBuffer(doc);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    // Send the file
    res.send(buffer);
  } catch (error) {
    console.error('Document export error:', error);
    res.status(500).json({ error: 'Failed to export document' });
  }
});

app.listen(PORT, () => {
  console.log(`Media API server running on http://localhost:${PORT}`);
});

// Helper function to convert HTML to DOCX with proper styling
async function htmlToDocx(htmlContent: string): Promise<Document> {
  const children: (Paragraph | Table)[] = [];

  // Simple HTML parsing - split by common tags
  const sections = parseHtmlSections(htmlContent);

  for (const section of sections) {
    switch (section.type) {
      case 'h1':
        const h1Runs = parseFormatting(section.content);
        children.push(
          new Paragraph({
            children: h1Runs.length > 0 ? h1Runs : [new TextRun({ text: cleanText(section.content) })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 240 }
          })
        );
        break;

      case 'h2':
        const h2Runs = parseFormatting(section.content);
        children.push(
          new Paragraph({
            children: h2Runs.length > 0 ? h2Runs : [new TextRun({ text: cleanText(section.content) })],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 240 }
          })
        );
        break;

      case 'h3':
        const h3Runs = parseFormatting(section.content);
        children.push(
          new Paragraph({
            children: h3Runs.length > 0 ? h3Runs : [new TextRun({ text: cleanText(section.content) })],
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 240 }
          })
        );
        break;

      case 'h4':
      case 'h5':
      case 'h6':
        const h4Runs = parseFormatting(section.content);
        children.push(
          new Paragraph({
            children: h4Runs.length > 0 ? h4Runs : [new TextRun({ text: cleanText(section.content) })],
            heading: HeadingLevel.HEADING_4,
            spacing: { after: 240 }
          })
        );
        break;

      case 'p':
        const textRuns = parseFormatting(section.content);
        if (textRuns.length > 0) {
          children.push(
            new Paragraph({
              children: textRuns,
              spacing: { after: 240 }
            })
          );
        }
        break;

      case 'ul':
        const listItems = section.content.split('</li>');
        for (const item of listItems) {
          if (item.trim()) {
            const cleanItem = item.replace(/<li[^>]*>/, '').trim();
            if (cleanItem) {
              const itemRuns = parseFormatting(cleanItem);
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: '• ', color: '000000' }), ...itemRuns],
                  indent: { left: 720 },
                  spacing: { after: 120 }
                })
              );
            }
          }
        }
        break;

      case 'ol':
        const orderedItems = section.content.split('</li>');
        let counter = 1;
        for (const item of orderedItems) {
          if (item.trim()) {
            const cleanItem = item.replace(/<li[^>]*>/, '').trim();
            if (cleanItem) {
              const itemRuns = parseFormatting(cleanItem);
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: `${counter}. `, color: '000000' }), ...itemRuns],
                  indent: { left: 720 },
                  spacing: { after: 120 }
                })
              );
              counter++;
            }
          }
        }
        break;

      case 'blockquote':
        const blockquoteRuns = parseFormatting(section.content);
        children.push(
          new Paragraph({
            children: blockquoteRuns.length > 0 ? blockquoteRuns : [new TextRun({ text: cleanText(section.content), italics: true })],
            indent: { left: 720, right: 720 },
            spacing: { after: 240 }
          })
        );
        break;

      case 'table':
        const tableRows = parseTable(section.content);
        if (tableRows.length > 0) {
          children.push(new Table({ rows: tableRows }));
          children.push(new Paragraph({ text: '', spacing: { after: 240 } }));
        }
        break;

      default:
        // For any other content, treat as paragraph
        const defaultRuns = parseFormatting(section.content);
        if (defaultRuns.length > 0) {
          children.push(
            new Paragraph({
              children: defaultRuns,
              spacing: { after: 120 }
            })
          );
        } else {
          const defaultText = cleanText(section.content);
          if (defaultText) {
            children.push(
              new Paragraph({
                text: defaultText,
                spacing: { after: 120 }
              })
            );
          }
        }
        break;
    }
  }

  return new Document({
    sections: [{
      properties: {},
      children
    }]
  });
}

// Parse HTML into sections
function parseHtmlSections(html: string): Array<{ type: string; content: string }> {
  const sections: Array<{ type: string; content: string }> = [];

  // Simple regex-based parsing for common HTML tags
  const tagRegex = /<(h[1-6]|p|ul|ol|blockquote|table|div)([^>]*)>(.*?)<\/\1>/gis;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    sections.push({
      type: match[1].toLowerCase(),
      content: match[3]
    });
  }

  // If no structured content found, treat whole content as paragraph
  if (sections.length === 0 && html.trim()) {
    sections.push({
      type: 'p',
      content: html
    });
  }

  return sections;
}

// Parse inline formatting (bold, italic, links) with robust HTML parsing
function parseFormatting(html: string): TextRun[] {
  const textRuns: TextRun[] = [];

  if (!html || !html.trim()) {
    return textRuns;
  }

  // Use a more robust approach for parsing nested HTML
  let remaining = html;
  let currentFormatting = { bold: false, italic: false };

  while (remaining.length > 0) {
    // Find the next tag or text content
    const tagMatch = remaining.match(/^<([^>\s]+)[^>]*>/);
    const textMatch = remaining.match(/^([^<]+)/);

    if (textMatch && (!tagMatch || textMatch.index! < tagMatch.index!)) {
      // Process plain text
      const text = textMatch[1];
      if (text.trim()) {
        textRuns.push(new TextRun({
          text: cleanText(text),
          color: '000000',
          bold: currentFormatting.bold,
          italics: currentFormatting.italic
        }));
      }
      remaining = remaining.substring(textMatch[0].length);
    } else if (tagMatch) {
      const tagName = tagMatch[1].toLowerCase();
      const fullTag = tagMatch[0];

      if (tagName.startsWith('/')) {
        // Closing tag
        const closeTagName = tagName.substring(1);
        if (closeTagName === 'strong' || closeTagName === 'b') {
          currentFormatting.bold = false;
        } else if (closeTagName === 'em' || closeTagName === 'i') {
          currentFormatting.italic = false;
        }
        // For links, we don't need to track closing tags as we handle them as single units
      } else {
        // Opening tag
        if (tagName === 'strong' || tagName === 'b') {
          currentFormatting.bold = true;
        } else if (tagName === 'em' || tagName === 'i') {
          currentFormatting.italic = true;
        } else if (tagName === 'a') {
          // Handle link - find the closing </a> tag
          const linkStart = fullTag.length;
          const linkCloseIndex = remaining.indexOf('</a>', linkStart);

          if (linkCloseIndex !== -1) {
            const linkContent = remaining.substring(linkStart, linkCloseIndex);
            const linkText = cleanText(linkContent.replace(/<\/?[^>]+>/g, ''));

            if (linkText.trim()) {
              textRuns.push(new TextRun({
                text: linkText.trim(),
                color: '0000FF',
                underline: {},
                bold: currentFormatting.bold,
                italics: currentFormatting.italic
              }));
            }

            // Skip to after the closing </a> tag
            remaining = remaining.substring(linkCloseIndex + 4);
            continue;
          }
        }
      }

      remaining = remaining.substring(fullTag.length);
    } else {
      // No more matches, clean up remaining text
      if (remaining.trim()) {
        textRuns.push(new TextRun({
          text: cleanText(remaining),
          color: '000000',
          bold: currentFormatting.bold,
          italics: currentFormatting.italic
        }));
      }
      break;
    }
  }

  // If no formatting found, treat entire content as plain text
  if (textRuns.length === 0) {
    const plainText = cleanText(html);
    if (plainText) {
      textRuns.push(new TextRun({ text: plainText, color: '000000' }));
    }
  }

  return textRuns;
}

// Parse table content with colspan support
function parseTable(html: string): TableRow[] {
  const rows: TableRow[] = [];
  const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const cells: TableCell[] = [];
    const cellRegex = /<(td|th)([^>]*)>(.*?)<\/(td|th)>/gis;
    let cellMatch;

    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
      const attrs = cellMatch[2];
      const cellContent = cellMatch[3];

      // Parse colspan if present
      const colspanMatch = attrs.match(/colspan=["'](\d+)["']/);
      const colspan = colspanMatch ? parseInt(colspanMatch[1]) : 1;

      // Parse cell content with formatting
      const cellRuns = parseFormatting(cellContent);

      cells.push(
        new TableCell({
          children: [
            new Paragraph({
              children: cellRuns.length > 0 ? cellRuns : [new TextRun({ text: cleanText(cellContent) })],
              spacing: { after: 120 }
            })
          ],
          columnSpan: colspan
        })
      );
    }

    if (cells.length > 0) {
      rows.push(new TableRow({ children: cells }));
    }
  }

  return rows;
}

// Clean text from HTML tags and decode entities
function cleanText(html: string): string {
  // First decode HTML entities, then remove tags
  return html
    .replace(/&nbsp;/g, ' ')     // Replace non-breaking spaces
    .replace(/&/g, '&')      // Decode ampersand (must be first)
    .replace(/</g, '<')       // Decode less than
    .replace(/>/g, '>')       // Decode greater than
    .replace(/"/g, '"')     // Decode quote
    .replace(/&#39;/g, "'")      // Decode apostrophe
    .replace(/'/g, "'")     // Alternative apostrophe
    .replace(/<\/?[^>]+>/g, '')  // Remove HTML tags (must be last)
    .trim();
}
