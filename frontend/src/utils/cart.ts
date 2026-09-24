import { products } from '../data/products'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'
import { isOrderable } from './product'

export type CartLine = {
  product: Product
  quantity: number
  lineTotal: number
  /** false if the product became unavailable or lost its price after being added */
  orderable: boolean
}

/** Joins stored cart items with current product data. Prices always come from here. */
export function buildCartLines(items: CartItem[]): CartLine[] {
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