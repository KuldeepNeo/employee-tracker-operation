import * as employeeService from '../services/employee.service.js';

export async function getEmployees(req, res, next) {
  try {
    const employees = await employeeService.getAllEmployees();
    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    next(error);
  }
}

export async function getEmployee(req, res, next) {
  try {
    const id = req.params.id;
    const employee = await employeeService.getEmployeeById(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
}

export async function createEmployee(req, res, next) {
  try {
    const newId = await employeeService.createEmployee(req.body);
    res.status(201).json({
      success: true,
      message: 'Employee created successfully.',
      data: {
        employee_id: newId
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateEmployee(req, res, next) {
  try {
    const id = req.params.id;
    const updated = await employeeService.updateEmployee(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteEmployee(req, res, next) {
  try {
    const id = req.params.id;
    const deleted = await employeeService.deleteEmployee(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}
