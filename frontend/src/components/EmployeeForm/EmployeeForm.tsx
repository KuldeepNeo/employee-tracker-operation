import React, { useState, useEffect } from 'react';
import { Employee } from '../../types/employee';
import styles from './EmployeeForm.module.css';

interface EmployeeFormProps {
  initialData?: Employee;
  onSubmit: (data: Employee) => Promise<boolean>;
  onCancel: () => void;
  backendErrors?: Record<string, string[]> | null;
  clearBackendErrors?: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  backendErrors,
  clearBackendErrors
}) => {
  const [formData, setFormData] = useState<Employee>({
    employee_code: '',
    employee_name: '',
    phone_number: '',
    designation: '',
    department: ''
  });

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (localErrors[name]) {
      setLocalErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }

    if (backendErrors && clearBackendErrors) {
      clearBackendErrors();
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.employee_code.trim()) {
      errors.employee_code = 'Employee code is required.';
    } else if (formData.employee_code.length > 50) {
      errors.employee_code = 'Employee code must not exceed 50 characters.';
    }

    if (!formData.employee_name.trim()) {
      errors.employee_name = 'Employee name is required.';
    } else if (formData.employee_name.length > 100) {
      errors.employee_name = 'Employee name must not exceed 100 characters.';
    }

    if (!formData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required.';
    } else if (formData.phone_number.length > 20) {
      errors.phone_number = 'Phone number must not exceed 20 characters.';
    }

    if (!formData.designation.trim()) {
      errors.designation = 'Designation is required.';
    } else if (formData.designation.length > 100) {
      errors.designation = 'Designation must not exceed 100 characters.';
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required.';
    } else if (formData.department.length > 100) {
      errors.department = 'Department must not exceed 100 characters.';
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    const success = await onSubmit(formData);
    setSubmitting(false);

    if (success) {
      // Form fields will be cleared/handled on model close
    }
  };

  // Merge local and backend validation errors
  const getFieldError = (fieldName: string): string | undefined => {
    if (localErrors[fieldName]) {
      return localErrors[fieldName];
    }
    if (backendErrors && backendErrors[fieldName] && backendErrors[fieldName][0]) {
      return backendErrors[fieldName][0];
    }
    return undefined;
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="employee_code">Employee Code / ID</label>
        <input
          type="text"
          id="employee_code"
          name="employee_code"
          value={formData.employee_code}
          onChange={handleChange}
          disabled={!!initialData || submitting} // Don't allow changing employee code on edit
          className={`${styles.input} ${getFieldError('employee_code') ? styles.inputError : ''}`}
          placeholder="e.g. EMP001"
        />
        {getFieldError('employee_code') && (
          <span className={styles.errorText}>{getFieldError('employee_code')}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="employee_name">Full Name</label>
        <input
          type="text"
          id="employee_name"
          name="employee_name"
          value={formData.employee_name}
          onChange={handleChange}
          disabled={submitting}
          className={`${styles.input} ${getFieldError('employee_name') ? styles.inputError : ''}`}
          placeholder="e.g. John Doe"
        />
        {getFieldError('employee_name') && (
          <span className={styles.errorText}>{getFieldError('employee_name')}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="phone_number">Phone Number</label>
        <input
          type="text"
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          disabled={submitting}
          className={`${styles.input} ${getFieldError('phone_number') ? styles.inputError : ''}`}
          placeholder="e.g. 9876543210"
        />
        {getFieldError('phone_number') && (
          <span className={styles.errorText}>{getFieldError('phone_number')}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="designation">Designation</label>
        <input
          type="text"
          id="designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          disabled={submitting}
          className={`${styles.input} ${getFieldError('designation') ? styles.inputError : ''}`}
          placeholder="e.g. Software Engineer"
        />
        {getFieldError('designation') && (
          <span className={styles.errorText}>{getFieldError('designation')}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="department">Department</label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          disabled={submitting}
          className={`${styles.input} ${getFieldError('department') ? styles.inputError : ''}`}
        >
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
        </select>
        {getFieldError('department') && (
          <span className={styles.errorText}>{getFieldError('department')}</span>
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className={`${styles.btn} ${styles.btnSecondary}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={`${styles.btn} ${styles.btnPrimary}`}
        >
          {submitting ? 'Saving...' : initialData ? 'Update Record' : 'Create Record'}
        </button>
      </div>
    </form>
  );
};
