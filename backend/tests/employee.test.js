import request from 'supertest';
import app from '../src/app.js';
import { getDatabaseConnection } from '../src/config/database.js';

describe('Employee API Endpoint Tests', () => {
  const sampleEmployee = {
    employee_code: 'EMP001',
    employee_name: 'John Doe',
    phone_number: '9876543210',
    designation: 'Software Engineer',
    department: 'IT'
  };

  describe('GET /employee', () => {
    it('should return empty list when no records exist', async () => {
      const res = await request(app).get('/employee');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: []
      });
    });

    it('should return all employee records', async () => {
      const db = await getDatabaseConnection();
      await db.run(
        `INSERT INTO Employee (employee_code, employee_name, phone_number, designation, department)
         VALUES (?, ?, ?, ?, ?)`,
        ['EMP001', 'John Doe', '9876543210', 'Software Engineer', 'IT']
      );

      const res = await request(app).get('/employee');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].employee_code).toBe('EMP001');
    });
  });

  describe('GET /employee/:id', () => {
    it('should return 400 for non-integer ID parameter', async () => {
      const res = await request(app).get('/employee/abc');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        success: false,
        message: 'Invalid employee identifier.'
      });
    });

    it('should return 400 for negative ID parameter', async () => {
      const res = await request(app).get('/employee/-5');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        success: false,
        message: 'Invalid employee identifier.'
      });
    });

    it('should return 404 for non-existent employee ID', async () => {
      const res = await request(app).get('/employee/999');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: 'Employee not found.'
      });
    });

    it('should return 200 and details for valid employee ID', async () => {
      const db = await getDatabaseConnection();
      const insert = await db.run(
        `INSERT INTO Employee (employee_code, employee_name, phone_number, designation, department)
         VALUES (?, ?, ?, ?, ?)`,
        ['EMP001', 'John Doe', '9876543210', 'Software Engineer', 'IT']
      );
      const id = insert.lastID;

      const res = await request(app).get(`/employee/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.employee_id).toBe(id);
      expect(res.body.data.employee_code).toBe('EMP001');
    });
  });

  describe('POST /employee', () => {
    it('should create employee record when request is valid', async () => {
      const res = await request(app)
        .post('/employee')
        .send(sampleEmployee);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Employee created successfully.');
      expect(res.body.data).toHaveProperty('employee_id');
      
      const db = await getDatabaseConnection();
      const dbRecord = await db.get('SELECT * FROM Employee WHERE employee_id = ?', [res.body.data.employee_id]);
      expect(dbRecord).toBeDefined();
      expect(dbRecord.employee_code).toBe('EMP001');
    });

    it('should return 400 validation error for missing field', async () => {
      const incomplete = { ...sampleEmployee };
      delete incomplete.employee_name;

      const res = await request(app)
        .post('/employee')
        .send(incomplete);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed.');
      expect(res.body.errors).toHaveProperty('employee_name');
    });

    it('should return 400 validation error for exceeding field limits', async () => {
      const overlimit = { 
        ...sampleEmployee, 
        employee_code: 'A'.repeat(51) // limit is 50
      };

      const res = await request(app)
        .post('/employee')
        .send(overlimit);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed.');
      expect(res.body.errors).toHaveProperty('employee_code');
    });

    it('should return 409 duplicate error when employee_code exists', async () => {
      const db = await getDatabaseConnection();
      await db.run(
        `INSERT INTO Employee (employee_code, employee_name, phone_number, designation, department)
         VALUES (?, ?, ?, ?, ?)`,
        ['EMP001', 'John Doe', '9876543210', 'Software Engineer', 'IT']
      );

      const res = await request(app)
        .post('/employee')
        .send(sampleEmployee);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Employee code already exists.');
      expect(res.body.errors).toHaveProperty('employee_code');
    });
  });

  describe('PUT /employee/:id', () => {
    it('should update employee record when request is valid', async () => {
      const db = await getDatabaseConnection();
      const insert = await db.run(
        `INSERT INTO Employee (employee_code, employee_name, phone_number, designation, department)
         VALUES (?, ?, ?, ?, ?)`,
        ['EMP001', 'John Doe', '9876543210', 'Software Engineer', 'IT']
      );
      const id = insert.lastID;

      const updateData = {
        employee_code: 'EMP001-MOD',
        employee_name: 'John Updated',
        phone_number: '1111111111',
        designation: 'Senior Engineer',
        department: 'Operations'
      };

      const res = await request(app)
        .put(`/employee/${id}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Employee updated successfully.');

      const dbRecord = await db.get('SELECT * FROM Employee WHERE employee_id = ?', [id]);
      expect(dbRecord.employee_name).toBe('John Updated');
      expect(dbRecord.employee_code).toBe('EMP001-MOD');
    });

    it('should return 404 when updating non-existent employee ID', async () => {
      const res = await request(app)
        .put('/employee/999')
        .send(sampleEmployee);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: 'Employee not found.'
      });
    });

    it('should return 409 unique code error when changing code to active duplicate', async () => {
      const db = await getDatabaseConnection();
      await db.run(
        `INSERT INTO Employee (employee_code, employee_name, phone_number, designation, department)
         VALUES (?, ?, ?, ?, ?)`,
        ['EMP001', 'John Doe', '9876543210', 'Software Engineer', 'IT']
      );
      const insert2 = await db.run(
        `INSERT INTO Employee (employee_code, employee_name, phone_number, designation, department)
         VALUES (?, ?, ?, ?, ?)`,
        ['EMP002', 'Jane Doe', '9876543211', 'HR Lead', 'HR']
      );
      const id2 = insert2.lastID;

      const conflictingUpdate = {
        employee_code: 'EMP001', // already used
        employee_name: 'Jane Updated',
        phone_number: '9876543211',
        designation: 'HR Lead',
        department: 'HR'
      };

      const res = await request(app)
        .put(`/employee/${id2}`)
        .send(conflictingUpdate);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Employee code already exists.');
    });
  });

  describe('DELETE /employee/:id', () => {
    it('should delete employee successfully and return 200', async () => {
      const db = await getDatabaseConnection();
      const insert = await db.run(
        `INSERT INTO Employee (employee_code, employee_name, phone_number, designation, department)
         VALUES (?, ?, ?, ?, ?)`,
        ['EMP001', 'John Doe', '9876543210', 'Software Engineer', 'IT']
      );
      const id = insert.lastID;

      const res = await request(app).delete(`/employee/${id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: 'Employee deleted successfully.'
      });

      const dbRecord = await db.get('SELECT * FROM Employee WHERE employee_id = ?', [id]);
      expect(dbRecord).toBeUndefined();
    });

    it('should return 404 when deleting non-existent ID', async () => {
      const res = await request(app).delete('/employee/999');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: 'Employee not found.'
      });
    });
  });
});
