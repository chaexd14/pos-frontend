/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '../lib/api/axios'

export const apiGet = async <T = any>(url: string, params?: any) => {
  const r = await axios.get<T>(url, { params })
  return r.data
}

export const apiPost = async <T = any>(url: string, body?: any) => {
  const r = await axios.post<T>(url, body)
  return r.data
}

export const apiPut = async <T = any>(url: string, body?: any) => {
  const r = await axios.put<T>(url, body)
  return r.data
}

export const apiDelete = async <T = any>(url: string) => {
  const r = await axios.delete<T>(url)
  return r.data
}
