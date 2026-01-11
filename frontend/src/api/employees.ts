import api from './https';

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  position?: string | null;
  department?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateEmployeePayload = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

export async function fetchEmployees(): Promise<Employee[]> {
  const { data } = await api.get<Employee[]>('/employees');
  return data;
}

export async function fetchEmployeeById(id: number): Promise<Employee> {
  const response = await api.get<Employee>(`/employees/${id}`);
  return response.data;
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  const { data } = await api.post<Employee>('/employees', payload);
  return data;
}

export async function updateEmployee(id: number, payload: UpdateEmployeePayload): Promise<Employee> {
  const { data } = await api.patch<Employee>(`/employees/${id}`, payload);
  return data;
}

export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`/employees/${id}`);
}
