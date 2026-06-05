/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Item, ItemType } from '../types'
import { ItemsService } from '../services/items'

export type UseItemsFilters = {
  search?: string
  type?: ItemType
  page?: number
  per_page?: number
}

export const useItems = (initialFilters: UseItemsFilters = {}) => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const [filters, setFilters] = useState<UseItemsFilters>({
    page: 1,
    per_page: 10,
    ...initialFilters,
  })

  const fetchItems = useCallback(async () => {
    // Wrap state resetting in a Promise to avoid synchronous execution during useEffect
    Promise.resolve().then(() => {
      setLoading(true)
      setError(null)
    })

    try {
      const data = await ItemsService.getItems(filters)
      setItems(data)
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems()
  }, [fetchItems])

  const updateFilters = useCallback((newFilters: Partial<UseItemsFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }, [])

  const deleteItem = useCallback(async (id: number | string) => {
    try {
      await ItemsService.deleteItem(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
      return true
    } catch (err) {
      setError(err)
      return false
    }
  }, [])

  const reload = useCallback(() => {
    fetchItems()
  }, [fetchItems])

  return {
    items,
    loading,
    error,
    filters,
    updateFilters,
    deleteItem,
    reload,
  }
}
