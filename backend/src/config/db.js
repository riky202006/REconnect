import { env } from './env.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

let pgPool = null;
let sqliteDb = null;
let activeType = 'sqlite';

/**
 * Initialize Database connection.
 * Connects to PostgreSQL if configured, or falls back seamlessly to SQLite.
 */
export async function initDb() {
  const shouldTryPostgres =
    env.dbType === 'postgres' ||
    (env.dbType === 'auto' && Boolean(env.databaseUrl));

  if (shouldTryPostgres && env.databaseUrl) {
    try {
      console.log('Attempting PostgreSQL connection...');
      const pool = new Pool({
        connectionString: env.databaseUrl,
        connectionTimeoutMillis: 3000
      });

      // Test connection
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();

      pgPool = pool;
      activeType = 'postgres';
      console.log('✓ Connected successfully to PostgreSQL database.');
      return;
    } catch (err) {
      console.warn('⚠️ Could not connect to PostgreSQL:', err.message);
      if (env.dbType === 'postgres') {
        throw new Error(`PostgreSQL connection failed: ${err.message}`);
      }
      console.log('Falling back to embedded SQLite database...');
    }
  }

  // SQLite Initialization
  try {
    const { DatabaseSync } = await import('node:sqlite');
    const dataDir = path.resolve(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.resolve(dataDir, 'reconnect.db');
    sqliteDb = new DatabaseSync(dbPath);

    // Optimize SQLite with WAL mode and foreign key enforcement
    sqliteDb.exec('PRAGMA journal_mode = WAL;');
    sqliteDb.exec('PRAGMA foreign_keys = ON;');

    activeType = 'sqlite';
    console.log(`✓ Using embedded SQLite database at: ${dbPath}`);
  } catch (err) {
    console.error('Failed to initialize SQLite database:', err);
    throw err;
  }
}

/**
 * Unified database query method.
 * Uses standard PostgreSQL query parameter syntax ($1, $2, ...)
 * and transparently adapts for SQLite.
 *
 * @param {string} text - SQL Query text
 * @param {Array} params - Array of parameter values
 * @returns {Promise<{ rows: Array, rowCount: number }>}
 */
export async function query(text, params = []) {
  if (activeType === 'postgres') {
    if (!pgPool) {
      throw new Error('Database not initialized. Call initDb() first.');
    }
    const res = await pgPool.query(text, params);
    return {
      rows: res.rows,
      rowCount: res.rowCount ?? res.rows.length
    };
  }

  // SQLite execution
  if (!sqliteDb) {
    throw new Error('Database not initialized. Call initDb() first.');
  }

  // Convert $1, $2, ... placeholders to ? for SQLite
  const sqliteSql = text.replace(/\$(\d+)/g, '?');

  // Convert boolean values to 1 or 0 for SQLite compatibility
  const formattedParams = params.map((p) => {
    if (typeof p === 'boolean') return p ? 1 : 0;
    if (p !== null && typeof p === 'object' && !(p instanceof Date)) {
      return JSON.stringify(p);
    }
    return p;
  });

  const trimmed = text.trim();
  const isSelectOrReturning =
    /^\s*SELECT/i.test(trimmed) || /RETURNING/i.test(trimmed);

  try {
    const stmt = sqliteDb.prepare(sqliteSql);

    if (isSelectOrReturning) {
      const rows = stmt.all(...formattedParams);
      // Clean Object: null prototype if present
      const cleanRows = rows.map((r) => ({ ...r }));
      return {
        rows: cleanRows,
        rowCount: cleanRows.length
      };
    } else {
      const info = stmt.run(...formattedParams);
      return {
        rows: [],
        rowCount: info.changes ?? 0
      };
    }
  } catch (err) {
    console.error('SQL Execution Error:', err.message, '\nQuery:', sqliteSql, '\nParams:', formattedParams);
    throw err;
  }
}

/**
 * Execute raw SQL script (e.g. migration DDL).
 */
export async function exec(sqlText) {
  if (activeType === 'postgres') {
    await pgPool.query(sqlText);
  } else {
    sqliteDb.exec(sqlText);
  }
}

/**
 * Get active database engine type ('postgres' or 'sqlite')
 */
export function getDbEngine() {
  return activeType;
}

export const db = {
  initDb,
  query,
  exec,
  getDbEngine
};

export default db;

