/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react'

export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: {
    status?: number
    message: string
    errors?: Record<string, string[]> | null
  } | null
  success: boolean
}

/**
 * A hook for managing asynchronous operations (e.g. form submissions, mutations).
 */
export const useApi = <T = any, Args extends any[] = any[]>(
  apiFunc: (...args: Args) => Promise<T>
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  })

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState({
        data: null,
        loading: true,
        error: null,
        success: false,
      })

      try {
        const result = await apiFunc(...args)
        setState({
          data: result,
          loading: false,
          error: null,
          success: true,
        })
        return result
      } catch (err: any) {
        const errorState = {
          status: err.status,
          message: err.message || 'An error occurred during the request',
          errors: err.errors,
        }
        setState({
          data: null,
          loading: false,
          error: errorState,
          success: false,
        })
        return null
      }
    },
    [apiFunc]
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
