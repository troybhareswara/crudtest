import mysql from 'mysql2/promise';

// Mengambil env, tetapi jika berisi 'localhost', paksa ubah ke '127.0.0.1'
const rawHost = process.env.DB_HOST || '127.0.0.1';
const host = rawHost === 'localhost' ? '127.0.0.1' : rawHost;

export const db = mysql.createPool({
  host: host,
  user: process.env.DB_USER || 'u317479555_test',
  password: process.env.DB_PASSWORD || '6;YqmINzsv=',
  database: process.env.DB_NAME || 'u317479555_db_crudtest',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});