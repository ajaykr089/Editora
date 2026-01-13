# Media API Server

Standalone backend server for Rich Text Editor media management.

## Features

- Image & video upload
- MySQL database storage
- Media library with pagination
- Soft delete support
- CORS enabled for frontend integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize database:
```bash
npm run init-db
```

3. Start server:
```bash
npm start
```

Or use dev mode with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Upload Media
```
POST /api/media/upload
Content-Type: multipart/form-data

Body: file (image/video)
```

### Get Media Library
```
GET /api/media/library?page=1&limit=20
```

### Update Media
```
PATCH /api/media/library/:id
Content-Type: application/json

Body: { "alt_text": "...", "title": "...", "description": "..." }
```

### Delete Media
```
DELETE /api/media/library/:id
```

## Database Configuration

Edit `db.ts` to configure MySQL connection:
- Host: sql12.freesqldatabase.com
- Database: sql12814207
- User: sql12814207
- Port: 3306

## File Storage

Uploaded files are stored in `../../uploads/` directory.

## Server Port

Default: 3001

Change in `server.ts` if needed.
