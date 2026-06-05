import { apiGet } from './apiClient'
import { DashboardStats } from '../types'

export const DashboardService = {
  /**
   * Fetch core metrics and sales history for the dashboard view.
   */
  getStats: async (params?: { range?: 'today' | 'week' | 'month' | 'year' }) => {
    return apiGet<DashboardStats>('/api/v1/dashboard/stats', params)
  }
}
