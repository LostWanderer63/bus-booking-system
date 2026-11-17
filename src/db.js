const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bus_booking',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
});

function log(operation, table, details) {
  console.log(`[DB] ${new Date().toISOString()} ${operation} ${table} ${JSON.stringify(details)}`);
}

async function testConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    console.log(`[DB] Connected to MySQL database "${pool.pool.config.connectionConfig.database}"`);
  } finally {
    conn.release();
  }
}

async function closePool() {
  await pool.end();
  console.log('[DB] Connection pool closed');
}

module.exports = { pool, log, testConnection, closePool };
