import { apiGet, apiPost, apiPut } from './apiClient'
import { Order } from '../types'

export type CreateOrderParams = {
  payment_method: string
  order_items: {
    item_id: number
    quantity: number
    price: number
  }[]
}

export const OrdersService = {
  /**
   * Fetch order transactions history.
   */
  getOrders: async (params?: { page?: number; per_page?: number; status?: string }) => {
    return apiGet<Order[]>('/api/v1/orders', params)
  },

  /**
   * Get details of a single order.
   */
  getOrder: async (id: number | string) => {
    return apiGet<Order>(`/api/v1/orders/${id}`)
  },

  /**
   * Create/submit a new order (checkout transaction).
   */
  createOrder: async (orderParams: CreateOrderParams) => {
    return apiPost<Order>('/api/v1/orders', { order: orderParams })
  },

  /**
   * Cancel or refund an existing order.
   */
  updateOrderStatus: async (id: number | string, status: 'completed' | 'cancelled' | 'refunded') => {
    return apiPut<Order>(`/api/v1/orders/${id}`, { order: { status } })
  }
}
