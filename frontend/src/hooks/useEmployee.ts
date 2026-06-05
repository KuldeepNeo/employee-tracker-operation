import { useState, useEffect, useCallback } from 'react';
import { Employee } from '../types/employee';
import { EmployeeService } from '../services/employee.service';

export function useEmployee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EmployeeService.getEmployees();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve employee records.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addEmployee = async (employee: Employee): Promise<boolean> => {
    setError(null);
    setValidationErrors(null);
    try {
      await EmployeeService.createEmployee(employee);
      await fetchEmployees();
      return true;
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors);
      } else {
        setError(err.message || 'Failed to create employee.');
      }
      return false;
    }
  };

  const editEmployee = async (id: number, employee: Employee): Promise<boolean> => {
    setError(null);
    setValidationErrors(null);
    try {
      await EmployeeService.updateEmployee(id, employee);
      await fetchEmployees();
      return true;
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors);
      } else {
        setError(err.message || 'Failed to update employee.');
      }
      return false;
    }
  };

  const removeEmployee = async (id: number): Promise<boolean> => {
    setError(null);
    try {
      await EmployeeService.deleteEmployee(id);
      await fetchEmployees();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete employee.');
      return false;
    }
  };

  const clearValidationErrors = () => {
    setValidationErrors(null);
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    validationErrors,
    fetchEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
    clearValidationErrors
  };
}
