import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { QUANTITY_RULES } from '../config/business'
import { useProducts } from '../hooks/useProducts'
import type { CartItem } from '../types/cart'
import { isOrderable } from '../utils/product'
import { clampQuantity } from '../utils/quantity'
import { CartContext, type CartContextValue } from './CartContext'

const STORAGE_KEY = 'rohit-sweets-cart-v1'

type Action =
  | { type: 'add'; productId: number; quantity: number }
  | { type: 'set'; productId: number; quantity: number }
  | { type: 'remove'; productId: number }
  | { type: 'clear' }

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'add': {
      const existing = state.find((i) => i.productId === action.productId)
      if (existing) {
        return state.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: clampQuantity(i.quantity + action.quantity) }
            : i,
        )
      }
      return [
        ...state,
        { productId: action.productId, quantity: clampQuantity(action.quantity) },
      ]
    }
    case 'set':
      return state.map((i) =>
        i.productId === action.productId
          ? { ...i, quantity: clampQuantity(action.quantity) }
          : i,
      )
    case 'remove':
      return state.filter((i) => i.productId !== action.productId)
    case 'clear':
      return []
  }
}

/** Reads the saved cart, ignoring anything malformed. Product existence is checked later,
 *  once live product data has loaded (see the cleanup effect below). */
function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((entry): CartItem[] => {
      if (typeof entry !== 'object' || entry === null) return []
      const { productId, quantity } = entry as Record<string, unknown>
      if (typeof productId !== 'number' || typeof quantity !== 'number') return []
      if (!Number.isFinite(quantity)) return []
      return [{ productId, quantity: clampQuantity(quantity) }]
    })
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts()
  const [items, dispatch] = useReducer(reducer, undefined, loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Storage full or blocked (e.g. private mode). The cart still works in memory.
    }
  }, [items])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.length,
      addItem: (productId, quantity = QUANTITY_RULES.min) => {
        const product = products.find((p) => p.id === productId)
        if (!product || !isOrderable(product)) return // never add unorderable items
        dispatch({ type: 'add', productId, quantity })
      },
      setQuantity: (productId, quantity) =>
        dispatch({ type: 'set', productId, quantity }),
      removeItem: (productId) => dispatch({ type: 'remove', productId }),
      clearCart: () => dispatch({ type: 'clear' }),
    }),
    [items, products],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}