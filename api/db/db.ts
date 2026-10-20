import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "kfr8m0.h.filess.io",
  user: process.env.DB_USER ?? "editora_playrange",
  password: process.env.DB_PASSWORD ?? "bd1a18cfa7d240afdd27746cad80f22bb533ed2b",
  database: process.env.DB_NAME ?? "editora_playrange",
  port: Number(process.env.DB_PORT ?? 61002),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
