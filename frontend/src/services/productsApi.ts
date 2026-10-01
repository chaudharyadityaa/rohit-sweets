import { apiRequest } from './apiClient'
import type { Product } from '../types/product'

/** Shape returned by the backend. `image` here is `imageUrl` on the wire. */
type ProductApiResponse = {
  id: number
  name: string
  description: string | null
  price: number | null
  unit: string
  imageUrl: string | null
  category: string
  available: boolean
  featured: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

function mapProduct(dto: ProductApiResponse): Product {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    price: dto.price,
    unit: 'kg',
    image: dto.imageUrl,
    category: dto.category,
    available: dto.available,
    featured: dto.featured,
    active: dto.active,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}

export async function fetchStorefrontProducts(): Promise<Product[]> {
  const data = await apiRequest<ProductApiResponse[]>('/api/products')
  return data.map(mapProduct)
}

export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const dto = await apiRequest<ProductApiResponse>(`/api/products/${id}`)
    return mapProduct(dto)
  } catch {
    return null
  }
}