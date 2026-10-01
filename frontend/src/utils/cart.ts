import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'
import { isOrderable } from './product'

export type CartLine = {
  product: Product
  quantity: number
  lineTotal: number
  orderable: boolean
}

/** Joins stored cart items with live product data. Prices always come from `products`. */
export function buildCartLines(items: CartItem[], products: Product[]): CartLine[] {
  return items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return []
    const orderable = isOrderable(product)
    const lineTotal = orderable
      ? Math.round((product.price ?? 0) * item.quantity * 100) / 100
      : 0
    return [{ product, quantity: item.quantity, lineTotal, orderable }]
  })
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.lineTotal, 0)
}