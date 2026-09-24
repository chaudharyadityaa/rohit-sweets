import type { OrderDraft } from './checkout'

export type PlacedOrder = {
  orderNumber: string // TEMPORARY until the backend issues real numbers
  createdAt: string
  draft: OrderDraft
}