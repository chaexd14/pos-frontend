/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types'
import { AuthService } from '../services/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const checkSession = async () => {
    if (!AuthService.isAuthenticated()) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const res = await AuthService.currentUser()
      setUser(res.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await AuthService.login(email, password)
      setUser(res.user)
      return res
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await AuthService.logout()
    } finally {
      setUser(null)
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
