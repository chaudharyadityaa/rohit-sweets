import { useEffect, useRef, useState } from 'react'
import { QUANTITY_RULES } from '../config/business'
import type { Product } from '../types/product'
import { useCart } from './useCart'

/** Adds a product to the cart and reports `added` for 1.5s so buttons can confirm. */
export function useAddToCart(product: Product) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function add(quantity: number = QUANTITY_RULES.min) {
    addItem(product.id, quantity)
    setAdded(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAdded(false), 1500)
  }

  return { add, added }
}