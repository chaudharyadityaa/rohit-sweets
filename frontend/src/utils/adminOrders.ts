import type { AdminOrder, OrderStatus } from '../types/admin'

export function isToday(isoDate: string): boolean {
  const date = new Date(isoDate)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export function countByStatus(orders: AdminOrder[], status: OrderStatus): number {
  return orders.filter((o) => o.status === status).length
}

export function todaysOrders(orders: AdminOrder[]): AdminOrder[] {
  return orders.filter((o) => isToday(o.createdAt))
}

/** Sales = total value of today's orders, excluding cancelled ones. */
export function todaysSales(orders: AdminOrder[]): number {
  return todaysOrders(orders)
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0)
}