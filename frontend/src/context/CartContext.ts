import { createContext } from 'react'
import type { CartItem } from '../types/cart'

export type CartContextValue = {
  items: CartItem[]
  /** number of distinct sweets in the cart (used for the navbar badge) */
  itemCount: number
  addItem: (productId: number, quantity?: number) => void
  setQuantity: (productId: number, quantity: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)