import { AppError } from './error.middleware.js';

export function validateEmployeeBody(req, res, next) {
  const { employee_code, employee_name, phone_number, designation, department } = req.body;
  const errors = {};

  // Helper to validate required string fields and character limits
  const validateField = (field, name, maxLength) => {
    if (field === undefined || field === null) {
      errors[name] = [`${name.replace('_', ' ')} is required.`];
    } else if (typeof field !== 'string') {
      errors[name] = [`${name.replace('_', ' ')} must be a string.`];
    } else if (field.trim() === '') {
      errors[name] = [`${name.replace('_', ' ')} is required.`];
    } else if (field.length > maxLength) {
      errors[name] = [`${name.replace('_', ' ')} must not exceed ${maxLength} characters.`];
    }
  };

  validateField(employee_code, 'employee_code', 50);
  validateField(employee_name, 'employee_name', 100);
  validateField(phone_number, 'phone_number', 20);
  validateField(designation, 'designation', 100);
  validateField(department, 'department', 100);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  // Clean request body data before controller handles it
  req.body = {
    employee_code: employee_code.trim(),
    employee_name: employee_name.trim(),
    phone_number: phone_number.trim(),
    designation: designation.trim(),
    department: department.trim()
  };

  next();
}

export function validateEmployeeId(req, res, next) {
  const idStr = req.params.id;
  
  // Verify id is numeric and positive
  const idNum = Number(idStr);
  if (!idStr || isNaN(idNum) || !Number.isInteger(idNum) || idNum <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee identifier.'
    });
  }

  // Bind parsed integer back onto req.params
  req.params.id = idNum;
  next();
}
