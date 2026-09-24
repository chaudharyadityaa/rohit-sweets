import { useCart } from './useCart'

export function useCartCount(): number {
  return useCart().itemCount
}