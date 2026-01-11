import api from './https';

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name?: string;
    role: 'ADMIN' | 'VIEWER';
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  return data;
}
