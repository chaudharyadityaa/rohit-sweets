export type CheckoutForm = {
  name: string
  phone: string
  address: string
  landmark: string
  instructions: string
  bandId: string | null
  inServiceArea: boolean
}

export type CheckoutField = keyof CheckoutForm
export type CheckoutErrors = Partial<Record<CheckoutField, string>>

export type OrderDraft = {
  customer: {
    name: string
    phone: string
    address: string
    landmark: string
    instructions: string
  }
  items: {
    productId: number
    name: string
    unit: string
    quantity: number
    unitPrice: number
    lineTotal: number
  }[]
  subtotal: number
  deliveryBand: string
  deliveryCharge: number
  total: number
  paymentMethod: 'CASH_ON_DELIVERY'
}