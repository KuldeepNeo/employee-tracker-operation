import { Employee, ApiSuccessResponse } from '../types/employee';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/employee';

async function handleResponse<T>(response: Response): Promise<T> {
  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const errorMsg = data.message || 'An unexpected error occurred.';
    const error = new Error(errorMsg);
    (error as any).errors = data.errors;
    (error as any).status = response.status;
    throw error;
  }
  return data as T;
}

export const EmployeeService = {
  async getEmployees(): Promise<Employee[]> {
    const response = await fetch(BASE_URL);
    const result = await handleResponse<ApiSuccessResponse<Employee[]>>(response);
    return result.data;
  },

  async getEmployeeById(id: number): Promise<Employee> {
    const response = await fetch(`${BASE_URL}/${id}`);
    const result = await handleResponse<ApiSuccessResponse<Employee>>(response);
    return result.data;
  },

  async createEmployee(employee: Employee): Promise<number> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    const result = await handleResponse<ApiSuccessResponse<{ employee_id: number }>>(response);
    return result.data.employee_id;
  },

  async updateEmployee(id: number, employee: Employee): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    await handleResponse<ApiSuccessResponse<null>>(response);
  },

  async deleteEmployee(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    await handleResponse<ApiSuccessResponse<null>>(response);
  }
};
