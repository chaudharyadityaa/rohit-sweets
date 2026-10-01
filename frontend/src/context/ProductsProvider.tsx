import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchStorefrontProducts } from '../services/productsApi'
import { ApiError } from '../services/apiClient'
import type { Product } from '../types/product'
import { ProductsContext, type ProductsContextValue } from './ProductsContext'

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const reload = useCallback(() => setReloadToken((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetchStorefrontProducts()
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : 'Could not load sweets. Please check your connection and try again.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const value = useMemo<ProductsContextValue>(
    () => ({ products, isLoading, error, reload }),
    [products, isLoading, error, reload],
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}