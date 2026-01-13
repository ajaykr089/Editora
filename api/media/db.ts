import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12814207',
  password: 'vQAeNnK9u6',
  database: 'sql12814207',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
