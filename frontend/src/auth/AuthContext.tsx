import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { clearToken, getToken, setToken, subscribeToken } from './tokenStore'
import { parseJwtUser } from './jwt'
import type { AuthUser } from './jwt'
import * as authApi from '../services/authApi'

export type AuthState = {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  role: AuthUser['role']
}

export type AuthContextValue = AuthState & {
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

function computeState(token: string | null): AuthState {
  const user = token ? parseJwtUser(token) : null
  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    role: user?.role ?? null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => computeState(getToken()))

  useEffect(() => {
    return subscribeToken((token) => setState(computeState(token)))
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const { accessToken } = await authApi.login(username, password)
    setToken(accessToken)
  }, [])

  const register = useCallback(async (username: string, password: string) => {
    const { accessToken } = await authApi.register(username, password)
    setToken(accessToken)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      clearToken()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      register,
      logout,
    }),
    [state, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

