import pool from './db';
import fs from 'fs';
import path from 'path';

async function initDatabase() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    // Comments are dropped first: a ';' inside one must not end a statement.
    const statements = schema.replace(/^\s*--.*$/gm, '').split(';').filter(s => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await pool.execute(statement);
      }
    }

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initDatabase();
