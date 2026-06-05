import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller.js';
import { validateEmployeeBody, validateEmployeeId } from '../middleware/validation.middleware.js';

const router = Router();

// Retrieve all employees
router.get('/', employeeController.getEmployees);

// Create new employee
router.post('/', validateEmployeeBody, employeeController.createEmployee);

// Retrieve single employee by ID
router.get('/:id', validateEmployeeId, employeeController.getEmployee);

// Update existing employee by ID
router.put('/:id', validateEmployeeId, validateEmployeeBody, employeeController.updateEmployee);

// Delete employee record by ID
router.delete('/:id', validateEmployeeId, employeeController.deleteEmployee);

export default router;
