import { getDatabaseConnection, closeDatabaseConnection } from '../src/config/database.js';

beforeAll(async () => {
  // Direct database paths to local memory for test runs
  process.env.DATABASE_PATH = ':memory:';
  process.env.NODE_ENV = 'test';
  
  // Establish connection and run migrations
  await getDatabaseConnection();
});

beforeEach(async () => {
  const db = await getDatabaseConnection();
  // Clear records to provide test isolation
  await db.exec('DELETE FROM Employee;');
  await db.exec("DELETE FROM sqlite_sequence WHERE name='Employee';");
});

afterAll(async () => {
  // Close database connections gracefully
  await closeDatabaseConnection();
});
