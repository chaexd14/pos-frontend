import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'
import { Item, Category } from '../types'

export const ItemsService = {
  /**
   * Fetch all items with support for search, pagination, and type filtering.
   */
  getItems: async (params?: {
    search?: string
    type?: 'inventory' | 'finished'
    page?: number
    per_page?: number
  }) => {
    return apiGet<Item[]>('/api/v1/items', params)
  },

  /**
   * Fetch a single item by ID.
   */
  getItem: async (id: number | string) => {
    return apiGet<Item>(`/api/v1/items/${id}`)
  },

  /**
   * Create a new item (product or inventory).
   */
  createItem: async (itemData: Partial<Item>) => {
    return apiPost<Item>('/api/v1/items', { item: itemData })
  },

  /**
   * Update an existing item by ID.
   */
  updateItem: async (id: number | string, itemData: Partial<Item>) => {
    return apiPut<Item>(`/api/v1/items/${id}`, { item: itemData })
  },

  /**
   * Delete an item by ID.
   */
  deleteItem: async (id: number | string) => {
    return apiDelete(`/api/v1/items/${id}`)
  },

  /**
   * Fetch categories list for assigning to items.
   */
  getCategories: async () => {
    return apiGet<Category[]>('/api/v1/categories')
  }
}
