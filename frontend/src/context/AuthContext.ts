import { createContext } from 'react'

export type AuthContextValue = {
  isAuthenticated: boolean
  username: string | null
  /** true while restoring/validating a session on first load */
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)