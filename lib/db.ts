// lib/db.ts
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_crudtest',
  port: Number(process.env.DB_PORT) || 3306, // 👈 Fleksibel membaca dari .env
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});