import { apiPost, apiGet } from './apiClient'
import { User } from '../types'
import { authStorage } from '../lib/authStorage'

export const AuthService = {
  /**
   * Log in user and store authorization token.
   */
  login: async (email: string, password: string) => {
    const res = await apiPost<{ user: User; token?: string }>('/api/v1/auth/login', { email, password })
    if (res.token) {
      authStorage.setToken(res.token)
    }
    return res
  },

  /**
   * Log out user and destroy token.
   */
  logout: async () => {
    try {
      await apiPost('/api/v1/auth/logout')
    } finally {
      authStorage.clearToken()
    }
  },

  /**
   * Fetch currently authenticated user profiles.
   */
  currentUser: async () => {
    return apiGet<{ user: User }>('/api/v1/auth/me')
  },

  /**
   * Check if frontend has local session stored.
   */
  isAuthenticated: () => {
    return authStorage.isAuthenticated()
  }
}
