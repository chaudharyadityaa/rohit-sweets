import type { Product } from '../types/product'

/** A product can be ordered only if it is available AND has a confirmed price. */
export function isOrderable(product: Product): boolean {
  return product.available && product.price !== null
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

/** Text shown in place of the price when it can't be shown. */
export function priceLabel(product: Product): string {
  return product.price === null
    ? 'Price coming soon'
    : `${formatPrice(product.price)} / ${product.unit}`
}

/** Label for the add-to-cart button, reflecting why it may be disabled. */
export function addButtonLabel(product: Product): string {
  if (!product.available) return 'Currently unavailable'
  if (product.price === null) return 'Price coming soon'
  return 'ADD TO CART'
}