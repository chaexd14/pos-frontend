export type ApiResponse<T> = {
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export type User = {
  id: number
  email: string
  name: string
  role: 'admin' | 'cashier' | 'manager'
  created_at: string
  updated_at: string
}

export type Category = {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export type ItemType = 'inventory' | 'finished'

export type Item = {
  id: number
  name: string
  description?: string
  price: number
  type: ItemType
  quantity: number // stock level
  category_id?: number
  category?: Category
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: number
  item_id: number
  order_id: number
  quantity: number
  price: number
  item?: Item
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded'

export type Order = {
  id: number
  total_amount: number
  status: OrderStatus
  payment_method: string
  order_items: OrderItem[]
  created_at: string
  updated_at: string
}

export type SalesSummary = {
  date: string
  amount: number
}

export type DashboardStats = {
  total_sales: number
  orders_count: number
  items_count: number
  low_stock_count: number
  sales_history: SalesSummary[]
}
