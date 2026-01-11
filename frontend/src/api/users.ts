import api from './https'; // o mesmo axios que você usa no login etc.

export type UserRole = 'ADMIN' | 'VIEWER';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export async function fetchUsers(): Promise<AppUser[]> {
  const res = await api.get<AppUser[]>('/users');
  return res.data;
}

export async function createUser(payload: CreateUserPayload): Promise<AppUser> {
  const res = await api.post<AppUser>('/users', payload);
  return res.data;
}
