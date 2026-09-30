import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { login as loginRequest } from '../services/authApi'
import { getStoredToken, setStoredToken, setUnauthorizedHandler } from '../services/apiClient'
import { AuthContext, type AuthContextValue } from './AuthContext'

const USERNAME_STORAGE_KEY = 'rohit-sweets-admin-username'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from localStorage on first load.
  useEffect(() => {
    const token = getStoredToken()
    const storedUsername = localStorage.getItem(USERNAME_STORAGE_KEY)
    if (token && storedUsername) {
      setUsername(storedUsername)
    }
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    setStoredToken(null)
    localStorage.removeItem(USERNAME_STORAGE_KEY)
    setUsername(null)
  }, [])

  // Wire apiClient's 401 handler to log out automatically on an expired/invalid token.
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  const login = useCallback(async (usernameInput: string, password: string) => {
    const result = await loginRequest(usernameInput, password)
    setStoredToken(result.token)
    localStorage.setItem(USERNAME_STORAGE_KEY, result.username)
    setUsername(result.username)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: username !== null, username, isLoading, login, logout }),
    [username, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}