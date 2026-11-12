import app from './app.js';
import { env } from './config/env.js';
import { initDb } from './config/db.js';
import { runMigrations } from './db/migrate.js';
import { seedDatabase } from './db/seed.js';

async function startServer() {
  try {
    console.log('--- Starting ReConnect Backend Server ---');

    // 1. Initialize Database (Postgres if configured, or SQLite automatically)
    await initDb();

    // 2. Run Database Migrations
    await runMigrations();

    // 3. Seed initial ADTU Campus dataset if database is empty
    await seedDatabase();

    // 4. Start HTTP Server
    const server = app.listen(env.port, () => {
      console.log(`✓ ReConnect Server running on port ${env.port}`);
      console.log(`✓ API Endpoint: http://localhost:${env.port}/api`);
      console.log(`✓ Health Check: http://localhost:${env.port}/api/health`);
    });

    const shutdown = () => {
      console.log('\nGracefully shutting down server...');
      server.close(() => {
        console.log('Server terminated.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Fatal Server Startup Error:', err);
    process.exit(1);
  }
}

startServer();

