import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let dbInstance = null;

export async function getDatabaseConnection() {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = process.env.DATABASE_PATH || 'database.sqlite';

  // Open the SQLite database
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await dbInstance.exec('PRAGMA foreign_keys = ON;');

  // Initialize Schema
  await initializeSchema(dbInstance);

  return dbInstance;
}

async function initializeSchema(db) {
  // Create Employee Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Employee (
      employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_code TEXT NOT NULL UNIQUE,
      employee_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      designation TEXT NOT NULL,
      department TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Unique Index
  await db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS UX_Employee_Code ON Employee(employee_code);
  `);

  // Create Search Optimization Indexes
  await db.exec(`
    CREATE INDEX IF NOT EXISTS IX_Employee_Name ON Employee(employee_name);
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS IX_Department ON Employee(department);
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS IX_Designation ON Employee(designation);
  `);
}

export async function closeDatabaseConnection() {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}
