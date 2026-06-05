/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { apiGet } from '../services/apiClient'

export const useFetch = <T = any>(url: string, params?: any) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const serializedParams = JSON.stringify(params)

  useEffect(() => {
    let mounted = true

    // Asynchronously set loading to true to prevent cascading synchronous renders in React 19
    Promise.resolve().then(() => {
      if (mounted) {
        setLoading(true)
      }
    })

    apiGet<T>(url, params)
      .then((res) => {
        if (mounted) setData(res)
      })
      .catch((err) => {
        if (mounted) setError(err)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, serializedParams])

  return { data, loading, error }
}
