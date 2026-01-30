import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "kfr8m0.h.filess.io",
  user: "editora_playrange",
  password: "bd1a18cfa7d240afdd27746cad80f22bb533ed2b",
  database: "editora_playrange",
  port: 61002,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
