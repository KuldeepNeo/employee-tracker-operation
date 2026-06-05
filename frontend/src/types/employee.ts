export interface Employee {
  employee_id?: number;
  employee_code: string;
  employee_name: string;
  phone_number: string;
  designation: string;
  department: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
