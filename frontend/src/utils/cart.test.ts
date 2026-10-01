import { describe, expect, it } from 'vitest'
import { buildCartLines, cartSubtotal } from './cart'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

const STAMP = '2026-01-01T00:00:00.000Z'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: 'Ghewar',
    description: null,
    price: 400,
    unit: 'kg',
    image: null,
    category: 'Ghewar',
    available: true,
    featured: true,
    active: true,
    createdAt: STAMP,
    updatedAt: STAMP,
    ...overrides,
  }
}

describe('buildCartLines', () => {
  it('calculates line totals correctly for a priced, available product', () => {
    const products = [makeProduct({ price: 400 })]
    const items: CartItem[] = [{ productId: 1, quantity: 2 }]

    const lines = buildCartLines(items, products)

    expect(lines).toHaveLength(1)
    expect(lines[0].lineTotal).toBe(800)
    expect(lines[0].orderable).toBe(true)
  })

  it('marks a line as not orderable when the product has no price', () => {
    const products = [makeProduct({ price: null })]
    const items: CartItem[] = [{ productId: 1, quantity: 1 }]

    const lines = buildCartLines(items, products)

    expect(lines[0].orderable).toBe(false)
    expect(lines[0].lineTotal).toBe(0)
  })

  it('marks a line as not orderable when the product is unavailable', () => {
    const products = [makeProduct({ available: false })]
    const items: CartItem[] = [{ productId: 1, quantity: 1 }]

    const lines = buildCartLines(items, products)

    expect(lines[0].orderable).toBe(false)
  })

  it('silently drops cart items whose product no longer exists', () => {
    const products: Product[] = []
    const items: CartItem[] = [{ productId: 999, quantity: 1 }]

    const lines = buildCartLines(items, products)

    expect(lines).toHaveLength(0)
  })

  it('rounds line totals to 2 decimal places', () => {
    const products = [makeProduct({ price: 33.33 })]
    const items: CartItem[] = [{ productId: 1, quantity: 3 }]

    const lines = buildCartLines(items, products)

    expect(lines[0].lineTotal).toBe(99.99)
  })
})

describe('cartSubtotal', () => {
  it('sums line totals across multiple products', () => {
    const products = [
      makeProduct({ id: 1, price: 400 }),
      makeProduct({ id: 2, name: 'Barfi', price: 500 }),
    ]
    const items: CartItem[] = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ]

    const lines = buildCartLines(items, products)

    expect(cartSubtotal(lines)).toBe(1300)
  })

  it('excludes unorderable lines from the subtotal', () => {
    const products = [
      makeProduct({ id: 1, price: 400 }),
      makeProduct({ id: 2, name: 'Barfi', price: null }),
    ]
    const items: CartItem[] = [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 5 },
    ]

    const lines = buildCartLines(items, products)

    expect(cartSubtotal(lines)).toBe(400)
  })

  it('returns zero for an empty cart', () => {
    expect(cartSubtotal([])).toBe(0)
  })
})