import app from './app.js';
import { getDatabaseConnection, closeDatabaseConnection } from './config/database.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Ensure database connection and initial schema migration runs before start
    await getDatabaseConnection();
    if (process.env.NODE_ENV !== 'test') {
      console.log('Database initialized successfully.');
    }

    const server = app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`Server is running on port ${PORT}`);
      }
    });

    const gracefulShutdown = (signal) => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`Received ${signal}, shutting down server gracefully...`);
      }
      server.close(async () => {
        await closeDatabaseConnection();
        if (process.env.NODE_ENV !== 'test') {
          console.log('Database closed. Server shutdown completed.');
        }
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error('Error starting the database/server:', error);
    process.exit(1);
  }
}

startServer();
