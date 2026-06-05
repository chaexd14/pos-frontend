import axios from 'axios'
import { API_BASE_URL } from '../config'
import { authStorage } from '../authStorage'
import { getCsrfToken } from './csrf'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request Interceptor: Inject Auth Token and CSRF Token
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Attach JWT Authorization token if present
    const token = authStorage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 2. Attach Rails CSRF token for non-GET requests (e.g. session-based CSRF checks)
    if (config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
      const csrfToken = getCsrfToken()
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Capture Auth Tokens and Handle Token Expiry
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if the backend returns a new authorization token in the headers
    const authHeader = response.headers['authorization']
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      authStorage.setToken(token)
    }
    return response
  },
  (error) => {
    const status = error.response ? error.response.status : null

    if (status === 401) {
      // Clear token since authentication has expired or is invalid
      authStorage.clearToken()
      
      // Optional: Redirect to login or dispatch a global unauthorized event
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        // We can let the useAuth context or application routing handle this,
        // or trigger a redirect:
        // window.location.href = '/login'
      }
    }

    // Standardize error structure before rejecting
    const apiError = {
      status,
      message: error.response?.data?.message || error.response?.data?.error || error.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors || null,
      originalError: error,
    }

    return Promise.reject(apiError)
  }
)

export default axiosInstance
