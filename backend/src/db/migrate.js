import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('Running database migrations...');
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  // If using SQLite or PostgreSQL, exec runs whole script or statements
  if (db.getDbEngine() === 'sqlite') {
    await db.exec(sql);
  } else {
    // For PostgreSQL, execute commands
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await db.query(statement);
    }
  }

  console.log('✓ Database schema up to date.');
}

export default runMigrations;

