export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'

export type AdminOrderItem = {
  productId: number
  name: string
  unit: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type AdminOrder = {
  id: number
  orderNumber: string
  customerName: string
  phone: string
  address: string
  landmark: string
  instructions: string | null
  deliveryBand: string
  subtotal: number
  deliveryCharge: number
  total: number
  paymentMethod: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  items: AdminOrderItem[]
}