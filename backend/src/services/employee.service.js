import { getDatabaseConnection } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export async function getAllEmployees() {
  const db = await getDatabaseConnection();
  // Fetch all columns, ordering by employee_id as standard
  return await db.all('SELECT * FROM Employee ORDER BY employee_id ASC;');
}

export async function getEmployeeById(id) {
  const db = await getDatabaseConnection();
  const employee = await db.get('SELECT * FROM Employee WHERE employee_id = ?;', [id]);
  return employee || null;
}

export async function getEmployeeByCode(code) {
  const db = await getDatabaseConnection();
  const employee = await db.get('SELECT * FROM Employee WHERE employee_code = ?;', [code]);
  return employee || null;
}

export async function createEmployee(data) {
  const db = await getDatabaseConnection();
  const { employee_code, employee_name, phone_number, designation, department } = data;

  const now = new Date().toISOString();

  try {
    const result = await db.run(
      `INSERT INTO Employee (employee_code, employee_name, phone_number, designation, department, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [employee_code, employee_name, phone_number, designation, department, now, now]
    );
    return result.lastID;
  } catch (error) {
    // Check if error is due to UNIQUE constraint on employee_code
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      throw new AppError('Employee code already exists.', 409, {
        employee_code: ['Employee code already exists.']
      });
    }
    throw error;
  }
}

export async function updateEmployee(id, data) {
  const db = await getDatabaseConnection();
  const { employee_code, employee_name, phone_number, designation, department } = data;

  // First verify if employee exists
  const existing = await getEmployeeById(id);
  if (!existing) {
    return null;
  }

  const now = new Date().toISOString();

  try {
    const result = await db.run(
      `UPDATE Employee 
       SET employee_code = ?, employee_name = ?, phone_number = ?, designation = ?, department = ?, updated_at = ?
       WHERE employee_id = ?;`,
      [employee_code, employee_name, phone_number, designation, department, now, id]
    );
    return result.changes > 0;
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      throw new AppError('Employee code already exists.', 409, {
        employee_code: ['Employee code already exists.']
      });
    }
    throw error;
  }
}

export async function deleteEmployee(id) {
  const db = await getDatabaseConnection();

  // First verify if employee exists
  const existing = await getEmployeeById(id);
  if (!existing) {
    return null;
  }

  const result = await db.run('DELETE FROM Employee WHERE employee_id = ?;', [id]);
  return result.changes > 0;
}
