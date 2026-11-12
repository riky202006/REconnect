import app from './app.js';
import { env } from './config/env.js';
import { connectDb, disconnectDb } from './config/db.js';
import { seedDatabase } from './db/seed.js';

async function startServer() {
  try {
    console.log('--- Starting ReConnect Backend Server ---');

    // 1. Initialize MongoDB Atlas connection (server starts only after connection succeeds)
    await connectDb();

    // 2. Seed initial ADTU Campus dataset if MongoDB collections are empty
    await seedDatabase();

    // 3. Start HTTP Server
    const server = app.listen(env.port, () => {
      console.log(`✓ ReConnect Server running on port ${env.port}`);
      console.log(`✓ Database: MongoDB Atlas (Mongoose ODM)`);
      console.log(`✓ API Endpoint: http://localhost:${env.port}/api`);
      console.log(`✓ Health Check: http://localhost:${env.port}/api/health`);
    });

    const shutdown = async () => {
      console.log('\nGracefully shutting down server...');
      server.close(async () => {
        await disconnectDb();
        console.log('Server terminated.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Fatal Server Startup Error:', err.message);
    process.exit(1);
  }
}

startServer();
