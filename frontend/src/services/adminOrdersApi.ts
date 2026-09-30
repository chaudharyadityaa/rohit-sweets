import { apiRequest } from './apiClient'
import type { AdminOrder, OrderStatus } from '../types/admin'

export function fetchAdminOrders(): Promise<AdminOrder[]> {
  return apiRequest<AdminOrder[]>('/api/admin/orders', { auth: true })
}

export function updateOrderStatus(id: number, status: OrderStatus): Promise<AdminOrder> {
  return apiRequest<AdminOrder>(`/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    auth: true,
    body: { status },
  })
}