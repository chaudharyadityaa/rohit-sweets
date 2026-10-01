import { apiRequest } from './apiClient'

export type CreateOrderItemPayload = {
  productId: number
  quantity: number
}

export type CreateOrderPayload = {
  customerName: string
  phone: string
  address: string
  landmark: string
  instructions: string
  deliveryBandId: string
  inServiceArea: boolean
  items: CreateOrderItemPayload[]
}

export type OrderItemApiResponse = {
  productId: number
  name: string
  unit: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type OrderApiResponse = {
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
  status: string
  createdAt: string
  updatedAt: string
  items: OrderItemApiResponse[]
}

export function createOrder(payload: CreateOrderPayload): Promise<OrderApiResponse> {
  return apiRequest<OrderApiResponse>('/api/orders', { method: 'POST', body: payload })
}