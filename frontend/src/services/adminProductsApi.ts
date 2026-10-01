import { apiRequest } from './apiClient'
import type { Product } from '../types/product'

export type ProductPayload = {
  name: string
  description: string | null
  price: number | null
  unit: string
  imageUrl: string | null
  category: string
  featured: boolean
}

/** Admin list includes inactive (soft-deleted) products too, unlike the public endpoint. */
export function fetchAllProductsForAdmin(): Promise<Product[]> {
  return apiRequest<Product[]>('/api/products?includeInactive=true', { auth: true })
}

export function createProduct(payload: ProductPayload): Promise<Product> {
  return apiRequest<Product>('/api/products', { method: 'POST', auth: true, body: payload })
}

export function updateProduct(id: number, payload: ProductPayload): Promise<Product> {
  return apiRequest<Product>(`/api/products/${id}`, { method: 'PUT', auth: true, body: payload })
}

export function setProductAvailability(id: number, available: boolean): Promise<Product> {
  return apiRequest<Product>(`/api/products/${id}/availability`, {
    method: 'PATCH',
    auth: true,
    body: { available },
  })
}

export function deleteProduct(id: number): Promise<void> {
  return apiRequest<void>(`/api/products/${id}`, { method: 'DELETE', auth: true })
}

export function reactivateProduct(id: number): Promise<Product> {
  return apiRequest<Product>(`/api/products/${id}/reactivate`, { method: 'PATCH', auth: true })
}