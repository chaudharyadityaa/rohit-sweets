import { apiRequest } from './apiClient'

export type LoginResponse = {
  token: string
  username: string
  expiresInMinutes: number
}

export function login(username: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: { username, password },
  })
}