import type { PlacedOrder } from '../types/order'

// sessionStorage: cleared automatically when the browser tab is closed.
const STORAGE_KEY = 'rohit-sweets-last-order-v1'

export function saveLastOrder(order: PlacedOrder): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order))
  } catch {
    // Storage blocked. The success page still receives the order via router state.
  }
}

export function loadLastOrder(): PlacedOrder | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const order = JSON.parse(raw) as Partial<PlacedOrder> | null
    if (
      !order ||
      typeof order.orderNumber !== 'string' ||
      !order.draft ||
      !order.draft.customer ||
      !Array.isArray(order.draft.items) ||
      typeof order.draft.total !== 'number'
    ) {
      return null
    }
    return order as PlacedOrder
  } catch {
    return null
  }
}

export function clearLastOrder(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}