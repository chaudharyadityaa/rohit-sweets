export type ProductCategory =
  | 'Ghewar'
  | 'Barfi'
  | 'Ladoo'
  | 'Milk Sweets'
  | 'Syrup Sweets'
  | 'Other'

export type Product = {
  id: number
  name: string
  description: string | null
  price: number | null
  unit: 'kg'
  image: string | null
  category: ProductCategory
  available: boolean
  featured: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}